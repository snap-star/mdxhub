import React from 'react'
import { useContentStore } from '@/store/contentStore'
import { Link } from 'react-router'
import { BookOpen, ChevronRight } from 'lucide-react'

export default function DocsIndex() {
  const docs = useContentStore((s) => s.docs)

  // Group by section for the landing page cards
  const sections = React.useMemo(() => {
    const map: Record<string, { label: string; firstDoc: string; count: number }> = {}
    docs.forEach((d) => {
      if (!map[d.sectionSlug]) {
        map[d.sectionSlug] = { label: d.frontmatter.section, firstDoc: d.slug, count: 0 }
      }
      map[d.sectionSlug].count++
    })
    return Object.values(map)
  }, [docs])

  return (
    <main className="docs-main">
      <div className="py-4 sm:py-8">
        <h1 className="text-3xl sm:text-[2.5rem] font-bold tracking-tight mb-3 sm:mb-4">
          Documentation
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-12 leading-relaxed">
          Welcome to the docs! Explore our guides and API references to get the most out of the platform.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4 sm:gap-6">
        {sections.map((sec) => (
          <Link
            key={sec.label}
            to={`/docs/${sec.firstDoc}`}
            className="group flex flex-col p-6 border border-border rounded-xl bg-card no-underline transition-all duration-200 hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5"
          >
            <BookOpen size={24} className="text-primary mb-4" />
            <h2 className="text-[1.1rem] font-semibold text-card-foreground mb-2">
              {sec.label}
            </h2>
            <p className="text-sm text-muted-foreground mb-6 flex-1">
              {sec.count} article{sec.count === 1 ? '' : 's'} in this section.
            </p>
            <div className="flex items-center gap-1 text-[0.8rem] font-semibold text-primary group-hover:gap-2 transition-all">
              Explore <ChevronRight size={14} />
            </div>
          </Link>
        ))}
        </div>
      </div>
    </main>
  )
}
