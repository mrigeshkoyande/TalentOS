import AppShell from '../components/layout/AppShell'
import { useHiddenGems } from '../hooks/useHiddenGems'
import type { Candidate } from '../types'

const MOCK_GEMS: Candidate[] = [
  {
    id: 'hg1', name: 'Elias Thorne', title: 'Distinguished Systems Architect', matchId: 'HG_0821',
    latentSignalPercent: 98.4, matchScore: 94, isHiddenGem: true,
    omittedKeywords: ['Kubernetes', 'Microservices', 'Cloud Native'],
    latentValueRationale: 'Engineered a custom high-availability orchestrator for a proprietary edge-compute network. While lacking K8s keywords, his design handles containerized lifecycle management at scales exceeding standard enterprise deployments. Container isolation model demonstrates conceptual equivalence at the kernel scheduling level—the abstraction is owned rather than borrowed.',
    alignmentProof: '',
    unstructured_skills_narrative: ['Custom orchestration engines', 'Edge compute architecture'],
    technical_projects: ['High-availability edge orchestrator', 'Distributed consensus implementation'],
    jobId: 'mock-1', createdAt: null as any,
  },
  {
    id: 'hg2', name: 'Sloane Varkas', title: 'Backend Performance Lead', matchId: 'HG_0944',
    latentSignalPercent: 96.8, matchScore: 91, isHiddenGem: true,
    omittedKeywords: ['Python', 'React', 'AWS Lambda'],
    latentValueRationale: 'Deep specialization in low-latency concurrent processing using Erlang/Elixir for fintech messaging cores. Superior architectural alignment with real-time stream processing needs, despite missing common modern cloud stack buzzwords. Actor model concurrency maps precisely to the serverless execution model. Throughput benchmarks: 4.2M messages/sec sustained over 72h.',
    alignmentProof: '',
    unstructured_skills_narrative: ['Erlang/Elixir concurrency', 'Fintech messaging'],
    technical_projects: ['Real-time stream processing engine', 'Low-latency fintech core'],
    jobId: 'mock-1', createdAt: null as any,
  },
  {
    id: 'hg3', name: 'Julian Mercer', title: 'ML Infrastructure Engineer', matchId: 'HG_0712',
    latentSignalPercent: 94.2, matchScore: 89, isHiddenGem: true,
    omittedKeywords: ['PyTorch', 'NLP', 'LLM'],
    latentValueRationale: 'Led development of high-throughput linear algebra kernels in C++ for proprietary signal processing hardware. While resume bypasses high-level AI framework labels, foundational math-layer expertise is the core execution intent of ML infrastructure roles. CUDA kernel optimization work directly applicable to training pipeline acceleration targets.',
    alignmentProof: '',
    unstructured_skills_narrative: ['Linear algebra kernels', 'CUDA optimization'],
    technical_projects: ['Signal processing hardware driver', 'Custom ML kernel library'],
    jobId: 'mock-1', createdAt: null as any,
  },
  {
    id: 'hg4', name: 'Kira Chen', title: 'Security Operations Lead', matchId: 'HG_0631',
    latentSignalPercent: 91.0, matchScore: 87, isHiddenGem: true,
    omittedKeywords: ['Cybersecurity', 'PenTesting', 'SOC 2'],
    latentValueRationale: 'Specializes in formal verification of cryptographic protocols and zero-knowledge proofs. Legacy filters looking for Security Engineer tags miss her entirely—contributions are categorized under Applied Mathematics in academic circles. ZK proof work directly underpins the zero-trust access model required for compliance infrastructure.',
    alignmentProof: '',
    unstructured_skills_narrative: ['Formal verification', 'Zero-knowledge proofs'],
    technical_projects: ['Cryptographic protocol verifier', 'ZK proof library'],
    jobId: 'mock-1', createdAt: null as any,
  },
  {
    id: 'hg5', name: 'Tariq Osei', title: 'Data Systems Researcher', matchId: 'HG_0589',
    latentSignalPercent: 88.5, matchScore: 84, isHiddenGem: true,
    omittedKeywords: ['SQL', 'Snowflake', 'dbt'],
    latentValueRationale: 'Published researcher in columnar storage engine design with peer-reviewed work on predicate pushdown optimization. Resume reflects academic framing, not tooling keywords. However, the optimization strategies he has authored are the underlying principles that power the exact data warehouse stack the role targets.',
    alignmentProof: '',
    unstructured_skills_narrative: ['Columnar storage design', 'Query optimization research'],
    technical_projects: ['Custom storage engine prototype', 'Predicate pushdown benchmark suite'],
    jobId: 'mock-1', createdAt: null as any,
  },
]

