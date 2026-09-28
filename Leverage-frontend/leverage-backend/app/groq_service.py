"""
Optional convenience layer: lets an employee paste in a messy, freeform
paragraph about how a negotiation went, instead of filling out every
structured field by hand. This is NOT where the product's intelligence
lives — that's entirely Hindsight's retain/recall/reflect. Groq here is
just a form-filling assistant.

Recommended free-tier Groq models (openai/gpt-oss-120b, qwen/qwen3-32b)
can flake on function calling, so every call here is retried before falling back.
"""
import json
import re

from groq import Groq
from tenacity import retry, stop_after_attempt, wait_exponential

from app.config import settings

_client = Groq(api_key=settings.GROQ_API_KEY) if settings.GROQ_API_KEY else None

_EXTRACTION_PROMPT = """\
Extract structured fields from this freeform account of a vendor negotiation.
Return ONLY a JSON object with exactly these fields (use null or [] if not
mentioned — never guess or invent numbers):

{
  "discount_pct": <integer or null>,
  "payment_terms_days": <integer or null>,
  "flexible_terms": [<short strings>],
  "firm_terms": [<short strings>],
  "tactic": <string or null>,
  "tactic_worked": <true, false, or null>
}

Negotiation notes:
\"\"\"{notes}\"\"\"
"""


@retry(stop=stop_after_attempt(2), wait=wait_exponential(multiplier=1, min=1, max=4))
def _call_groq(notes: str) -> str:
    completion = _client.chat.completions.create(
        model=settings.GROQ_MODEL,
        messages=[{"role": "user", "content": _EXTRACTION_PROMPT.format(notes=notes)}],
        temperature=0.1,
    )
    return completion.choices[0].message.content


def parse_freeform_notes(notes: str) -> dict:
    """Returns a best-effort structured dict. Falls back to an empty
    shape (never raises) so a flaky LLM call never blocks someone from
    still submitting the form manually on the frontend."""
    if _client is None:
        return _empty_result()

    try:
        raw = _call_groq(notes)
    except Exception:
        return _empty_result()

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", raw, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except json.JSONDecodeError:
                pass
    return _empty_result()


def _empty_result() -> dict:
    return {
        "discount_pct": None,
        "payment_terms_days": None,
        "flexible_terms": [],
        "firm_terms": [],
        "tactic": None,
        "tactic_worked": None,
    }
