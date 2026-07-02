import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router'
import siteConfig from '../../../site.config.json'

interface SiteConfig {
  title: string
  titleTemplate: string
  description: string
  siteUrl: string
  defaultImage: string
  twitterUsername: string
  language?: string
}

const config = siteConfig as unknown as SiteConfig

interface SEOProps {
  title?: string
  description?: string
  image?: string
  type?: string
  /**
   * Optional JSON-LD structured data objects.
   * Each object will be serialized and injected as:
   *   <script type="application/ld+json">{...}</script>
   *
   * Pass the raw objects returned by the builder functions in
   * @/lib/seo/jsonld — they already include '@context' and '@type'.
   */
  jsonLd?: Record<string, unknown>[]
}

export function SEO({ title, description, image, type = 'website', jsonLd }: SEOProps) {
  const location = useLocation()
  
  const seoTitle = title ? config.titleTemplate.replace('%s', title) : config.title
  const seoDescription = description || config.description
  
  // Handle absolute image URLs (like Unsplash) vs relative ones (like /snap-star.png)
  const imageToUse = image || config.defaultImage
  const seoImage = imageToUse.startsWith('http') 
    ? imageToUse 
    : `${config.siteUrl}${imageToUse}`
    
  const seoUrl = `${config.siteUrl}${location.pathname}`

  return (
    <Helmet>
      {/* Basic HTML Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <link rel="canonical" href={seoUrl} />

      {/* OpenGraph Tags */}
      <meta property="og:url" content={seoUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />

      {/* Twitter Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={config.twitterUsername} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />

      {/* JSON-LD Structured Data */}
      {jsonLd?.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}
