import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import Fuse from 'fuse.js'
import type { BlogPost, DocPage, Author, MDXBlogModule, MDXDocModule, SearchResult } from '@/lib/content/types'
import { pathToSlug, estimateReadingTime } from '@/lib/utils'

// ─── Author registry (loaded from YAML via import) ─────────────────────────
let authorRegistry: Record<string, Author> = {}

async function loadAuthors(): Promise<Record<string, Author>> {
  try {
    const mod = await import('@content/authors/authors.yaml')
    const list: Author[] = mod.default ?? []
    return Object.fromEntries(list.map((a) => [a.id, a]))
  } catch {
    return {}
  }
}

// ─── Glob imports ──────────────────────────────────────────────────────────
const blogModules = import.meta.glob<MDXBlogModule>('/content/blog/**/*.mdx')
const docModules = import.meta.glob<MDXDocModule>('/content/docs/**/*.mdx')

// ─── Store State ──────────────────────────────────────────────────────────
interface ContentStore {
  posts: BlogPost[]
  docs: DocPage[]
  fuseIndex: Fuse<SearchResult> | null
  status: 'idle' | 'loading' | 'loaded' | 'error'
  error: string | null
  loadContent: () => Promise<void>
  getPostBySlug: (slug: string) => BlogPost | undefined
  getDocBySlug: (slug: string) => DocPage | undefined
  getPostsByCategory: (category: string) => BlogPost[]
  getPostsByTag: (tag: string) => BlogPost[]
  getAllCategories: () => string[]
  getAllTags: () => string[]
  getDocsBySection: (section: string) => DocPage[]
  search: (query: string) => SearchResult[]
}

export const useContentStore = create<ContentStore>((set, get) => ({
  posts: [],
  docs: [],
  fuseIndex: null,
  status: 'idle',
  error: null,

  loadContent: async () => {
    if (get().status === 'loaded' || get().status === 'loading') return
    set({ status: 'loading' })
    try {
      authorRegistry = await loadAuthors()

      // Load blog posts
      const posts: BlogPost[] = await Promise.all(
        Object.entries(blogModules).map(async ([filePath, loader]) => {
          const mod = await loader()
          const slug = pathToSlug(filePath, '/content/blog')
          const author = authorRegistry[mod.frontmatter.author] ?? null
          const readingTime =
            mod.frontmatter.readingTime ?? estimateReadingTime(slug)
          return {
            slug,
            frontmatter: mod.frontmatter,
            author,
            readingTime,
            Component: mod.default,
          }
        }),
      )

      // Load docs
      const docs: DocPage[] = await Promise.all(
        Object.entries(docModules).map(async ([filePath, loader]) => {
          const mod = await loader()
          const slug = pathToSlug(filePath, '/content/docs')
          const parts = slug.split('/')
          const sectionSlug = parts[0] ?? ''
          return {
            slug,
            section: mod.frontmatter.section,
            sectionSlug,
            frontmatter: mod.frontmatter,
            Component: mod.default,
          }
        }),
      )

      // Sort posts by date descending, filter drafts
      const publishedPosts = posts
        .filter((p) => !p.frontmatter.draft)
        .sort(
          (a, b) =>
            new Date(b.frontmatter.date).getTime() -
            new Date(a.frontmatter.date).getTime(),
        )

      const publishedDocs = docs
        .filter((d) => !d.frontmatter.draft)
        .sort((a, b) => (a.frontmatter.order ?? 99) - (b.frontmatter.order ?? 99))

      // Build Fuse.js search index
      const searchData: SearchResult[] = [
        ...publishedPosts.map((p) => ({
          type: 'blog' as const,
          slug: p.slug,
          title: p.frontmatter.title,
          description: p.frontmatter.description,
          category: p.frontmatter.category,
          tags: p.frontmatter.tags,
        })),
        ...publishedDocs.map((d) => ({
          type: 'doc' as const,
          slug: d.slug,
          title: d.frontmatter.title,
          description: d.frontmatter.description,
          section: d.frontmatter.section,
        })),
      ]

      const fuseIndex = new Fuse(searchData, {
        keys: [
          { name: 'title', weight: 0.5 },
          { name: 'description', weight: 0.3 },
          { name: 'tags', weight: 0.1 },
          { name: 'category', weight: 0.05 },
          { name: 'section', weight: 0.05 },
        ],
        threshold: 0.35,
        includeScore: true,
        ignoreLocation: true,
      })

      set({ posts: publishedPosts, docs: publishedDocs, fuseIndex, status: 'loaded' })
    } catch (err) {
      set({ status: 'error', error: String(err) })
    }
  },

  getPostBySlug: (slug) => get().posts.find((p) => p.slug === slug),
  getDocBySlug: (slug) => get().docs.find((d) => d.slug === slug),
  getPostsByCategory: (category) =>
    get().posts.filter((p) => p.frontmatter.category === category),
  getPostsByTag: (tag) =>
    get().posts.filter((p) => p.frontmatter.tags.includes(tag)),
  getAllCategories: () => [...new Set(get().posts.map((p) => p.frontmatter.category))],
  getAllTags: () => [...new Set(get().posts.flatMap((p) => p.frontmatter.tags))],
  getDocsBySection: (section) => get().docs.filter((d) => d.sectionSlug === section),
  search: (query) => {
    if (!query.trim()) return []
    return get().fuseIndex?.search(query).map((r) => r.item) ?? []
  },
}))

// ─── Selector hooks ────────────────────────────────────────────────────────
export const useAllPosts = () =>
  useContentStore(useShallow((s) => s.posts))

export const useAllDocs = () =>
  useContentStore(useShallow((s) => s.docs))

export const useContentStatus = () =>
  useContentStore((s) => s.status)
