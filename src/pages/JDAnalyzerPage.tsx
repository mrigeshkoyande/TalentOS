import { useState } from 'react'
import PillNavbar from '../components/layout/PillNavbar'
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
  { key: 'TARGET_ROLE_ID', placeholder: 'e.g. SR_ENG_INFRA_042', value: '' },
  { key: 'PROMPT_TEMP', placeholder: '0.0 – 1.0 (default: 0.7)', value: '' },
  { key: 'SEMANTIC_DEPTH', placeholder: 'shallow | standard | deep', value: '' },
  { key: 'CONTEXT_WINDOW', placeholder: '4096 | 8192 | 32768', value: '' },
]

const SCHEMA_FIELDS = [
  { key: 'candidate_id', type: 'STRING', required: true },
  { key: 'full_name', type: 'STRING', required: true },
  { key: 'current_title', type: 'STRING', required: false },
  { key: 'skills_narrative', type: 'TEXT[]', required: false },
  { key: 'technical_projects', type: 'TEXT[]', required: false },
  { key: 'years_experience', type: 'INT', required: false },
  { key: 'omitted_keywords', type: 'STRING[]', required: false },
  { key: 'alignment_proof', type: 'TEXT', required: false },
]

export default function JDAnalyzerPage() {
  const [rawText, setRawText] = useState('')
  const [state, setState] = useState<AnalysisState>('idle')
  const [profile, setProfile] = useState<InferredProfile | null>(null)
  const [error, setError] = useState('')
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
        title: configValues.TARGET_ROLE_ID || 'Untitled Role',
        jobCode: `JD-${Date.now().toString(36).toUpperCase()}`,
        activeSince: serverTimestamp() as any,
        hiddenGemsCount: 0,
        status: 'active',
        rawJD: rawText,
        inferredProfile: result,
      } as any)
    } catch (err) {
      console.error(err)
      setProfile(PLACEHOLDER_PROFILE)
      setState('done')
    }
  }

  const displayProfile = profile || (state === 'done' ? PLACEHOLDER_PROFILE : null)

  return (
    <div className="min-h-screen bg-[#11131b] text-[#F5F5F5] flex flex-col">
      <PillNavbar />

      {/* Full-height split below h-12 navbar */}
      <div className="flex flex-col lg:flex-row flex-1 pt-12 min-h-[calc(100vh-3rem)]">

        {/* ── LEFT CONFIG LANE ─────────────────────────────────────────────── */}
        <aside className="w-full lg:w-[400px] xl:w-[440px] shrink-0 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col">

          {/* Lane header */}
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <div>
              <p className="font-geist-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest mb-1">
                ACCOUNT_SETUP // INGESTION_CONSOLE
              </p>
              <h1 className="font-geist text-sm font-medium text-[#F5F5F5]">
                Configuration Parameters
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${state === 'loading' ? 'bg-[#C7A36A] animate-pulse' : 'bg-[#779165]'}`} />
              <span className="font-geist-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">
                {state === 'loading' ? 'PROC_RUNNING' : 'READY'}
              </span>
            </div>
          </div>

          {/* Config fields */}
          <div className="flex flex-col gap-0 flex-1 overflow-y-auto">

            {/* Metadata config fields */}
            <div className="px-6 py-5 border-b border-white/5 space-y-4">
              <p className="font-geist-mono text-[9px] uppercase tracking-widest text-[#A1A1A1]">
                // SYSTEM_PARAMETERS
              </p>
              {CONFIG_FIELDS.map(field => (
                <div key={field.key}>
                  <label className="font-geist-mono text-[9px] uppercase tracking-widest text-[#A1A1A1] block mb-1.5">
                    {field.key}
                  </label>
                  <input
                    id={`config-${field.key.toLowerCase()}`}
                    type="text"
                    className="console-input"
                    placeholder={field.placeholder}
                    value={configValues[field.key] || ''}
                    onChange={e => setConfigValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>

            {/* JD raw text input */}
            <div className="px-6 py-5 flex flex-col gap-3 flex-1">
              <p className="font-geist-mono text-[9px] uppercase tracking-widest text-[#A1A1A1]">
                // RAW_JD_INPUT_STREAM
              </p>
              <label className="font-geist-mono text-[9px] uppercase tracking-widest text-[#A1A1A1] block">
                JD_TEXT_PAYLOAD
              </label>

              {error && (
                <p className="font-geist-mono text-[9px] text-[#ffb4ab] uppercase tracking-widest">
                  {error}
                </p>
              )}

              <textarea
                id="jd-input"
                className="console-input min-h-[180px] lg:min-h-[240px] flex-1"
                placeholder="// paste raw job description or unedited dataset payload here..."
                value={rawText}
                onChange={e => setRawText(e.target.value)}
              />

              {/* Execute button */}
              <button
                id="extract-intent-btn"
                onClick={handleExtract}
                disabled={state === 'loading'}
                className="w-full border border-white/10 text-[#F5F5F5] font-geist-mono text-[10px] uppercase tracking-widest px-4 py-3 hover:border-[#C7A36A] hover:text-[#C7A36A] transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 rounded-sm"
              >
                {state === 'loading' ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                    PROC_ANALYZING_VECTORS...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">psychology</span>
                    EXECUTE_INTENT_EXTRACTION
                  </>
                )}
              </button>
            </div>
          </div>
        </aside>

        {/* ── RIGHT DATA LANE ───────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col overflow-hidden">

          {/* Lane header */}
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between shrink-0">
            <p className="font-geist-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">
              CONSOLE // TARGET_DATASETS //{' '}
              <span className="text-[#C7A36A]">candidate_schema.json</span>
            </p>
            <div className="flex items-center gap-4">
              <span className="font-geist-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">
                STATE: <span className={state === 'done' ? 'text-[#779165]' : state === 'loading' ? 'text-[#C7A36A]' : 'text-[#A1A1A1]'}>
                  {state === 'idle' ? 'AWAITING_INPUT' : state === 'loading' ? 'PROCESSING' : 'ANALYSIS_COMPLETE'}
                </span>
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

            {/* Schema dropzone panel */}
            <div className="w-full lg:w-72 xl:w-80 shrink-0 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col">
              <div className="px-6 py-4 border-b border-white/5">
                <p className="font-geist-mono text-[9px] uppercase tracking-widest text-[#A1A1A1]">
                  // SCHEMA_MAP
                </p>
              </div>

              {/* File dropzone */}
              <div className="m-4 border border-dashed border-white/10 rounded-sm p-4 hover:border-white/20 transition-colors cursor-pointer group">
                <p className="font-geist-mono text-[9px] uppercase tracking-widest text-[#A1A1A1] mb-3">
                  MAPPED_FILES
                </p>
                <div className="space-y-2">
                  {['candidate_schema.json', 'sample_candidates.json'].map(file => (
                    <div key={file} className="flex items-center gap-2">
                      <span className="text-[#779165] font-geist-mono text-[9px]">✓</span>
                      <span className="font-geist-mono text-[10px] text-[#C7A36A]">{file}</span>
                    </div>
                  ))}
                </div>
                <p className="font-geist-mono text-[9px] text-[#A1A1A1]/40 mt-4 uppercase tracking-widest">
                  // drop additional files here
                </p>
              </div>

              {/* Schema fields */}
              <div className="flex-1 overflow-y-auto">
                <div className="px-6 py-3 border-b border-white/5">
                  <p className="font-geist-mono text-[9px] uppercase tracking-widest text-[#A1A1A1]">
                    // FIELD_DEFINITIONS
                  </p>
                </div>
                {SCHEMA_FIELDS.map(field => (
                  <div key={field.key} className="console-row flex items-center justify-between px-6 py-2.5">
                    <span className="font-geist-mono text-[10px] text-[#F5F5F5]">{field.key}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-geist-mono text-[9px] text-[#A1A1A1]">{field.type}</span>
                      {field.required && (
                        <span className="font-geist-mono text-[8px] text-[#C7A36A] uppercase">REQ</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Analysis output panel */}
            <div className="flex-1 overflow-y-auto">
              {state === 'idle' ? (
                /* Empty state */
                <div className="flex flex-col items-start justify-start p-6">
                  <div className="border border-dashed border-white/5 rounded-sm p-8 w-full">
                    <p className="font-geist-mono text-[9px] uppercase tracking-widest text-[#A1A1A1] mb-2">
                      // AWAITING_DATASET_INGESTION
                    </p>
                    <p className="font-geist-mono text-[10px] text-[#A1A1A1]/50">
                      Paste a job description in the left pane and execute EXTRACT_INTENT_EXTRACTION to begin neural vector analysis.
                    </p>
                  </div>
                </div>
              ) : state === 'loading' ? (
                /* Loading skeleton */
                <div className="p-6 space-y-px">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="console-row py-4 px-0 flex gap-8">
                      <div className="h-2 bg-white/5 rounded-sm w-24 animate-pulse" />
                      <div className="h-2 bg-white/5 rounded-sm flex-1 animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : (
                /* Analysis results */
                <div className="p-0">

                  {/* Section header: Archetype Matrix */}
                  <div className="px-6 py-4 border-b border-white/5 flex items-center gap-4">
                    <span className="font-geist-mono text-[9px] text-[#C7A36A] uppercase tracking-widest">
                      MODULE_01
                    </span>
                    <span className="font-geist-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">
                      SYSTEM_ARCHETYPE_MATRIX
                    </span>
                  </div>

                  {/* Archetype rows */}
                  <div>
                    {/* Column headers */}
                    <div className="console-col-header grid grid-cols-12 px-6 py-2">
                      <div className="col-span-4">ARCHETYPE_LABEL</div>
                      <div className="col-span-2 text-right">MATCH_%</div>
                      <div className="col-span-6 pl-8">DESCRIPTION</div>
                    </div>
                    {displayProfile?.archetypeMatrix.map((card, i) => (
                      <div key={card.label} className="console-row grid grid-cols-12 px-6 py-4 items-start">
                        <div className="col-span-4 flex items-start gap-3">
                          <span className="font-geist-mono text-[9px] text-[#A1A1A1] mt-0.5 shrink-0">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="font-geist text-xs text-[#F5F5F5]">{card.label}</span>
                        </div>
                        <div className="col-span-2 text-right">
                          <span className="font-geist-mono text-xs text-[#779165]">
                            {card.matchPercent.toFixed(1)}%
                          </span>
                        </div>
                        <div className="col-span-6 pl-8">
                          <p className="font-geist text-[11px] text-[#A1A1A1] leading-relaxed">
                            {card.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Section header: Trajectory Dynamics */}
                  <div className="px-6 py-4 border-b border-white/5 flex items-center gap-4 mt-0">
                    <span className="font-geist-mono text-[9px] text-[#C7A36A] uppercase tracking-widest">
                      MODULE_02
                    </span>
                    <span className="font-geist-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">
                      EXPECTED_TRAJECTORY_DYNAMICS
                    </span>
                  </div>

                  {/* Trajectory rows */}
                  <div>
                    <div className="console-col-header grid grid-cols-12 px-6 py-2">
                      <div className="col-span-3">TIMEFRAME</div>
                      <div className="col-span-5 pl-4">PROJECTED_OUTCOME</div>
                      <div className="col-span-4 pl-4">RISK_VECTOR</div>
                    </div>
                    {displayProfile?.trajectoryDynamics.map((dyn, i) => (
                      <div key={i} className="console-row grid grid-cols-12 px-6 py-5 items-start">
                        <div className="col-span-3">
                          <span className="font-geist-mono text-[10px] text-[#C7A36A] block leading-relaxed">
                            {dyn.timeframe}
                          </span>
                        </div>
                        <div className="col-span-5 pl-4">
                          <p className="font-geist text-[11px] text-[#F5F5F5] leading-relaxed">
                            {dyn.outcome}
                          </p>
                        </div>
                        <div className="col-span-4 pl-4">
                          <p className="font-geist text-[11px] text-[#ffb4ab] leading-relaxed">
                            {dyn.riskVector}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
