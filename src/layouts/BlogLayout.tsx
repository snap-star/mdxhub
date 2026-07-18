import React, { Suspense } from 'react'
import { Outlet } from 'react-router'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import '@/styles/blog.css'

export default function BlogLayout() {
  return (
    <div className="blog-theme" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <Suspense fallback={<LoadingSkeleton minHeight="90vh" />}>
        <Outlet />
      </Suspense>
    </div>
  )
}
