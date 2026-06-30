/**
 * generate-content-index.cjs
 *
 * Scans all MDX/MD files in content/blog and content/docs,
 * extracts frontmatter via gray-matter, and writes a JSON index
 * to public/content-index.json.
 *
 * This replaces the old runtime pattern where the browser
 * eagerly loaded ALL MDX modules via import.meta.glob.
 * Now only the lightweight JSON index is loaded eagerly,
 * and individual MDX components are lazy-loaded on demand.
 */

const fs = require('fs')
const path = require('path')

// ─── Minimal frontmatter parser (no gray-matter dependency needed at build time) ──
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
  if (!match) return { frontmatter: {}, body: content }

  const raw = match[1]
  const frontmatter = {}
  let currentKey = null

  for (const line of raw.split('\n')) {
    const keyMatch = line.match(/^(\w+):\s*(.*)/)
    if (keyMatch) {
      currentKey = keyMatch[1]
      let value = keyMatch[2].trim()

      // Parse inline arrays like ["item1", "item2"]
      if (value.startsWith('[') && value.endsWith(']')) {
        const inner = value.slice(1, -1).trim()
        if (inner.length === 0) {
          value = []
        } else {
          value = inner.split(',').map((s) => {
            const item = s.trim()
            if ((item.startsWith('"') && item.endsWith('"')) ||
                (item.startsWith("'") && item.endsWith("'"))) {
              return item.slice(1, -1)
            }
            return item
          })
        }
      }
      // Parse quoted strings
      else if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      // Parse booleans
      else if (value === 'true') value = true
      else if (value === 'false') value = false
      // Parse numbers
      else if (/^\d+$/.test(value)) value = parseInt(value, 10)
      else if (/^\d+\.\d+$/.test(value)) value = parseFloat(value)

      frontmatter[currentKey] = value
    }
    // Handle array values (indented with -)
    else if (currentKey && /^\s+-\s/.test(line)) {
      const item = line.replace(/^\s+-\s/, '').trim()
      if (item.startsWith('"') && item.endsWith('"')) {
        const clean = item.slice(1, -1)
        if (!Array.isArray(frontmatter[currentKey])) {
          frontmatter[currentKey] = []
        }
        frontmatter[currentKey].push(clean)
      } else if (!Array.isArray(frontmatter[currentKey])) {
        frontmatter[currentKey] = [item]
      } else {
        frontmatter[currentKey].push(item)
      }
    }
  }

  return { frontmatter, body: content.slice(match[0].length) }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pathToSlug(filePath, base) {
  return filePath
    .replace(base, '')
    .replace(/\\/g, '/')
    .replace(/\/index\.mdx?$/, '')
    .replace(/\.mdx?$/, '')
    .replace(/^\/+/, '')
}

async function scanDir(dir, baseDir) {
  const results = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...await scanDir(fullPath, baseDir))
    } else if (entry.isFile() && /\.mdx?$/i.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf-8')
      const { frontmatter } = parseFrontmatter(content)
      const slug = pathToSlug(fullPath, baseDir)
      results.push({ slug, frontmatter, filePath: fullPath })
    }
  }
  return results
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function loadAuthorMap() {
  const authorsPath = path.resolve(__dirname, '..', 'content', 'authors', 'authors.yaml')
  if (!fs.existsSync(authorsPath)) return {}
  try {
    // Use js-yaml which is a devDependency
    const yaml = require('js-yaml')
    const raw = fs.readFileSync(authorsPath, 'utf-8')
    const list = yaml.load(raw)
    if (!Array.isArray(list)) return {}
    const map = {}
    for (const entry of list) {
      if (entry && entry.id) {
        map[entry.id] = {
          name: entry.name || entry.id,
          avatar: entry.avatar || '',
        }
      }
    }
    return map
  } catch {
    console.warn('  ⚠ Could not parse authors.yaml, author names will not be resolved')
    return {}
  }
}

