import React from 'react'
import { Outlet, useLocation } from 'react-router'
import { AnimatePresence } from 'framer-motion'
import { PageTransition } from '@/components/transitions/PageTransition'
import '@/styles/blog.css'

export function BlogLayout() {
  const location = useLocation()
  return (
    <div className="blog-theme" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <AnimatePresence mode="wait" initial={false}>
        <PageTransition key={location.pathname}>
          <Outlet />
        </PageTransition>
      </AnimatePresence>
    </div>
  )
}
