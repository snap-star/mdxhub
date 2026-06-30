import React from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { List, X } from 'lucide-react'
import { useTocStore } from '@/lib/tocStore'

// ─── Backdrop animation ───────────────────────────────────────────────────

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

// ─── Sheet animation (slides up from bottom) ─────────────────────────────

const sheetVariants = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring' as const, damping: 30, stiffness: 300 },
  },
  exit: {
    y: '30%',
    opacity: 0,
    transition: { duration: 0.2 },
  },
}

// ─── Component ────────────────────────────────────────────────────────────

export function MobileTocSheet() {
  const { items, activeId } = useTocStore()
  const [open, setOpen] = React.useState(false)
  const listRef = React.useRef<HTMLDivElement>(null)
  const hasItems = items.length > 0

  // Scroll active item into view when sheet opens or activeId changes
  React.useEffect(() => {
    if (!open || !activeId || !listRef.current) return
    const activeEl = listRef.current.querySelector(`[data-toc-id="${activeId}"]`)
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [open, activeId])

  // Close on Escape
  React.useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  // Prevent body scroll when sheet is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleNav = (id: string) => {
    setOpen(false)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
    })
  }

  // Portal to document.body so position:fixed works regardless of framer-motion ancestor transforms
  return createPortal(
    <>
      {/* ── Floating action button — circular, icon-only, mid-right screen, fixed position ── */}
      <button
        className={`fixed top-1/2 -translate-y-1/2 right-3 z-[100] lg:hidden flex items-center justify-center
          w-[44px] h-[44px] rounded-full
          bg-brand-500 text-white
          shadow-lg shadow-brand-500/35
          ring-2 ring-white/20 dark:ring-white/10
          hover:bg-brand-600 hover:shadow-brand-500/45 hover:ring-white/30 hover:scale-105
          active:scale-95 active:shadow-brand-500/25
          transition-all duration-500 ease-spring
          ${hasItems
            ? 'visible opacity-100 pointer-events-auto'
            : 'invisible opacity-0 pointer-events-none'
          }`}
        onClick={() => setOpen(true)}
        aria-label="Table of contents"
        aria-expanded={open}
      >
        <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
          <List size={18} />
          {hasItems && (
            <span className="absolute -top-1.5 -right-1.5 w-[15px] h-[15px] rounded-full
              bg-amber-400 text-[9px] font-bold text-amber-900
              flex items-center justify-center shadow-sm ring-1 ring-white/30">
              {items.length > 9 ? '9+' : items.length}
            </span>
          )}
        </div>
      </button>

      {/* ── Slide-up sheet ── */}
      <AnimatePresence>
        {open && hasItems && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm lg:hidden"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-[120] flex flex-col lg:hidden
                rounded-t-2xl bg-background border-t border-border shadow-2xl"
              style={{ maxHeight: '65vh' }}
              variants={sheetVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* ── Header ── */}
              <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border shrink-0">
                <div className="flex items-center gap-2">
                  <List size={16} className="text-brand-500" />
                  <span className="text-sm font-semibold text-foreground">On this page</span>
                  <span className="text-[11px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                    {items.length}
                  </span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Close table of contents"
                >
                  <X size={16} />
                </button>
              </div>

              {/* ── Scrollable list ── */}
              <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
                {items.map((item) => (
                  <button
                    key={item.id}
                    data-toc-id={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                      ${item.level === 3 ? 'ml-4 text-[0.8rem]' : ''}
                      ${
                        activeId === item.id
                          ? 'bg-brand-50 text-brand-700 font-medium dark:bg-brand-900/30 dark:text-brand-300'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                  >
                    <span className="line-clamp-2">{item.text}</span>
                  </button>
                ))}
              </div>

              {/* ── Bottom safe-area spacer ── */}
              <div className="h-2 shrink-0" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>,
    document.body,
  )
}
