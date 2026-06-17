import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import AppShell from '../components/layout/AppShell'
import { useJobs } from '../hooks/useJobs'
import { useShortlists } from '../hooks/useShortlists'

function formatDate(ts: any): string {
  if (!ts) return 'Oct 12, 2023'
  const d = ts?.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const MOCK_JOBS = [
  { id: 'mock-1', title: 'Staff Infrastructure Engineer', jobCode: 'SF-INF-224', activeSince: null, hiddenGemsCount: 12, status: 'active' },
  { id: 'mock-2', title: 'Senior Product Designer',       jobCode: 'PD-SR-109',  activeSince: null, hiddenGemsCount: 8,  status: 'active' },
  { id: 'mock-3', title: 'Principal Security Architect',  jobCode: 'SEC-PR-004', activeSince: null, hiddenGemsCount: 4,  status: 'active' },
  { id: 'mock-4', title: 'Head of Engineering',           jobCode: 'ENG-H-502',  activeSince: null, hiddenGemsCount: 19, status: 'active' },
  { id: 'mock-5', title: 'ML Platform Engineer',          jobCode: 'ML-PLAT-992',activeSince: null, hiddenGemsCount: 11, status: 'active' },
]

/* Static chart data — representing weekly candidate flow */
const PIPELINE_WEEKLY = [
  { day: 'Mon', scanned: 420, shortlisted: 12, gems: 4 },
  { day: 'Tue', scanned: 610, shortlisted: 19, gems: 7 },
  { day: 'Wed', scanned: 380, shortlisted: 8,  gems: 3 },
  { day: 'Thu', scanned: 740, shortlisted: 24, gems: 11 },
  { day: 'Fri', scanned: 530, shortlisted: 15, gems: 6 },
  { day: 'Sat', scanned: 290, shortlisted: 6,  gems: 2 },
  { day: 'Sun', scanned: 180, shortlisted: 4,  gems: 1 },
]

const MATCH_TREND = [
  { week: 'W1', score: 78 },
  { week: 'W2', score: 82 },
  { week: 'W3', score: 80 },
  { week: 'W4', score: 88 },
  { week: 'W5', score: 86 },
  { week: 'W6', score: 92 },
]

/* Custom recharts tooltip */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-lg px-3 py-2.5 text-xs border border-white/10"
      style={{ background: 'rgba(11,12,16,0.95)', backdropFilter: 'blur(12px)' }}
    >
      <p className="font-mono text-[#C7A36A] uppercase tracking-widest mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="font-mono" style={{ color: p.color }}>
          {p.name}: <span className="font-semibold">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

const cardVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] } }),
}

