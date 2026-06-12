export default function Footer() {
  return (
    <footer className="w-full py-10 border-t border-white/5 bg-transparent relative z-10">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="TalentOS" className="h-5 w-auto brightness-0 invert opacity-70" />
            <span className="font-display-md text-xl text-primary">TalentOS Intelligence</span>
          </div>
          <p className="font-label-sm text-on-surface-variant text-[11px] tracking-wide">
            © 2024 TalentOS Intelligence. All rights reserved.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {['Privacy Policy', 'Terms of Service', 'API Documentation', 'Security'].map(link => (
            <a
              key={link}
              href="#"
              className="font-label-sm text-on-surface-variant uppercase tracking-widest text-[10px] hover:text-primary transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
