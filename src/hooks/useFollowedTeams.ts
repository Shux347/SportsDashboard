import { useState, useEffect } from 'react'

export interface FollowedTeamMeta {
  logoUrl: string
  sport?: string
  league?: string
}

const STORAGE_KEY = 'sport-dashboard-followed-teams'

export function useFollowedTeams() {
  const [followedTeams, setFollowedTeams] = useState<Map<string, FollowedTeamMeta>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return new Map()
      const arr: Array<{ name: string } & FollowedTeamMeta> = JSON.parse(stored)
      return new Map(arr.map(({ name, ...meta }) => [name, meta]))
    } catch {
      return new Map()
    }
  })

  useEffect(() => {
    const arr = [...followedTeams.entries()].map(([name, meta]) => ({ name, ...meta }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr))
  }, [followedTeams])

  const toggleTeam = (name: string, meta: FollowedTeamMeta = { logoUrl: '' }) => {
    setFollowedTeams(prev => {
      const next = new Map(prev)
      if (next.has(name)) next.delete(name)
      else next.set(name, meta)
      return next
    })
  }

  const isFollowing = (name: string) => followedTeams.has(name)

  const clearAll = () => setFollowedTeams(new Map())

  return { followedTeams, toggleTeam, isFollowing, clearAll }
}
