import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import siteConfig from '../../../site.config.json'

// ─── Error info type ──────────────────────────────────────────────────────

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

// ─── Animations ───────────────────────────────────────────────────────────

const easeOut = [0.4, 0, 0.2, 1] as const

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } },
}

// ─── Fallback UI ──────────────────────────────────────────────────────────

function ErrorFallback({
  error,
  onReset,
}: {
  error: Error | null
  onReset: () => void
}) {
  // Build GitHub issue URL for reporting the error
  const githubIssueUrl = React.useMemo(() => {
    const repoPath = siteConfig.githubUrl.replace('https://github.com/', '')
    if (!repoPath) return null
    const title = `Render error: ${error?.message?.slice(0, 80) || 'Unknown error'}`
    const body = [
      `## Render Error Report`,
      '',
      `**Error:** \`${error?.message || 'Unknown'}\``,
      `**Stack:**`,
      '```',
      error?.stack || 'No stack trace available.',
      '```',
      `**URL:** ${typeof window !== 'undefined' ? window.location.href : 'N/A'}`,
      `**User Agent:** ${typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}`,
      '',
      `---`,
      '',
      '_Reported automatically from the error boundary._',
    ].join('\n')
    return `https://github.com/${repoPath}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
  }, [error])

  return (
    <motion.div
      className="flex flex-col items-center text-center py-20 px-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Error icon */}
      <motion.div
        className="mb-6 flex items-center justify-center w-16 h-16 rounded-2xl bg-danger/10 text-danger"
        variants={itemVariants}
      >
        <AlertTriangle size={32} />
      </motion.div>

      {/* Title */}
      <motion.h2
        className="text-2xl font-bold font-serif tracking-tight mb-3"
        variants={itemVariants}
      >
        Something went wrong
      </motion.h2>

      {/* Description */}
      <motion.p
        className="text-sm text-muted-foreground leading-relaxed mb-2 max-w-md"
        variants={itemVariants}
      >
        An unexpected error occurred while rendering this page.
        Our team has been notified — or you can report it directly.
      </motion.p>

      {/* Error detail (collapsed) */}
      {error && (
        <motion.details
          className="mb-8 w-full max-w-md text-left"
          variants={itemVariants}
        >
          <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors">
            Technical details
          </summary>
          <pre className="mt-2 p-3 rounded-lg bg-muted border border-border text-[0.65rem] font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap max-h-48 overflow-y-auto">
            {error.stack || error.message}
          </pre>
        </motion.details>
      )}

      {/* Action buttons */}
      <motion.div
        className="flex flex-wrap items-center justify-center gap-3"
        variants={itemVariants}
      >
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all shadow-sm shadow-brand/30 active:scale-95"
        >
          <RefreshCw size={16} />
          Try Again
        </button>

        <a
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card text-foreground font-medium text-sm hover:bg-muted hover:border-brand-300 transition-all active:scale-95"
        >
          <Home size={16} />
          Home
        </a>
      </motion.div>

      {/* Report link */}
      {githubIssueUrl && (
        <motion.div className="mt-6" variants={itemVariants}>
          <a
            href={githubIssueUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.7rem] text-muted-foreground hover:text-primary border border-transparent hover:border-border transition-all"
          >
            <Bug size={12} />
            Report this error
          </a>
        </motion.div>
      )}
    </motion.div>
  )
}

// ─── Error Boundary Class ─────────────────────────────────────────────

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught render error:', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          onReset={this.handleReset}
        />
      )
    }

    return this.props.children
  }
}
