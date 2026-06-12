import AppShell from '../components/layout/AppShell'
import { useShortlists } from '../hooks/useShortlists'
import { removeFromShortlist } from '../lib/firestore'
import type { Shortlist } from '../types'

function formatTimestamp(ts: any): string {
  if (!ts) return '—'
  const d = ts?.toDate ? ts.toDate() : new Date(ts)
  const iso = d.toISOString()
  return iso.replace('T', '_').slice(0, 16).toUpperCase()
}

function formatScore(score: number): string {
  return `${score.toFixed(2)}%`
}

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

export default function ShortlistsPage() {
  const { shortlists: liveShortlists, loading } = useShortlists('demo-user')
  const shortlists = liveShortlists.length > 0 ? liveShortlists : (loading ? [] : MOCK_SHORTLISTS)

  const handleRemove = async (id: string) => {
    try { await removeFromShortlist(id) } catch (_) {}
  }

  return (
    <AppShell>
      {/* Page path header */}
      <div className="border-b border-white/5 px-6 md:px-8 py-4 flex items-center justify-between">
        <p className="console-path">
          CONSOLE <span className="text-white/15 mx-1">//</span>
          SELECTION_MATRIX <span className="text-white/15 mx-1">//</span>
          <span className="text-[#C7A36A]">EXPORT_QUEUE</span>
        </p>
        <div className="flex items-center gap-4">
          <span className="font-geist-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">
            QUEUED: <span className={shortlists.length > 0 ? 'text-[#C7A36A]' : 'text-[#F5F5F5]'}>
              {shortlists.length.toString().padStart(3, '0')}
            </span>
          </span>
          <span className="font-geist-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">
            STATUS: <span className="text-[#779165]">PENDING_EXPORT</span>
          </span>
        </div>
      </div>

      {/* Column header */}
      <div className="console-col-header hidden md:grid grid-cols-12 px-6 md:px-8 py-3">
        <div className="col-span-1">SL_IDX</div>
        <div className="col-span-3 pl-4">CANDIDATE_ID // DOSSIER</div>
        <div className="col-span-3 pl-4">ROLE_TARGET</div>
        <div className="col-span-2 pl-4">ALIGN_%</div>
        <div className="col-span-2 pl-4">QUEUED_AT</div>
        <div className="col-span-1 text-right">OP</div>
      </div>

      {/* Rows */}
      <div>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="console-row grid grid-cols-12 px-6 md:px-8 py-4 gap-0">
              <div className="col-span-1"><div className="h-2.5 w-10 bg-white/5 rounded-sm animate-pulse" /></div>
              <div className="col-span-3 pl-4 space-y-2">
                <div className="h-2.5 w-28 bg-white/5 rounded-sm animate-pulse" />
                <div className="h-2 w-20 bg-white/5 rounded-sm animate-pulse" />
              </div>
              <div className="col-span-3 pl-4"><div className="h-2.5 w-36 bg-white/5 rounded-sm animate-pulse" /></div>
              <div className="col-span-2 pl-4"><div className="h-2.5 w-16 bg-white/5 rounded-sm animate-pulse" /></div>
              <div className="col-span-2 pl-4"><div className="h-2.5 w-28 bg-white/5 rounded-sm animate-pulse" /></div>
              <div className="col-span-1" />
            </div>
          ))
        ) : shortlists.length === 0 ? (
          /* Empty state */
          <div className="px-6 md:px-8 py-12">
            <p className="font-geist-mono text-[10px] text-[#A1A1A1] uppercase tracking-widest">
              // NO_RECORDS_IN_QUEUE
            </p>
            <p className="font-geist-mono text-[9px] text-[#A1A1A1]/40 mt-2 uppercase tracking-widest">
              // NAVIGATE TO PIPELINE_LEDGER AND EXECUTE [+ QUEUE] TO ADD CANDIDATES
            </p>
          </div>
        ) : (
          shortlists.map((item: Shortlist, idx) => (
            <div
              key={item.id}
              className="console-row grid grid-cols-1 md:grid-cols-12 px-6 md:px-8 py-4 gap-3 md:gap-0"
            >
              {/* SL_IDX */}
              <div className="col-span-1 md:flex items-center hidden">
                <span className="console-idx">
                  SL_{String(idx + 1).padStart(3, '0')}
                </span>
              </div>

              {/* Candidate dossier */}
              <div className="col-span-1 md:col-span-3 md:pl-4 flex items-start gap-2">
                <div>
                  {/* Mobile idx */}
                  <span className="console-idx md:hidden block mb-1">
                    SL_{String(idx + 1).padStart(3, '0')}
                  </span>
                  <p className="font-geist text-xs font-medium text-[#F5F5F5] leading-tight">
                    {item.candidateName}
                  </p>
                  <p className="font-geist-mono text-[10px] text-[#A1A1A1] mt-0.5">
                    {item.candidateTitle}
                  </p>
                  <p className="font-geist-mono text-[9px] text-[#A1A1A1]/50 mt-0.5 uppercase tracking-widest">
                    {item.candidateId?.toUpperCase() || '—'}
                  </p>
                </div>
              </div>

              {/* Role target */}
              <div className="col-span-1 md:col-span-3 md:pl-4 flex items-center">
                <div>
                  {/* Mobile label */}
                  <p className="font-geist-mono text-[9px] uppercase tracking-widest text-[#A1A1A1] mb-1 md:hidden">ROLE_TARGET</p>
                  <p className="font-geist-mono text-[11px] text-[#F5F5F5]">{item.jobTitle}</p>
                  <p className="font-geist-mono text-[9px] text-[#A1A1A1]/60 uppercase tracking-widest mt-0.5">
                    JOB_ID: {item.jobId.toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Alignment score */}
              <div className="col-span-1 md:col-span-2 md:pl-4 flex items-center">
                <div>
                  {/* Mobile label */}
                  <p className="font-geist-mono text-[9px] uppercase tracking-widest text-[#A1A1A1] mb-1 md:hidden">ALIGN_%</p>
                  <span className="console-metric">
                    {formatScore(item.matchScore)}
                  </span>
                  <span className="font-geist-mono text-[9px] text-[#A1A1A1] ml-1">MATCH</span>
                </div>
              </div>

              {/* Queued timestamp */}
              <div className="col-span-1 md:col-span-2 md:pl-4 flex items-center">
                <div>
                  {/* Mobile label */}
                  <p className="font-geist-mono text-[9px] uppercase tracking-widest text-[#A1A1A1] mb-1 md:hidden">QUEUED_AT</p>
                  <span className="font-geist-mono text-[10px] text-[#A1A1A1]">
                    {formatTimestamp(item.addedAt)}
                  </span>
                </div>
              </div>

              {/* Operation */}
              <div className="col-span-1 md:col-span-1 flex items-center md:justify-end">
                <button
                  id={`remove-shortlist-${item.id}`}
                  onClick={() => handleRemove(item.id)}
                  className="font-geist-mono text-[9px] uppercase tracking-widest text-[#A1A1A1] hover:text-[#ffb4ab] transition-colors duration-150"
                  title="Remove from queue"
                >
                  [DEQUEUE]
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer status strip */}
      <div className="border-t border-white/5 px-6 md:px-8 py-3 flex items-center justify-between">
        <span className="font-geist-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">
          // END_OF_SELECTION_MATRIX
        </span>
        <span className="font-geist-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">
          EXPORT_FORMAT: <span className="text-[#F5F5F5]">CSV // JSON // PDF</span>
        </span>
      </div>
    </AppShell>
  )
}
