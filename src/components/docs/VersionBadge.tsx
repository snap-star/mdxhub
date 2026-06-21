import React from 'react'
import { Tag } from 'lucide-react'

interface VersionBadgeProps {
  version: string
  label?: string
}

export function VersionBadge({ version, label }: VersionBadgeProps) {
  return (
    <span className="version-badge">
      <Tag size={10} />
      {label && <span style={{ opacity: 0.7 }}>{label}</span>}
      {version}
    </span>
  )
}
