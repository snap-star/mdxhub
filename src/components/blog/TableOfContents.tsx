import React from 'react'
import type { TocItem } from '@/lib/content/types'

interface TableOfContentsProps {
  items: TocItem[]
  activeId?: string
}

export function TableOfContents({ items, activeId }: TableOfContentsProps) {
  if (items.length === 0) return null

  return (
    <nav aria-label="Table of contents">
      <p className="toc-title">On this page</p>
      <ol className="list-none p-0 m-0 flex flex-col gap-0.5">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`toc-link ${item.level === 3 ? 'toc-link-h3' : ''} ${activeId === item.id ? 'active' : ''}`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Hook for tracking active heading on scroll
export function useActiveHeading(ids: string[]): string {
  const [activeId, setActiveId] = React.useState('')

  React.useEffect(() => {
    if (ids.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0% -70% 0%' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [ids])

  return activeId
}
