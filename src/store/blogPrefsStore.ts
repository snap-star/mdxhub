import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type SortMode = 'recent' | 'datePosted'
export type SortOrder = 'desc' | 'asc'
export type BlogViewMode = 'card' | 'list'

interface BlogPrefsStore {
  sortMode: SortMode
  sortOrder: SortOrder
  viewMode: BlogViewMode
  setSortMode: (mode: SortMode) => void
  setSortOrder: (order: SortOrder) => void
  setViewMode: (mode: BlogViewMode) => void
  reset: () => void
}

const isSortMode = (v: unknown): v is SortMode =>
  v === 'recent' || v === 'datePosted'
const isSortOrder = (v: unknown): v is SortOrder =>
  v === 'desc' || v === 'asc'

const DEFAULT_SORT_MODE: SortMode = 'recent'
const DEFAULT_SORT_ORDER: SortOrder = 'desc'
const DEFAULT_VIEW_MODE: BlogViewMode = 'card'

export const useBlogPrefsStore = create<BlogPrefsStore>()(
  persist(
    (set) => ({
      sortMode: DEFAULT_SORT_MODE,
      sortOrder: DEFAULT_SORT_ORDER,
      viewMode: DEFAULT_VIEW_MODE,

      setSortMode: (sortMode) => set({ sortMode }),
      setSortOrder: (sortOrder) => set({ sortOrder }),
      setViewMode: (viewMode) => set({ viewMode }),
      reset: () =>
        set({
          sortMode: DEFAULT_SORT_MODE,
          sortOrder: DEFAULT_SORT_ORDER,
          viewMode: DEFAULT_VIEW_MODE,
        }),
    }),
    {
      name: 'mdx-blog-prefs',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sortMode: state.sortMode,
        sortOrder: state.sortOrder,
        viewMode: state.viewMode,
      }),
      migrate: (persistedState, version) => {
        const state = persistedState as Record<string, unknown>

        // v0 → v1: map old 'oldest' → 'datePosted' and add 'sortOrder'
        if (version < 1) {
          return {
            sortMode: isSortMode(state.sortMode)
              ? state.sortMode
              : state.sortMode === 'oldest'
                ? 'datePosted'
                : DEFAULT_SORT_MODE,
            sortOrder: isSortOrder(state.sortOrder)
              ? state.sortOrder
              : DEFAULT_SORT_ORDER,
            viewMode: state.viewMode === 'card' || state.viewMode === 'list'
              ? state.viewMode
              : DEFAULT_VIEW_MODE,
          }
        }

        return persistedState as BlogPrefsStore
      },
    },
  ),
)
