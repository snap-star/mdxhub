import { createStore } from './createStore'
import type { TocItem } from '@/lib/content/types'

interface TocStoreState {
  items: TocItem[]
  activeId: string
}

const { setState, useStore } = createStore<TocStoreState>({
  items: [],
  activeId: '',
})

/** Call this from blog/doc pages when headings change */
export function setTocData(items: TocItem[], activeId: string) {
  setState({ items, activeId })
}

export function useTocStore(): TocStoreState {
  return useStore()
}
