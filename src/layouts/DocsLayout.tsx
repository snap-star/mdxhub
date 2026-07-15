import React, { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { PageTransition } from '@/components/transitions/PageTransition'
import { DocsSidebar } from '@/components/docs/DocsSidebar'
import { useNavigationStore } from '@/store/navigationStore'
import { X } from 'lucide-react'
import '@/styles/docs.css'

function DocsSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-[90vh]">
      <div className="flex flex-col items-center gap-4 transform transition-all duration-300">
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

  // Lock background scroll when the mobile sidebar is open
  React.useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileSidebarOpen])

  // Close on Escape key
  React.useEffect(() => {
    if (!isMobileSidebarOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobileSidebar()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isMobileSidebarOpen, closeMobileSidebar])

  return (
    <div className="docs-theme" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div className="docs-layout">
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

      {/* Mobile sidebar backdrop + drawer — portaled to document.body for reliable fixed positioning */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isMobileSidebarOpen && (
              <>
                {/* Backdrop overlay */}
                <motion.div
                  key="backdrop"
                  className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={closeMobileSidebar}
                />

                {/* Mobile slide-in drawer */}
                <motion.aside
                  key="drawer"
                  className="docs-sidebar-mobile fixed top-0 left-0 z-50 w-[280px] h-dvh flex flex-col"
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                  style={{
                    WebkitOverflowScrolling: 'touch',
                    touchAction: 'pan-y',
                    overscrollBehavior: 'contain',
                  }}
                >
                  {/* Close button (floating top-right) */}
                  <div className="flex justify-end px-3 pt-3 shrink-0">
                    <button
                      onClick={closeMobileSidebar}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      aria-label="Close sidebar"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Sidebar content — DocsSidebar owns its own header */}
                  <div className="flex-1 overflow-y-auto px-3 pb-6">
                    <DocsSidebar />
                  </div>

                  {/* Bottom safe-area spacer */}
                  <div className="h-4 shrink-0" />
                </motion.aside>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  )
}
