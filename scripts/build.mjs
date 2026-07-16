/**
 * build.mjs — build orchestrator
 *
 * Replaces the long `&&`-chained script calls in package.json with
 * a single entry point. Run modes:
 *
 *   node scripts/build.mjs      → content index only
 *   node scripts/build.mjs dev   → content index + rss + sitemap
 *   node scripts/build.mjs build → all build steps
 *
 * The individual .cjs scripts still exist — this just centralizes
 * the pipeline wiring so package.json stays clean.
 */

import { execSync } from 'child_process'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

function run(cmd) {
  execSync(cmd, { cwd: ROOT, stdio: 'inherit' })
}

const mode = process.argv[2]

if (mode === 'build') {
  run('node scripts/generate-content-index.cjs')
  run('node scripts/generate-rss.cjs')
  run('node scripts/generate-sitemap.cjs')
  run('node scripts/generate-image-variants.cjs')
} else if (mode === 'dev') {
  run('node scripts/generate-content-index.cjs')
  run('node scripts/generate-rss.cjs')
  run('node scripts/generate-sitemap.cjs')
} else {
  // Default: content index only, used by `generate:content-index`
  run('node scripts/generate-content-index.cjs')
}
