import React from 'react'
import { Check, Copy } from 'lucide-react'

type LineDiffType = 'add' | 'remove' | null

function getLineElements(children: React.ReactNode): React.ReactElement[] {
  if (!React.isValidElement<{ children?: React.ReactNode }>(children)) return []
  const lineNodes = children.props.children
  if (!lineNodes) return []
  const nodes = Array.isArray(lineNodes) ? lineNodes : [lineNodes]
  return nodes.filter((n): n is React.ReactElement => React.isValidElement(n))
}

function getLineDiffTypes(lines: React.ReactElement[]): LineDiffType[] {
  return lines.map((line) => {
    const p = line.props as Record<string, unknown>
    if (p['data-diff-add'] !== undefined) return 'add'
    if (p['data-diff-remove'] !== undefined) return 'remove'
    return null
  })
}

function getLang(className: string | undefined): string {
  if (!className) return 'code'
  const match = className.match(/language-([\w\-+#]+)/)
  return match ? match[1] : 'code'
}

interface Block {
  lang: string
  element: React.ReactElement
}

export function CodeGroup({ children }: { children: React.ReactNode }) {
  const [active, setActive] = React.useState(0)
  const [copied, setCopied] = React.useState(false)
  const preRef = React.useRef<HTMLPreElement>(null)
  const tabRef = React.useRef<HTMLDivElement>(null)

  const blocks = React.useMemo(() => {
    const items: Block[] = []
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        items.push({ lang: getLang(child.props.className), element: child })
      }
    })
    return items
  }, [children])

  const idx = Math.min(active, blocks.length - 1)
  const block = blocks[idx]
  const code = block?.element?.props?.children
  const lines = React.useMemo(() => getLineElements(code), [code])
  const count = lines.length
  const diffs = React.useMemo(() => getLineDiffTypes(lines), [lines])
  const nums = React.useMemo(() => Array.from({ length: Math.max(count, 1) }, (_, i) => i + 1), [count])

  const handleCopy = () => {
    if (!preRef.current) return
    navigator.clipboard.writeText(preRef.current.textContent || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const focusTab = (i: number) => document.getElementById(`cgt-${i}`)?.focus()

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const next = idx > 0 ? idx - 1 : blocks.length - 1
      setActive(next)
      focusTab(next)
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      const next = idx < blocks.length - 1 ? idx + 1 : 0
      setActive(next)
      focusTab(next)
    }
  }

  if (blocks.length === 0) return null
  if (blocks.length === 1) return <>{children}</>
  if (!block || !code) return null

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-border shadow-sm bg-card code-block-wrapper flex flex-col">
      <div
        ref={tabRef}
        className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border"
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-400/90 shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-amber-400/90 shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-green-400/90 shadow-sm" />
          </div>
          <div className="flex overflow-x-auto">
            {blocks.map((b, i) => (
              <button
                key={`${b.lang}-${i}`}
                role="tab"
                aria-selected={i === idx}
                aria-controls={`cgp-${i}`}
                id={`cgt-${i}`}
                tabIndex={i === idx ? 0 : -1}
                onClick={() => setActive(i)}
                className={`
                  text-[0.7rem] font-mono uppercase tracking-wider font-semibold
                  px-2 py-0.5 rounded border-0 bg-transparent cursor-pointer
                  transition-all duration-150 whitespace-nowrap
                  ${i === idx
                    ? 'text-foreground bg-card shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }
                `}
              >
                {b.lang}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleCopy}
          title="Copy code"
          className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted shrink-0"
        >
          {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
        </button>
      </div>

      <div
        key={idx}
        id={`cgp-${idx}`}
        role="tabpanel"
        aria-labelledby={`cgt-${idx}`}
        className="relative flex w-full"
      >
        <div className="code-line-gutter" aria-hidden="true">
          {nums.map((n, i) => {
            const d = i < diffs.length ? diffs[i] : null
            const isAdd = d === 'add'
            const isRemove = d === 'remove'
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
          ref={preRef}
          className={`${block.element.props.className ?? ''} code-pre`}
          style={block.element.props.style}
        >
          {code}
        </pre>
      </div>
    </div>
  )
}
