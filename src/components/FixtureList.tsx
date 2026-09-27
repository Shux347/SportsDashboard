import type { Fixture } from '../types/fixture'
import FixtureCard from './FixtureCard'
import LoadingState from './LoadingState'

interface FixtureListProps {
  fixtures: Fixture[]
  loading: boolean
  isFavorite: (id: string) => boolean
  onToggleFavorite: (id: string) => void
  onExport: (fixture: Fixture) => void
}

interface SectionProps {
  title: string
  fixtures: Fixture[]
  isFavorite: (id: string) => boolean
  onToggleFavorite: (id: string) => void
  onExport: (fixture: Fixture) => void
}

const FixtureSection = ({
  title,
  fixtures,
  isFavorite,
  onToggleFavorite,
  onExport,
}: SectionProps) => {
  if (fixtures.length === 0) return null

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
        {title}
        <span className="ml-2 rounded-full bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-300">
          {fixtures.length}
        </span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fixtures.map((fixture) => (
          <FixtureCard
            key={fixture.id}
            fixture={fixture}
            isFavorite={isFavorite(fixture.id)}
            onToggleFavorite={onToggleFavorite}
            onExport={onExport}
          />
        ))}
      </div>
    </section>
  )
}

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <span className="text-5xl mb-4">📭</span>
    <h3 className="text-lg font-semibold text-slate-300 mb-1">No fixtures found</h3>
    <p className="text-sm text-slate-500 max-w-xs">
      There are no fixtures matching your current filters. Try selecting a different sport or clearing your favourites filter.
    </p>
  </div>
)

const FixtureList = ({
  fixtures,
  loading,
  isFavorite,
  onToggleFavorite,
  onExport,
}: FixtureListProps) => {
  if (loading) return <LoadingState />

  if (fixtures.length === 0) return <EmptyState />

  const live = fixtures.filter((f) => f.status === 'live')
  const upcoming = fixtures.filter((f) => f.status === 'upcoming')
  const completed = fixtures.filter((f) => f.status === 'completed')

  return (
    <div className="space-y-8">
      <FixtureSection
        title="🔴 Live Now"
        fixtures={live}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        onExport={onExport}
      />
      <FixtureSection
        title="📅 Upcoming"
        fixtures={upcoming}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        onExport={onExport}
      />
      <FixtureSection
        title="✅ Recent Results"
        fixtures={completed}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        onExport={onExport}
      />
    </div>
  )
}

export default FixtureList
