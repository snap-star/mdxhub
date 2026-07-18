import React from 'react'

/**
 * A tiny module-level store factory using `useSyncExternalStore`.
 *
 * Both `lightboxStore` and `tocStore` had 90% identical boilerplate
 * (state + listeners + subscribe + getSnapshot + emitChange).
 * This replaces all of it.
 *
 * ```ts
 * const { setState, useStore, getSnapshot } = createStore({ count: 0 })
 * // In a component:
 * const { count } = useStore()
 * // Outside React:
 * setState({ count: getSnapshot().count + 1 })
 * ```
 */
export function createStore<T>(initial: T) {
  let state = initial
  const listeners = new Set<React.DispatchWithoutAction>()

  const subscribe = (fn: () => void) => {
    listeners.add(fn)
    return () => listeners.delete(fn)
  }

  const getSnapshot = () => state

  const setState = (next: Partial<T>) => {
    state = { ...state, ...next }
    listeners.forEach((fn) => fn())
  }

  function useStore(): T {
    return React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  }

  return { setState, useStore, getSnapshot }
}
