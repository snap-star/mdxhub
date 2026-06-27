import React from 'react'
import { contentAssetMap } from '@/lib/utils'

// ─── Helpers ──────────────────────────────────────────────────────────────

/** Supported image formats for the <picture> element */
type ImageFormat = 'avif' | 'webp' | 'png' | 'jpeg'

/** Map from extension to MIME type */
const MIME_TYPES: Record<string, string> = {
  avif: 'image/avif',
  webp: 'image/webp',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
}

/** Check if a URL is an external resource (http/https/data) */
function isExternal(src: string): boolean {
  return /^https?:\/\//.test(src) || src.startsWith('//') || src.startsWith('data:')
}

/** Check if a URL looks like a Vite-hashed asset (contains a hash pattern) */
function isHashedAsset(src: string): boolean {
  return /[.-][a-f0-9]{8,}\.(png|jpe?g|webp|avif)$/i.test(src)
}

/**
 * Derive alternative-format URLs from the original image src.
 *
 * Strategy (first match wins):
 * 1. If the src is from the content asset map, look up variants by their content path
 * 2. Otherwise, replace the file extension (works for unhashed URLs, e.g. route-based paths)
 * 3. For external / hashed URLs that have no map entry, return only the original
 */
function getFormatSrcs(
  src: string,
  /** Optional filesystem-style path for content asset map lookups */
  contentPath?: string,
): { original: string; webp?: string; avif?: string } {
  const result: { original: string; webp?: string; avif?: string } = { original: src }

  if (!src || isExternal(src)) return result

  // Strategy 1: look up from the content asset map if we have a content path
  if (contentPath && contentAssetMap) {
    const basePath = contentPath.replace(/\.\w+$/, '')
    const webpUrl = contentAssetMap[`${basePath}.webp`]
    const avifUrl = contentAssetMap[`${basePath}.avif`]
    if (webpUrl || avifUrl) {
      if (webpUrl) result.webp = webpUrl
      if (avifUrl) result.avif = avifUrl
      return result
    }
  }

  // Strategy 2: extension replacement (works for unhashed URLs)
  if (!isHashedAsset(src)) {
    const basePath = src.replace(/\.\w+$/, '')
    result.webp = `${basePath}.webp`
    result.avif = `${basePath}.avif`
  }

  return result
}

// ─── Props ────────────────────────────────────────────────────────────────

interface OptimizedImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  /** Original image source */
  src: string
  /** Optional filesystem content path (e.g. "blog/image.png") for asset map lookups */
  contentPath?: string
  /** Additional class names for the inner <img> element */
  imgClassName?: string
  /** Whether to wrap in a <picture> element (default true) */
  usePicture?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────

export function OptimizedImage({
  src,
  contentPath,
  imgClassName,
  usePicture = true,
  alt = '',
  className,
  ...imgProps
}: OptimizedImageProps) {
  const srcs = React.useMemo(() => getFormatSrcs(src, contentPath), [src, contentPath])
  const hasVariants = !!(srcs.webp || srcs.avif)

  const imgElement = (
    <img
      src={srcs.original}
      alt={alt}
      className={imgClassName}
      loading="lazy"
      decoding="async"
      {...imgProps}
    />
  )

  if (!usePicture || !hasVariants) {
    return className ? <span className={className}>{imgElement}</span> : imgElement
  }

  return (
    <picture className={className}>
      {srcs.avif && <source srcSet={srcs.avif} type={MIME_TYPES.avif} />}
      {srcs.webp && <source srcSet={srcs.webp} type={MIME_TYPES.webp} />}
      {imgElement}
    </picture>
  )
}
