import { format } from 'date-fns'
import { Star, RefreshCw, Users, Radio } from 'lucide-react'

interface HeaderProps {
  lastUpdated: Date | null
  onRefresh: () => void
  loading: boolean
  showFavoritesOnly: boolean
  onToggleFavorites: () => void
  favoritesCount: number
  teamCount: number
  showFollowingOnly: boolean
  onToggleFollowing: () => void
  onOpenTeams: () => void
}

const Header = ({
  lastUpdated,
  onRefresh,
  loading,
  showFavoritesOnly,
  onToggleFavorites,
  favoritesCount,
  teamCount,
  showFollowingOnly,
  onToggleFollowing,
  onOpenTeams,
}: HeaderProps) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="shrink-0">
          <h1 className="text-xl font-bold text-white tracking-tight">⚽ SportDash</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {lastUpdated ? `Updated ${format(lastUpdated, 'HH:mm:ss')}` : 'Not yet updated'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button
            onClick={onOpenTeams}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-700 hover:text-slate-200"
          >
            <Users className="h-4 w-4" />
            <span>Teams</span>
            {teamCount > 0 && (
              <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-slate-600 px-1 text-xs font-bold text-slate-200">
                {teamCount}
              </span>
            )}
          </button>

          {teamCount > 0 && (
            <button
              onClick={onToggleFollowing}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                showFollowingOnly
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              <Radio className={`h-4 w-4 ${showFollowingOnly ? 'fill-green-400/20' : ''}`} />
              <span>Following</span>
            </button>
          )}

          <button
            onClick={onToggleFavorites}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              showFavoritesOnly
                ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
            }`}
          >
            <Star className={`h-4 w-4 ${showFavoritesOnly ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            <span>Favourites</span>
            {favoritesCount > 0 && (
              <span
                className={`inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-xs font-bold ${
                  showFavoritesOnly ? 'bg-yellow-400 text-slate-900' : 'bg-slate-600 text-slate-200'
                }`}
              >
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-700 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
