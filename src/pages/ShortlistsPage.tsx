import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as XLSX from 'xlsx'
import AppShell from '../components/layout/AppShell'
import { useShortlists } from '../hooks/useShortlists'
import { removeFromShortlist } from '../lib/firestore'
import type { Shortlist } from '../types'
import rankedRaw from '../lib/ranked_candidates_mock.json'

const STAGE_KEYS = ['review', 'tech', 'design', 'executive', 'offer']

const MOCK_SHORTLISTS: Shortlist[] = (rankedRaw as any[]).map((r: any, idx: number) => ({
  id: `sl-${(idx + 1).toString().padStart(3, '0')}`,
  candidateId: r.id,
  candidateName: r.name || 'Candidate',
  candidateTitle: r.title || 'Senior AI Engineer',
  jobId: r.jobId || 'mock-1',
  jobTitle: 'Senior AI Engineer',
  matchScore: r.matchScore ?? 90,
  addedBy: 'demo-user',
  addedAt: null as any,
  stage: STAGE_KEYS[idx % STAGE_KEYS.length]
} as any))

const STAGES = [
  { id: 'review', label: 'Screening', color: 'border-blue-500/20' },
  { id: 'tech', label: 'Tech Evaluation', color: 'border-yellow-500/20' },
  { id: 'design', label: 'System Design', color: 'border-purple-500/20' },
  { id: 'executive', label: 'Executive Loop', color: 'border-[#C7A36A]/20' },
  { id: 'offer', label: 'Offer', color: 'border-[#779165]/20' },
]

