import React from 'react'
import { Link } from 'react-router'
import type { PostIndexEntry } from '@/lib/content/contentIndex'
import { useContentStore } from '@/store/contentStore'
import { formatDateShort } from '@/lib/utils'
import { Clock, Calendar, ChevronRight, MessageCircle } from 'lucide-react'
import { DisqusCommentCount } from '@/components/blog/DisqusCommentCount'
import { SeriesBadge } from '@/components/blog/SeriesBadge'
import { OptimizedImage } from '@/components/mdx/OptimizedImage'

interface PostCardProps {
  post: PostIndexEntry
  index?: number
}

export function PostCard({ post, index = 0 }: PostCardProps) {
  const { title, description, coverImage, date, category, tags, slug, featured, series, seriesOrder, readingTime, comments } = post

  // Compute total parts for series badge (how many posts share this series name)
  const allPosts = useContentStore((s) => s.posts)
  const totalPartsInSeries = React.useMemo(() =>
    series ? allPosts.filter((p) => p.series === series).length : 0,
    [series, allPosts],
  )

  return (
    <article
      className="post-card group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-md hover:border-primary/50"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      {/* Cover image — real thumbnail if available, else decorative gradient */}
      <Link to={`/blog/${slug}`} className="block w-full no-underline shrink-0">
        <div
          className="h-[200px] flex items-center justify-center relative overflow-hidden"
          style={!coverImage ? {
            background: `linear-gradient(135deg, 
              oklch(${57 - index * 4}% 0.155 ${240 + index * 12}) 0%, 
              oklch(${47 - index * 4}% 0.148 ${255 + index * 8}) 100%)`,
          } : undefined}
        >
          {coverImage ? (
            <OptimizedImage
              src={coverImage}
              alt={title}
              imgClassName="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              usePicture={false}
            />
          ) : (
            <div className="absolute inset-0 opacity-15">
              <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[140%] rounded-full bg-white" />
            </div>
          )}
          {/* Overlay gradient for readability on images */}
          {coverImage && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          )}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <span className="category-badge bg-white/25 text-white border-white/30 backdrop-blur-sm shadow-sm">
              {category}
            </span>
            {series && (
              <SeriesBadge
                seriesName={series}
                seriesOrder={seriesOrder}
                totalParts={totalPartsInSeries}
              />
            )}
          </div>
          {featured && (
            <div className="absolute top-3 right-3 z-10">
              <span className="relative inline-flex items-center gap-1.5 bg-gradient-to-br from-brand-400 via-brand-500 to-brand-600 text-white font-extrabold text-[0.6rem] uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-brand border border-brand-300/20 group-hover:shadow-xl group-hover:shadow-brand group-hover:scale-105 transition-all duration-300">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="shrink-0 drop-shadow-sm">
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
          {tags.slice(0, 3).map((tag) => (
            <Link key={tag} to={`/blog/tag/${tag}`} className="tag-pill bg-muted hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground border-border">
              #{tag}
            </Link>
          ))}
        </div>

        <Link to={`/blog/${slug}`} className="no-underline">
          <h2 className="font-serif text-[1.2rem] font-bold leading-tight tracking-tight mb-2.5 text-card-foreground group-hover:text-primary transition-colors">
            {title}
          </h2>
        </Link>

        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {description.length > 120
              ? description.slice(0, 120) + '…'
              : description}
          </p>
        )}

        <div className="flex items-center justify-between flex-wrap gap-2 mt-auto pt-3.5 border-t border-border">
          <div className="flex items-center gap-2">
            {post.authorAvatar ? (
              <img
                src={post.authorAvatar}
                alt={post.authorName}
                className="w-7 h-7 rounded-full object-cover shrink-0"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            ) : null}
            <span className="text-[0.8rem] font-medium text-muted-foreground">
              {post.authorName || post.author || 'Unknown'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="reading-time flex items-center gap-1 text-[0.75rem] text-muted-foreground">
              <Calendar size={12} />
              {formatDateShort(date)}
            </span>
            <span className="reading-time flex items-center gap-1 text-[0.75rem] text-muted-foreground">
              <Clock size={12} />
              {readingTime} min
            </span>
            {comments !== false && (
              <span className="reading-time flex items-center gap-1 text-[0.75rem] text-muted-foreground">
                <MessageCircle size={12} />
                <DisqusCommentCount
                  identifier={`blog:${slug}`}
                  href={`/blog/${slug}#disqus_thread`}
                  className="hover:text-primary transition-colors"
                />
              </span>
            )}
          </div>
        </div>

        <Link
          to={`/blog/${slug}`}
          className="inline-flex items-center gap-1 mt-4 text-[0.82rem] font-semibold text-primary no-underline transition-all hover:gap-2"
        >
          Read more <ChevronRight size={14} />
        </Link>
      </div>
    </article>
  )
}
