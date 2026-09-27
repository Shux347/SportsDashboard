import { useState, useEffect } from 'react'
import { X, Check, Search, Loader2 } from 'lucide-react'
import type { Fixture } from '../types/fixture'
import type { FollowedTeamMeta } from '../hooks/useFollowedTeams'

interface SportsDbTeam {
  idTeam: string
  strTeam: string
  strSport: string
  strLeague?: string
  strTeamBadge?: string
}

const RELEVANT_SPORTS = new Set(['Soccer', 'Cricket'])

const SPORT_META: Record<string, { label: string; emoji: string }> = {
  football: { label: 'Football', emoji: '⚽' },
  f1: { label: 'Formula 1', emoji: '🏎️' },
  cricket: { label: 'Cricket', emoji: '🏏' },
}

function useDebounce(value: string, delay: number): string {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

function extractFixtureTeams(
  fixtures: Fixture[],
): Map<string, { name: string; logoUrl: string }[]> {
  const sportMap = new Map<string, Map<string, string>>()
  fixtures.forEach(f => {
    if (!sportMap.has(f.sport)) sportMap.set(f.sport, new Map())
    const teams = sportMap.get(f.sport)!
    if (f.homeTeam && !teams.has(f.homeTeam.name)) teams.set(f.homeTeam.name, f.homeTeam.logoUrl)
    if (f.awayTeam && !teams.has(f.awayTeam.name)) teams.set(f.awayTeam.name, f.awayTeam.logoUrl)
  })
  const result = new Map<string, { name: string; logoUrl: string }[]>()
  for (const [sport, teams] of sportMap.entries()) {
    result.set(
      sport,
      [...teams.entries()]
        .map(([name, logoUrl]) => ({ name, logoUrl }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    )
  }
  return result
}

interface TeamSelectorPanelProps {
  fixtures: Fixture[]
  isFollowing: (name: string) => boolean
  toggleTeam: (name: string, meta?: FollowedTeamMeta) => void
  followedTeams: Map<string, FollowedTeamMeta>
  onClearAll: () => void
  onClose: () => void
}

export default function TeamSelectorPanel({
  fixtures,
  isFollowing,
  toggleTeam,
  followedTeams,
  onClearAll,
  onClose,
}: TeamSelectorPanelProps) {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SportsDbTeam[]>([])
  const [searching, setSearching] = useState(false)
  const debouncedQuery = useDebounce(query, 350)
  const fixtureTeams = extractFixtureTeams(fixtures)
  const followedCount = followedTeams.size

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults([])
      return
    }
    setSearching(true)
    const controller = new AbortController()
    fetch(
      `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(debouncedQuery)}`,
      { signal: controller.signal },
    )
      .then(r => r.json())
      .then((data: { teams?: SportsDbTeam[] }) => {
        setSearchResults(
          (data.teams ?? []).filter(t => RELEVANT_SPORTS.has(t.strSport)).slice(0, 12),
        )
      })
      .catch(() => {})
      .finally(() => setSearching(false))
    return () => controller.abort()
  }, [debouncedQuery])

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-20" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-80 bg-slate-800 border-l border-slate-700 z-30 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700 shrink-0">
          <div>
            <h2 className="text-white font-semibold">Follow Teams</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {followedCount > 0
                ? `${followedCount} team${followedCount !== 1 ? 's' : ''} followed`
                : 'Search any team worldwide'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-3 py-3 border-b border-slate-700 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            {searching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 animate-spin" />
            )}
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search any team…"
              className="w-full bg-slate-700 text-slate-200 rounded-lg pl-9 pr-9 py-2 text-sm border border-slate-600 focus:outline-none focus:border-blue-500 placeholder-slate-500"
            />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {/* Search results */}
          {query && (
            <div>
              <SectionHeader label="Search Results" />
              {!searching && debouncedQuery === query && searchResults.length === 0 && (
                <p className="px-4 py-4 text-slate-500 text-sm">No teams found for "{query}"</p>
              )}
              {searchResults.map(team => {
                const following = isFollowing(team.strTeam)
                return (
                  <TeamRow
                    key={team.idTeam}
                    name={team.strTeam}
                    logoUrl={team.strTeamBadge}
                    subtitle={[team.strSport, team.strLeague].filter(Boolean).join(' · ')}
                    following={following}
                    onClick={() =>
                      toggleTeam(team.strTeam, {
                        logoUrl: team.strTeamBadge ?? '',
                        sport: team.strSport,
                        league: team.strLeague,
                      })
                    }
                  />
                )
              })}
            </div>
          )}

          {/* Followed teams list */}
          {!query && followedCount > 0 && (
            <div>
              <SectionHeader label={`Following (${followedCount})`} />
              {[...followedTeams.entries()].map(([name, meta]) => (
                <TeamRow
                  key={name}
                  name={name}
                  logoUrl={meta.logoUrl}
                  subtitle={meta.league ?? meta.sport ?? ''}
                  following
                  onClick={() => toggleTeam(name, meta)}
                />
              ))}
            </div>
          )}

          {/* From current fixtures */}
          {!query &&
            [...fixtureTeams.entries()].map(([sport, teams]) => {
              const meta = SPORT_META[sport] ?? { label: sport, emoji: '🏆' }
              const unfollowed = teams.filter(t => !isFollowing(t.name))
              if (unfollowed.length === 0) return null
              return (
                <div key={sport}>
                  <SectionHeader label={`${meta.emoji} ${meta.label} — from fixtures`} />
                  {unfollowed.map(team => (
                    <TeamRow
                      key={team.name}
                      name={team.name}
                      logoUrl={team.logoUrl}
                      following={false}
                      onClick={() => toggleTeam(team.name, { logoUrl: team.logoUrl, sport })}
                    />
                  ))}
                </div>
              )
            })}

          {!query && followedCount === 0 && fixtures.length === 0 && (
            <p className="text-slate-500 text-sm text-center py-16 px-4">
              Search for a team above to get started.
            </p>
          )}
        </div>

        {followedCount > 0 && (
          <div className="px-4 py-3 border-t border-slate-700 shrink-0">
            <button
              onClick={onClearAll}
              className="text-xs text-slate-500 hover:text-red-400 transition-colors"
            >
              Clear all followed teams
            </button>
          </div>
        )}
      </div>
    </>
  )
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="px-4 py-2 bg-slate-900/60 border-b border-t border-slate-700/50 sticky top-0 z-10">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span>
    </div>
  )
}

function TeamRow({
  name,
  logoUrl,
  subtitle,
  following,
  onClick,
}: {
  name: string
  logoUrl?: string
  subtitle?: string
  following: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-700/50 ${following ? 'bg-slate-700/20' : ''}`}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={name}
          className="w-6 h-6 object-contain shrink-0"
          onError={e => {
            ;(e.target as HTMLImageElement).style.display = 'none'
          }}
        />
      ) : (
        <div className="w-6 h-6 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className={`text-sm truncate ${following ? 'text-white font-medium' : 'text-slate-300'}`}>
          {name}
        </div>
        {subtitle && <div className="text-xs text-slate-500 truncate">{subtitle}</div>}
      </div>
      {following && <Check className="w-4 h-4 text-green-400 shrink-0" />}
    </button>
  )
}
