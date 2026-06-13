# TalentOS — Advanced Developer & AI Agent Guide

Welcome to the **TalentOS** repository. This guide is a comprehensive reference for human developers and autonomous AI agents contributing to, maintaining, or scaling this codebase.

It outlines the strict architectural paradigms, the specific logic behind our custom heuristics, AI integration patterns, and UI/UX aesthetic rules.

---

## 🏗️ 1. Architecture & Design Paradigms

TalentOS strictly enforces a **hybrid architecture** that separates deterministic data processing from generative AI capabilities:

### **Paradigm A: Deterministic Ranking (Backend)**
**Rule:** Candidate ranking *must never* rely on generative LLMs.
- **Why?** To ensure reproducible outcomes, zero hallucination risk, and O(n) performance scaling (~45s per 100k candidates).
- **Files:** `rank.cjs` (Node.js) and `rank.py` (Python equivalent).
- **Execution:** Runs locally or in CI/CD via CLI. Outputs a deterministic `submission.csv` and internal JSON states for the frontend.

### **Paradigm B: Generative Analysis (Frontend / Edge)**
**Rule:** LLMs are reserved strictly for unstructured data extraction, specifically parsing Job Descriptions (JDs).
- **Why?** JDs are unstructured text that require semantic understanding to map to rigid candidate skill schemas.
- **Files:** `src/lib/gemini.ts` and `src/pages/JDAnalyzerPage.tsx`.

---

## 🧠 2. Deep Dive: Core Ranking Heuristics (`rank.cjs`)

When modifying the ranking algorithm, you must adhere to the 3-pillar scoring model. The total score is computed as:
`Total Score = (0.30 * Experience) + (0.45 * Skills) + (0.25 * Behavior)`

### 🔹 Pillar 1: Experience (Weight: 30%)
- **Sweet Spot:** 6 to 8 Years of Experience (YoE) receives a 1.0 multiplier.
- **Diminishing Returns:** >10 YoE drops to a 0.2 multiplier (assumes overqualification for the specific target role).
- **The Consulting Penalty:** If a candidate's *entire* career history consists of IT service/consulting firms (e.g., TCS, Infosys, Wipro, Accenture), their baseline experience score is severely penalized or zeroed out, as the platform prioritizes product-company experience.
- **The Domain Boost:** Candidates with titles matching `['ml', 'machine learning', 'ai', 'nlp', 'retrieval']` receive a flat boost.

### 🔹 Pillar 2: Skills Density (Weight: 45%)
- **Required Skills (70% of Skill Score):** Checks for presence of Core Vector DBs (Pinecone, Weaviate, Milvus) and Embedding models (sentence-transformers).
- **Desired Skills (30% of Skill Score):** Checks for advanced, trending technologies (LoRA, QLoRA, Fine-tuning, XGBoost).
- **The Domain Mismatch Penalty:** An anti-keyword-stuffing mechanism. If a candidate lists `computer-vision` or `robotics` but lacks foundational `nlp` or `retrieval` skills, their total skill score is cut by 50%. (Real experts in modern LLM/RAG stacks rarely straddle both without deep NLP roots).

### 🔹 Pillar 3: Behavioral Signals (Weight: 25%)
- **Location Optimization:** India-based candidates in Pune or Noida receive a 1.0 multiplier. Other major hubs (Bangalore, Hyderabad) receive 0.8.
- **Notice Period:** ≤ 30 days = 1.0. ≥ 90 days = 0.2.
- **Activity & Engagement:** Uses the `recruiter_response_rate` and `last_active_date` to calculate a readiness modifier.

### 🛑 Honeypot & Fraud Detection
*Agents modifying the parser must ensure these run BEFORE the scoring loop:*
1. **Zero-Duration Skills:** Any skill in the array with `duration_months == 0`.
2. **Timeline Fraud:** `abs(claimed_years - sum_of_job_durations) > 0.5`.
3. **Time Travelers:** Certifications where `year > 2026`.
4. **Irrelevant Profiles:** Primary titles matching `marketing, sales, hr, accountant`.

