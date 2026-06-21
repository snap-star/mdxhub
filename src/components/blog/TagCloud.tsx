import React from 'react'
import { Link } from 'react-router'

interface TagCloudProps {
  tags: string[]
  tagCounts?: Record<string, number>
  activeTag?: string
}

export function TagCloud({ tags, tagCounts = {}, activeTag }: TagCloudProps) {
  const maxCount = Math.max(1, ...Object.values(tagCounts))

  return (
    <div>
      <h3 className="text-[0.7rem] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-3.5">
        Tags
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => {
          const count = tagCounts[tag] ?? 1
          const weight = count / maxCount
          const fontSize = 0.75 + weight * 0.2
          const isActive = tag === activeTag

          return (
            <Link
              key={tag}
              to={`/blog/tag/${tag}`}
              className={`tag-pill ${
                isActive
                  ? 'bg-primary/10 text-primary border-primary/50 font-bold'
                  : 'bg-muted text-muted-foreground border-border font-normal'
              }`}
              style={{ fontSize: `${fontSize}rem` }}
            >
              #{tag}
              {tagCounts[tag] && (
                <span className="ml-1 opacity-60 text-[0.7em]">
                  {tagCounts[tag]}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
