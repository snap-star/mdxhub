import React from 'react'
import { Languages } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'
import { useTranslationStore, LOCALES, type Locale } from '@/store/translationStore'

const LOCALE_LABELS: Record<Locale, string> = { en: 'EN', ja: '日本語', id: 'ID' }

export function LanguageSwitcher() {
  const { t } = useTranslation()
  const setLocale = useTranslationStore((s) => s.setLocale)
  const currentLocale = useTranslationStore((s) => s.locale)
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        title={t('language.switchTo')}
        aria-label={t('language.switchTo')}
        className="w-9 h-9 rounded-md border border-border bg-muted flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200 shrink-0 cursor-pointer"
      >
        <Languages size={16} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-1.5 min-w-[130px] rounded-lg border border-border bg-card shadow-lg overflow-hidden z-50"
          >
            {LOCALES.map((locale) => {
              const active = locale === currentLocale
              return (
                <button
                  key={locale}
                  onClick={() => { setLocale(locale); setOpen(false) }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-left transition-colors cursor-pointer ${
                    active
                      ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-medium'
                      : 'text-foreground hover:bg-accent'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-brand-500' : 'bg-transparent'}`} />
                  {LOCALE_LABELS[locale]}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