export default function DashboardPage() {
  const { jobs, loading }                         = useJobs()
  const { shortlists }                            = useShortlists('demo-user')
  const displayJobs                               = jobs.length > 0 ? jobs : MOCK_JOBS
  const totalGems   = displayJobs.reduce((s: number, j: any) => s + (j.hiddenGemsCount || 0), 0)
  const totalQueued = shortlists.length

  const KPI_CARDS = [
    {
      label: 'Active Pipelines',
      value: displayJobs.length.toString(),
      trend: '+2 this week',
      icon: 'hub',
      color: 'text-[#C7A36A] text-glow-gold',
      chart: <ResponsiveContainer width="100%" height={44}>
        <AreaChart data={PIPELINE_WEEKLY} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gGold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#C7A36A" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#C7A36A" stopOpacity={0}   />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="shortlisted" stroke="#C7A36A" strokeWidth={1.5} fill="url(#gGold)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>,
    },
    {
      label: 'Candidates Scanned',
      value: '100k+',
      trend: 'Deterministic locally',
      icon: 'view_cozy',
      color: 'text-white',
      chart: <ResponsiveContainer width="100%" height={44}>
        <AreaChart data={PIPELINE_WEEKLY} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gWhite" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#ffffff" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#ffffff" stopOpacity={0}   />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="scanned" stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} fill="url(#gWhite)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>,
    },
    {
      label: 'Hidden Gems Found',
      value: totalGems.toString(),
      trend: 'Latent talent',
      icon: 'auto_awesome',
      color: 'text-[#779165] text-glow-green',
      chart: <ResponsiveContainer width="100%" height={44}>
        <AreaChart data={PIPELINE_WEEKLY} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#779165" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#779165" stopOpacity={0}    />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="gems" stroke="#779165" strokeWidth={1.5} fill="url(#gGreen)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>,
    },
    {
      label: 'Shortlisted',
      value: totalQueued > 0 ? totalQueued.toString() : '3',
      trend: 'Ready for export',
      icon: 'bookmarks',
      color: 'text-[#a4cbeb]',
      chart: <ResponsiveContainer width="100%" height={44}>
        <AreaChart data={MATCH_TREND} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#a4cbeb" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#a4cbeb" stopOpacity={0}   />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="score" stroke="#a4cbeb" strokeWidth={1.5} fill="url(#gBlue)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>,
    },
  ]

  return (
    <AppShell>
      {/* ─── Page Header ───────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 p-6 glass-card rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-72 h-72 pointer-events-none -z-0 opacity-50"
          style={{ background: 'radial-gradient(circle at 80% 20%, rgba(199,163,106,0.08) 0%, transparent 60%)' }} />
        <div className="relative z-10">
          <p className="font-mono text-xs text-[#C7A36A] uppercase tracking-[0.2em] mb-2 text-glow-gold">
            WELCOME_BACK // RECRUITER_CONSOLE_v1.0
          </p>
          <h1 className="font-geist text-2xl md:text-3xl font-semibold text-[#F5F5F5] mb-1.5 leading-tight">
            Good morning, Talent Acquisition Team
          </h1>
          <p className="font-geist text-sm text-[#A1A1A1] max-w-lg leading-relaxed">
            Your pipeline is healthy. 12 new candidates matched quality score thresholds in the last 24 hours.
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto shrink-0">
          <Link
            to="/job-analyzer"
            className="btn-premium-accent flex items-center gap-2 py-2.5 px-5 w-full md:w-auto justify-center"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Create Pipeline
          </Link>
        </div>
      </motion.div>

      {/* ─── KPI Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {KPI_CARDS.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="glass-card p-5 rounded-xl flex flex-col justify-between group cursor-default"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="font-mono text-xs text-[#A1A1A1] uppercase tracking-widest block mb-1.5">
                  {kpi.label}
                </span>
                <span className={`font-geist text-3xl font-bold leading-none ${kpi.color}`}>
                  {kpi.value}
                </span>
              </div>
              <div className="p-2 bg-white/[0.03] border border-white/[0.06] rounded-lg group-hover:border-white/10 transition-colors">
                <span className="material-symbols-outlined text-[#A1A1A1] text-xl">{kpi.icon}</span>
              </div>
            </div>

            {/* Recharts Sparkline */}
            <div className="mb-2">
              {kpi.chart}
            </div>

            <span className="font-mono text-xs text-[#A1A1A1]/50 uppercase tracking-wider">
              {kpi.trend}
            </span>
          </motion.div>
        ))}
      </div>

      {/* ─── Charts Row ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-8">

        {/* Weekly Pipeline Activity — wide */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="lg:col-span-3 glass-card p-5 rounded-xl"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-mono text-xs text-[#C7A36A] uppercase tracking-widest mb-0.5">Weekly Activity</p>
              <h3 className="font-geist text-sm font-semibold text-[#F5F5F5]">Candidate Pipeline Flow</h3>
            </div>
            <div className="flex items-center gap-4">
              {[
                { color: 'rgba(255,255,255,0.4)', label: 'Scanned' },
                { color: '#C7A36A', label: 'Shortlisted' },
                { color: '#779165', label: 'Gems' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                  <span className="font-mono text-[10px] text-[#A1A1A1] uppercase tracking-wider">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={PIPELINE_WEEKLY} barGap={4} barCategoryGap="25%">
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="day" tick={{ fill: '#A1A1A1', fontSize: 10, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#A1A1A1', fontSize: 10, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} width={36} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
              <Bar dataKey="scanned"     fill="rgba(255,255,255,0.06)"  radius={[3,3,0,0]} />
              <Bar dataKey="shortlisted" fill="rgba(199,163,106,0.55)"  radius={[3,3,0,0]} />
              <Bar dataKey="gems"        fill="rgba(119,145,101,0.65)"  radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Match Score Trend — narrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-2 glass-card p-5 rounded-xl flex flex-col"
        >
          <div className="mb-5">
            <p className="font-mono text-xs text-[#C7A36A] uppercase tracking-widest mb-0.5">Trend</p>
            <h3 className="font-geist text-sm font-semibold text-[#F5F5F5]">Match Score Quality</h3>
          </div>

          <div className="flex-1">
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={MATCH_TREND} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gMatchScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#a4cbeb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#a4cbeb" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="week" tick={{ fill: '#A1A1A1', fontSize: 10, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[70, 100]} tick={{ fill: '#A1A1A1', fontSize: 10, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" stroke="#a4cbeb" strokeWidth={2} fill="url(#gMatchScore)" dot={{ fill: '#a4cbeb', r: 3 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-4 border-t border-white/[0.05]">
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs text-[#A1A1A1] uppercase tracking-widest">Current</span>
              <span className="font-geist text-xl font-bold text-[#a4cbeb]">92%</span>
            </div>
            <p className="font-mono text-xs text-[#779165] uppercase tracking-wider mt-1">↑ +14% over 6 weeks</p>
          </div>
        </motion.div>
      </div>

      {/* ─── Pipeline Ledger Table ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-geist text-sm font-semibold text-[#F5F5F5] uppercase tracking-widest flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C7A36A] animate-pulse" />
            Active Pipeline Ledgers
          </h2>
          <span className="font-mono text-xs text-[#A1A1A1] uppercase tracking-widest">
            {displayJobs.length} Active
          </span>
        </div>

        <div className="glass-card rounded-xl overflow-hidden">
          {/* Table head */}
          <div className="hidden md:grid grid-cols-12 px-6 py-3.5 border-b border-white/[0.05] bg-[#0b0c10]/30">
            {['Role & ID', 'Active Since', 'Hidden Gems', 'Actions'].map((h, i) => (
              <div key={h} className={`font-mono text-xs text-[#A1A1A1]/60 uppercase tracking-widest ${
                i === 0 ? 'col-span-5' : i === 1 ? 'col-span-3' : i === 2 ? 'col-span-2' : 'col-span-2 text-right'
              }`}>
                {h}
              </div>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/[0.03]">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="px-6 py-5 grid grid-cols-12 gap-4 animate-pulse">
                  <div className="col-span-5 space-y-2">
                    <div className="h-4 bg-white/[0.04] rounded w-3/4" />
                    <div className="h-2.5 bg-white/[0.04] rounded w-1/4" />
                  </div>
                  <div className="col-span-3"><div className="h-3.5 bg-white/[0.04] rounded w-1/2" /></div>
                  <div className="col-span-2"><div className="h-3.5 bg-white/[0.04] rounded w-1/3" /></div>
                  <div className="col-span-2" />
                </div>
              ))
            ) : (
              displayJobs.map((job: any, idx: number) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.05, duration: 0.3 }}
                  className="console-row-premium px-6 py-4 flex flex-col md:grid md:grid-cols-12 items-start md:items-center gap-3 md:gap-0"
                >
                  {/* Role */}
                  <div className="col-span-5 flex items-center gap-3.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C7A36A] opacity-70 shrink-0" />
                    <div>
                      <p className="font-geist text-sm font-semibold text-[#F5F5F5] leading-tight">{job.title}</p>
                      <p className="font-mono text-xs text-[#A1A1A1]/60 uppercase tracking-widest mt-0.5">ID: {job.jobCode}</p>
                    </div>
                  </div>

                  {/* Active Since */}
                  <div className="col-span-3">
                    <span className="font-mono text-xs text-[#A1A1A1] md:hidden block mb-0.5 uppercase tracking-widest opacity-40">Since</span>
                    <p className="font-mono text-xs text-[#A1A1A1]">{formatDate(job.activeSince)}</p>
                  </div>

                  {/* Hidden Gems */}
                  <div className="col-span-2">
                    <span className="font-mono text-xs text-[#A1A1A1] md:hidden block mb-0.5 uppercase tracking-widest opacity-40">Gems</span>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#779165] text-sm">auto_awesome</span>
                      <p className="font-mono text-sm font-semibold text-[#779165] text-glow-green">{job.hiddenGemsCount}</p>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="col-span-2 flex justify-end">
                    <Link
                      to={`/ranking?jobId=${job.id}`}
                      className="font-mono text-xs text-[#C7A36A] uppercase tracking-widest hover:text-[#F5F5F5] transition-all flex items-center gap-1.5 group/link hover:gap-2"
                    >
                      Enter Pipeline
                      <span className="material-symbols-outlined text-sm group-hover/link:translate-x-0.5 transition-transform">arrow_forward</span>
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.div>

      {/* ─── Quick Nav Cards ────────────────────────────────────────────────── */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          { label: 'Job Description Analyzer', desc: 'Synthesize raw JDs into structural archetype matrices using AI', href: '/job-analyzer', icon: 'psychology', color: '#C7A36A' },
          { label: 'Hidden Gems Index',         desc: 'Identify latent engineering stars masked by ATS keyword filters', href: '/hidden-gems', icon: 'auto_awesome', color: '#779165' },
          { label: 'Shortlist Queue',           desc: 'Manage, stage, and export your queued candidates via CRM', href: '/shortlists', icon: 'bookmarks', color: '#a4cbeb' },
        ].map((nav, i) => (
          <motion.div
            key={nav.href}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 + i * 0.08, duration: 0.4 }}
          >
            <Link
              to={nav.href}
              className="glass-card rounded-xl p-5 flex flex-col gap-4 group block h-full"
            >
              <div className="flex justify-between items-start">
                <div
                  className="p-2.5 rounded-lg border transition-all"
                  style={{
                    background: `rgba(${nav.color === '#C7A36A' ? '199,163,106' : nav.color === '#779165' ? '119,145,101' : '164,203,235'},0.08)`,
                    borderColor: `rgba(${nav.color === '#C7A36A' ? '199,163,106' : nav.color === '#779165' ? '119,145,101' : '164,203,235'},0.2)`,
                  }}
                >
                  <span className="material-symbols-outlined text-xl transition-colors" style={{ color: nav.color }}>
                    {nav.icon}
                  </span>
                </div>
                <span className="material-symbols-outlined text-[#A1A1A1]/30 group-hover:text-[#A1A1A1]/70 group-hover:translate-x-1 transition-all text-sm">
                  arrow_forward
                </span>
              </div>
              <div>
                <p className="font-geist text-sm font-semibold text-[#F5F5F5] mb-1.5">{nav.label}</p>
                <p className="font-geist text-xs text-[#A1A1A1] leading-relaxed">{nav.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </AppShell>
  )
}
