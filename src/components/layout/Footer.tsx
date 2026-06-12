import { Link } from 'react-router-dom'

/**
 * Landing-page footer only.
 * Copyright appears ONLY here — not on inner console pages.
 */
export default function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.04] relative z-10" style={{ background: 'rgba(11,12,16,0.8)' }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-10">
        
        {/* Top row */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="TalentOS" className="h-5 w-auto brightness-0 invert opacity-70" />
            <div>
              <span className="font-mono text-xs text-[#A1A1A1] tracking-[0.15em] uppercase block">
                TalentOS
              </span>
              <span className="font-mono text-[10px] text-[#A1A1A1]/40 tracking-wider uppercase">
                AI Hiring Intelligence
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="flex flex-col gap-3">
              <span className="font-mono text-[10px] text-[#A1A1A1]/40 uppercase tracking-widest">Platform</span>
              {[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Job Analyzer', href: '/job-analyzer' },
                { label: 'Pipeline Ledger', href: '/ranking' },
                { label: 'Hidden Gems', href: '/hidden-gems' },
                { label: 'Shortlists', href: '/shortlists' },
              ].map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="font-mono text-xs text-[#A1A1A1] uppercase tracking-widest hover:text-[#C7A36A] transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-mono text-[10px] text-[#A1A1A1]/40 uppercase tracking-widest">Legal</span>
              {['Privacy', 'Terms', 'Security'].map(link => (
                <a
                  key={link}
                  href="#"
                  className="font-mono text-xs text-[#A1A1A1] uppercase tracking-widest hover:text-[#C7A36A] transition-colors duration-200"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row — copyright ONLY on landing */}
        <div className="border-t border-white/[0.04] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-mono text-[10px] text-[#A1A1A1]/30 uppercase tracking-wider">
            © 2026 TalentOS. All rights reserved. Built for India Runs Data & AI Challenge.
          </p>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#779165] animate-pulse" />
            <span className="font-mono text-[10px] text-[#779165]/60 uppercase tracking-widest">
              System Online
            </span>
          </div>
        </div>

      </div>
    </footer>
  )
}
