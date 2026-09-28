# ⚡ LEVERAGE — Cross-Deal Negotiation Intelligence

> **"Never negotiate with a vendor for the first time twice."**
> 
> *Persistent, cross-user organizational memory for vendor bargaining, powered by [Hindsight](https://github.com/vectorize-io/hindsight)'s shared agent memory.*

[![Hindsight Cloud](https://img.shields.io/badge/Memory_Engine-Hindsight_Cloud-6366f1.svg)](https://hindsight.vectorize.io/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![Next.js 15](https://img.shields.io/badge/Frontend-Next.js_15-black.svg)](https://nextjs.org/)
[![Groq LLM](https://img.shields.io/badge/LLM-Groq_GPT--OSS--120B-f97316.svg)](https://groq.com/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript_&_Python-3178c6.svg)](https://www.typescriptlang.org/)

---

## 1. Executive Summary & Problem Statement

In modern enterprises, vendor negotiations are painfully siloed. When an employee in IT negotiates software licensing with Microsoft, their insights—which discounts were conceded, which payment terms were accepted, which tactics worked or stalled—remain locked in private email chains or forgotten spreadsheets. 

Six months later, an employee in Procurement or Finance negotiates with that exact same vendor from scratch, repeating mistakes and leaving money on the table.

**Leverage** solves this through **Vendor-Centric Shared Agentic Memory**:
Every negotiation completed by any employee across the entire company is retained into a single, shared vendor memory bank. When any employee sits down to negotiate—even a new hire who has never spoken with that vendor—Leverage synthesizes the collective bargaining experience of their colleagues into an actionable **Negotiation Intelligence Brief**.

---

## 2. Core Architecture

The central architectural tenet of Leverage: **Memory is keyed PER VENDOR (`vendor-{slug}`), NEVER per individual employee.**

```
   Employee A (Procurement) ──┐
   Employee B (IT)          ──┤
   Employee C (Sales-Ops)   ──┼──►  Shared Hindsight Bank  ──►  reflect()  ──►  Negotiation Intelligence Brief
   Employee D (Finance)     ──┘      ("vendor-microsoft")                       (💰 Pricing · 📅 Terms · 📄 Concessions ·
                                                ▲                                🔒 Boundaries · ✅ Playbook · 📊 Confidence)
   Employee E (Brand New Hire) ─────────────────┘
   "Never negotiated with Microsoft before"
   Benefits from all previous organizational memory
```

### The Three Hindsight Primitives
1. **`retain` (`hindsight_service.retain_negotiation`)**:
   Called when an employee logs a completed deal (`POST /negotiations`). The structured inputs are woven into rich, natural-language accounts that Hindsight's extraction pipeline transforms into queryable facts, entities, and time-series data.
2. **`recall` (`hindsight_service.recall_vendor_context`)**:
   Semantic evidence retrieval querying the vendor's accumulated bank. Powers "show your sources" audits and transparent evidence inspection.
3. **`reflect` (`hindsight_service.reflect_negotiation_brief`)**:
   The flagship product feature (`GET /vendors/{vendor}/brief`). Synthesizes the *entire* vendor memory bank into a structured JSON intelligence brief, complete with anti-hallucination bounds and confidence ratings.

---

## 3. Team Responsibilities & System Split

| Role | Person | Component | Key Deliverables |
|---|---|---|---|
| **Memory Engine** | **Person A** | `app/hindsight_service.py`<br>`app/memory.py` | Hindsight SDK integration, `retain`/`recall`/`reflect` pipelines, prompt engineering, anti-hallucination validation, repeatability stress tests. |
| **Backend / API** | **Person B** | `app/main.py`<br>`app/groq_service.py`<br>`Dockerfile` | FastAPI endpoints (`POST /negotiations`, `GET /vendors`, `GET /vendors/{name}/brief`), Groq retry wrapper (`openai/gpt-oss-120b`), deployment configs. |
| **Frontend / UI** | **Person C** | `Leverage-frontend/src`<br>`BriefCard.tsx`<br>`MemoryPanel.tsx` | Next.js 15 App Router, emoji-labeled brief card (💰📅📄🔒✅❌📊), unmissable **"Contributed by"** attribution UI, fast-fill meeting notes parser. |
| **Data, QA & Content** | **Person D** | `seed_demo_data.py`<br>`scripts/test_memory_layer.py`<br>`docs/` | Ground-truth seed data (Microsoft 8-deal multi-department benchmark), end-to-end QA, video script, article prompts, and submission documentation. |

---

## 4. Repository Structure

```
leverage1/
├── README.md                              <-- Root Project & Evaluation Guide
├── docs/
│   └── CONTENT_AND_SUBMISSION_GUIDE.md   <-- Video script (Prompt 5), Article Prompts (1-3), Reddit guide
└── Leverage-frontend/                     <-- Next.js 15 Frontend
    ├── package.json
    ├── tailwind.config.ts
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx                  <-- Dashboard & Vendor Search (Gateway for unauthenticated)
    │   │   ├── auth/page.tsx             <-- Enterprise Sign In / Sign Up Gateway Portal
    │   │   ├── signin/page.tsx           <-- Sign In route alias
    │   │   ├── login/page.tsx            <-- Login route alias
    │   │   ├── vendors/[vendor]/page.tsx <-- Vendor Intelligence & Brief Card
    │   │   └── log/page.tsx              <-- Log Negotiation & AI Note Parser (with auto-attribution)
    │   ├── context/
    │   │   └── AuthContext.tsx           <-- User session state, personas & localStorage persistence
    │   ├── components/
    │   │   ├── AuthGateway.tsx           <-- Sign Up / Sign In form (Name, Email, Company, Dept, Personas)
    │   │   ├── BriefCard.tsx             <-- 7-section emoji card (💰📅📄🔒✅❌📊)
    │   │   ├── MemoryPanel.tsx           <-- Unmissable Organizational Memory Banner
    │   │   ├── Contributors.tsx          <-- Real employee attribution tags
    │   │   └── NegotiationForm.tsx       <-- Structured bargaining capture
    │   └── lib/
    │       └── api.ts                    <-- Typed API client for FastAPI
    └── leverage-backend/                 <-- FastAPI + Hindsight Backend
        ├── requirements.txt
        ├── Dockerfile                    <-- Container deployment (Render / Cloud Run)
        ├── render.yaml                   <-- 1-click Render blueprint
        ├── .env.example                  <-- Environment template
        ├── seed_demo_data.py             <-- Microsoft 8-deal demo seed script
        ├── test_hindsight_connection.py  <-- Standalone Hindsight validation script
        ├── scripts/
        │   ├── seed_memory.py            <-- Multi-vendor memory seed script
        │   └── test_memory_layer.py      <-- 5-stage comprehensive test suite
        ├── docs/
        │   └── MEMORY_ENGINE.md          <-- Person A Memory Engine documentation
        └── app/
            ├── main.py                   <-- FastAPI application & routes
            ├── hindsight_service.py      <-- Core retain/recall/reflect wrapper
            ├── memory.py                 <-- Clean export module for backend
            ├── groq_service.py           <-- Optional meeting notes extraction LLM
            ├── store.py                  <-- Local SQLite index for instant vendor lists
            ├── schemas.py                <-- Pydantic models & brief schemas
            └── config.py                 <-- Environment settings
```

---

## 5. Quickstart & Local Execution

### 1. Backend Setup (FastAPI + Hindsight)

```bash
cd Leverage-frontend/leverage-backend

# 1. Create and activate virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment variables
# Copy .env.example to .env and insert your Hindsight & Groq keys:
cp .env.example .env

# 4. Verify Hindsight connection (retains, recalls, and reflects test data)
python test_hindsight_connection.py

# 5. Seed the ground-truth demo dataset (8 Microsoft deals, 4 departments)
python seed_demo_data.py

# 6. Run the FastAPI development server
uvicorn app.main:app --reload --port 8000
```
*API docs and OpenAPI schema are live at `http://localhost:8000/docs`.*

### 2. Frontend Setup (Next.js 15)

In a second terminal:

```bash
cd Leverage-frontend

# 1. Install dependencies
npm install

# 2. Ensure environment variable points to backend
# (.env.local contains NEXT_PUBLIC_API_URL=http://localhost:8000)

# 3. Launch the development server
npm run dev
```
*Open [http://localhost:3000](http://localhost:3000) in your browser.*

---

## 6. Live Ground-Truth Demo Scenario (Microsoft)

The system is pre-engineered with a 4-department, 8-negotiation historical dataset for **Microsoft**:
- **Contributors**:
  1. `A. Kumar` (Procurement)
  2. `R. Singh` (IT)
  3. `D. Fernandes` (Sales-Ops)
  4. `P. Mehta` (Finance)
- **Synthesized Brief Output (`GET /vendors/Microsoft/brief`)**:
  - 💰 **Previous Discount**: Up to **20%**
  - 📅 **Payment Terms**: **60 days** accepted across multiple previous deals
  - 📄 **Flexible Terms**: Payment terms, contract duration
  - 🔒 **Usually Firm On**: Liability clause (non-negotiable across all 8 deals)
  - ✅ **Worked Before**: *"Asking for discount before discussing contract length"*
  - ❌ **Failed Tactics**: *"Aggressive first-offer approach"*
  - 📊 **Confidence**: **High** (derived from 8 historical data points)
  - 🧠 **Contributed By**: Visibly displays all 4 colleagues and their respective departments in glowing attribution tags.

Two sparser vendors (**Zenith Staffing Co** with 2 deals, **CloudCore Systems** with 1 deal) are also seeded to prove that confidence tiers dynamically transition between `Low`, `Medium`, and `High` based on empirical evidence.

---

## 7. Automated Testing & Verification Suite

All core layers are rigorously tested via automated test suites:

```bash
cd Leverage-frontend/leverage-backend

# 1. Hindsight Connectivity & Basic Synthesis Test
python test_hindsight_connection.py

# 2. Full 5-Stage Memory Engine Test Suite (Cross-user, semantic recall, reflection, stability, empty/sparse fallback)
python scripts/test_memory_layer.py

# 3. Frontend Type-Check & Verification
cd ..
npx tsc --noEmit
```

---

## 8. Links & External Dependencies

- **Hindsight Documentation**: [https://hindsight.vectorize.io/](https://hindsight.vectorize.io/)
- **Hindsight GitHub Repository**: [https://github.com/vectorize-io/hindsight](https://github.com/vectorize-io/hindsight)
- **Hindsight Cloud Platform**: [https://ui.hindsight.vectorize.io/](https://ui.hindsight.vectorize.io/)
- **Groq API**: [https://groq.com/](https://groq.com/)
