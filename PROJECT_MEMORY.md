# TalentOS Project Memory

## 🌟 Project Identity
**Name:** TalentOS  
**Purpose:** An enterprise-grade, AI-powered talent discovery, analysis, and ranking platform built for the **India Runs Data and AI Challenge** (Redrob Hackathon).

## 🏗️ Core Architecture & Tech Stack
- **Frontend UI:** React 18, TypeScript, Vite, Tailwind CSS
- **Backend / Database:** Firebase Firestore
- **AI Integration:** Google Gemini 2.5 Flash
- **Ranking Engine:** Node.js (`rank.cjs`) and Python (`rank.py`)

## 🔑 Key Components
1. **High-Performance Deterministic Ranking Engine**
   - Runs locally on standard CPUs in ~45 seconds for 100k+ records.
   - 100% network-independent and deterministic.
   - Multi-signal scoring: Experience (30%), Skills Density (45%), Behavioral (25%).
   - Includes **Honeypot/Fraud Filters** to drop fake candidates (e.g. invalid timelines, irrelevant job titles).
   
2. **Glassmorphic Recruiter Dashboard**
   - Immersive UI with high-fidelity graphics.
   - Features: High-level KPI dashboard, JD analyzer with Gemini, Ranking ledger, "Hidden Gems" list, and a Kanban-style shortlist pipeline.

## 🧠 Scoring & Rules
- **Experience (30%):** Sweet-spot curve for Senior roles (6-8 years optimal). Checks for ML/AI career density. Penalizes exclusive outsourcing firm histories.
- **Skills (45%):** Categorized into Vector DBs, Embeddings & Search, Python, and Retrieval Evaluation. Penalizes keyword-stuffed resumes that claim unrelated fields without core skills.
- **Behavioral (25%):** Evaluates geolocation, notice period, response rate, activity recency, and "open-to-work" flags.
- **Hidden Gems:** Identifies candidates with top quartile foundational skills but zero buzzwords, surfacing strong developers often missed by traditional ATS.

## 📂 Important Files & Execution
- `rank.cjs` / `rank.py`: The core deterministic candidate rankers.
- `validate_local.cjs`: Validation script for `submission.csv`.
- `src/lib/gemini.ts` & `src/lib/firestore.ts`: Connectors for Gemini AI and Firebase.
- Dataset Location: `[PUB] India_runs_data_and_ai_challenge/India_runs_data_and_ai_challenge/candidates.jsonl`.
- **Run the Ranker:** `node rank.cjs`
- **Run the Web App:** `npm run dev`

---
*This file serves as a memory context for AI assistants and developers navigating the TalentOS workspace.*
