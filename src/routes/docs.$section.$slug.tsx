import React from 'react'
import { useParams } from 'react-router'
import { useContentStore } from '@/store/contentStore'
import { SEO } from '@/components/common/SEO'
import { VersionBadge } from '@/components/docs/VersionBadge'
import { PrevNextNav } from '@/components/docs/PrevNextNav'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { useActiveHeading } from '@/hooks/useActiveHeading'

import { ChevronRight } from 'lucide-react'
import { MobileTocSheet } from '@/components/blog/MobileTocSheet'
import { setTocData } from '@/lib/tocStore'
import { useContentHeadings } from '@/hooks/useContentHeadings'

export default function DocPage() {
  const params = useParams()
  const fullSlug = params['*']

  // ── Lazy-load the MDX component for this specific doc ──────────────
  const [MdxComponent, setMdxComponent] = React.useState<React.ComponentType | null>(null)
  const [mdxLoading, setMdxLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false
    setMdxLoading(true) // eslint-disable-line react-hooks/set-state-in-effect

    async function load() {
      if (!fullSlug) {
        setMdxLoading(false)
        return
      }
      const Component = await useContentStore.getState().loadDocComponent(fullSlug)
      if (!cancelled) {
        setMdxComponent(() => Component || null)
        setMdxLoading(false)
      }
    }
    load()

    return () => { cancelled = true }
  }, [fullSlug])

  // ── Metadata from the lightweight content index ───────────────────
  const docs = useContentStore((s) => s.docs)
  const status = useContentStore((s) => s.status)
  const doc = React.useMemo(() => docs.find((d) => d.slug === fullSlug), [docs, fullSlug])
  
  const headings = useContentHeadings(doc?.slug)

  const headingIds = React.useMemo(() => headings.map((h) => h.id), [headings])
  const activeId = useActiveHeading(headingIds)

  // Push heading data to the shared MobileTocSheet store
  // Respect frontmatter.toc — hide when explicitly disabled
  React.useEffect(() => {
    if (doc?.toc === false) return
    setTocData(headings, activeId)
    return () => setTocData([], '')
  }, [headings, activeId, doc?.toc])

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

  const { title, description, section, version, toc } = doc

  // Find prev/next docs within the same section or globally based on order
  const currentIndex = docs.findIndex(d => d.slug === fullSlug)
  const prevDoc = currentIndex > 0 ? docs[currentIndex - 1] : null
  const nextDoc = currentIndex < docs.length - 1 ? docs[currentIndex + 1] : null

  return (
    <>
      <SEO 
        title={`${title} | Docs`}
        description={description || `Documentation for ${title}`}
      />
      <main className="docs-main min-w-0">
        {/* Section breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <span className="font-medium">{section}</span>
        <ChevronRight size={14} className="opacity-50" />
        <span className="text-foreground">{title}</span>
      </div>

      <header className="mb-10">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <h1 className="text-4xl font-bold tracking-tight leading-tight m-0">
            {title}
          </h1>
          {version && (
            <div className="mt-2">
              <VersionBadge version={version} />
            </div>
          )}
        </div>
        {description && (
          <p className="text-lg text-muted-foreground mt-4 leading-relaxed">
            {description}
          </p>
        )}
      </header>

      <article className="prose">
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

      {prevDoc || nextDoc ? (
        <PrevNextNav
          prev={prevDoc}
          next={nextDoc}
        />
      ) : null}
      </main>

      {toc !== false && (
        <div className="docs-toc sticky top-[100px] self-start hidden xl:block pr-2 max-h-[calc(100vh-140px)] overflow-y-auto">
          <TableOfContents items={headings} activeId={activeId} />
        </div>
      )}

      <MobileTocSheet />
    </>
  )
}
