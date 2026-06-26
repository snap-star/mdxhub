import React from 'react'
import { Tooltip as BaseTooltip } from '@base-ui/react'

interface TooltipProps {
  /** The text shown inside the tooltip popup */
  content: string
  /** Preferred placement relative to the trigger */
  side?: 'top' | 'bottom' | 'left' | 'right'
  /** The hover/focus target element */
  children: React.ReactNode
}

/**
 * Inline tooltip for MDX content.
 *
 * Usage in MDX (no import needed):
 *   <Tooltip content="React Server Components">RSC</Tooltip>
 *
 * Styled with the project's dark-friendly design tokens.
 */
export function Tooltip({ content, side = 'top', children }: TooltipProps) {
  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger className="underline decoration-dotted underline-offset-2 decoration-brand-400/60 hover:decoration-brand-400 cursor-help transition-colors">
        {children}
      </BaseTooltip.Trigger>
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner side={side} sideOffset={6}>
          <BaseTooltip.Popup className="z-50 rounded-lg px-3 py-1.5 text-xs font-medium leading-relaxed shadow-lg
            bg-slate-800 text-slate-100
            dark:bg-slate-100 dark:text-slate-800
            motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95
            origin-[var(--transform-origin)]
            [--transform-origin:var(--tooltip-transform-origin)]
          ">
            {content}
            <BaseTooltip.Arrow className="fill-slate-800 dark:fill-slate-100" />
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  )
}
