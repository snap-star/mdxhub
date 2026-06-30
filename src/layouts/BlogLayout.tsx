import React, { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router'
import { AnimatePresence } from 'framer-motion'
import { PageTransition } from '@/components/transitions/PageTransition'
import '@/styles/blog.css'

function BlogSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    </div>
  )
}

export function BlogLayout() {
  const location = useLocation()
  return (
    <div className="blog-theme" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <AnimatePresence mode="wait" initial={false}>
        <PageTransition key={location.pathname}>
          <Suspense fallback={<BlogSkeleton />}>
            <Outlet />
          </Suspense>
        </PageTransition>
      </AnimatePresence>
    </div>
  )
}
