from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Incident, Runbook, Tag
from schemas import IncidentCreate, IncidentOut, incident_to_out
from embeddings import embed_text
router = APIRouter(prefix="/incidents", tags=["incidents"])


@router.get("", response_model=list[IncidentOut])
def list_incidents(service: str | None = None, db: Session = Depends(get_db)):
    q = db.query(Incident).order_by(Incident.created_at.desc())
    if service:
        q = q.filter(Incident.service == service)
    return [incident_to_out(i) for i in q.all()]


@router.get("/{code}", response_model=IncidentOut)
def get_incident(code: str, db: Session = Depends(get_db)):
    inc = db.query(Incident).filter(Incident.code == code).first()
    if not inc:
        raise HTTPException(404, "Incident not found")
    return incident_to_out(inc)


@router.post("", response_model=IncidentOut, status_code=201)
def create_incident(body: IncidentCreate, db: Session = Depends(get_db)):
    count = db.query(Incident).count()
    inc = Incident(
        code=f"INC-{3000 + count + 1}",
        title=body.title, service=body.service, type=body.type,
        severity=body.severity, description=body.description,
        root_cause=body.root_cause, fix=body.fix, resolved_by=body.resolved_by,
        mttr_minutes=body.mttr_minutes, baseline_minutes=body.baseline_minutes,
        tags=[Tag(name=t) for t in body.tags],
        runbooks=[Runbook(title=r.title, outcome=r.outcome) for r in body.runbooks],
    )
    inc.embedding = embed_text(f"{body.title} {body.root_cause} {body.fix} {' '.join(body.tags)}")
    db.add(inc)
    db.commit()
    db.refresh(inc)
    return incident_to_out(inc)