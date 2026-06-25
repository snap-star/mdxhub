import React from 'react'
import { useParams, Navigate, Link } from 'react-router'
import { useContentStore } from '@/store/contentStore'
import { Breadcrumbs } from '@/components/blog/Breadcrumbs'
import { AuthorCard } from '@/components/blog/AuthorCard'
import { CCLicense } from '@/components/blog/CCLicense'
import { ReadingTime } from '@/components/blog/ReadingTime'
import { TableOfContents, useActiveHeading } from '@/components/blog/TableOfContents'
import { extractHeadingsFromHtml, formatDate, matchesSlugOrFilename, type HeadingItem } from '@/lib/utils'
import { Calendar, MessageCircle, Tag } from 'lucide-react'
import { BackToTop } from '@/components/blog/BackToTop'
import { SEO } from '@/components/common/SEO'
import { MDXProvider } from '@mdx-js/react'
import { MDXComponents } from '@/components/mdx/MDXComponents'
import { PostPagination } from '@/components/blog/PostPagination'
import { ShareButtons } from '@/components/blog/ShareButtons'
import { DisqusComments } from '@/components/blog/DisqusComments'
import { DisqusCommentCount } from '@/components/blog/DisqusCommentCount'
import { SeriesNav } from '@/components/blog/SeriesNav'
import { BookOpen, ChevronRight } from 'lucide-react'

