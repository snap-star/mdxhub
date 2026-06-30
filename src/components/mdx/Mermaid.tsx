import React from 'react'
import { useThemeStore } from '@/store/themeStore'

// ─── Types ─────────────────────────────────────────────────────────────────

interface MermaidProps {
  /** Mermaid diagram definition string */
  chart: string
  /** Optional caption shown below the diagram */
  caption?: string
  /** Optional title for accessibility */
  title?: string
}

// ─── Theme-aware color palettes (hex for SVG compat) ───────────────────────

interface MermaidThemeVars {
  primaryColor: string
  primaryTextColor: string
  primaryBorderColor: string
  lineColor: string
  secondaryColor: string
  tertiaryColor: string
  mainBkg: string
  nodeBorder: string
  clusterBkg: string
  clusterBorder: string
  edgeLabelBackground: string
  nodeTextColor: string
  titleColor: string
  [key: string]: string
}

const LIGHT_THEME: MermaidThemeVars = {
  primaryColor: '#d0d9f5',
  primaryTextColor: '#374151',
  primaryBorderColor: '#93a9e0',
  lineColor: '#5a7dc9',
  secondaryColor: '#f1f5f9',
  tertiaryColor: '#f8fafc',
  mainBkg: '#e8edf8',
  nodeBorder: '#93a9e0',
  clusterBkg: '#f8fafc',
  clusterBorder: '#e2e8f0',
  edgeLabelBackground: '#f8fafc',
  nodeTextColor: '#1e293b',
  titleColor: '#1e293b',
}

const DARK_THEME: MermaidThemeVars = {
  primaryColor: '#2a3a5c',
  primaryTextColor: '#e2e8f0',
  primaryBorderColor: '#4a6a9c',
  lineColor: '#6a8fc8',
  secondaryColor: '#1e1f22',
  tertiaryColor: '#2b2d31',
  mainBkg: '#2a3a5c',
  nodeBorder: '#4a6a9c',
  clusterBkg: '#2b2d31',
  clusterBorder: '#404249',
  edgeLabelBackground: '#2b2d31',
  nodeTextColor: '#dce0e8',
  titleColor: '#dce0e8',
}

// ─── Module-level Mermaid instance ─────────────────────────────────────────

let mermaidModule: typeof import('mermaid') | null = null

async function getMermaid(theme: MermaidThemeVars): Promise<typeof import('mermaid')> {
  if (!mermaidModule) {
    const mod = await import('mermaid')
    mermaidModule = mod
  }
  // Re-initialize with current theme vars (noop on first call after module loads)
  mermaidModule.default.initialize({
    startOnLoad: false,
    theme: 'neutral',
    themeVariables: theme,
    securityLevel: 'loose',
    fontFamily: 'inherit',
  })
  return mermaidModule
}

// ─── Unique ID generation ──────────────────────────────────────────────────

let diagramCounter = 0
function nextId(): string {
  diagramCounter++
  return `mermaid-diagram-${diagramCounter}`
}

// ─── Component ─────────────────────────────────────────────────────────────

export function Mermaid({ chart, caption, title }: MermaidProps) {
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme)
  const [svg, setSvg] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [id] = React.useState(() => nextId())

  // Re-render when theme or chart changes
  React.useEffect(() => {
    let cancelled = false
    setLoading(true) // eslint-disable-line react-hooks/set-state-in-effect
    setError(null)

    async function render() {
      try {
        const theme = resolvedTheme === 'dark' ? DARK_THEME : LIGHT_THEME
        // Re-initialize mermaid with the current theme on theme change.
        // getMermaid always re-initializes with the theme vars passed in,
        // so there's no need to nullify the cached module.
        const mermaid = await getMermaid(theme)
        if (cancelled) return

        const { svg: renderedSvg } = await mermaid.default.render(id, chart)
        if (cancelled) return

        setSvg(renderedSvg)
        setLoading(false)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err))
          setLoading(false)
        }
      }
    }

    render()

    return () => {
      cancelled = true
    }
  }, [chart, id, resolvedTheme])

  // Error state
  if (error) {
    return (
      <div className="my-8 rounded-xl border border-danger/30 bg-danger/5 p-5">
        <p className="text-sm font-semibold text-danger mb-2">Diagram Render Error</p>
        <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap overflow-x-auto">
          {error}
        </pre>
        <details className="mt-3">
          <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
            Show chart source
          </summary>
          <pre className="mt-2 text-xs font-mono text-muted-foreground whitespace-pre-wrap bg-muted/50 p-3 rounded-lg overflow-x-auto">
            {chart}
          </pre>
        </details>
      </div>
    )
  }

  // Loading state
  if (loading || !svg) {
    return (
      <div className="my-8 rounded-xl border border-border bg-card p-10 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-muted-foreground">Rendering diagram…</p>
        </div>
      </div>
    )
  }

  // Rendered diagram
  return (
    <figure className="my-8 w-full">
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6 overflow-x-auto shadow-sm">
        <div
          className="mermaid-wrapper flex justify-center"
          style={{ minHeight: '60px' }}
          dangerouslySetInnerHTML={{ __html: svg }}
          role="img"
          aria-label={title ?? 'Diagram'}
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-muted-foreground italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
