import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import AppShell from '../components/layout/AppShell'
import { useJobs } from '../hooks/useJobs'

function formatDate(ts: any): string {
  if (!ts) return '—'
  const d = ts?.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const MOCK_JOBS = [
  { id: 'mock-1', title: 'Staff Infrastructure Engineer', jobCode: 'SF-INF-224', activeSince: null, hiddenGemsCount: 12, status: 'active' },
  { id: 'mock-2', title: 'Senior Product Designer', jobCode: 'PD-SR-109', activeSince: null, hiddenGemsCount: 8, status: 'active' },
  { id: 'mock-3', title: 'Principal Security Architect', jobCode: 'SEC-PR-004', activeSince: null, hiddenGemsCount: 4, status: 'active' },
  { id: 'mock-4', title: 'Head of Engineering', jobCode: 'ENG-H-502', activeSince: null, hiddenGemsCount: 19, status: 'active' },
  { id: 'mock-5', title: 'ML Platform Engineer', jobCode: 'ML-PLAT-992', activeSince: null, hiddenGemsCount: 11, status: 'active' },
]

export default function DashboardPage() {
  const { jobs, loading } = useJobs()
  const displayJobs = jobs.length > 0 ? jobs : MOCK_JOBS

  // Sparkline paths for the KPI cards
  const SPARK_PATHS = [
    "M0 20 L15 15 L30 25 L45 8 L60 18 L75 12 L100 5",
    "M0 25 L20 22 L40 10 L60 15 L80 5 L100 8",
    "M0 22 L15 25 L35 15 L50 20 L70 8 L85 12 L100 3",
    "M0 5 L20 12 L40 8 L60 20 L80 15 L100 25" // downward trend for fraud/declining risk
  ]

  return (
    <AppShell>
      {/* ─── RECRUITER HEADER PANEL ───────────────────────────────────────── */}
      <div className="mb-10 p-6 glass-card rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-radial from-[#C7A36A]/5 to-transparent blur-[50px] pointer-events-none -z-10" />
        
        <div>
          <p className="font-mono text-[9px] text-[#C7A36A] uppercase tracking-widest mb-1.5">
            WELCOME_BACK // RECRUITER_CONSOLE_v1.0
          </p>
          <h1 className="font-geist text-xl font-medium text-[#F5F5F5] mb-1">
            Good morning, Talent Acquisition Team
          </h1>
          <p className="font-geist text-xs text-[#A1A1A1]">
            Your pipeline is healthy. 12 new candidates have matched your quality score thresholds in the last 24 hours.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex gap-3 w-full md:w-auto">
          <Link
            to="/job-analyzer"
            className="btn-premium-accent flex items-center justify-center gap-2 py-2.5 px-4 text-[9px] w-full md:w-auto"
          >
            <span className="material-symbols-outlined text-xs">add</span>
            Create Pipeline
          </Link>
        </div>
      </div>

      {/* ─── KPI CARDS GRID ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Active Pipelines', value: displayJobs.length.toString(), trend: '+2 this week', icon: 'hub', spark: SPARK_PATHS[0], color: 'text-[#C7A36A] text-glow-gold' },
          { label: 'Total Scanned', value: '100,000+', trend: 'Deterministic locally', icon: 'view_cozy', spark: SPARK_PATHS[1], color: 'text-white' },
          { label: 'Hidden Gems Flagged', value: '54', trend: 'Latent talent', icon: 'auto_awesome', spark: SPARK_PATHS[2], color: 'text-[#779165] text-glow-green' },
          { label: 'Fraud Disqualifications', value: '93', trend: 'Honeypots hit', icon: 'gshield', spark: SPARK_PATHS[3], color: 'text-red-400' },
        ].map((kpi, idx) => (
          <div
            key={kpi.label}
            className="glass-card p-6 rounded-lg flex flex-col justify-between aspect-[1.8/1] relative group"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest block mb-1">
                  {kpi.label}
                </span>
                <span className={`font-display text-3xl font-medium ${kpi.color}`}>
                  {kpi.value}
                </span>
              </div>
              <div className="p-2 bg-white/3 border border-white/5 rounded-md">
                <span className="material-symbols-outlined text-[#A1A1A1] text-md">{kpi.icon}</span>
              </div>
            </div>

            <div className="flex justify-between items-end mt-4">
              <span className="font-mono text-[8px] text-[#A1A1A1]/60 uppercase tracking-wider">
                {kpi.trend}
              </span>
              {/* Custom SVG Sparkline */}
              <svg className="w-16 h-8 stroke-current text-[#C7A36A]/50 group-hover:text-[#C7A36A] transition-colors" viewBox="0 0 100 30" fill="none">
                <path d={kpi.spark} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* ─── ACTIVE PIPELINES TABLE ────────────────────────────────────────── */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-geist text-sm font-semibold text-[#F5F5F5] uppercase tracking-widest flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C7A36A]" />
          Active Pipeline Ledgers
        </h2>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">
            SORT: ACTIVE_CHRONO
          </span>
          <span className="material-symbols-outlined text-[#A1A1A1] text-sm">filter_list</span>
        </div>
      </div>

      <div className="w-full glass-card rounded-lg overflow-hidden border border-white/5">
        
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 px-6 py-4 border-b border-white/5 bg-[#0b0c10]/20">
          <div className="col-span-5 font-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">Role & ID</div>
          <div className="col-span-3 font-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">Active Since</div>
          <div className="col-span-2 font-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">Hidden Gems</div>
          <div className="col-span-2 text-right font-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">Actions</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-white/3">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-6 py-6 animate-pulse grid grid-cols-12 items-center gap-4">
                <div className="col-span-5 space-y-2">
                  <div className="h-4 bg-white/5 rounded-sm w-3/4" />
                  <div className="h-2.5 bg-white/5 rounded-sm w-1/4" />
                </div>
                <div className="col-span-3"><div className="h-3.5 bg-white/5 rounded-sm w-1/2" /></div>
                <div className="col-span-2"><div className="h-3.5 bg-white/5 rounded-sm w-1/3" /></div>
                <div className="col-span-2" />
              </div>
            ))
          ) : (
            displayJobs.map((job: any, index: number) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                key={job.id}
                className="console-row-premium px-6 py-5 flex flex-col md:grid md:grid-cols-12 items-start md:items-center gap-4 md:gap-0"
              >
                {/* Role Details */}
                <div className="col-span-5 flex items-center gap-3.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C7A36A] opacity-80 shrink-0" />
                  <div>
                    <p className="font-geist text-xs font-semibold text-[#F5F5F5] leading-tight">{job.title}</p>
                    <p className="font-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest mt-1">
                      ID: {job.jobCode}
                    </p>
                  </div>
                </div>

                {/* Active Since */}
                <div className="col-span-3">
                  <span className="font-mono text-[8px] text-[#A1A1A1] uppercase tracking-widest md:hidden block mb-1">
                    Active Since
                  </span>
                  <p className="font-mono text-xs text-[#A1A1A1]">
                    {job.activeSince ? formatDate(job.activeSince) : 'Oct 12, 2023'}
                  </p>
                </div>

                {/* Hidden Gems Count */}
                <div className="col-span-2">
                  <span className="font-mono text-[8px] text-[#A1A1A1] uppercase tracking-widest md:hidden block mb-1">
                    Hidden Gems
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#779165] text-xs">auto_awesome</span>
                    <p className="font-mono text-xs text-[#779165] font-semibold text-glow-green">
                      {job.hiddenGemsCount} Uncovered
                    </p>
                  </div>
                </div>

                {/* View Pipeline CTA */}
                <div className="col-span-2 flex justify-between items-center md:justify-end w-full md:w-auto">
                  <span className="font-mono text-[8px] text-[#A1A1A1] uppercase tracking-widest md:hidden">
                    Actions
                  </span>
                  <Link
                    to={`/ranking?jobId=${job.id}`}
                    className="font-mono text-[10px] text-[#C7A36A] uppercase tracking-widest hover:text-[#F5F5F5] transition-colors flex items-center gap-1.5 group/link"
                  >
                    Enter Pipeline
                    <span className="material-symbols-outlined text-xs group-hover/link:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* ─── QUICK NAVIGATION SHORCUTS ────────────────────────────────────── */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Job Description Analyzer', desc: 'Synthesize raw JDs into structural archetype matrices', href: '/job-analyzer', icon: 'psychology' },
          { label: 'Hidden Gems Index', desc: 'Identify latent engineering stars masked by ATS filters', href: '/hidden-gems', icon: 'auto_awesome' },
          { label: 'Shortlist Queue', desc: 'Manage and export your queued candidates', href: '/shortlists', icon: 'bookmarks' },
        ].map((nav, index) => (
          <Link
            key={nav.href}
            to={nav.href}
            className="glass-card rounded-lg p-6 flex flex-col gap-4 group"
          >
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-white/3 border border-white/5 rounded-md">
                <span className="material-symbols-outlined text-[#A1A1A1] group-hover:text-[#C7A36A] transition-colors">
                  {nav.icon}
                </span>
              </div>
              <span className="material-symbols-outlined text-[#A1A1A1]/40 group-hover:translate-x-1 transition-transform text-sm">
                arrow_forward
              </span>
            </div>
            <div>
              <p className="text-[#F5F5F5] font-semibold text-xs">{nav.label}</p>
              <p className="text-[#A1A1A1] text-[11px] mt-1.5 leading-relaxed">{nav.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  )
}
