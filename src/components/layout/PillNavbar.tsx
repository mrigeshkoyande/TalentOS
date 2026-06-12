import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'

const NAV_LINKS = [
  { label: 'Dashboard',      path: '/dashboard',    icon: 'grid_view' },
  { label: 'Job Analyzer',   path: '/job-analyzer', icon: 'psychology' },
  { label: 'Pipeline',       path: '/ranking',       icon: 'account_tree' },
  { label: 'Hidden Gems',    path: '/hidden-gems',   icon: 'auto_awesome' },
  { label: 'Shortlists',     path: '/shortlists',    icon: 'bookmarks' },
]

const BREADCRUMBS: Record<string, string[]> = {
  '/job-analyzer': ['CONSOLE', 'JD_SYNTHESIZER'],
  '/ranking':      ['CONSOLE', 'PIPELINE_LEDGER'],
  '/hidden-gems':  ['CONSOLE', 'LATENT_INTENT'],
  '/shortlists':   ['CONSOLE', 'SELECTION_MATRIX'],
  '/dashboard':    ['CONSOLE', 'OVERVIEW'],
}

interface PillNavbarProps {
  isLanding?: boolean
}

export default function PillNavbar({ isLanding = false }: PillNavbarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, loginWithGoogle, logout } = useAuth()
  const [isOpen, setIsOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navRef                  = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const breadcrumbs = BREADCRUMBS[location.pathname] || ['CONSOLE']

  /* scroll shrink */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* mouse-position for specular refraction */
  useEffect(() => {
    const el = navRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      setMousePos({ x: e.clientX - r.left, y: e.clientY - r.top })
    }
    el.addEventListener('mousemove', onMove)
    return () => el.removeEventListener('mousemove', onMove)
  }, [])

  /* close drawer on route change */
  useEffect(() => { setIsOpen(false) }, [location.pathname])

  /* ─── Landing variant ─────────────────────────────────────────────────── */
  if (isLanding) {
    return (
      <div className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4 sm:px-6">
        <nav
          ref={navRef}
          className={`liquid-glass-nav rounded-full px-5 py-2.5 flex items-center gap-5 w-auto transition-all duration-500 ${
            scrolled ? 'scale-[0.97] opacity-95' : 'scale-100 opacity-100'
          }`}
          style={{
            '--mouse-x': `${mousePos.x}px`,
            '--mouse-y': `${mousePos.y}px`,
          } as React.CSSProperties}
        >
          {/* Brand — clicks back to landing */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.svg" alt="TalentOS" className="h-5 w-auto brightness-0 invert" />
            <span className="font-[Instrument_Serif] text-xl tracking-tight text-white select-none">
              TalentOS
            </span>
          </Link>

          {/* Divider */}
          <span className="w-px h-4 bg-white/10 shrink-0" />

          {/* CTA — dynamically rendered based on Auth */}
          {!user ? (
            <button
              onClick={async () => {
                await loginWithGoogle()
                navigate('/dashboard')
              }}
              className="liquid-glass rounded-full px-5 py-2 text-white uppercase tracking-widest text-xs font-medium active:scale-95 transition-all duration-200 whitespace-nowrap hover:shadow-[0_0_16px_rgba(199,163,106,0.3)] cursor-pointer"
            >
              Start Recruiting →
            </button>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-2">
                {NAV_LINKS.map(({ label, path, icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-mono tracking-widest uppercase text-[#A1A1A1] hover:text-[#F0F0F0] hover:bg-white/[0.04] transition-all"
                  >
                    <span className="material-symbols-outlined text-xs text-[#A1A1A1]/60">
                      {icon}
                    </span>
                    <span>{label}</span>
                  </Link>
                ))}
              </div>

              {/* Mobile Menu Trigger for logged in user */}
              <button
                onClick={() => setIsOpen(true)}
                className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-[#A1A1A1] hover:text-[#F5F5F5] hover:bg-white/5 transition-all"
                aria-label="Open menu"
              >
                <span className="material-symbols-outlined text-lg">menu</span>
              </button>

              <span className="w-px h-4 bg-white/10 shrink-0" />

              <button
                onClick={logout}
                className="text-[11px] font-mono uppercase tracking-wider text-[#A1A1A1]/60 hover:text-red-400 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </>
          )}
        </nav>
      </div>
    )
  }

  /* ─── Console (inner pages) variant ─────────────────────────────────────── */
  return (
    <>
      {/* Floating Island */}
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 md:px-6">
        <header
          ref={navRef}
          className={`liquid-glass-nav w-full max-w-[1400px] h-14 rounded-full flex items-stretch transition-all duration-500 ${
            scrolled ? 'scale-[0.985] opacity-95' : 'scale-100 opacity-100'
          }`}
          style={{
            '--mouse-x': `${mousePos.x}px`,
            '--mouse-y': `${mousePos.y}px`,
          } as React.CSSProperties}
        >
          <div className="flex items-stretch w-full px-5 md:px-6 gap-0">

            {/* ── Brand ── */}
            <div className="flex items-center border-r border-white/[0.06] pr-5 mr-4 shrink-0">
              <Link
                to="/"
                className="flex items-center gap-2.5 hover:opacity-80 transition-opacity group"
                title="Back to Home"
              >
                <img src="/logo.svg" alt="TalentOS" className="h-4 w-auto brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity" />
                <span className="font-mono text-xs font-semibold text-[#E8E8E8] tracking-[0.18em] uppercase select-none">
                  TalentOS
                </span>
              </Link>
            </div>

            {/* ── Breadcrumb ── */}
            <div className="hidden lg:flex items-center gap-1.5 border-r border-white/[0.06] pr-5 mr-auto">
              {breadcrumbs.map((seg, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-white/10 font-mono text-xs">/</span>}
                  <span className={`font-mono text-xs tracking-wider ${
                    i === breadcrumbs.length - 1
                      ? 'text-[#C7A36A] font-medium text-glow-gold'
                      : 'text-[#A1A1A1]/60'
                  }`}>
                    {seg}
                  </span>
                </span>
              ))}
            </div>

            {/* ── Desktop Nav Links ── */}
            <nav className="hidden md:flex items-stretch gap-0.5 ml-auto">
              {NAV_LINKS.map(({ label, path, icon }) => {
                const isActive = location.pathname === path
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`relative flex items-center gap-1.5 px-3.5 text-xs font-mono tracking-widest uppercase transition-all duration-200 h-full group ${
                      isActive
                        ? 'text-[#F5F5F5]'
                        : 'text-[#A1A1A1] hover:text-[#F0F0F0]'
                    }`}
                  >
                    {/* Hover bg */}
                    <span className="absolute inset-x-0.5 inset-y-2 rounded-lg bg-white/0 group-hover:bg-white/[0.04] transition-colors duration-150" />
                    
                    {/* Icon */}
                    <span className={`material-symbols-outlined text-sm relative z-10 transition-colors ${
                      isActive ? 'text-[#C7A36A]' : 'text-[#A1A1A1]/60 group-hover:text-[#A1A1A1]'
                    }`}>
                      {icon}
                    </span>

                    <span className="relative z-10">{label}</span>

                    {/* Active underline — animated with layoutId */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-active-bar"
                        className="absolute bottom-1.5 left-2 right-2 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#C7A36A] to-transparent"
                        style={{ boxShadow: '0 0 8px rgba(199,163,106,0.6)' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                  </Link>
                )
              })}
              
              {user && (
                <>
                  <span className="w-px h-6 bg-white/10 my-auto mx-3" />
                  <button
                    onClick={async () => {
                      await logout()
                      navigate('/')
                    }}
                    className="flex items-center gap-1.5 px-3 text-xs font-mono tracking-widest uppercase text-[#A1A1A1] hover:text-red-400 transition-colors cursor-pointer"
                    title="Sign Out"
                  >
                    <span className="material-symbols-outlined text-sm text-red-400/70">logout</span>
                    <span>Logout</span>
                  </button>
                </>
              )}
            </nav>

            {/* ── Mobile hamburger ── */}
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden ml-auto flex items-center justify-center w-9 h-9 my-auto rounded-lg text-[#A1A1A1] hover:text-[#F5F5F5] hover:bg-white/5 transition-all"
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined text-xl">menu</span>
            </button>

          </div>
        </header>
      </div>

      {/* ─── Mobile Drawer ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[90] bg-[#0b0c10]/75 backdrop-blur-sm"
            />

            {/* Slide-in Drawer */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-72 z-[100] flex flex-col border-l border-white/[0.06]"
              style={{
                background: 'rgba(13,14,20,0.95)',
                backdropFilter: 'blur(32px)',
              }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                  <img src="/logo.svg" alt="TalentOS" className="h-4 w-auto brightness-0 invert opacity-80" />
                  <span className="font-mono text-xs font-semibold text-[#E8E8E8] tracking-widest uppercase">TalentOS</span>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-md text-[#A1A1A1] hover:text-[#F5F5F5] hover:bg-white/5 transition-all"
                  aria-label="Close menu"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              {/* Breadcrumb */}
              <div className="flex items-center gap-1 px-5 py-3 border-b border-white/[0.04]">
                {breadcrumbs.map((seg, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <span className="text-white/10 font-mono text-xs">/</span>}
                    <span className={`font-mono text-xs tracking-wider ${i === breadcrumbs.length - 1 ? 'text-[#C7A36A]' : 'text-[#A1A1A1]/40'}`}>
                      {seg}
                    </span>
                  </span>
                ))}
              </div>

              {/* Nav Links */}
              <nav className="flex flex-col flex-1 py-3 overflow-y-auto">
                {NAV_LINKS.map(({ label, path, icon }) => {
                  const isActive = location.pathname === path
                  return (
                    <Link
                      key={path}
                      to={path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-5 py-3.5 transition-all relative ${
                        isActive
                          ? 'text-[#F5F5F5] bg-white/[0.03]'
                          : 'text-[#A1A1A1] hover:text-[#F5F5F5] hover:bg-white/[0.02]'
                      }`}
                    >
                      {/* Active marker */}
                      {isActive && (
                        <span className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-[#C7A36A] rounded-r" style={{ boxShadow: '0 0 6px rgba(199,163,106,0.8)' }} />
                      )}
                      <span className={`material-symbols-outlined text-lg ${isActive ? 'text-[#C7A36A]' : 'text-[#A1A1A1]/50'}`}>
                        {icon}
                      </span>
                      <span className="font-geist text-sm font-medium">{label}</span>
                    </Link>
                  )
                })}
              </nav>

              {/* Drawer footer */}
              <div className="p-5 border-t border-white/[0.05] flex flex-col gap-3">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-[#A1A1A1]/40 hover:text-[#A1A1A1] transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">home</span>
                  <span className="font-mono text-xs uppercase tracking-widest">Back to Home</span>
                </Link>
                
                {user && (
                  <button
                    onClick={async () => {
                      setIsOpen(false)
                      await logout()
                      navigate('/')
                    }}
                    className="flex items-center gap-2 text-[#A1A1A1]/40 hover:text-red-400 transition-colors w-full text-left cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm text-red-400/70">logout</span>
                    <span className="font-mono text-xs uppercase tracking-widest">Sign Out</span>
                  </button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
