import { Link } from 'react-router-dom'
import PillNavbar from '../components/layout/PillNavbar'
import Footer from '../components/layout/Footer'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085844_21a8f4b3-dea5-4ede-be16-d53f6973bb14.mp4'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <PillNavbar isLanding />

      {/* ─── Hero ──────────────────────────────────────────────────────────── */}
      <main className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-55"
          aria-hidden="true"
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>

        {/* Subtle vignette overlay */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 30%, rgba(17,19,27,0.7) 100%)',
          }}
        />

        {/* Content Overlay */}
        <div className="relative z-10 w-full max-w-container-max px-margin-mobile md:px-margin-desktop text-center flex flex-col items-center">
          <h1 className="text-hero text-primary mb-8 animate-fade-rise">
            Hire{' '}
            <em className="not-italic text-on-surface-variant">beyond keywords.</em>
            <br />
            Discover talent{' '}
            <em className="not-italic text-on-surface-variant">beyond expectations.</em>
          </h1>

          <p className="max-w-2xl font-body-lg text-body-lg text-on-surface-variant mb-12 leading-relaxed animate-fade-rise-delay">
            TalentOS analyzes skills, experience, career progression, and behavioral
            signals to surface the most relevant candidates instantly. Built for
            recruiters who need more than keyword matching.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 animate-fade-rise-delay-2">
            <Link
              to="/dashboard"
              id="cta-start-recruiting"
              className="liquid-glass rounded-full px-14 py-5 font-label-sm text-primary text-sm uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Start Recruiting
            </Link>
            <a
              href="#intelligence"
              className="flex items-center gap-2 font-label-sm text-on-surface-variant hover:text-primary transition-colors text-sm"
            >
              <span className="material-symbols-outlined text-[18px]">play_circle</span>
              WATCH DEMO
            </a>
          </div>
        </div>

        {/* Metrics Strip */}
        <div className="relative z-10 w-full max-w-container-max px-margin-mobile md:px-margin-desktop mt-20 grid grid-cols-1 md:grid-cols-3 gap-gutter animate-fade-rise-delay-2">
          {[
            { stat: '+1,000', label: 'Candidates Ranked' },
            { stat: '+92%', label: 'Match Accuracy' },
            { stat: '+70%', label: 'Hidden Gems Discovered' },
          ].map(({ stat, label }) => (
            <div key={label} className="liquid-glass p-8 rounded-xl flex flex-col items-center text-center">
              <span className="font-display-md text-primary mb-2">{stat}</span>
              <span className="font-label-sm text-on-surface-variant uppercase tracking-widest text-[11px]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </main>

      {/* ─── Intelligence Core ─────────────────────────────────────────────── */}
      <section id="intelligence" className="relative z-10 py-32 bg-surface/80 backdrop-blur-sm">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left copy */}
          <div className="lg:col-span-7 space-y-8">
            <span className="font-label-sm text-secondary uppercase tracking-[0.3em] text-sm">
              Intelligence Core
            </span>
            <h2 className="font-display-lg text-primary leading-tight tracking-tight">
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
                  <h4 className="font-headline-lg text-xl text-primary font-semibold">{title}</h4>
                  <p className="font-body-md text-on-surface-variant leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right visual */}
          <div className="lg:col-span-5 w-full">
            <div className="liquid-glass w-full h-auto aspect-video lg:aspect-square rounded-3xl overflow-hidden border border-white/5">
              {/* Atmospheric dark placeholder */}
              <div className="w-full h-full flex items-center justify-center bg-surface-container-low relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background:
                      'radial-gradient(circle at 60% 40%, rgba(164,203,235,0.3) 0%, transparent 60%), radial-gradient(circle at 30% 70%, rgba(199,163,106,0.2) 0%, transparent 50%)',
                  }}
                />
                <div className="relative z-10 text-center">
                  <img src="/logo.svg" alt="" className="h-24 w-auto mx-auto opacity-30 brightness-0 invert" />
                  <p className="font-label-sm text-on-surface-variant uppercase tracking-widest text-[10px] mt-6">
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
