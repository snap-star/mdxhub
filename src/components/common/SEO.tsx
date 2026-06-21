import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  type?: string
}

const siteConfig = {
  title: 'ReactMDX',
  titleTemplate: '%s | ReactMDX',
  description: 'A blazingly fast documentation and blog platform built with React, Vite, and MDX.',
  siteUrl: 'http://localhost:3000', // Use your production URL here
  defaultImage: '/snap-star.png',
  twitterUsername: '@chigusa',
}

export function SEO({ title, description, image, type = 'website' }: SEOProps) {
  const location = useLocation()
  
  const seoTitle = title ? siteConfig.titleTemplate.replace('%s', title) : siteConfig.title
  const seoDescription = description || siteConfig.description
  
  // Handle absolute image URLs (like Unsplash) vs relative ones (like /snap-star.png)
  const imageToUse = image || siteConfig.defaultImage
  const seoImage = imageToUse.startsWith('http') 
    ? imageToUse 
    : `${siteConfig.siteUrl}${imageToUse}`
    
  const seoUrl = `${siteConfig.siteUrl}${location.pathname}`

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
      <meta name="twitter:creator" content={siteConfig.twitterUsername} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
    </Helmet>
  )
}
