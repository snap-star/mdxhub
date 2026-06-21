import { create } from 'zustand'
import type { Breadcrumb } from '@/lib/content/types'

interface NavigationStore {
  breadcrumbs: Breadcrumb[]
  activeSidebarSlug: string
  isMobileSidebarOpen: boolean
  setBreadcrumbs: (crumbs: Breadcrumb[]) => void
  setActiveSidebarSlug: (slug: string) => void
  toggleMobileSidebar: () => void
  closeMobileSidebar: () => void
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  breadcrumbs: [],
  activeSidebarSlug: '',
  isMobileSidebarOpen: false,

  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
  setActiveSidebarSlug: (slug) => set({ activeSidebarSlug: slug }),
  toggleMobileSidebar: () =>
    set((s) => ({ isMobileSidebarOpen: !s.isMobileSidebarOpen })),
  closeMobileSidebar: () => set({ isMobileSidebarOpen: false }),
}))
