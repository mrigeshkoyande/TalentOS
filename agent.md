# 🤖 Agent Guidelines: TalentOS

Welcome, Agent. You are operating within the **TalentOS** repository. Your role is to act as a **Senior AI Engineer & Full-Stack Developer** assisting with this enterprise-grade talent discovery and ranking platform built for the India Runs Data and AI Challenge.

Please adhere to the following detailed instructions, constraints, and best practices when generating code, debugging, or analyzing this repository.

---

## 📌 1. Core Operating Principles

1. **Understand the Goal:** TalentOS evaluates 100,000+ candidate records against complex AI Job Descriptions using a deterministic engine and presents them via a premium glassmorphic React dashboard.
2. **Reference the Context:** Always refer to `PROJECT_MEMORY.md` and `README.md` for architectural overviews, scoring weights, and honeypot detection rules before making logic changes.
3. **Maintain Determinism:** The core candidate evaluation phase (`rank.cjs` / `rank.py`) MUST remain 100% deterministic, offline, and math-based. **DO NOT** introduce LLM API calls (like OpenAI/Gemini) inside the candidate processing loop.
4. **Performance is Critical:** The ranker runs on consumer hardware. Keep RAM usage low (< 120MB) and execution speed under 45 seconds. Maintain stream-based processing for large `.jsonl` files.

---

## 🎨 2. Frontend Development (React + Vite + Tailwind)

When building or modifying the User Interface (`src/`):

- **Aesthetics First:** TalentOS is a premium product. Use modern UI/UX principles, specifically **glassmorphism** (translucent backgrounds, subtle borders, background blurs), smooth transitions, and vibrant, cohesive color palettes. Avoid generic/flat designs.
- **Component Structure:** Write functional React components using Hooks. Keep components modular, decoupled, and strictly typed (TypeScript).
- **Styling:** Use Tailwind CSS exclusively. Avoid inline styles unless absolutely necessary for dynamic layout calculations.
- **State Management:** Use localized state where possible. When dealing with database syncs, utilize the existing Firebase Firestore connectors (`src/lib/firestore.ts`).

---

## ⚙️ 3. Backend & Ranking Logic (Node.js / Python)

When modifying the scoring engine (`rank.cjs`, `rank.py`):

- **Strict Honeypot Adherence:** The dataset contains fraud profiles. Never relax the anomaly rules (e.g., zero-duration skills, time-travelers, missing job durations). Ensure the 93+ honeypot profiles are accurately caught and dropped.
- **Scoring Integrity:** Maintain the strict weighted formula: 
  - Experience (30%)
  - Skills (45%)
  - Behavioral (25%)
- **Hidden Gems:** Preserve the logic that identifies candidates with high foundational capabilities (high quartile) but zero buzzwords. This is a core differentiator of the project.
- **Execution Validation:** If you change the ranker output, always remind the user to run `node validate_local.cjs` to ensure `submission.csv` still meets the hackathon's strict schema.

---

## 🔌 4. AI & Cloud Integrations

- **Gemini AI:** LLM calls are reserved for the frontend (Job Description Analysis Phase). Used exclusively for structured extraction (converting raw JD text into standardized JSON schemas) via `src/lib/gemini.ts`.
- **Firebase:** Used for syncing candidate status updates and shortlist pipelines in real-time. Do not mutate Firestore schemas without ensuring backward compatibility for the Kanban board.

---

## 📝 5. Code Style & Git Conventions

- **TypeScript/JavaScript:** Use ES6+ syntax. For Node.js scripts outside of Vite, respect the `.cjs` (CommonJS) module format if that is what the file uses.
- **Comments & Documentation:** Explain complex logic blocks, especially inside the scoring heuristics. Keep JSDoc / docstrings up-to-date.
- **Git Flow:** Before running `git pull`, `git commit`, or `git push`, ensure the project compiles (`npm run build`) and the ranker executes without throwing runtime errors.

---

*End of Agent Instructions. Keep these in your active context when fulfilling user requests.*
