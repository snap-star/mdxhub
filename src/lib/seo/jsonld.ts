// ─── JSON-LD Structured Data Builders ─────────────────────────────────
//
// These functions return plain objects that can be serialized to JSON-LD
// <script type="application/ld+json"> tags via the SEO component.
//
// Schemas implemented:
//   - WebSite     (global — injected in RootLayout)
//   - Article     (blog posts)
//   - TechArticle (docs pages)
//   - BreadcrumbList (pages with breadcrumbs)
//   - Person      (about page)

// ─── Types ────────────────────────────────────────────────────────────

export interface JsonLdAuthor {
  '@type': 'Person'
  name: string
  url?: string
}

export interface JsonLdImage {
  '@type': 'ImageObject'
  url: string
  width?: number
  height?: number
}

export interface JsonLdBreadcrumbItem {
  label: string
  href?: string
}

// ─── Configuration ────────────────────────────────────────────────────

// We compute the site URL lazily because it depends on site.config.json,
// which is imported in the SEO component anyway.
// The builders accept siteUrl as a parameter to stay pure.

// ─── WebSite ─────────────────────────────────────────────────────────

export function webSiteJsonLd({
  siteUrl,
  siteName,
  description,
  searchUrl,
}: {
  siteUrl: string
  siteName: string
  description?: string
  /** e.g. "https://example.com/search?q={search_term_string}" */
  searchUrl?: string
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
  }

  if (description) {
    schema.description = description
  }

  if (searchUrl) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: searchUrl,
      },
      'query-input': 'required name=search_term_string',
    }
  }

  return schema
}

// ─── Article (blog posts) ────────────────────────────────────────────

export function articleJsonLd({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName,
  authorUrl,
  publisherName,
  publisherLogo,
}: {
  title: string
  description?: string
  url: string
  image?: string
  datePublished: string
  dateModified?: string
  authorName: string
  authorUrl?: string
  publisherName: string
  publisherLogo?: string
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    url,
    datePublished,
    author: {
      '@type': 'Person',
      name: authorName,
      ...(authorUrl ? { url: authorUrl } : {}),
    },
    publisher: {
      '@type': 'Organization',
      name: publisherName,
      ...(publisherLogo
        ? { logo: { '@type': 'ImageObject', url: publisherLogo } }
        : {}),
    },
  }

  if (description) schema.description = description
  if (image) schema.image = image
  if (dateModified) schema.dateModified = dateModified

  return schema
}

// ─── TechArticle (docs pages) ────────────────────────────────────────

export function techArticleJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  authorName,
  authorUrl,
  publisherName,
  proficiencyLevel,
  dependencies,
}: {
  title: string
  description?: string
  url: string
  datePublished?: string
  dateModified?: string
  authorName: string
  authorUrl?: string
  publisherName: string
  proficiencyLevel?: string
  dependencies?: string
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    url,
    author: {
      '@type': 'Person',
      name: authorName,
      ...(authorUrl ? { url: authorUrl } : {}),
    },
    publisher: {
      '@type': 'Organization',
      name: publisherName,
    },
  }

  if (description) schema.description = description
  if (datePublished) schema.datePublished = datePublished
  if (dateModified) schema.dateModified = dateModified
  if (proficiencyLevel) schema.proficiencyLevel = proficiencyLevel
  if (dependencies) schema.dependencies = dependencies

  return schema
}

// ─── BreadcrumbList ──────────────────────────────────────────────────

export function breadcrumbListJsonLd({
  siteUrl,
  itemListElement,
}: {
  siteUrl: string
  itemListElement: JsonLdBreadcrumbItem[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: itemListElement.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${siteUrl}${item.href}` } : {}),
    })),
  }
}

// ─── Person (author / about page) ────────────────────────────────────

export function personJsonLd({
  name,
  url,
  image,
  jobTitle,
  description,
  sameAs,
}: {
  name: string
  url?: string
  image?: string
  jobTitle?: string
  description?: string
  sameAs?: string[]
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
  }

  if (url) schema.url = url
  if (image) schema.image = image
  if (jobTitle) schema.jobTitle = jobTitle
  if (description) schema.description = description
  if (sameAs && sameAs.length > 0) schema.sameAs = sameAs

  return schema
}
