import React from 'react'
import { useParams, Navigate } from 'react-router'
import { useContentStore } from '@/store/contentStore'
import { useBlogPosts } from '@/hooks/useBlogPosts'
import { PostGrid } from '@/components/blog/PostGrid'
import { CategoryFilter } from '@/components/blog/CategoryFilter'
import { Breadcrumbs } from '@/components/blog/Breadcrumbs'
import { SEO } from '@/components/common/SEO'
import { breadcrumbListJsonLd } from '@/lib/seo/jsonld'
import siteConfig from '../../site.config.json'

const catConfig = siteConfig as unknown as { siteUrl: string }

export default function BlogCategory() {
  const { name } = useParams()
  const status = useContentStore((s) => s.status)
  const allPosts = useContentStore((s) => s.posts)
  const posts = React.useMemo(() => allPosts.filter((p) => p.category === name), [allPosts, name])
  const categories = React.useMemo(() => [...new Set(allPosts.map((p) => p.category))], [allPosts])

  // ── Sort, View, Pagination (shared hook) ───────────────────────
  const {
    sortedPosts,
    visiblePosts,
    visibleCount,
    setVisibleCount,
    sortMode,
    sortOrder,
    viewMode,
    setSortMode,
    setSortOrder,
    setViewMode,
    handleReset,
  } = useBlogPosts(posts)

  // Wait for the content store to finish loading before deciding whether to redirect.
  // Without this check, an empty `posts` array (initial state) triggers an early redirect
  // to /blog, causing "Transition was skipped" errors in production.
  if (status === 'idle' || status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading content…</p>
        </div>
      </div>
    )
  }

  if (!name || (!categories.includes(name) && posts.length === 0)) {
    return <Navigate to="/blog" replace />
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <SEO
        title={`${name} Posts`}
        description={`Browse all blog posts in the ${name} category.`}
        jsonLd={[
          breadcrumbListJsonLd({
            siteUrl: catConfig.siteUrl,
            itemListElement: [
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: 'Category' },
              { label: name },
            ],
          }),
        ]}
      />
      <div className="mb-6 sm:mb-8">
        <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }, { label: 'Category', href: '/blog/category' }, { label: name }]} />
      </div>

      <header className="mb-8 sm:mb-12">
        <h1 className="font-serif text-3xl sm:text-[2.5rem] font-bold mb-3 sm:mb-4 tracking-tight">
          {name}
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          {sortedPosts.length} post{sortedPosts.length === 1 ? '' : 's'} in this category.
        </p>
      </header>

      <div className="mb-8 sm:mb-12">
        <CategoryFilter
          categories={categories}
          activeCategoryParam={name}
          sortMode={sortMode}
          sortOrder={sortOrder}
          viewMode={viewMode}
          onSortChange={setSortMode}
          onOrderChange={setSortOrder}
          onViewChange={setViewMode}
          onReset={handleReset}
        />
      </div>

      <PostGrid posts={visiblePosts} viewMode={viewMode} />

      {visibleCount < sortedPosts.length && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setVisibleCount((v) => v + 6)}
            className="px-6 py-2.5 rounded-full border border-border bg-card text-foreground font-medium shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-brand-300 transition-all active:scale-95"
          >
            Load More Posts
          </button>
        </div>
      )}
    </div>
  )
}
