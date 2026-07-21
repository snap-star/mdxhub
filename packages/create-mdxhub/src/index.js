#!/usr/bin/env node

/**
 * create-mdxhub — CLI entry point
 *
 * Interactive:  create-mdxhub
 * Non-interactive (CI):  create-mdxhub --yes --name my-site --template blog --pm pnpm
 *
 * Flags:
 *   --yes, -y           Skip all prompts (use defaults or flag values)
 *   --name <name>       Project name (default: my-mdxhub-site)
 *   --template <t>      Template variant: full, blog, docs (default: full)
 *   --pm <pm>           Package manager: pnpm, npm, yarn (default: pnpm)
 *   --skip-install      Skip dependency installation (for CI/testing)
 *   --help, -h          Show this help
 */

import { resolve, dirname, relative } from 'path'
import { fileURLToPath } from 'url'
import { readFileSync, existsSync, mkdirSync, writeFileSync, copyFileSync, rmSync, readdirSync } from 'fs'

// ─── Generated .gitignore content ─────────────────────────────────
function generateGitignore() {
  return `# Dependencies
node_modules

# Build output
dist
build
.react-router

# TypeScript
*.tsbuildinfo
.vite

# Environment
.env
.env.*

# Testing
coverage

# Logs
*.log
npm-debug.log*
pnpm-debug.log*

# OS
.DS_Store
Thumbs.db

# Editor
.vscode/*
!.vscode/extensions.json
.idea
*.sw?
`
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const PKG_ROOT = resolve(__dirname, '..')

// ─── CLI flag parsing ──────────────────────────────────────────────
function parseFlags() {
  const args = process.argv.slice(2)
  const flags = {    yes: false,
    help: false,
    name: null,
    template: null,
    pm: null,
    skipInstall: false,
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    switch (arg) {
      case '--yes':
      case '-y':
        flags.yes = true
        break
      case '--help':
      case '-h':
        flags.help = true
        break
      case '--name':
        flags.name = args[++i] || null
        break
      case '--template':
        flags.template = args[++i] || null
        break
      case '--pm':
        flags.pm = args[++i] || null
        break
      case '--skip-install':
        flags.skipInstall = true
        break
      default:
        // Unknown flag, ignore
        break
    }
  }

  // Validate
  if (flags.template && !['full', 'blog', 'docs'].includes(flags.template)) {
    console.error(`  ✗ Invalid --template "${flags.template}". Must be: full, blog, docs`)
    process.exit(1)
  }
  if (flags.pm && !['pnpm', 'npm', 'yarn'].includes(flags.pm)) {
    console.error(`  ✗ Invalid --pm "${flags.pm}". Must be: pnpm, npm, yarn`)
    process.exit(1)
  }
  if (flags.name && !/^[a-z0-9-_.]+$/i.test(flags.name)) {
    console.error(`  ✗ Invalid --name "${flags.name}". Only letters, numbers, hyphens, underscores, dots allowed`)
    process.exit(1)
  }

  return flags
}

function showHelp() {
  console.log(`
  create-mdxhub — Scaffold an MDXHub project

  USAGE
    $ create-mdxhub                    # Interactive mode
    $ create-mdxhub --yes              # Non-interactive (CI) mode
    $ npx create-mdxhub --yes --name my-site --template blog --pm pnpm

  FLAGS
    --yes, -y           Skip all prompts (use defaults or flag values)
    --name <name>       Project name (default: my-mdxhub-site)
    --template <t>      Template variant: full, blog, docs (default: full)
    --pm <pm>           Package manager: pnpm, npm, yarn (default: pnpm)
    --skip-install      Skip dependency installation (for CI/testing)
    --help, -h          Show this help
`)
}

// ─── Resolve source root ───────────────────────────────────────────
function resolveSourceRoot() {
  const bundled = resolve(PKG_ROOT, 'templates', 'full')
  if (existsSync(bundled) && readdirSync(bundled).length > 5) return bundled
  let dir = resolve(PKG_ROOT, '..')
  let safety = 0
  while (dir !== '/' && safety < 10) {
    const pkg = resolve(dir, 'package.json')
    if (existsSync(pkg)) {
      const { name } = JSON.parse(readFileSync(pkg, 'utf-8'))
      if (name === 'mdxhub') return dir
    }
    dir = resolve(dir, '..')
    safety++
  }
  return bundled
}

// ─── Glob ──────────────────────────────────────────────────────────
function globFiles(pattern, rootDir) {
  const parts = pattern.split('/')
  if (!parts.some((p) => p.includes('*'))) {
    const fp = resolve(rootDir, pattern)
    return existsSync(fp) ? [fp] : []
  }
  const baseParts = []
  for (const p of parts) { if (p.includes('*')) break; baseParts.push(p) }
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

const BINARY_EXTS = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'avif', 'ico', 'woff2', 'woff', 'ttf', 'otf', 'eot', 'mp4', 'webm', 'svg'])
const isBinary = (p) => BINARY_EXTS.has(p.split('.').pop().toLowerCase())

