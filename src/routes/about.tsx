import React, { Suspense } from 'react'
import { MDXProvider } from '@mdx-js/react'
import { MDXComponents } from '@/components/mdx/MDXComponents'
import { SEO } from '@/components/common/SEO'

// Dynamically import the MDX file for proper code-splitting and client navigation
const AboutContent = React.lazy(() => import('../../content/about.mdx'))

export default function AboutPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <SEO title="About Me" description="Get to know the creator behind this project." />
      <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight mb-6">About</h1>
      <div className="prose dark:prose-invert prose-lg max-w-none">
        <MDXProvider components={MDXComponents}>
          <Suspense fallback={<div className="animate-pulse h-32 bg-muted rounded-md" />}>
            <AboutContent />
          </Suspense>
        </MDXProvider>
      </div>
    </div>
  )
}
