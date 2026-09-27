import { useState } from 'react'
import type { Sport, Fixture } from './types/fixture'
import type { FollowedTeamMeta } from './hooks/useFollowedTeams'
import { useFixtures } from './hooks/useFixtures'
import { useFavorites } from './hooks/useFavorites'
import { useCalendarExport } from './hooks/useCalendarExport'
import { useFollowedTeams } from './hooks/useFollowedTeams'
import Header from './components/Header'
import SportFilter from './components/SportFilter'
import FixtureList from './components/FixtureList'
import TeamSelectorPanel from './components/TeamSelectorPanel'
import CricketSetup from './components/CricketSetup'

const CRICKET_KEY_STORAGE = 'cricapi-key'

function isFixtureFollowed(fixture: Fixture, followedTeams: Map<string, FollowedTeamMeta>): boolean {
  if (followedTeams.size === 0) return false
  if (fixture.homeTeam && followedTeams.has(fixture.homeTeam.name)) return true
  if (fixture.awayTeam && followedTeams.has(fixture.awayTeam.name)) return true
  if (fixture.sport === 'f1') return followedTeams.has(fixture.eventName)
  return false
}

export default function App() {
  const [activeSport, setActiveSport] = useState<Sport>('all')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [showFollowingOnly, setShowFollowingOnly] = useState(false)
  const [showTeamPanel, setShowTeamPanel] = useState(false)
  const [cricketApiKey, setCricketApiKey] = useState<string | null>(
    () => localStorage.getItem(CRICKET_KEY_STORAGE),
  )

  const { fixtures, loading, error, cricketError, lastUpdated, refetch, filterBySport } =
    useFixtures(cricketApiKey)
  const { favorites, isFavorite, toggleFavorite } = useFavorites()
  const { exportFixture } = useCalendarExport()
  const { followedTeams, toggleTeam, isFollowing, clearAll } = useFollowedTeams()

  const saveCricketKey = (key: string) => {
    localStorage.setItem(CRICKET_KEY_STORAGE, key)
    setCricketApiKey(key)
  }

  const clearCricketKey = () => {
    localStorage.removeItem(CRICKET_KEY_STORAGE)
    setCricketApiKey(null)
  }

  const filtered = filterBySport(activeSport)
    .filter(f => !showFollowingOnly || isFixtureFollowed(f, followedTeams))
    .filter(f => !showFavoritesOnly || isFavorite(f.id))

  const counts: Record<string, number> = {
    all: fixtures.length,
    football: fixtures.filter(f => f.sport === 'football').length,
    f1: fixtures.filter(f => f.sport === 'f1').length,
    cricket: fixtures.filter(f => f.sport === 'cricket').length,
  }

  const showCricketSetup = activeSport === 'cricket' && !cricketApiKey && !loading

  return (
    <div className="min-h-screen bg-slate-900">
      <Header
        lastUpdated={lastUpdated}
        loading={loading}
        onRefresh={refetch}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={() => setShowFavoritesOnly(prev => !prev)}
        favoritesCount={favorites.size}
        teamCount={followedTeams.size}
        showFollowingOnly={showFollowingOnly}
        onToggleFollowing={() => setShowFollowingOnly(prev => !prev)}
        onOpenTeams={() => setShowTeamPanel(true)}
      />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}

        {!loading && fixtures.length === 0 && !error && !showCricketSetup && (
          <div className="bg-slate-700/30 border border-slate-700/50 rounded-xl p-4 text-slate-500 text-sm text-center">
            No fixtures found. Data is fetched live from ESPN and OpenF1 — try refreshing.
          </div>
        )}

        <SportFilter active={activeSport} onChange={setActiveSport} counts={counts} />

        {showCricketSetup ? (
          <CricketSetup onSave={saveCricketKey} />
        ) : (
          <>
            {activeSport === 'cricket' && cricketError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm flex items-center justify-between gap-4">
                <span className="text-red-400">⚠️ {cricketError}</span>
                <button
                  onClick={clearCricketKey}
                  className="text-xs text-slate-400 hover:text-white underline shrink-0"
                >
                  Reset key
                </button>
              </div>
            )}
            <FixtureList
              fixtures={filtered}
              loading={loading}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              onExport={exportFixture}
            />
          </>
        )}
      </main>

      <footer className="text-center text-slate-600 text-xs py-6">
        Data from ESPN &amp; OpenF1 APIs · All times in your local timezone
      </footer>

      {showTeamPanel && (
        <TeamSelectorPanel
          fixtures={fixtures}
          isFollowing={isFollowing}
          toggleTeam={toggleTeam}
          followedTeams={followedTeams}
          onClearAll={clearAll}
          onClose={() => setShowTeamPanel(false)}
        />
      )}
    </div>
  )
}
