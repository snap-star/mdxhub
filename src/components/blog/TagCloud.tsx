import React from 'react'
import { Link } from 'react-router'
import { Tag as TagIcon, Search } from 'lucide-react'
import { SidebarWidget } from './SidebarWidget'

interface TagCloudProps {
  tags: string[]
  tagCounts?: Record<string, number>
  activeTag?: string
}

// Generate a consistent hue based on tag string
const getTagHue = (tag: string) => {
  let hash = 0
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % 360
}

export function TagCloud({ tags, tagCounts = {}, activeTag }: TagCloudProps) {
  const [filter, setFilter] = React.useState('')
  const [isExpanded, setIsExpanded] = React.useState(false)

  const maxCount = Math.max(1, ...Object.values(tagCounts))
  
  // Sort tags: active first, then by count, then alphabetically
  const sortedTags = React.useMemo(() => {
    return [...tags].sort((a, b) => {
      if (a === activeTag) return -1
      if (b === activeTag) return 1
      const countDiff = (tagCounts[b] || 0) - (tagCounts[a] || 0)
      if (countDiff !== 0) return countDiff
      return a.localeCompare(b)
    })
  }, [tags, tagCounts, activeTag])

  const filteredTags = sortedTags.filter(t => t.toLowerCase().includes(filter.toLowerCase()))
  
  const displayLimit = 12
  const showToggle = filteredTags.length > displayLimit
  const visibleTags = isExpanded ? filteredTags : filteredTags.slice(0, displayLimit)

  return (
    <SidebarWidget title="Tags" icon={<TagIcon size={16} />}>
      {tags.length > 8 && (
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-muted-foreground">
            <Search size={14} />
          </div>
          <input
            type="text"
            placeholder="Filter tags..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-lg py-1.5 pl-8 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/70"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {visibleTags.map((tag) => {
          const count = tagCounts[tag] ?? 1
          const weight = count / maxCount
          // Dynamic sizing between 0.75rem and 0.95rem based on frequency
          const fontSize = 0.75 + weight * 0.2
          const isActive = tag === activeTag
          const hue = getTagHue(tag)

          return (
            <Link
              key={tag}
              to={`/blog/tag/${tag}`}
              className={`group relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all duration-300 border ${
                isActive
                  ? 'bg-primary text-primary-foreground border-primary font-bold shadow-md scale-105 z-10'
                  : 'bg-muted/40 text-foreground/80 hover:text-foreground border-border/60 hover:border-border hover:bg-muted hover:shadow-sm'
              }`}
              style={{
                fontSize: `${fontSize}rem`,
                '--hover-bg': isActive ? undefined : `oklch(95% 0.05 ${hue})`,
                '--hover-border': isActive ? undefined : `oklch(80% 0.1 ${hue})`,
              } as React.CSSProperties}
            >
              <span className="opacity-70 group-hover:opacity-100 transition-opacity">#</span>
              <span>{tag}</span>
              {tagCounts[tag] && (
                <span className={`text-[0.75em] px-1.5 py-0.5 rounded-sm font-semibold ml-0.5 ${
                  isActive ? 'bg-black/20 text-white' : 'bg-background/80 text-muted-foreground'
                }`}>
                  {tagCounts[tag]}
                </span>
              )}
            </Link>
          )
        })}
      </div>

      {showToggle && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 w-full py-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1 bg-muted/30 rounded-md hover:bg-muted/60"
        >
          {isExpanded ? 'Show less' : `Show ${filteredTags.length - displayLimit} more tags`}
        </button>
      )}
      
      {filteredTags.length === 0 && filter && (
        <div className="text-center py-4 text-sm text-muted-foreground">
          No tags matching "{filter}"
        </div>
      )}
    </SidebarWidget>
  )
}