// ─── Variant-aware Navbar patching ─────────────────────────────────
function patchNavbar(targetDir, variant) {
  const path = resolve(targetDir, 'src', 'components', 'common', 'Navbar.tsx')
  if (!existsSync(path)) return
  let content = readFileSync(path, 'utf-8')
  const blogLine = "  { href: '/blog', key: 'nav.blog', icon: Rss },"
  const docsLine = "  { href: '/docs', key: 'nav.docs', icon: BookOpen },"
  if (variant === 'blog') { content = content.replace(docsLine + '\n', '') }
  if (variant === 'docs') { content = content.replace(blogLine + '\n', '') }
  writeFileSync(path, content, 'utf-8')
}

const FOOTER_BLOG_SECTION = `            {\n              titleKey: 'footer.blogTitle',\n              links: [\n                { labelKey: 'footer.allPosts', href: '/blog' },\n                { labelKey: 'footer.categories', href: '/blog/category' },\n                { labelKey: 'footer.tutorials', href: '/blog/category/Tutorial' },\n                { labelKey: 'footer.guides', href: '/blog/category/Guide' },\n              ],\n            },`

const FOOTER_DOCS_SECTION = `            {\n              titleKey: 'footer.docsTitle',\n              links: [\n                { labelKey: 'footer.introduction', href: '/docs/1-introduction' },\n                { labelKey: 'footer.installation', href: '/docs/2-guides/installation' },\n                { labelKey: 'footer.deployment', href: '/docs/3-deployment/hosting' },\n                { labelKey: 'footer.mdxGuide', href: '/blog/creating-posts-guide' },\n              ],\n            },`

function patchFooter(targetDir, variant) {
  const path = resolve(targetDir, 'src', 'components', 'common', 'Footer.tsx')
  if (!existsSync(path)) return
  let content = readFileSync(path, 'utf-8')
  if (variant === 'blog') { content = content.replace(FOOTER_DOCS_SECTION + '\n', '') }
  if (variant === 'docs') { content = content.replace(FOOTER_BLOG_SECTION + '\n', '') }
  writeFileSync(path, content, 'utf-8')
}

