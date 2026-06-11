import { Link } from 'react-router-dom'

interface ConsoleFooterProps {
  className?: string
}

export default function ConsoleFooter({ className = '' }: ConsoleFooterProps) {
  return (
    <footer
      className={`w-full mt-auto border-t border-white/[0.04] ${className}`}
      style={{ background: 'rgba(11,12,16,0.6)', backdropFilter: 'blur(12px)' }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Left: Brand */}
        <div className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="TalentOS" className="h-3.5 w-auto brightness-0 invert opacity-40" />
          <span className="font-mono text-[10px] text-[#A1A1A1]/40 tracking-[0.15em] uppercase">
            TalentOS · RECRUITER_OS v1.0
          </span>
        </div>

        {/* Right: Nav shortcuts */}
        <div className="flex items-center gap-6">
          {[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Job Analyzer', href: '/job-analyzer' },
            { label: 'Pipeline', href: '/ranking' },
            { label: 'Hidden Gems', href: '/hidden-gems' },
            { label: 'Shortlists', href: '/shortlists' },
          ].map(link => (
            <Link
              key={link.href}
              to={link.href}
              className="font-mono text-[10px] text-[#A1A1A1]/30 uppercase tracking-widest hover:text-[#C7A36A]/70 transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

      </div>
    </footer>
  )
}
