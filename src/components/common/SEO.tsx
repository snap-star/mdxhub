import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router'
import siteConfig from '../../../site.config.json'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  type?: string
}

interface SiteConfig {
  title: string
  titleTemplate: string
  description: string
  siteUrl: string
  defaultImage: string
  twitterUsername: string
}

const config = siteConfig as unknown as SiteConfig

export function SEO({ title, description, image, type = 'website' }: SEOProps) {
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
    </Helmet>
  )
}