export default function HiddenGemsPage() {
  const { gems, loading } = useHiddenGems(null)
  const displayGems = gems.length > 0 ? gems : MOCK_GEMS

  return (
    <AppShell>
      {/* Page path header */}
      <div className="border-b border-white/5 px-6 md:px-8 py-4 flex items-center justify-between">
        <p className="console-path">
          CONSOLE <span className="text-white/15 mx-1">//</span>
          LATENT_INTENT_DISCOVER <span className="text-white/15 mx-1">//</span>
          <span className="text-[#C7A36A]">HG_INDEX</span>
        </p>
        <div className="flex items-center gap-4">
          <span className="font-geist-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">
            HG_RECORDS: <span className="text-[#F5F5F5]">{displayGems.length.toString().padStart(3, '0')}</span>
          </span>
          <span className="font-geist-mono text-[9px] text-[#C7A36A] uppercase tracking-widest">
            FILTER: KEYWORD_OMISSION_DETECTED
          </span>
        </div>
      </div>

      {/* Column header */}
      <div className="console-col-header hidden md:grid grid-cols-12 px-6 md:px-8 py-3">
        <div className="col-span-3">HG_ID // CANDIDATE</div>
        <div className="col-span-3 pl-6">OMITTED_KEYWORD_DEVIATIONS</div>
        <div className="col-span-6 pl-6">LATENT_CAPABILITY_INFERENCE</div>
      </div>

      {/* Gem rows */}
      <div>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="console-row grid grid-cols-12 px-6 md:px-8 py-8 gap-0">
                <div className="col-span-3 flex items-start gap-3">
                  <div className="h-3 w-16 bg-white/5 rounded-sm animate-pulse" />
                  <div className="flex flex-col gap-2">
                    <div className="h-2.5 w-24 bg-white/5 rounded-sm animate-pulse" />
                    <div className="h-2 w-16 bg-white/5 rounded-sm animate-pulse" />
                  </div>
                </div>
                <div className="col-span-3 pl-6 space-y-2">
                  <div className="h-2 w-20 bg-white/5 rounded-sm animate-pulse" />
                  <div className="h-2 w-16 bg-white/5 rounded-sm animate-pulse" />
                  <div className="h-2 w-24 bg-white/5 rounded-sm animate-pulse" />
                </div>
                <div className="col-span-6 pl-6 space-y-2">
                  <div className="h-2 w-full bg-white/5 rounded-sm animate-pulse" />
                  <div className="h-2 w-4/5 bg-white/5 rounded-sm animate-pulse" />
                  <div className="h-2 w-3/5 bg-white/5 rounded-sm animate-pulse" />
                </div>
              </div>
            ))
          : displayGems.map((gem, idx) => (
              <div
                key={gem.id}
                className="console-row grid grid-cols-1 md:grid-cols-12 px-6 md:px-8 py-8 border-b border-white/5 gap-6 md:gap-0"
              >
                {/* Cols 1–3: Identity */}
                <div className="col-span-1 md:col-span-3 flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    <span className="console-idx">
                      {gem.matchId}
                    </span>
                    <span className="block font-geist-mono text-[8px] text-[#779165] uppercase tracking-widest mt-1">
                      {gem.latentSignalPercent.toFixed(1)}%_SIG
                    </span>
                  </div>
                  <div>
                    <p className="font-geist text-xs font-medium text-[#F5F5F5] leading-tight">{gem.name}</p>
                    <p className="font-geist text-[11px] text-[#A1A1A1] mt-0.5">{gem.title}</p>
                    {gem.unstructured_skills_narrative.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {gem.unstructured_skills_narrative.map(skill => (
                          <span key={skill} className="font-geist-mono text-[8px] text-[#A1A1A1]/60 border border-white/5 px-1.5 py-0.5 uppercase tracking-widest">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Cols 4–6: Omitted keyword deviations */}
                <div className="col-span-1 md:col-span-3 md:pl-6 flex flex-col justify-start gap-1">
                  {/* Mobile label */}
                  <p className="font-geist-mono text-[9px] uppercase tracking-widest text-[#A1A1A1] mb-2 md:hidden">
                    // OMITTED_KEYWORDS
                  </p>
                  {gem.omittedKeywords.map(kw => (
                    <div key={kw} className="flex items-center gap-2">
                      <span className="font-geist-mono text-[9px] text-[#A1A1A1]/40">—</span>
                      <span className="console-strikethrough">{kw}</span>
                    </div>
                  ))}
                </div>

                {/* Cols 7–12: Latent inference narrative */}
                <div className="col-span-1 md:col-span-6 md:pl-6 flex flex-col justify-start">
                  {/* Mobile label */}
                  <p className="font-geist-mono text-[9px] uppercase tracking-widest text-[#A1A1A1] mb-2 md:hidden">
                    // CAPABILITY_INFERENCE
                  </p>
                  <p className="font-geist text-[11px] text-[#F5F5F5] leading-relaxed">
                    {gem.latentValueRationale}
                  </p>
                  {gem.technical_projects.length > 0 && (
                    <div className="mt-4 space-y-1">
                      <p className="font-geist-mono text-[9px] uppercase tracking-widest text-[#A1A1A1]">
                        // VERIFIED_PROJECTS
                      </p>
                      {gem.technical_projects.map(proj => (
                        <div key={proj} className="flex items-center gap-2">
                          <span className="font-geist-mono text-[9px] text-[#C7A36A]">›</span>
                          <span className="font-geist-mono text-[10px] text-[#A1A1A1]">{proj}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
      </div>

      {/* Footer status */}
      <div className="border-t border-white/5 px-6 md:px-8 py-3">
        <span className="font-geist-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">
          // END_OF_LATENT_INTENT_INDEX // SEMANTIC_FILTER: ACTIVE // KEYWORD_OMISSION_THRESHOLD: 2+
        </span>
      </div>
    </AppShell>
  )
}
