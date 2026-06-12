import { useEffect, useState } from 'react'
import { subscribeCandidates } from '../lib/firestore'
import type { Candidate } from '../types'

export function useCandidates(jobId: string | null) {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!jobId) {
      setCandidates([])
      setLoading(false)
      return
    }
    setLoading(true)
    const unsub = subscribeCandidates(
      jobId,
      data => {
        setCandidates(data)
        setLoading(false)
      },
      _err => {
        setLoading(false)
      }
    )
    return unsub
  }, [jobId])

  return { candidates, loading }
}
