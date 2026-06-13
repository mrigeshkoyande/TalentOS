import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Footer from '../components/layout/Footer'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085844_21a8f4b3-dea5-4ede-be16-d53f6973bb14.mp4'

const NAV_LINKS = [
  { label: 'Job Analyzer', path: '/job-analyzer' },
  { label: 'Ranking Engine', path: '/ranking' },
  { label: 'Hidden Gems', path: '/hidden-gems' },
  { label: 'Shortlists', path: '/shortlists' },
]

export default function LandingPage() {
  const [mousePos, setMousePos] = useState<Record<string, { x: number; y: number }>>({})
  const [scrolled, setScrolled] = useState(false)

  // Scroll listener for navbar shrink
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleMouseMove = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos(prev => ({
      ...prev,
      [id]: { x: e.clientX - rect.left, y: e.clientY - rect.top },
    }))
  }

  return (
    <div className="min-h-screen bg-[#11131b] text-[#e2e1ed] overflow-x-hidden">
      {/* ─── SVG Glass Distortion Filter ───────────────────────────────────────── */}
      <svg style={{ display: 'none' }} aria-hidden="true">
        <filter id="glass-distortion">
          <feTurbulence type="turbulence" baseFrequency="0.008" numOctaves={2} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={77} />
        </filter>
      </svg>

      {/* ─── PILL NAVBAR ───────────────────────────────────────────────────────── */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 sm:px-6">
        <nav
          className="relative rounded-full px-4 py-2 md:px-6 flex items-center justify-between md:justify-start gap-4 md:gap-8 w-full max-w-lg md:max-w-fit transition-all duration-300"
          style={{
            background: scrolled ? 'rgba(17, 19, 27, 0.7)' : 'rgba(17, 19, 27, 0.4)',
            backdropFilter: 'blur(24px) contrast(110%)',
            WebkitBackdropFilter: 'blur(24px) contrast(110%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
            transform: scrolled ? 'scale(0.98)' : 'scale(1)',
          }}
        >
          {/* Top shine line */}
          <div
            className="absolute top-0 left-[10%] right-[10%] h-px pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
          />

          {/* Logo + Brand */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt="TalentOS Logo"
              className="h-5 w-auto md:h-6 brightness-0 invert"
            />
            <span className="font-[Instrument_Serif] text-xl md:text-2xl tracking-tight text-white select-none">
              TalentOS
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex gap-6 items-center">
            {NAV_LINKS.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className="text-xs text-[#c4c7c8] hover:text-white transition-colors duration-300 font-medium uppercase tracking-widest"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Enter CTA */}
          <Link
            to="/dashboard"
            className="liquid-glass rounded-full px-4 py-1.5 md:px-5 md:py-2 text-white uppercase tracking-widest text-[10px] md:text-[11px] active:scale-95 transition-transform whitespace-nowrap font-medium"
          >
            Enter Interface →
          </Link>
        </nav>
      </div>

      {/* ─── HERO CANVAS ────────────────────────────────────────────────────────── */}
      <main className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
        {/* Video Background - FULL IMMERSIVE 3D */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-60"
          aria-hidden="true"
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>

        {/* Subtle vignette overlay */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 20%, rgba(17,19,27,0.5) 100%)',
          }}
        />

        {/* Content Overlay */}
        <div className="relative z-10 w-full max-w-[1440px] px-4 md:px-16 text-center flex flex-col items-center">
          <h1
            className="font-[Instrument_Serif] text-[42px] sm:text-[56px] md:text-[68px] lg:text-[80px] text-white mb-6 animate-fade-rise leading-[1.05] tracking-[-0.02em]"
          >
            Hire{' '}
            <em className="not-italic text-[#c4c7c8]">beyond keywords.</em>
            <br />
            Discover talent{' '}
            <em className="not-italic text-[#c4c7c8]">beyond expectations.</em>
          </h1>

          <p className="max-w-3xl text-lg md:text-xl text-[#c4c7c8] mb-12 leading-relaxed animate-fade-rise-delay">
            TalentOS analyzes skills, experience, career progression, and behavioral
            signals to surface the most relevant candidates instantly. Built for
            recruiters who need more than keyword matching.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 animate-fade-rise-delay-2">
            <Link
              to="/dashboard"
              id="cta-start-recruiting"
              onMouseMove={(e) => handleMouseMove('cta', e)}
              className="liquid-glass rounded-full px-14 py-5 text-white text-sm uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all duration-300"
              style={{
                '--mouse-x': `${mousePos['cta']?.x ?? 0}px`,
                '--mouse-y': `${mousePos['cta']?.y ?? 0}px`,
              } as React.CSSProperties}
            >
              Start Recruiting
            </Link>
            <a
              href="#intelligence"
              className="flex items-center gap-2 text-[#c4c7c8] hover:text-white transition-colors text-sm font-medium uppercase tracking-widest"
            >
              <span className="material-symbols-outlined text-[18px]">play_circle</span>
              Watch Demo
            </a>
          </div>
        </div>

        {/* ─── METRICS BENTO STRIP ───────────────────────────────────────────── */}
        <div className="relative z-10 w-full max-w-[1440px] px-4 md:px-16 mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-rise-delay-2">
          {[
            { stat: '+1,000', label: 'Candidates Ranked' },
            { stat: '+92%', label: 'Match Accuracy' },
            { stat: '+70%', label: 'Hidden Gems Discovered' },
          ].map(({ stat, label }, idx) => (
            <div
              key={label}
              onMouseMove={(e) => handleMouseMove(`metric-${idx}`, e)}
              className="liquid-glass p-8 rounded-xl flex flex-col items-center text-center"
              style={{
                '--mouse-x': `${mousePos[`metric-${idx}`]?.x ?? 0}px`,
                '--mouse-y': `${mousePos[`metric-${idx}`]?.y ?? 0}px`,
              } as React.CSSProperties}
            >
              <span className="font-[Instrument_Serif] text-4xl text-white mb-2">{stat}</span>
              <span className="text-[11px] text-[#c4c7c8] uppercase tracking-widest font-medium">
                {label}
              </span>
            </div>
          ))}
        </div>
      </main>

      {/* ─── INTELLIGENCE CORE SECTION ─────────────────────────────────────────── */}
      <section id="intelligence" className="relative z-10 py-32 bg-[#11131b]/80 backdrop-blur-sm">
        <div className="max-w-[1440px] mx-auto px-4 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left copy */}
          <div className="lg:col-span-7 space-y-8">
            <span className="text-xs text-[#a4cbeb] uppercase tracking-[0.3em] font-medium">
              Intelligence Core
            </span>
            <h2 className="font-[Instrument_Serif] text-[48px] md:text-[64px] text-white leading-tight tracking-tight">
              The new standard for elite talent acquisition.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: 'Behavioral Mapping',
                  body: 'Analyze candidate trajectory beyond their current title. Our AI understands the nuance of career growth and cultural fit.',
                },
                {
                  title: 'Signal Extraction',
                  body: 'Identify latent skills and cross-industry potential that standard ATS filters consistently overlook.',
                },
                {
                  title: 'Semantic Depth',
                  body: 'Move beyond keyword density. Evaluate conceptual alignment, architectural intent, and execution velocity.',
                },
                {
                  title: 'Latent Intent Index',
                  body: 'Surface profiles matching underlying execution intent while remaining unmapped by legacy keyword density filters.',
                },
              ].map(({ title, body }) => (
                <div key={title} className="space-y-3">
                  <h4 className="text-xl text-white font-semibold">{title}</h4>
                  <p className="text-[#c4c7c8] leading-relaxed text-sm">{body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right visual */}
          <div className="lg:col-span-5 w-full">
            <div
              onMouseMove={(e) => handleMouseMove('neural-visual', e)}
              className="liquid-glass w-full aspect-square rounded-3xl overflow-hidden"
              style={{
                '--mouse-x': `${mousePos['neural-visual']?.x ?? 0}px`,
                '--mouse-y': `${mousePos['neural-visual']?.y ?? 0}px`,
              } as React.CSSProperties}
            >
              <div className="w-full h-full flex items-center justify-center bg-[#0c0e16] relative overflow-hidden">
                {/* Ambient glow inside card */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background:
                      'radial-gradient(circle at 60% 40%, rgba(164,203,235,0.3) 0%, transparent 60%), radial-gradient(circle at 30% 70%, rgba(199,163,106,0.2) 0%, transparent 50%)',
                  }}
                />
                <div className="relative z-10 text-center">
                  <img src="/logo.svg" alt="" className="h-24 w-auto mx-auto opacity-25 brightness-0 invert" />
                  <p className="text-[#c4c7c8] uppercase tracking-widest text-[10px] mt-6 font-medium">
                    Neural Intelligence Core
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
