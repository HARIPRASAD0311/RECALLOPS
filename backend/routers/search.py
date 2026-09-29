from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from embeddings import embed_text, rank_by_similarity
from models import Incident
from schemas import IncidentOut, incident_to_out

router = APIRouter(prefix="/search", tags=["search"])


class SearchRequest(BaseModel):
    query: str
    top_k: int = 5


class SearchResponse(BaseModel):
    query: str
    matchCount: int
    results: list[IncidentOut]


def _search(db: Session, query: str, top_k: int = 5):
    incidents = db.query(Incident).filter(Incident.embedding.isnot(None)).all()
    if not incidents:
        return []

    query_vec = embed_text(query)
    candidates = [(inc.id, inc.embedding) for inc in incidents]
    ranked = rank_by_similarity(query_vec, candidates, top_k=top_k)

    by_id = {inc.id: inc for inc in incidents}
    results = []
    for inc_id, score in ranked:
        inc = by_id[inc_id]
        pct = f"{round(score * 100)}%"
        results.append(incident_to_out(inc, match=pct))
    return results


@router.post("", response_model=SearchResponse)
def search_incidents(body: SearchRequest, db: Session = Depends(get_db)):
    results = _search(db, body.query, body.top_k)
    return SearchResponse(query=body.query, matchCount=len(results), results=results)