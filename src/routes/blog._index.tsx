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
      <SEO
        title="Blog"
        description="Read the latest articles, tutorials, and updates."
      />
      {/* Hero Image Section*/}
      <section
        className="relative w-full h-56 md:h-96 overflow-hidden rounded-none group cursor-pointer"
        // onClick={() => window.open("/hero.png", "self")}
      >
        {/* Background Image */}
        <img
          src="/hero.png"
          alt="Chigusa Asuha"
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />

        {/* Transparent Gray Overlay */}
        <div className="absolute inset-0 bg-gray-900/50 dark:bg-gray-500/50 transition-opacity duration-300 group-hover:bg-gray-900/30 dark:group-hover:bg-gray-500/30" />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col justify-center h-full px-8">
          <h1 className="text-2xl md:text-4xl font-bold text-accent dark:text-accent mb-4">MDX Hub</h1>
          <p className="text-sm md:text-lg text-accent dark:text-accent max-w-xl font-mono font-semibold">
            Thoughts, tutorials, and insights on modern web development, React,
            and MDX.
          </p>
        </div>

        {/* Credit Badge - Bottom Right */}
        <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 z-10 bg-black/60 backdrop-blur-sm px-2.5 md:px-3 py-1 md:py-1.5 rounded-md">
          <span className="text-[10px] md:text-xs text-white font-medium">
            Image by:
          </span>
        </div>

        {/* Click indicator */}
        {/* <div className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-xs text-white">Click to view fullscreen</span>
        </div> */}
      </section>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-12 grid blog-index-grid gap-8 sm:gap-12">
        <main className="min-w-0">
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
  );
}
