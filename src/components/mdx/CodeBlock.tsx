import React from 'react'
import { Check, Copy } from 'lucide-react'

// ─── Helpers ──────────────────────────────────────────────────────────────

type LineDiffType = 'add' | 'remove' | null

/** Get the `<span class="line">` elements from the Shiki `<code>` block. */
function getLineElements(children: React.ReactNode): React.ReactElement[] {
  if (!React.isValidElement<{ children?: React.ReactNode }>(children)) return []
  const lineNodes = children.props.children
  if (!lineNodes) return []
  const nodes = Array.isArray(lineNodes) ? lineNodes : [lineNodes]
  return nodes.filter((n): n is React.ReactElement => React.isValidElement(n))
}

/**
 * Check Shiki <span> elements for `data-diff-add` / `data-diff-remove`
 * attributes set by transformerNotationDiff, instead of parsing classNames.
 */
function getLineDiffTypes(lines: React.ReactElement[]): LineDiffType[] {
  return lines.map((line) => {
    const p = line.props as Record<string, unknown>
    if (p['data-diff-add'] !== undefined) return 'add'
    if (p['data-diff-remove'] !== undefined) return 'remove'
    return null
  })
}

// ─── CodeBlock Component ──────────────────────────────────────────────────

export function CodeBlock(props: React.HTMLAttributes<HTMLPreElement> & { className?: string; children?: React.ReactElement; style?: React.CSSProperties }) {

  const [copied, setCopied] = React.useState(false)
  const codeRef = React.useRef<HTMLPreElement>(null)

  const handleCopy = () => {
    if (codeRef.current) {
      const text = codeRef.current.textContent || ''
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Find language class from either <pre> or inner <code>
  const preClassName = typeof props.className === 'string' ? props.className : ''
  const child = props.children
  const childProps = React.isValidElement<{ className?: string }>(child) ? child.props : {}
  const codeClassName = typeof childProps.className === 'string' ? childProps.className : ''
  const combinedClasses = `${preClassName} ${codeClassName}`

  // Match 'language-js', 'language-c++', 'language-typescript', etc.
  const langMatch = combinedClasses.match(/language-([\w\-+#]+)/)
  const lang = langMatch ? langMatch[1] : 'text'

  // ── Count lines & detect diff types ─────────────────────────────────────
  const lineElements = React.useMemo(() => getLineElements(props.children), [props.children])
  const linesCount = lineElements.length
  const lineDiffTypes = React.useMemo(() => getLineDiffTypes(lineElements), [lineElements])

  const lineNumbers = React.useMemo(
    () => Array.from({ length: Math.max(linesCount, 1) }, (_, i) => i + 1),
    [linesCount],
  )

  const gutterWidth = 'calc(3ch + 1.25rem)'

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-border shadow-sm bg-card code-block-wrapper flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400/90 shadow-sm" />
          <div className="w-3 h-3 rounded-full bg-amber-400/90 shadow-sm" />
          <div className="w-3 h-3 rounded-full bg-green-400/90 shadow-sm" />
        </div>
        <span className="text-[0.7rem] font-mono text-muted-foreground uppercase tracking-wider font-semibold">
          {lang}
        </span>
        <button
          onClick={handleCopy}
          title="Copy code"
          className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
        >
          {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
        </button>
      </div>
      <div className="relative flex w-full">
        <div
          className="code-line-gutter"
          style={{ minWidth: gutterWidth }}
          aria-hidden="true"
        >
          {lineNumbers.map((n, i) => {
            const diffType = i < lineDiffTypes.length ? lineDiffTypes[i] : null
            const isAdd = diffType === 'add'
            const isRemove = diffType === 'remove'

            return (
              <div
                key={n}
                className={`code-line-number${isAdd ? ' diff-add' : ''}${isRemove ? ' diff-remove' : ''}`}
              >
                {isAdd ? '+' : isRemove ? '-' : n}
              </div>
            )
          })}
        </div>
        <pre
          ref={codeRef}
          className={`${preClassName} code-pre`}
          style={props.style}
        >
          {props.children}
        </pre>
      </div>
    </div>
  )
}
