import React from 'react'
import { useParams, Link } from 'react-router'
import { useContentStore } from '@/store/contentStore'
import { AuthorCard } from '@/components/blog/AuthorCard'
import { Breadcrumbs } from '@/components/blog/Breadcrumbs'
import { CCLicense } from '@/components/blog/CCLicense'
import { ReadingTime } from '@/components/blog/ReadingTime'
import type { Author } from '@/lib/content/types'
import { loadFullAuthor } from '@/lib/content/authorLoader'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { useActiveHeading } from '@/hooks/useActiveHeading'
import { formatDate, matchesSlugOrFilename } from '@/lib/utils'
import { Calendar, MessageCircle, Tag } from 'lucide-react'
import { BackToTop } from '@/components/blog/BackToTop'
import { SEO } from '@/components/common/SEO'
import { openLightbox } from '@/lib/lightboxStore'
import { PostPagination } from '@/components/blog/PostPagination'
import { ShareButtons } from '@/components/blog/ShareButtons'
import { DisqusComments } from '@/components/blog/DisqusComments'
import { DisqusCommentCount } from '@/components/blog/DisqusCommentCount'
import { SeriesNav } from '@/components/blog/SeriesNav'
import { BookOpen, ChevronRight } from 'lucide-react'
import { MobileTocSheet } from '@/components/blog/MobileTocSheet'
import { setTocData } from '@/lib/tocStore'
import { useContentHeadings } from '@/hooks/useContentHeadings'

