import React from 'react'

interface TooltipProps {
  content: string
  side?: 'top' | 'bottom' | 'left' | 'right'
  children: React.ReactNode
}

export function Tooltip({ content, side = 'top', children }: TooltipProps) {
  const sideClasses: Record<string, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <span className="group relative inline-flex cursor-help">
      <span className="underline decoration-dotted underline-offset-2 decoration-brand-400/60 hover:decoration-brand-400 transition-colors">
        {children}
      </span>
      <span
        className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity
          bg-slate-800 text-slate-100
          dark:bg-slate-100 dark:text-slate-800
          ${sideClasses[side]}`}
      >
        {content}
      </span>
    </span>
  )
}
