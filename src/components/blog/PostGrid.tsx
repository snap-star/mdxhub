import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PostCard } from './PostCard'
import { PostListView } from './PostListView'
import type { PostIndexEntry } from '@/lib/content/contentIndex'

export type BlogViewMode = 'card' | 'list'

interface PostGridProps {
  posts: PostIndexEntry[]
  viewMode?: BlogViewMode
  emptyMessage?: string
}

const viewVariants = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit:    { opacity: 0, y: -8, scale: 0.97 },
}

export function PostGrid({ posts, viewMode = 'card', emptyMessage = 'No posts found.' }: PostGridProps) {
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
    <div className="relative min-h-[200px]">
      <AnimatePresence mode="wait" initial={false}>
        {viewMode === 'list' ? (
          <motion.div
            key="list"
            variants={viewVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            style={{ willChange: 'opacity, transform' }}
          >
            <PostListView posts={posts} />
          </motion.div>
        ) : (
          <motion.div
            key="card"
            variants={viewVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            style={{ willChange: 'opacity, transform' }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {posts.map((post, i) => (
                <PostCard key={post.slug} post={post} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
