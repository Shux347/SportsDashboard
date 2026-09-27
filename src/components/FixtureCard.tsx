import { format } from 'date-fns'
import { Star, Calendar, Clock } from 'lucide-react'
import type { Fixture } from '../types/fixture'
import LiveBadge from './LiveBadge'

interface FixtureCardProps {
  fixture: Fixture
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  onExport: (fixture: Fixture) => void
}

const sportConfig: Record<
  Fixture['sport'],
  { emoji: string; badgeClasses: string; borderClass: string }
> = {
  football: {
    emoji: '⚽',
    badgeClasses: 'bg-green-500/10 text-green-400',
    borderClass: 'border-green-500/20',
  },
  f1: {
    emoji: '🏎️',
    badgeClasses: 'bg-red-500/10 text-red-400',
    borderClass: 'border-red-500/20',
  },
  cricket: {
    emoji: '🏏',
    badgeClasses: 'bg-blue-500/10 text-blue-400',
    borderClass: 'border-blue-500/20',
  },
}

const TeamRow = ({
  name,
  logoUrl,
  score,
}: {
  name: string
  logoUrl: string
  score?: string
}) => {
  return (
    <div className="flex items-center gap-3">
      <img
        src={logoUrl}
        alt={name}
        className="h-8 w-8 rounded-full object-contain bg-slate-700 p-0.5 flex-shrink-0"
        onError={(e) => {
          const target = e.currentTarget
          target.style.display = 'none'
          const fallback = document.createElement('div')
          fallback.className =
            'h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-400 flex-shrink-0'
          fallback.textContent = name.slice(0, 2).toUpperCase()
          target.parentNode?.insertBefore(fallback, target)
        }}
      />
      <span className="flex-1 truncate text-sm font-medium text-slate-200">
        {name}
      </span>
      {score !== undefined && (
        <span className="text-sm font-bold text-white tabular-nums">{score}</span>
      )}
    </div>
  )
}

const FixtureCard = ({
  fixture,
  isFavorite,
  onToggleFavorite,
  onExport,
}: FixtureCardProps) => {
  const config = sportConfig[fixture.sport]
  const localDate = new Date(fixture.utcDate)

  return (
    <div
      className={`bg-slate-800 rounded-xl p-4 border border-slate-700 transition-all ${
        isFavorite ? 'ring-1 ring-yellow-400/60' : ''
      }`}
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium truncate max-w-[10rem] ${config.badgeClasses} ${config.borderClass}`}
        >
          <span>{config.emoji}</span>
          <span className="truncate">{fixture.leagueName}</span>
        </span>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {fixture.status === 'live' && <LiveBadge />}
          {fixture.status === 'completed' && (
            <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs font-semibold text-slate-300">
              FT
            </span>
          )}

          <button
            onClick={() => onExport(fixture)}
            title="Export fixture"
            className="rounded-md p-1 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-colors"
          >
            <Calendar className="h-4 w-4" />
          </button>

          <button
            onClick={() => onToggleFavorite(fixture.id)}
            title={isFavorite ? 'Remove from favourites' : 'Add to favourites'}
            className="rounded-md p-1 transition-colors hover:bg-slate-700"
          >
            <Star
              className={`h-4 w-4 ${
                isFavorite
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-slate-400 hover:text-yellow-400'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-2 my-3">
        {fixture.homeTeam && fixture.awayTeam ? (
          <>
            <TeamRow
              name={fixture.homeTeam.name}
              logoUrl={fixture.homeTeam.logoUrl}
              score={fixture.homeTeam.score}
            />
            <TeamRow
              name={fixture.awayTeam.name}
              logoUrl={fixture.awayTeam.logoUrl}
              score={fixture.awayTeam.score}
            />
          </>
        ) : (
          <p className="text-sm font-medium text-slate-200 leading-snug">
            {fixture.eventName}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3 pt-3 border-t border-slate-700/60">
        <Clock className="h-3.5 w-3.5 flex-shrink-0" />
        <span>
          {fixture.utcEndDate
            ? `${format(localDate, 'EEE dd MMM')} — ${format(new Date(fixture.utcEndDate), 'EEE dd MMM')}`
            : format(localDate, 'EEE, dd MMM · HH:mm')}
          {fixture.sessionDetails && (
            <span className="ml-1 text-slate-600">· {fixture.sessionDetails}</span>
          )}
        </span>
      </div>
    </div>
  )
}

export default FixtureCard
