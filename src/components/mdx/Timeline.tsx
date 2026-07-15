import React from 'react'
import { ICON_MAP } from '@/lib/icon-map'

// ─── Timeline Item (data container) ─────────────────────────────────────

interface TimelineItemProps {
  /** Title displayed as the event heading */
  title: string
  /** Optional date/time label shown beside the icon */
  time?: string
  /** Optional icon name (see Badge component for full list) */
  icon?: string
  /** Optional color variant for the dot */
  color?: 'brand' | 'success' | 'warning' | 'danger' | 'info' | (string & {})
  children?: React.ReactNode
}

export function TimelineItem({ children }: TimelineItemProps) {
  // TimelineItem is just a data container — rendering is handled by Timeline
  return <>{children}</>
}

// ─── Timeline Container ─────────────────────────────────────────────────

interface TimelineProps {
  children: React.ReactNode
}

const DOT_COLORS: Record<string, string> = {
  brand:   'bg-brand-500  border-brand-300  shadow-brand-500/20 dark:border-brand-600',
  success: 'bg-success    border-green-400   shadow-green-500/20',
  warning: 'bg-warning    border-amber-400   shadow-amber-500/20',
  danger:  'bg-danger     border-red-400     shadow-red-500/20',
  info:    'bg-info       border-sky-400     shadow-sky-500/20',
}

export function Timeline({ children }: TimelineProps) {
  const items = React.useMemo(() => {
    const list: {
      title: string
      time?: string
      icon?: string
      color: string
      content: React.ReactNode
    }[] = []

    React.Children.forEach(children, (child) => {
      if (React.isValidElement<TimelineItemProps>(child) && child.type === TimelineItem) {
        list.push({
          title: child.props.title,
          time: child.props.time,
          icon: child.props.icon,
          color: child.props.color ?? 'brand',
          content: child.props.children,
        })
      }
    })
    return list
  }, [children])

  if (items.length === 0) {
    const elementChildren = React.Children.toArray(children).filter(React.isValidElement)
    if (elementChildren.length === 0) return <div className="my-8" />
    return <div className="my-8">{elementChildren}</div>
  }

  return (
    <div className="my-10">
      {items.map((item, i) => {
        const IconComponent = item.icon ? ICON_MAP[item.icon] : null
        const isLast = i === items.length - 1
        const dotColor = DOT_COLORS[item.color] ?? DOT_COLORS.brand

        return (
          <div
            key={i}
            className="relative flex gap-4 pb-8 last:pb-0 group"
          >
            {/* ── Left column: dot/icon + connector ── */}
            <div className="relative flex flex-col items-center flex-shrink-0">
              {/* Icon or colored dot */}
              <div
                className={`
                  relative z-10 flex items-center justify-center
                  w-10 h-10 sm:w-11 sm:h-11
                  rounded-full border-2 shadow-sm
                  transition-all duration-300
                  group-hover:scale-110 group-hover:shadow-md
                  ${dotColor}
                `}
              >
                {IconComponent ? (
                  <IconComponent size={18} className="text-white sm:w-5 sm:h-5 drop-shadow-sm" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-white/80" />
                )}
              </div>

              {/* Connecting line */}
              {!isLast && (
                <div
                  className="absolute top-11 bottom-0 w-0.5 bg-gradient-to-b from-border via-border to-transparent"
                  aria-hidden="true"
                />
              )}
            </div>

            {/* ── Right column: time + title + content ── */}
            <div className="flex-1 min-w-0 pt-1">
              {/* Time badge */}
              {item.time && (
                <span className="inline-block text-[0.7rem] font-mono font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full mb-2 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                  {item.time}
                </span>
              )}

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-bold text-foreground mt-0 mb-3 leading-snug tracking-tight">
                {item.title}
              </h3>

              {/* Content */}
              <div className="text-foreground/80 leading-relaxed space-y-4 [&>:first-child]:mt-0 [&>p]:mb-3 [&>p:last-child]:mb-0 [&_pre]:my-3 [&_code]:text-sm">
                {item.content}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
