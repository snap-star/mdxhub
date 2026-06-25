import React from 'react'
import { BookOpen } from 'lucide-react'

interface SeriesBadgeProps {
  seriesName: string
  seriesOrder?: number
  totalParts?: number
}

export function SeriesBadge({ seriesName, seriesOrder, totalParts }: SeriesBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 text-[0.7rem] font-semibold transition-colors no-underline">
      <BookOpen size={12} className="shrink-0" />
      <span className="truncate max-w-[120px]">{seriesName}</span>
      {seriesOrder != null && totalParts && (
        <span className="opacity-70">
          · {seriesOrder}/{totalParts}
        </span>
      )}
    </span>
  )
}
