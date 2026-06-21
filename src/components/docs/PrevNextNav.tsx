import React from 'react'
import { Link } from 'react-router'
import type { DocPage } from '@/lib/content/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PrevNextNavProps {
  prev?: DocPage | null
  next?: DocPage | null
}

export function PrevNextNav({ prev, next }: PrevNextNavProps) {
  if (!prev && !next) return null

  return (
    <div className="prev-next-nav">
      {prev ? (
        <Link to={`/docs/${prev.slug}`} className="prev-next-btn" style={{ gridColumn: next ? 'auto' : '1 / -1' }}>
          <span className="text-[0.7rem] font-semibold tracking-[0.08em] uppercase text-muted-foreground flex items-center gap-1">
            <ChevronLeft size={12} /> Previous
          </span>
          <span className="text-[0.9rem] font-semibold text-foreground">
            {prev.frontmatter.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next && (
        <Link to={`/docs/${next.slug}`} className="prev-next-btn next">
          <span className="text-[0.7rem] font-semibold tracking-[0.08em] uppercase text-muted-foreground flex items-center justify-end gap-1">
            Next <ChevronRight size={12} />
          </span>
          <span className="text-[0.9rem] font-semibold text-foreground">
            {next.frontmatter.title}
          </span>
        </Link>
      )}
    </div>
  )
}
