import React, { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router'
import { AnimatePresence } from 'framer-motion'
import { PageTransition } from '@/components/transitions/PageTransition'
import { DocsSidebar } from '@/components/docs/DocsSidebar'
import { useNavigationStore } from '@/store/navigationStore'
import '@/styles/docs.css'

function DocsSkeleton() {
  return (
    <div className="docs-content-wrapper flex items-center justify-center min-h-[40vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading docs…</p>
      </div>
    </div>
  )
}

export function DocsLayout() {
  const location = useLocation()
  const isMobileSidebarOpen = useNavigationStore((s) => s.isMobileSidebarOpen)
  const closeMobileSidebar = useNavigationStore((s) => s.closeMobileSidebar)

  return (
    <div className="docs-theme" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div className="docs-layout">
        {/* Mobile sidebar overlay backdrop */}
        {isMobileSidebarOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'oklch(0% 0 0 / 0.5)',
              zIndex: 40,
              backdropFilter: 'blur(4px)',
            }}
            onClick={closeMobileSidebar}
          />
        )}

        {/* Mobile slide-in drawer */}
        <aside
          className="docs-sidebar-mobile"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '280px',
            height: '100%',
            zIndex: 50,
            overflowY: 'auto',
            transform: isMobileSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <DocsSidebar />
        </aside>

        {/* Desktop sidebar — hidden on mobile via CSS */}
        <aside className="docs-sidebar" style={{ zIndex: 30 }}>
          <DocsSidebar />
        </aside>

        {/* Main content via Outlet */}
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={location.pathname} className="docs-content-wrapper">
            <Suspense fallback={<DocsSkeleton />}>
              <Outlet />
            </Suspense>
          </PageTransition>
        </AnimatePresence>
      </div>
    </div>
  )
}
