import json
import logging
from typing import List, Dict, Any
from config import settings

logger = logging.getLogger(__name__)

def _get_groq_client():
    if not settings.groq_api_key or settings.groq_api_key.strip() == "":
        raise ValueError("GROQ_API_KEY is not configured")
    from groq import Groq
    return Groq(api_key=settings.groq_api_key)


def _chat_json(system_prompt: str, user_prompt: str) -> dict:
    client = _get_groq_client()
    resp = client.chat.completions.create(
        model=settings.groq_model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.3,
        response_format={"type": "json_object"},
    )
    raw = resp.choices[0].message.content
    return json.loads(raw)


def generate_brief(query: str, matched_incidents: List[Dict[str, Any]]) -> dict:
    """matched_incidents: list of dicts from incident_to_out(), the top-k search matches."""
    system_prompt = (
        "You are an SRE incident-memory assistant. Given a query and a list of "
        "similar past incidents, respond ONLY with a JSON object matching exactly "
        "this shape, with no extra keys and no prose outside the JSON:\n"
        "{\n"
        '  "rootCause": {"ids": [string], "match": string, "text": string},\n'
        '  "provenFix": {"title": string, "detail": string, "mttr": string},\n'
        '  "antiPattern": {"title": string, "detail": string},\n'
        '  "plan": {\n'
        '    "estimatedResolution": string, "baseline": string,\n'
        '    "step1": {"title": string, "command": string},\n'
        '    "step2": {"title": string, "verified": string, "version": string, "dispatchRef": string},\n'
        '    "antiPattern": string\n'
        '  }\n'
        "}"
    )
    user_prompt = json.dumps({"query": query, "similar_incidents": matched_incidents})
    return _chat_json(system_prompt, user_prompt)


def assess_deploy_risk(service: str, change_description: str, matched_incidents: List[Dict[str, Any]]) -> dict:
    system_prompt = (
        "You are a deploy-risk assessor for an SRE team. Given a planned change and "
        "similar past incidents, respond ONLY with JSON:\n"
        '{"riskLevel": "low"|"medium"|"high", "reasoning": string, '
        '"relatedIncidentIds": [string], "recommendation": string}'
    )
    user_prompt = json.dumps({
        "service": service,
        "change": change_description,
        "similar_incidents": matched_incidents,
    })
    return _chat_json(system_prompt, user_prompt)