import { useState, useEffect, useCallback } from 'react'
import type { Fixture, Sport } from '../types/fixture'
import { fetchEspnFixtures } from '../lib/espn'
import { fetchF1Fixtures } from '../lib/openf1'
import { fetchCricketFixtures } from '../lib/cricapi'

export function useFixtures(cricketApiKey: string | null) {
  const [fixtures, setFixtures] = useState<Fixture[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [cricketError, setCricketError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const loadFixtures = useCallback(async () => {
    setLoading(true)
    setError(null)
    setCricketError(null)
    try {
      const baseFetches: Promise<Fixture[]>[] = [fetchEspnFixtures(), fetchF1Fixtures()]
      const cricketFetch = cricketApiKey ? fetchCricketFixtures(cricketApiKey) : null

      const [espnResult, f1Result] = await Promise.all(baseFetches)
      const combined = [...espnResult, ...f1Result]

      if (cricketFetch) {
        try {
          const cricketFixtures = await cricketFetch
          combined.push(...cricketFixtures)
        } catch (err) {
          setCricketError(err instanceof Error ? err.message : 'Cricket fetch failed')
        }
      }

      combined.sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())
      setFixtures(combined)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch fixtures')
    } finally {
      setLoading(false)
    }
  }, [cricketApiKey])

  useEffect(() => {
    loadFixtures()
  }, [loadFixtures])

  const filterBySport = (sport: Sport): Fixture[] =>
    sport === 'all' ? fixtures : fixtures.filter(f => f.sport === sport)

  return { fixtures, loading, error, cricketError, lastUpdated, refetch: loadFixtures, filterBySport }
}
