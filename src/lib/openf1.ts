import type { Fixture } from '../types/fixture'

interface OpenF1Session {
  session_key: number
  meeting_key: number
  session_name: string
  date_start: string
  date_end?: string
  country_name: string
  year: number
}

function deriveWeekendStatus(start: string, end: string): Fixture['status'] {
  const now = Date.now()
  const s = new Date(start).getTime()
  const e = new Date(end).getTime()
  if (now < s) return 'upcoming'
  if (now > e) return 'completed'
  return 'live'
}

export async function fetchF1Fixtures(): Promise<Fixture[]> {
  const year = new Date().getFullYear()
  const res = await fetch(`https://api.openf1.org/v1/sessions?year=${year}`)
  if (!res.ok) throw new Error(`OpenF1 fetch failed: ${res.status}`)

  const sessions: OpenF1Session[] = await res.json()

  // Group all sessions by race weekend (meeting_key)
  const meetings = new Map<number, OpenF1Session[]>()
  sessions.forEach(s => {
    if (!meetings.has(s.meeting_key)) meetings.set(s.meeting_key, [])
    meetings.get(s.meeting_key)!.push(s)
  })

  return [...meetings.entries()].map(([meetingKey, items]): Fixture => {
    const sorted = [...items].sort(
      (a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime(),
    )
    const first = sorted[0]
    const last = sorted[sorted.length - 1]
    const weekendEnd = last.date_end ?? last.date_start
    const sessionDetails = sorted.map(s => s.session_name).join(' · ')

    return {
      id: `f1-meeting-${meetingKey}`,
      sport: 'f1',
      leagueName: 'Formula 1',
      eventName: `${first.country_name} Grand Prix`,
      utcDate: first.date_start,
      utcEndDate: weekendEnd,
      sessionDetails,
      status: deriveWeekendStatus(first.date_start, weekendEnd),
    }
  })
}
