import React from 'react'
import { Link } from 'react-router'
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

interface CalloutProps {
  type?: 'note' | 'tip' | 'info' | 'warning' | 'danger' | (string & {})
  title?: string
  children: React.ReactNode
}

const config: Record<string, { icon: React.ElementType, title: string }> = {
  note: { icon: Info, title: 'Note' },
  tip: { icon: CheckCircle, title: 'Tip' },
  info: { icon: Info, title: 'Info' },
  warning: { icon: AlertTriangle, title: 'Warning' },
  danger: { icon: XCircle, title: 'Danger' },
}

export function Callout({ type = 'note', title, children }: CalloutProps) {
  const safeType = config[type] ? type : 'note'
  const { icon: Icon, title: defaultTitle } = config[safeType]

  return (
    <div className={`callout callout-${safeType}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', fontWeight: 600 }}>
        <Icon size={16} />
        <span>{title ?? defaultTitle}</span>
      </div>
      <div style={{ fontSize: '0.9em', lineHeight: 1.5 }}>
        {children}
      </div>
    </div>
  )
}
