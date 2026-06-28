/**
 * Prebuild script: generates public/sitemap.xml and public/robots.txt.
 *
 * Discovers all static routes and dynamic content routes (blog posts, docs)
 * from the content/ directory and produces a standard sitemap.xml with
 * lastmod dates derived from file modification times.
 */

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const ROOT = path.resolve(__dirname, '..')
const CONTENT_DIR = path.join(ROOT, 'content')
const BLOG_DIR = path.join(CONTENT_DIR, 'blog')
const DOCS_DIR = path.join(CONTENT_DIR, 'docs')
const PUBLIC_DIR = path.join(ROOT, 'public')

// Site configuration — keep in sync with src/components/common/SEO.tsx
const SITE_URL = 'https://mdxhub.vercel.app'

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
  const match = content.match(/^---\s*\n([\s\S]*?)\n\s*---\s*\n/)
  if (!match) return null
  try {
    return yaml.load(match[1])
  } catch {
    return null
  }
}

/** Derive the URL path from a file path, relative to a base content directory */
function pathToUrl(filePath, baseDir) {
  const relative = path.relative(baseDir, filePath)
  const slug = relative
    .replace(/\\/g, '/')
    .replace(/\/index\.mdx?$/, '')
    .replace(/\.mdx?$/, '')
  return slug ? `/${slug}` : '/'
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

/** Format a Date to ISO 8601 (YYYY-MM-DD) for sitemap lastmod */
function toSitemapDate(date) {
  if (!date) return new Date().toISOString().slice(0, 10)
  const d = date instanceof Date ? date : new Date(date)
  if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 10)
  return d.toISOString().slice(0, 10)
}

/** Collect valid (non-draft) content entries from a content directory */
async function collectContent(baseDir, baseRoute) {
  const entries = []

  for await (const filePath of walk(baseDir)) {
    const ext = path.extname(filePath).toLowerCase()
    if (ext !== '.md' && ext !== '.mdx') continue

    const content = await fs.promises.readFile(filePath, 'utf-8')
    const fm = parseFrontmatter(content)

    // Skip drafts
    if (fm && (fm.draft === true || fm.draft === 'true')) continue

    const loc = baseRoute + pathToUrl(filePath, baseDir)

    // Use file mtime for lastmod, fall back to frontmatter date
    try {
      const stat = await fs.promises.stat(filePath)
      entries.push({ loc, lastmod: stat.mtime })
    } catch {
      entries.push({ loc, lastmod: new Date() })
    }
  }

  return entries
}

// ─── Main ──────────────────────────────────────────────────────────────────

;(async () => {
  const urls = []

  // 1. Static routes (with default priority and changefreq)
  const staticRoutes = [
    { loc: '/',           changefreq: 'daily',   priority: 1.0 },
    { loc: '/blog',       changefreq: 'daily',   priority: 0.9 },
    { loc: '/docs',       changefreq: 'weekly',  priority: 0.8 },
    { loc: '/about',      changefreq: 'monthly', priority: 0.6 },
  ]
  urls.push(...staticRoutes)

  // 2. Blog posts
  try {
    const blogEntries = await collectContent(BLOG_DIR, '/blog')
    blogEntries.forEach((entry) => {
      urls.push({
        loc: entry.loc,
        lastmod: entry.lastmod,
        changefreq: 'monthly',
        priority: 0.7,
      })
    })
    console.log(`  ✓ ${blogEntries.length} blog posts`)
  } catch (err) {
    console.warn(`  ⚠ Could not scan blog directory: ${err.message}`)
  }

  // 3. Documentation pages
  try {
    const docsEntries = await collectContent(DOCS_DIR, '/docs')
    docsEntries.forEach((entry) => {
      urls.push({
        loc: entry.loc,
        lastmod: entry.lastmod,
        changefreq: 'monthly',
        priority: 0.7,
      })
    })
    console.log(`  ✓ ${docsEntries.length} doc pages`)
  } catch (err) {
    console.warn(`  ⚠ Could not scan docs directory: ${err.message}`)
  }

  // 4. Generate sitemap.xml
  const urlElements = urls
    .map((u) => {
      const lastmod = u.lastmod
        ? `\n    <lastmod>${toSitemapDate(u.lastmod)}</lastmod>`
        : ''
      const changefreq = u.changefreq
        ? `\n    <changefreq>${u.changefreq}</changefreq>`
        : ''
      const priority = u.priority
        ? `\n    <priority>${u.priority.toFixed(1)}</priority>`
        : ''
      return `  <url>\n    <loc>${escapeXml(SITE_URL + u.loc)}</loc>${lastmod}${changefreq}${priority}\n  </url>`
    })
    .join('\n')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>
`

  if (!fs.existsSync(PUBLIC_DIR)) {
    await fs.promises.mkdir(PUBLIC_DIR, { recursive: true })
  }

  await fs.promises.writeFile(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap, 'utf-8')
  console.log(`\n  ✓ public/sitemap.xml (${urls.length} URLs, ${(Buffer.byteLength(sitemap) / 1024).toFixed(1)} KB)`)

  // 5. Generate robots.txt
  const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`

  await fs.promises.writeFile(path.join(PUBLIC_DIR, 'robots.txt'), robots, 'utf-8')
  console.log(`  ✓ public/robots.txt`)
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
