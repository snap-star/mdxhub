import React from 'react'

// ─── Lightbox state (simple module-level store, no Zustand needed) ─────

interface LightboxState {
  open: boolean
  src: string
  alt: string
}

let currentState: LightboxState = { open: false, src: '', alt: '' }
const listeners = new Set<React.DispatchWithoutAction>()

function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

function getSnapshot(): LightboxState {
  return currentState
}

function emitChange() {
  listeners.forEach((fn) => fn())
}

/** Call this from any component to open the lightbox */
export function openLightbox(src: string, alt: string = '') {
  currentState = { open: true, src, alt }
  emitChange()
}

export function closeLightbox() {
  currentState = { ...currentState, open: false }
  emitChange()
}

export function useLightboxStore(): LightboxState {
  return React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
