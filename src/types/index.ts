import type { Timestamp } from 'firebase/firestore'

// ─── Jobs ────────────────────────────────────────────────────────────────────
export interface Job {
  id: string
  title: string
  jobCode: string          // e.g. "SF-INF-224"
  activeSince: Timestamp
  hiddenGemsCount: number
  status: 'active' | 'closed' | 'paused'
  rawJD?: string
  inferredProfile?: InferredProfile
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface InferredProfile {
  archetypeMatrix: ArchetypeCard[]
  trajectoryDynamics: TrajectoryDynamic[]
}

export interface ArchetypeCard {
  label: string
  matchPercent: number
  description: string
}

export interface TrajectoryDynamic {
  timeframe: string
  outcome: string
  riskVector: string
}

// ─── Candidates ──────────────────────────────────────────────────────────────
export interface Candidate {
  id: string
  name: string
  title: string
  avatarUrl?: string
  matchId: string            // e.g. "HG_0821"
  latentSignalPercent: number
  matchScore: number         // 0–100
  isHiddenGem: boolean
  omittedKeywords: string[]
  latentValueRationale: string
  alignmentProof: string
  unstructured_skills_narrative: string[]
  technical_projects: string[]
  jobId: string
  rank?: number
  createdAt: Timestamp
}

// ─── Shortlists ───────────────────────────────────────────────────────────────
export interface Shortlist {
  id: string
  candidateId: string
  candidateName: string
  candidateTitle: string
  jobId: string
  jobTitle: string
  matchScore: number
  addedAt: Timestamp
  addedBy: string            // Firebase Auth UID
}

// ─── Convenience ─────────────────────────────────────────────────────────────
export type NavRoute = 'landing' | 'dashboard' | 'job-analyzer' | 'ranking' | 'hidden-gems' | 'shortlists'
