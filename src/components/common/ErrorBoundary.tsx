import React from 'react'
import { errorTracker } from '@/lib/errorTracking'

interface ErrorBoundaryProps {
  children: React.ReactNode
  /** Custom fallback UI. Receives the error and a reset function. */
  fallback?: React.ReactNode | ((error: Error, reset: () => void) => React.ReactNode)
  /**
   * Unique key that changes on navigation — when it changes, the error
   * state is automatically cleared so the next route renders normally.
   */
  locationKey?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  locationKey: string
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null, locationKey: props.locationKey ?? '' }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  static getDerivedStateFromProps(
    props: ErrorBoundaryProps,
    state: ErrorBoundaryState,
  ): Partial<ErrorBoundaryState> | null {
    if (state.hasError && props.locationKey !== undefined && props.locationKey !== state.locationKey) {
      return { hasError: false, error: null, locationKey: props.locationKey }
    }
    return null
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    errorTracker.log(error, { componentStack: errorInfo.componentStack })
  }

  handleReset = () => this.setState({ hasError: false, error: null })

  render() {
    if (this.state.hasError && this.state.error) {
      const { fallback } = this.props
      const error = this.state.error
      const reset = this.handleReset

      if (fallback) {
        return typeof fallback === 'function' ? fallback(error, reset) : fallback
      }

      return (
        <div className="flex flex-col items-center text-center py-20 px-6" role="alert">
          <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-2xl bg-danger/10 text-danger text-3xl font-bold">
            !
          </div>
          <h2 className="text-2xl font-bold font-serif tracking-tight mb-3">Something went wrong</h2>
          <p className="text-sm text-muted-foreground mb-2 max-w-md">
            An unexpected error occurred while rendering this page.
          </p>

          {import.meta.env.DEV && (
            <details className="mb-6 max-w-lg text-left w-full">
              <summary className="text-xs text-muted-foreground cursor-pointer select-none mb-2 hover:text-foreground transition-colors">
                Error details
              </summary>
              <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto max-h-48 text-foreground border border-border leading-relaxed">
                {error.stack || error.message}
              </pre>
            </details>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 active:scale-[0.97] transition-all"
            >
              Try Again
            </button>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card text-foreground font-medium text-sm hover:bg-muted hover:border-brand-300 active:scale-[0.97] transition-all"
            >
              ← Go Back
            </button>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card text-foreground font-medium text-sm hover:bg-muted hover:border-brand-300 active:scale-[0.97] transition-all"
            >
              Home
            </a>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

/**
 * Wraps ErrorBoundary with automatic reset on route change.
 * Use this in layouts instead of plain ErrorBoundary to prevent
 * a stale error from persisting across navigations.
 */
export function ErrorBoundaryWithReset({ children, fallback }: ErrorBoundaryProps) {
  const locationKey = typeof window !== 'undefined'
    ? window.location.pathname + window.location.search
    : ''
  const [key, setKey] = React.useState(locationKey)

  React.useEffect(() => {
    const handler = () => setKey(window.location.pathname + window.location.search)
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])

  return (
    <ErrorBoundary key={key} locationKey={key} fallback={fallback}>
      {children}
    </ErrorBoundary>
  )
}
