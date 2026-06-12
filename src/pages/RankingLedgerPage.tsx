import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import { useCandidates } from '../hooks/useCandidates'
import { useJobs } from '../hooks/useJobs'
import { addToShortlist } from '../lib/firestore'
import { serverTimestamp } from 'firebase/firestore'
import type { Candidate } from '../types'

const MOCK_CANDIDATES: Candidate[] = [
  {
    id: 'm1', name: 'Alexandre V.', title: 'Lead Systems Architect', matchId: 'AL-001',
    latentSignalPercent: 98.4, matchScore: 94, isHiddenGem: false,
    omittedKeywords: ['Kubernetes', 'Microservices'],
    latentValueRationale: '',
    alignmentProof: 'Deep expertise in distributed systems mirrors the core requirements for the Project Orion initiative. Neural analysis indicates a 98.4% correlation between previous infrastructure scaling and current technical debt resolution targets. Semantic mapping confirms governance-layer competency extends beyond surface-level certifications.',
    unstructured_skills_narrative: [], technical_projects: [], jobId: 'mock-1', rank: 1,
    createdAt: null as any,
  },
  {
    id: 'm2', name: 'Elena Rostova', title: 'Principal Product Designer', matchId: 'ER-002',
    latentSignalPercent: 96.8, matchScore: 91, isHiddenGem: false,
    omittedKeywords: ['Figma', 'Design Systems'],
    latentValueRationale: '',
    alignmentProof: 'Cognitive behavioral modeling matches user experience vision for the 2025 roadmap. Sentiment analysis on portfolio narrative demonstrates high alignment with Cinematic Dark aesthetic and precision-driven interaction design. Cross-disciplinary systems thinking validated across 12 enterprise-grade products.',
    unstructured_skills_narrative: [], technical_projects: [], jobId: 'mock-1', rank: 2,
    createdAt: null as any,
  },
  {
    id: 'm3', name: 'Julian Thorne', title: 'ML Engineer', matchId: 'JT-003',
    latentSignalPercent: 94.2, matchScore: 89, isHiddenGem: true,
    omittedKeywords: ['PyTorch', 'NLP', 'LLM'],
    latentValueRationale: '',
    alignmentProof: 'Advanced knowledge of transformer models and vector databases satisfies 100% of the primary skill lattice. Latent capability detection suggests rapid adaptation to proprietary OS architecture within a 3-week window. Prior work on inference pipeline optimization shows direct applicability.',
    unstructured_skills_narrative: [], technical_projects: [], jobId: 'mock-1', rank: 3,
    createdAt: null as any,
  },
  {
    id: 'm4', name: 'Sarah Jenkins', title: 'VP of Engineering', matchId: 'SJ-004',
    latentSignalPercent: 91.0, matchScore: 87, isHiddenGem: false,
    omittedKeywords: ['Agile', 'OKRs'],
    latentValueRationale: '',
    alignmentProof: 'Leadership entropy analysis suggests a stabilizing force for the core engineering team. Significant experience navigating Series C to Public transition matches the current growth trajectory identified in internal board memos. Operational throughput metrics exceed benchmark by 2.3x.',
    unstructured_skills_narrative: [], technical_projects: [], jobId: 'mock-1', rank: 4,
    createdAt: null as any,
  },
  {
    id: 'm5', name: 'Dmitri Volkov', title: 'Platform Reliability Engineer', matchId: 'DV-005',
    latentSignalPercent: 88.7, matchScore: 83, isHiddenGem: false,
    omittedKeywords: ['Terraform', 'SLO'],
    latentValueRationale: '',
    alignmentProof: 'Incident response framework architecture directly maps to reliability targets outlined in the technical brief. SRE-adjacent track record with 99.97% uptime SLA management. Deep familiarity with observability tooling including distributed tracing and real-time anomaly detection systems.',
    unstructured_skills_narrative: [], technical_projects: [], jobId: 'mock-1', rank: 5,
    createdAt: null as any,
  },
]

