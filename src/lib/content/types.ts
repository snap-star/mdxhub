// ─── Content Type Definitions ──────────────────────────────────────────────

export interface FrontmatterBase {
  title: string
  description?: string
  draft?: boolean
}

export interface BlogFrontmatter extends FrontmatterBase {
  date: string
  author: string        // key into authors.yaml
  category: string
  tags: string[]
  comments?: boolean
  cc?: string           // e.g. "CC-BY-4.0"
  coverImage?: string
  readingTime?: number  // auto-computed if not set
  order?: number
  featured?: boolean
  lastEdited?: string
  updatedAt?: string
  series?: string
  seriesOrder?: number
}

export type SortMode = 'date' | 'order' | 'title' | 'readingTime'

export interface DocFrontmatter extends FrontmatterBase {
  section: string
  order?: number
  version?: string      // e.g. "v1.0" — shows version badge
  toc?: boolean         // default true
  prev?: string         // slug
  next?: string         // slug
}

export interface Author {
  id: string
  name: string
  avatar: string
  bio: string
  twitter?: string
  instagram?: string
  linkedin?: string
  facebook?: string
  tiktok?: string
  bluesky?: string
  threads?: string
  reddit?: string
  mastodon?: string
  youtube?: string
  twitch?: string
  medium?: string
  stackoverflow?: string
  devto?: string
  discord?: string
  telegram?: string
  email?: string
  phone?: string
  location?: string
  company?: string
  role?: string
  github?: string
  website?: string
}

export interface BlogPost {
  slug: string
  frontmatter: BlogFrontmatter
  author: Author | null
  readingTime: number
  Component: React.ComponentType
}

export interface DocPage {
  slug: string
  section: string
  sectionSlug: string
  frontmatter: DocFrontmatter
  Component: React.ComponentType
}

export interface Breadcrumb {
  label: string
  href?: string
}

export interface TocItem {
  id: string
  text: string
  level: number
}

export interface SearchResult {
  type: 'blog' | 'doc'
  slug: string
  title: string
  description?: string
  category?: string
  section?: string
  tags?: string[]
}

// MDX module shape after remark-mdx-frontmatter
export interface MDXBlogModule {
  default: React.ComponentType
  frontmatter: BlogFrontmatter
}

export interface MDXDocModule {
  default: React.ComponentType
  frontmatter: DocFrontmatter
}
