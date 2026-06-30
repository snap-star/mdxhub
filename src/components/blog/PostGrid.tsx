import React from 'react'
import { PostCard } from './PostCard'
import type { PostIndexEntry } from '@/lib/content/contentIndex'

interface PostGridProps {
  posts: PostIndexEntry[]
  emptyMessage?: string
}

export function PostGrid({ posts, emptyMessage = 'No posts found.' }: PostGridProps) {
  if (posts.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          color: 'var(--color-base-muted)',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
        <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {posts.map((post, i) => (
        <PostCard key={post.slug} post={post} index={i} />
      ))}
    </div>
  )
}
