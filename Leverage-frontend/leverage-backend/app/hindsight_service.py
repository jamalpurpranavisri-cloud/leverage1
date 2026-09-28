"""
Hindsight integration layer — Person A (Memory Engine).

THE CENTRAL DESIGN RULE OF THIS PROJECT:
Memory is keyed PER VENDOR, not per employee. Every employee who logs a
negotiation with "Microsoft" writes into the SAME bank (vendor:microsoft).
Anyone — including someone who has never touched that vendor before —
reads from that same shared bank. This is what makes Leverage cross-user
memory rather than the much more common "agent remembers one user's own
history" pattern.

Uses the official hindsight-client SDK:
    pip install hindsight-client
Docs: https://hindsight.vectorize.io/
Repo: https://github.com/vectorize-io/hindsight
"""
import asyncio
import concurrent.futures
import json
import logging
import re
from typing import Any, Optional

from hindsight_client import Hindsight
from slugify import slugify
from tenacity import retry, stop_after_attempt, wait_exponential

from app.config import settings

logger = logging.getLogger("leverage.memory")


def get_client() -> Hindsight:
    """Creates a Hindsight client instance configured from settings."""
    return Hindsight(
        base_url=settings.HINDSIGHT_BASE_URL,
        api_key=settings.HINDSIGHT_API_KEY,
    )


def _run_coro_sync(coro):
    """Safely runs an async coroutine synchronously.
    If an asyncio event loop is already running in the current thread (e.g., inside FastAPI),
    it executes the coroutine in a separate worker thread to prevent
    'RuntimeError: This event loop is already running'.
    """
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = None

    if loop and loop.is_running():
        with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
            return executor.submit(asyncio.run, coro).result()
    else:
        return asyncio.run(coro)


def vendor_bank_id(vendor: str) -> str:
    """Deterministic bank id per vendor, e.g. 'Microsoft' -> 'vendor-microsoft'.
    Same vendor name always resolves to the same bank, regardless of who
    is writing to or reading from it."""
    clean_vendor = vendor.strip() if vendor else "unknown"
    return f"vendor-{slugify(clean_vendor)}"


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=1, max=6))
async def _aensure_bank(bank_id: str, vendor: str) -> None:
    """Async: Hindsight Cloud creates banks lazily on first retain in most setups,
    but we call create_bank defensively so a first-time vendor doesn't
    silently fail. Safe to call repeatedly — no-ops if it already exists."""
    client = get_client()
    try:
        try:
            await client.acreate_bank(bank_id=bank_id, name=f"Vendor memory: {vendor}")
        except Exception as e:
            if "already exists" not in str(e).lower() and "409" not in str(e):
                raise
    finally:
        await client.aclose()


def _ensure_bank(bank_id: str, vendor: str) -> None:
    """Sync wrapper for _aensure_bank."""
    _run_coro_sync(_aensure_bank(bank_id, vendor))


