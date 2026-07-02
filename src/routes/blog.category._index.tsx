import React from 'react'
import { useContentStore } from '@/store/contentStore'
import { CardGrid, Card } from '@/components/mdx/CardGrid'
import { Breadcrumbs } from '@/components/blog/Breadcrumbs'
import { SEO } from '@/components/common/SEO'
import { breadcrumbListJsonLd } from '@/lib/seo/jsonld'
import siteConfig from '../../site.config.json'

const config = siteConfig as unknown as { siteUrl: string }

// Map category names to relevant icons
const CATEGORY_ICONS: Record<string, string> = {
  Showcase: 'sparkles',
  Tutorial: 'book',
  Guide: 'bulb',
  Reference: 'search',
  'Getting Started': 'rocket',
  Deployment: 'cloud',
}

function getCategoryIcon(name: string): string {
  return CATEGORY_ICONS[name] ?? 'tag'
}

export default function BlogCategoryIndex() {
  const posts = useContentStore((s) => s.posts)

  // Compute category list with counts, sorted by count desc
  const categories = React.useMemo(() => {
    const counts: Record<string, number> = {}
    posts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1
    })
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
  }, [posts])

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <SEO
        title="Categories"
        description="Browse all blog post categories. Find articles organized by topic."
        jsonLd={[
          breadcrumbListJsonLd({
            siteUrl: config.siteUrl,
            itemListElement: [
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: 'Categories' },
            ],
          }),
        ]}
      />

      <div className="mb-6 sm:mb-8">
        <Breadcrumbs items={[
          { label: 'Blog', href: '/blog' },
          { label: 'Categories' },
        ]} />
      </div>

      <header className="mb-8 sm:mb-12">
        <h1 className="font-serif text-3xl sm:text-[2.5rem] font-bold mb-3 sm:mb-4 tracking-tight">
          Categories
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          {categories.length} categor{categories.length === 1 ? 'y' : 'ies'} — browse posts by topic.
        </p>
      </header>

      {categories.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No categories found.</p>
        </div>
      ) : (
        <CardGrid columns={3}>
          {categories.map(({ name, count }) => (
            <Card
              key={name}
              title={name}
              description={`${count} post${count === 1 ? '' : 's'} — browse all articles in this category.`}
              icon={getCategoryIcon(name)}
              href={`/blog/category/${name}`}
              linkText="View Posts"
            />
          ))}
        </CardGrid>
      )}
    </div>
  )
}
