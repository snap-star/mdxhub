import React from 'react'
import { Clock } from 'lucide-react'

interface ReadingTimeProps {
  minutes: number
}

export function ReadingTime({ minutes }: ReadingTimeProps) {
  // Format to 1 decimal place if it has a half minute, otherwise whole number
  const displayTime = minutes % 1 !== 0 ? minutes.toFixed(1) : minutes

  return (
    <span className="reading-time flex items-center gap-1.5" title="Estimated Reading Time">
      <Clock size={14} className="opacity-70" />
      <span className="font-medium">{displayTime} min read</span>
    </span>
  )
}