### 💎 The "Hidden Gems" Algorithm
A candidate is flagged as a Hidden Gem if:
1. Their combined Experience + Behavior score is in the top 25th percentile.
2. Their Skill Keyword Match Count is in the bottom 50th percentile.
*Insight:* This flags highly capable, active engineers who write concise resumes and avoid keyword stuffing, often missing traditional ATS filters.

---

## 🤖 3. AI Integration Guide (`src/lib/gemini.ts`)

TalentOS uses Google's `gemini-2.5-flash` model strictly for the Job Description Analyzer.

### System Prompt & Schema
If you update the LLM prompt in `gemini.ts`, you **must** enforce this exact JSON output schema:
```json
{
  "archetypeMatrix": [
    { "label": "string", "matchPercent": 0-100, "description": "string" }
  ],
  "trajectoryDynamics": [
    { "timeframe": "string", "outcome": "string", "riskVector": "string" }
  ]
}
```
**Agent Instruction:** Do not inject markdown blocks or conversational text into the parser. The `analyzeJD` function uses a regex (`/```(?:json)?\s*([\s\S]*?)```/`) to strip formatting, but strict JSON enforcement via prompt engineering is preferred.

---

## 🎨 4. UI/UX Aesthetic Rules (For Frontend Agents)

When building new components or pages in `src/`, adhere strictly to the "Hacker/Cyberpunk Executive" aesthetic established in the codebase:

1. **Color Palette:**
   - Backgrounds: `#11131b` (Deep Obsidian)
   - Text: `#F5F5F5` (Off-white) and `#A1A1A1` (Muted Gray)
   - Accents: `#C7A36A` (Muted Gold) and `#779165` (Muted Green) for success/active states.
   - Errors/Alerts: `#ffb4ab` (Desaturated Red)

2. **Typography:**
   - Use `font-geist` for primary body text.
   - Use `font-geist-mono` for labels, metrics, timestamps, and console-like readouts.
   - Keep font sizes relatively small (`text-[9px]`, `text-[10px]`, `text-xs`) to maintain the "dense terminal" look.
   - Liberally use `uppercase` and `tracking-widest` on labels.

3. **Animations:**
   - Use `framer-motion` for all transitions.
   - Standard page transition: `{ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.25 } }`
   - Avoid bouncy or elastic animations. Keep eases sharp and professional `ease: [0.4, 0, 0.2, 1]`.

4. **Component Structure:**
   - Prefer borders (`border-white/5` or `border-white/10`) over drop shadows to create depth.
   - Use "Console Rows" (flex containers with mono-spaced elements) for tabular data.

---

## 🗺️ 5. Codebase Navigation Cheatsheet

### 🔧 Backend / Scripts
- `rank.cjs` — The core Node.js ranking algorithm. Modify heuristics here.
- `rank.py` — The Python equivalent. If you update `rank.cjs`, port your logic here.
- `submission_metadata.yaml` — Hackathon configuration and AI usage declaration.

### 🖥️ Frontend Routes (`src/App.tsx`)
- `<LandingPage />` — Introductory marketing view.
- `<DashboardPage />` — High-level metric aggregation.
- `<JDAnalyzerPage />` — The Gemini API ingestion console.
- `<RankingLedgerPage />` — The main list of scored candidates (`submission.csv` visualization).
- `<HiddenGemsPage />` — Filtered view of the Hidden Gems.
- `<ShortlistsPage />` — Kanban board for selected candidates.

### 📦 Essential Commands
- **Rank Candidates:** `node rank.cjs` (Ensure `candidates.jsonl` exists in root).
- **Run Frontend:** `npm run dev` (Requires `.env` with `VITE_GEMINI_API_KEY`).
- **Linting:** `npm run lint` (Do not ignore ESLint warnings for unused variables).