async function main() {
  const projectRoot = path.resolve(__dirname, '..')
  const contentDir = path.join(projectRoot, 'content')
  const publicDir = path.join(projectRoot, 'public')

  const blogDir = path.join(contentDir, 'blog')
  const docsDir = path.join(contentDir, 'docs')

  console.log('  ℹ Generating content index...')

  // Load author map to resolve author IDs to display names
  const authorMap = await loadAuthorMap()

  // Scan blog posts
  let blogPosts = []
  if (fs.existsSync(blogDir)) {
    blogPosts = await scanDir(blogDir, blogDir)
    // Sort by date descending
    blogPosts.sort((a, b) => {
      const dateA = a.frontmatter.date ? new Date(a.frontmatter.date).getTime() : 0
      const dateB = b.frontmatter.date ? new Date(b.frontmatter.date).getTime() : 0
      return dateB - dateA
    })
  }

  // Scan docs
  let docs = []
  if (fs.existsSync(docsDir)) {
    docs = await scanDir(docsDir, docsDir)
    // Sort by order
    docs.sort((a, b) => (a.frontmatter.order ?? 99) - (b.frontmatter.order ?? 99))
  }

  // Build index: only store metadata, NOT the full MDX content or React components
  const index = {
    generatedAt: new Date().toISOString(),
    posts: blogPosts.map(({ slug, frontmatter }) => {
      const authorId = frontmatter.author ?? ''
      const resolved = authorMap[authorId]
      return {
        slug,
        title: frontmatter.title ?? slug,
        description: frontmatter.description ?? '',
        date: frontmatter.date ?? '',
        author: authorId,
        authorName: resolved ? resolved.name : authorId,
        authorAvatar: resolved ? resolved.avatar : '',
        category: frontmatter.category ?? 'Uncategorized',
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
        draft: frontmatter.draft === true,
        featured: frontmatter.featured === true,
        coverImage: frontmatter.coverImage ?? '',
        readingTime: frontmatter.readingTime ?? 1,
        comments: frontmatter.comments !== false,
        series: frontmatter.series ?? '',
        seriesOrder: frontmatter.seriesOrder ?? 0,
        cc: frontmatter.cc ?? '',
        lastEdited: frontmatter.lastEdited ?? '',
        updatedAt: frontmatter.updatedAt ?? '',
        order: frontmatter.order ?? undefined,
      }
    }),
    docs: docs.map(({ slug, frontmatter }) => ({
      slug,
      title: frontmatter.title ?? slug,
      description: frontmatter.description ?? '',
      section: frontmatter.section ?? 'General',
      sectionSlug: slug.split('/')[0] ?? 'general',
      order: frontmatter.order ?? 99,
      draft: frontmatter.draft === true,
      toc: frontmatter.toc !== false,
      version: frontmatter.version ?? '',
    })),
  }

  // Write index
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }

  const outputPath = path.join(publicDir, 'content-index.json')
  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2), 'utf-8')

  const postCount = index.posts.filter((p) => !p.draft).length
  const docCount = index.docs.filter((d) => !d.draft).length
  const fileSize = (Buffer.byteLength(JSON.stringify(index)) / 1024).toFixed(1)
  console.log(`  ✓ Generated content-index.json (${postCount} posts, ${docCount} docs, ${fileSize} KB)`)

  // Also create a map for lazy imports: slug → file path
  // This is used by the client to dynamically import the correct MDX module
  const blogSlugMap = {}
  if (fs.existsSync(blogDir)) {
    const allPosts = await scanDir(blogDir, blogDir)
    for (const post of allPosts) {
      // Store relative file path for Vite's import.meta.glob resolution
      const relativePath = path.relative(projectRoot, post.filePath).replace(/\\/g, '/')
      blogSlugMap[post.slug] = `/content/blog/${relativePath.replace(/^content\/blog\//, '')}`
    }
  }

  const docsSlugMap = {}
  if (fs.existsSync(docsDir)) {
    const allDocs = await scanDir(docsDir, docsDir)
    for (const doc of allDocs) {
      const relativePath = path.relative(projectRoot, doc.filePath).replace(/\\/g, '/')
      docsSlugMap[doc.slug] = `/content/docs/${relativePath.replace(/^content\/docs\//, '')}`
    }
  }

  fs.writeFileSync(
    path.join(publicDir, 'content-slug-map.json'),
    JSON.stringify({ blog: blogSlugMap, docs: docsSlugMap }, null, 2),
    'utf-8',
  )
  console.log(`  ✓ Generated content-slug-map.json (${Object.keys(blogSlugMap).length} blog slugs, ${Object.keys(docsSlugMap).length} docs slugs)`)
}

main().catch((err) => {
  console.error('  ✗ Failed to generate content index:', err.message)
  process.exit(1)
})
