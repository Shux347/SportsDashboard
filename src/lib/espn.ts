import type { Fixture } from '../types/fixture'

const ESPN_ENDPOINTS: { league: string; sport: Fixture['sport']; leagueName: string; url: string }[] = [
  {
    league: 'epl',
    sport: 'football',
    leagueName: 'English Premier League',
    url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard',
  },
  {
    league: 'ucl',
    sport: 'football',
    leagueName: 'UEFA Champions League',
    url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.champions/scoreboard',
  },
]

function mapState(state: string): Fixture['status'] {
  if (state === 'in') return 'live'
  if (state === 'post') return 'completed'
  return 'upcoming'
}

interface EspnCompetitor {
  homeAway: 'home' | 'away'
  score?: string
  team: {
    displayName: string
    logo?: string
  }
}

interface EspnEvent {
  id: string
  name: string
  date: string
  competitions: Array<{
    competitors: EspnCompetitor[]
  }>
  status: {
    type: {
      state: string
    }
  }
}

interface EspnResponse {
  events?: EspnEvent[]
}

async function fetchLeague(
  league: string,
  sport: Fixture['sport'],
  leagueName: string,
  url: string,
): Promise<Fixture[]> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`ESPN fetch failed for ${league}: ${res.status}`)
  const data: EspnResponse = await res.json()

  return (data.events ?? []).map((event): Fixture => {
    const competitors = event.competitions[0]?.competitors ?? []
    const home = competitors.find((c) => c.homeAway === 'home')
    const away = competitors.find((c) => c.homeAway === 'away')

    return {
      id: `espn-${league}-${event.id}`,
      sport,
      leagueName,
      eventName: event.name,
      utcDate: event.date,
      status: mapState(event.status.type.state),
      homeTeam: home
        ? {
            name: home.team.displayName,
            logoUrl: home.team.logo ?? '',
            score: home.score,
          }
        : undefined,
      awayTeam: away
        ? {
            name: away.team.displayName,
            logoUrl: away.team.logo ?? '',
            score: away.score,
          }
        : undefined,
    }
  })
}

export async function fetchEspnFixtures(): Promise<Fixture[]> {
  const results = await Promise.allSettled(
    ESPN_ENDPOINTS.map(({ league, sport, leagueName, url }) =>
      fetchLeague(league, sport, leagueName, url),
    ),
  )

  const fixtures: Fixture[] = []
  for (const result of results) {
    if (result.status === 'fulfilled') {
      fixtures.push(...result.value)
    }
  }
  return fixtures
}
