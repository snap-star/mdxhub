import React from 'react'

// ─── Icon name → component map (subset of lucide-react, no import needed in MDX) ─

import {
  Check, Copy, Info, AlertTriangle, XCircle,
  Star, Heart, Zap, Shield, Clock, Calendar,
  BookOpen, FileText, Tag, Hash, Mail, Link2,
  Sun, Moon, Cloud, Download, Upload, RefreshCw,
  Plus, Minus, Search, Settings, User,
  Home, ArrowRight, ExternalLink, Globe,
  Lightbulb, Rocket, Sparkles, Target, Flag, Terminal,
  type LucideIcon,
} from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  check: Check, copy: Copy, info: Info,
  warning: AlertTriangle, danger: XCircle,
  star: Star, heart: Heart, zap: Zap,
  shield: Shield, clock: Clock, calendar: Calendar,
  book: BookOpen, file: FileText, tag: Tag,
  hash: Hash, mail: Mail, link: Link2,
  sun: Sun, moon: Moon, cloud: Cloud,
  download: Download, upload: Upload, refresh: RefreshCw,
  plus: Plus, minus: Minus,
  search: Search, settings: Settings, user: User,
  home: Home, arrow: ArrowRight, external: ExternalLink,
  globe: Globe, bulb: Lightbulb, rocket: Rocket,
  sparkles: Sparkles, target: Target, flag: Flag,
  terminal: Terminal,
}

// ─── Tab Item ──────────────────────────────────────────────────────────────

interface TabProps {
  /** Label shown in the tab header */
  label: string
  /** Optional icon name (see Badge component for full icon list) */
  icon?: string
  children: React.ReactNode
}

export function Tab({ children }: TabProps) {
  // Tab is just a data container — rendering is handled by Tabs
  return <>{children}</>
}

// ─── Tabs Container ────────────────────────────────────────────────────────

interface TabsProps {
  /** Default tab index (0-based). Defaults to 0 */
  defaultIndex?: number
  /** Visual style variant */
  variant?: 'underline' | 'pills'
  children: React.ReactNode
}

export function Tabs({ defaultIndex = 0, variant = 'underline', children }: TabsProps) {
  const [activeIndex, setActiveIndex] = React.useState(defaultIndex)
  const tablistRef = React.useRef<HTMLDivElement>(null)

  // Extract tab props from children
  const tabs = React.useMemo(() => {
    const items: { label: string; icon?: string; content: React.ReactNode }[] = []
    React.Children.forEach(children, (child) => {
      if (React.isValidElement<TabProps>(child) && child.type === Tab) {
        items.push({
          label: child.props.label,
          icon: child.props.icon,
          content: child.props.children,
        })
      }
    })
    return items
  }, [children])

  // ── Keyboard navigation ─────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : tabs.length - 1))
      // Focus the newly selected tab button
      setTimeout(() => {
        const buttons = tablistRef.current?.querySelectorAll('[role="tab"]')
        if (buttons) {
          const newIdx = activeIndex > 0 ? activeIndex - 1 : tabs.length - 1
          ;(buttons[newIdx] as HTMLButtonElement)?.focus()
        }
      }, 0)
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      setActiveIndex((prev) => (prev < tabs.length - 1 ? prev + 1 : 0))
      setTimeout(() => {
        const buttons = tablistRef.current?.querySelectorAll('[role="tab"]')
        if (buttons) {
          const newIdx = activeIndex < tabs.length - 1 ? activeIndex + 1 : 0
          ;(buttons[newIdx] as HTMLButtonElement)?.focus()
        }
      }, 0)
    }
  }

  if (tabs.length === 0) return null
  const safeIndex = Math.min(activeIndex, tabs.length - 1)
  const activeTab = tabs[safeIndex] ?? tabs[0]

  return (
    <div className="my-8 rounded-xl border border-border overflow-hidden bg-card shadow-sm">
      {/* Tab header bar */}
      <div
        ref={tablistRef}
        className="flex border-b border-border bg-muted/30 overflow-x-auto"
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
      >
        {tabs.map((tab, i) => {
          const isActive = i === safeIndex
          const IconComponent = tab.icon ? ICON_MAP[tab.icon] : null
          const tabBaseClass = 'relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-150 cursor-pointer border-0'
          let tabVariantClass: string
          if (isActive) {
            tabVariantClass = variant === 'underline'
              ? 'text-foreground font-semibold'
              : 'bg-primary text-primary-foreground shadow-sm rounded-md'
          } else {
            tabVariantClass = variant === 'pills'
              ? 'text-foreground/70 hover:text-foreground hover:bg-muted/60 dark:hover:bg-muted/40 rounded-md'
              : 'text-foreground/60 hover:text-foreground rounded-md'
          }
          return (
            <button
              key={tab.label}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${i}`}
              id={`tab-${i}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveIndex(i)}
              className={tabBaseClass + ' ' + tabVariantClass}
            >
              {IconComponent != null && <IconComponent size={14} className="shrink-0" />}
              {tab.label}
              {variant === 'underline' && isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* Tab panel */}
      <div
        key={safeIndex}
        role="tabpanel"
        id={`tabpanel-${safeIndex}`}
        aria-labelledby={`tab-${safeIndex}`}
        className="p-5 sm:p-6"
      >
        {activeTab.content}
      </div>
    </div>
  )
}
