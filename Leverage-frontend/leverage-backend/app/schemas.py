from typing import Optional
from pydantic import BaseModel, Field


class NegotiationIn(BaseModel):
    """What an employee submits after finishing a negotiation.
    This is the ONLY way new knowledge enters the system — every field
    here gets woven into a memory that's retained into that vendor's
    shared Hindsight bank."""

    vendor: str = Field(..., examples=["Microsoft"])
    logged_by: str = Field(..., examples=["A. Kumar"])
    department: str = Field(..., examples=["Procurement"])
    date: str = Field(..., description="ISO date, e.g. 2026-04-02")
    discount_pct: Optional[int] = Field(None, ge=0, le=100)
    payment_terms_days: Optional[int] = Field(None, ge=0)
    flexible_terms: list[str] = Field(default_factory=list, examples=[["payment_terms", "contract_duration"]])
    firm_terms: list[str] = Field(default_factory=list, examples=[["liability_clause"]])
    tactic: Optional[str] = Field(None, examples=["Asked for discount before discussing contract length"])
    tactic_worked: Optional[bool] = None
    notes: Optional[str] = None


class NegotiationOut(BaseModel):
    status: str
    vendor: str
    bank_id: str
    negotiation_count: int
    confidence: str


class VendorSummary(BaseModel):
    vendor: str
    vendor_slug: str
    negotiation_count: int
    confidence: str


class Contributor(BaseModel):
    name: str
    department: str


class NegotiationBrief(BaseModel):
    """This shape is the entire product. The frontend renders this
    object directly onto the brief card — field names map 1:1 to the
    emoji-labeled UI (💰 📅 📄 🔒 ✅ ❌ 📊)."""

    vendor: str
    max_discount_pct: Optional[int] = None
    payment_terms_note: Optional[str] = None
    flexible_on: list[str] = Field(default_factory=list)
    firm_on: list[str] = Field(default_factory=list)
    worked_tactics: list[str] = Field(default_factory=list)
    failed_tactics: list[str] = Field(default_factory=list)
    confidence: str
    negotiation_count: int
    contributors: list[Contributor] = Field(default_factory=list)
    raw_reflection: Optional[str] = Field(
        None, description="Full natural-language reflect() output, for debugging/demo transparency"
    )
