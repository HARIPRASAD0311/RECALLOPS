from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from llm import assess_deploy_risk
from routers.search import _search

router = APIRouter(prefix="/deploy-risk", tags=["deploy-risk"])


class DeployRiskRequest(BaseModel):
    service: str
    change_description: str


class DeployRiskResponse(BaseModel):
    riskLevel: str          # "low" | "medium" | "high"
    reasoning: str
    relatedIncidentIds: list[str]
    recommendation: str
    matchCount: int


@router.post("", response_model=DeployRiskResponse)
def deploy_risk(body: DeployRiskRequest, db: Session = Depends(get_db)):
    query = f"{body.service} {body.change_description}"
    matches = _search(db, query, top_k=5)

    if not matches:
        return DeployRiskResponse(
            riskLevel="low",
            reasoning="No similar past incidents found for this service or change.",
            relatedIncidentIds=[],
            recommendation="Proceed with standard deploy checks.",
            matchCount=0,
        )

    match_dicts = [m.model_dump() for m in matches]

    try:
        llm_out = assess_deploy_risk(body.service, body.change_description, match_dicts)
    except Exception:
        # LLM fallback: derive a rough risk level from match strength
        top_score = int((matches[0].match or "0%").rstrip("%"))
        risk = "high" if top_score >= 70 else "medium" if top_score >= 40 else "low"
        llm_out = {
            "riskLevel": risk,
            "reasoning": f"Based on similarity to past incidents (top match {matches[0].match}), "
                         f"this change resembles prior '{matches[0].type}' incidents on {matches[0].service}.",
            "relatedIncidentIds": [m.id for m in matches[:3]],
            "recommendation": "Review related incidents below before deploying.",
        }

    return DeployRiskResponse(
        riskLevel=llm_out.get("riskLevel", "medium"),
        reasoning=llm_out.get("reasoning", ""),
        relatedIncidentIds=llm_out.get("relatedIncidentIds", []),
        recommendation=llm_out.get("recommendation", ""),
        matchCount=len(matches),
    )