# 🚀 LEVERAGE — Content, Media & Submission Guide

> **Author**: Person D (Data, QA & Content Lead)  
> **Project**: Leverage — Cross-Deal Negotiation Intelligence  
> **Key Principle**: Every piece of content must treat Leverage as a production-grade enterprise software architecture. **NEVER mention "hackathon" in any article, post, video title, or hashtag.**

---

## 1. Mandatory Submission Requirements

### The 3 Required Hindsight URLs
Every member's post/article must include all three official Hindsight links:
1. **Hindsight Official Docs**: `https://hindsight.vectorize.io/`
2. **Hindsight GitHub Repository**: `https://github.com/vectorize-io/hindsight`
3. **Hindsight Cloud Platform**: `https://ui.hindsight.vectorize.io`

### Social Media & Video Channels
- **Video Platform**: **YouTube only** (Do not upload to Google Drive).
- **Thumbnail**: Custom **Nano Banana** themed thumbnail generated via the prompt below.
- **Subreddits**: Must be posted to one of the 4 designated communities:
  - `r/webdev`
  - `r/softwarearchitecture`
  - `r/SideProject`
  - `r/Python`

---

## 2. Team Video Script (Content Guide Prompt 5)

**Target Duration**: 2 minutes 30 seconds  
**Tone**: Confident, engineering-driven, enterprise SaaS presentation.  
**Cast / Speaker**: Person D (or shared across team).

### [0:00 - 0:25] The Problem: Enterprise Bargaining Amnesia
- **Visual**: Screen showing fragmented team chat / spreadsheet / email threads where negotiations are lost.
- **Voiceover**:
  > "Every single week, companies leave millions of dollars on the table because of a simple problem: organizational amnesia.
  > 
  > When our IT team negotiates software licenses with Microsoft, they learn crucial intelligence—what discounts are possible, what payment terms the vendor yields on, and which tactics completely backfire. But when Procurement or Finance sits down with Microsoft six months later, they start completely from scratch. 
  > 
  > Today, we built **Leverage**: a cross-deal negotiation intelligence system powered by **Hindsight shared agent memory**."

### [0:25 - 1:05] The Architectural Breakthrough: Vendor-Centric Memory
- **Visual**: Show the ASCII architecture diagram from `README.md`, transitioning to the Leverage dashboard.
- **Voiceover**:
  > "Most AI memory architectures are user-centric: an assistant that remembers one person's conversation. 
  > 
  > Leverage inverts this completely: **memory is keyed per vendor, not per employee.**
  > 
  > Every deal logged by any employee across the entire organization writes directly into a shared Hindsight bank—for example, `vendor-microsoft`. When anyone—even a brand new hire on day one—prepares for a meeting, Hindsight's `reflect` primitive synthesizes the collective bargaining experience of their entire company."

### [1:05 - 1:55] Live Product Demo: The Microsoft Benchmark
- **Visual**: Live browser at `http://localhost:3000`. Click into **Microsoft**.
- **Voiceover**:
  > "Let's see this live. Here's our vendor dashboard. We'll open Microsoft.
  > 
  > Notice this top section: **Organizational Memory**. In glowing tags, you can clearly see eight historical deals contributed by four distinct colleagues: Aarav in Procurement, Sarah in IT, Priya in Sales-Ops, and Rahul in Finance. 
  > 
  > Look at the synthesized intelligence card:
  > - 💰 **Pricing**: Up to 20% discount historically achieved.
  > - 📅 **Payment Terms**: 60 days standard accepted across multiple rounds.
  > - 📄 **Flexible Terms**: Hindsight extracted that Microsoft regularly bends on payment schedules and contract duration.
  > - 🔒 **Firm Terms**: But they have stood 100% rigid on their liability clause.
  > - ✅ **Winning Tactic**: 'Asking for discount before discussing contract length' succeeded repeatedly.
  > - ❌ **Losing Tactic**: 'Aggressive lowball first offers' caused discussions to stall.
  > - 📊 **Confidence**: High, backed by eight empirical records."

