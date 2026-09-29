from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from config import settings
from database import engine, Base, SessionLocal
import models
from routers import incidents, stats, search, brief, deploy_risk
from seed_data import run as seed_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database schema is created
    Base.metadata.create_all(bind=engine)
    # Auto-seed database if empty
    db: Session = SessionLocal()
    try:
        count = db.query(models.Incident).count()
        if count == 0:
            print("[RecallOps API] Initializing empty database with seed incidents...")
            seed_database()
        else:
            print(f"[RecallOps API] Database ready with {count} indexed incidents.")
    finally:
        db.close()
    yield


app = FastAPI(
    title=settings.app_name,
    version="2.0.0",
    description="RecallOps SRE Incident Memory & Vector Graph Intelligence API",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(incidents.router, prefix="/api")
app.include_router(stats.router, prefix="/api")
app.include_router(search.router, prefix="/api")
app.include_router(brief.router, prefix="/api")
app.include_router(deploy_risk.router, prefix="/api")


@app.get("/api/health")
def health_check():
    db: Session = SessionLocal()
    try:
        count = db.query(models.Incident).count()
        return {
            "status": "ok",
            "app": settings.app_name,
            "version": "2.0.0",
            "incidentCount": count,
            "engine": "RecallOps SRE Memory Graph"
        }
    except Exception as e:
        return {
            "status": "degraded",
            "error": str(e)
        }
    finally:
        db.close()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )