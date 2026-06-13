import { type ReactNode } from 'react'
import PillNavbar from './PillNavbar'

interface AppShellProps {
  children: ReactNode
  noPadding?: boolean
}

export default function AppShell({ children, noPadding = false }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0c10]">
      {/* Premium flat header bar — h-16 */}
      <PillNavbar isLanding={false} />

      {/* Main content area — pushed below h-16 navbar */}
      <main className={`flex-1 pt-16 flex flex-col ${noPadding ? '' : 'px-6 md:px-8 py-8 w-full max-w-7xl mx-auto'}`}>
        {children}
      </main>
    </div>
  )
}