// ─── Scaffolding logic (shared by interactive + non-interactive) ──
async function scaffold(projectName, variant, packageManager) {
  const sourceRoot = resolveSourceRoot()
  const targetDir = resolve(process.cwd(), projectName)

  // Handle existing directory
  if (existsSync(targetDir)) {
    rmSync(targetDir, { recursive: true, force: true })
  }

  const { resolveFiles, generateRoutesConfig } = await import(resolve(PKG_ROOT, 'src', 'manifest.js'))
  const filesToCopy = resolveFiles(variant)

  let copied = 0
  let skipped = 0
  const errs = []

  for (const pattern of filesToCopy) {
    const sources = globFiles(pattern, sourceRoot)
    if (sources.length === 0) { skipped++; continue }
    for (const src of sources) {
      const rel = relative(sourceRoot, src)
      const dest = resolve(targetDir, rel)
      const destDir = dirname(dest)
      if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true })
      try {
        if (isBinary(src)) { copyFileSync(src, dest) }
        else { writeFileSync(dest, readFileSync(src, 'utf-8'), 'utf-8') }
        copied++
      } catch (err) { errs.push({ file: rel, error: err.message }) }
    }
  }

  // Generate routes.ts
  const routesDir = resolve(targetDir, 'app')
  if (!existsSync(routesDir)) mkdirSync(routesDir, { recursive: true })
  writeFileSync(resolve(targetDir, 'app/routes.ts'), generateRoutesConfig(variant), 'utf-8')

  // Generate .gitignore (not copied from template — project-specific)
  writeFileSync(resolve(targetDir, '.gitignore'), generateGitignore(), 'utf-8')

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

  // Patch Navbar & Footer
  if (variant !== 'full') {
    patchNavbar(targetDir, variant)
    patchFooter(targetDir, variant)
  }

  // Customize package.json
  const siteTitle = projectName.replace(/[-_.]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()).trim()
  const siteDesc = `A ${variant === 'blog' ? 'blog' : variant === 'docs' ? 'documentation site' : 'blog and documentation site'} built with MDXHub`

  const pkgPath = resolve(targetDir, 'package.json')
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
    pkg.name = projectName
    pkg.private = true
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8')
  }

  const cfgPath = resolve(targetDir, 'site.config.json')
  if (existsSync(cfgPath)) {
    const cfg = JSON.parse(readFileSync(cfgPath, 'utf-8'))
    cfg.title = siteTitle
    cfg.titleTemplate = `%s | ${siteTitle}`
    cfg.description = siteDesc
    writeFileSync(cfgPath, JSON.stringify(cfg, null, 2) + '\n', 'utf-8')
  }

  return { targetDir, copied, skipped, errors: errs, projectName, variant }
}

