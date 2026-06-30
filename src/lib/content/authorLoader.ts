import type { Author } from '@/lib/content/types'

let authorRegistry: Record<string, Author> | null = null

/**
 * Load the full Author object from the YAML registry on demand.
 * Used by blog post pages to get the complete author profile (bio, social links)
 * for the AuthorCard component in the post footer.
 *
 * Only loads authors.yaml when first called, then caches it.
 */
export async function loadFullAuthor(authorId: string): Promise<Author | null> {
  if (!authorId) return null

  try {
    if (!authorRegistry) {
      const mod = await import('@content/authors/authors.yaml')
      const list = (mod.default ?? []) as unknown as Author[]
      authorRegistry = Object.fromEntries(list.map((a) => [a.id, a]))
    }
    return authorRegistry[authorId] ?? null
  } catch {
    return null
  }
}
