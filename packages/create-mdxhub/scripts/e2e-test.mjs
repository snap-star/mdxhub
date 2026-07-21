#!/usr/bin/env node

/**
 * e2e-test.mjs
 *
 * End-to-end test for create-mdxhub:
 * 1. Scaffolds all 3 variants (full, blog, docs)
 * 2. Builds the full variant
 * 3. Verifies file structure and build output
 *
 * Run from monorepo root: node packages/create-mdxhub/scripts/e2e-test.mjs
 */

import { resolve, dirname, relative } from 'path'
import { fileURLToPath } from 'url'
import {
  existsSync, mkdirSync, writeFileSync, readFileSync,
  copyFileSync, rmSync, readdirSync,
} from 'fs'
import { execSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PKG_ROOT = resolve(__dirname, '..')
const TEMPLATE_DIR = resolve(PKG_ROOT, 'templates', 'full')
const TEST_DIR = '/tmp/create-mdxhub-e2e'

// ─── Color helpers ───────────────────────────────────────────────────
const green = (s) => `\x1b[32m${s}\x1b[0m`
const red =   (s) => `\x1b[31m${s}\x1b[0m`
const yellow = (s) => `\x1b[33m${s}\x1b[0m`
const dim =   (s) => `\x1b[2m${s}\x1b[0m`
const bold =  (s) => `\x1b[1m${s}\x1b[0m`

// ─── Glob matching (same as CLI) ────────────────────────────────────
function globFiles(pattern, rootDir) {
  const parts = pattern.split('/')
  if (!parts.some((p) => p.includes('*'))) {
    const fp = resolve(rootDir, pattern)
    return existsSync(fp) ? [fp] : []
  }
  const baseParts = []
  for (const p of parts) {
    if (p.includes('*')) break
    baseParts.push(p)
  }
  const base = resolve(rootDir, ...baseParts)
  if (!existsSync(base)) return []
  const results = []
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = resolve(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (matchGlob(relative(rootDir, full), pattern)) results.push(full)
    }
  }
  walk(base)
  return results
}

function matchGlob(fp, pattern) {
  const re = pattern
    .replace(/\./g, '\\.')
    .replace(/\*\*/g, '<<DS>>')
    .replace(/\*/g, '[^/]*')
    .replace(/<<DS>>/g, '.*')
  return new RegExp(`^${re}$`).test(fp)
}

const BINARY_EXTS = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'webp', 'avif',
  'ico', 'woff2', 'woff', 'ttf', 'otf', 'eot',
  'mp4', 'webm', 'svg',
])
const isBinary = (p) => BINARY_EXTS.has(p.split('.').pop().toLowerCase())

// ─── Variant-aware Navbar patching (mirrors CLI) ─────────────────
function patchNavbar(targetDir, variant) {
  const path = resolve(targetDir, 'src', 'components', 'common', 'Navbar.tsx')
  if (!existsSync(path)) return
  let content = readFileSync(path, 'utf-8')
  const blogLine = "  { href: '/blog', key: 'nav.blog', icon: Rss },"
  const docsLine = "  { href: '/docs', key: 'nav.docs', icon: BookOpen },"
  if (variant === 'blog') { content = content.replace(docsLine + '\n', '') }       // blog → remove docs link
  if (variant === 'docs') { content = content.replace(blogLine + '\n', '') }       // docs → remove blog link
  writeFileSync(path, content, 'utf-8')
}

const FOOTER_BLOG_SECTION = `            {
              titleKey: 'footer.blogTitle',
              links: [
                { labelKey: 'footer.allPosts', href: '/blog' },
                { labelKey: 'footer.categories', href: '/blog/category' },
                { labelKey: 'footer.tutorials', href: '/blog/category/Tutorial' },
                { labelKey: 'footer.guides', href: '/blog/category/Guide' },
              ],
            },`

const FOOTER_DOCS_SECTION = `            {
              titleKey: 'footer.docsTitle',
              links: [
                { labelKey: 'footer.introduction', href: '/docs/1-introduction' },
                { labelKey: 'footer.installation', href: '/docs/2-guides/installation' },
                { labelKey: 'footer.deployment', href: '/docs/3-deployment/hosting' },
                { labelKey: 'footer.mdxGuide', href: '/blog/creating-posts-guide' },
              ],
            },`

