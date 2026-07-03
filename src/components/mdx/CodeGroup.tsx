import React from 'react'
import { Check, Copy } from 'lucide-react'
import { extractTextContent } from '@/lib/react-utils'

// ─── Types ────────────────────────────────────────────────────────────────

/** Props carried by a CodeBlock instantiated from an MDX `<pre>` mapping */
type CodeBlockPrefabProps = {
  className?: string
  children?: React.ReactNode
  style?: React.CSSProperties
}

// ─── Helpers ──────────────────────────────────────────────────────────────

/** Get language from a pre element's className */
function getLanguage(className: string | undefined): string {
  if (!className) return 'code'
  const match = className.match(/language-([\w\-+#]+)/)
  return match ? match[1] : 'code'
}

// ─── CodeGroup Component ──────────────────────────────────────────────────

interface CodeGroupProps {
  children: React.ReactNode
}

/**
 * Multi-language code tab switcher.
 *
 * Wraps multiple fenced code blocks (` ``` ``` `) from MDX and shows a
 * single terminal-style header with language tabs. Each individual code
 * block is rendered via `React.cloneElement` with `variant="tab"`, which
 * tells `CodeBlock` to skip its own terminal header — only the shared
 * CodeGroup header appears.
 *
 * @example
 * ```mdx
 * <CodeGroup>
 *
 * ```javascript
 * function greet(name) {
 *   return `Hello, ${name}!`;
 * }
 * ```
 *
 * ```typescript
 * function greet(name: string): string {
 *   return `Hello, ${name}!`;
 * }
 * ```
 *
 * </CodeGroup>
 * ```
 */
export function CodeGroup({ children }: CodeGroupProps) {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [copied, setCopied] = React.useState(false)
  const tablistRef = React.useRef<HTMLDivElement>(null)

  // Extract code blocks from children — each child is a CodeBlock
  // component (created by the MDX `pre` → `CodeBlock` mapping).
  const blocks = React.useMemo(() => {
    const items: { lang: string; element: React.ReactElement<CodeBlockPrefabProps> }[] = []
    React.Children.forEach(children, (child) => {
      if (React.isValidElement<CodeBlockPrefabProps>(child)) {
        items.push({
          lang: getLanguage(child.props.className),
          element: child as React.ReactElement<CodeBlockPrefabProps>,
        })
      }
    })
    return items
  }, [children])

  // ── Copy active code ──────────────────────────────────────────────────
  const handleCopy = () => {
    if (blocks[activeIndex]) {
      const text = extractTextContent(blocks[activeIndex].element.props.children)
      if (text) {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    }
  }

  // ── Keyboard navigation ────────────────────────────────────────────────
  const focusTab = (index: number) => {
    document.getElementById(`codegroup-tab-${index}`)?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const next = activeIndex > 0 ? activeIndex - 1 : blocks.length - 1
      setActiveIndex(next)
      focusTab(next)
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      const next = activeIndex < blocks.length - 1 ? activeIndex + 1 : 0
      setActiveIndex(next)
      focusTab(next)
    }
  }

  // ── Guard clauses ──────────────────────────────────────────────────────
  if (blocks.length === 0) return null
  if (blocks.length === 1) {
    // Single block: render as a normal CodeBlock (no variant override)
    return <>{children}</>
  }

  const safeIndex = Math.min(activeIndex, blocks.length - 1)
  const activeBlock = blocks[safeIndex]

  // Clone the active child with variant="tab" so CodeBlock skips its header
  // We use a double cast because the child's exact prop type is unknown
  const tabChild = React.cloneElement(
    activeBlock.element as React.ReactElement<{ variant?: 'default' | 'tab' }>,
    { variant: 'tab' },
  )

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-border shadow-sm bg-card code-block-wrapper flex flex-col">
      {/* ── Single terminal-style header (traffic lights + tabs + copy) ── */}
      <div
        ref={tablistRef}
        className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30"
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-2 min-w-0">
          {/* Traffic light dots */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-400/90 shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-amber-400/90 shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-green-400/90 shadow-sm" />
          </div>

          {/* Language tabs */}
          <div className="flex overflow-x-auto">
            {blocks.map((block, i) => {
              const isActive = i === safeIndex
              return (
                <button
                  key={`${block.lang}-${i}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`codegroup-panel-${i}`}
                  id={`codegroup-tab-${i}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveIndex(i)}
                  className={`
                    text-[0.7rem] font-mono uppercase tracking-wider font-semibold
                    px-2 py-0.5 rounded border-0 bg-transparent cursor-pointer
                    transition-all duration-150 whitespace-nowrap
                    ${isActive
                      ? 'text-foreground bg-card shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    }
                  `}
                >
                  {block.lang}
                </button>
              )
            })}
          </div>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          title="Copy code"
          className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted shrink-0"
        >
          {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
        </button>
      </div>

      {/* ── Code area (CodeBlock with variant="tab" — no header, own line numbers) ── */}
      <div
        key={safeIndex}
        id={`codegroup-panel-${safeIndex}`}
        role="tabpanel"
        aria-labelledby={`codegroup-tab-${safeIndex}`}
      >
        {/* CodeBlock with variant="tab" renders only the code area + its own line numbers */}
        {tabChild}
      </div>
    </div>
  )
}
