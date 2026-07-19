import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import en from '@/translations/en.json'
import ja from '@/translations/ja.json'
import id from '@/translations/id.json'

export const LOCALES = ['en', 'ja', 'id'] as const
export type Locale = (typeof LOCALES)[number]

export type TranslationValue = string | Record<string, unknown>

const TRANSLATIONS: Record<Locale, Record<string, unknown>> = { en, ja, id } as Record<Locale, Record<string, unknown>>

type TranslationStore = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

function getKeys(obj: unknown, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'string') {
      result[fullKey] = value
    } else if (value && typeof value === 'object') {
      Object.assign(result, getKeys(value, fullKey))
    }
  }
  return result
}

const flatCache = new Map<Locale, Record<string, string>>()

function flat(locale: Locale): Record<string, string> {
  if (!flatCache.has(locale)) {
    flatCache.set(locale, getKeys(TRANSLATIONS[locale]))
  }
  return flatCache.get(locale)!
}

function getDefaultLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  const stored = localStorage.getItem('mdx-locale')
  if (stored && (LOCALES as readonly string[]).includes(stored)) return stored as Locale
  const navLang = navigator.language?.split('-')[0]
  if (navLang && (LOCALES as readonly string[]).includes(navLang)) return navLang as Locale
  return 'en'
}

export const useTranslationStore = create<TranslationStore>()(
  persist(
    () => ({
      locale: getDefaultLocale(),
      setLocale: (locale: Locale) => {
        const store = useTranslationStore.getState()
        if (store.locale !== locale) {
          useTranslationStore.setState({ locale })
          flatCache.delete(locale)
          flatCache.delete(store.locale)
        }
      },
    }),
    {
      name: 'mdx-locale',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ locale: state.locale }),
    },
  ),
)

export function t(key: string, params?: Record<string, string | number>): string {
  const { locale } = useTranslationStore.getState()
  const keys = flat(locale)
  let value = keys[key]
  if (!value) {
    const fallback = flat('en')[key]
    value = fallback ?? key
  }
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      value = value.replace(`{${k}}`, String(v))
    }
  }
  return value
}