// ─── Main CLI ─────────────────────────────────────────────────────
async function main() {
  const flags = parseFlags()

  // Show help and exit
  if (flags.help) {
    showHelp()
    process.exit(0)
  }

  // ─── Non-interactive mode ──────────────────────────────────────
  if (flags.yes) {
    const projectName = flags.name || 'my-mdxhub-site'
    const variant = flags.template || 'full'
    const packageManager = flags.pm || 'pnpm'

    console.log(`  create-mdxhub — non-interactive mode`)
    console.log(`  Project: ${projectName} | Template: ${variant} | PM: ${packageManager}`)
    console.log()

    const result = await scaffold(projectName, variant, packageManager)

    console.log(`  ✅ Project scaffolded: ${result.targetDir}`)
    console.log(`     Files copied: ${result.copied}`)
    console.log()

    // Install dependencies
    const installCmds = { pnpm: 'pnpm install', npm: 'npm install', yarn: 'yarn' }
    const cmd = installCmds[packageManager] || 'npm install'
    if (!flags.skipInstall) {
      console.log(`  📦 Installing dependencies (${packageManager})...`)
      try {
        const { execSync } = await import('child_process')
        execSync(cmd, { cwd: result.targetDir, stdio: 'inherit' })
        console.log(`  ✅ Dependencies installed!`)
      } catch {
        console.log(`  ⚠ Install failed. Run manually: cd ${projectName} && ${cmd}`)
      }
    } else {
      console.log(`  (skipping dependency installation)`)
    }

    console.log()
    console.log(`  🎉 Done! cd ${projectName} && pnpm dev`)
    return
  }

  // ─── Interactive mode ──────────────────────────────────────────
  const prompts = (await import('prompts')).default
  const k = (await import('kleur')).default

  console.log()
  console.log(k.bold().blue('  ╭─────────────────────────────────────╮'))
  console.log(k.bold().blue('  │         create-mdxhub 🚀            │'))
  console.log(k.bold().blue('  │      create your project            │'))
  console.log(k.bold().blue('  │      With MDXHub Template           │'))
  console.log(k.bold().blue('  ╰─────────────────────────────────────╯'))
  console.log()

  const { projectName = 'my-mdxhub-site' } = await prompts({
    type: 'text',
    name: 'projectName',
    message: 'What is your project name?',
    initial: 'my-mdxhub-site',
    validate: (v) => {
      if (!v.trim()) return 'Please enter a project name'
      if (!/^[a-z0-9-_.]+$/i.test(v)) return 'Only letters, numbers, hyphens, underscores, and dots allowed'
      return true
    },
  })

  const targetDir = resolve(process.cwd(), projectName)
  if (existsSync(targetDir)) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: `Directory "${projectName}" already exists. Overwrite?`,
      initial: false,
    })
    if (!overwrite) { console.log(k.yellow('  ✋ Aborted.')); process.exit(0) }
    rmSync(targetDir, { recursive: true, force: true })
  }

  const { variant = 'full' } = await prompts({
    type: 'select',
    name: 'variant',
    message: 'Which template would you like to scaffold?',
    choices: [
      { title: `${k.bold('Full')}  ${k.dim('Blog + Docs + About + all features')}`, value: 'full', description: 'Complete site with blog, documentation, about page, search, and all features' },
      { title: `${k.bold('Blog')}  ${k.dim('Blog-only site')}`, value: 'blog', description: 'Blog with categories, tags, series, author pages, and search' },
      { title: `${k.bold('Docs')}  ${k.dim('Documentation-only site')}`, value: 'docs', description: 'Docs site with sidebar navigation, section grouping, and Prev/Next nav' },
    ],
    initial: 0,
  })

  const { packageManager = 'pnpm' } = await prompts({
    type: 'select',
    name: 'packageManager',
    message: 'Which package manager do you want to use?',
    choices: [
      { title: 'pnpm  (recommended)', value: 'pnpm' },
      { title: 'npm', value: 'npm' },
      { title: 'yarn', value: 'yarn' },
    ],
    initial: 0,
  })

  const labels = { full: 'Full site', blog: 'Blog only', docs: 'Docs only' }
  console.log()
  console.log(k.bold('  📦 Scaffolding summary:'))
  console.log(`     ${k.dim('Project:')}  ${k.cyan(projectName)}`)
  console.log(`     ${k.dim('Variant:')}  ${k.cyan(variant)} (${labels[variant]})`)
  console.log(`     ${k.dim('PM:')}       ${k.cyan(packageManager)}`)
  console.log(`     ${k.dim('Output:')}   ${k.cyan(targetDir)}`)
  console.log()

  const { confirm } = await prompts({
    type: 'confirm',
    name: 'confirm',
    message: 'Proceed with scaffolding?',
    initial: true,
  })
  if (!confirm) { console.log(k.yellow('  ✋ Aborted.')); process.exit(0) }

  // Run scaffolding
  const result = await scaffold(projectName, variant, packageManager)

  // Summary
  console.log()
  console.log(k.green('  ✅ Project scaffolded successfully!'))
  if (result.errors.length) {
    console.log(k.yellow(`  ⚠ ${result.errors.length} file error(s):`))
    result.errors.slice(0, 5).forEach((e) => console.log(k.dim(`     - ${e.file}: ${e.error}`)))
    if (result.errors.length > 5) console.log(k.dim(`     ... and ${result.errors.length - 5} more`))
  }
  console.log()
  console.log(k.dim(`     Files copied: ${result.copied}`))
  console.log(k.dim(`     Template:      ${variant}`))
  console.log()

  // Install dependencies
  const installCmds = { pnpm: 'pnpm install', npm: 'npm install', yarn: 'yarn' }
  const cmd = installCmds[packageManager] || 'npm install'

  console.log(k.bold(`  📦 Installing dependencies (${packageManager})...`))
  console.log()
  try {
    const { execSync } = await import('child_process')
    execSync(cmd, { cwd: result.targetDir, stdio: 'inherit' })
    console.log()
    console.log(k.green('  ✅ Dependencies installed!'))
  } catch {
    console.log(k.yellow(`  ⚠ Install failed. Run manually: cd ${projectName} && ${cmd}`))
  }

  // Next steps
  console.log()
  console.log(k.bold().cyan('  🎉 Your MDXHub project is ready!'))
  console.log()
  console.log(k.bold('  Next steps:'))
  console.log()
  console.log(`     ${k.cyan('$')} ${k.bold(`cd ${projectName}`)}`)
  console.log(`     ${k.cyan('$')} ${k.bold('pnpm dev')}      ${k.dim('# Start the dev server')}`)
  console.log(`     ${k.cyan('$')} ${k.bold('pnpm build')}    ${k.dim('# Build for production')}`)
  console.log()
  console.log(k.dim('  📖 Docs:   https://mdxhub.vercel.app/docs'))
  console.log(k.dim('  🐛 Issues: https://github.com/snap-star/mdxhub/issues'))
  console.log()
}

main().catch((err) => {
  console.error('  ✗ Fatal error:', err.message)
  process.exit(1)
})
