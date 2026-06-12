import { useEffect, useState } from 'react'
import { subscribeShortlists } from '../lib/firestore'
import type { Shortlist } from '../types'

export function useShortlists(userId: string | null) {
  const [shortlists, setShortlists] = useState<Shortlist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setShortlists([])
      setLoading(false)
      return
    }
    const unsub = subscribeShortlists(
      userId,
      data => {
        setShortlists(data)
        setLoading(false)
      },
      _err => {
        setLoading(false)
      }
    )
    return unsub
  }, [userId])

  return { shortlists, loading }
}
