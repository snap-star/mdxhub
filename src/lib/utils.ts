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

export function estimateReadingTime(content: string): number {
  // Strip frontmatter
  const withoutFrontmatter = content.replace(/^---[\s\S]*?---/, '')
  // Strip import statements
  const withoutImports = withoutFrontmatter.replace(/^import\s+.*$/gm, '')
  // Extract code blocks for separate counting
  const codeBlocks = withoutImports.match(/```[\s\S]*?```/g) ?? []
  const codeWordCount = codeBlocks.join(' ').replace(/```\w*/g, '').trim().split(/\s+/).length
  // Strip code blocks and JSX/HTML tags
  const prose = withoutImports
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
  // Count images
  const imageCount = (content.match(/!\[.*?\]\(.*?\)/g) ?? []).length
    + (content.match(/<img\s/gi) ?? []).length
  // Split CJK vs Latin words
  const cjkChars = (prose.match(/[\u4e00-\u9fff\u3400-\u4dbf\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/g) ?? []).length
  const latinWords = prose.replace(/[\u4e00-\u9fff\u3400-\u4dbf\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/g, '')
    .trim().split(/\s+/).filter(Boolean).length
  // Calculate time
  const proseMinutes = latinWords / 238 + cjkChars / 500
  const codeMinutes = codeWordCount * 0.4 / 238
  const imageMinutes = imageCount > 0
    ? (12 + Math.max(0, imageCount - 1) * 3) / 60
    : 0
  const total = proseMinutes + codeMinutes + imageMinutes
  return Math.max(1, Math.round(total * 2) / 2) // round to 0.5
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
