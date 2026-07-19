import { useSyncExternalStore } from 'react'
import { useTranslationStore as store, t as translate } from '@/store/translationStore'

function subscribe(cb: () => void) {
  return store.subscribe(cb)
}

function getSnapshot() {
  return store.getState().locale
}

export function useTranslation() {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  return {
    locale,
    t: (key: string, params?: Record<string, string | number>) => translate(key, params),
  }
}
