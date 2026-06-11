import { type ReactNode } from 'react'
import PillNavbar from './PillNavbar'
import ConsoleFooter from './ConsoleFooter'

interface AppShellProps {
  children: ReactNode
  noPadding?: boolean
}

export default function AppShell({ children, noPadding = false }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden console-font">
      {/* Floating Liquid-Glass Navbar */}
      <PillNavbar isLanding={false} />

      {/* Ambient top glow — consistent with landing page */}
      <div
        className="fixed top-0 left-0 right-0 h-[500px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% -5%, rgba(199,163,106,0.07) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Main content pushed below floating navbar (top: ~80px) */}
      <main
        className={`flex-1 relative z-10 ${
          noPadding
            ? 'pt-20 md:pt-24'
            : 'pt-20 md:pt-24 px-4 sm:px-6 md:px-8 pb-8 w-full max-w-7xl mx-auto'
        }`}
      >
        {children}
      </main>

      {/* Consistent minimal footer — no copyright */}
      <ConsoleFooter className="relative z-10" />
    </div>
  )
}