def _build_negotiation_content(
    vendor: str,
    logged_by: str,
    department: str,
    date: str,
    discount_pct: Optional[int] = None,
    payment_terms_days: Optional[int] = None,
    flexible_terms: Optional[list[str]] = None,
    firm_terms: Optional[list[str]] = None,
    tactic: Optional[str] = None,
    tactic_worked: Optional[bool] = None,
    notes: Optional[str] = None,
) -> str:
    flexible_terms = flexible_terms or []
    firm_terms = firm_terms or []

    lines = [
        f"Negotiation Record: On {date}, employee {logged_by} from the {department} department "
        f"conducted a negotiation with vendor '{vendor}'."
    ]

    if discount_pct is not None:
        lines.append(f"Discount achieved: {discount_pct}% discount was agreed with {vendor}.")

    if payment_terms_days is not None:
        lines.append(f"Payment terms: {vendor} agreed to {payment_terms_days}-day payment terms.")

    if flexible_terms:
        clean_flex = [t.replace("_", " ") for t in flexible_terms]
        lines.append(f"Contract flexibility: {vendor} was flexible and showed willingness to concede on: {', '.join(clean_flex)}.")

    if firm_terms:
        clean_firm = [t.replace("_", " ") for t in firm_terms]
        lines.append(f"Contract firmness: {vendor} was firm, rigid, and refused to budge on: {', '.join(clean_firm)}.")

    if tactic:
        if tactic_worked is True:
            outcome = "This negotiation tactic WORKED successfully and produced favorable movement."
        elif tactic_worked is False:
            outcome = "This negotiation tactic FAILED and was rejected or caused pushback."
        else:
            outcome = "The outcome of this tactic was neutral or unconfirmed."
        lines.append(f"Tactic used: \"{tactic}\". {outcome}")

    if notes:
        lines.append(f"Additional strategic observations: {notes}")

    return " ".join(lines)


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=1, max=6))
async def aretain_negotiation(
    vendor: str,
    logged_by: str,
    department: str,
    date: str,
    discount_pct: Optional[int] = None,
    payment_terms_days: Optional[int] = None,
    flexible_terms: Optional[list[str]] = None,
    firm_terms: Optional[list[str]] = None,
    tactic: Optional[str] = None,
    tactic_worked: Optional[bool] = None,
    notes: Optional[str] = None,
) -> str:
    """Async: Writes one negotiation into the vendor's SHARED bank."""
    bank_id = vendor_bank_id(vendor)
    await _aensure_bank(bank_id, vendor)

    content = _build_negotiation_content(
        vendor=vendor,
        logged_by=logged_by,
        department=department,
        date=date,
        discount_pct=discount_pct,
        payment_terms_days=payment_terms_days,
        flexible_terms=flexible_terms,
        firm_terms=firm_terms,
        tactic=tactic,
        tactic_worked=tactic_worked,
        notes=notes,
    )
    iso_timestamp = f"{date}T00:00:00Z" if len(date) == 10 else date

    client = get_client()
    try:
        await client.aretain(
            bank_id=bank_id,
            content=content,
            context=f"Vendor negotiation conducted by {logged_by} ({department}) with {vendor}",
            timestamp=iso_timestamp,
        )
    finally:
        await client.aclose()

    return bank_id


def retain_negotiation(
    vendor: str,
    logged_by: str,
    department: str,
    date: str,
    discount_pct: Optional[int] = None,
    payment_terms_days: Optional[int] = None,
    flexible_terms: Optional[list[str]] = None,
    firm_terms: Optional[list[str]] = None,
    tactic: Optional[str] = None,
    tactic_worked: Optional[bool] = None,
    notes: Optional[str] = None,
) -> str:
    """Sync wrapper for aretain_negotiation — safe in both scripts and async contexts."""
    return _run_coro_sync(
        aretain_negotiation(
            vendor=vendor,
            logged_by=logged_by,
            department=department,
            date=date,
            discount_pct=discount_pct,
            payment_terms_days=payment_terms_days,
            flexible_terms=flexible_terms,
            firm_terms=firm_terms,
            tactic=tactic,
            tactic_worked=tactic_worked,
            notes=notes,
        )
    )


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=1, max=6))
async def arecall_vendor_context(vendor: str, query: str, limit: int = 10) -> list[str]:
    """Async: Fetches relevant past negotiation memories for a vendor from shared bank."""
    bank_id = vendor_bank_id(vendor)
    client = get_client()
    try:
        result = await client.arecall(bank_id=bank_id, query=query)
        if hasattr(result, "results") and result.results:
            return [memory.text for memory in result.results[:limit]]
        return []
    except Exception as e:
        logger.warning(f"arecall_vendor_context failed for {vendor}: {e}")
        return []
    finally:
        await client.aclose()


def recall_vendor_context(vendor: str, query: str, limit: int = 10) -> list[str]:
    """Sync wrapper for arecall_vendor_context."""
    return _run_coro_sync(arecall_vendor_context(vendor, query, limit=limit))


_BRIEF_PROMPT_TEMPLATE = """\
You are synthesizing everything the company has learned across ALL past
negotiations with {vendor}, contributed by many different employees who
have not spoken to each other.

Base every field strictly on the retained negotiation memories for this vendor.

ANTI-HALLUCINATION RULES:
- Never guess, extrapolate, or invent numbers or contract terms not explicitly present in memory.
- If there is no recorded evidence for a field, use null or an empty list.
- Distinguish observed historical behavior from guarantees (e.g. use "Historically observed up to..." rather than promising future terms).

CONFIDENCE ASSESSMENT GUIDELINES:
- "Low": Minimal negotiation history exists (e.g. 1 negotiation), or evidence is sparse and fragmented.
- "Medium": Several negotiations exist showing emerging patterns, but sample size is limited (e.g. 2-4 deals).
- "High": Multiple historical negotiations (e.g. 5+ deals) confirm consistent, repeatable patterns across different employees.
- Return ONLY one of: "Low", "Medium", "High".

Produce a single JSON object — and ONLY a JSON object, no prose, preamble, or markdown formatting — with exactly these fields:

{{
  "max_discount_pct": <integer or null — highest discount % actually achieved in memory>,
  "payment_terms_note": <string or null — e.g. "60 days accepted (3 previous deals)">,
  "flexible_on": [<list of contract terms this vendor has demonstrated flexibility on>],
  "firm_on": [<list of contract terms this vendor has consistently held firm on>],
  "worked_tactics": [<list of negotiation tactics that succeeded, short phrases>],
  "failed_tactics": [<list of negotiation tactics that failed, short phrases>],
  "confidence": <"Low" | "Medium" | "High">,
  "reasoning": <concise 1-2 sentence explanation of confidence and key findings>
}}
"""


