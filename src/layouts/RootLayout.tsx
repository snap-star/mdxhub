import React, { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router'
import { MDXProvider } from '@mdx-js/react'
import { AnimatePresence } from 'framer-motion'
import { useThemeStore } from '@/store/themeStore'
import { useContentStore } from '@/store/contentStore'
import { MDXComponents } from '@/components/mdx/MDXComponents'
import { Navbar } from '@/components/common/Navbar'
import { Footer } from '@/components/common/Footer'
import { SearchCommand } from '@/components/search/SearchCommand'
import { PageTransition } from '@/components/transitions/PageTransition'
import { SEO } from '@/components/common/SEO'
import { ImageLightbox } from '@/components/mdx/ImageLightbox'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'

// ─── Loading skeleton for lazy-loaded routes ──────────────────────────

function PageSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-[50vh] px-4">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    </div>
  )
}

export function RootLayout() {
  const location = useLocation()
  const { resolvedTheme } = useThemeStore()
  const loadContent = useContentStore((s) => s.loadContent)

  // Load all content once on mount
  React.useEffect(() => {
    void loadContent()
  }, [loadContent])

  return (
    <MDXProvider components={MDXComponents}>
      {/* The .dark class is applied to <html> by the themeStore, so all CSS vars resolve correctly.
          We keep it on the root wrapper too for Tailwind dark: variant scoping. */}
      <div className={`${resolvedTheme === 'dark' ? 'dark' : ''} min-h-screen bg-background text-foreground transition-colors duration-300`}>
        <SEO />
        <Navbar />
        <SearchCommand />
        <ErrorBoundary>
          <AnimatePresence mode="wait" initial={false}>
            <PageTransition key={location.pathname.split('/')[1] || 'home'}>
              <Suspense fallback={<PageSkeleton />}>
                <Outlet />
              </Suspense>
            </PageTransition>
          </AnimatePresence>
        </ErrorBoundary>
        <Footer />
        <ImageLightbox />
      </div>
    </MDXProvider>
  )
}
