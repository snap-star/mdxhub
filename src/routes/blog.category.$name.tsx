import React from 'react'
import { useParams, Navigate } from 'react-router'
import { useContentStore } from '@/store/contentStore'
import { PostGrid } from '@/components/blog/PostGrid'
import { CategoryFilter } from '@/components/blog/CategoryFilter'
import { Breadcrumbs } from '@/components/blog/Breadcrumbs'

export default function BlogCategory() {
  const { name } = useParams()
  const allPosts = useContentStore((s) => s.posts)
  const posts = React.useMemo(() => allPosts.filter((p) => p.frontmatter.category === name), [allPosts, name])
  const categories = React.useMemo(() => [...new Set(allPosts.map((p) => p.frontmatter.category))], [allPosts])

  if (!name || (!categories.includes(name) && posts.length === 0)) {
    return <Navigate to="/blog" replace />
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }, { label: 'Category' }, { label: name }]} />
      </div>

      <header className="mb-8 sm:mb-12">
        <h1 className="font-serif text-3xl sm:text-[2.5rem] font-bold mb-3 sm:mb-4 tracking-tight">
          {name}
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          {posts.length} post{posts.length === 1 ? '' : 's'} in this category.
        </p>
      </header>

      <div className="mb-8 sm:mb-12">
        <CategoryFilter categories={categories} activeCategoryParam={name} />
      </div>

      <PostGrid posts={posts} />
    </div>
  )
}
