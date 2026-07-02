import React, { Suspense } from 'react'
import { MDXProvider } from '@mdx-js/react'
import { MDXComponents } from '@/components/mdx/MDXComponents'
import { SEO } from '@/components/common/SEO'
import { personJsonLd } from '@/lib/seo/jsonld'
import siteConfig from '../../site.config.json'

// Dynamically import the MDX file for proper code-splitting and client navigation
const AboutContent = React.lazy(() => import('../../content/about.mdx'))

const aboutConfig = siteConfig as unknown as {
  siteUrl: string
  profile?: {
    name: string
    avatar: string
    title: string
    bio: string
    github?: string
    twitter?: string
    discord?: string
    email?: string
  }
}

export default function AboutPage() {
  const profile = aboutConfig.profile

  const personJsonLdData = React.useMemo(() => {
    if (!profile) return undefined
    const sameAs: string[] = []
    if (profile.github) sameAs.push(`https://github.com/${profile.github}`)
    if (profile.twitter) sameAs.push(`https://x.com/${profile.twitter}`)
    if (profile.email) sameAs.push(`mailto:${profile.email}`)

    return personJsonLd({
      name: profile.name,
      url: aboutConfig.siteUrl,
      image: `${aboutConfig.siteUrl}${profile.avatar}`,
      jobTitle: profile.title,
      description: profile.bio,
      sameAs: sameAs.length > 0 ? sameAs : undefined,
    })
  }, [profile])

  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <SEO 
        title="About Me" 
        description="Get to know the creator behind this project."
        jsonLd={personJsonLdData ? [personJsonLdData] : undefined}
      />
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
