import React from 'react'
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

// ─── Step Item (data container) ────────────────────────────────────────────

interface StepProps {
  /** Title displayed as the step heading */
  title: string
  /** Optional icon name (see Badge component for full list) */
  icon?: string
  children?: React.ReactNode
}

// eslint-disable-next-line react-refresh/only-export-components
export function Step({ children }: StepProps) {
  // Step is just a data container — rendering is handled by Steps
  return <>{children}</>
}

// ─── Steps Container ───────────────────────────────────────────────────────

interface StepsProps {
  children: React.ReactNode
}

export function Steps({ children }: StepsProps) {
  const steps = React.useMemo(() => {
    const items: { title: string; icon?: string; content: React.ReactNode }[] = []
    React.Children.forEach(children, (child) => {
      if (React.isValidElement<StepProps>(child) && child.type === Step) {
        items.push({
          title: child.props.title,
          icon: child.props.icon,
          content: child.props.children,
        })
      }
    })
    return items
  }, [children])

  if (steps.length === 0) {
    const elementChildren = React.Children.toArray(children).filter(React.isValidElement)
    if (elementChildren.length === 0) return <div className="my-8" />
    return <div className="my-8">{elementChildren}</div>
  }

  return (
    <div className="my-10">
      {steps.map((step, i) => {
        const IconComponent = step.icon ? ICON_MAP[step.icon] : null
        const isLast = i === steps.length - 1

        return (
          <div
            key={i}
            className="relative flex gap-5 pb-10 last:pb-0 group"
          >
            {/* ── Left column: circle + connector ── */}
            <div className="relative flex flex-col items-center flex-shrink-0">
              {/* Numbered circle badge */}
              <div className="relative z-10 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary/15 to-primary/5 border-2 border-primary/30 text-sm sm:text-base font-bold text-primary shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:border-primary group-hover:from-primary group-hover:to-primary/90 group-hover:text-primary-foreground group-hover:shadow-md group-hover:shadow-primary/20">
                {IconComponent ? (
                  <IconComponent size={18} className="sm:w-5 sm:h-5" />
                ) : (
                  i + 1
                )}
              </div>

              {/* Connecting line */}
              {!isLast && (
                <div
                  className="absolute top-12 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-primary/20 to-transparent"
                  aria-hidden="true"
                />
              )}
            </div>

            {/* ── Right column: title + content ── */}
            <div className="flex-1 min-w-0 pt-1.5 sm:pt-2">
              <h3 className="text-lg sm:text-xl font-bold text-foreground mt-0 mb-3 leading-snug tracking-tight">
                {step.title}
              </h3>
              <div className="text-foreground/80 leading-relaxed space-y-4 [&>:first-child]:mt-0 [&>p]:mb-3 [&>p:last-child]:mb-0 [&_pre]:my-3 [&_code]:text-sm">
                {step.content}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
