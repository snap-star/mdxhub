import React from 'react'
import type { TocItem } from '@/lib/content/types'

// ─── Module-level store (same pattern as ImageLightbox) ────────────────
// This lets components share heading data without prop drilling or Zustand.

interface TocStoreState {
  items: TocItem[]
  activeId: string
}

let storeState: TocStoreState = { items: [], activeId: '' }
const listeners = new Set<React.DispatchWithoutAction>()

function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

function getSnapshot(): TocStoreState {
  return storeState
}

function emitChange() {
  listeners.forEach((fn) => fn())
}

/** Call this from blog/doc pages when headings change */
export function setTocData(items: TocItem[], activeId: string) {
  storeState = { items, activeId }
  emitChange()
}

export function useTocStore(): TocStoreState {
  return React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
