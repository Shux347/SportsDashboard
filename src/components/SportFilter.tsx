import { Trophy, CircleDot, Zap } from 'lucide-react'
import type { Sport } from '../types/fixture'

interface SportFilterProps {
  active: Sport
  onChange: (sport: Sport) => void
  counts: Record<string, number>
}

interface SportOption {
  value: Sport
  label: string
  icon: React.ReactNode
  activeClasses: string
}

const sportOptions: SportOption[] = [
  {
    value: 'all',
    label: 'All',
    icon: <Trophy className="h-4 w-4" />,
    activeClasses: 'bg-slate-600 text-white border-slate-500',
  },
  {
    value: 'football',
    label: 'Football',
    icon: <CircleDot className="h-4 w-4" />,
    activeClasses: 'bg-green-600 text-white border-green-500',
  },
  {
    value: 'f1',
    label: 'F1',
    icon: <Zap className="h-4 w-4" />,
    activeClasses: 'bg-red-600 text-white border-red-500',
  },
  {
    value: 'cricket',
    label: 'Cricket',
    icon: <Trophy className="h-4 w-4" />,
    activeClasses: 'bg-blue-600 text-white border-blue-500',
  },
]

const SportFilter = ({ active, onChange, counts }: SportFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {sportOptions.map((option) => {
        const isActive = active === option.value
        const count = counts[option.value] ?? 0

        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? option.activeClasses
                : 'border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
            }`}
          >
            {option.icon}
            <span>{option.label}</span>
            <span
              className={`inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-xs font-bold ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-300'
              }`}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default SportFilter
