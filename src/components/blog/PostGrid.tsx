import React from 'react'
import { PostCard } from './PostCard'
import type { BlogPost } from '@/lib/content/types'

interface PostGridProps {
  posts: BlogPost[]
  emptyMessage?: string
}

function PostCardSkeleton() {
  return (
    <div
      style={{
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--color-base-border)',
        overflow: 'hidden',
        background: 'var(--color-surface)',
      }}
    >
      <div style={{ height: '200px', background: 'var(--color-surface-2)', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem' }}>
          {[60, 80, 55].map((w) => (
            <div key={w} style={{ height: '20px', width: `${w}px`, borderRadius: '9999px', background: 'var(--color-surface-2)', animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
        <div style={{ height: '24px', width: '85%', borderRadius: '6px', background: 'var(--color-surface-2)', animation: 'pulse 1.5s ease-in-out infinite', marginBottom: '0.5rem' }} />
        <div style={{ height: '24px', width: '65%', borderRadius: '6px', background: 'var(--color-surface-2)', animation: 'pulse 1.5s ease-in-out infinite', marginBottom: '1rem' }} />
        <div style={{ height: '16px', width: '100%', borderRadius: '4px', background: 'var(--color-surface-2)', animation: 'pulse 1.5s ease-in-out infinite', marginBottom: '0.4rem' }} />
        <div style={{ height: '16px', width: '80%', borderRadius: '4px', background: 'var(--color-surface-2)', animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  )
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

export function PostGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  )
}
