import React from 'react'
import { useBlogPrefsStore } from '@/store/blogPrefsStore'
import type { PostIndexEntry } from '@/lib/content/contentIndex'

const INITIAL_VISIBLE = 6

interface UseBlogPostsReturn {
  /** Fully sorted copy of the input posts */
  sortedPosts: PostIndexEntry[]
  /** Sliced subset for the current page */
  visiblePosts: PostIndexEntry[]
  /** How many posts are currently visible */
  visibleCount: number
  /** Increment the visible count (load more) */
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>
  /** Current sort type label */
  sortMode: 'recent' | 'datePosted'
  /** Current sort direction */
  sortOrder: 'desc' | 'asc'
  /** Current view mode */
  viewMode: 'card' | 'list'
  /** Change sort type */
  setSortMode: (mode: 'recent' | 'datePosted') => void
  /** Change sort direction */
  setSortOrder: (order: 'desc' | 'asc') => void
  /** Change view mode */
  setViewMode: (mode: 'card' | 'list') => void
  /** Reset all preferences + pagination to defaults */
  handleReset: () => void
}

/**
 * Shared hook for sort/view/pagination state used across blog index,
 * category, and tag pages. Uses the persisted `blogPrefsStore` for
 * sort/view preferences and keeps `visibleCount` as local state so
 * that pagination resets on page reload.
 *
 * @param posts - The (already filtered) posts to sort and paginate.
 */
export function useBlogPosts(posts: PostIndexEntry[]): UseBlogPostsReturn {
  // ── Persisted preferences ──────────────────────────────────────
  const sortMode = useBlogPrefsStore((s) => s.sortMode)
  const sortOrder = useBlogPrefsStore((s) => s.sortOrder)
  const viewMode = useBlogPrefsStore((s) => s.viewMode)
  const setSortMode = useBlogPrefsStore((s) => s.setSortMode)
  const setSortOrder = useBlogPrefsStore((s) => s.setSortOrder)
  const setViewMode = useBlogPrefsStore((s) => s.setViewMode)
  const resetPrefs = useBlogPrefsStore((s) => s.reset)

  // ── Local pagination state ─────────────────────────────────────
  const [visibleCount, setVisibleCount] = React.useState(INITIAL_VISIBLE)

  // ── Derived data ───────────────────────────────────────────────
  const sortedPosts = React.useMemo(() => {
    const sorted = [...posts]
    if (sortOrder === 'desc') {
      sorted.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )
    } else {
      sorted.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      )
    }
    return sorted
  }, [posts, sortOrder])

  const visiblePosts = React.useMemo(
    () => sortedPosts.slice(0, visibleCount),
    [sortedPosts, visibleCount],
  )

  const handleReset = React.useCallback(() => {
    resetPrefs()
    setVisibleCount(INITIAL_VISIBLE)
  }, [resetPrefs])

  return {
    sortedPosts,
    visiblePosts,
    visibleCount,
    setVisibleCount,
    sortMode,
    sortOrder,
    viewMode,
    setSortMode,
    setSortOrder,
    setViewMode,
    handleReset,
  }
}
