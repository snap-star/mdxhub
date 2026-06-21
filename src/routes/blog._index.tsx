import React from 'react'
import { useContentStore } from '@/store/contentStore'
import { PostGrid } from '@/components/blog/PostGrid'
import { CategoryFilter } from '@/components/blog/CategoryFilter'
import { TagCloud } from '@/components/blog/TagCloud'
import { SidebarCategories } from '@/components/blog/SidebarCategories'
import { SponsorCard } from '@/components/blog/SponsorCard'
import { SEO } from '@/components/common/SEO'

export default function BlogIndex() {
  const posts = useContentStore((s) => s.posts)
  const categories = React.useMemo(() => [...new Set(posts.map((p) => p.frontmatter.category))], [posts])
  const tags = React.useMemo(() => [...new Set(posts.flatMap((p) => p.frontmatter.tags))], [posts])

  const [visibleCount, setVisibleCount] = React.useState(6)
  const visiblePosts = React.useMemo(() => posts.slice(0, visibleCount), [posts, visibleCount])

  // Calculate category frequencies
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {}
    posts.forEach((p) => {
      const cat = p.frontmatter.category
      counts[cat] = (counts[cat] || 0) + 1
    })
    return counts
  }, [posts])

  // Calculate tag frequencies
  const tagCounts = React.useMemo(() => {
    const counts: Record<string, number> = {}
    posts.forEach((p) => {
      p.frontmatter.tags.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1
      })
    })
    return counts
  }, [posts])

  return (
    <div>
      <SEO title="Blog" description="Read the latest articles, tutorials, and updates." />
      {/* Hero */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 border-b border-border bg-brand-50/40 dark:bg-brand-950/20 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-brand-400/10 dark:bg-brand-500/5 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="max-w-[1200px] mx-auto text-center relative z-10">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 tracking-tight text-brand-950 dark:text-brand-50">
            The Blog
          </h1>
          <p className="text-base sm:text-[1.1rem] md:text-lg text-brand-800/70 dark:text-brand-200/60 max-w-[600px] mx-auto leading-relaxed">
            Thoughts, tutorials, and insights on modern web development, React, and MDX.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-12 grid blog-index-grid gap-8 sm:gap-12">
        <main>
          <div className="mb-6 sm:mb-8">
            <CategoryFilter categories={categories} />
          </div>
          <PostGrid posts={visiblePosts} />
          
          {visibleCount < posts.length && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => setVisibleCount((v) => v + 6)}
                className="px-6 py-2.5 rounded-full border border-border bg-card text-foreground font-medium shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-brand-300 transition-all active:scale-95"
              >
                Load More Posts
              </button>
            </div>
          )}
        </main>

        <aside className="blog-index-aside">
          <div className="sticky top-[100px] flex flex-col gap-2">
            <SidebarCategories categoryCounts={categoryCounts} />
            <TagCloud tags={tags} tagCounts={tagCounts} />
            <SponsorCard />
          </div>
        </aside>
      </div>

      <style>{`
        .blog-index-grid {
          grid-template-columns: 1fr 300px;
        }
        @media (max-width: 1024px) {
          .blog-index-grid {
            grid-template-columns: 1fr;
          }
          .blog-index-aside {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
