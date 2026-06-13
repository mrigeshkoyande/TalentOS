import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="w-full py-8 border-t border-white/5 bg-transparent relative z-10">
      <div className="max-w-container-max mx-auto px-6 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* Left Side: Brand */}
        <div className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="TalentOS" className="h-4.5 w-auto brightness-0 invert opacity-70" />
          <span className="font-mono text-xs text-[#A1A1A1] tracking-wider">
            TALENTOS // RECRUITER_OS
          </span>
        </div>

        {/* Right Side: Links & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-center sm:text-right">
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Security'].map(link => (
              <a
                key={link}
                href="#"
                className="font-mono text-[9px] text-[#A1A1A1] uppercase tracking-widest hover:text-[#C7A36A] transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
          <p className="font-mono text-[9px] text-[#A1A1A1]/40 uppercase tracking-wider">
            © 2026 TalentOS. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}
