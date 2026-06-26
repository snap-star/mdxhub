import React from 'react'
import { useParams, Navigate } from 'react-router'
import { useContentStore } from '@/store/contentStore'
import { SEO } from '@/components/common/SEO'
import { VersionBadge } from '@/components/docs/VersionBadge'
import { PrevNextNav } from '@/components/docs/PrevNextNav'
import { TableOfContents, useActiveHeading } from '@/components/blog/TableOfContents'
import { extractHeadingsFromHtml, type HeadingItem } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import { MobileTocSheet, setTocData } from '@/components/blog/MobileTocSheet'

export default function DocPage() {
  const params = useParams()
  const fullSlug = params['*']
  const docs = useContentStore((s) => s.docs)
  const status = useContentStore((s) => s.status)
  const doc = React.useMemo(() => docs.find((d) => d.slug === fullSlug), [docs, fullSlug])
  
  const [headings, setHeadings] = React.useState<HeadingItem[]>([])

  React.useEffect(() => {
    if (!doc) return
    setTimeout(() => {
      const article = document.querySelector('article.prose')
      if (article) setHeadings(extractHeadingsFromHtml(article.innerHTML))
    }, 100)
  }, [doc])

  const headingIds = React.useMemo(() => headings.map((h) => h.id), [headings])
  const activeId = useActiveHeading(headingIds)

  // Push heading data to the shared MobileTocSheet store
  // Respect frontmatter.toc — hide when explicitly disabled
  // Use doc?.frontmatter?.toc instead of destructured frontmatter (which is declared later)
  React.useEffect(() => {
    if (doc?.frontmatter?.toc === false) return
    setTocData(headings, activeId)
    return () => setTocData([], '')
  }, [headings, activeId, doc?.frontmatter?.toc])

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading documentation...</p>
        </div>
      </div>
    )
  }

  if (!doc) {
    throw new Response("Not Found", { status: 404, statusText: "The requested documentation page could not be found." })
  }

  const { frontmatter, Component } = doc

  // Find prev/next docs within the same section or globally based on order
  const currentIndex = docs.findIndex(d => d.slug === fullSlug)
  const prevDoc = currentIndex > 0 ? docs[currentIndex - 1] : null
  const nextDoc = currentIndex < docs.length - 1 ? docs[currentIndex + 1] : null

  return (
    <>
      <SEO 
        title={`${frontmatter.title} | Docs`} 
        description={frontmatter.description || `Documentation for ${frontmatter.title}`} 
      />
      <main className="docs-main min-w-0">
        {/* Section breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <span className="font-medium">{frontmatter.section}</span>
        <ChevronRight size={14} className="opacity-50" />
        <span className="text-foreground">{frontmatter.title}</span>
      </div>

      <header className="mb-10">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <h1 className="text-4xl font-bold tracking-tight leading-tight m-0">
            {frontmatter.title}
          </h1>
          {frontmatter.version && (
            <div className="mt-2">
              <VersionBadge version={frontmatter.version} />
            </div>
          )}
        </div>
        {frontmatter.description && (
          <p className="text-lg text-muted-foreground mt-4 leading-relaxed">
            {frontmatter.description}
          </p>
        )}
      </header>

      <article className="prose">
        <Component />
      </article>

      <PrevNextNav prev={prevDoc} next={nextDoc} />
      </main>

      {frontmatter.toc !== false && (
        <div className="docs-toc sticky top-[100px] self-start hidden xl:block pr-2 max-h-[calc(100vh-140px)] overflow-y-auto">
          <TableOfContents items={headings} activeId={activeId} />
        </div>
      )}

      <MobileTocSheet />
    </>
  )
}
