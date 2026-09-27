import { useState } from 'react'

interface CricketSetupProps {
  onSave: (key: string) => void
  error?: string | null
}

export default function CricketSetup({ onSave, error }: CricketSetupProps) {
  const [key, setKey] = useState('')

  return (
    <div className="max-w-md mx-auto mt-6 bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="text-center mb-5">
        <div className="text-4xl mb-2">🏏</div>
        <h2 className="text-white font-semibold text-lg">Set up Cricket</h2>
        <p className="text-slate-400 text-sm mt-1">
          Cricket data uses{' '}
          <a
            href="https://cricapi.com"
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 hover:underline"
          >
            CricAPI
          </a>{' '}
          — free tier, 100 requests/day.
        </p>
      </div>

      <ol className="text-slate-400 text-sm space-y-1.5 mb-5">
        <li>1. Register at <a href="https://cricapi.com" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">cricapi.com</a> (free)</li>
        <li>2. Copy your API key from the dashboard</li>
        <li>3. Paste it below and click Save</li>
      </ol>

      {error && (
        <div className="mb-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          ⚠️ {error} — check your key and try again.
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={key}
          onChange={e => setKey(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && key.trim() && onSave(key.trim())}
          placeholder="Paste CricAPI key…"
          className="flex-1 bg-slate-700 text-slate-200 rounded-lg px-3 py-2 text-sm border border-slate-600 focus:outline-none focus:border-blue-500 placeholder-slate-500"
        />
        <button
          onClick={() => key.trim() && onSave(key.trim())}
          disabled={!key.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  )
}
