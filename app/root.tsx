/* eslint-disable react-refresh/only-export-components */

import React, { Suspense } from 'react'
import { Links, Outlet, Scripts, ScrollRestoration, useLoaderData } from 'react-router'
import { MDXProvider } from '@mdx-js/react'
import { useThemeStore } from '@/store/themeStore'
import { useContentStore } from '@/store/contentStore'
import { MDXComponents } from '@/components/mdx/MDXComponents'
import { Navbar } from '@/components/common/Navbar'
import { Footer } from '@/components/common/Footer'
import { SearchCommand } from '@/components/search/SearchCommand'
import { SEO } from '@/components/common/SEO'
import { webSiteJsonLd } from '@/lib/seo/jsonld'
import siteConfig from '../site.config.json'
import { ImageLightbox } from '@/components/mdx/ImageLightbox'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { initAnalytics } from '@/lib/analytics'
import { readFileSync } from 'fs'
import { join } from 'path'
import type { ContentIndex } from '@/lib/content/contentIndex'
const rootConfig = siteConfig as unknown as { siteUrl: string }

export function loader() {
  try {
    const indexPath = join(process.cwd(), "public", "content-index.json")
    const raw = readFileSync(indexPath, "utf-8")
    return JSON.parse(raw) as ContentIndex
  } catch {
    return { generatedAt: '', posts: [], docs: [] } as ContentIndex
  }
}

export function HydrateFallback() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Links />
      </head>
      <body style={{ minHeight: '100vh', backgroundColor: '#fafafa', color: '#111' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '2rem', height: '2rem', border: '4px solid #d4d4d8', borderTopColor: '#18181b', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontSize: '0.875rem', color: '#71717a' }}>Loading MDXHub…</p>
          </div>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <Scripts />
      </body>
    </html>
  )
}

export default function Root() {
  const { resolvedTheme } = useThemeStore()
  const contentData = useLoaderData() as ContentIndex
  const loadContent = useContentStore((s) => s.loadContent)
  const status = useContentStore((s) => s.status)

  React.useEffect(() => {
    if (status === 'idle') {
      void loadContent(contentData)
    }
    initAnalytics()
  }, [loadContent, contentData, status])

  const globalJsonLd = React.useMemo(() => [
    webSiteJsonLd({
      siteUrl: rootConfig.siteUrl,
      siteName: 'MDXHub',
      description: 'A blazingly fast documentation and blog platform built with React, Vite, and MDX.',
      searchUrl: `${rootConfig.siteUrl}/search?q={search_term_string}`,
    }),
  ], [])

  return (
    <html lang="en" className={resolvedTheme === 'dark' ? 'dark' : ''}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Links />
      </head>
      <body className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <MDXProvider components={MDXComponents}>
            <SEO jsonLd={globalJsonLd} />
            <Navbar />
            <SearchCommand />
            <ErrorBoundary>
              <Suspense fallback={<LoadingSkeleton />}>
                <Outlet />
              </Suspense>
            </ErrorBoundary>
            <Footer />
            <ImageLightbox />
          </MDXProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
