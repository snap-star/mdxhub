/**
 * Prebuild script: generates public/rss.xml from all blog posts.
 *
 * This runs before `vite build` so the RSS feed is available as a static
 * asset in the production build (and during dev via the public/ directory).
 *
 * Only generates the feed if blog posts exist — safe to run repeatedly.
 */

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const ROOT = path.resolve(__dirname, '..')
const CONTENT_DIR = path.join(ROOT, 'content')
const BLOG_DIR = path.join(CONTENT_DIR, 'blog')
const AUTHORS_FILE = path.join(CONTENT_DIR, 'authors', 'authors.yaml')
const OUTPUT_FILE = path.join(ROOT, 'public', 'rss.xml')

// ─── Site configuration (read from site.config.json) ──────────────────────
let siteConfig = {}
try {
  siteConfig = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.config.json'), 'utf-8'))
} catch (err) {
  console.warn(`  ⚠ Could not read site.config.json: ${err.message}`)
}

const SITE_URL = siteConfig.siteUrl || 'https://mdxhub.vercel.app'
const SITE_TITLE = siteConfig.title || 'MDXHub'
const SITE_DESCRIPTION = siteConfig.description || ''
const SITE_LANG = siteConfig.language || 'en'

// ─── Helpers ──────────────────────────────────────────────────────────────

async function* walk(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      yield* walk(fullPath)
    } else {
      yield fullPath
    }
  }
}

/** Parse YAML frontmatter from a .md or .mdx file */
function parseFrontmatter(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n\s*---\s*\n/);
  if (!match) return null
  try {
    return yaml.load(match[1])
  } catch {
    return null
  }
}

/** Derive the blog slug from the file path, relative to content/blog */
function pathToSlug(filePath) {
  const relative = path.relative(BLOG_DIR, filePath)
  return relative
    .replace(/\\/g, '/')
    .replace(/\/index\.mdx?$/, '')
    .replace(/\.mdx?$/, '')
}

/** Escape XML special characters */
function escapeXml(str) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** Convert date to RFC 2822 format for RSS pubDate.
 *  Handles both string dates ("2026-06-26") and Date objects
 *  (from unquoted YAML like `date: 2026-06-26`).
 */
function toRfc2822(date) {
  if (!date) return new Date().toUTCString()
  const d = date instanceof Date ? date : new Date(date + 'T00:00:00Z')
  if (isNaN(d.getTime())) return new Date().toUTCString()
  return d.toUTCString()
}

// ─── Main ──────────────────────────────────────────────────────────────────

;(async () => {
  // 1. Load authors registry
  let authors = {}
  try {
    const authorsRaw = await fs.promises.readFile(AUTHORS_FILE, 'utf-8')
    const authorList = yaml.load(authorsRaw)
    if (Array.isArray(authorList)) {
      authors = Object.fromEntries(authorList.map((a) => [a.id, a.name]))
    }
  } catch (err) {
    console.warn(`  ⚠ Could not load authors: ${err.message}`)
  }

  // 2. Collect all blog posts
  const posts = []

  for await (const filePath of walk(BLOG_DIR)) {
    const ext = path.extname(filePath).toLowerCase()
    if (ext !== '.md' && ext !== '.mdx') continue

    const content = await fs.promises.readFile(filePath, 'utf-8')
    const fm = parseFrontmatter(content)

    if (!fm) {
      console.warn(`  ⚠ Skipping ${path.relative(CONTENT_DIR, filePath)} — no frontmatter`)
      continue
    }

    // Skip draft posts
    if (fm.draft === true || fm.draft === 'true') continue

    // Skip posts without required fields
    if (!fm.title || !fm.date) {
      console.warn(
        `  ⚠ Skipping ${path.relative(CONTENT_DIR, filePath)} — missing title or date`,
      )
      continue
    }

    // Normalize date: YAML may parse unquoted dates like `date: 2026-06-26` as Date objects
    const postDate = fm.date instanceof Date ? fm.date.toISOString().slice(0, 10) : fm.date

    const slug = pathToSlug(filePath)
    const authorName = fm.author ? authors[fm.author] || fm.author : ''

    posts.push({
      title: fm.title,
      description: fm.description || '',
      date: postDate,
      slug,
      link: `${SITE_URL}/blog/${slug}`,
      author: authorName,
      category: fm.category || '',
      tags: Array.isArray(fm.tags) ? fm.tags : [],
    })
  }

  // 3. Sort by date descending (newest first)
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (posts.length === 0) {
    console.log('  ℹ No blog posts found — skipping RSS generation.')
    process.exit(0)
  }

  // 4. Build RSS XML
  const now = new Date().toUTCString()
  const items = posts
    .map((post) => {
      const cats = []
      if (post.category) cats.push(`<category>${escapeXml(post.category)}</category>`)
      post.tags.forEach((t) => cats.push(`<category>${escapeXml(t)}</category>`))
      return (
        `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(post.link)}</link>
      <guid isPermaLink="true">${escapeXml(post.link)}</guid>
      <pubDate>${toRfc2822(post.date)}</pubDate>
      <description>${escapeXml(post.description)}</description>
      ` + cats.join('\n      ') +
        (post.author ? `
      <author>${escapeXml(post.author)}</author>` : '') +
        `
    </item>`
      )
    })
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>${SITE_LANG}</language>
    <atom:link href="${escapeXml(SITE_URL)}/rss.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${now}</lastBuildDate>
    ${items}
  </channel>
</rss>`

  // 5. Write output
  const publicDir = path.dirname(OUTPUT_FILE)
  if (!fs.existsSync(publicDir)) {
    await fs.promises.mkdir(publicDir, { recursive: true })
  }

  await fs.promises.writeFile(OUTPUT_FILE, rss, 'utf-8')
  console.log(`\n  ✓ Generated RSS feed: public/rss.xml (${posts.length} posts, ${(Buffer.byteLength(rss) / 1024).toFixed(1)} KB)`)
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
