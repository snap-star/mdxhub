import React from 'react'
import { Link } from 'react-router'

export function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 shrink-0 no-underline"
    >
      {/* Icon mark */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-brand"
        style={{ background: 'linear-gradient(135deg, var(--color-brand-500), var(--color-brand-700))' }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="3" width="5" height="12" rx="1.5" fill="white" opacity="0.9" />
          <rect x="9" y="3" width="7" height="5" rx="1.5" fill="white" opacity="0.7" />
          <rect x="9" y="10" width="7" height="5" rx="1.5" fill="white" opacity="0.5" />
        </svg>
      </div>

      {/* Wordmark */}
      <span className="text-[1.05rem] font-bold tracking-tight text-foreground font-sans">
        MDX
        <span className="text-primary">Hub</span>
      </span>
    </Link>
  )
}
