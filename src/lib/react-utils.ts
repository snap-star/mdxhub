import React from 'react'

/**
 * Extract plain text from a React node tree.
 *
 * Recursively traverses elements, arrays, and primitives to produce a
 * flat text string. Useful for counting lines in code blocks and
 * extracting text content for clipboard operations.
 *
 * @example
 * ```ts
 * const text = extractTextContent(<pre><code><span>hello</span></code></pre>)
 * // → "hello"
 * ```
 */
export function extractTextContent(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') return String(node)
  if (node == null) return ''
  if (Array.isArray(node)) return node.map(extractTextContent).join('')
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) return extractTextContent(node.props.children)
  return ''
}
