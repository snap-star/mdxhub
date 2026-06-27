import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, parseISO } from 'date-fns'

// ─── Tailwind class merge utility ──────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Slug utilities ────────────────────────────────────────────────────────
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function pathToSlug(filePath: string, base: string): string {
  return filePath
    .replace(base, '')
    .replace(/\/index\.mdx?$/, '')
    .replace(/\.mdx?$/, '')
    .replace(/^\//, '')
}

export function getSlugFilename(slug: string): string {
  return slug.split('/').filter(Boolean).pop() ?? slug
}

export function matchesSlugOrFilename(slug: string, currentSlug: string): boolean {
  return slug === currentSlug || getSlugFilename(slug) === currentSlug
}

const contentAssetModules = import.meta.glob('../../content/**/*.{png,jpg,jpeg,gif,svg,webp}', {
  as: 'url',
  eager: true,
}) as Record<string, string>

const contentAssetMap: Record<string, string> = Object.fromEntries(
  Object.entries(contentAssetModules).map(([filePath, url]) => {
    const normalizedPath = filePath.replace(/\\/g, '/').replace(/^.*\/content\//, '')
    return [normalizedPath, url]
  }),
)

export function resolveContentAssetUrl(currentPath: string, src: string): string | null {
  if (!src || src.startsWith('/') || src.startsWith('http') || src.startsWith('//') || src.startsWith('#')) {
    return null
  }

  if (typeof window === 'undefined') {
    return null
  }

  const currentRoute = currentPath.endsWith('/') ? currentPath : `${currentPath}/`

  // Helper: resolve src relative to a base route, returning a decoded filesystem-like path
  const resolvePath = (baseRoute: string) =>
    decodeURIComponent(
      new URL(src, `${window.location.origin}${baseRoute}`).pathname.replace(/^\//, '')
    )

  // Try 1: resolve relative to the current route (as if the slug is a directory path)
  // Works for index.mdx files in subdirectories where slug = directory path
  const match = contentAssetMap[resolvePath(currentRoute)]
  if (match) return match

  // Try 2: the slug's last segment might be a filename, not a directory.
  // e.g. content/blog/my-post.mdx → URL: /blog/my-post
  // Resolve relative to parent path instead: /blog/
  const parentRoute = currentRoute.replace(/\/[^/]+\/$/, '/')
  if (parentRoute !== currentRoute) {
    const parentMatch = contentAssetMap[resolvePath(parentRoute)]
    if (parentMatch) return parentMatch
  }

  return null
}

// ─── Date utilities ────────────────────────────────────────────────────────
export function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'MMMM d, yyyy')
  } catch {
    return dateStr
  }
}

export function formatDateShort(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'MMM d, yyyy')
  } catch {
    return dateStr
  }
}

export function timeAgo(dateStr: string): string {
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true })
  } catch {
    return dateStr
  }
}

// ─── CC License helpers ────────────────────────────────────────────────────
const CC_LICENSES: Record<string, { label: string; url: string; icon: string }> = {
  'CC-BY-4.0': {
    label: 'Creative Commons Attribution 4.0',
    url: 'https://creativecommons.org/licenses/by/4.0/',
    icon: 'BY',
  },
  'CC-BY-SA-4.0': {
    label: 'Creative Commons Attribution-ShareAlike 4.0',
    url: 'https://creativecommons.org/licenses/by-sa/4.0/',
    icon: 'BY-SA',
  },
  'CC-BY-NC-4.0': {
    label: 'Creative Commons Attribution-NonCommercial 4.0',
    url: 'https://creativecommons.org/licenses/by-nc/4.0/',
    icon: 'BY-NC',
  },
  'CC0-1.0': {
    label: 'Creative Commons Zero (Public Domain)',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    icon: 'CC0',
  },
}

export function getCCLicense(code: string) {
  return CC_LICENSES[code] ?? null
}

// ─── Truncate text ────────────────────────────────────────────────────────
export function truncate(str: string, maxLen = 160): string {
  if (str.length <= maxLen) return str
  return str.slice(0, maxLen).replace(/\s+\S*$/, '') + '…'
}

// ─── Extract headings from rendered HTML string (for ToC) ─────────────────
export interface HeadingItem {
  id: string
  text: string
  level: number
}

export function extractHeadingsFromHtml(html: string): HeadingItem[] {
  // Match any h2/h3 element; id attribute is optional
  const regex = /<h([2-3])([^>]*)>(.*?)<\/h\1>/gi
  const items: HeadingItem[] = []
  let match
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1], 10)
    const attrs = match[2]
    const innerHtml = match[3]
    const text = innerHtml.replace(/<[^>]+>/g, '')
    // Extract id from attributes if present; otherwise generate from text
    const idMatch = attrs.match(/id=["']([^"']+)["']/)
    const id = idMatch ? idMatch[1] : slugify(text)
    items.push({ level, id, text })
  }
  return items
}

// ─── Group array by key ────────────────────────────────────────────────────
export function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
  return arr.reduce(
    (acc, item) => {
      const k = key(item)
      if (!acc[k]) acc[k] = []
      acc[k].push(item)
      return acc
    },
    {} as Record<string, T[]>,
  )
}

export function sortByDate<T extends { frontmatter: { date: string } }>(arr: T[]): T[] {
  return [...arr].sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime(),
  )
}

// ─── Sort posts by order then date desc ────────────────────────────────────
export function sortPosts<T extends { frontmatter: { date: string; order?: number } }>(
  arr: T[]
): T[] {
  return [...arr].sort((a, b) => {
    const aOrder = a.frontmatter.order
    const bOrder = b.frontmatter.order
    // Posts with explicit order come first, sorted by order ascending
    if (aOrder != null && bOrder != null) return aOrder - bOrder
    if (aOrder != null) return -1
    if (bOrder != null) return 1
    // Otherwise sort by date descending
    return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  })
}
