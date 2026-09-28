from pydantic import BaseModel


def fmt_minutes(m: int) -> str:
    m = int(m or 0)
    return f"{m}m" if m < 60 else f"{m // 60}h {m % 60}m"


class RunbookOut(BaseModel):
    title: str
    outcome: str


class IncidentOut(BaseModel):
    id: str                      # frontend's inc.id, e.g. "INC-2041"
    title: str
    service: str
    type: str
    severity: str
    date: str
    resolvedBy: str
    mttr: str
    rootCause: str
    fix: str
    tags: list[str]
    runbooks: list[RunbookOut]
    match: str | None = None     # filled by search later


class RunbookIn(BaseModel):
    title: str
    outcome: str = "success"


class IncidentCreate(BaseModel):
    title: str
    service: str
    type: str = "General"
    severity: str = "medium"
    description: str = ""
    root_cause: str = ""
    fix: str = ""
    resolved_by: str = ""
    mttr_minutes: int = 0
    baseline_minutes: int = 0
    tags: list[str] = []
    runbooks: list[RunbookIn] = []


class MetricOut(BaseModel):
    title: str
    icon: str
    change: str
    value: str
    unit: str
    subtext: str


class AnalyticsRowOut(BaseModel):
    id: str
    service: str
    type: str
    mttr: str
    baseline: str
    savings: str
    reusedRunbook: str = "-"

class StatsOut(BaseModel):
    metrics: list[MetricOut]
    recentIncidentsAnalytics: list[AnalyticsRowOut]
    serviceCount: str
    defaultService: str

class RootCauseOut(BaseModel):
    ids: list[str]
    match: str
    text: str

class ProvenFixOut(BaseModel):
    title: str
    detail: str
    mttr: str

class AntiPatternOut(BaseModel):
    title: str
    detail: str

class PlanStep1Out(BaseModel):
    title: str
    command: str

class PlanStep2Out(BaseModel):
    title: str
    verified: str
    version: str
    dispatchRef: str

class PlanOut(BaseModel):
    estimatedResolution: str
    baseline: str
    step1: PlanStep1Out
    step2: PlanStep2Out
    antiPattern: str

class BriefLLMOut(BaseModel):
    rootCause: RootCauseOut
    provenFix: ProvenFixOut
    antiPattern: AntiPatternOut
    plan: PlanOut


def incident_to_out(inc, match: str | None = None) -> IncidentOut:
    return IncidentOut(
        id=inc.code,
        title=inc.title,
        service=inc.service or "",
        type=inc.type or "",
        severity=inc.severity or "",
        date=inc.created_at.strftime("%b %d, %Y"),
        resolvedBy=inc.resolved_by or "",
        mttr=fmt_minutes(inc.mttr_minutes),
        rootCause=inc.root_cause or "",
        fix=inc.fix or "",
        tags=[t.name for t in inc.tags],
        runbooks=[RunbookOut(title=r.title, outcome=r.outcome) for r in inc.runbooks],
        match=match,
    )