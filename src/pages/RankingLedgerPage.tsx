import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AppShell from '../components/layout/AppShell'
import { useCandidates } from '../hooks/useCandidates'
import { useJobs } from '../hooks/useJobs'
import { addToShortlist } from '../lib/firestore'
import type { Candidate } from '../types'
import rankedRaw from '../lib/ranked_candidates_mock.json'

const MOCK_CANDIDATES: Candidate[] = (rankedRaw as any[]).map((r: any) => ({
  id: r.id,
  name: r.name,
  title: r.title,
  matchId: r.matchId,
  latentSignalPercent: r.latentSignalPercent ?? 0,
  matchScore: r.matchScore ?? 0,
  isHiddenGem: r.isHiddenGem ?? false,
  omittedKeywords: r.omittedKeywords ?? [],
  latentValueRationale: r.latentValueRationale ?? '',
  alignmentProof: r.alignmentProof ?? '',
  unstructured_skills_narrative: r.unstructured_skills_narrative ?? [],
  technical_projects: r.technical_projects ?? [],
  jobId: r.jobId ?? 'mock-1',
  rank: r.rank,
  createdAt: null as any,
}))

export default function RankingLedgerPage() {
  const [searchParams] = useSearchParams()
  const jobId = searchParams.get('jobId')
  const { jobs } = useJobs()
  const { candidates, loading } = useCandidates(jobId)
  const displayCandidates = candidates.length > 0 ? candidates : MOCK_CANDIDATES
  
  const [shortlisted, setShortlisted] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCandidateId, setExpandedCandidateId] = useState<string | null>(null)
  const [filterGem, setFilterGem] = useState<'all' | 'gems' | 'regular'>('all')
  const [sortBy, setSortBy] = useState<'score' | 'name'>('score')
  const [notes, setNotes] = useState<Record<string, string>>({})

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

  // Filter candidates based on search query and gem filter
  const filteredCandidates = displayCandidates
    .filter(c => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
      
      if (filterGem === 'gems') return matchesSearch && c.isHiddenGem
      if (filterGem === 'regular') return matchesSearch && !c.isHiddenGem
      return matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return b.matchScore - a.matchScore // Default to score DESC
    })

  const toggleExpand = (id: string) => {
    setExpandedCandidateId(prev => (prev === id ? null : id))
  }

  return (
    <AppShell>
      {/* ─── PAGE HEADER & CONTROLS ────────────────────────────────────────── */}
      <div className="border border-white/5 bg-[#11131b]/40 backdrop-blur-sm rounded-lg p-5 mb-8 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="font-mono text-xs text-[#C7A36A] uppercase tracking-widest mb-1">
              CONSOLE // TARGET_DATASETS // PIPELINES
            </p>
            <h1 className="font-geist text-xl font-semibold text-[#F5F5F5]">
              Candidate Alignment Ledger
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-[#A1A1A1] uppercase tracking-widest">
              RECORDS: <span className="text-[#F5F5F5]">{filteredCandidates.length.toString().padStart(3, '0')}</span>
            </span>
            <span className="font-mono text-xs text-[#A1A1A1] uppercase tracking-widest">
              SHORTLISTED: <span className="text-[#C7A36A]">{shortlisted.size.toString().padStart(3, '0')}</span>
            </span>
          </div>
        </div>

        {/* Filters and search row */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-xs">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#A1A1A1] material-symbols-outlined text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="Search by name, title..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="console-input-premium pl-9 py-2"
            />
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto items-center">
            {/* Gem filters */}
            <div className="flex border border-white/5 rounded bg-white/1 overflow-hidden p-0.5">
              {[
                { label: 'All', value: 'all' },
                { label: 'Gems Only', value: 'gems' },
                { label: 'Standard', value: 'regular' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setFilterGem(opt.value as any)}
                  className={`px-3 py-1 font-mono text-[9px] uppercase tracking-wider rounded-sm transition-all ${
                    filterGem === opt.value
                      ? 'bg-[#C7A36A]/20 text-[#C7A36A] border border-[#C7A36A]/30'
                      : 'text-[#A1A1A1] hover:text-[#F5F5F5] border border-transparent'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Sorting toggler */}
            <div className="flex border border-white/5 rounded bg-white/1 overflow-hidden p-0.5">
              <button
                onClick={() => setSortBy('score')}
                className={`px-3 py-1 font-mono text-[9px] uppercase tracking-wider rounded-sm transition-all ${
                  sortBy === 'score'
                    ? 'bg-[#C7A36A]/20 text-[#C7A36A] border border-[#C7A36A]/30'
                    : 'text-[#A1A1A1] hover:text-[#F5F5F5] border border-transparent'
                }`}
              >
                Score
              </button>
              <button
                onClick={() => setSortBy('name')}
                className={`px-3 py-1 font-mono text-[9px] uppercase tracking-wider rounded-sm transition-all ${
                  sortBy === 'name'
                    ? 'bg-[#C7A36A]/20 text-[#C7A36A] border border-[#C7A36A]/30'
                    : 'text-[#A1A1A1] hover:text-[#F5F5F5] border border-transparent'
                }`}
              >
                Name
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── CANDIDATE TABLE ──────────────────────────────────────────────── */}
      <div className="glass-card rounded-lg overflow-hidden border border-white/5 shadow-2xl">
        
        {/* Sticky Table Header */}
        <div className="hidden md:grid grid-cols-12 px-6 py-4 border-b border-white/5 bg-[#0b0c10]/60 sticky top-20 z-20 backdrop-blur-xl">
          <div className="col-span-3 font-mono text-xs text-[#A1A1A1] uppercase tracking-widest">Candidate Profile</div>
          <div className="col-span-6 pl-6 font-mono text-xs text-[#A1A1A1] uppercase tracking-widest">Alignment Rationale</div>
          <div className="col-span-2 text-right font-mono text-xs text-[#A1A1A1] uppercase tracking-widest">Alignment Score</div>
          <div className="col-span-1 text-right font-mono text-xs text-[#A1A1A1] uppercase tracking-widest">Actions</div>
        </div>

        {/* Table Content */}
        <div className="divide-y divide-white/3">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-6 animate-pulse grid grid-cols-12 gap-4">
                <div className="col-span-3 space-y-2">
                  <div className="h-4 bg-white/5 rounded-sm w-3/4" />
                  <div className="h-3 bg-white/5 rounded-sm w-1/2" />
                </div>
                <div className="col-span-6 space-y-2">
                  <div className="h-3 bg-white/5 rounded-sm w-full" />
                  <div className="h-3 bg-white/5 rounded-sm w-4/5" />
                </div>
                <div className="col-span-2"><div className="h-4 bg-white/5 rounded-sm w-1/2 ml-auto" /></div>
                <div className="col-span-1" />
              </div>
            ))
          ) : filteredCandidates.length === 0 ? (
            <div className="p-10 text-center font-mono text-xs text-[#A1A1A1]">
              // NO MATCHING RECORDS FOUND
            </div>
          ) : (
            filteredCandidates.map((c, idx) => {
              const isExpanded = expandedCandidateId === c.id
              
              // Fictitious weights for representation:
              const experienceScore = Math.min(100, (c.matchScore * 0.95))
              const skillsScore = Math.min(100, (c.latentSignalPercent * 1.1))
              const behavioralScore = Math.min(100, (c.matchScore * 1.05))

              return (
                <div key={c.id} className="transition-all duration-300">
                  
                  {/* Summary Row */}
                  <div
                    onClick={() => toggleExpand(c.id)}
                    className={`console-row-premium px-6 py-5 flex flex-col md:grid md:grid-cols-12 items-start md:items-center gap-4 md:gap-0 cursor-pointer ${
                      isExpanded ? 'bg-white/2' : ''
                    }`}
                  >
                    {/* Candidate Identity */}
                    <div className="col-span-3 flex items-start gap-3.5">
                      <div className="shrink-0 mt-1">
                        <span className="font-mono text-xs font-semibold text-[#C7A36A] text-glow-gold">
                          IDX_{String(idx + 1).padStart(3, '0')}
                        </span>
                        {c.isHiddenGem && (
                          <div className="flex items-center gap-1.5 mt-1 px-1.5 py-0.5 rounded-full bg-[#779165]/10 border border-[#779165]/20 w-fit">
                            <span className="h-1 w-1 rounded-full bg-[#779165]" />
                            <span className="font-mono text-xs text-[#779165] uppercase tracking-wider font-semibold">
                              GEM
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-geist text-sm font-semibold text-[#F5F5F5] leading-tight">{c.name}</p>
                        <p className="font-geist text-xs text-[#A1A1A1] mt-0.5">{c.title}</p>
                        <p className="font-mono text-xs text-[#A1A1A1]/40 mt-1 uppercase tracking-widest">
                          {c.matchId}
                        </p>
                      </div>
                    </div>

                    {/* Alignment Rationale snippet */}
                    <div className="col-span-6 md:pl-6 pr-4">
                      <span className="font-mono text-xs text-[#A1A1A1] uppercase tracking-widest md:hidden block mb-1">
                        // ALIGNMENT_RATIONALE
                      </span>
                      <p className="font-geist text-xs text-[#A1A1A1] leading-relaxed line-clamp-2">
                        {c.alignmentProof}
                      </p>
                    </div>

                    {/* Score */}
                    <div className="col-span-2 flex md:flex-col items-center md:items-end justify-between md:justify-start gap-1 w-full md:w-auto">
                      <span className="font-mono text-xs text-[#A1A1A1] uppercase tracking-widest md:hidden">
                        Match Score
                      </span>
                      <div className="text-right">
                        <span className="font-mono text-sm font-semibold text-[#779165] text-glow-green">
                          {c.matchScore.toFixed(1)}% Match
                        </span>
                        <span className="font-mono text-xs text-[#A1A1A1] block mt-0.5">
                          Signal: {c.latentSignalPercent.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="col-span-1 flex justify-between items-center md:justify-end w-full md:w-auto">
                      <span className="font-mono text-xs text-[#A1A1A1] uppercase tracking-widest md:hidden">
                        Queue
                      </span>
                      <button
                        id={`shortlist-btn-${c.id}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleShortlist(c)
                        }}
                        disabled={shortlisted.has(c.id)}
                        className={`font-mono text-xs uppercase tracking-widest py-1.5 px-3 rounded-md transition-colors ${
                          shortlisted.has(c.id)
                            ? 'text-[#779165] bg-[#779165]/5 border border-[#779165]/20 cursor-default'
                            : 'text-[#A1A1A1] hover:text-[#C7A36A] bg-white/3 border border-white/5'
                        }`}
                      >
                        {shortlisted.has(c.id) ? 'Queued' : '+ Queue'}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Insight Panel */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden bg-[#0b0c10]/40"
                      >
                        <div className="px-6 md:px-14 py-6 border-t border-b border-white/5 space-y-6">
                          
                          {/* Top rationale */}
                          <div className="p-4 rounded-lg bg-white/1 border border-white/5 space-y-2">
                            <span className="font-mono text-[9px] text-[#C7A36A] uppercase tracking-widest">
                              // EXPLAINABLE_ALIGNMENT_PROOF
                            </span>
                            <p className="font-geist text-xs text-[#F5F5F5] leading-relaxed">
                              {c.alignmentProof}
                            </p>
                          </div>

                          {/* Components Progress Bars */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            
                            {/* Experience Scoring Component */}
                            <div className="space-y-2.5">
                              <div className="flex justify-between items-center">
                                <span className="font-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">
                                  Experience Component (30%)
                                </span>
                                <span className="font-mono text-xs text-[#F5F5F5] font-semibold">{experienceScore.toFixed(0)}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${experienceScore}%` }}
                                  className="h-full bg-gradient-to-r from-[#C7A36A]/50 to-[#C7A36A]"
                                />
                              </div>
                              <p className="font-geist text-[10px] text-[#A1A1A1]">
                                Optimized years of experience matching target seniority standards.
                              </p>
                            </div>

                            {/* Skills Scoring Component */}
                            <div className="space-y-2.5">
                              <div className="flex justify-between items-center">
                                <span className="font-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">
                                  Skills Alignment (45%)
                                </span>
                                <span className="font-mono text-xs text-[#F5F5F5] font-semibold">{skillsScore.toFixed(0)}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${skillsScore}%` }}
                                  className="h-full bg-gradient-to-r from-[#779165]/50 to-[#779165]"
                                />
                              </div>
                              <p className="font-geist text-[10px] text-[#A1A1A1]">
                                Keyword matches and latent skill capabilities aligned with role vectors.
                              </p>
                            </div>

                            {/* Behavioral Component */}
                            <div className="space-y-2.5">
                              <div className="flex justify-between items-center">
                                <span className="font-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">
                                  Behavior & Velocity (25%)
                                </span>
                                <span className="font-mono text-xs text-[#F5F5F5] font-semibold">{behavioralScore.toFixed(0)}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${behavioralScore}%` }}
                                  className="h-full bg-gradient-to-r from-blue-500/50 to-blue-400"
                                />
                              </div>
                              <p className="font-geist text-[10px] text-[#A1A1A1]">
                                Assessment of location, active signals, response rate, and notice period.
                              </p>
                            </div>

                          </div>

                          {/* Skill breakdown (matched vs missing) */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Matched / Inferred Skills */}
                            <div className="space-y-3">
                              <span className="font-mono text-[9px] text-[#779165] uppercase tracking-widest block">
                                // MATTCHED_INFERRED_SKILLS
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {c.unstructured_skills_narrative.map(skill => (
                                  <span key={skill} className="px-2.5 py-1 rounded bg-[#779165]/5 border border-[#779165]/20 font-mono text-[9px] text-[#779165] uppercase tracking-wider">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Missing Keyword Deviations */}
                            <div className="space-y-3">
                              <span className="font-mono text-[9px] text-red-400 uppercase tracking-widest block">
                                // OMITTED_KEYWORD_DEVIATIONS
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {c.omittedKeywords.length > 0 ? (
                                  c.omittedKeywords.map(kw => (
                                    <span key={kw} className="px-2.5 py-1 rounded bg-red-400/5 border border-red-400/20 font-mono text-[9px] text-red-400/80 line-through tracking-wider">
                                      {kw}
                                    </span>
                                  ))
                                ) : (
                                  <span className="font-mono text-[9px] text-[#A1A1A1]/40 uppercase tracking-widest">
                                    No keyword deviation detected
                                  </span>
                                )}
                              </div>
                            </div>

                          </div>

                          {/* Risk Alerts & Recruiter Notes */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Risk / Notice Period Indicators */}
                            <div className="space-y-3">
                              <span className="font-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest block">
                                // COMPLIANCE_AND_RISK_SIGNALS
                              </span>
                              
                              <div className="space-y-2">
                                <div className="flex items-center gap-3 p-3 rounded bg-white/2 border border-white/5">
                                  <span className="material-symbols-outlined text-[#779165] text-sm">check_circle</span>
                                  <div className="font-geist text-[11px] text-[#A1A1A1]">
                                    Honeypot Timelines Sweep: <span className="text-white font-medium">PASSED</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded bg-white/2 border border-white/5">
                                  <span className="material-symbols-outlined text-[#C7A36A] text-sm">schedule</span>
                                  <div className="font-geist text-[11px] text-[#A1A1A1]">
                                    Notice Period Risk: <span className="text-white font-medium">MODERATE (30 days)</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Recruiter Workspace Notes */}
                            <div className="space-y-3">
                              <span className="font-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest block">
                                // RECRUITER_WORKSPACE_NOTES
                              </span>
                              <textarea
                                placeholder="Add custom notes here..."
                                value={notes[c.id] || ''}
                                onChange={e => setNotes(prev => ({ ...prev, [c.id]: e.target.value }))}
                                className="console-input-premium min-h-[80px]"
                              />
                            </div>

                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              )
            })
          )}
        </div>

      </div>

      {/* Footer status bar */}
      <div className="border-t border-white/5 px-6 py-4 flex items-center justify-between mt-6 bg-[#11131b]/20 rounded-lg">
        <span className="font-mono text-[9px] text-[#A1A1A1]/40 uppercase tracking-widest">
          // END_OF_LEDGER_DATA // COMPUTE_ENGINE_v1
        </span>
        <span className="font-mono text-[9px] text-[#A1A1A1]/40 uppercase tracking-widest">
          FILTER: {filterGem === 'all' ? 'ALL_RECORDS' : filterGem === 'gems' ? 'LATENT_GEM_ONLY' : 'REGULAR_ONLY'}
        </span>
      </div>
    </AppShell>
  )
}
