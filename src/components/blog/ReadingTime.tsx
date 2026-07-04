import React from 'react'
import { Clock } from 'lucide-react'

interface ReadingTimeProps {
  minutes: number
}

export function ReadingTime({ minutes }: ReadingTimeProps) {
  let display: string
  if (minutes < 1) {
    display = '< 1 min read'
  } else {
    display = `${minutes % 1 !== 0 ? minutes.toFixed(1) : Math.round(minutes)} min read`
  }

  return (
    <span className="reading-time flex items-center gap-1.5" title="Estimated Reading Time">
      <Clock size={14} className="opacity-70" />
      <span className="font-medium">{display}</span>
    </span>
  )
}
