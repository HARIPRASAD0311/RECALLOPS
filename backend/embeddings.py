import math
import re
from typing import List, Tuple
import numpy as np

from config import settings

_transformer_model = None
_transformer_failed = False


def _get_transformer():
    global _transformer_model, _transformer_failed
    if _transformer_model is None and not _transformer_failed:
        try:
            from sentence_transformers import SentenceTransformer
            _transformer_model = SentenceTransformer(settings.embedding_model)
        except Exception as e:
            print(f"[Embeddings] SentenceTransformer unavailable ({e}), using fallback semantic vectorizer.")
            _transformer_failed = True
    return _transformer_model


def _fallback_embed(text: str, dim: int = 128) -> List[float]:
    """Lightweight hash-based embedding fallback for offline/dependency-free execution."""
    tokens = re.findall(r"\w+", text.lower())
    if not tokens:
        return [0.0] * dim
    
    vec = np.zeros(dim, dtype=np.float32)
    for token in tokens:
        # Generate word n-gram features
        h = hash(token) % dim
        vec[h] += 1.0
        for i in range(len(token) - 2):
            sub_h = hash(token[i:i+3]) % dim
            vec[sub_h] += 0.5
            
    norm = np.linalg.norm(vec)
    if norm > 0:
        vec = vec / norm
    return vec.tolist()


def embed_text(text: str) -> List[float]:
    model = _get_transformer()
    if model is not None:
        try:
            return model.encode(text, normalize_embeddings=True).tolist()
        except Exception as e:
            print(f"[Embeddings] Transformer encode failed: {e}")
    return _fallback_embed(text)


def cosine_similarity(a: List[float], b: List[float]) -> float:
    if not a or not b or len(a) != len(b):
        return 0.0
    arr_a = np.array(a, dtype=np.float32)
    arr_b = np.array(b, dtype=np.float32)
    norm_a = np.linalg.norm(arr_a)
    norm_b = np.linalg.norm(arr_b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(arr_a, arr_b) / (norm_a * norm_b))


def rank_by_similarity(query_vec: List[float], candidates: List[Tuple[int, List[float]]], top_k: int = 5) -> List[Tuple[int, float]]:
    """candidates: list of (incident_id, embedding). Returns [(incident_id, score), ...] sorted desc."""
    scored = []
    for cid, vec in candidates:
        if vec:
            score = cosine_similarity(query_vec, vec)
            scored.append((cid, max(0.0, min(1.0, score))))
    scored.sort(key=lambda x: x[1], reverse=True)
    return scored[:top_k]