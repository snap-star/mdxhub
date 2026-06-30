import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import Fuse from 'fuse.js'
import type { MDXBlogModule, MDXDocModule, SearchResult } from '@/lib/content/types'
import type { PostIndexEntry, DocIndexEntry } from '@/lib/content/contentIndex'
import { loadContentIndex, loadSlugMap } from '@/lib/content/contentIndex'
import { matchesSlugOrFilename } from '@/lib/utils'

// ─── Glob imports (kept for lazy per-route loading) ────────────────────────
const blogModules = import.meta.glob<MDXBlogModule>('/content/blog/**/*.{md,mdx}')
const docModules = import.meta.glob<MDXDocModule>('/content/docs/**/*.{md,mdx}')

// ─── Store State ──────────────────────────────────────────────────────────

interface ContentStore {
  // Metadata index (loaded eagerly — lightweight JSON)
  posts: PostIndexEntry[]
  docs: DocIndexEntry[]

  // Lazy-loaded component caches
  _blogComponentCache: Record<string, React.ComponentType>
  _docComponentCache: Record<string, React.ComponentType>

  // Search
  fuseIndex: Fuse<SearchResult> | null

  // Status
  status: 'idle' | 'loading' | 'loaded' | 'error'
  error: string | null

  // Actions
  loadContent: () => Promise<void>
  loadPostComponent: (slug: string) => Promise<React.ComponentType | null>
  loadDocComponent: (slug: string) => Promise<React.ComponentType | null>

  // Derived helpers
  getPostBySlug: (slug: string) => PostIndexEntry | undefined
  getDocBySlug: (slug: string) => DocIndexEntry | undefined
  getPostsByCategory: (category: string) => PostIndexEntry[]
  getPostsByTag: (tag: string) => PostIndexEntry[]
  getAllCategories: () => string[]
  getAllTags: () => string[]
  getDocsBySection: (section: string) => DocIndexEntry[]
  search: (query: string) => SearchResult[]
}

export const useContentStore = create<ContentStore>((set, get) => ({
  posts: [],
  docs: [],
  _blogComponentCache: {},
  _docComponentCache: {},
  fuseIndex: null,
  status: 'idle',
  error: null,

  loadContent: async () => {
    if (get().status === 'loaded' || get().status === 'loading') return
    set({ status: 'loading' })
    try {
      // Load the lightweight content index (metadata only — no MDX components)
      const index = await loadContentIndex()

      // Sort posts: by order ascending, then by date descending
      const publishedPosts = index.posts
        .filter((p) => !p.draft)
        .sort((a, b) => {
          // Posts with explicit order come first
          if (a.order != null && b.order != null) return a.order - b.order
          if (a.order != null) return -1
          if (b.order != null) return 1
          // Otherwise sort by date descending
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
      const publishedDocs = index.docs
        .filter((d) => !d.draft)
        .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

      // Build Fuse.js search index from metadata
      const searchData: SearchResult[] = [
        ...publishedPosts.map((p) => ({
          type: 'blog' as const,
          slug: p.slug,
          title: p.title,
          description: p.description,
          category: p.category,
          tags: p.tags,
        })),
        ...publishedDocs.map((d) => ({
          type: 'doc' as const,
          slug: d.slug,
          title: d.title,
          description: d.description,
          section: d.section,
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

  loadPostComponent: async (slug: string): Promise<React.ComponentType | null> => {
    const cache = get()._blogComponentCache
    if (cache[slug]) return cache[slug]

    try {
      const slugMap = await loadSlugMap()
      const filePath = slugMap.blog[slug]
      if (!filePath) {
        // Try matching by filename
        const entry = Object.entries(slugMap.blog).find(([, fp]) => fp.endsWith(`/${slug}.mdx`) || fp.endsWith(`/${slug}.md`))
        if (!entry) return null
        const matchedFilePath = entry[1]
        if (matchedFilePath in blogModules) {
          const mod = await blogModules[matchedFilePath]() as MDXBlogModule
          cache[slug] = mod.default
          set({ _blogComponentCache: { ...cache } })
          return mod.default
        }
        return null
      }
      if (filePath in blogModules) {
        const mod = await blogModules[filePath]() as MDXBlogModule
        cache[slug] = mod.default
        set({ _blogComponentCache: { ...cache } })
        return mod.default
      }
      return null
    } catch (err) {
      console.error(`[ContentStore] Failed to load blog component for "${slug}":`, err)
      return null
    }
  },

  loadDocComponent: async (slug: string): Promise<React.ComponentType | null> => {
    const cache = get()._docComponentCache
    if (cache[slug]) return cache[slug]

    try {
      const slugMap = await loadSlugMap()
      const filePath = slugMap.docs[slug]
      if (!filePath) return null
      if (filePath in docModules) {
        const mod = await docModules[filePath]() as MDXDocModule
        cache[slug] = mod.default
        set({ _docComponentCache: { ...cache } })
        return mod.default
      }
      return null
    } catch (err) {
      console.error(`[ContentStore] Failed to load doc component for "${slug}":`, err)
      return null
    }
  },

  getPostBySlug: (slug) => get().posts.find((p) => matchesSlugOrFilename(p.slug, slug)),
  getDocBySlug: (slug) => get().docs.find((d) => d.slug === slug),
  getPostsByCategory: (category) =>
    get().posts.filter((p) => p.category === category),
  getPostsByTag: (tag) =>
    get().posts.filter((p) => p.tags.includes(tag)),
  getAllCategories: () => [...new Set(get().posts.map((p) => p.category))],
  getAllTags: () => [...new Set(get().posts.flatMap((p) => p.tags))],
  getDocsBySection: (section) => get().docs.filter((d) => d.sectionSlug === section),
  search: (query) => {
    if (!query.trim()) return []
    return get().fuseIndex?.search(query).map((r) => r.item) ?? []
  },
}))

// ─── Selector hooks ────────────────────────────────────────────────────────
export const useAllPosts = () =>
  useContentStore(useShallow((s) => s.posts))

export const useFeaturedPosts = () =>
  useContentStore(useShallow((s) => s.posts.filter((p) => p.featured)))

export const useAllDocs = () =>
  useContentStore(useShallow((s) => s.docs))

export const useContentStatus = () =>
  useContentStore((s) => s.status)
