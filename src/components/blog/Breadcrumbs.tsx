import React from 'react'
import { Link } from 'react-router'
import { ChevronRight, Home } from 'lucide-react'
import type { Breadcrumb } from '@/lib/content/types'

interface BreadcrumbsProps {
  items: Breadcrumb[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const all: Breadcrumb[] = [{ label: 'Home', href: '/' }, ...items]

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap gap-1 list-none p-0 m-0 text-[0.8rem] text-muted-foreground">
        {all.map((crumb, i) => {
          const isLast = i === all.length - 1
          return (
            <li key={i} className="flex items-center gap-1">
              {i === 0 && <Home size={12} className="shrink-0" />}
              {crumb.href && !isLast ? (
                <Link
                  to={crumb.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-150 no-underline"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className={isLast ? 'text-foreground font-medium' : 'text-muted-foreground'}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {crumb.label}
                </span>
              )}
              {!isLast && <ChevronRight size={12} className="shrink-0 opacity-50" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
