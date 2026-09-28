# LEVERAGE — Frontend

> **Cross-Deal Negotiation Intelligence**
> *"Never negotiate with a vendor for the first time twice."*

A B2B SaaS frontend application built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Lucide React**. It interfaces with the Leverage FastAPI backend powered by Hindsight agentic memory.

---

## Architecture & Integration

- **Frontend Framework**: Next.js 15 (App Router) + React 19
- **Design System**: Enterprise dark SaaS theme with glassmorphic cards, responsive grids, and subtle border glowing effects
- **Backend API**: FastAPI running on port 8000 (`http://localhost:8000`)
- **API Client**: Centralized in `src/lib/api.ts`

### Endpoints Used

| Endpoint | Method | Component / Page | Purpose |
|---|---|---|---|
| `/health` | GET | `Header` | Real-time live status indicator badge |
| `/vendors` | GET | `Dashboard (/)`, `VendorSearch` | Lists all vendors with confidence badges & deal counts |
| `/vendors/{vendor}/brief` | GET | `VendorIntelligence (/vendors/[vendor])` | **Core product**: Synthesized brief, concessions, tactics & Organizational Memory |
| `/negotiations` | POST | `NegotiationForm (/log)` | Writes new negotiation into the vendor's shared Hindsight memory bank |
| `/negotiations/parse` | POST | `AIParserSection (/log)` | Optional helper: Extracts structured fields from freeform meeting notes |

---

## Getting Started

### 1. Prerequisites

- **Node.js**: v18+ (tested on v24)
- **npm**: v9+ (tested on v11)
- **Python**: 3.10+ (for backend)

### 2. Environment Setup

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Run the Backend

In a separate terminal:

```bash
cd leverage-backend
uvicorn app.main:app --reload --port 8000
```

*Note: Verify with `http://localhost:8000/docs`.*

### 4. Run the Frontend

In the project root:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Core User Flows

1. **Dashboard (`/`)**:
   - Live backend connectivity badge
   - Organizational summary stats (active vendors, retained deals)
   - Prominent vendor search with autocompletion and "Prepare Negotiation" action
   - Real-time vendor cards with confidence badges (`High`, `Medium`, `Low`)
2. **Vendor Intelligence (`/vendors/[vendor]`)**:
   - 🧠 **Organizational Memory**: Highlights cross-departmental contributors, negotiations count, and employee attribution
   - 💰 **Pricing**: Historical maximum discounts
   - 📅 **Payment Terms**: Terms accepted by vendor
   - 📄 **Flexible Terms**: Contract clauses the vendor yielded on
   - 🔒 **Firm Terms**: Dealbreaker clauses vendor held firm on
   - ✅ **Successful Tactics**: Winning negotiation playbooks
   - ❌ **Failed Tactics**: Pitfalls and rejected offers
   - 🔍 **Audit & Transparency**: Collapsible raw reflection drawer for judges/demo
   - 404 Empty State for vendors with no prior history
3. **Log Negotiation (`/log`)**:
   - ✨ **AI Fast-Fill**: Freeform text extraction via backend Groq parser
   - Form fields matching `NegotiationIn` schema
   - Interactive tag chips for flexible and firm terms
   - Real-time validation and success confirmation banner
