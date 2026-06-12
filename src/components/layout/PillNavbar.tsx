import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { label: 'Job Analyzer', path: '/job-analyzer', console: 'ANALYZER' },
  { label: 'Pipeline Ledger', path: '/ranking', console: 'PIPELINE_LEDGER' },
  { label: 'Hidden Gems', path: '/hidden-gems', console: 'LATENT_INTENT' },
  { label: 'Shortlists', path: '/shortlists', console: 'SELECTION_MATRIX' },
]

const CONSOLE_PATHS: Record<string, string[]> = {
  '/job-analyzer': ['CONSOLE', 'ACCOUNT_SETUP', 'INGESTION_CONSOLE'],
  '/ranking': ['CONSOLE', 'TARGET_DATASETS', 'PIPELINES'],
  '/hidden-gems': ['CONSOLE', 'LATENT_INTENT_DISCOVER', 'HG_INDEX'],
  '/shortlists': ['CONSOLE', 'SELECTION_MATRIX', 'EXPORT_QUEUE'],
  '/dashboard': ['CONSOLE', 'OVERVIEW'],
}

interface PillNavbarProps {
  /** On landing page, show the pill layout. On console views, show flat bar. */
  isLanding?: boolean
}

export default function PillNavbar({ isLanding = false }: PillNavbarProps) {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const pathSegments = CONSOLE_PATHS[location.pathname] || ['CONSOLE']

  // ─── Landing page: existing pill navbar (untouched) ──────────────────────
  if (isLanding) {
    return (
      <>
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 sm:px-6">
          <nav className="pill-navbar rounded-full px-4 py-2 md:px-6 flex items-center justify-between md:justify-start gap-4 md:gap-8 w-full max-w-lg md:max-w-fit">
            {/* Logo + Brand */}
            <div className="flex items-center gap-2 md:gap-3">
              <img
                src="/logo.svg"
                alt="TalentOS Logo"
                className="h-5 w-auto md:h-6 brightness-0 invert"
              />
              <span className="font-display-md text-xl md:text-2xl tracking-tighter text-primary select-none">
                TalentOS
              </span>
            </div>

            {/* CTA */}
            <Link
              to="/dashboard"
              className="liquid-glass rounded-full px-4 py-1.5 md:px-5 md:py-2 font-label-sm text-primary uppercase tracking-widest text-[10px] md:text-[11px] active:scale-95 transition-transform whitespace-nowrap"
            >
              Enter Interface →
            </Link>
          </nav>
        </div>
      </>
    )
  }

  // ─── Console views: flat top bar ─────────────────────────────────────────
  return (
    <>
      {/* Desktop + Tablet flat bar */}
      <header className="console-nav-bar fixed top-0 left-0 right-0 z-50 h-12 flex items-stretch">
        <div className="flex items-stretch w-full px-5 md:px-8">

          {/* Left: Brand + breadcrumb */}
          <div className="flex items-center gap-3 border-r border-white/5 pr-5 mr-5 shrink-0">
            <img
              src="/logo.svg"
              alt="TalentOS"
              className="h-4 w-auto brightness-0 invert opacity-80"
            />
            <span className="font-geist text-[11px] font-medium text-[#F5F5F5] tracking-widest uppercase select-none">
              TalentOS
            </span>
          </div>

          {/* Breadcrumb path */}
          <div className="hidden md:flex items-center gap-1 border-r border-white/5 pr-5 mr-auto">
            {pathSegments.map((seg, i) => (
              <span key={i} className="console-path flex items-center gap-1">
                {i > 0 && <span className="text-white/15 mx-0.5">//</span>}
                <span className={i === pathSegments.length - 1 ? 'text-[#C7A36A]' : ''}>
                  {seg}
                </span>
              </span>
            ))}
          </div>

          {/* Center: Nav links (desktop) */}
          <nav className="hidden md:flex items-stretch gap-0 ml-auto">
            {NAV_LINKS.map(({ label, path }) => {
              const isActive = location.pathname === path
              return (
                <Link
                  key={path}
                  to={path}
                  className={[
                    'flex items-center px-4 text-[11px] tracking-widest uppercase transition-colors duration-150 relative h-full',
                    isActive
                      ? 'console-active-link'
                      : 'console-nav-link',
                  ].join(' ')}
                >
                  {label}
                  {isActive && (
                    <motion.div
                      layoutId="console-underline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C7A36A]"
                      transition={{ type: 'spring', stiffness: 600, damping: 50 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right: Status indicator */}
          <div className="hidden md:flex items-center gap-2 border-l border-white/5 pl-5 ml-4">
            <span className="h-1.5 w-1.5 rounded-full bg-[#779165]" />
            <span className="font-geist-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">
              SYS_ONLINE
            </span>
          </div>

          {/* Mobile: hamburger */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden ml-auto flex items-center justify-center p-2 text-[#A1A1A1] hover:text-[#F5F5F5] transition-colors"
            aria-label="Open navigation menu"
          >
            <span className="material-symbols-outlined text-xl">menu</span>
          </button>
        </div>
      </header>

      {/* Mobile navigation overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-[100] bg-[#11131b] flex flex-col"
          >
            {/* Overlay header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <img src="/logo.svg" alt="TalentOS" className="h-4 w-auto brightness-0 invert opacity-80" />
                <span className="font-geist text-[11px] font-medium text-[#F5F5F5] tracking-widest uppercase">
                  TalentOS
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center p-2 text-[#A1A1A1] hover:text-[#F5F5F5] transition-colors"
                aria-label="Close navigation"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Breadcrumb mobile */}
            <div className="flex items-center gap-1 px-6 py-3 border-b border-white/5">
              {pathSegments.map((seg, i) => (
                <span key={i} className="console-path flex items-center gap-1">
                  {i > 0 && <span className="text-white/15 mx-0.5">//</span>}
                  <span className={i === pathSegments.length - 1 ? 'text-[#C7A36A]' : ''}>
                    {seg}
                  </span>
                </span>
              ))}
            </div>

            {/* Mobile nav links */}
            <nav className="flex flex-col flex-1">
              {NAV_LINKS.map(({ label, path, console: consoleLabel }) => {
                const isActive = location.pathname === path
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setIsOpen(false)}
                    className={[
                      'flex items-center justify-between px-6 py-5 border-b border-white/5 transition-colors duration-150',
                      isActive
                        ? 'text-[#F5F5F5]'
                        : 'text-[#A1A1A1] hover:text-[#F5F5F5]',
                    ].join(' ')}
                  >
                    <span className="font-geist text-sm tracking-wide">{label}</span>
                    <span className={[
                      'font-geist-mono text-[9px] tracking-widest uppercase',
                      isActive ? 'text-[#C7A36A]' : 'text-[#A1A1A1]/50',
                    ].join(' ')}>
                      {consoleLabel}
                    </span>
                  </Link>
                )
              })}
            </nav>

            {/* Overlay footer */}
            <div className="px-6 py-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#779165]" />
                <span className="font-geist-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">
                  SYS_ONLINE // TALENTOS_CONSOLE_v1
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
