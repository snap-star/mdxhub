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

// ─── Reading time estimator ────────────────────────────────────────────────
export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
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
  const regex = /<h([2-3])[^>]+id="([^"]+)"[^>]*>(.*?)<\/h\1>/gi
  const items: HeadingItem[] = []
  let match
  while ((match = regex.exec(html)) !== null) {
    items.push({
      level: parseInt(match[1], 10),
      id: match[2],
      text: match[3].replace(/<[^>]+>/g, ''),
    })
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

// ─── Sort posts by date desc ───────────────────────────────────────────────
export function sortByDate<T extends { frontmatter: { date: string } }>(arr: T[]): T[] {
  return [...arr].sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime(),
  )
}
