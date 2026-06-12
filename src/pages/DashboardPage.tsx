import { useSearchParams, Link } from 'react-router-dom'
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

  return (
    <AppShell>
      {/* Page header */}
      <div className="w-full mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <h1 className="font-display-md text-3xl sm:text-4xl lg:text-5xl text-primary tracking-tight italic">
          Active Pipelines
        </h1>
        <div className="flex items-center gap-3 pb-1">
          <span className="font-label-sm text-on-surface-variant uppercase tracking-widest text-[10px]">
            Sorting by: Intelligence Score
          </span>
          <span className="material-symbols-outlined text-on-surface-variant text-sm">filter_list</span>
        </div>
      </div>

      {/* Pipeline table */}
      <div className="w-full border border-white/5 bg-background/40 backdrop-blur-sm rounded-sm divide-y divide-white/5 shadow-2xl overflow-hidden">
        {/* Header row */}
        <div className="hidden md:grid grid-cols-12 items-center px-6 py-4 border-b border-white/10">
          <div className="col-span-5 font-label-sm text-on-surface-variant uppercase tracking-widest text-[10px]">Role & ID</div>
          <div className="col-span-3 font-label-sm text-on-surface-variant uppercase tracking-widest text-[10px]">Active Since</div>
          <div className="col-span-2 font-label-sm text-on-surface-variant uppercase tracking-widest text-[10px]">Hidden Gems</div>
          <div className="col-span-2" />
        </div>

        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-full bg-transparent p-4 sm:p-6 transition-all border-b border-white/5 animate-pulse">
              <div className="flex flex-col gap-3 md:grid md:grid-cols-12 md:gap-0 md:items-center">
                <div className="col-span-1 md:col-span-5">
                  <div className="h-5 bg-white/5 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-white/5 rounded w-1/4" />
                </div>
                <div className="col-span-1 md:col-span-3"><div className="h-4 bg-white/5 rounded w-1/2" /></div>
                <div className="col-span-1 md:col-span-2"><div className="h-4 bg-white/5 rounded w-1/3" /></div>
                <div className="col-span-1 md:col-span-2" />
              </div>
            </div>
          ))
        ) : (
          displayJobs.map((job: any) => (
            <div
              key={job.id}
              className="w-full bg-transparent p-4 sm:p-6 transition-all border-b border-white/5 ledger-row group"
            >
              <div className="flex flex-col gap-3 md:grid md:grid-cols-12 md:gap-0 md:items-center">
                {/* Role Block */}
                <div className="col-span-1 md:col-span-5 flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-secondary opacity-70 shrink-0" />
                  <div>
                    <p className="font-sans text-primary text-[17px] font-medium leading-tight">{job.title}</p>
                    <p className="font-label-sm text-on-surface-variant uppercase text-[10px] tracking-widest mt-1">
                      ID: {job.jobCode}
                    </p>
                  </div>
                </div>

                {/* Active Since */}
                <div className="col-span-1 md:col-span-3">
                  <p className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[10px] md:hidden mb-1">
                    Active Since
                  </p>
                  <p className="text-on-surface font-body-md text-sm">
                    {job.activeSince ? formatDate(job.activeSince) : 'Oct 12, 2023'}
                  </p>
                </div>

                {/* Hidden Gems Count */}
                <div className="col-span-1 md:col-span-2">
                  <p className="font-label-sm text-on-surface-variant uppercase text-[10px] tracking-wider md:hidden mb-1">
                    Hidden Gems
                  </p>
                  <p className="font-display-md text-base text-secondary italic">
                    {job.hiddenGemsCount} Hidden Gems
                  </p>
                </div>

                {/* View Pipeline CTA */}
                <div className="col-span-1 md:col-span-2 flex justify-between items-center md:justify-end">
                  <span className="font-label-sm text-on-surface-variant uppercase text-[10px] tracking-wider md:hidden">
                    Actions
                  </span>
                  <Link
                    to={`/ranking?jobId=${job.id}`}
                    className="font-label-sm text-primary uppercase tracking-widest text-[11px] hover:translate-x-1 transition-transform flex items-center gap-2 md:opacity-60 md:group-hover:opacity-100"
                  >
                    View Pipeline{' '}
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick nav shortcut strip */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Job Description Analyzer', desc: 'Extract semantic intent from raw JDs', href: '/job-analyzer', icon: 'psychology' },
          { label: 'Hidden Gems Index', desc: 'Candidates missed by legacy keyword filters', href: '/hidden-gems', icon: 'auto_awesome' },
          { label: 'Shortlist Matrix', desc: 'Your curated candidate selection', href: '/shortlists', icon: 'bookmarks' },
        ].map(({ label, desc, href, icon }) => (
          <Link
            key={href}
            to={href}
            className="liquid-glass rounded-lg p-6 flex flex-col gap-3 hover:border-white/15 transition-all duration-300 group border border-white/5"
          >
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
              {icon}
            </span>
            <div>
              <p className="text-primary font-medium text-sm">{label}</p>
              <p className="text-on-surface-variant text-xs mt-1">{desc}</p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-sm mt-auto self-end group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
        ))}
      </div>
    </AppShell>
  )
}
