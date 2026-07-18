import React from 'react'
import { errorTracker } from '@/lib/errorTracking'

interface State { hasError: boolean; error: Error | null }

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    errorTracker.log(error, { componentStack: errorInfo.componentStack })
  }

  handleReset = () => this.setState({ hasError: false, error: null })

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center text-center py-20 px-6">
          <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-2xl bg-danger/10 text-danger text-3xl">!</div>
          <h2 className="text-2xl font-bold font-serif tracking-tight mb-3">Something went wrong</h2>
          <p className="text-sm text-muted-foreground mb-2 max-w-md">An unexpected error occurred while rendering this page.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button onClick={this.handleReset} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all">
              Try Again
            </button>
            <a href="/" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card text-foreground font-medium text-sm hover:bg-muted transition-all">
              Home
            </a>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
