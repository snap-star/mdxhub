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
