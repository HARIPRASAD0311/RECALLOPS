from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, Integer, String, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship

from database import Base

def utc_now():
    return datetime.now(timezone.utc)

class Incident(Base):
    __tablename__ = "incidents"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    title = Column(String, nullable=False)
    service = Column(String, index=True)
    type = Column(String, index=True)
    severity = Column(String, default="medium")
    description = Column(Text, default="")
    root_cause = Column(Text, default="")
    fix = Column(Text, default="")
    resolved_by = Column(String, default="")
    mttr_minutes = Column(Integer, default=0)
    baseline_minutes = Column(Integer, default=0)
    created_at = Column(DateTime, default=utc_now)
    embedding = Column(JSON, nullable=True)

    tags = relationship("Tag", back_populates="incident", cascade="all, delete-orphan")
    runbooks = relationship("Runbook", back_populates="incident", cascade="all, delete-orphan")

class Tag(Base):
    __tablename__ = "tags"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    incident_id = Column(Integer, ForeignKey("incidents.id"))
    incident = relationship("Incident", back_populates="tags")

class Runbook(Base):
    __tablename__ = "runbooks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    outcome = Column(String, nullable=False)
    incident_id = Column(Integer, ForeignKey("incidents.id"))
    incident = relationship("Incident", back_populates="runbooks")