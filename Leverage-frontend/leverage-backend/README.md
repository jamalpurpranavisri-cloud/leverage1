# Leverage — Backend

Cross-vendor negotiation intelligence, powered by [Hindsight](https://github.com/vectorize-io/hindsight)'s shared agent memory.

## How Hindsight is used in this solution

Every negotiation any employee has with a vendor is written into a memory
bank keyed **by vendor, not by employee**:

```
Employee A ─┐
Employee B ─┤
Employee C ─┼──►  Hindsight bank "vendor-microsoft"  ──►  reflect()  ──►  Negotiation Brief
Employee D ─┘              ▲
Employee E (new) ──────────┘   reads the SAME bank — benefits from
                                everyone else's negotiations, despite
                                never having spoken to any of them
```

- **`retain`** — called in `hindsight_service.retain_negotiation()` every time someone logs a negotiation via `POST /negotiations`. The structured form fields are woven into a clear natural-language account, which Hindsight's own extraction pipeline turns into queryable facts, entities and time-series data.
- **`recall`** — called in `hindsight_service.recall_vendor_context()`, used to fetch raw supporting evidence for a vendor (useful for a "show your sources" panel).
- **`reflect`** — called in `hindsight_service.reflect_negotiation_brief()`, the core of the product. It's asked to synthesize the *entire* vendor bank — every negotiation logged by every employee — into a structured JSON brief (max discount seen, terms the vendor bends on vs. holds firm on, tactics that worked vs. failed).

This app keeps **zero negotiation intelligence in its own database.** The only local storage (`app/store.py`, SQLite) tracks lightweight structural metadata — which vendors exist, who's contributed, how many negotiations are logged — purely so the vendor list can render instantly without invoking an LLM call. All actual knowledge synthesis is Hindsight's `reflect()`.

## Setup

```bash
python -m venv venv && source venv/bin/activate   # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env
```

Fill in `.env`:
1. Register at [ui.hindsight.vectorize.io](https://ui.hindsight.vectorize.io)
2. In **Billing**, apply promo code `MEMHACK99` for $50 free credit
3. Copy your API key into `HINDSIGHT_API_KEY`
4. Get a free key from [groq.com](https://groq.com/) for `GROQ_API_KEY` (optional — only used for the freeform-notes parsing helper)

## Verify the integration before building anything else

```bash
python test_hindsight_connection.py
```

This retains 3 fake negotiations into a throwaway test bank and prints
the synthesized `reflect()` brief. Don't proceed to the frontend/demo
until this produces sensible output.

## Seed the real demo data

```bash
python seed_demo_data.py
```

Loads the exact scenario used in the demo script: 8 Microsoft
negotiations from 4 different fictional employees across 4 departments
(→ High confidence), plus two smaller vendors to show Low/Medium
confidence states.

## Run the API

```bash
uvicorn app.main:app --reload --port 8000
```

Interactive docs at `http://localhost:8000/docs`.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| POST | `/negotiations` | Log a negotiation — writes into Hindsight |
| POST | `/negotiations/parse` | Optional: freeform text → structured fields (Groq) |
| GET | `/vendors` | List all vendors with confidence badges |
| GET | `/vendors/{vendor}/brief` | **The core feature** — synthesized negotiation brief |
| GET | `/health` | Uptime check |

## Architectural and Design Principles Followed Here

- Uses Hindsight as an external dependency via Hindsight Cloud (not forked/vendored) — see [Hindsight docs](https://hindsight.vectorize.io/) and [GitHub](https://github.com/vectorize-io/hindsight).
- LLM access via Groq (`openai/gpt-oss-120b`), with retry + fallback logic around all tool-calling requests, preventing function-calling flakiness on free-tier models.
- No negotiation intelligence is faked or hardcoded — the brief is always generated live by `reflect()` against whatever is actually in the bank at query time.
