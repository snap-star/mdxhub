import React from 'react'
import { Clock } from 'lucide-react'

interface ReadingTimeProps {
  minutes: number
}

export function ReadingTime({ minutes }: ReadingTimeProps) {
  return (
    <span className="reading-time">
      <Clock size={13} />
      {minutes} min read
    </span>
  )
}