export default function RankingLedgerPage() {
  const [searchParams] = useSearchParams()
  const jobId = searchParams.get('jobId')
  const { jobs } = useJobs()
  const { candidates, loading } = useCandidates(jobId)
  const displayCandidates = candidates.length > 0 ? candidates : MOCK_CANDIDATES
  const [shortlisted, setShortlisted] = useState<Set<string>>(new Set())

  const handleShortlist = async (c: Candidate) => {
    if (shortlisted.has(c.id)) return
    setShortlisted(prev => new Set(prev).add(c.id))
    try {
      const job = jobs.find(j => j.id === jobId)
      await addToShortlist({
        candidateId: c.id,
        candidateName: c.name,
        candidateTitle: c.title,
        jobId: jobId || 'mock-1',
        jobTitle: job?.title || 'Staff Infrastructure Engineer',
        matchScore: c.matchScore,
        addedBy: 'demo-user',
      })
    } catch (_) {}
  }

  return (
    <AppShell>
      {/* Page path header */}
      <div className="border-b border-white/5 px-6 md:px-8 py-4 flex items-center justify-between">
        <p className="console-path">
          CONSOLE <span className="text-white/15 mx-1">//</span>
          TARGET_DATASETS <span className="text-white/15 mx-1">//</span>
          <span className="text-[#C7A36A]">PIPELINES</span>
        </p>
        <div className="flex items-center gap-4">
          <span className="font-geist-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">
            RECORDS: <span className="text-[#F5F5F5]">{displayCandidates.length.toString().padStart(3, '0')}</span>
          </span>
          <span className="font-geist-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">
            SORT: <span className="text-[#C7A36A]">ALIGN_SCORE_DESC</span>
          </span>
        </div>
      </div>

      {/* Column header row */}
      <div className="console-col-header hidden md:grid grid-cols-12 px-6 md:px-8 py-3">
        <div className="col-span-3">CANDIDATE_PTR // IDENTITY</div>
        <div className="col-span-6 pl-6">EXPLAINABLE_ALIGNMENT_RATIONALE</div>
        <div className="col-span-2 text-right">ALIGN_SCORE</div>
        <div className="col-span-1 text-right">ACTION</div>
      </div>

      {/* Candidate rows */}
      <div>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="console-row grid grid-cols-12 px-6 md:px-8 py-5">
                <div className="col-span-3 flex items-start gap-3">
                  <div className="h-3 w-14 bg-white/5 rounded-sm animate-pulse" />
                  <div className="flex flex-col gap-2">
                    <div className="h-2.5 w-28 bg-white/5 rounded-sm animate-pulse" />
                    <div className="h-2 w-20 bg-white/5 rounded-sm animate-pulse" />
                  </div>
                </div>
                <div className="col-span-6 pl-6">
                  <div className="h-2 w-full bg-white/5 rounded-sm animate-pulse mb-2" />
                  <div className="h-2 w-4/5 bg-white/5 rounded-sm animate-pulse mb-2" />
                  <div className="h-2 w-3/5 bg-white/5 rounded-sm animate-pulse" />
                </div>
                <div className="col-span-2 text-right">
                  <div className="h-3 w-24 bg-white/5 rounded-sm animate-pulse ml-auto" />
                </div>
                <div className="col-span-1" />
              </div>
            ))
          : displayCandidates.map((c, idx) => (
              <div key={c.id} className="console-row grid grid-cols-1 md:grid-cols-12 px-6 md:px-8 py-5 gap-4 md:gap-0">

                {/* Cols 1–3: IDX pointer + identity */}
                <div className="col-span-1 md:col-span-3 flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    <span className="console-idx">
                      IDX_{String(idx + 1).padStart(3, '0')}
                    </span>
                    {c.isHiddenGem && (
                      <span className="block font-geist-mono text-[8px] text-[#C7A36A] uppercase tracking-widest mt-1">
                        HG_FLAGGED
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-geist text-xs font-medium text-[#F5F5F5] leading-tight">{c.name}</p>
                    <p className="font-geist text-[11px] text-[#A1A1A1] mt-0.5">{c.title}</p>
                    <p className="font-geist-mono text-[9px] text-[#A1A1A1]/60 mt-1 uppercase tracking-widest">
                      {c.matchId}
                    </p>
                  </div>
                </div>

                {/* Cols 4–9: Alignment rationale */}
                <div className="col-span-1 md:col-span-6 md:pl-6">
                  {/* Mobile label */}
                  <p className="font-geist-mono text-[9px] uppercase tracking-widest text-[#A1A1A1] mb-1 md:hidden">
                    // ALIGNMENT_RATIONALE
                  </p>
                  <p className="font-geist text-[11px] text-[#A1A1A1] leading-relaxed">
                    {c.alignmentProof}
                  </p>
                </div>

                {/* Cols 10–12: Score + action */}
                <div className="col-span-1 md:col-span-2 flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2">
                  <div className="text-right">
                    <span className="console-metric block">
                      {c.matchScore.toFixed(2)}%_ALIGN_MATCH
                    </span>
                    <span className="font-geist-mono text-[9px] text-[#A1A1A1] mt-0.5 block">
                      SIG: {c.latentSignalPercent.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-1 flex md:justify-end items-start">
                  <button
                    id={`shortlist-btn-${c.id}`}
                    onClick={() => handleShortlist(c)}
                    disabled={shortlisted.has(c.id)}
                    className={[
                      'font-geist-mono text-[9px] uppercase tracking-widest transition-colors duration-150',
                      shortlisted.has(c.id)
                        ? 'text-[#779165] cursor-default'
                        : 'text-[#A1A1A1] hover:text-[#C7A36A]',
                    ].join(' ')}
                  >
                    {shortlisted.has(c.id) ? '[QUEUED]' : '[+ QUEUE]'}
                  </button>
                </div>
              </div>
            ))}
      </div>

      {/* Footer status row */}
      <div className="border-t border-white/5 px-6 md:px-8 py-3 flex items-center justify-between">
        <span className="font-geist-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">
          // END_OF_PIPELINE_RECORDS
        </span>
        <span className="font-geist-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">
          SHORTLISTED: <span className="text-[#C7A36A]">{shortlisted.size.toString().padStart(3, '0')}</span>
        </span>
      </div>
    </AppShell>
  )
}
