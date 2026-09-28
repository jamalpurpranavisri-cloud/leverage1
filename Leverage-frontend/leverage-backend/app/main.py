"""
Leverage backend — API layer.

Endpoints:
  POST /negotiations               log a new negotiation (writes into Hindsight)
  GET  /vendors                    list vendors with confidence badges
  GET  /vendors/{vendor}/brief     the core product: synthesized negotiation brief
  POST /negotiations/parse         optional: freeform notes -> structured fields (Groq)
  GET  /health                     uptime check

Run locally:
    uvicorn app.main:app --reload --port 8000

Architecture (see README.md for the full diagram):
    Employee A ─┐
    Employee B ─┤
    Employee C ─┼──> Hindsight bank "vendor-{slug}"  ──> reflect() ──> Brief
    Employee D ─┘         ▲
    Employee E (new) ─────┘  reads the SAME bank, benefits from all of the above
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app import hindsight_service, groq_service, store
from app.schemas import (
    NegotiationIn,
    NegotiationOut,
    VendorSummary,
    NegotiationBrief,
    Contributor,
)

app = FastAPI(
    title="Leverage API",
    description=(
        "Cross-vendor negotiation intelligence, powered by Hindsight "
        "(https://github.com/vectorize-io/hindsight) shared memory."
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def _startup() -> None:
    store.init_db()


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/negotiations", response_model=NegotiationOut)
async def log_negotiation(payload: NegotiationIn) -> NegotiationOut:
    """The only write path in the whole app. Every negotiation logged
    here — by anyone, from any department — is retained into that
    vendor's SHARED Hindsight bank, and immediately available to any
    other employee who queries that vendor afterward."""
    try:
        bank_id = await hindsight_service.aretain_negotiation(
            vendor=payload.vendor,
            logged_by=payload.logged_by,
            department=payload.department,
            date=payload.date,
            discount_pct=payload.discount_pct,
            payment_terms_days=payload.payment_terms_days,
            flexible_terms=payload.flexible_terms,
            firm_terms=payload.firm_terms,
            tactic=payload.tactic,
            tactic_worked=payload.tactic_worked,
            notes=payload.notes,
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Hindsight retain failed: {e}")

    vendor_slug = hindsight_service.vendor_bank_id(payload.vendor).removeprefix("vendor-")
    store.record_negotiation(
        vendor=payload.vendor,
        vendor_slug=vendor_slug,
        logged_by=payload.logged_by,
        department=payload.department,
    )

    count = store.get_negotiation_count(vendor_slug)
    return NegotiationOut(
        status="retained",
        vendor=payload.vendor,
        bank_id=bank_id,
        negotiation_count=count,
        confidence=store.confidence_label(count),
    )


@app.post("/negotiations/parse")
def parse_negotiation_notes(payload: dict) -> dict:
    """Optional helper: POST {"notes": "freeform text"} and get back
    structured fields to pre-fill the negotiation form. Never required —
    the form works fully manually if this fails or is unused."""
    notes = payload.get("notes", "")
    if not notes:
        raise HTTPException(status_code=400, detail="`notes` field is required")
    return groq_service.parse_freeform_notes(notes)


@app.get("/vendors", response_model=list[VendorSummary])
def list_vendors() -> list[VendorSummary]:
    """Cheap listing from the local index — does not call Hindsight's
    reflect (which invokes an LLM) just to render a list."""
    vendors = store.list_vendors()
    return [
        VendorSummary(
            vendor=v["vendor"],
            vendor_slug=v["vendor_slug"],
            negotiation_count=v["negotiation_count"],
            confidence=store.confidence_label(v["negotiation_count"]),
        )
        for v in vendors
    ]


@app.get("/vendors/{vendor}/brief", response_model=NegotiationBrief)
async def get_vendor_brief(vendor: str) -> NegotiationBrief:
    """THE core endpoint. A brand-new employee, who has never negotiated
    with this vendor, calls this and gets a brief synthesized entirely
    from OTHER employees' past negotiations — the core value proposition of Leverage."""
    vendor_slug = hindsight_service.vendor_bank_id(vendor).removeprefix("vendor-")
    count = store.get_negotiation_count(vendor_slug)

    if count == 0:
        raise HTTPException(
            status_code=404,
            detail=f"No negotiations logged for '{vendor}' yet. Be the first to log one.",
        )

    try:
        reflection = await hindsight_service.areflect_negotiation_brief(vendor)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Hindsight reflect failed: {e}")

    contributors_raw = store.get_contributors(vendor_slug)

    return NegotiationBrief(
        vendor=vendor,
        max_discount_pct=reflection.get("max_discount_pct"),
        payment_terms_note=reflection.get("payment_terms_note"),
        flexible_on=reflection.get("flexible_on", []),
        firm_on=reflection.get("firm_on", []),
        worked_tactics=reflection.get("worked_tactics", []),
        failed_tactics=reflection.get("failed_tactics", []),
        confidence=store.confidence_label(count),
        negotiation_count=count,
        contributors=[Contributor(name=c["logged_by"], department=c["department"]) for c in contributors_raw],
        raw_reflection=reflection.get("_raw_reflection"),
    )
