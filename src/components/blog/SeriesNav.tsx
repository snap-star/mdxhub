import React from 'react'
import { Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, BookOpen, ChevronDown, ChevronUp, List } from 'lucide-react'
import type { BlogPost } from '@/lib/content/types'

interface SeriesNavProps {
  seriesName: string
  posts: BlogPost[]
  currentSlug: string
}

export function SeriesNav({ seriesName, posts, currentSlug }: SeriesNavProps) {
  const [isListExpanded, setIsListExpanded] = React.useState(false)

  const sortedPosts = React.useMemo(
    () => [...posts].sort((a, b) => (a.frontmatter.seriesOrder ?? 0) - (b.frontmatter.seriesOrder ?? 0)),
    [posts],
  )

  const currentIndex = sortedPosts.findIndex((p) => p.slug === currentSlug)
  const currentPost = sortedPosts[currentIndex]
  const totalParts = sortedPosts.length

  const prevPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null
  const nextPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null

  const progressPercent = totalParts > 1 ? ((currentIndex + 1) / totalParts) * 100 : 0

  if (!currentPost || totalParts === 0) return null

  return (
    <div className="mt-12 rounded-2xl border border-border bg-card overflow-hidden">
      {/* Series header */}
      <div className="p-5 sm:p-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-[oklch(22%_0.040_245)] text-primary shrink-0">
              <BookOpen size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-[0.7rem] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
                Part of a Series
              </p>
              <h3 className="text-base font-bold text-foreground truncate">
                {seriesName}
              </h3>
            </div>
          </div>

          {/* Progress badge */}
          <div className="shrink-0 text-right">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-[0.8rem] font-bold">
              <List size={14} />
              {currentIndex + 1}/{totalParts}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Part {currentIndex + 1} of {totalParts}
        </p>
      </div>

      {/* Navigation buttons */}
      <div className="grid grid-cols-2 gap-px bg-border">
        {prevPost ? (
          <Link
            to={`/blog/${prevPost.slug}`}
            className="flex items-center gap-2 p-4 bg-card hover:bg-muted/50 transition-colors group no-underline"
          >
            <ChevronLeft size={16} className="shrink-0 text-muted-foreground group-hover:-translate-x-1 transition-transform" />
            <div className="min-w-0">
              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground block">Previous</span>
              <span className="text-sm font-medium text-foreground truncate block leading-tight">
                {prevPost.frontmatter.title}
              </span>
            </div>
          </Link>
        ) : (
          <div className="p-4 bg-card/50" />
        )}

        {nextPost ? (
          <Link
            to={`/blog/${nextPost.slug}`}
            className="flex items-center gap-2 p-4 bg-card hover:bg-muted/50 transition-colors group no-underline text-right justify-end"
          >
            <div className="min-w-0">
              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground block">Next</span>
              <span className="text-sm font-medium text-foreground truncate block leading-tight">
                {nextPost.frontmatter.title}
              </span>
            </div>
            <ChevronRight size={16} className="shrink-0 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <div className="p-4 bg-card/50" />
        )}
      </div>

      {/* Series list toggle */}
      {totalParts > 1 && (
        <>
          <button
            onClick={() => setIsListExpanded((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors border-t border-border"
          >
            <span className="font-medium">All {totalParts} parts</span>
            {isListExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <AnimatePresence>
            {isListExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden border-t border-border/50"
              >
                <div className="divide-y divide-border/50">
                  {sortedPosts.map((post, idx) => {
                    const isCurrent = post.slug === currentSlug
                    return (
                      <Link
                        key={post.slug}
                        to={`/blog/${post.slug}`}
                        className={`flex items-center gap-3 px-5 py-2.5 transition-colors no-underline ${
                          isCurrent
                            ? 'bg-primary/5 text-primary font-semibold'
                            : 'hover:bg-muted/30 text-foreground/80 hover:text-foreground'
                        }`}
                      >
                        <span
                          className={`flex items-center justify-center w-6 h-6 rounded-full text-[0.7rem] font-bold shrink-0 ${
                            isCurrent
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span className="text-sm truncate">{post.frontmatter.title}</span>
                        {isCurrent && (
                          <span className="ml-auto text-[0.65rem] font-bold uppercase tracking-wider text-primary shrink-0">
                            Current
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}
