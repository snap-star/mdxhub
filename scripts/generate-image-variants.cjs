/**
 * Prebuild script: generates WebP and AVIF variants of all content images.
 *
 * This runs before `vite build` so Vite picks up the generated files and
 * includes them in the asset pipeline (with proper content hashes).
 *
 * Only generates a variant if the target file doesn't already exist,
 * so it's safe to run repeatedly.
 */

const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const ROOT = path.resolve(__dirname, '..')
const CONTENT_DIR = path.join(ROOT, 'content')

// Extensions we can generate variants FROM
const SOURCE_EXTS = ['.png', '.jpg', '.jpeg']
// Variants we generate
const VARIANTS = [
  { ext: '.webp', encoder: 'webp', options: { quality: 75, effort: 6 } },
  { ext: '.avif', encoder: 'avif', options: { quality: 50, effort: 7 } },
]

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

;(async () => {
  let generated = 0
  let skipped = 0

  for await (const filePath of walk(CONTENT_DIR)) {
    const ext = path.extname(filePath).toLowerCase()
    if (!SOURCE_EXTS.includes(ext)) continue

    const basePath = filePath.slice(0, -ext.length)

    for (const variant of VARIANTS) {
      const variantPath = `${basePath}${variant.ext}`

      if (fs.existsSync(variantPath)) {
        skipped++
        continue
      }

      try {
        const image = sharp(filePath)
        const metadata = await image.metadata()

        // Skip very small images (icons, etc.) where conversion isn't beneficial
        if ((metadata.width || 0) < 100 && (metadata.height || 0) < 100) {
          skipped++
          continue
        }

        const buffer = await image[variant.encoder](variant.options).toBuffer()
        await fs.promises.writeFile(variantPath, buffer)
        generated++

        console.log(
          `  ✓ ${path.relative(CONTENT_DIR, variantPath)}` +
          `  (${(buffer.length / 1024).toFixed(1)} KB)`,
        )
      } catch (err) {
        console.error(`  ✗ ${path.relative(CONTENT_DIR, variantPath)}: ${err.message}`)
      }
    }
  }

  const total = generated + skipped
  console.log(`\nDone — ${generated} generated, ${skipped} skipped (already exist / too small)`)
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
