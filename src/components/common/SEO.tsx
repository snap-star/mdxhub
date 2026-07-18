import { useLocation } from 'react-router'
import siteConfig from '../../../site.config.json'

const config = siteConfig as unknown as {
  title: string
  titleTemplate: string
  description: string
  siteUrl: string
  defaultImage: string
  twitterUsername: string
}

export function SEO({ title, description, image, type = 'website', jsonLd }: {
  title?: string
  description?: string
  image?: string
  type?: string
  jsonLd?: Record<string, unknown>[]
}) {
  const location = useLocation()

  const seoTitle = title ? config.titleTemplate.replace('%s', title) : config.title
  const seoDescription = description || config.description
  const imageToUse = image || config.defaultImage
  const seoImage = imageToUse.startsWith('http') ? imageToUse : `${config.siteUrl}${imageToUse}`
  const seoUrl = `${config.siteUrl}${location.pathname}`

  return (
    <>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <link rel="canonical" href={seoUrl} />
      <meta name="google-site-verification" content="QoAd40PR75smu3_H0yQsQkO4mKqKgVWbBmKpN5pR4ec" />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={config.twitterUsername} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      {jsonLd?.map((schema, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(schema)}</script>
      ))}
    </>
  )
}