export default function BlogPost() {
  const params = useParams()
  const currentSlug = [params.slug, params['*']].filter(Boolean).join('/')
  const allPosts = useContentStore((s) => s.posts)
  const status = useContentStore((s) => s.status)
  const post = React.useMemo(() => allPosts.find((p) => matchesSlugOrFilename(p.slug, currentSlug)), [allPosts, currentSlug])
  
  // Series data for the top-of-post notice
  const seriesPosts = React.useMemo(
    () => allPosts.filter((p) => p.frontmatter.series === post?.frontmatter.series),
    [allPosts, post?.frontmatter.series],
  )
  const sortedSeriesPosts = React.useMemo(
    () => [...seriesPosts].sort((a, b) => (a.frontmatter.seriesOrder ?? 0) - (b.frontmatter.seriesOrder ?? 0)),
    [seriesPosts],
  )
  const currentSeriesIndex = sortedSeriesPosts.findIndex((p) => matchesSlugOrFilename(p.slug, currentSlug))

  const { prevPost, nextPost } = React.useMemo(() => {
    const currentIndex = allPosts.findIndex((p) => matchesSlugOrFilename(p.slug, currentSlug))
    if (currentIndex === -1) return { prevPost: undefined, nextPost: undefined }
    // posts are sorted newest first. Next (newer) is index-1, Prev (older) is index+1.
    return {
      nextPost: currentIndex > 0 ? allPosts[currentIndex - 1] : undefined,
      prevPost: currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : undefined
    }
  }, [allPosts, currentSlug])

  const [headings, setHeadings] = React.useState<HeadingItem[]>([])

  React.useEffect(() => {
    if (!post) return
    // Wait a tick for MDX to render to DOM
    setTimeout(() => {
      const article = document.querySelector('article.prose')
      if (article) {
        const extracted = extractHeadingsFromHtml(article.innerHTML)
        setHeadings(extracted)
      }
    }, 100)
  }, [post])

  const headingIds = React.useMemo(() => headings.map((h) => h.id), [headings])
  const activeId = useActiveHeading(headingIds)

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

  const { frontmatter, author, readingTime, Component } = post

  return (
    <>
      <SEO 
        title={frontmatter.title} 
        description={frontmatter.description} 
        image={frontmatter.coverImage} 
        type="article"
      />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8 grid grid-cols-[1fr] lg:grid-cols-[1fr_280px] gap-8 lg:gap-16 blog-post-grid">
      <main className="min-w-0">
        <div className="mb-6 sm:mb-8">
          <Breadcrumbs items={[
            { label: 'Blog', href: '/blog' },
            { label: frontmatter.category, href: `/blog/category/${frontmatter.category}` },
            { label: frontmatter.title }
          ]} />
        </div>

        <header className="mb-8 sm:mb-12">
          {/* Compact series notice — top of post */}
          {frontmatter.series && sortedSeriesPosts.length > 0 && (
            <div className="mb-5">
              <Link
                to={`/blog/${sortedSeriesPosts[0].slug}`}
                className="inline-flex items-center gap-1.5 text-[0.8rem] font-medium text-muted-foreground hover:text-primary transition-colors no-underline group"
              >
                <BookOpen size={13} className="shrink-0 text-primary/70" />
                <span className="truncate max-w-[200px]">{frontmatter.series}</span>
                <span className="text-[0.7rem] opacity-60 whitespace-nowrap">
                  · Part {currentSeriesIndex + 1} of {sortedSeriesPosts.length}
                </span>
                <ChevronRight size={13} className="opacity-40 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </Link>
            </div>
          )}

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4 sm:mb-6">
            {frontmatter.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-[0.9rem] mb-8">
            {author && <AuthorCard author={author} compact />}
            <div className="flex items-center gap-1.5">
              <Calendar size={14} /> {formatDate(frontmatter.date)}
            </div>
            {(frontmatter.lastEdited || frontmatter.updatedAt) && (
              <div className="flex items-center gap-1.5" title="Last Updated">
                <Calendar size={14} className="opacity-70" /> 
                Updated: {formatDate(frontmatter.lastEdited || frontmatter.updatedAt!)}
              </div>
            )}
            <ReadingTime minutes={readingTime} />
            <div className="flex items-center gap-1.5">
              <Tag size={14} /> {frontmatter.category}
            </div>
            {frontmatter.comments !== false && (
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

          {frontmatter.coverImage && (
            <img
              src={frontmatter.coverImage}
              alt=""
              className="w-full h-auto rounded-xl mb-8 border border-border object-cover max-h-[400px]"
            />
          )}
        </header>

        <article className="prose" style={{ maxWidth: '100%' }}>
          <Component />
        </article>
        {/* blog post footer | tags */}
        <footer className="mt-16 pt-8 border-t border-border">
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-8">
              <span className="text-sm font-semibold text-foreground mr-2">Tags:</span>
              {frontmatter.tags.map(tag => (
                <a key={tag} href={`/blog/tag/${tag}`} className="tag-pill">#{tag}</a>
              ))}
            </div>
          )}
          {/* Series Navigation */}
          {frontmatter.series && (
            <SeriesNav
              seriesName={frontmatter.series}
              posts={allPosts.filter((p) => p.frontmatter.series === frontmatter.series)}
              currentSlug={post.slug}
            />
          )}

          {/* Share buttons */}
          <ShareButtons title={frontmatter.title} slug={post.slug} />
          {/* Author info */}
          {author && (
            <div className="mb-12">
              <AuthorCard author={author} />
            </div>
          )}

          {frontmatter.cc && (
            <CCLicense code={frontmatter.cc} author={author?.name ?? frontmatter.author} />
          )}

          {/* Disqus comments */}
        {frontmatter.comments !== false && (
          <div className="mt-12 overflow-auto border rounded-2xl dark:rounded-2xl border-gray-200 dark:border-0">
            <DisqusComments
              identifier={`blog:${post.slug}`}
              title={frontmatter.title}
            />
          </div>
        )}

          <PostPagination prevPost={prevPost} nextPost={nextPost} />
        </footer>
      </main>

      <aside className="sticky top-[100px] self-start hidden lg:block blog-toc-aside max-h-[calc(100vh-140px)] overflow-y-auto pr-2">
        <TableOfContents items={headings} activeId={activeId} />
      </aside>

      <style>{`
        @media (max-width: 1024px) {
          .blog-post-grid { grid-template-columns: 1fr !important; }
          .blog-toc-aside { display: none !important; }
        }
        
        /* Sleek scrollbar for the TOC aside */
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
