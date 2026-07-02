import React from 'react'
import { ArrowRight, ExternalLink } from 'lucide-react'
import {
  Check, Copy, Info, AlertTriangle, XCircle,
  Star, Heart, Zap, Shield, Clock, Calendar,
  BookOpen, FileText, Tag, Hash, Mail, Link2,
  Sun, Moon, Cloud, Download, Upload, RefreshCw,
  Plus, Minus, Search, Settings, User,
  Home, Globe,
  Lightbulb, Rocket, Sparkles, Target, Flag, Terminal,
  type LucideIcon,
} from 'lucide-react'

// ─── Icon name → component map (same as Tabs/Steps for MDX consistency) ──

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

// ─── Card Item (data container) ──────────────────────────────────────────

interface CardProps {
  /** Card title */
  title: string
  /** Short description shown below the title */
  description: string
  /** Optional icon name (see Badge component for full list) */
  icon?: string
  /** Optional URL the card links to */
  href?: string
  /** Text for the call-to-action link. Defaults to "Learn more" when href is set */
  linkText?: string
  children?: React.ReactNode
}

export function Card({ children }: CardProps) {
  // Card is just a data container — rendering is handled by CardGrid
  return <>{children}</>
}

// ─── CardGrid Container ─────────────────────────────────────────────────

interface CardGridProps {
  /** Number of columns. Defaults to 3 */
  columns?: 1 | 2 | 3 | 4
  children: React.ReactNode
}

const COLUMN_CLASSES: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

export function CardGrid({ columns = 3, children }: CardGridProps) {
  // Extract card props from children
  const cards = React.useMemo(() => {
    const items: {
      title: string
      description: string
      icon?: string
      href?: string
      linkText?: string
      content: React.ReactNode
    }[] = []

    React.Children.forEach(children, (child) => {
      if (React.isValidElement<CardProps>(child) && child.type === Card) {
        items.push({
          title: child.props.title,
          description: child.props.description,
          icon: child.props.icon,
          href: child.props.href,
          linkText: child.props.linkText,
          content: child.props.children,
        })
      }
    })
    return items
  }, [children])

  if (cards.length === 0) return null

  const safeColumns = Math.min(columns, 4)
  const gridClass = COLUMN_CLASSES[safeColumns] ?? COLUMN_CLASSES[3]

  return (
    <div className={`my-8 grid ${gridClass} gap-4 sm:gap-5`}>
      {cards.map((card, index) => {
        const IconComponent = card.icon ? ICON_MAP[card.icon] : null
        const isLink = !!card.href
        const Wrapper = isLink ? 'a' : 'div'
        const wrapperProps = isLink
          ? {
              href: card.href,
              target: (card.href?.startsWith('http') ? '_blank' : undefined) as React.HTMLAttributeAnchorTarget | undefined,
              rel: card.href?.startsWith('http') ? 'noopener noreferrer' : undefined,
            }
          : {}

        return (
          <Wrapper
            key={index}
            {...wrapperProps}
            className={`
              group relative flex flex-col rounded-xl border border-border bg-card p-5 sm:p-6
              transition-all duration-200
              ${isLink
                ? 'cursor-pointer hover:border-brand-400/50 hover:shadow-md hover:shadow-brand-500/5 hover:-translate-y-0.5'
                : ''
              }
            `}
          >
            {/* Icon */}
            {IconComponent && (
              <div className="mb-3.5 flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary shrink-0 transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                <IconComponent size={20} />
              </div>
            )}

            {/* Title */}
            <h3 className="text-base sm:text-lg font-bold text-foreground m-0 mb-1.5 leading-snug">
              {card.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed m-0 flex-1">
              {card.description}
            </p>

            {/* Optional children (additional content) */}
            {card.content && (
              <div className="mt-3 text-sm text-foreground/70 leading-relaxed [&>:first-child]:mt-0 [&>p]:mb-2 [&>p:last-child]:mb-0">
                {card.content}
              </div>
            )}

            {/* Link indicator */}
            {isLink && (
              <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary transition-all duration-200 group-hover:gap-2.5">
                <span>{card.linkText || 'Learn more'}</span>
                {card.href?.startsWith('http') ? (
                  <ExternalLink size={14} className="shrink-0" />
                ) : (
                  <ArrowRight size={14} className="shrink-0" />
                )}
              </div>
            )}
          </Wrapper>
        )
      })}
    </div>
  )
}
