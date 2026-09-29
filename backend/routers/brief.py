import logging
import time
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database import get_db
from llm import generate_brief
from routers.search import _search
from schemas import BriefLLMOut, IncidentOut

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/brief", tags=["brief"])


@router.get("")
def get_brief(
    query: str = Query(..., description="Incident query, e.g. service name or symptom"),
    db: Session = Depends(get_db)
):
    # 1. Search for matching historical patterns
    matches: list[IncidentOut] = _search(db, query, top_k=5)

    if not matches:
        return {
            "queryText": query,
            "matchCount": 0,
            "confidence": "0%",
            "generatedIn": "0.0s",
            "graphName": "RecallOps Memory Graph",
            "engineName": "Llama 3.3 70B (Groq)",
            "slackChannel": "#sre-incidents",
            "brief": {
                "rootCause": {"ids": [], "match": "", "text": "No similar incidents found."},
                "provenFix": {"title": "", "detail": "", "mttr": ""},
                "antiPattern": {"title": "", "detail": ""},
            },
            "plan": {
                "estimatedResolution": "", "baseline": "",
                "step1": {"title": "", "command": ""},
                "step2": {"title": "", "verified": "", "version": "", "dispatchRef": ""},
                "antiPattern": "",
            },
            "incidents": [],
        }

    match_dicts = [m.model_dump() for m in matches]
    
    # 2. Track real execution latency
    start_time = time.time()
    
    try:
        # Try utilizing LLM generation and running schema validation shape check
        raw = generate_brief(query, match_dicts)
        validated = BriefLLMOut(**raw)
        llm_out = validated.model_dump()
        engine_name = "Llama 3.3 70B (Groq)"
    except Exception as e:
        logger.warning(f"LLM brief generation failed, using fallback: {e}")
        engine_name = "Template fallback (LLM unavailable)"
        
        top = matches[0]
        # Cleanly convert standard values safely handling attribute edge cases
        mttr_val = str(getattr(top, 'mttr_minutes', '')) or str(getattr(top, 'mttr', ''))
        base_val = str(getattr(top, 'baseline_minutes', mttr_val)) or str(getattr(top, 'baseline', mttr_val))
        
        llm_out = {
            "rootCause": {
                "ids": [getattr(m, 'id', getattr(m, 'code', '')) for m in matches[:3]],
                "match": getattr(top, 'match', "0%"),
                "text": getattr(top, 'rootCause', "No root cause on file for the closest match."),
            },
            "provenFix": {
                "title": getattr(top, 'title', 'Fallback Plan'),
                "detail": getattr(top, 'fix', "No fix on file."),
                "mttr": mttr_val,
            },
            "antiPattern": {
                "title": "Review before reuse",
                "detail": "This is a template fallback — verify against the matched incident before acting.",
            },
            "plan": {
                "estimatedResolution": mttr_val,
                "baseline": base_val,
                "step1": {"title": "Review matched incident", "command": f"GET /api/incidents/{getattr(top, 'id', '')}"},
                "step2": {"title": "Apply proven fix", "verified": "manual", "version": "", "dispatchRef": str(getattr(top, 'id', ''))},
                "antiPattern": "Avoid repeating the anti-pattern noted in the matched incident.",
            },
        }

    elapsed = f"{time.time() - start_time:.1f}s"
    top_score = getattr(matches[0], 'match', "0%")

    # 3. Deliver clean finalized unified payload response
    return {
        "queryText": query,
        "matchCount": len(matches),
        "confidence": top_score,
        "generatedIn": elapsed,
        "graphName": "RecallOps Memory Graph",
        "engineName": engine_name,
        "slackChannel": "#sre-incidents",
        "brief": {
            "rootCause": llm_out["rootCause"],
            "provenFix": llm_out["provenFix"],
            "antiPattern": llm_out["antiPattern"],
        },
        "plan": llm_out["plan"],
        "incidents": match_dicts,
    }
