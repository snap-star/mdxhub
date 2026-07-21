/**
 * assemble-templates.mjs
 *
 * Assembles template files from the mdxhub project into
 * packages/create-mdxhub/templates/full/ for production publishing.
 *
 * Usage:
 *   From monorepo:  node packages/create-mdxhub/scripts/assemble-templates.mjs
 *   From separate repo:  node scripts/assemble-templates.mjs --source /path/to/mdxhub
 *
 * When --source is omitted, it defaults to walking up from the script's
 * location to find the mdxhub monorepo root.
 */

import { resolve, dirname, relative } from 'path'
import { fileURLToPath } from 'url'
import {
  readFileSync,
  existsSync,
  mkdirSync,
  writeFileSync,
  copyFileSync,
  rmSync,
  readdirSync,
  statSync,
} from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PKG_ROOT = resolve(__dirname, '..')

// ─── CLI flag parsing ──────────────────────────────────────────────
function parseFlags() {
  const args = process.argv.slice(2)
  const flags = { source: null }
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--source') {
      flags.source = args[++i] || null
    }
  }
  return flags
}

// ─── Resolve source directory ──────────────────────────────────────
function resolveSource(flags) {
  if (flags.source) {
    const resolved = resolve(process.cwd(), flags.source)
    if (!existsSync(resolved)) {
      console.error(`  ✗ --source path does not exist: ${resolved}`)
      process.exit(1)
    }
    console.log(`  ℹ Using source: ${resolved}`)
    return resolved
  }
  // Default: monorepo root (two levels up from packages/create-mdxhub/)
  return resolve(PKG_ROOT, '..', '..')
}

const TEMPLATE_DIR = resolve(PKG_ROOT, 'templates', 'full')

// ─── Glob matching ──────────────────────────────────────────────────

function globFiles(pattern, rootDir) {
  const results = []
  const parts = pattern.split('/')
  const hasGlob = parts.some((p) => p.includes('*') || p.includes('**'))

  if (!hasGlob) {
    const fullPath = resolve(rootDir, pattern)
    if (existsSync(fullPath)) results.push(fullPath)
    return results
  }

  let baseParts = []
  for (const part of parts) {
    if (part.includes('*')) break
    baseParts.push(part)
  }
  const baseDir = resolve(rootDir, ...baseParts)
  if (!existsSync(baseDir)) return results

  function walk(dir) {
    let entries
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      const fullPath = resolve(dir, entry.name)
      const relPath = relative(rootDir, fullPath)
      if (entry.isDirectory()) {
        walk(fullPath)
      } else if (matchGlob(relPath, pattern)) {
        results.push(fullPath)
      }
    }
  }

  walk(baseDir)
  return results
}

function matchGlob(filePath, pattern) {
  const regexStr = pattern
    .replace(/\./g, '\\.')
    .replace(/\*\*/g, '<<<DOUBLESTAR>>>')
    .replace(/\*/g, '[^/]*')
    .replace(/<<<DOUBLESTAR>>>/g, '.*')
  return new RegExp(`^${regexStr}$`).test(filePath)
}

// ─── Binary extensions ──────────────────────────────────────────────

const BINARY_EXTS = [
  'png', 'jpg', 'jpeg', 'gif', 'webp', 'avif',
  'ico', 'woff2', 'woff', 'ttf', 'otf', 'eot',
  'mp4', 'webm', 'svg',
]

// ─── Main ────────────────────────────────────────────────────────────

async function main() {
  const flags = parseFlags()
  const PROJECT_ROOT = resolveSource(flags)

  console.log('  ℹ Assembling templates...')

  const manifestPath = resolve(PKG_ROOT, 'src', 'manifest.js')
  const mod = await import(manifestPath)
  const manifest = mod.MANIFEST

  const allFilePatterns = mod.getAllFilePatterns()

  // Clean & recreate template directory
  if (existsSync(TEMPLATE_DIR)) {
    console.log('  ℹ Cleaning existing template directory...')
    rmSync(TEMPLATE_DIR, { recursive: true, force: true })
  }
  mkdirSync(TEMPLATE_DIR, { recursive: true })

  let copiedCount = 0
  let skippedCount = 0
  let errorCount = 0

  for (const pattern of allFilePatterns) {
    // Skip generated files (they are created by the CLI)
    if (manifest.generated.includes(pattern)) continue

    const sources = globFiles(pattern, PROJECT_ROOT)
    if (sources.length === 0) {
      skippedCount++
      continue
    }

    for (const src of sources) {
      try {
        const relPath = relative(PROJECT_ROOT, src)
        const dest = resolve(TEMPLATE_DIR, relPath)
        const destDir = dirname(dest)
        if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true })

        // Don't copy binary files from node_modules or build artifacts
        if (relPath.includes('node_modules') || relPath.includes('.react-router')) continue

        const ext = src.split('.').pop().toLowerCase()
        if (BINARY_EXTS.includes(ext)) {
          copyFileSync(src, dest)
        } else {
          // Copy file as-is — no global find-and-replace
          // The CLI handles project-specific customization (package.json name, site.config.json)
          const content = readFileSync(src, 'utf-8')
          writeFileSync(dest, content, 'utf-8')
        }
        copiedCount++
      } catch (err) {
        console.error(`  ✗ Error copying ${src}: ${err.message}`)
        errorCount++
      }
    }
  }

  // Also copy the app/ directory and @/ directory (aliased paths)
  // Skip generated files (they are created by the CLI with variant-aware content)
  for (const extra of ['app', '@']) {
    const srcDir = resolve(PROJECT_ROOT, extra)
    const destDir = resolve(TEMPLATE_DIR, extra)
    if (existsSync(srcDir)) {
      copyDirRecursive(srcDir, destDir, manifest.generated, PROJECT_ROOT)
      copiedCount++
    }
  }

  console.log(`  ✓ Templates assembled:`)
  console.log(`     Files copied: ${green(copiedCount)}`)
  console.log(`     Skipped:      ${skippedCount > 0 ? yellow(skippedCount) : '0'}`)
  console.log(`     Errors:       ${errorCount > 0 ? red(errorCount) : '0'}`)
  console.log(`     Location:     ${TEMPLATE_DIR}`)
}

function copyDirRecursive(src, dest, skipFiles = [], projectRoot) {
  if (!existsSync(dest)) mkdirSync(dest, { recursive: true })
  const entries = readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = resolve(src, entry.name)
    const destPath = resolve(dest, entry.name)
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath, skipFiles, projectRoot)
    } else if (entry.isFile()) {
      // Skip generated files (they'll be created by the CLI)
      const root = projectRoot || resolve(PKG_ROOT, '..', '..')
      const relPath = relative(root, srcPath).replace(/\\/g, '/')
      if (skipFiles.some((sf) => relPath === sf || relPath.endsWith('/' + sf))) {
        continue
      }
      copyFileSync(srcPath, destPath)
    }
  }
}

const green = (s) => `\x1b[32m${s}\x1b[0m`
const yellow = (s) => `\x1b[33m${s}\x1b[0m`
const red = (s) => `\x1b[31m${s}\x1b[0m`

main().catch((err) => {
  console.error('  ✗ Fatal error:', err.message)
  process.exit(1)
})