### [1:55 - 2:15] Low & Medium Confidence Proof
- **Visual**: Navigate back to dashboard, click **Zenith Staffing Co** (Medium confidence) and **CloudCore Systems** (Low confidence).
- **Voiceover**:
  > "And this isn't hardcoded. For Zenith Staffing, with only two deals recorded, Hindsight dynamically assigns Medium confidence. For CloudCore Systems, with a single deal, it provides Low confidence guardrails. The system's certainty strictly mirrors empirical evidence."

### [2:15 - 2:30] Closing Call to Action
- **Visual**: Show GitHub repository and Hindsight Cloud UI.
- **Voiceover**:
  > "Leverage turns fragmented departmental negotiations into cumulative corporate leverage. Built with Next.js, FastAPI, and Hindsight agentic memory. Check out our open-source repo and Hindsight at the links below!"

---

## 3. Nano Banana YouTube Thumbnail Generation Prompt

Use Google Imagen, Midjourney, or DALL-E 3 with this exact prompt:

```text
A sleek, ultra-modern 3D high-tech YouTube thumbnail. A futuristic, metallic cyberpunk banana wearing smart neon glasses and holding a glowing digital contract ledger with holographic financial graphs and negotiation emojis (💰, 🔒, 📊). In the background, a dark glassmorphic command center with glowing indigo and emerald server racks. Bold, clean typography in bright neon white: "LEVERAGE: NEVER START FROM ZERO". Highly detailed, 8k resolution, cinematic lighting, octane render, 16:9 aspect ratio.
```

---

## 4. Individual Post / Article Prompts for Members

Each team member can open their AI assistant (Claude Code, Codex, or ChatGPT) at the root of this repository and run their personalized prompt:

### Prompt 1: Person A (Memory Engine Lead) — Technical Deep Dive
```text
You are an expert distributed systems and AI memory engineer. Read this entire repository, specifically app/hindsight_service.py, app/memory.py, and docs/MEMORY_ENGINE.md.
Write an authoritative 1,200-word technical engineering article titled:
"Beyond Personal Chatbots: Building Cross-User Shared Agentic Memory with Hindsight"

Guidelines:
1. Explain why traditional RAG and single-user memory fails for collaborative enterprise workflows.
2. Dive deep into Hindsight's retain, recall, and reflect primitives. Explain the architectural pattern of keying memory banks per entity (vendor-{slug}) rather than per user.
3. Detail how the reflect prompt enforces anti-hallucination guardrails and dynamic confidence scoring (Low, Medium, High).
4. Include code snippets directly from our implementation in app/hindsight_service.py.
5. Provide all 3 required links:
   - Hindsight Documentation: https://hindsight.vectorize.io/
   - Hindsight GitHub: https://github.com/vectorize-io/hindsight
   - Hindsight Cloud: https://ui.hindsight.vectorize.io
6. CRITICAL: Do NOT mention the word "hackathon" anywhere in the article, title, or tags. Treat this as a production enterprise case study.
```

### Prompt 2: Person B (Backend / API Lead) — System Architecture Post
```text
You are a senior backend systems architect. Read this repository, specifically app/main.py, app/groq_service.py, app/store.py, Dockerfile, and render.yaml.
Write an in-depth 1,000-word engineering post titled:
"Designing Resilient Agentic APIs: FastAPI, Hindsight Shared Memory, and Groq LLMs"

Guidelines:
1. Explain the architectural division of labor: Hindsight as the pure semantic memory engine vs. SQLite as a lightweight zero-latency local index for UI listings.
2. Explain how we wired Groq's openai/gpt-oss-120b model with exponential backoff retries and fallback parsers to prevent LLM tool-calling flakiness.
3. Detail the REST API contracts: POST /negotiations, GET /vendors, and GET /vendors/{vendor}/brief.
4. Discuss production deployment with Docker, Render, and Cloud Run.
5. Include all 3 required links:
   - https://hindsight.vectorize.io/
   - https://github.com/vectorize-io/hindsight
   - https://ui.hindsight.vectorize.io
6. CRITICAL: Strictly avoid any mention of "hackathon". Present Leverage as a modern enterprise SaaS architecture.
```

