import React from 'react'
import type { TocItem } from '@/lib/content/types'

interface TableOfContentsProps {
  items: TocItem[]
  activeId?: string
}

export function TableOfContents({ items, activeId }: TableOfContentsProps) {
  if (items.length === 0) return null

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      window.history.pushState(null, '', `#${id}`)
    }
  }

  return (
    <nav aria-label="Table of contents" className="toc-nav">
      <div className="toc-header">
        <p className="toc-title">On this page</p>
        <span className="toc-badge">{items.length}</span>
      </div>
      <ol className="toc-list">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? 'toc-li-h3' : 'toc-li-h2'}>
            <a
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className={`toc-link${item.level === 3 ? ' toc-link-h3' : ''}${activeId === item.id ? ' active' : ''}`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
