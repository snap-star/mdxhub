import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

// ─── Accordion Item (data container) ─────────────────────────────────────

interface AccordionItemProps {
  /** Title shown in the clickable header */
  title: string
  /** Whether this item starts open (overrides Accordion's defaultOpen) */
  defaultOpen?: boolean
  children: React.ReactNode
}

export function AccordionItem({ children }: AccordionItemProps) {
  // AccordionItem is just a data container — rendering is handled by Accordion
  return <>{children}</>
}

// ─── Accordion Container ─────────────────────────────────────────────────

interface AccordionProps {
  /** Array of indices to open by default (0-based). Defaults to [] */
  defaultOpen?: number[]
  /** Whether multiple items can be open at once. Defaults to false */
  allowMultiple?: boolean
  /** Visual style variant */
  variant?: 'bordered' | 'ghost'
  children: React.ReactNode
}

export function Accordion({
  defaultOpen = [],
  allowMultiple = false,
  variant = 'bordered',
  children,
}: AccordionProps) {
  // Extract items from children
  const items = React.useMemo(() => {
    const list: { title: string; defaultOpen?: boolean; content: React.ReactNode }[] = []
    React.Children.forEach(children, (child) => {
      if (React.isValidElement<AccordionItemProps>(child) && child.type === AccordionItem) {
        list.push({
          title: child.props.title,
          defaultOpen: child.props.defaultOpen,
          content: child.props.children,
        })
      }
    })
    return list
  }, [children])

  // Derive initial open state from defaultOpen prop + per-item overrides
  const instanceId = React.useId()
  const [openIndices, setOpenIndices] = React.useState<Set<number>>(() => {
    const initial = new Set<number>()
    // Apply Accordion-level defaultOpen
    for (const idx of defaultOpen) {
      if (idx >= 0 && idx < items.length) initial.add(idx)
    }
    // Apply per-item defaultOpen overrides
    items.forEach((item, idx) => {
      if (item.defaultOpen) initial.add(idx)
    })
    return initial
  })

  // ── Toggle handler ───────────────────────────────────────────────────
  const toggle = (index: number) => {
    setOpenIndices((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        if (!allowMultiple) {
          // Close all others when allowMultiple is false (accordion mode)
          next.clear()
        }
        next.add(index)
      }
      return next
    })
  }

  // ── Keyboard handler ─────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const getTriggerId = (i: number) => `${instanceId}-accordion-trigger-${i}`

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle(index)
    }
    if (e.key === 'ArrowDown' && index < items.length - 1) {
      e.preventDefault()
      document.getElementById(getTriggerId(index + 1))?.focus()
    }
    if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault()
      document.getElementById(getTriggerId(index - 1))?.focus()
    }
    // Home / End navigation
    if (e.key === 'Home') {
      e.preventDefault()
      document.getElementById(getTriggerId(0))?.focus()
    }
    if (e.key === 'End') {
      e.preventDefault()
      document.getElementById(getTriggerId(items.length - 1))?.focus()
    }
  }

  if (items.length === 0) return null

  const containerClass =
    variant === 'ghost'
      ? 'my-8 divide-y divide-border'
      : 'my-8 rounded-xl border border-border bg-card shadow-sm overflow-hidden divide-y divide-border'

  return (
    <div className={containerClass}>
      {items.map((item, index) => {
        const isOpen = openIndices.has(index)
        const triggerId = `${instanceId}-accordion-trigger-${index}`
        const panelId = `${instanceId}-accordion-panel-${index}`

        return (
          <div key={index} className="group">
            {/* ── Trigger (clickable header) ── */}
            <h3 className="m-0">
              <button
                id={triggerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`
                  w-full flex items-center justify-between gap-3 px-5 py-4 sm:px-6 sm:py-4
                  text-left text-sm sm:text-base font-medium text-foreground
                  bg-transparent border-0 cursor-pointer
                  transition-colors duration-150
                  hover:bg-muted/40 focus-visible:outline-2 focus-visible:outline-brand-400 focus-visible:outline-offset-[-2px] focus-visible:rounded-none
                  ${isOpen ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}
                `}
              >
                <span className="flex-1">{item.title}</span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-0 text-foreground' : '-rotate-90 text-muted-foreground'
                  }`}
                />
              </button>
            </h3>

            {/* ── Panel (content area with animation) ── */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  key={`panel-${index}`}
                  role="region"
                  aria-labelledby={triggerId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 text-sm sm:text-base text-foreground/80 leading-relaxed [&>:first-child]:mt-0 [&>p]:mb-3 [&>p:last-child]:mb-0 [&_pre]:my-3 [&_code]:text-sm">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
