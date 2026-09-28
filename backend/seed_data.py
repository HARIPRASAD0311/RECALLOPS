from datetime import datetime, timedelta

from database import Base, SessionLocal, engine
from models import Incident, Runbook, Tag
from embeddings import embed_text

Base.metadata.create_all(bind=engine)

# (code, title, service, type, severity, resolved_by, mttr, baseline, root_cause, fix, tags, runbooks)
SEED = [
    ("INC-2041", "Checkout API latency spike", "payments-api", "Latency", "high", "Aarav",
     14, 45, "Connection pool exhausted after a traffic surge.",
     "Increased pool size and added a circuit breaker.",
     ["latency", "db-pool"], [("Scale DB pool", "success"), ("Restart pods", "warning")]),
    ("INC-2042", "Auth service OOM kills", "auth-service", "OOM", "critical", "Meera",
     22, 60, "Memory leak in session cache with no TTL.",
     "Added TTL eviction and raised memory limit.",
     ["memory", "cache"], [("Rollback to v2.3", "success")]),
    ("INC-2043", "Search indexing stalled", "search-svc", "Queue backlog", "medium", "Rohan",
     35, 50, "Consumer crashed on a malformed message, blocking the queue.",
     "Added dead-letter queue and input validation.",
     ["queue", "kafka"], [("Purge poison message", "success"), ("Restart consumer", "warning")]),
    ("INC-2044", "Payment gateway 5xx errors", "payments-api", "Dependency", "critical", "Aarav",
     18, 55, "Third-party gateway timeout, no retry with backoff.",
     "Added retries with exponential backoff and a fallback provider.",
     ["timeout", "third-party"], [("Failover provider", "success")]),
    ("INC-2045", "Deploy caused config drift", "gateway", "Deploy", "high", "Priya",
     27, 40, "Env var missing in the new deploy manifest.",
     "Restored config and added a pre-deploy config check.",
     ["deploy", "config"], [("Rollback deploy", "success"), ("Hotfix config", "failed")]),
    ("INC-2046", "Disk full on log node", "logging", "Resource", "medium", "Rohan",
     12, 30, "Log rotation disabled after an agent upgrade.",
     "Re-enabled rotation and added disk alerts at 80%.",
     ["disk", "logging"], [("Rotate and purge logs", "success")]),
    ("INC-2047", "Slow dashboard queries", "analytics-db", "Latency", "medium", "Meera",
     40, 90, "Missing index on a high-volume events table.",
     "Added a composite index and query timeout.",
     ["database", "index"], [("Add index", "success")]),
    ("INC-2048", "Notification delays", "notify-svc", "Queue backlog", "low", "Priya",
     20, 35, "Worker autoscaling threshold too high.",
     "Lowered the scaling threshold.",
     ["queue", "autoscaling"], [("Scale workers", "success")]),
    ("INC-2049", "TLS cert expired", "gateway", "Certificate", "critical", "Aarav",
     9, 40, "Cert auto-renewal job failed silently.",
     "Renewed manually and added expiry monitoring.",
     ["tls", "monitoring"], [("Renew certificate", "success")]),
    ("INC-2050", "Cache stampede on homepage", "web-frontend", "Latency", "high", "Rohan",
     25, 55, "Cache keys expired simultaneously.",
     "Added jittered TTLs and request coalescing.",
     ["cache", "latency"], [("Warm cache", "success"), ("Flush cache", "failed")]),
]


def run():
    db = SessionLocal()
    if db.query(Incident).count() > 0:
        print("DB already seeded, skipping.")
        return
    now = datetime.utcnow()
    for i, (code, title, svc, typ, sev, by, mttr, base, rc, fix, tags, rbs) in enumerate(SEED):
        inc = Incident(
            code=code, title=title, service=svc, type=typ, severity=sev,
            description=title, root_cause=rc, fix=fix, resolved_by=by,
            mttr_minutes=mttr, baseline_minutes=base,
            created_at=now - timedelta(days=i * 3),
            tags=[Tag(name=t) for t in tags],
            runbooks=[Runbook(title=t, outcome=o) for t, o in rbs],
            embedding=embed_text(title + " " + rc + " " + fix)
        )
        db.add(inc)
    db.commit()
    print(f"Seeded {len(SEED)} incidents.")


if __name__ == "__main__":
    run()