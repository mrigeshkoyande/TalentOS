import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AppShell from '../components/layout/AppShell'
import { useShortlists } from '../hooks/useShortlists'
import { removeFromShortlist } from '../lib/firestore'
import type { Shortlist } from '../types'

const MOCK_SHORTLISTS: Shortlist[] = [
  {
    id: 'sl-001', candidateId: 'm1', candidateName: 'Alexandre V.', candidateTitle: 'Lead Systems Architect',
    jobId: 'mock-1', jobTitle: 'Staff Infrastructure Engineer',
    matchScore: 94, addedBy: 'demo-user', addedAt: null as any,
  },
  {
    id: 'sl-002', candidateId: 'm2', candidateName: 'Elena Rostova', candidateTitle: 'Principal Product Designer',
    jobId: 'mock-1', jobTitle: 'Staff Infrastructure Engineer',
    matchScore: 91, addedBy: 'demo-user', addedAt: null as any,
  },
  {
    id: 'sl-003', candidateId: 'm3', candidateName: 'Julian Thorne', candidateTitle: 'ML Engineer',
    jobId: 'mock-1', jobTitle: 'Staff Infrastructure Engineer',
    matchScore: 89, addedBy: 'demo-user', addedAt: null as any,
  },
]

const STAGES = [
  { id: 'review', label: 'Screening', color: 'border-blue-500/20' },
  { id: 'tech', label: 'Tech Evaluation', color: 'border-yellow-500/20' },
  { id: 'design', label: 'System Design', color: 'border-purple-500/20' },
  { id: 'executive', label: 'Executive Loop', color: 'border-[#C7A36A]/20' },
  { id: 'offer', label: 'Offer', color: 'border-[#779165]/20' },
]

export default function ShortlistsPage() {
  const { shortlists: liveShortlists, loading } = useShortlists('demo-user')
  const baseShortlists = liveShortlists.length > 0 ? liveShortlists : (loading ? [] : MOCK_SHORTLISTS)

  // Kanban CRM stage assignments state
  const [stagesMap, setStagesMap] = useState<Record<string, string>>({
    'sl-001': 'design',
    'sl-002': 'tech',
    'sl-003': 'review',
  })

  const handleRemove = async (id: string) => {
    try { 
      await removeFromShortlist(id) 
    } catch (_) {}
  }

  // Assign newly added database shortlists to 'review' stage if they aren't mapped
  const shortlists = baseShortlists.map(item => {
    const stage = stagesMap[item.id] || 'review'
    return { ...item, stage }
  })

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
            <p className="font-mono text-[9px] text-[#C7A36A] uppercase tracking-widest mb-1">
              CONSOLE // SELECTION_MATRIX // EXPORT_QUEUE
            </p>
            <h1 className="font-geist text-lg font-medium text-[#F5F5F5]">
              Shortlist Selection Matrix
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">
              QUEUED: <span className="text-[#C7A36A]">{shortlists.length.toString().padStart(3, '0')}</span>
            </span>
            <span className="font-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">
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
              <span className="font-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest block mb-1">
                {metric.label}
              </span>
              <span className="font-display text-2xl font-medium text-[#F5F5F5]">
                {metric.value}
              </span>
            </div>
            <div>
              <p className="font-geist text-[10px] text-[#A1A1A1]">{metric.desc}</p>
              <span className="font-mono text-[8px] text-[#779165] uppercase tracking-widest block mt-1">
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
        <span className="font-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">
          DRAG_SIMULATOR: ENGAGED
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-stretch min-h-[450px]">
        {STAGES.map(stage => {
          const stageItems = shortlists.filter(item => item.stage === stage.id)

          return (
            <div
              key={stage.id}
              className={`glass-card p-4 rounded-lg flex flex-col gap-4 border-t-2 ${stage.color} bg-[#11131b]/20`}
            >
              {/* Stage header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="font-geist text-xs font-semibold text-[#F5F5F5] uppercase tracking-wider">
                  {stage.label}
                </span>
                <span className="font-mono text-[9px] text-[#A1A1A1] bg-white/5 px-1.5 py-0.5 rounded">
                  {stageItems.length}
                </span>
              </div>

              {/* Stage Cards */}
              <div className="flex-1 flex flex-col gap-3">
                <AnimatePresence>
                  {loading ? (
                    <div className="h-24 bg-white/3 border border-white/5 rounded-md animate-pulse" />
                  ) : stageItems.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center border border-dashed border-white/5 rounded-md p-4 text-center">
                      <span className="font-mono text-[8px] text-[#A1A1A1]/30 uppercase tracking-widest">
                        Drop candidate here
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
                        className="p-4 bg-[#161923] border border-white/5 hover:border-white/10 rounded-md shadow space-y-3 relative group"
                      >
                        {/* Candidate Info */}
                        <div>
                          <h4 className="font-geist text-xs font-semibold text-[#F5F5F5]">{item.candidateName}</h4>
                          <p className="font-geist text-[10px] text-[#A1A1A1] truncate mt-0.5">{item.candidateTitle}</p>
                          <div className="flex items-center gap-1.5 mt-2">
                            <span className="font-mono text-[9px] text-[#779165] font-semibold">
                              {item.matchScore.toFixed(0)}% Match
                            </span>
                            <span className="text-white/10 text-[8px] font-mono">//</span>
                            <span className="font-mono text-[8px] text-[#A1A1A1]/60 uppercase truncate max-w-[80px]">
                              {item.jobTitle}
                            </span>
                          </div>
                        </div>

                        {/* CRM actions / Move buttons */}
                        <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-2">
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="font-mono text-[8px] text-red-400 hover:text-red-300 uppercase tracking-wider"
                          >
                            [Remove]
                          </button>
                          
                          <div className="flex gap-1.5">
                            {/* Move stage back */}
                            <button
                              onClick={() => moveStage(item.id, 'backward')}
                              disabled={stage.id === 'review'}
                              className="w-5 h-5 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-white transition-colors"
                            >
                              <span className="material-symbols-outlined text-[10px]">chevron_left</span>
                            </button>
                            {/* Move stage forward */}
                            <button
                              onClick={() => moveStage(item.id, 'forward')}
                              disabled={stage.id === 'offer'}
                              className="w-5 h-5 flex items-center justify-center rounded bg-[#C7A36A]/10 hover:bg-[#C7A36A]/20 disabled:opacity-30 disabled:pointer-events-none text-[#C7A36A] transition-colors"
                            >
                              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
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

      {/* Footer status row */}
      <div className="border-t border-white/5 px-6 py-4 flex items-center justify-between mt-8 bg-[#11131b]/20 rounded-lg">
        <span className="font-mono text-[9px] text-[#A1A1A1]/40 uppercase tracking-widest">
          // END_OF_SELECTION_MATRIX // CRM_EXPORT_ACTIVE
        </span>
        <button
          onClick={() => alert('Exporting selection matrix: shortlists_export.csv')}
          className="font-mono text-[9px] text-[#C7A36A] hover:text-[#F5F5F5] uppercase tracking-widest transition-colors"
        >
          [EXPORT_SELECTION_MATRIX]
        </button>
      </div>
    </AppShell>
  )
}
