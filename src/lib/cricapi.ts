import type { Fixture } from '../types/fixture'

interface CricApiMatch {
  id: string
  name: string
  matchType?: string
  status: string
  dateTimeGMT?: string
  date?: string
  teams?: string[]
  matchStarted?: boolean
  matchEnded?: boolean
}

interface CricApiResponse {
  status: string
  data?: CricApiMatch[]
}

function mapStatus(m: CricApiMatch): Fixture['status'] {
  if (m.matchEnded) return 'completed'
  if (m.matchStarted) return 'live'
  return 'upcoming'
}

function matchTypeLabel(type: string | undefined): string {
  if (!type) return 'Cricket'
  const map: Record<string, string> = {
    test: 'Test', odi: 'ODI', t20: 'T20', t20i: 'T20I', ipl: 'IPL',
  }
  return map[type.toLowerCase()] ?? type.toUpperCase()
}

export async function fetchCricketFixtures(apiKey: string): Promise<Fixture[]> {
  const res = await fetch(`https://api.cricapi.com/v1/matches?apikey=${apiKey}&offset=0`)
  if (!res.ok) throw new Error(`CricAPI responded with ${res.status}`)

  const data: CricApiResponse = await res.json()
  if (data.status !== 'success' || !data.data) {
    throw new Error(data.status === 'failure' ? 'Invalid CricAPI key' : 'CricAPI error')
  }

  return data.data
    .filter(m => (m.teams ?? []).length >= 2)
    .map((m): Fixture => {
      const [home, away] = m.teams!
      return {
        id: `cricapi-${m.id}`,
        sport: 'cricket',
        leagueName: matchTypeLabel(m.matchType),
        eventName: m.name,
        utcDate: m.dateTimeGMT ?? m.date ?? new Date().toISOString(),
        status: mapStatus(m),
        homeTeam: home ? { name: home, logoUrl: '' } : undefined,
        awayTeam: away ? { name: away, logoUrl: '' } : undefined,
      }
    })
}
