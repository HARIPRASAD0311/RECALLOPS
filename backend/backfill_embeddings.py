from database import SessionLocal
from models import Incident
from embeddings import embed_text

db = SessionLocal()
for inc in db.query(Incident).filter(Incident.embedding.is_(None)):
    inc.embedding = embed_text(f"{inc.title} {inc.root_cause} {inc.fix}")
db.commit()
db.close()
print("Backfilled.")