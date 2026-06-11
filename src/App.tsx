import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/layout/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import JDAnalyzerPage from './pages/JDAnalyzerPage'
import RankingLedgerPage from './pages/RankingLedgerPage'
import HiddenGemsPage from './pages/HiddenGemsPage'
import ShortlistsPage from './pages/ShortlistsPage'

const pageTransition = {
  initial: { opacity: 0, y: 10, filter: 'blur(3px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -10, filter: 'blur(3px)' },
  transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} {...pageTransition} style={{ minHeight: '100vh' }}>
        <Routes location={location}>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/job-analyzer" element={<ProtectedRoute><JDAnalyzerPage /></ProtectedRoute>} />
          <Route path="/ranking" element={<ProtectedRoute><RankingLedgerPage /></ProtectedRoute>} />
          <Route path="/hidden-gems" element={<ProtectedRoute><HiddenGemsPage /></ProtectedRoute>} />
          <Route path="/shortlists" element={<ProtectedRoute><ShortlistsPage /></ProtectedRoute>} />

          {/* fallback */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