export default function ShortlistsPage() {
  const { shortlists: liveShortlists, loading } = useShortlists('demo-user')
  
  // Combine database shortlists with full 100 AI ranked candidates
  const liveCandidateIds = new Set(liveShortlists.map(s => s.candidateId))
  const missingMock = MOCK_SHORTLISTS.filter(m => !liveCandidateIds.has(m.candidateId))
  const baseShortlists = liveShortlists.length > 0 ? [...liveShortlists, ...missingMock] : (loading ? [] : MOCK_SHORTLISTS)

  // Kanban CRM stage assignments state
  const [stagesMap, setStagesMap] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    MOCK_SHORTLISTS.forEach(item => {
      initial[item.id] = (item as any).stage || 'review'
    })
    return initial
  })

  const handleRemove = async (id: string) => {
    try { 
      await removeFromShortlist(id) 
    } catch (_) {}
  }

  // Assign shortlists to their mapped stage
  const shortlists = baseShortlists.map(item => {
    const stage = stagesMap[item.id] || (item as any).stage || 'review'
    return { ...item, stage }
  })

  const handleExportMatrix = () => {
    if (shortlists.length === 0) return

    const exportData = shortlists.map((s, idx) => {
      const stageObj = STAGES.find(st => st.id === s.stage)
      const rawCandidate = (rankedRaw as any[]).find(r => r.id === s.candidateId)
      return {
        Rank: idx + 1,
        'Shortlist ID': s.id,
        'Candidate ID': s.candidateId,
        'Candidate Name': s.candidateName,
        'Current Title': s.candidateTitle,
        'Target Role': s.jobTitle,
        'Match Score %': `${s.matchScore}%`,
        'Pipeline Stage': stageObj ? stageObj.label : s.stage,
        'AI Alignment Reasoning': rawCandidate ? rawCandidate.alignmentProof : ''
      }
    })

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(exportData)

    // Set column auto-widths
    ws['!cols'] = [
      { wch: 6 },  // Rank
      { wch: 14 }, // Shortlist ID
      { wch: 16 }, // Candidate ID
      { wch: 24 }, // Name
      { wch: 28 }, // Title
      { wch: 22 }, // Target Role
      { wch: 14 }, // Match Score %
      { wch: 18 }, // Pipeline Stage
      { wch: 90 }  // AI Alignment Reasoning
    ]

    XLSX.utils.book_append_sheet(wb, ws, "Shortlist Selection Matrix")
    XLSX.writeFile(wb, "TalentOS_Shortlist_Selection_Matrix.xlsx")
  }

  // Move card to a different stage
  const moveStage = (itemId: string, direction: 'forward' | 'backward') => {
    const currentStage = stagesMap[itemId] || 'review'
    const currentIndex = STAGES.findIndex(s => s.id === currentStage)
    
    let nextIndex = currentIndex
    if (direction === 'forward' && currentIndex < STAGES.length - 1) {
      nextIndex = currentIndex + 1
    } else if (direction === 'backward' && currentIndex > 0) {
      nextIndex = currentIndex - 1
    }
    
    setStagesMap(prev => ({
      ...prev,
      [itemId]: STAGES[nextIndex].id
    }))
  }

  return (
    <AppShell>
      {/* ─── BREADCRUMB HEADER ────────────────────────────────────────────── */}
      <div className="border border-white/5 bg-[#11131b]/40 backdrop-blur-sm rounded-lg p-5 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="font-mono text-xs text-[#C7A36A] uppercase tracking-widest mb-1">
              CONSOLE // SELECTION_MATRIX // EXPORT_QUEUE
            </p>
            <h1 className="font-geist text-lg font-medium text-[#F5F5F5]">
              Shortlist Selection Matrix
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-[#A1A1A1] uppercase tracking-widest">
              QUEUED: <span className="text-[#C7A36A]">{shortlists.length.toString().padStart(3, '0')}</span>
            </span>
            <span className="font-mono text-xs text-[#A1A1A1] uppercase tracking-widest">
              STATUS: <span className="text-[#779165] font-semibold text-glow-green">READY_FOR_EXPORT</span>
            </span>
          </div>
        </div>
      </div>

      {/* ─── PIPELINE ANALYTICS STRIP ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {[
          { label: 'Screen Pass Rate', value: '78%', desc: 'Hiring pipeline conversion', trend: '+4% this month' },
          { label: 'Time-in-Stage', value: '4.2 days', desc: 'Average candidates step cycle', trend: '-0.8 days' },
          { label: 'Hiring Velocity', value: '14.5 days', desc: 'Avg duration to offer extended', trend: 'Optimal threshold' },
        ].map(metric => (
          <div key={metric.label} className="glass-card p-5 rounded-lg flex flex-col justify-between aspect-[2.2/1]">
            <div>
              <span className="font-mono text-xs text-[#A1A1A1] uppercase tracking-widest block mb-1">
                {metric.label}
              </span>
              <span className="font-display text-2xl font-medium text-[#F5F5F5]">
                {metric.value}
              </span>
            </div>
            <div>
              <p className="font-geist text-xs text-[#A1A1A1]">{metric.desc}</p>
              <span className="font-mono text-xs text-[#779165] uppercase tracking-widest block mt-1">
                {metric.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ─── KANBAN BOARD CRM ─────────────────────────────────────────────── */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-geist text-sm font-semibold text-[#F5F5F5] uppercase tracking-widest flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C7A36A]" />
          Recruiting Pipeline CRM
        </h2>
        <span className="font-mono text-xs text-[#A1A1A1] uppercase tracking-widest">
          DRAG_SIMULATOR: ENGAGED
        </span>
      </div>

      <div className="overflow-x-auto -mx-4 px-4 pb-4">
        <div className="grid grid-cols-5 gap-4 min-w-[900px] items-stretch min-h-[450px]">
          {STAGES.map(stage => {
            const stageItems = shortlists.filter(item => item.stage === stage.id)

            return (
              <div
                key={stage.id}
                className={`glass-card p-4 rounded-xl flex flex-col gap-3 border-t-2 ${stage.color}`}
              >
                {/* Stage header */}
                <div className="flex justify-between items-center border-b border-white/[0.05] pb-2.5">
                  <span className="font-geist text-xs font-semibold text-[#F5F5F5] uppercase tracking-wider">
                    {stage.label}
                  </span>
                  <span className="font-mono text-xs text-[#A1A1A1] bg-white/[0.05] px-2 py-0.5 rounded-full">
                    {stageItems.length}
                  </span>
                </div>

                {/* Stage Cards */}
                <div className="flex-1 flex flex-col gap-2.5">
                  <AnimatePresence>
                    {loading && liveShortlists.length === 0 ? (
                      <div className="h-24 bg-white/[0.03] border border-white/5 rounded-lg animate-pulse" />
                    ) : stageItems.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center border border-dashed border-white/[0.06] rounded-lg p-4 text-center min-h-[80px]">
                        <span className="font-mono text-xs text-[#A1A1A1]/25 uppercase tracking-widest">
                          Empty
                        </span>
                      </div>
                    ) : (
                      stageItems.map(item => (
                        <motion.div
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          key={item.id}
                          className="p-3.5 bg-[#0f1118] border border-white/[0.06] hover:border-[#C7A36A]/20 rounded-xl shadow-sm space-y-2.5 transition-all group"
                        >
                          {/* Candidate Info */}
                          <div>
                            <h4 className="font-geist text-sm font-semibold text-[#F5F5F5]">{item.candidateName}</h4>
                            <p className="font-geist text-xs text-[#A1A1A1] truncate mt-0.5">{item.candidateTitle}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="font-mono text-xs text-[#779165] font-semibold text-glow-green">
                                {Number(item.matchScore).toFixed(0)}%
                              </span>
                              <span className="font-mono text-[10px] text-[#A1A1A1]/40 uppercase truncate">
                                {item.jobTitle}
                              </span>
                            </div>
                          </div>

                          {/* CRM actions */}
                          <div className="flex items-center justify-between border-t border-white/[0.04] pt-2">
                            <button
                              onClick={() => handleRemove(item.id)}
                              className="btn-danger py-1 px-2 text-[10px]"
                            >
                              Remove
                            </button>
                            
                            <div className="flex gap-1">
                              <button
                                onClick={() => moveStage(item.id, 'backward')}
                                disabled={stage.id === 'review'}
                                className="w-6 h-6 flex items-center justify-center rounded-md bg-white/[0.04] hover:bg-white/10 disabled:opacity-20 disabled:pointer-events-none text-white transition-all hover:shadow-[0_0_8px_rgba(255,255,255,0.1)]"
                                title="Move back"
                              >
                                <span className="material-symbols-outlined text-xs">chevron_left</span>
                              </button>
                              <button
                                onClick={() => moveStage(item.id, 'forward')}
                                disabled={stage.id === 'offer'}
                                className="w-6 h-6 flex items-center justify-center rounded-md bg-[#C7A36A]/10 hover:bg-[#C7A36A]/25 disabled:opacity-20 disabled:pointer-events-none text-[#C7A36A] transition-all hover:shadow-[0_0_8px_rgba(199,163,106,0.25)]"
                                title="Advance stage"
                              >
                                <span className="material-symbols-outlined text-xs">chevron_right</span>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer status row */}
      <div className="border-t border-white/[0.05] px-4 py-4 flex items-center justify-between mt-6 glass-card rounded-xl">
        <span className="font-mono text-xs text-[#A1A1A1]/40 uppercase tracking-widest">
          // END_OF_SELECTION_MATRIX
        </span>
        <button
          onClick={handleExportMatrix}
          className="btn-premium-accent py-2 px-4 text-xs flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">download</span>
          Export Matrix (XLSX)
        </button>
      </div>
    </AppShell>
  )
}
