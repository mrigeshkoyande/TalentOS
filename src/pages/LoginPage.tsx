import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import AppShell from '../components/layout/AppShell';

export default function LoginPage() {
  const { signInWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  if (currentUser) {
    return <Navigate to={from} replace />;
  }

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell noPadding>
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0b0c10]">
        
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#C7A36A]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#779165]/10 blur-[100px] rounded-full pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-md p-8 sm:p-10"
        >
          <div className="glass-card rounded-2xl p-8 border border-white/[0.08] shadow-2xl relative overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C7A36A] via-[#779165] to-[#a4cbeb] opacity-50" />
            
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] mb-6">
                <span className="material-symbols-outlined text-[#C7A36A] text-2xl">fingerprint</span>
              </div>
              <h1 className="font-geist text-2xl font-semibold text-[#F5F5F5] mb-2 tracking-tight">
                Authentication Required
              </h1>
              <p className="font-geist text-sm text-[#A1A1A1] leading-relaxed">
                Please verify your identity to access the TalentOS core engine and ranking systems.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                <p className="font-mono text-xs text-[#ffb4ab] uppercase tracking-wider">
                  {error}
                </p>
              </div>
            )}

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/20 transition-all group disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="font-geist text-sm font-medium text-[#F5F5F5] group-hover:text-white transition-colors">
                {loading ? 'Authenticating...' : 'Sign in with Google'}
              </span>
            </button>

            <div className="mt-8 pt-6 border-t border-white/[0.05] text-center">
              <p className="font-mono text-[10px] text-[#A1A1A1]/40 uppercase tracking-widest">
                TalentOS // Enterprise Identity Provider
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
