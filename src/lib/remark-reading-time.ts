// ─── Remark Plugin: Compute Reading Time ──────────────────────────────────
// Runs at build time (once per file), injects readingTime into YAML frontmatter
// so it's available as mod.frontmatter.readingTime with zero runtime cost.

import type { Plugin } from 'unified'
import type { Root } from 'mdast'

export const remarkReadingTime: Plugin<[], Root> = () => {
  return (tree, file) => {
    const content = String(file.value)

    // Skip if readingTime is already explicitly set in frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
    if (!frontmatterMatch) return
    if (/^readingTime\s*:/m.test(frontmatterMatch[1])) return

    // Strip frontmatter and import statements
    const body = content
      .replace(/^---[\s\S]*?---\n*/, '')
      .replace(/^import\s+.*$/gm, '')

    // Count code blocks separately (code is read slower)
    const codeBlocks = body.match(/```[\s\S]*?```/g) ?? []
    const codeWords = codeBlocks
      .join(' ')
      .replace(/```\w*/g, '')
      .trim()
      .split(/\s+/)
      .filter(Boolean).length

    // Prose (everything outside code blocks)
    const prose = body.replace(/```[\s\S]*?```/g, '')

    // CJK characters vs Latin words
    const cjkChars = (prose.match(
      /[\u4e00-\u9fff\u3400-\u4dbf\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/g,
    ) ?? []).length

    const latinWords = prose
      .replace(
        /[\u4e00-\u9fff\u3400-\u4dbf\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/g,
        '',
      )
      .trim()
      .split(/\s+/)
      .filter(Boolean).length

    // Approximate reading speeds: 238 wpm Latin, 500 cpm CJK, code is ~40% speed of prose
    const minutes =
      latinWords / 238 + cjkChars / 500 + (codeWords * 0.4) / 238

    const readingTime = Math.max(1, Math.round(minutes * 2) / 2) // round to 0.5

    // Inject into the YAML node so remarkMdxFrontmatter picks it up
    const yamlNode = tree.children.find(
      (n): n is { type: 'yaml'; value: string } => n.type === 'yaml',
    )
    if (yamlNode) {
      yamlNode.value = yamlNode.value.trimEnd() + `\nreadingTime: ${readingTime}`
    }
  }
}
