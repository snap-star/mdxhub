import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router'
import type { PostIndexEntry } from '@/lib/content/contentIndex'
import { useContentStore } from '@/store/contentStore'
import { formatDateShort } from '@/lib/utils'
import { Clock, Calendar, ChevronRight, MessageCircle, ArrowRight, Flame } from 'lucide-react'
import { DisqusCommentCount } from '@/components/blog/DisqusCommentCount'
import { SeriesBadge } from '@/components/blog/SeriesBadge'

const containerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.03,
    },
  },
}

const itemVariants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const },
  },
}

interface PostListViewProps {
  posts: PostIndexEntry[]
  emptyMessage?: string
}

export function PostListView({ posts, emptyMessage = 'No posts found.' }: PostListViewProps) {
  if (posts.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          color: 'var(--color-base-muted)',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
        <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <motion.div
      className="flex flex-col gap-4 sm:gap-5"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {posts.map((post) => (
        <PostListItem key={post.slug} post={post} />
      ))}
    </motion.div>
  )
}

interface PostListItemProps {
  post: PostIndexEntry
}

function PostListItem({ post }: PostListItemProps) {
  const { title, description, coverImage, date, category, tags, slug, featured, series, seriesOrder, readingTime, comments } = post

  const allPosts = useContentStore((s) => s.posts)
  const totalPartsInSeries = React.useMemo(() =>
    series ? allPosts.filter((p) => p.series === series).length : 0,
    [series, allPosts],
  )

  const hasCover = !!coverImage

  return (
    <motion.article
      className="relative group flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5"
      variants={itemVariants}
      style={{ willChange: 'opacity, transform' }}
    >
      {/* ── Soft background fill on hover (like SidebarCategories) ── */}
      <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 rounded-2xl origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out pointer-events-none" />

      {/* ── Content area (70% with cover, 100% without) ── */}
      <div className={`relative z-10 flex flex-1 flex-col sm:flex-row ${hasCover ? '' : ''}`}>
        {/* Text section */}
        <div className={`flex flex-col flex-1 p-5 sm:p-6 ${hasCover ? 'sm:w-[70%]' : 'w-full'}`}>
          {/* Metadata pills row */}
          <div className="flex items-center gap-2 flex-wrap mb-3">
            {/* Category pill */}
            <Link
              to={`/blog/category/${category}`}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-[0.65rem] font-semibold uppercase tracking-wider border border-brand-200 dark:border-brand-700 hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors no-underline"
            >
              {category}
            </Link>

            {/* Tags as micro-pills */}
            {tags.slice(0, 2).map((tag) => (
              <Link
                key={tag}
                to={`/blog/tag/${tag}`}
                className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted dark:bg-slate-800 text-muted-foreground dark:text-slate-400 text-[0.6rem] font-medium border border-border dark:border-slate-700 hover:bg-primary/10 hover:text-primary transition-colors no-underline"
              >
                #{tag}
              </Link>
            ))}
            {tags.length > 2 && (
              <span className="text-[0.6rem] text-muted-foreground font-mono">+{tags.length - 2}</span>
            )}

            {/* Series badge */}
            {series && (
              <SeriesBadge
                seriesName={series}
                seriesOrder={seriesOrder}
                totalParts={totalPartsInSeries}
              />
            )}

            {/* Featured indicator */}
            {featured && (
              <span className="relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md bg-white/80 dark:bg-gray-950/80 text-red-600 dark:text-red-400 font-semibold text-[0.6rem] uppercase tracking-widest shadow-lg shadow-black/5 border border-red-400/30 dark:border-red-400/40 group-hover:bg-red-500 dark:group-hover:bg-red-600 dark:group-hover:text-white group-hover:text-white group-hover:border-red-500 dark:group-hover:border-red-600 transition-all duration-300">
                <Flame size={11} className="shrink-0" strokeWidth={2.5} />
                Featured
              </span>
            )}
          </div>

          {/* Title with active indicator */}
          <Link to={`/blog/${slug}`} className="group/title no-underline">
            <h1 className="font-serif text-[1.15rem] sm:text-[1.3rem] font-bold leading-relaxed tracking-wider text-card-foreground group-hover/title:text-primary transition-colors flex items-start gap-2">
              {title}
            </h1>
          </Link>

          {/* Description */}
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed mt-2 mb-4 line-clamp-2">
              {description}
            </p>
          )}

          {/* Bottom metadata row */}
          <div className="flex items-center gap-3 flex-wrap mt-auto pt-3 border-t border-border">
            {/* Author */}
            <div className="flex items-center gap-1.5">
              {post.authorAvatar ? (
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-5 h-5 rounded-full object-cover shrink-0"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              ) : null}
              <span className="text-[0.7rem] font-medium text-muted-foreground">
                {post.authorName || post.author || 'Unknown'}
              </span>
            </div>

            {/* Date pill */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/80 dark:bg-slate-800/80 text-muted-foreground text-[0.65rem] font-medium border border-border/50">
              <Calendar size={10} />
              {formatDateShort(date)}
            </span>

            {/* Reading time pill */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/80 dark:bg-slate-800/80 text-muted-foreground text-[0.65rem] font-medium border border-border/50">
              <Clock size={10} />
              {readingTime < 1 ? '< 1 min' : `${Math.round(readingTime)} min`}
            </span>

            {/* Comments count */}
            {comments !== false && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/80 dark:bg-slate-800/80 text-muted-foreground text-[0.65rem] font-medium border border-border/50">
                <MessageCircle size={10} />
                <DisqusCommentCount
                  identifier={`blog:${slug}`}
                  href={`/blog/${slug}#disqus_thread`}
                />
              </span>
            )}
          </div>
        </div>

        {/* ── Thumbnail or chevron block (30%) ── */}
        <div className={`shrink-0 ${hasCover ? 'sm:w-[30%]' : 'sm:w-14'}`}>
          {hasCover ? (
            <Link
              to={`/blog/${slug}`}
              className="block w-full h-full min-h-[160px] sm:min-h-full relative overflow-hidden"
            >
              <img
                src={coverImage}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* Gradient overlay on image for text readability */}
              <div className="absolute inset-0 bg-gradient-to-l from-black/30 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:via-transparent sm:to-black/20" />
            </Link>
          ) : (
            /* Interactive chevron block for posts without cover images */
            <Link
              to={`/blog/${slug}`}
              className="hidden sm:flex flex-col items-center justify-center w-14 h-full min-h-[120px] bg-gradient-to-b from-muted/30 to-muted/10 dark:from-slate-800/30 dark:to-slate-800/10 border-l border-border text-muted-foreground hover:text-primary hover:bg-primary/15 transition-all duration-300 group/chevron"
            >
              <span className="text-[0.55rem] font-bold uppercase tracking-widest mb-1 opacity-50 group-hover/chevron:opacity-100 transition-opacity">
                Read
              </span>
              <ChevronRight
                size={20}
                className="transition-all duration-300 group-hover/chevron:translate-x-1 group-hover/chevron:scale-110"
              />
            </Link>
          )}
        </div>
      </div>

      {/* ── Bottom "Read more" link for mobile ── */}
      <div className="sm:hidden flex items-center justify-between px-5 pb-4 pt-0">
        <Link
          to={`/blog/${slug}`}
          className="inline-flex items-center gap-1 text-[0.8rem] font-semibold text-primary no-underline transition-all hover:gap-2"
        >
          Read more <ArrowRight size={13} />
        </Link>
      </div>
    </motion.article>
  )
}