@retry(stop=stop_after_attempt(2), wait=wait_exponential(multiplier=1, min=1, max=4))
async def _acall_reflect(bank_id: str, prompt: str) -> str:
    client = get_client()
    try:
        response = await client.areflect(bank_id=bank_id, query=prompt)
        return response.text if hasattr(response, "text") else str(response)
    finally:
        await client.aclose()


async def areflect_negotiation_brief(vendor: str) -> dict[str, Any]:
    """Async: The core product feature. Calls Hindsight's reflect() over the
    vendor's ENTIRE shared bank and synthesizes a structured brief.
    """
    bank_id = vendor_bank_id(vendor)
    prompt = _BRIEF_PROMPT_TEMPLATE.format(vendor=vendor)

    try:
        raw_text = await _acall_reflect(bank_id, prompt)
    except Exception as e:
        logger.error(f"Hindsight reflect call failed for {vendor}: {e}")
        raw_text = ""

    parsed = _extract_and_validate_json(raw_text)
    parsed["_raw_reflection"] = raw_text
    parsed["vendor"] = vendor
    return parsed


def reflect_negotiation_brief(vendor: str) -> dict[str, Any]:
    """Sync wrapper for areflect_negotiation_brief."""
    return _run_coro_sync(areflect_negotiation_brief(vendor))


def _extract_and_validate_json(text: str) -> dict[str, Any]:
    """Parses, sanitizes, and strictly validates the reflection JSON output."""
    data = None
    if text:
        try:
            data = json.loads(text)
        except json.JSONDecodeError:
            match = re.search(r"\{.*\}", text, re.DOTALL)
            if match:
                try:
                    data = json.loads(match.group(0))
                except json.JSONDecodeError:
                    pass

    if not isinstance(data, dict):
        return _empty_brief_shape()

    # Validate and normalize max_discount_pct
    raw_discount = data.get("max_discount_pct") or data.get("maximum_discount_pct")
    max_discount_pct = None
    if raw_discount is not None:
        try:
            val = int(raw_discount)
            if 0 <= val <= 100:
                max_discount_pct = val
        except (ValueError, TypeError):
            pass

    # Validate payment_terms_note
    raw_payment = data.get("payment_terms_note") or data.get("payment_terms_days")
    payment_terms_note = str(raw_payment) if raw_payment is not None else None

    # Validate list fields
    def _clean_list(raw_val: Any) -> list[str]:
        if isinstance(raw_val, list):
            return [str(item).strip() for item in raw_val if item]
        return []

    flexible_on = _clean_list(data.get("flexible_on") or data.get("flexible_terms"))
    firm_on = _clean_list(data.get("firm_on") or data.get("firm_terms"))
    worked_tactics = _clean_list(data.get("worked_tactics") or data.get("successful_tactics"))
    failed_tactics = _clean_list(data.get("failed_tactics"))

    # Validate confidence
    raw_conf = str(data.get("confidence", "")).strip().capitalize()
    if raw_conf in ("Low", "Medium", "High"):
        confidence = raw_conf
    else:
        confidence = "Low"

    reasoning = data.get("reasoning")
    if reasoning is not None:
        reasoning = str(reasoning).strip()

    return {
        "max_discount_pct": max_discount_pct,
        "payment_terms_note": payment_terms_note,
        "flexible_on": flexible_on,
        "firm_on": firm_on,
        "worked_tactics": worked_tactics,
        "failed_tactics": failed_tactics,
        "confidence": confidence,
        "reasoning": reasoning,
    }


def _empty_brief_shape() -> dict[str, Any]:
    return {
        "max_discount_pct": None,
        "payment_terms_note": None,
        "flexible_on": [],
        "firm_on": [],
        "worked_tactics": [],
        "failed_tactics": [],
        "confidence": "Low",
        "reasoning": "No historical negotiation memories recorded for this vendor.",
    }
