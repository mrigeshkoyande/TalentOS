import { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, type User } from 'firebase/auth'
import { auth } from '../lib/firebase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if we have a simulated user in localStorage
    const savedUser = localStorage.getItem('talentos_simulated_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
        setLoading(false)
        return
      } catch (e) {
        localStorage.removeItem('talentos_simulated_user')
      }
    }

    const unsub = onAuthStateChanged(auth, u => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      setUser(result.user)
    } catch (err: any) {
      console.warn("Firebase popup failed, falling back to simulated login", err)
      const mockUser = {
        uid: 'demo-user',
        displayName: 'Demo Recruiter',
        email: 'recruiter@talentos.ai',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      } as unknown as User
      localStorage.setItem('talentos_simulated_user', JSON.stringify(mockUser))
      setUser(mockUser)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (err) {
      console.warn("Firebase logout failed", err)
    }
    localStorage.removeItem('talentos_simulated_user')
    setUser(null)
  }

  return { user, loading, loginWithGoogle, logout }
}