function patchFooter(targetDir, variant) {
  const path = resolve(targetDir, 'src', 'components', 'common', 'Footer.tsx')
  if (!existsSync(path)) return
  let content = readFileSync(path, 'utf-8')
  if (variant === 'blog') { content = content.replace(FOOTER_DOCS_SECTION + '\n', '') }   // blog → remove docs section
  if (variant === 'docs') { content = content.replace(FOOTER_BLOG_SECTION + '\n', '') }   // docs → remove blog section
  writeFileSync(path, content, 'utf-8')
}

// ─── Scaffold function (same logic as CLI but without prompts) ─────
function scaffoldVariant(
  variant,
  projectName,
  sourceRoot,
  targetDir,
  { resolveFiles, generateRoutesConfig },
) {
  console.log(dim(`  Scaffolding "${projectName}" (${variant}) → ${targetDir}`))

  // Clean target
  if (existsSync(targetDir)) rmSync(targetDir, { recursive: true, force: true })

  // Resolve files
  const files = resolveFiles(variant)
  let copied = 0
  let skipped = 0
  const errors = []

  for (const pattern of files) {
    const sources = globFiles(pattern, sourceRoot)
    if (sources.length === 0) { skipped++; continue }
    for (const src of sources) {
      const rel = relative(sourceRoot, src)
      const dest = resolve(targetDir, rel)
      const destDir = dirname(dest)
      if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true })
      try {
        if (isBinary(src)) {
          copyFileSync(src, dest)
        } else {
          writeFileSync(dest, readFileSync(src, 'utf-8'), 'utf-8')
        }
        copied++
      } catch (err) {
        errors.push({ file: rel, error: err.message })
      }
    }
  }

  // Generate routes.ts
  const routesDir = resolve(targetDir, 'app')
  if (!existsSync(routesDir)) mkdirSync(routesDir, { recursive: true })
  writeFileSync(resolve(targetDir, 'app/routes.ts'), generateRoutesConfig(variant), 'utf-8')

  // Remove irrelevant content
  if (variant === 'blog') {
    const d = resolve(targetDir, 'content', 'docs')
    if (existsSync(d)) rmSync(d, { recursive: true, force: true })
  }
  if (variant === 'docs') {
    for (const dir of ['content/blog', 'content/authors']) {
      const d = resolve(targetDir, dir)
      if (existsSync(d)) rmSync(d, { recursive: true, force: true })
    }
    const a = resolve(targetDir, 'content', 'about.mdx')
    if (existsSync(a)) rmSync(a, { force: true })
  }

  // Variant-aware Navbar/Footer patching (mirrors CLI)
  if (variant !== 'full') {
    patchNavbar(targetDir, variant)
    patchFooter(targetDir, variant)
  }

  // Customize package.json
  const pkgPath = resolve(targetDir, 'package.json')
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
    pkg.name = projectName
    pkg.private = true
    // Keep version — some source files import it (e.g., Navbar, _index.tsx)
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8')
  }

  // Customize site.config.json
  const cfgPath = resolve(targetDir, 'site.config.json')
  if (existsSync(cfgPath)) {
    const siteTitle = projectName
      .replace(/[-_.]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim()
    const siteDesc = `A ${
      variant === 'blog' ? 'blog' : variant === 'docs' ? 'documentation site' : 'blog and documentation site'
    } built with MDXHub`
    const cfg = JSON.parse(readFileSync(cfgPath, 'utf-8'))
    cfg.title = siteTitle
    cfg.titleTemplate = `%s | ${siteTitle}`
    cfg.description = siteDesc
    writeFileSync(cfgPath, JSON.stringify(cfg, null, 2) + '\n', 'utf-8')
  }

  return { copied, skipped, errors }
}

