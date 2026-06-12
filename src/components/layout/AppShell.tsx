import { type ReactNode } from 'react'
import PillNavbar from './PillNavbar'

interface AppShellProps {
  children: ReactNode
  noPadding?: boolean
}

export default function AppShell({ children, noPadding = false }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#11131b]">
      {/* Console flat navbar — h-12 */}
      <PillNavbar isLanding={false} />

      {/* Main content area — pushed below h-12 navbar */}
      <main
        className={[
          'flex-1',
          noPadding
            ? 'pt-12'
            : 'pt-12',
        ].join(' ')}
      >
        {children}
      </main>
    </div>
  )
}
