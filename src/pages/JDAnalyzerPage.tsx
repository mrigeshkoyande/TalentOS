import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AppShell from '../components/layout/AppShell'
import { analyzeJD } from '../lib/gemini'
import { createJob } from '../lib/firestore'
import type { InferredProfile } from '../types'
import { serverTimestamp } from 'firebase/firestore'

type AnalysisState = 'idle' | 'loading' | 'done' | 'error'

const PLACEHOLDER_PROFILE: InferredProfile = {
  archetypeMatrix: [
    { label: 'Architectural Governance', matchPercent: 84, description: 'Deep integration with legacy infrastructure transition and scalable design patterns. Demonstrates governance layer expertise across distributed, multi-region deployments.' },
    { label: 'Velocity Management', matchPercent: 62, description: 'Emphasis on rapid prototyping cycles and iterative delivery within agile frames. Experience with sprint cadence management at scale.' },
    { label: 'Systems Reliability', matchPercent: 91, description: 'High-availability design patterns with observability and incident response expertise. SRE-adjacent capability with sub-100ms SLA target experience.' },
    { label: 'Data Engineering', matchPercent: 73, description: 'Pipeline architecture for real-time and batch data processing at enterprise scale. ETL orchestration with Kafka and Spark infrastructure.' },
  ],
  trajectoryDynamics: [
    { timeframe: 'PHASE_01 // Initial 90 Days', outcome: 'Refactoring core data pipelines and establishing AI observability protocols. Cross-functional alignment with platform team required.', riskVector: 'RISK: Moderate bottleneck in cross-functional data siloing. Mitigation: Scheduled inter-team synchronization sprints.' },
    { timeframe: 'PHASE_02 // Key Milestone', outcome: '30% reduction in technical debt across the neural inference layer. Automated regression testing introduced.', riskVector: 'RISK: Dependency on third-party vendor SLAs. Mitigation: Maintain fallback routing to internal inference cluster.' },
  ],
}

const CONFIG_FIELDS = [
  { key: 'TARGET_ROLE_ID', placeholder: 'e.g. SR_ENG_INFRA_042' },
  { key: 'PROMPT_TEMP', placeholder: '0.0 – 1.0 (default: 0.7)' },
  { key: 'SEMANTIC_DEPTH', placeholder: 'shallow | standard | deep' },
  { key: 'CONTEXT_WINDOW', placeholder: '4096 | 8192 | 32768' },
]

