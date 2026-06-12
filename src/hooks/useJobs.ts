import { useEffect, useState } from 'react'
import { subscribeJobs } from '../lib/firestore'
import type { Job } from '../types'

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const unsub = subscribeJobs(
      data => {
        setJobs(data)
        setLoading(false)
      },
      err => {
        setError(err)
        setLoading(false)
      }
    )
    return unsub
  }, [])

  return { jobs, loading, error }
}
