/**
 * watch-content.cjs
 *
 * Watches the content/ directory for file changes and automatically
 * regenerates content-index.json (and RSS/sitemap) so the dev server
 * always serves fresh data.
 *
 * Usage: node scripts/watch-content.cjs
 *
 * Run alongside `pnpm run dev` (in a separate terminal).
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const ROOT = path.resolve(__dirname, '..')
const CONTENT_DIR = path.join(ROOT, 'content')
const PUBLIC_DIR = path.join(ROOT, 'public')

const SCRIPTS = [
  { name: 'Content Index', cmd: 'node scripts/generate-content-index.cjs', required: true },
  { name: 'RSS',            cmd: 'node scripts/generate-rss.cjs' },
  { name: 'Sitemap',        cmd: 'node scripts/generate-sitemap.cjs' },
]

// ─── Debounce ──────────────────────────────────────────────────────────────

let debounceTimer = null
const DEBOUNCE_MS = 300

function runScripts(changePath) {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    console.log(`\n  🔄 Content changed: ${path.relative(CONTENT_DIR, changePath)}`)
    for (const script of SCRIPTS) {
      try {
        execSync(script.cmd, { cwd: ROOT, stdio: 'inherit' })
      } catch (err) {
        console.error(`  ✗ ${script.name} failed: ${err.message}`)
        if (script.required) {
          console.error('  ✗ Required script failed — aborting watch cycle.')
          return
        }
      }
    }
    console.log(`  ✓ Regeneration complete\n`)
  }, DEBOUNCE_MS)
}

// ─── Watcher ───────────────────────────────────────────────────────────────

console.log(`\n  👀 Watching ${path.relative(ROOT, CONTENT_DIR)}/ for changes...`)
console.log(`  ℹ Press Ctrl+C to stop\n`)

// Track which files we already know about to avoid duplicate events on initial scan
const knownFiles = new Set()

// Walk content/ to register initial files and set up watches
function walkAndWatch(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      // Watch subdirectories recursively (fs.watch with recursive is inconsistent on all platforms)
      walkAndWatch(fullPath)
    } else if (entry.isFile() && /\.(md|mdx|yaml|yml)$/i.test(entry.name)) {
      knownFiles.add(fullPath)
    }
  }
}

// Watch each subdirectory individually for reliable cross-platform support
function setupWatchers(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      try {
        // Non-recursive per-directory watches as fallback (no { recursive: true })
        fs.watch(fullPath, (eventType, filename) => {
          if (!filename) return
          const full = path.join(fullPath, filename)
          // Only trigger on content files
          if (/\.(md|mdx|yaml|yml)$/i.test(filename)) {
            runScripts(full)
          }
        })
      } catch {
        // Recurse into subdirectories to set up watches manually
        setupWatchers(fullPath)
      }
    }
  }
}

try {
  walkAndWatch(CONTENT_DIR)
  console.log(`  ✓ Watching ${knownFiles.size} content files`)

  // Set up recursive watches on top-level content directories
  const topDirs = fs.readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => path.join(CONTENT_DIR, d.name))

  for (const dir of topDirs) {
    try {
      fs.watch(dir, { recursive: true }, (eventType, filename) => {
        if (!filename) return
        if (/\.(md|mdx|yaml|yml)$/i.test(filename)) {
          runScripts(path.join(dir, filename))
        }
      })
    } catch (err) {
      console.warn(`  ⚠ Could not watch ${path.relative(ROOT, dir)}: ${err.message}`)
      setupWatchers(dir)
    }
  }
} catch (err) {
  console.error(`  ✗ Failed to start watcher: ${err.message}`)
  process.exit(1)
}

// ─── Graceful shutdown ─────────────────────────────────────────────────────

process.on('SIGINT', () => {
  console.log('\n  👋 Watcher stopped.\n')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n  👋 Watcher stopped.\n')
  process.exit(0)
})
