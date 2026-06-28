import React from 'react'
import { Link, useLocation } from 'react-router'
import { Badge } from './Badge'
import { Callout } from './Callout'
import { ProfileBadge } from './ProfileBadge'
import { VideoEmbed } from './VideoEmbed'
import { Tooltip } from './Tooltip'
import { CCLicense } from '../blog/CCLicense'
import { AuthorCard } from '../blog/AuthorCard'
import { resolveContentAssetUrl } from '@/lib/utils'
import { openLightbox } from './ImageLightbox'
import { OptimizedImage } from './OptimizedImage'

import { Check, Copy } from 'lucide-react'

// ─── Helpers ──────────────────────────────────────────────────────────────

/** Extract plain text from React node tree (for counting code lines) */
function extractTextContent(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') return String(node)
  if (node == null) return ''
  if (Array.isArray(node)) return node.map(extractTextContent).join('')
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) return extractTextContent(node.props.children)
  return ''
}

type LineDiffType = 'add' | 'remove' | null

/**
 * Traverse the Shiki <code> element's children (<span class="line">) and
 * detect which lines have diff classes (diff.add / diff.remove) from
 * transformerNotationDiff.
 */
function getLineDiffTypes(children: React.ReactNode): LineDiffType[] {
  if (!React.isValidElement<{ children?: React.ReactNode }>(children)) return []

  // children is the <code> element; its children are the line spans
  const lineNodes = children.props.children
  if (!lineNodes) return []

  const nodes: React.ReactNode[] = Array.isArray(lineNodes) ? lineNodes : [lineNodes]

  return nodes.map((line: React.ReactNode) => {
    if (React.isValidElement<{ className?: string }>(line)) {
      const cls = line.props.className ?? ''
      if (cls.includes('diff add') || cls.includes(' add')) return 'add'
      if (cls.includes('diff remove') || cls.includes(' remove')) return 'remove'
      // also check for word-level diff spans
      if (cls.includes('highlighted') || cls.includes('focused')) return null
    }
    return null
  })
}

// ─── CodeBlock Component ──────────────────────────────────────────────────

