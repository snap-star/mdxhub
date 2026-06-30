// ─── Content Index Types ──────────────────────────────────────────────
//
// These types mirror the JSON structure emitted by
// scripts/generate-content-index.cjs at build time.
//
// The index is loaded eagerly (it's small — just strings/numbers),
// while actual MDX components are lazy-imported per route.

export interface PostIndexEntry {
  slug: string
  title: string
  description: string
  date: string
  author: string
  /** Resolved author display name from YAML, or the author ID as fallback */
  authorName: string
  /** Resolved author avatar URL from YAML, or empty string */
  authorAvatar: string
  category: string
  tags: string[]
  draft: boolean
  featured: boolean
  coverImage: string
  readingTime: number
  comments: boolean
  series: string
  seriesOrder: number
  cc: string
  lastEdited: string
  updatedAt: string
  order?: number
}

export interface DocIndexEntry {
  slug: string
  title: string
  description: string
  section: string
  sectionSlug: string
  order: number
  draft: boolean
  toc: boolean
  version: string
}

export interface ContentIndex {
  generatedAt: string
  posts: PostIndexEntry[]
  docs: DocIndexEntry[]
}

export interface SlugMap {
  blog: Record<string, string>
  docs: Record<string, string>
}

// ─── Loader ───────────────────────────────────────────────────────────

let cachedIndex: ContentIndex | null = null
let cachedSlugMap: SlugMap | null = null

/**
 * Fetch the content index JSON manifest.
 * This is fetched at runtime but cached after first load.
 * The JSON is tiny (a few KB) compared to loading all MDX modules.
 */
export async function loadContentIndex(): Promise<ContentIndex> {
  if (cachedIndex) return cachedIndex

  try {
    const res = await fetch('/content-index.json')
    if (!res.ok) {
      throw new Error(`Failed to load content index: ${res.status}`)
    }
    cachedIndex = (await res.json()) as ContentIndex
    return cachedIndex
  } catch (err) {
    console.error('[ContentIndex] Failed to load content index:', err)
    // Return empty index as fallback
    return { generatedAt: '', posts: [], docs: [] }
  }
}

/**
 * Load the slug→filepath map for lazy MDX imports.
 */
export async function loadSlugMap(): Promise<SlugMap> {
  if (cachedSlugMap) return cachedSlugMap

  try {
    const res = await fetch('/content-slug-map.json')
    if (!res.ok) {
      throw new Error(`Failed to load slug map: ${res.status}`)
    }
    cachedSlugMap = (await res.json()) as SlugMap
    return cachedSlugMap
  } catch (err) {
    console.error('[ContentIndex] Failed to load slug map:', err)
    return { blog: {}, docs: {} }
  }
}


