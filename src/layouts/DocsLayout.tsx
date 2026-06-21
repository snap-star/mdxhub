import React from 'react'
import { Outlet, useLocation } from 'react-router'
import { AnimatePresence } from 'framer-motion'
import { PageTransition } from '@/components/transitions/PageTransition'
import { DocsSidebar } from '@/components/docs/DocsSidebar'
import { useNavigationStore } from '@/store/navigationStore'
import '@/styles/docs.css'

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
            top: 64,
            left: 0,
            width: '280px',
            height: 'calc(100vh - 64px)',
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
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </div>
    </div>
  )
}
