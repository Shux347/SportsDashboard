export interface Fixture {
  id: string
  sport: 'football' | 'f1' | 'cricket'
  leagueName: string
  eventName: string
  utcDate: string
  utcEndDate?: string
  sessionDetails?: string
  status: 'upcoming' | 'live' | 'completed'
  homeTeam?: { name: string; logoUrl: string; score?: string }
  awayTeam?: { name: string; logoUrl: string; score?: string }
}

export type Sport = Fixture['sport'] | 'all'
