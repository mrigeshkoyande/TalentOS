import { useEffect, useState } from 'react'
import { subscribeAllHiddenGems, subscribeHiddenGems } from '../lib/firestore'
import type { Candidate } from '../types'

export function useHiddenGems(jobId: string | null) {
  const [gems, setGems] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const unsub = jobId
      ? subscribeHiddenGems(
          jobId,
          data => { setGems(data); setLoading(false) },
          _err => setLoading(false)
        )
      : subscribeAllHiddenGems(
          data => { setGems(data); setLoading(false) },
          _err => setLoading(false)
        )
    return unsub
  }, [jobId])

  return { gems, loading }
}
