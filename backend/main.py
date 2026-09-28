from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import engine, Base
import models
from routers import incidents, stats, search, brief, deploy_risk

Base.metadata.create_all(bind=engine)
app = FastAPI(title=settings.app_name)

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
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app", 
        host="127.0.0.1", 
        port=8000, 
        reload=True, 
        reload_excludes=["venv"]
    )