// ─── Main test runner ──────────────────────────────────────────────
async function main() {
  // ── Clean up from previous runs ────────────────────────────────
  if (existsSync(TEST_DIR)) {
    rmSync(TEST_DIR, { recursive: true, force: true })
  }

  const FAILURES = []
  const PASSES = []

  function assert(condition, message) {
    if (condition) {
      console.log(`    ${green('✓')} ${message}`)
      PASSES.push(message)
    } else {
      console.log(`    ${red('✗')} ${message}`)
      FAILURES.push(message)
    }
    return condition
  }

  console.log()
  console.log(bold('╔══════════════════════════════════════════╗'))
  console.log(bold('║     create-mdxhub End-to-End Test       ║'))
  console.log(bold('╚══════════════════════════════════════════╝'))
  console.log()

  // Load manifest functions via native ESM import
  const { resolveFiles, generateRoutesConfig } = await import(
    resolve(PKG_ROOT, 'src', 'manifest.js')
  )

  // Determine source root
  const sourceRoot =
    existsSync(TEMPLATE_DIR) && readdirSync(TEMPLATE_DIR).length > 5
      ? TEMPLATE_DIR
      : resolve(PKG_ROOT, '..', '..')
  console.log(dim(`  Source root: ${sourceRoot}`))

  // ────────────────────────────────────────────────────────────────
  // 1. Test all three variants scaffold correctly
  // ────────────────────────────────────────────────────────────────
  const variants = [
    { name: 'full', project: 'e2e-full' },
    { name: 'blog', project: 'e2e-blog' },
    { name: 'docs', project: 'e2e-docs' },
  ]

  console.log()
  console.log(bold('  Phase 1: Scaffolding variants'))
  console.log()

  for (const { name, project } of variants) {
    const target = resolve(TEST_DIR, project)
    const start = Date.now()
    const result = scaffoldVariant(name, project, sourceRoot, target, {
      resolveFiles,
      generateRoutesConfig,
    })
    const elapsed = ((Date.now() - start) / 1000).toFixed(1)

    console.log(`  ${name}:`)
    assert(existsSync(target), `project directory exists (${project})`)
    assert(result.copied > 0, `files copied (${result.copied})`)
    assert(result.errors.length === 0, `no errors (${result.errors.length})`)

    // Check critical shared files
    const criticalFiles = [
      'package.json', 'site.config.json', 'app/routes.ts',
      'app/root.tsx', 'app/entry.client.tsx', 'vite.config.ts',
      'tsconfig.json', 'react-router.config.ts', 'src/index.css',
      'src/components/common/Navbar.tsx',
      'src/components/mdx/Callout.tsx',
      'src/routes/_index.tsx',
      'site.config.json',
    ]
    for (const cf of criticalFiles) {
      assert(existsSync(resolve(target, cf)), `${cf} exists`)
    }

    // Check variant-specific presence
    const hasBlogContent  = existsSync(resolve(target, 'content', 'blog'))
    const hasDocsContent  = existsSync(resolve(target, 'content', 'docs'))
    const hasBlogRoutes   = existsSync(resolve(target, 'src', 'routes', 'blog._index.tsx'))
    const hasDocsRoutes   = existsSync(resolve(target, 'src', 'routes', 'docs._index.tsx'))
    const hasBlogLayout   = existsSync(resolve(target, 'src', 'layouts', 'BlogLayout.tsx'))
    const hasDocsLayout   = existsSync(resolve(target, 'src', 'layouts', 'DocsLayout.tsx'))
    const hasBlogSlugRoute = existsSync(resolve(target, 'src', 'routes', 'blog.$slug.tsx'))
    const hasDocsSlugRoute = existsSync(resolve(target, 'src', 'routes', 'docs.$section.$slug.tsx'))

    // Blog content: essential guides
    const hasBlogGuide   = existsSync(resolve(target, 'content', 'blog', 'tutorial'))
    const hasBlogShowcase = existsSync(resolve(target, 'content', 'blog', 'showcase'))
    const hasBlogGuide2  = existsSync(resolve(target, 'content', 'blog', 'guide'))
    // Blog content: sample (should be absent for blog variant)
    const hasBlogReact   = existsSync(resolve(target, 'content', 'blog', 'react'))
    const hasBlogNews    = existsSync(resolve(target, 'content', 'blog', 'news'))
    const hasBlogJS      = existsSync(resolve(target, 'content', 'blog', 'javascript'))

    if (name === 'full') {
      assert(hasBlogContent,  'blog content present')
      assert(hasDocsContent,  'docs content present')
      assert(hasBlogRoutes,   'blog routes present')
      assert(hasDocsRoutes,   'docs routes present')
      assert(hasBlogLayout,   'BlogLayout present')
      assert(hasDocsLayout,   'DocsLayout present')
      assert(hasBlogSlugRoute, 'blog.$slug.tsx present (full)')
      assert(hasDocsSlugRoute, 'docs.$section.$slug.tsx present (full)')
      // Full variant: essential guides + only javascript sample (other samples removed)
      assert(hasBlogGuide,    'blog guide content present (full)')
      assert(hasBlogShowcase, 'blog showcase content present (full)')
      assert(hasBlogJS,       'blog javascript content present (full)')
      assert(!hasBlogReact,   'blog react content absent (full)')
      assert(!hasBlogNews,    'blog news content absent (full)')
    } else if (name === 'blog') {
      assert(hasBlogContent,  'blog content present')
      assert(!hasDocsContent, 'docs content absent')
      assert(hasBlogRoutes,   'blog routes present')
      assert(!hasDocsRoutes,  'docs routes absent')
      assert(hasBlogLayout,   'BlogLayout present')
      assert(!hasDocsLayout,  'DocsLayout absent')
      assert(hasBlogSlugRoute, 'blog.$slug.tsx present (blog)')
      assert(!hasDocsSlugRoute, 'docs.$section.$slug.tsx absent (blog)')
      // Blog variant: only essential guides, no sample content
      assert(hasBlogGuide,    'blog guide content present (blog)')
      assert(hasBlogShowcase, 'blog showcase content present (blog)')
      assert(!hasBlogReact,   'blog react content absent (blog)')
      assert(!hasBlogNews,    'blog news content absent (blog)')
      assert(!hasBlogJS,      'blog javascript content absent (blog)')
    } else if (name === 'docs') {
      assert(!hasBlogContent,  'blog content absent')
      assert(hasDocsContent,   'docs content present')
      assert(!hasBlogRoutes,   'blog routes absent')
      assert(hasDocsRoutes,    'docs routes present')
      assert(!hasBlogLayout,   'BlogLayout absent')
      assert(hasDocsLayout,    'DocsLayout present')
      assert(!hasBlogSlugRoute, 'blog.$slug.tsx absent (docs)')
      assert(hasDocsSlugRoute,  'docs.$section.$slug.tsx present (docs)')
      // Docs variant: no blog at all
      assert(!hasBlogGuide,    'blog guide content absent (docs)')
      assert(!hasBlogShowcase, 'blog showcase content absent (docs)')
    }

    // Check package.json was customized
    const pkgJson = JSON.parse(readFileSync(resolve(target, 'package.json'), 'utf-8'))
    assert(pkgJson.name === project, `package.json name is "${project}"`)
    assert(pkgJson.private === true, 'package.json private is true')
    // Version is kept so imports like `import { version } from '../../package.json'` still work
    assert(typeof pkgJson.version === 'string' && pkgJson.version.length > 0, 'package.json version preserved')

    // Check site.config.json was customized
    const siteCfg = JSON.parse(readFileSync(resolve(target, 'site.config.json'), 'utf-8'))
    const expectedTitle = project.replace(/[-_.]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()).trim()
    assert(siteCfg.title === expectedTitle, `site.config.json title is "${expectedTitle}"`)
    assert(siteCfg.titleTemplate === `%s | ${expectedTitle}`, 'site.config.json titleTemplate set')

    // Check routes.ts is variant-aware
    const routesContent = readFileSync(resolve(target, 'app/routes.ts'), 'utf-8')
    assert(routesContent.includes('route("about"'), 'routes.ts has about route')
    assert(routesContent.includes('route("search"'), 'routes.ts has search route')

    if (name === 'full') {
      assert(routesContent.includes('BlogLayout'), 'routes.ts has BlogLayout')
      assert(routesContent.includes('DocsLayout'), 'routes.ts has DocsLayout')
      assert(routesContent.includes('blog.category'), 'routes.ts has blog category routes')
    } else if (name === 'blog') {
      assert(routesContent.includes('BlogLayout'), 'routes.ts has BlogLayout')
      assert(!routesContent.includes('DocsLayout'), 'routes.ts has no DocsLayout')
      assert(routesContent.includes('blog.category'), 'routes.ts has blog category routes')
    } else if (name === 'docs') {
      assert(!routesContent.includes('BlogLayout'), 'routes.ts has no BlogLayout')
      assert(routesContent.includes('DocsLayout'), 'routes.ts has DocsLayout')
      assert(!routesContent.includes('blog.category'), 'routes.ts has no blog routes')
    }

    // Check Navbar/Footer are variant-aware
    const navbarContent = readFileSync(resolve(target, 'src', 'components', 'common', 'Navbar.tsx'), 'utf-8')
    const footerContent = readFileSync(resolve(target, 'src', 'components', 'common', 'Footer.tsx'), 'utf-8')

    if (name === 'full') {
      assert(navbarContent.includes("href: '/blog'"), 'Navbar has blog link')
      assert(navbarContent.includes("href: '/docs'"), 'Navbar has docs link')
      assert(navbarContent.includes("href: '/about'"), 'Navbar has about link')
      assert(footerContent.includes("footer.blogTitle"), 'Footer has blog section')
      assert(footerContent.includes("footer.docsTitle"), 'Footer has docs section')
      assert(footerContent.includes("footer.moreTitle"), 'Footer has more section')
    } else if (name === 'blog') {
      assert(navbarContent.includes("href: '/blog'"), 'Navbar has blog link')
      assert(!navbarContent.includes("href: '/docs'"), 'Navbar has no docs link')
      assert(navbarContent.includes("href: '/about'"), 'Navbar has about link')
      assert(footerContent.includes("footer.blogTitle"), 'Footer has blog section')
      assert(!footerContent.includes("footer.docsTitle"), 'Footer has no docs section')
      assert(footerContent.includes("footer.moreTitle"), 'Footer has more section')
    } else if (name === 'docs') {
      assert(!navbarContent.includes("href: '/blog'"), 'Navbar has no blog link')
      assert(navbarContent.includes("href: '/docs'"), 'Navbar has docs link')
      assert(navbarContent.includes("href: '/about'"), 'Navbar has about link')
      assert(!footerContent.includes("footer.blogTitle"), 'Footer has no blog section')
      assert(footerContent.includes("footer.docsTitle"), 'Footer has docs section')
      assert(footerContent.includes("footer.moreTitle"), 'Footer has more section')
    }

    // Check React 19 use() hook is used in the route files (Suspense-based MDX loading)
    if (name !== 'docs') {
      const blogRoutePath = resolve(target, 'src', 'routes', 'blog.$slug.tsx')
      if (existsSync(blogRoutePath)) {
        const blogRouteContent = readFileSync(blogRoutePath, 'utf-8')
        assert(blogRouteContent.includes('React.use'), 'blog route uses React.use() hook')
        assert(blogRouteContent.includes('React.Suspense'), 'blog route uses React.Suspense boundary')
        assert(blogRouteContent.includes('BlogPostContent'), 'blog route has BlogPostContent sub-component')
        // Verify old pattern is gone — no manual cancellation flags or loading state
        assert(!blogRouteContent.includes('const [mdxLoading, setMdxLoading]'), 'blog route: old mdxLoading state removed')
        // Note: cancellation flags still exist in the author loading useEffect —
        // only the MDX-specific mdxLoading state proves the old pattern is gone.
      }
    }
    if (name !== 'blog') {
      const docsRoutePath = resolve(target, 'src', 'routes', 'docs.$section.$slug.tsx')
      if (existsSync(docsRoutePath)) {
        const docsRouteContent = readFileSync(docsRoutePath, 'utf-8')
        assert(docsRouteContent.includes('React.use'), 'docs route uses React.use() hook')
        assert(docsRouteContent.includes('React.Suspense'), 'docs route uses React.Suspense boundary')
        assert(docsRouteContent.includes('DocContent'), 'docs route has DocContent sub-component')
        // Verify old pattern is gone
        assert(!docsRouteContent.includes('const [mdxLoading, setMdxLoading]'), 'docs route: old mdxLoading state removed')
        // Note: only check mdxLoading — the old MDX loading pattern used this state variable.
      }
    }

    console.log(dim(`     (${elapsed}s, ${result.copied} files)`))
    console.log()
  }

  // ────────────────────────────────────────────────────────────────
  // 2. Build the full variant
  // ────────────────────────────────────────────────────────────────
  console.log()
  console.log(bold('  Phase 2: Building the full variant'))
  console.log()

  const fullProjectDir = resolve(TEST_DIR, 'e2e-full')

  // Install dependencies
  console.log(dim('  Installing dependencies...'))
  try {
    execSync('pnpm install', { cwd: fullProjectDir, stdio: 'pipe', timeout: 120000 })
    assert(true, 'pnpm install succeeded')
    console.log(dim('  ✓ pnpm install completed'))
  } catch (err) {
    assert(false, `pnpm install: ${err.message}`)
  }

  // Run the build
  console.log(dim('  Running pnpm build...'))
  try {
    execSync('pnpm build', { cwd: fullProjectDir, stdio: 'pipe', timeout: 180000 })
    assert(true, 'pnpm build succeeded')
    console.log(dim('  ✓ pnpm build completed'))
  } catch (err) {
    assert(false, `pnpm build: ${err.message}`)
  }

  // Check build output
  const buildClientDir = resolve(fullProjectDir, 'build', 'client')
  const buildServerDir = resolve(fullProjectDir, 'build', 'server')
  assert(existsSync(buildClientDir), 'build/client directory exists')
  assert(existsSync(buildServerDir), 'build/server directory exists')

  // Verify build artifacts (recursive to find files in subdirectories like assets/)
  if (existsSync(buildClientDir)) {
    const allBuildFiles = readdirSync(buildClientDir, { recursive: true })
      .filter((f) => typeof f === 'string' || f instanceof String)
    const hasHtml  = allBuildFiles.some((f) => String(f).endsWith('.html'))
    const hasJs    = allBuildFiles.some((f) => String(f).endsWith('.js'))
    const hasCss   = allBuildFiles.some((f) => String(f).endsWith('.css'))
    assert(hasHtml, 'HTML files generated in build/client')
    assert(hasJs,   'JS files generated in build/client')
    assert(hasCss,  'CSS files generated in build/client')
    console.log(dim(`     Build artifacts: ${allBuildFiles.length} files`))
  }

  // ────────────────────────────────────────────────────────────────
  // 3. Test non-interactive mode (--yes flag)
  // ────────────────────────────────────────────────────────────────
  console.log()
  console.log(bold('  Phase 3: Non-interactive mode (--yes flag)'))
  console.log()

  // Run CLI with --yes flag and verify it produces output without hanging
  const cliPath = resolve(PKG_ROOT, 'src', 'index.js')
  const nonIntDir = resolve(TEST_DIR, 'e2e-noninteractive')

  try {
    const nonIntOutput = execSync(
      `node ${cliPath} --yes --name e2e-noninteractive --template blog --pm pnpm --skip-install`,
      { cwd: TEST_DIR, timeout: 30000, encoding: 'utf-8' },
    )

    assert(existsSync(nonIntDir), 'non-interactive: project directory exists')
    assert(nonIntOutput.includes('non-interactive mode'), 'non-interactive: mode message shown')
    assert(nonIntOutput.includes('Project scaffolded'), 'non-interactive: success message')

    // Verify the scaffolded project content
    assert(existsSync(resolve(nonIntDir, 'package.json')), 'non-interactive: package.json exists')
    assert(existsSync(resolve(nonIntDir, 'app', 'routes.ts')), 'non-interactive: routes.ts exists')

    const niRoutes = readFileSync(resolve(nonIntDir, 'app', 'routes.ts'), 'utf-8')
    assert(niRoutes.includes('BlogLayout'), 'non-interactive: blog routes present')
    assert(!niRoutes.includes('DocsLayout'), 'non-interactive: no docs routes')

    // Blog variant: only essential guides, no sample content
    assert(existsSync(resolve(nonIntDir, 'content', 'blog', 'tutorial')), 'non-interactive: guide content present')
    assert(!existsSync(resolve(nonIntDir, 'content', 'blog', 'react')), 'non-interactive: sample content absent')

    console.log(dim('     Non-interactive mode works correctly'))
  } catch (err) {
    assert(false, `non-interactive mode: ${err.message}`)
  }

  console.log()

  // ────────────────────────────────────────────────────────────────
  // Summary
  // ────────────────────────────────────────────────────────────────
  console.log()
  console.log(bold('╔══════════════════════════════════════════╗'))
  console.log(bold('║            Test Results                 ║'))
  console.log(bold('╚══════════════════════════════════════════╝'))
  console.log()
  console.log(`  Total assertions: ${PASSES.length + FAILURES.length}`)
  console.log(`  Passed:           ${green(PASSES.length)}`)
  console.log(`  Failed:           ${FAILURES.length > 0 ? red(FAILURES.length) : green('0')}`)
  console.log()

  if (FAILURES.length > 0) {
    console.log(red('  Failed assertions:'))
    for (const f of FAILURES) {
      console.log(`    ${red('✗')} ${f}`)
    }
    console.log()
    process.exit(1)
  }

  console.log(green('  All tests passed! 🎉'))
  console.log(dim(`  Temp projects: ${TEST_DIR}`))
  console.log()
}

main().catch((err) => {
  console.error(`  ${red('✗')} Fatal:`, err)
  process.exit(1)
})
