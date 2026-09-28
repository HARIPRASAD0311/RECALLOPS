import numpy as np
from sentence_transformers import SentenceTransformer

from config import settings

_model = SentenceTransformer(settings.embedding_model)


def embed_text(text: str) -> list[float]:
    return _model.encode(text, normalize_embeddings=True).tolist()


def cosine_similarity(a: list[float], b: list[float]) -> float:
    a, b = np.array(a), np.array(b)
    if not a.any() or not b.any():
        return 0.0
    return float(np.dot(a, b))  # already normalized, so dot == cosine


def rank_by_similarity(query_vec: list[float], candidates: list[tuple[int, list[float]]], top_k: int = 5):
    """candidates: list of (incident_id, embedding). Returns [(incident_id, score), ...] sorted desc."""
    scored = [(cid, cosine_similarity(query_vec, vec)) for cid, vec in candidates if vec]
    scored.sort(key=lambda x: x[1], reverse=True)
    return scored[:top_k]