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

export const useBlogPrefsStore = create<BlogPrefsStore>()(
  persist(
    (set) => ({
      sortMode: 'recent',
      sortOrder: 'desc',
      viewMode: 'card',

      setSortMode: (sortMode) => set({ sortMode }),
      setSortOrder: (sortOrder) => set({ sortOrder }),
      setViewMode: (viewMode) => set({ viewMode }),
      reset: () =>
        set({
          sortMode: 'recent',
          sortOrder: 'desc',
          viewMode: 'card',
        }),
    }),
    {
      name: 'mdx-blog-prefs',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sortMode: state.sortMode,
        sortOrder: state.sortOrder,
        viewMode: state.viewMode,
      }),
    },
  ),
)
