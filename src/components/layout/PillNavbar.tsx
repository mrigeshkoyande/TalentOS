import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { label: 'Dashboard', path: '/dashboard', console: 'OVERVIEW' },
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

  // ─── Landing page: existing pill navbar (beautified) ──────────────────────
  if (isLanding) {
    return (
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <nav className="bg-[#11131b]/60 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center justify-between gap-8 w-full max-w-xl shadow-2xl">
          {/* Logo + Brand */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img
              src="/logo.svg"
              alt="TalentOS Logo"
              className="h-5 w-auto brightness-0 invert"
            />
            <span className="font-display text-xl tracking-wide text-[#F5F5F5] select-none font-medium">
              TalentOS
            </span>
          </Link>

          {/* CTA */}
          <Link
            to="/dashboard"
            className="relative group overflow-hidden bg-gradient-to-r from-[#C7A36A]/20 to-[#C7A36A]/10 hover:from-[#C7A36A]/30 hover:to-[#C7A36A]/20 border border-[#C7A36A]/30 hover:border-[#C7A36A]/50 rounded-full px-6 py-2 font-mono text-[#F5F5F5] uppercase tracking-widest text-[10px] active:scale-95 transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              Enter Interface 
              <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </span>
          </Link>
        </nav>
      </div>
    )
  }

  // ─── Console views: compact premium sticky header (h-16) ───────────────────
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0b0c10]/70 backdrop-blur-md border-b border-white/5 shadow-lg flex items-stretch">
        <div className="flex items-stretch w-full px-6 md:px-8">
          
          {/* Left: Brand + logo */}
          <div className="flex items-center gap-3 border-r border-white/5 pr-6 mr-6 shrink-0">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-85 transition-opacity">
              <img
                src="/logo.svg"
                alt="TalentOS"
                className="h-4.5 w-auto brightness-0 invert opacity-90"
              />
              <span className="font-geist text-xs font-semibold text-[#F5F5F5] tracking-widest uppercase select-none">
                TalentOS
              </span>
            </Link>
          </div>

          {/* Breadcrumb path */}
          <div className="hidden lg:flex items-center gap-1.5 border-r border-white/5 pr-6 mr-auto">
            {pathSegments.map((seg, i) => (
              <span key={i} className="font-mono text-[10px] tracking-wider text-[#A1A1A1] flex items-center gap-1.5">
                {i > 0 && <span className="text-white/10 mx-0.5">//</span>}
                <span className={i === pathSegments.length - 1 ? 'text-[#C7A36A] font-medium text-glow-gold' : ''}>
                  {seg}
                </span>
              </span>
            ))}
          </div>

          {/* Center: Nav links (desktop) */}
          <nav className="hidden md:flex items-stretch gap-1 ml-auto">
            {NAV_LINKS.map(({ label, path }) => {
              const isActive = location.pathname === path
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center px-4 text-[11px] font-mono tracking-widest uppercase transition-all duration-200 relative h-full group ${
                    isActive ? 'text-[#F5F5F5]' : 'text-[#A1A1A1] hover:text-[#F5F5F5]'
                  }`}
                >
                  <span className="relative z-10">{label}</span>
                  
                  {/* Sliding active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-[#C7A36A] to-transparent"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Hover background effect */}
                  <span className="absolute inset-x-1 inset-y-2.5 rounded bg-white/0 group-hover:bg-white/3 transition-colors duration-150 -z-0" />
                </Link>
              )
            })}
          </nav>

          {/* Right: Status indicator */}
          <div className="hidden md:flex items-center gap-2.5 border-l border-white/5 pl-6 ml-6">
            <span className="h-2 w-2 rounded-full bg-[#779165] animate-pulse" />
            <span className="font-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">
              SYS_ONLINE
            </span>
          </div>

          {/* Mobile: Hamburger Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden ml-auto flex items-center justify-center p-2 text-[#A1A1A1] hover:text-[#F5F5F5] transition-colors"
            aria-label="Open navigation menu"
          >
            <span className="material-symbols-outlined text-xl">menu</span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[90] bg-[#0b0c10]/80 backdrop-blur-sm"
            />

            {/* Side Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 z-[100] bg-[#11131b] border-l border-white/5 shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <img src="/logo.svg" alt="TalentOS" className="h-4.5 w-auto brightness-0 invert opacity-90" />
                  <span className="font-geist text-xs font-semibold text-[#F5F5F5] tracking-widest uppercase">
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

              {/* Mobile Breadcrumb */}
              <div className="flex items-center gap-1 px-6 py-3 border-b border-white/5 bg-[#0b0c10]/30">
                {pathSegments.map((seg, i) => (
                  <span key={i} className="font-mono text-[9px] tracking-wider text-[#A1A1A1] flex items-center gap-1">
                    {i > 0 && <span className="text-white/10">//</span>}
                    <span className={i === pathSegments.length - 1 ? 'text-[#C7A36A]' : ''}>
                      {seg}
                    </span>
                  </span>
                ))}
              </div>

              {/* Drawer Links */}
              <nav className="flex flex-col flex-1 py-4">
                {NAV_LINKS.map(({ label, path, console: consoleLabel }) => {
                  const isActive = location.pathname === path
                  return (
                    <Link
                      key={path}
                      to={path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-6 py-4.5 transition-colors relative ${
                        isActive ? 'text-[#F5F5F5] bg-white/2' : 'text-[#A1A1A1] hover:text-[#F5F5F5] hover:bg-white/1'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#C7A36A]" />}
                        <span className="font-geist text-sm font-medium">{label}</span>
                      </div>
                      <span className={`font-mono text-[9px] tracking-widest uppercase ${
                        isActive ? 'text-[#C7A36A]' : 'text-[#A1A1A1]/40'
                      }`}>
                        {consoleLabel}
                      </span>
                    </Link>
                  )
                })}
              </nav>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-white/5 bg-[#0b0c10]/40">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#779165] animate-pulse" />
                  <span className="font-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest">
                    SYS_ONLINE // TERMINAL_v1
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
