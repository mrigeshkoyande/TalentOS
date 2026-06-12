import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import JDAnalyzerPage from './pages/JDAnalyzerPage'
import RankingLedgerPage from './pages/RankingLedgerPage'
import HiddenGemsPage from './pages/HiddenGemsPage'
import ShortlistsPage from './pages/ShortlistsPage'

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} {...pageTransition} style={{ minHeight: '100vh' }}>
        <Routes location={location}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/job-analyzer" element={<JDAnalyzerPage />} />
          <Route path="/ranking" element={<RankingLedgerPage />} />
          <Route path="/hidden-gems" element={<HiddenGemsPage />} />
          <Route path="/shortlists" element={<ShortlistsPage />} />
          {/* fallback */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}
