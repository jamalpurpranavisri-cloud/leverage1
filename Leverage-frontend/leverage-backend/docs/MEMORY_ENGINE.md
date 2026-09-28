# Leverage Memory Engine (Hindsight Layer)

> **Persistent, Cross-User Organizational Memory for Vendor Negotiations**

The **Memory Engine** is built and maintained by **Person A**. It leverages [Hindsight](https://github.com/vectorize-io/hindsight) to turn individual, siloed employee bargaining rounds into cumulative, organization-wide leverage.

---

## 1. Architectural Concept

Negotiations in traditional enterprises are lost in individual email threads or spreadsheets. When a new colleague sits down with a vendor, they start from zero.

Leverage solves this with a **Vendor-Centric Shared Memory Bank**:

```
Vendor: Microsoft (Bank: "vendor-microsoft")
┌────────────────────────────────────────────────────────┐
│             Hindsight Shared Memory Bank               │
└───────────────────────────┬────────────────────────────┘
                            │
       ┌────────────────────┼────────────────────┐
       ▼                    ▼                    ▼
Employee A (Procurement)  Employee B (IT)    Employee C (Finance)
Date: 2025-10-15          Date: 2025-11-20   Date: 2026-03-12
Discount: 12%             Terms: 60 days     Tactic: Discount before length
       │                    │                    │
       └────────────────────┼────────────────────┘
                            │ retain()
                            ▼
            Accumulated Shared Knowledge
                            │ reflect() / recall()
                            ▼
               Employee D (New Colleague)
       "Never negotiated with Microsoft before"
                            │
                            ▼
               Negotiation Intelligence Brief
```

- **Memory Keying**: Memory banks are keyed **by vendor** (`vendor-{slug}`), **never** by individual user.
- **Cross-User Growth**: Every employee who completes a deal writes into that vendor's bank.
- **Zero Hallucination Grounding**: Reflections are grounded strictly in the accumulated empirical facts retained by colleagues.

---

## 2. Quickstart for Person B (Backend Developer)

You can import the memory functions from either `app.memory` or `app.hindsight_service`:

```python
from app.memory import (
    retain_negotiation,
    recall_vendor_context,
    reflect_negotiation_brief,
    vendor_bank_id,
)
```

---

## 3. Function Reference

### 1. `retain_negotiation`
Writes a completed negotiation into that vendor's shared Hindsight memory bank.

```python
bank_id = retain_negotiation(
    vendor="Microsoft",
    logged_by="Aarav Kumar",
    department="Procurement",
    date="2026-04-02",
    discount_pct=20,
    payment_terms_days=60,
    flexible_terms=["payment_terms", "contract_duration"],
    firm_terms=["liability_clause"],
    tactic="Asked for discount before discussing contract length",
    tactic_worked=True,
    notes="Vendor pushed back on liability but accepted 60-day net terms.",
)
```

#### Parameters:
- `vendor` (`str`): Name of the vendor (required).
- `logged_by` (`str`): Name of the employee conducting the deal (required).
- `department` (`str`): Department name, e.g. "Procurement", "IT", "Finance" (required).
- `date` (`str`): ISO date string `YYYY-MM-DD` (required).
- `discount_pct` (`int | None`): Achieved discount percentage (0–100).
- `payment_terms_days` (`int | None`): Agreed payment period in days (e.g. 30, 45, 60).
- `flexible_terms` (`list[str]`): Contract clauses the vendor yielded on.
- `firm_terms` (`list[str]`): Dealbreaker clauses the vendor refused to move on.
- `tactic` (`str | None`): Tactic employed.
- `tactic_worked` (`bool | None`): `True` (worked), `False` (failed), or `None` (unspecified).
- `notes` (`str | None`): Strategic qualitative context for future colleagues.

---

### 2. `recall_vendor_context`
Performs semantic retrieval against the vendor's accumulated memory bank. Used for evidence retrieval and "show your sources" panels.

```python
memories = recall_vendor_context(
    vendor="Microsoft",
    query="What payment terms and discounts have been achieved historically?",
    limit=5,
)

for memory in memories:
    print(memory)
```

---

### 3. `reflect_negotiation_brief`
Calls Hindsight's `reflect()` engine over the entire shared bank to synthesize a structured, validated negotiation intelligence brief.

```python
brief = reflect_negotiation_brief("Microsoft")
```

#### Output Schema:
```json
{
  "vendor": "Microsoft",
  "max_discount_pct": 20,
  "payment_terms_note": "60 days accepted (across multiple deals)",
  "flexible_on": [
    "payment terms",
    "contract duration"
  ],
  "firm_on": [
    "liability clause"
  ],
  "worked_tactics": [
    "asked for discount before discussing contract length"
  ],
  "failed_tactics": [
    "opened with aggressive lowball offer"
  ],
  "confidence": "High",
  "reasoning": "Consistent agreements across 8 negotiations from 4 departments confirm 60-day terms and 20% discount ceiling.",
  "_raw_reflection": "..."
}
```

---

## 4. Confidence & Safety Guarantees

1. **Evidence-Based Confidence**:
   - `High`: 5+ negotiations confirming repeatable patterns.
   - `Medium`: 2–4 negotiations with emerging patterns.
   - `Low`: 1 negotiation or sparse/inconsistent data.
2. **Anti-Hallucination Guardrails**:
   - Strict instructions prevent inventing unobserved numbers or terms.
   - Missing fields default to `null` or `[]`.
3. **Resilience & Safe Parsing**:
   - Retries up to 2 times on malformed model responses.
   - Coerces and validates types before returning.

---

## 5. Running Tests & Seeds

### Seed Ground Truth Data:
```bash
python scripts/seed_memory.py
```

### Run Full Test Suite:
```bash
python scripts/test_memory_layer.py
```
