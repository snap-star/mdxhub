// ─── Translation Store Loader ────────────────────────────────────────────

import type { TranslationValue } from '@/store/translationStore'
import type { PostIndexEntry, DocIndexEntry } from '@/lib/content/contentIndex'
import { useContentStore } from '@/store/contentStore'

/**
 * Cache for translated content chunks to avoid re-translating the same slugs
 * Key: "blog/slug", "docs/slug" → Value: { original, translated }
 */
const translationCache: Map<string, {
  original: any,
  translated: any,
  timestamp: number
}> = new Map()

const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

/**
 * Load translated MDX content for a given slug and locale.
 * 
 * Uses a two-step process:
 * 1. Fetch original MDX content via the current slug
 * 2. Fetch cached translation (if expired) or generate new translation via API
 * 
 * This is similar to how loadFullAuthor works but for content translation.
 */
export async function loadTranslatedContent(
  slug: string,
  contentType: 'blog' | 'doc',
  locale: string
): Promise<{ original: React.ComponentType, translated: React.ComponentType }> {
  const cacheKey = `${contentType}/${slug}`
  const cached = translationCache.get(cacheKey)
  const now = Date.now()

  if (cached && (now - cached.timestamp < CACHE_TTL)) {
    return {
      original: cached.original,
      translated: cached.translated,
    }
  }

  try {
    // Step 1: Load original MDX content
    const originalSlug = slug
    const originalPromise = contentType === 'blog'
      ? useContentStore.getState().loadPostComponent(originalSlug)
      : useContentStore.getState().loadDocComponent(originalSlug)
    
    const original = await originalPromise
    if (!original) {
      throw new Error(`Original content not found: ${contentType}/${slug}")
    }

    // Step 2: Translate the content
    let translated = original

    // Only translate if locale is not English (default)
    if (locale !== 'en') {
      const translation = await translateContent(
        await getContentMetadata(contentType, slug),
        { locale }
      )

      if (translation.translated && translation.translated !== translation.original) {
        translated = await loadTranslatedComponent(translation.translated, contentType, slug)
      }
    }

    // Update cache
    translationCache.set(cacheKey, {
      original,
      translated,
      timestamp: now,
    })

    return { original, translated }
  } catch (err) {
    console.error(
      `[TranslationLoader] Failed to load translated content "${contentType}/${slug}" for locale "${locale}:", ${err}`
    )
    // Fallback to original content
    const fallbackOriginal = contentType === 'blog'
      ? await useContentStore.getState().loadPostComponent(slug)
      : await useContentStore.getState().loadDocComponent(slug)
    return {
      original: fallbackOriginal ?? (() => null),
      translated: fallbackOriginal ?? (() => null),
    }
  }
}

/**
 * Get content metadata for translation (title, description, body text)
 */
async function getContentMetadata(
  contentType: 'blog' | 'doc',
  slug: string
): Promise<{ title: string; description: string; body: string }> {
  const store = useContentStore.getState()
  const allContent = contentType === 'blog' ? store.posts : store.docs
  const item = allContent.find(item =>
    contentType === 'blog'
      ? (item as PostIndexEntry).slug === slug
      : (item as DocIndexEntry).slug === slug
  )

  if (!item) {
    return { title: '', description: '', body: '' }
  }

  // TODO: Extract actual content body from MDX module
  // This is a placeholder that should read the MDX file's content
  return {
    title: (item as PostIndexEntry).title || (item as DocIndexEntry).title,
    description: item.description || '',
    body: '[MDX content would be extracted here]',
  }
}

/**
 * Load a translated MDX component from the translation API
 * This would need actual translation API integration
 */
async function loadTranslatedComponent(
  translatedContent: any,
  contentType: 'blog' | 'doc',
  slug: string
): Promise<React.ComponentType> {
  // For now, return the original component
  // This is where we would integrate with a real translation service
  console.log(
    `[TranslationLoader] Would load translated component for "${contentType}/${slug}"`
  )
  return (props) => (
    <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
      <p className="text-sm text-yellow-800 dark:text-yellow-200">
        <strong>Translation Pending:</strong> Content for {contentType} "{slug}" would be shown here when translation service is configured.
      </p>
    </div>
  )
}