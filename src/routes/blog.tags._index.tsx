import React from 'react'
import { useContentStore } from '@/store/contentStore'
import { CardGrid, Card } from '@/components/mdx/CardGrid'
import { Breadcrumbs } from '@/components/blog/Breadcrumbs'
import { SEO } from '@/components/common/SEO'
import { breadcrumbListJsonLd } from '@/lib/seo/jsonld'
import siteConfig from '../../site.config.json'

const config = siteConfig as unknown as { siteUrl: string }

export default function BlogTagsIndex() {
  const posts = useContentStore((s) => s.posts)

  // Compute tag list with counts, sorted by count desc
  const tags = React.useMemo(() => {
    const counts: Record<string, number> = {}
    posts.forEach((p) => {
      p.tags.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1
      })
    })
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
  }, [posts])

  // Group tags by first letter for section headers
  const groupedTags = React.useMemo(() => {
    const groups: Record<string, typeof tags> = {}
    tags.forEach((tag) => {
      const firstLetter = tag.name.charAt(0).toUpperCase()
      if (!groups[firstLetter]) groups[firstLetter] = []
      groups[firstLetter].push(tag)
    })
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  }, [tags])

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <SEO
        title="Tags"
        description="Browse all blog post tags. Find articles by topic and keyword."
        jsonLd={[
          breadcrumbListJsonLd({
            siteUrl: config.siteUrl,
            itemListElement: [
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: 'Tags' },
            ],
          }),
        ]}
      />

      <div className="mb-6 sm:mb-8">
        <Breadcrumbs items={[
          { label: 'Blog', href: '/blog' },
          { label: 'Tags' },
        ]} />
      </div>

      <header className="mb-8 sm:mb-12">
        <h1 className="font-serif text-3xl sm:text-[2.5rem] font-bold mb-3 sm:mb-4 tracking-tight">
          Tags
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          {tags.length} tag{tags.length === 1 ? '' : 's'} — browse posts by keyword.
        </p>
      </header>

      {tags.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No tags found.</p>
        </div>
      ) : (
        <>
          {/* Alphabetical jump links */}
          <div className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-border">
            {groupedTags.map(([letter]) => (
              <a
                key={letter}
                href={`#tag-group-${letter}`}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-muted text-sm font-semibold text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors no-underline"
              >
                {letter}
              </a>
            ))}
          </div>

          {/* Tag groups */}
          {groupedTags.map(([letter, letterTags]) => (
            <section key={letter} id={`tag-group-${letter}`} className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-foreground mb-6 tracking-tight flex items-center gap-3">
                <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary/10 text-primary text-lg font-bold">
                  {letter}
                </span>
                <span>{letter}</span>
              </h2>
              <CardGrid columns={4}>
                {letterTags.map(({ name, count }) => (
                  <Card
                    key={name}
                    title={`#${name}`}
                    description={`${count} post${count === 1 ? '' : 's'}`}
                    icon="tag"
                  href={`/blog/tag/${name}`}
                  linkText="View Posts"
                />
                ))}
              </CardGrid>
            </section>
          ))}
        </>
      )}
    </div>
  )
}