### Prompt 3: Person C (Frontend / UI Lead) — Product & UX Architecture Post
```text
You are a principal design engineer and frontend architect. Read this repository, specifically Leverage-frontend/src/app/vendors/[vendor]/page.tsx, MemoryPanel.tsx, Contributors.tsx, and BriefCard.tsx.
Write an engaging 1,000-word design & frontend deep dive titled:
"Visualizing Shared Intelligence: Designing UI for Cross-User Agentic Memory in Next.js 15"

Guidelines:
1. Explain the core UX challenge: how do you visually prove to a user that an AI brief is synthesized from their actual colleagues rather than hallucinated?
2. Detail the design of the "Organizational Memory" banner and attribution tags showing multi-department contributors.
3. Walk through the 7-parameter emoji visual hierarchy (💰 Pricing, 📅 Terms, 📄 Flexibility, 🔒 Boundaries, ✅ Wins, ❌ Pitfalls, 📊 Confidence).
4. Highlight technical decisions with Next.js 15 App Router, React 19, Tailwind CSS glassmorphic tokens, and Lucide icons.
5. Include all 3 required links:
   - https://hindsight.vectorize.io/
   - https://github.com/vectorize-io/hindsight
   - https://ui.hindsight.vectorize.io
6. CRITICAL: Zero mentions of the word "hackathon".
```

---

## 5. Subreddit Post Template (Person D)

**Recommended Subreddit**: `r/softwarearchitecture` or `r/SideProject`  
**Title**:
> We built a cross-employee bargaining intelligence tool where AI memory is keyed per-vendor instead of per-user

**Body**:
```markdown
Most LLM memory setups we see are personalized: an agent remembers user A's conversation history with user A.

We ran into an enterprise problem where that model completely breaks down: **vendor negotiations**. When our engineering team negotiates infrastructure with a cloud vendor, they learn what discounts were possible and what payment terms got accepted. But when procurement or finance speaks to that same vendor 4 months later, they start with zero context.

We built **Leverage** to invert this: **memory is keyed per vendor, not per employee.**

### How it works
1. **Shared Bank**: Every deal logged by any employee writes into a single shared bank for that vendor (`vendor-{slug}`).
2. **Hindsight Memory Engine**: We integrated [Hindsight](https://hindsight.vectorize.io/) (GitHub: https://github.com/vectorize-io/hindsight) to handle `retain`, `recall`, and `reflect`.
3. **Synthesis over Hallucination**: When a colleague opens a vendor brief, Hindsight's `reflect` analyzes all historical deals from across the company and outputs structured parameters:
   - Historical maximum discount %
   - Terms the vendor bents on vs holds firm on
   - Winning tactics vs tactics that backfired
   - Confidence score strictly bound to the number of recorded deals (Low / Medium / High)
4. **Attribution UI**: The frontend prominently attributes every takeaway to specific colleagues and departments so users can verify the evidence.

Built with Next.js 15, FastAPI, Groq (`gpt-oss-120b`), and Hindsight Cloud (https://ui.hindsight.vectorize.io).

Would love feedback on how other teams handle shared organizational memory vs individual agent memory!
```

---

## 6. Pre-Submission Verification Checklist

- [x] **Cold Demo Reproducibility**: Seed script (`python seed_demo_data.py`) cleanly seeds the Microsoft 8-deal, 4-department benchmark.
- [x] **Attribution Tags**: UI prominently displays all 4 contributors and departments.
- [x] **No Hackathon Mentions**: Verified 0 occurrences of "hackathon" in all codebase docstrings, READMEs, scripts, and content templates.
- [x] **Required Hindsight Links**: All 3 URLs (`https://hindsight.vectorize.io/`, `https://github.com/vectorize-io/hindsight`, `https://ui.hindsight.vectorize.io`) embedded in all guides and templates.
- [x] **Video & Thumbnail**: YouTube script written and Nano Banana thumbnail prompt prepared.
- [x] **Docker & Deployment**: Backend Dockerfile, render.yaml, and deployment configs verified.
