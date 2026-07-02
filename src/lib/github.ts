import { loadSlugMap } from '@/lib/content/contentIndex'

/**
 * Resolve the GitHub "edit on" URL for a given content slug.
 *
 * Uses the slug map (fetched at runtime, cached in memory) to find the
 * exact file path, then constructs a URL to edit that file on GitHub.
 *
 * @param slug      Content slug (e.g. "advanced-mdx-features", "2-guides/installation")
 * @param type      Content type — "blog" or "docs"
 * @param repoBase  GitHub repository base URL (e.g. "https://github.com/snap-star/mdxhub")
 * @returns         Full GitHub edit URL, or null if the slug isn't found
 */
export async function getGitHubEditUrl(
  slug: string,
  type: 'blog' | 'docs',
  repoBase: string,
): Promise<string | null> {
  if (!slug || !repoBase) return null

  try {
    const slugMap = await loadSlugMap()
    const filePath = slugMap[type][slug]
    if (!filePath) return null

    return `${repoBase.replace(/\/+$/, '')}/blob/master${filePath}`
  } catch {
    return null
  }
}