function CodeBlock(props: React.HTMLAttributes<HTMLPreElement> & { className?: string; children?: React.ReactElement; style?: React.CSSProperties }) {
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
  const childProps = (child && typeof child === 'object' && 'props' in child) ? (child as any).props : {}
  const codeClassName = typeof childProps.className === 'string' ? childProps.className : ''
  const combinedClasses = `${preClassName} ${codeClassName}`
  
  // Match 'language-js', 'language-c++', 'language-typescript', etc.
  const langMatch = combinedClasses.match(/language-([\w\-\+\#]+)/)
  const lang = langMatch ? langMatch[1] : 'text'

  // ── Count lines & detect diff types ─────────────────────────────────────
  const text = extractTextContent(props.children)
  const rawLines = text ? text.split('\n') : []
  // Shiki always appends a trailing newline — drop the last empty segment
  const linesCount =
    rawLines.length > 0 && rawLines[rawLines.length - 1] === ''
      ? rawLines.length - 1
      : rawLines.length

  // Detect which lines have diff.add / diff.remove classes
  const lineDiffTypes = getLineDiffTypes(props.children)
  const hasDiffs = lineDiffTypes.some((t) => t !== null)

  // Show gutter for code blocks with 3+ lines — always show if diffs are present
  const showLineNumbers = linesCount >= 3 || hasDiffs
  const lineNumbers = React.useMemo(
    () => Array.from({ length: Math.max(linesCount, 1) }, (_, i) => i + 1),
    [linesCount],
  )

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
        {/* Line number gutter */}
        {showLineNumbers && (
          <div
            className="code-line-gutter select-none flex-shrink-0 text-right border-r border-border bg-muted/20"
            style={{
              padding: '1.25rem 0.75rem 1.25rem 1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              lineHeight: 1.7,
              color: 'var(--color-base-muted)',
              minWidth: hasDiffs ? '4ch' : '3.2ch',
            }}
            aria-hidden="true"
          >
            {lineNumbers.map((n, i) => {
              const diffType = i < lineDiffTypes.length ? lineDiffTypes[i] : null
              const isAdd = diffType === 'add'
              const isRemove = diffType === 'remove'

              return (
                <div
                  key={n}
                  className="code-line-number"
                  style={{
                    ...(isAdd && {
                      color: 'oklch(62% 0.18 145)',
                      background: 'oklch(62% 0.18 145 / 0.12)',
                    }),
                    ...(isRemove && {
                      color: 'oklch(58% 0.22 20)',
                      background: 'oklch(58% 0.22 20 / 0.12)',
                    }),
                    margin: isAdd || isRemove ? '0 -0.75rem 0 -1rem' : undefined,
                    padding: isAdd || isRemove ? '0 0.75rem 0 1rem' : undefined,
                  }}
                >
                  {isAdd ? '+' : isRemove ? '-' : n}
                </div>
              )
            })}
          </div>
        )}
        {/* Code */}
        <pre
          {...props}
          ref={codeRef}
          className={`${preClassName} m-0 overflow-x-auto text-[0.875rem] leading-[1.7] flex-1 min-w-0`}
          style={{
            ...props.style,
            margin: 0,
            padding: '1.25rem 1.5rem',
            borderRadius: 0,
            border: 'none',
          }}
        />
      </div>
    </div>
  )
}

export const MDXComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h1 className="text-4xl font-bold mt-10 mb-6" {...props} />,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h2 className="text-2xl font-bold mt-10 mb-4" {...props} />,
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className="text-xl font-bold mt-8 mb-3" {...props} />,
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h4 className="text-lg font-bold mt-6 mb-2" {...props} />,
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <p className="mb-4 leading-relaxed" {...props} />,
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isInternal = props.href?.startsWith('/') || props.href?.startsWith('#')
    if (isInternal) {
      return <Link to={props.href!} {...props as React.AnchorHTMLAttributes<HTMLAnchorElement>} />
    }
    return <a target="_blank" rel="noopener noreferrer" {...props} />
  },
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
  li: (props: React.HTMLAttributes<HTMLLIElement>) => <li {...props} />,
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => <blockquote className="border-l-4 border-brand-400 pl-4 italic text-muted my-6" {...props} />,
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => <hr className="my-8 border-border" {...props} />,
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const location = useLocation()
    const src = props.src
    let resolvedSrc = src

    if (src && !src.startsWith('/') && !src.startsWith('http') && !src.startsWith('//') && !src.startsWith('#')) {
      const contentAssetUrl = resolveContentAssetUrl(location.pathname, src)
      if (contentAssetUrl) {
        resolvedSrc = contentAssetUrl
      } else {
        const basePath = location.pathname.endsWith('/') ? location.pathname : `${location.pathname}/`
        try {
          resolvedSrc = new URL(src, `${window.location.origin}${basePath}`).pathname
        } catch {
          resolvedSrc = `${basePath}${src}`
        }
      }
    }

    return (
      <span className="my-6 block">
        <button
          onClick={() => openLightbox(resolvedSrc ?? '', props.alt ?? '')}
          className="block w-full p-0 border-0 bg-transparent cursor-zoom-in"
          aria-label={props.alt ? `View image: ${props.alt}` : 'View image'}
        >
          <OptimizedImage
            imgClassName="rounded-lg border border-border w-full object-cover max-h-[500px] transition-transform duration-200 hover:scale-[1.01]"
            usePicture={true}
            {...props}
            src={resolvedSrc || ''}
          />
        </button>
        {props.alt && <span className="block text-center text-sm italic text-muted mt-2 dark:text-muted-foreground">{props.alt}</span>}
      </span>
    )
  },
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => <thead className="border-b border-border bg-muted/50" {...props} />,
  tbody: (props: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody className="divide-y divide-border" {...props} />,
  tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => <tr className="transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted" {...props} />,
  th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground" {...props} />,
  td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => <td className="p-4 align-middle" {...props} />,
  pre: CodeBlock,
  Badge,
  Callout,
  Tooltip,
  CCLicense,
  ProfileBadge,
  VideoEmbed,
  AuthorCard,
}
