import React from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import type { BlogPost } from '@/lib/content/types'
import { formatDateShort } from '@/lib/utils'
import { Clock, Calendar, ChevronRight } from 'lucide-react'

interface PostCardProps {
  post: BlogPost
  index?: number
}

export function PostCard({ post, index = 0 }: PostCardProps) {
  const { frontmatter, author, readingTime, slug } = post

  return (
    <motion.article
      className="post-card group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-md hover:border-primary/50"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Cover image — real thumbnail if available, else decorative gradient */}
      <Link to={`/blog/${slug}`} className="block w-full no-underline shrink-0">
        <div
          className="h-[200px] flex items-center justify-center relative overflow-hidden"
          style={!frontmatter.coverImage ? {
            background: `linear-gradient(135deg, 
              oklch(${57 - index * 4}% 0.155 ${240 + index * 12}) 0%, 
              oklch(${47 - index * 4}% 0.148 ${255 + index * 8}) 100%)`,
          } : undefined}
        >
          {frontmatter.coverImage ? (
            <img
              src={frontmatter.coverImage}
              alt={frontmatter.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 opacity-15">
              <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[140%] rounded-full bg-white" />
            </div>
          )}
          {/* Overlay gradient for readability on images */}
          {frontmatter.coverImage && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          )}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <span className="category-badge bg-white/25 text-white border-white/30 backdrop-blur-sm shadow-sm">
              {frontmatter.category}
            </span>
          </div>
          {frontmatter.featured && (
            <div className="absolute top-4 right-4 z-10">
              <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-[0.7rem] px-2.5 py-1 rounded-full shadow-lg border border-white/20 backdrop-blur-md">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="drop-shadow-sm">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                Featured
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5 pb-6 flex flex-col flex-1">
        <div className="flex gap-1.5 flex-wrap mb-3">
          {frontmatter.tags.slice(0, 3).map((tag) => (
            <Link key={tag} to={`/blog/tag/${tag}`} className="tag-pill bg-muted hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground border-border">
              #{tag}
            </Link>
          ))}
        </div>

        <Link to={`/blog/${slug}`} className="no-underline">
          <h2 className="font-serif text-[1.2rem] font-bold leading-tight tracking-tight mb-2.5 text-card-foreground group-hover:text-primary transition-colors">
            {frontmatter.title}
          </h2>
        </Link>

        {frontmatter.description && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {frontmatter.description.length > 120
              ? frontmatter.description.slice(0, 120) + '…'
              : frontmatter.description}
          </p>
        )}

        <div className="flex items-center justify-between flex-wrap gap-2 mt-auto pt-3.5 border-t border-border">
          <div className="flex items-center gap-2">
            {author ? (
              <>
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-7 h-7 rounded-full object-cover shrink-0 author-avatar"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
                <span className="text-[0.8rem] font-medium text-muted-foreground">
                  {author.name}
                </span>
              </>
            ) : (
              <span className="text-[0.8rem] text-muted-foreground">
                {frontmatter.author}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="reading-time flex items-center gap-1 text-[0.75rem] text-muted-foreground">
              <Calendar size={12} />
              {formatDateShort(frontmatter.date)}
            </span>
            <span className="reading-time flex items-center gap-1 text-[0.75rem] text-muted-foreground">
              <Clock size={12} />
              {readingTime} min
            </span>
          </div>
        </div>

        <Link
          to={`/blog/${slug}`}
          className="inline-flex items-center gap-1 mt-4 text-[0.82rem] font-semibold text-primary no-underline transition-all hover:gap-2"
        >
          Read more <ChevronRight size={14} />
        </Link>
      </div>
    </motion.article>
  )
}
