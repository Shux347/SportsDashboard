import { useState, useEffect } from 'react'

const STORAGE_KEY = 'sport-dashboard-favorites'

function loadFromStorage(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return new Set<string>(parsed)
    return new Set()
  } catch {
    return new Set()
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => loadFromStorage())

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(favorites)))
    } catch {
      // storage unavailable; silently ignore
    }
  }, [favorites])

  const isFavorite = (id: string): boolean => favorites.has(id)

  const toggleFavorite = (id: string): void => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return { favorites, isFavorite, toggleFavorite }
}
