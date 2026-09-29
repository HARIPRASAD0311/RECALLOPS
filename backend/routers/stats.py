from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Incident
from schemas import AnalyticsRowOut, MetricOut, StatsOut, fmt_minutes

router = APIRouter(prefix="/stats", tags=["stats"])

@router.get("", response_model=StatsOut)
def get_stats(db: Session = Depends(get_db)):
    incs = db.query(Incident).order_by(Incident.created_at.desc()).all()
    n = len(incs)
    if n == 0:
        return StatsOut(metrics=[], recentIncidentsAnalytics=[], serviceCount="0", defaultService="")

    avg_mttr = sum(i.mttr_minutes for i in incs) / n
    avg_base = sum(i.baseline_minutes for i in incs) / n
    improvement = round((1 - avg_mttr / avg_base) * 100) if avg_base else 0
    fastest = min(incs, key=lambda i: i.mttr_minutes)
    services = sorted({i.service for i in incs})

    total_saved_mins = sum(max(0, i.baseline_minutes - i.mttr_minutes) for i in incs)
    est_savings_k = round((total_saved_mins * 1.8))

    metrics = [
        MetricOut(title="Avg MTTR", icon="trending_down", change=f"-{improvement}%",
                  value=str(round(avg_mttr)), unit="min", subtext=f"vs {round(avg_base)}m baseline"),
        MetricOut(title="Total Incidents", icon="database", change="Active",
                  value=str(n), unit="", subtext=f"across {len(services)} services"),
        MetricOut(title="Fastest Resolution", icon="bolt", change="Top",
                  value=str(fastest.mttr_minutes), unit="min", subtext=f"{fastest.code} ({fastest.service})"),
        MetricOut(title="Avoided Downtime Savings", icon="savings", change="Est.",
                  value=f"${est_savings_k}", unit="k", subtext=f"Saved {total_saved_mins}m total incident time"),
    ]

    rows = []
    for i in incs[:8]:
        saved = i.baseline_minutes - i.mttr_minutes
        winning = next((r.title for r in i.runbooks if r.outcome == "success"), "-")
        rows.append(AnalyticsRowOut(
            id=i.code, service=i.service, type=i.type,
            mttr=fmt_minutes(i.mttr_minutes), baseline=fmt_minutes(i.baseline_minutes),
            savings=f"{saved}m saved" if saved > 0 else "-",
            reusedRunbook=winning,
        ))

    return StatsOut(metrics=metrics, recentIncidentsAnalytics=rows, serviceCount=str(len(services)), defaultService=services[0])
