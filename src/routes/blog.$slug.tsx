import React from 'react'
import { useParams, Navigate } from 'react-router'
import { useContentStore } from '@/store/contentStore'
import { Breadcrumbs } from '@/components/blog/Breadcrumbs'
import { AuthorCard } from '@/components/blog/AuthorCard'
import { CCLicense } from '@/components/blog/CCLicense'
import { ReadingTime } from '@/components/blog/ReadingTime'
import { TableOfContents, useActiveHeading } from '@/components/blog/TableOfContents'
import { extractHeadingsFromHtml, formatDate, type HeadingItem } from '@/lib/utils'
import { Calendar, Tag } from 'lucide-react'
import { BackToTop } from '@/components/blog/BackToTop'
import { SEO } from '@/components/common/SEO'
import { MDXProvider } from '@mdx-js/react'
import { MDXComponents } from '@/components/mdx/MDXComponents'
import { PostPagination } from '@/components/blog/PostPagination'

export default function BlogPost() {
  const { slug } = useParams()
  const allPosts = useContentStore((s) => s.posts)
  const post = React.useMemo(() => allPosts.find((p) => p.slug === slug), [allPosts, slug])
  
  const { prevPost, nextPost } = React.useMemo(() => {
    const currentIndex = allPosts.findIndex((p) => p.slug === slug)
    if (currentIndex === -1) return { prevPost: undefined, nextPost: undefined }
    // posts are sorted newest first. Next (newer) is index-1, Prev (older) is index+1.
    return {
      nextPost: currentIndex > 0 ? allPosts[currentIndex - 1] : undefined,
      prevPost: currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : undefined
    }
  }, [allPosts, slug])

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

        <footer className="mt-16 pt-8 border-t border-border">
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-12">
              <span className="text-sm font-semibold text-foreground mr-2">Tags:</span>
              {frontmatter.tags.map(tag => (
                <a key={tag} href={`/blog/tag/${tag}`} className="tag-pill">#{tag}</a>
              ))}
            </div>
          )}

          {author && (
            <div className="mb-12">
              <AuthorCard author={author} />
            </div>
          )}

          {frontmatter.cc && (
            <CCLicense code={frontmatter.cc} author={author?.name ?? frontmatter.author} />
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
