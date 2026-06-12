<div align="center">
  <h1>🚀 TalentOS</h1>
  <p><strong>A next-generation, AI-powered talent management and recruiting operating system.</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React 18" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase" />
    <img src="https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
  </p>
</div>

<br />

## 🌟 Overview

**TalentOS** is a modern, responsive web application designed to streamline and supercharge the recruitment process. By leveraging the advanced reasoning capabilities of **Google's Generative AI (Gemini)** alongside a robust modern frontend stack, TalentOS helps recruiters analyze job descriptions, discover hidden talent gems, and manage candidate pipelines with unparalleled efficiency.

---

## 🏗️ System Architecture

The application follows a modern serverless architecture, integrating directly with Firebase for backend services and Google Gemini for AI capabilities.

```mermaid
graph TD
    %% Define Nodes
    User(["Recruiter"])
    UI["TalentOS Frontend (React + Tailwind)"]
    Firebase[("Firebase (Auth, Firestore, Storage)")]
    Gemini["Google Gemini AI (LLM Processing)"]

    %% Define Connections
    User -->|"Interacts with UI"| UI
    UI <-->|"Manages State and Routing"| UI
    UI <-->|"Authentication and Data Persistence"| Firebase
    UI <-->|"Sends JDs and Resumes, Receives Insights and Scores"| Gemini

    %% Styling
    classDef frontend fill:#38bdf8,stroke:#0284c7,stroke-width:2px,color:white;
    classDef database fill:#fbbf24,stroke:#b45309,stroke-width:2px,color:white;
    classDef ai fill:#a855f7,stroke:#6b21a8,stroke-width:2px,color:white;
    
    class UI frontend;
    class Firebase database;
    class Gemini ai;
```

---

## 🔄 Core Workflow

Below is the standard workflow of how TalentOS processes recruitment data to provide intelligent insights.

```mermaid
sequenceDiagram
    autonumber
    actor R as Recruiter
    participant TOS as TalentOS App
    participant AI as Gemini AI
    participant DB as Firebase DB

    R->>TOS: Uploads Job Description (JD)
    TOS->>AI: Sends JD for Deep Analysis
    AI-->>TOS: Returns Extracted Skills & Requirements
    R->>TOS: Uploads Candidate Profiles
    TOS->>AI: Requests JD-Candidate Match Scoring
    AI-->>TOS: Returns Match Scores & Identifies "Hidden Gems"
    TOS->>DB: Persists Candidate Data & Rankings
    TOS-->>R: Displays Interactive Ranking Ledger
```

---

## ✨ Key Features

- **📊 Interactive Dashboard**: Get a bird's-eye view of your recruitment pipeline and key metrics with beautiful, responsive charts and lists.
- **📝 JD Analyzer**: Upload or paste job descriptions to automatically extract core requirements, essential skills, and generate intelligent candidate matching criteria.
- **🏆 Candidate Ranking Ledger**: Automatically rank and score candidates based on job fit using advanced natural language processing.
- **💎 Hidden Gems Discovery**: Uncover high-potential candidates who might not fit the traditional mold (e.g., missing specific keywords) but possess highly transferable skills.
- **📋 Shortlists Management**: Organize, track, and manage your curated lists of top candidates effortlessly with drag-and-drop or categorized workflows.

---

## 🛠️ Technology Stack

| Category               | Technology                                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Frontend Framework** | [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)                                                |
| **Language**           | [TypeScript](https://www.typescriptlang.org/)                                                                 |
| **Styling & UI**       | [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)                    |
| **Routing**            | [React Router v6](https://reactrouter.com/)                                                                   |
| **Icons**              | [Lucide React](https://lucide.dev/)                                                                           |
| **Backend / BaaS**     | [Firebase](https://firebase.google.com/)                                                                      |
| **AI Integration**     | [Google Generative AI (Gemini)](https://ai.google.dev/)                                                       |

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `yarn` installed

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd TalentOS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory based on the `.env.local.example` file and populate it with your specific credentials:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   
   # Gemini AI Configuration
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

### Development Server

Start the Vite development server with hot-module replacement (HMR):

```bash
npm run dev
```

Navigate to `http://localhost:5173` in your browser to view the application.

---

## 📦 Building for Production

To create an optimized production build:

```bash
npm run build
```

To preview the compiled production build locally before deploying:

```bash
npm run preview
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
