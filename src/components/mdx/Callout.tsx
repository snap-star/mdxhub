import React from 'react'
import { Link } from 'react-router'
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

interface CalloutProps {
  type?: 'note' | 'tip' | 'warning' | 'danger'
  title?: string
  children: React.ReactNode
}

const config = {
  note: { icon: Info, title: 'Note' },
  tip: { icon: CheckCircle, title: 'Tip' },
  warning: { icon: AlertTriangle, title: 'Warning' },
  danger: { icon: XCircle, title: 'Danger' },
}

export function Callout({ type = 'note', title, children }: CalloutProps) {
  const { icon: Icon, title: defaultTitle } = config[type]

  return (
    <div className={`callout callout-${type}`}>
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
