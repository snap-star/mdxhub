import React from 'react'
import { useParams, Navigate } from 'react-router'
import { useContentStore } from '@/store/contentStore'
import { PostGrid } from '@/components/blog/PostGrid'
import { TagCloud } from '@/components/blog/TagCloud'
import { Breadcrumbs } from '@/components/blog/Breadcrumbs'
import { SEO } from '@/components/common/SEO'
import { breadcrumbListJsonLd } from '@/lib/seo/jsonld'
import siteConfig from '../../site.config.json'

const tagConfig = siteConfig as unknown as { siteUrl: string }

export default function BlogTag() {
  const { tag } = useParams()
  const allPosts = useContentStore((s) => s.posts)
  const posts = React.useMemo(() => allPosts.filter((p) => p.tags.includes(tag ?? '')), [allPosts, tag])
  const tags = React.useMemo(() => [...new Set(allPosts.flatMap((p) => p.tags))], [allPosts])

  if (!tag || (!tags.includes(tag) && posts.length === 0)) {
    return <Navigate to="/blog" replace />
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-12 grid tag-page-grid gap-8 sm:gap-12">
      <SEO
        title={`#${tag}`}
        description={`Browse all blog posts tagged with ${tag}.`}
        jsonLd={[
          breadcrumbListJsonLd({
            siteUrl: tagConfig.siteUrl,
            itemListElement: [
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: 'Tag' },
              { label: `#${tag}` },
            ],
          }),
        ]}
      />
      <main>
        <div className="mb-6 sm:mb-8">
          <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }, { label: 'Tag' }, { label: `#${tag}` }]} />
        </div>

        <header className="mb-8 sm:mb-12">
          <h1 className="font-serif text-3xl sm:text-[2.5rem] font-bold mb-3 sm:mb-4 tracking-tight">
            #{tag}
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            {posts.length} post{posts.length === 1 ? '' : 's'} tagged with &ldquo;{tag}&rdquo;.
          </p>
        </header>

        <PostGrid posts={posts} />
      </main>

      <aside className="tag-page-aside sticky top-[100px] self-start">
        <TagCloud tags={tags} activeTag={tag} />
      </aside>

      <style>{`
        .tag-page-grid { grid-template-columns: 1fr 300px; }
        @media (max-width: 1024px) {
          .tag-page-grid { grid-template-columns: 1fr; }
          .tag-page-aside { display: none; }
        }
      `}</style>
    </div>
  )
}