export default function JDAnalyzerPage() {
  const [rawText, setRawText] = useState('')
  const [state, setState] = useState<AnalysisState>('idle')
  const [profile, setProfile] = useState<InferredProfile | null>(null)
  const [error, setError] = useState('')
  const [configOpen, setConfigOpen] = useState(false)
  const [configValues, setConfigValues] = useState<Record<string, string>>({
    TARGET_ROLE_ID: '',
    PROMPT_TEMP: '',
    SEMANTIC_DEPTH: '',
    CONTEXT_WINDOW: '',
  })

  const handleExtract = async () => {
    if (!rawText.trim()) {
      setError('ERR_EMPTY_INPUT: Paste a job description to begin analysis.')
      return
    }
    setError('')
    setState('loading')
    try {
      const result = await analyzeJD(rawText)
      setProfile(result)
      setState('done')
      await createJob({
        title: configValues.TARGET_ROLE_ID || 'Staff Infrastructure Engineer',
        jobCode: `JD-${Date.now().toString(36).toUpperCase()}`,
        activeSince: serverTimestamp() as any,
        hiddenGemsCount: 0,
        status: 'active',
        rawJD: rawText,
        inferredProfile: result,
      } as any)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'ERR_INTERNAL_SERVER: Failed to reach neural synthesis endpoints.')
      setState('error')
    }
  }

  const displayProfile = profile || PLACEHOLDER_PROFILE

  return (
    <AppShell noPadding>
      <div className="flex flex-col lg:flex-row flex-1" style={{ minHeight: 'calc(100vh - 5rem)' }}>
        
        {/* ─── LEFT PANEL: INPUT & CONFIGS (Lg col-5 equivalent) ─────────────── */}
        <aside className="w-full lg:w-[420px] shrink-0 border-r border-white/5 bg-[#11131b]/30 flex flex-col justify-between">
          <div className="flex-1 flex flex-col divide-y divide-white/5">
            
            {/* Panel Header */}
            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="font-mono text-xs text-[#A1A1A1] uppercase tracking-widest mb-1">
                  AI_WORKSPACE // INPUT_STREAM
                </p>
                <h2 className="font-geist text-base font-semibold text-[#F5F5F5]">
                  JD Synthesizer
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${state === 'loading' ? 'bg-[#C7A36A] animate-pulse' : 'bg-[#779165]'}`} />
                <span className="font-mono text-xs text-[#A1A1A1] uppercase tracking-widest">
                  {state === 'loading' ? 'PROCESSING' : 'ONLINE'}
                </span>
              </div>
            </div>

            {/* Input payload area */}
            <div className="p-6 flex-1 flex flex-col gap-4">
              <span className="font-mono text-xs text-[#A1A1A1] uppercase tracking-widest block">
                // RAW_JD_PAYLOAD
              </span>
              
              <textarea
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                placeholder="Paste the raw job description text payload here..."
                className="console-input-premium flex-1 min-h-[220px] lg:min-h-[300px]"
              />

              {error && (
                <p className="font-mono text-xs text-[#ffb4ab] uppercase tracking-widest">
                  {error}
                </p>
              )}
            </div>

            {/* Config drawer */}
            <div className="p-6">
              <button
                onClick={() => setConfigOpen(!configOpen)}
                className="w-full flex justify-between items-center text-left py-2 hover:text-[#C7A36A] transition-colors"
              >
                <span className="font-mono text-xs text-[#A1A1A1] uppercase tracking-widest">
                  // OPTIONAL_CONFIG_PARAMETERS
                </span>
                <span className="material-symbols-outlined text-xs">
                  {configOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              <AnimatePresence>
                {configOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden pt-4 space-y-4"
                  >
                    {CONFIG_FIELDS.map(field => (
                      <div key={field.key}>
                        <label className="font-mono text-xs uppercase tracking-widest text-[#A1A1A1] block mb-1.5">
                          {field.key}
                        </label>
                        <input
                          type="text"
                          placeholder={field.placeholder}
                          value={configValues[field.key] || ''}
                          onChange={e => setConfigValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                          className="console-input-premium py-2.5 px-3"
                        />
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Action trigger button */}
          <div className="p-6 border-t border-white/5 bg-[#0b0c10]/20">
            <button
              onClick={handleExtract}
              disabled={state === 'loading'}
              className="btn-premium-accent w-full text-center flex items-center justify-center gap-2.5 py-3"
            >
              {state === 'loading' ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                  SYNTHESIZING_VECTORS...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">psychology</span>
                  RUN_INTENT_EXTRACTION
                </>
              )}
            </button>
          </div>
        </aside>

        {/* ─── RIGHT PANEL: LIVE AI ANALYSIS OUTPUT (Lg col-7 equivalent) ────── */}
        <main className="flex-1 flex flex-col bg-[#0b0c10]/40 overflow-hidden divide-y divide-white/5">
          
          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between shrink-0">
            <span className="font-mono text-xs text-[#A1A1A1] uppercase tracking-widest">
              CONSOLE // NEURAL_VECTORS // ANALYSIS_OUTPUT
            </span>
            {state === 'done' && (
              <span className="status-pill-online">
                <span className="h-1.5 w-1.5 rounded-full bg-[#779165] animate-pulse" />
                Analysis Complete
              </span>
            )}
          </div>

          {/* Output workspace */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {state === 'idle' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex items-center justify-center border border-dashed border-white/5 rounded-lg p-10 text-center"
                >
                  <div className="max-w-md space-y-3">
                    <span className="material-symbols-outlined text-4xl text-[#A1A1A1]/40">psychology</span>
                    <h3 className="font-geist text-xs font-semibold text-[#F5F5F5] uppercase tracking-widest">
                      Awaiting Job Payload Ingestion
                    </h3>
                    <p className="font-geist text-xs text-[#A1A1A1] leading-relaxed">
                      Paste a raw job description in the left editor pane and trigger intent extraction to begin vector matching and archetype generation.
                    </p>
                  </div>
                </motion.div>
              )}

              {state === 'loading' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col justify-center items-center gap-4 py-20"
                >
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-[#C7A36A]/20 animate-ping" />
                    <span className="material-symbols-outlined text-[#C7A36A] text-4xl animate-pulse">query_stats</span>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="font-mono text-xs text-[#C7A36A] uppercase tracking-widest text-glow-gold">
                      AI is thinking...
                    </p>
                    <p className="font-geist text-[11px] text-[#A1A1A1] max-w-xs leading-relaxed">
                      Synthesizing text arrays, extracting required capabilities, and drafting expected trajectory roadmaps.
                    </p>
                  </div>
                </motion.div>
              )}

              {state === 'error' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col justify-center items-center gap-4 py-20"
                >
                  <div className="relative w-16 h-16 flex items-center justify-center bg-red-500/10 rounded-full">
                    <span className="material-symbols-outlined text-[#ffb4ab] text-3xl">error</span>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="font-mono text-xs text-[#ffb4ab] uppercase tracking-widest text-glow-red">
                      SYSTEM FAILURE
                    </p>
                    <p className="font-geist text-[11px] text-[#A1A1A1] max-w-xs leading-relaxed">
                      {error || 'An internal server error occurred while connecting to the neural endpoints.'}
                    </p>
                  </div>
                </motion.div>
              )}

              {state === 'done' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Top Stats Banner */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-white/1 border border-white/5 flex justify-between items-center">
                      <div>
                        <span className="font-mono text-xs text-[#A1A1A1] uppercase tracking-widest block">
                          AI Confidence index
                        </span>
                        <span className="font-geist text-sm font-semibold text-[#F5F5F5] mt-1 block">
                          Optimal Model Fit
                        </span>
                      </div>
                      <span className="font-mono text-xl font-bold text-[#779165] text-glow-green">94.8%</span>
                    </div>

                    <div className="p-4 rounded-lg bg-white/1 border border-white/5 flex justify-between items-center">
                      <div>
                        <span className="font-mono text-xs text-[#A1A1A1] uppercase tracking-widest block">
                          Mapped Job Code
                        </span>
                        <span className="font-geist text-sm font-semibold text-[#F5F5F5] mt-1 block">
                          {configValues.TARGET_ROLE_ID || 'Staff Infra'}
                        </span>
                      </div>
                      <span className="font-mono text-xs text-[#C7A36A] text-glow-gold">SYS_MAPPED</span>
                    </div>
                  </div>

                  {/* Archetype matrix */}
                  <div className="space-y-4">
                    <h3 className="font-mono text-xs text-[#A1A1A1] uppercase tracking-widest border-b border-white/5 pb-2">
                      // EXTRACTED_CAPABILITY_ARCHETYPE_MATRIX
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {displayProfile.archetypeMatrix.map(item => (
                        <div key={item.label} className="p-5 rounded-lg bg-white/1 border border-white/5 space-y-3">
                          <div className="flex justify-between items-start">
                            <h4 className="font-geist text-sm font-semibold text-[#F5F5F5]">{item.label}</h4>
                            <span className="font-mono text-xs text-[#779165] font-semibold">
                              {item.matchPercent}% FIT
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#779165] to-[#a4cbeb] transition-all" style={{ width: `${item.matchPercent}%` }} />
                          </div>
                          <p className="font-geist text-xs text-[#A1A1A1] leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trajectory dynamics */}
                  <div className="space-y-4">
                    <h3 className="font-mono text-xs text-[#A1A1A1] uppercase tracking-widest border-b border-white/5 pb-2">
                      // EXPECTED_TRAJECTORY_ROADMAPS
                    </h3>

                    <div className="space-y-4">
                      {displayProfile.trajectoryDynamics.map((dyn, idx) => (
                        <div key={idx} className="p-5 rounded-lg bg-white/1 border border-white/5 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                          <div className="col-span-1 md:col-span-3">
                            <span className="font-mono text-xs text-[#C7A36A] text-glow-gold font-medium block">
                              {dyn.timeframe}
                            </span>
                          </div>
                          
                          <div className="col-span-1 md:col-span-5 space-y-1.5">
                            <span className="font-mono text-xs text-[#A1A1A1] uppercase tracking-wider block">
                              Projected Outcome
                            </span>
                            <p className="font-geist text-sm text-[#F5F5F5] leading-relaxed">
                              {dyn.outcome}
                            </p>
                          </div>

                          <div className="col-span-1 md:col-span-4 space-y-1.5">
                            <span className="font-mono text-xs text-red-400/80 uppercase tracking-wider block">
                              Risk Mitigation Vector
                            </span>
                            <p className="font-geist text-sm text-[#ffb4ab] leading-relaxed">
                              {dyn.riskVector}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

      </div>
    </AppShell>
  )
}
