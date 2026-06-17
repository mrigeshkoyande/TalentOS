import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AppShell from '../components/layout/AppShell'
import { useHiddenGems } from '../hooks/useHiddenGems'
import type { Candidate } from '../types'
import rankedRaw from '../lib/ranked_candidates_mock.json'

const MOCK_GEMS: Candidate[] = (rankedRaw as any[])
  .filter((r: any) => r.isHiddenGem)
  .map((r: any) => ({
    id: r.id,
    name: r.name,
    title: r.title,
    matchId: r.matchId,
    latentSignalPercent: r.latentSignalPercent ?? 0,
    matchScore: r.matchScore ?? 0,
    isHiddenGem: true,
    omittedKeywords: r.omittedKeywords ?? [],
    latentValueRationale: r.latentValueRationale ?? r.alignmentProof ?? '',
    alignmentProof: r.alignmentProof ?? '',
    unstructured_skills_narrative: r.unstructured_skills_narrative ?? [],
    technical_projects: r.technical_projects ?? [],
    jobId: r.jobId ?? 'india-challenge',
    rank: r.rank,
    createdAt: null as any,
  }))

export default function HiddenGemsPage() {
  const { gems, loading } = useHiddenGems(null)
  const displayGems = gems.length > 0 ? gems : MOCK_GEMS
  const [selectedGemId, setSelectedGemId] = useState<string | null>(null)

  const activeGem = displayGems.find(g => g.id === selectedGemId) || displayGems[0]

  return (
    <AppShell>
      {/* ─── PAGE TITLE & STORYTELLING BREADCRUMB ──────────────────────────── */}
      <div className="border border-white/5 bg-[#11131b]/40 backdrop-blur-sm rounded-lg p-5 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="font-mono text-xs text-[#C7A36A] uppercase tracking-widest mb-1">
              CONSOLE // LATENT_INTENT_DISCOVER // HG_INDEX
            </p>
            <h1 className="font-geist text-xl font-medium text-[#F5F5F5]">
              Hidden Gems Index
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#A1A1A1] uppercase tracking-widest">
              GEMS_UNCOVERED: <span className="text-[#779165] font-semibold text-glow-green">{displayGems.length.toString().padStart(2, '0')}</span>
            </span>
          </div>
        </div>
        
        {/* Storytelling explanation */}
        <div className="mt-4 p-4 rounded bg-[#C7A36A]/5 border border-[#C7A36A]/10 text-xs text-[#A1A1A1] leading-relaxed">
          <p className="font-semibold text-[#F5F5F5] mb-1">What is a Hidden Gem?</p>
          These candidates score in the top 25th percentile for practical capabilities and behavioral traits but have a low density of standard keyword matching on their resumes. Traditional ATS software filters them out immediately. TalentOS identifies them through semantic analysis of their verified technical projects and unstructured skills narratives.
        </div>
      </div>

      {/* ─── SPLIT VIEW WORKSPACE ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Gem List (Lg col-5) */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="font-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest px-1">
            // UNCONVENTIONAL_TALENT_FEED
          </h2>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass-card p-5 rounded-lg animate-pulse space-y-2">
                  <div className="h-4 bg-white/5 rounded-sm w-3/4" />
                  <div className="h-2.5 bg-white/5 rounded-sm w-1/2" />
                  <div className="h-2 bg-white/5 rounded-sm w-1/4" />
                </div>
              ))
            ) : (
              displayGems.map((gem) => {
                const isActive = (selectedGemId === null && activeGem?.id === gem.id) || selectedGemId === gem.id
                return (
                  <div
                    key={gem.id}
                    onClick={() => setSelectedGemId(gem.id)}
                    className={`glass-card p-5 rounded-lg cursor-pointer transition-all ${
                      isActive 
                        ? 'border-[#C7A36A]/40 bg-[#C7A36A]/3 shadow-[0_0_15px_rgba(199,163,106,0.04)]' 
                        : 'hover:bg-white/1'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-geist text-sm font-semibold text-[#F5F5F5]">{gem.name}</h3>
                        <p className="font-geist text-xs text-[#A1A1A1] mt-0.5">{gem.title}</p>
                      </div>
                      <span className="font-mono text-xs text-[#779165] bg-[#779165]/10 border border-[#779165]/20 px-1.5 py-0.5 rounded uppercase tracking-widest font-semibold text-glow-green">
                        {gem.latentSignalPercent.toFixed(0)}% SIG
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {gem.unstructured_skills_narrative.slice(0, 3).map(skill => (
                        <span key={skill} className="font-mono text-xs text-[#A1A1A1]/60 border border-white/5 px-1.5 py-0.5 uppercase tracking-wider rounded-sm">
                          {skill}
                        </span>
                      ))}
                      {gem.unstructured_skills_narrative.length > 3 && (
                        <span className="font-mono text-[8px] text-[#A1A1A1]/40 px-1.5 py-0.5 uppercase tracking-wider">
                          +{gem.unstructured_skills_narrative.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right Side: Advanced Storytelling Visualizer (Lg col-7) */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {activeGem && (
              <motion.div
                key={activeGem.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="glass-card p-6 rounded-lg border border-white/5 space-y-6 relative overflow-hidden"
              >
                {/* Glow Overlay */}
                <div className="absolute right-0 top-0 w-64 h-64 bg-radial from-[#C7A36A]/3 to-transparent blur-[40px] pointer-events-none -z-10" />

                {/* Identity header */}
                <div className="border-b border-white/5 pb-4 flex justify-between items-start">
                  <div>
                    <h3 className="font-geist text-sm font-semibold text-[#F5F5F5]">{activeGem.name}</h3>
                    <p className="font-geist text-xs text-[#A1A1A1] mt-0.5">{activeGem.title}</p>
                    <p className="font-mono text-xs text-[#A1A1A1]/40 mt-1 uppercase tracking-widest">
                      ID: {activeGem.matchId}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[9px] text-[#A1A1A1] block uppercase tracking-widest">
                      Latent Capability Score
                    </span>
                    <span className="font-display text-3xl font-medium text-[#779165] text-glow-green">
                      {activeGem.latentSignalPercent.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Why ATS Missed Them comparison panel */}
                <div className="space-y-3">
                  <h4 className="font-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">
                    // THE_ATS_GAP // COMPARATIVE_ANALYSIS
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left: Traditional ATS (Red/Failure) */}
                    <div className="p-4 rounded-lg bg-red-500/3 border border-red-500/10 space-y-2">
                      <div className="flex items-center gap-2 text-red-400">
                        <span className="material-symbols-outlined text-sm">cancel</span>
                        <span className="font-mono text-[9px] uppercase tracking-widest font-semibold">
                          TRADITIONAL_ATS
                        </span>
                      </div>
                      <p className="font-mono text-[20px] font-semibold text-red-400/80">0 Matches</p>
                      <p className="font-geist text-[10px] text-[#A1A1A1] leading-relaxed">
                        Filtered out automatically because the resume omitted core keyword strings:
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {activeGem.omittedKeywords.map(kw => (
                          <span key={kw} className="font-mono text-[8px] text-red-400/60 border border-red-400/10 px-1.5 py-0.5 rounded line-through">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right: TalentOS (Green/Success) */}
                    <div className="p-4 rounded-lg bg-[#779165]/3 border border-[#779165]/10 space-y-2">
                      <div className="flex items-center gap-2 text-[#779165]">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        <span className="font-mono text-[9px] uppercase tracking-widest font-semibold">
                          TALENTOS_SEMANTIC
                        </span>
                      </div>
                      <p className="font-mono text-[20px] font-semibold text-[#779165]">Match Found</p>
                      <p className="font-geist text-[10px] text-[#A1A1A1] leading-relaxed">
                        Mapped equivalence between candidate experience and required capabilities:
                      </p>
                      <p className="font-geist text-[10px] text-[#779165] italic">
                        "Demonstrates deep, equivalent proficiency through verified technical output."
                      </p>
                    </div>
                  </div>
                </div>

                {/* Latent capability narrative */}
                <div className="space-y-2.5">
                  <h4 className="font-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">
                    // CAPABILITY_INFERENCE_NARRATIVE
                  </h4>
                  <p className="font-geist text-xs text-[#A1A1A1] leading-relaxed p-4 rounded-lg bg-white/1 border border-white/5">
                    {activeGem.latentValueRationale}
                  </p>
                </div>

                {/* Skill confidence levels (simulated radar/bar indicators) */}
                <div className="space-y-4">
                  <h4 className="font-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">
                    // CAPABILITY_DYNAMICS // CONFIDENCE_LEVELS
                  </h4>

                  <div className="space-y-3">
                    {[
                      { skill: 'RAG Pipeline Integration', conf: 94 },
                      { skill: 'Distributed Infrastructure Design', conf: 88 },
                      { skill: 'Performance Optimization & Latency', conf: 82 },
                    ].map(item => (
                      <div key={item.skill} className="space-y-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-geist font-medium text-[#F5F5F5]">{item.skill}</span>
                          <span className="font-mono text-[#779165] font-semibold">{item.conf}% CONFIDENCE</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.conf}%` }}
                            className="h-full bg-gradient-to-r from-[#779165]/40 to-[#779165]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verified Technical Projects */}
                {activeGem.technical_projects.length > 0 && (
                  <div className="space-y-3 border-t border-white/5 pt-4">
                    <h4 className="font-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">
                      // VERIFIED_ENGINEERING_PROJECTS
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {activeGem.technical_projects.map(proj => (
                        <div key={proj} className="p-3 rounded-lg bg-[#0b0c10]/40 border border-white/5 flex gap-2.5 items-start">
                          <span className="material-symbols-outlined text-[#C7A36A] text-xs mt-0.5">deployed_code</span>
                          <span className="font-mono text-[10px] text-[#F5F5F5] leading-snug">{proj}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </AppShell>
  )
}