export default function BlogPost() {
  const params = useParams()
  const currentSlug = [params.slug, params['*']].filter(Boolean).join('/')

  // ── Lazy-load the MDX component for this specific post ────────────
  const [MdxComponent, setMdxComponent] = React.useState<React.ComponentType | null>(null)
  const [mdxLoading, setMdxLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false
    setMdxLoading(true) // eslint-disable-line react-hooks/set-state-in-effect

    async function load() {
      const Component = await useContentStore.getState().loadPostComponent(currentSlug)
      if (!cancelled) {
        setMdxComponent(() => Component || null)
        setMdxLoading(false)
      }
    }
    load()

    return () => { cancelled = true }
  }, [currentSlug])

  // ── Metadata from the lightweight content index ───────────────────
  const allPosts = useContentStore((s) => s.posts)
  const status = useContentStore((s) => s.status)
  const post = React.useMemo(() => allPosts.find((p) => matchesSlugOrFilename(p.slug, currentSlug)), [allPosts, currentSlug])

  // Author info for header display (from content index — always available)
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const headerAuthor = React.useMemo(() => {
    if (!post?.authorName) return null
    return { name: post.authorName, avatar: post.authorAvatar }
  }, [post?.authorName, post?.authorAvatar])

  // Full author profile for footer AuthorCard (loaded from YAML on demand)
  const [fullAuthor, setFullAuthor] = React.useState<Author | null>(null)
  React.useEffect(() => {
    if (!post?.author) return
    let cancelled = false
    loadFullAuthor(post.author).then((author) => {
      if (!cancelled) {
        setFullAuthor(author)
      }
    })
    return () => { cancelled = true }
  }, [post?.author])

  // Series data for the top-of-post notice
  const seriesPosts = React.useMemo(
    () => allPosts.filter((p) => p.series === post?.series),
    [allPosts, post?.series],
  )
  const sortedSeriesPosts = React.useMemo(
    () => [...seriesPosts].sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0)),
    [seriesPosts],
  )
  const currentSeriesIndex = sortedSeriesPosts.findIndex((p) => matchesSlugOrFilename(p.slug, currentSlug))

  const { prevPost, nextPost } = React.useMemo(() => {
    const currentIndex = allPosts.findIndex((p) => matchesSlugOrFilename(p.slug, currentSlug))
    if (currentIndex === -1) return { prevPost: undefined, nextPost: undefined }
    return {
      nextPost: currentIndex > 0 ? allPosts[currentIndex - 1] : undefined,
      prevPost: currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : undefined
    }
  }, [allPosts, currentSlug])

  const headings = useContentHeadings(post?.slug)

  const headingIds = React.useMemo(() => headings.map((h) => h.id), [headings])
  const activeId = useActiveHeading(headingIds)

  // Push heading data to the shared MobileTocSheet store
  React.useEffect(() => {
    setTocData(headings, activeId)
    return () => setTocData([], '')
  }, [headings, activeId])

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    throw new Response("Not Found", { status: 404, statusText: "The requested blog post could not be found." })
  }

  const { title, description, coverImage, date, category, tags, series, comments, cc, lastEdited, updatedAt } = post

  return (
    <>
      <SEO 
        title={title}
        description={description}
        image={coverImage}
        type="article"
      />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8 grid grid-cols-[1fr] lg:grid-cols-[1fr_280px] gap-8 lg:gap-16 blog-post-grid">
      <main className="min-w-0">
        <div className="mb-6 sm:mb-8">
          <Breadcrumbs items={[
            { label: 'Blog', href: '/blog' },
            { label: category, href: `/blog/category/${category}` },
            { label: title }
          ]} />
        </div>

        <header className="mb-8 sm:mb-12">
          {series && sortedSeriesPosts.length > 0 && (
            <div className="mb-5">
              <Link
                to={`/blog/${sortedSeriesPosts[0].slug}`}
                className="inline-flex items-center gap-1.5 text-[0.8rem] font-medium text-muted-foreground hover:text-primary transition-colors no-underline group"
              >
                <BookOpen size={13} className="shrink-0 text-primary/70" />
                <span className="truncate max-w-[200px]">{series}</span>
                <span className="text-[0.7rem] opacity-60 whitespace-nowrap">
                  · Part {currentSeriesIndex + 1} of {sortedSeriesPosts.length}
                </span>
                <ChevronRight size={13} className="opacity-40 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </Link>
            </div>
          )}

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4 sm:mb-6">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-[0.9rem] mb-8">
            {headerAuthor && (
              <div className="flex items-center gap-2">
                <img
                  src={headerAuthor.avatar}
                  alt={headerAuthor.name}
                  className="w-7 h-7 rounded-full object-cover shrink-0"
                />
                <span className="font-medium text-foreground">{headerAuthor.name}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar size={14} /> {formatDate(date)}
            </div>
            {(lastEdited || updatedAt) && (
              <div className="flex items-center gap-1.5" title="Last Updated">
                <Calendar size={14} className="opacity-70" /> 
                Updated: {formatDate(lastEdited || updatedAt!)}
              </div>
            )}
            <ReadingTime minutes={post.readingTime} />
            <div className="flex items-center gap-1.5">
              <Tag size={14} /> {category}
            </div>
            {comments !== false && (
              <div className="flex items-center gap-1.5">
                <MessageCircle size={14} />
                <DisqusCommentCount
                  identifier={`blog:${post.slug}`}
                  href="#disqus_thread"
                  className="hover:text-primary transition-colors"
                />
              </div>
            )}
          </div>

          {coverImage && (
            <button
              onClick={() => openLightbox(coverImage!, title)}
              className="block w-full p-0 border-0 bg-transparent cursor-zoom-in mb-8"
              aria-label={`View cover image: ${title}`}
            >
              <img
                src={coverImage}
                alt=""
                className="w-full h-auto rounded-xl border border-border object-cover max-h-[400px]"
              />
            </button>
          )}
        </header>

        <article className="prose" style={{ maxWidth: '100%' }}>
          {mdxLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-5/6" />
              <div className="h-4 bg-muted rounded w-4/6" />
            </div>
          ) : MdxComponent ? (
            <MdxComponent />
          ) : (
            <p className="text-muted-foreground italic">Content could not be loaded.</p>
          )}
        </article>

        <footer className="mt-16 pt-8 border-t border-border">
          {tags && tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-8">
              <span className="text-sm font-semibold text-foreground mr-2">Tags:</span>
              {tags.map(tag => (
                <a key={tag} href={`/blog/tag/${tag}`} className="tag-pill">#{tag}</a>
              ))}
            </div>
          )}
          {series && (
            <SeriesNav
              seriesName={series}
              posts={sortedSeriesPosts}
              currentSlug={post.slug}
            />
          )}

          <ShareButtons title={title} slug={post.slug} />

          {/* Full author card in footer with bio + social links */}
          {fullAuthor && (
            <div className="mb-8">
              <AuthorCard author={fullAuthor} />
            </div>
          )}

          {cc && (
            <CCLicense code={cc} author={post.authorName} />
          )}

          {comments !== false && (
            <div className="mt-12 overflow-auto border rounded-2xl dark:rounded-2xl border-gray-200 dark:border-0">
              <DisqusComments
                identifier={`blog:${post.slug}`}
                title={title}
              />
            </div>
          )}

          <PostPagination
            prevPost={prevPost ?? undefined}
            nextPost={nextPost ?? undefined}
          />
        </footer>
      </main>

      <aside className="sticky top-[100px] self-start hidden lg:block blog-toc-aside max-h-[calc(100vh-140px)] overflow-y-auto pr-2">
        <TableOfContents items={headings} activeId={activeId} />
      </aside>

      <MobileTocSheet />

      <style>{`
        @media (max-width: 1024px) {
          .blog-post-grid { grid-template-columns: 1fr !important; }
          .blog-toc-aside { display: none !important; }
        }
        .blog-toc-aside::-webkit-scrollbar {
          width: 4px;
        }
        .blog-toc-aside::-webkit-scrollbar-track {
          background: transparent;
        }
        .blog-toc-aside::-webkit-scrollbar-thumb {
          background: var(--color-slate-200);
          border-radius: 4px;
        }
        .dark .blog-toc-aside::-webkit-scrollbar-thumb {
          background: oklch(32% 0.008 264);
        }
        .blog-toc-aside::-webkit-scrollbar-thumb:hover {
          background: var(--color-brand-400);
        }
      `}</style>
      
      <BackToTop />
    </div>
    </>
  )
}
