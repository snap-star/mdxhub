import React from 'react'
import { Link, useRouteError, isRouteErrorResponse, useLocation } from 'react-router'
import { motion } from 'framer-motion'
import { Home, BookOpen, Search, ArrowLeft, Bug } from 'lucide-react'
import { Logo } from '@/components/common/Logo'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { useThemeStore } from '@/store/themeStore'
import { SEO } from '@/components/common/SEO'
import siteConfig from '../../../site.config.json'

// ─── Helpers ──────────────────────────────────────────────────────────────

function getErrorMessage(error: unknown): string {
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) return 'The page you are looking for does not exist or has been moved.'
    return error.statusText
  }
  if (error instanceof Error) return error.message
  return 'An unexpected error occurred.'
}

// ─── Animations ───────────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
}

const easeOut = [0.4, 0, 0.2, 1] as const

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
}

// ─── Component ────────────────────────────────────────────────────────────

export function NotFound() {
  const error = useRouteError()
  const location = useLocation()
  const { resolvedTheme } = useThemeStore()
  const siteName = siteConfig.copyright || 'MDX Hub'

  const errorMessage = React.useMemo(() => getErrorMessage(error), [error])
  const is404 = isRouteErrorResponse(error) && error.status === 404

  // Extract attempted path for display
  const attemptedPath = isRouteErrorResponse(error) && error.status === 404
    ? (error.data as string) || location.pathname
    : location.pathname

  // Build GitHub issue URL for reporting broken links
  const githubIssueUrl = React.useMemo(() => {
    const repoPath = siteConfig.githubUrl.replace('https://github.com/', '')
    if (!repoPath) return null
    const title = `Broken link: ${attemptedPath}`
    const body = [
      `## Broken Link Report`,
      '',
      `**Attempted URL:** \`${attemptedPath}\``,
      `**Referrer:** \`${document.referrer || 'Direct / unknown'}\``,
      `**Site:** ${siteConfig.siteUrl}`,
      '',
      `---`,
      '',
      `_Reported automatically from the error page${is404 ? '' : error instanceof Object && 'status' in error ? ' (' + String((error as {status: unknown}).status) + ')' : ''}._`,
    ].join('\n')
    return `https://github.com/${repoPath}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptedPath])

  return (
    <div className={`${resolvedTheme === 'dark' ? 'dark' : ''} min-h-screen bg-background text-foreground flex flex-col`}>
      <SEO title={is404 ? 'Page Not Found' : 'Error'} />

      {/* ── Mini Navbar ── */}
      <header className="sticky top-0 z-50 h-16 flex items-center px-4 sm:px-6 border-b border-border bg-brand-50/90 dark:bg-[oklch(20.5%_0.042_245/0.97)] backdrop-blur-md">
        <div className="mx-auto w-full max-w-[1400px] flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          className="flex flex-col items-center text-center max-w-lg"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 404 visual */}
          <motion.div className="relative mb-8" variants={itemVariants}>
            {/* Decorative blurred circles */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 rounded-full bg-brand-500/10 blur-3xl" />
            </div>

            {/* 404 digits */}
            <div className="relative flex items-center gap-3">
              {[4, 0, 4].map((digit, i) => (
                <motion.span
                  key={i}
                  className="font-serif font-bold text-[6rem] sm:text-[8rem] leading-none tracking-tight"
                  style={{
                    color: i === 1
                      ? 'var(--color-brand-400)'
                      : 'var(--color-foreground)',
                    opacity: i === 1 ? 1 : 0.15,
                  }}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: i === 1 ? 1 : 0.15 }}
                  transition={{ duration: 0.6, delay: i * 0.15, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  {digit}
                </motion.span>
              ))}
            </div>

            {/* Decorative line under 404 */}
            <motion.div
              className="mx-auto mt-2 h-1 w-24 rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
            />
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-2xl sm:text-3xl font-bold font-serif tracking-tight mb-3"
            variants={itemVariants}
          >
            {is404 ? 'Page not found' : 'Something went wrong'}
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4"
            variants={itemVariants}
          >
            {errorMessage}
          </motion.p>

          {/* Attempted path display */}
          {attemptedPath && (
            <motion.div
              className="mb-8 px-4 py-2.5 rounded-lg bg-muted border border-border text-xs font-mono text-muted-foreground max-w-full overflow-hidden text-ellipsis"
              variants={itemVariants}
            >
              <span className="text-muted-foreground/60">Attempted path: </span>
              <span className="text-foreground/80">{attemptedPath}</span>
            </motion.div>
          )}

          {/* Back button */}
          <motion.div className="flex flex-wrap items-center justify-center gap-3" variants={itemVariants}>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card text-foreground font-medium text-sm hover:bg-muted hover:border-brand-300 transition-all active:scale-95"
            >
              <ArrowLeft size={16} />
              Go Back
            </button>

            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all shadow-sm shadow-brand/30 active:scale-95"
            >
              <Home size={16} />
              Home
            </Link>

            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card text-foreground font-medium text-sm hover:bg-muted hover:border-brand-300 transition-all active:scale-95"
            >
              <BookOpen size={16} />
              Blog
            </Link>
          </motion.div>

          {/* Report broken link */}
          {githubIssueUrl && (
            <motion.div className="mt-6" variants={itemVariants}>
              <a
                href={githubIssueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.7rem] text-muted-foreground hover:text-primary border border-transparent hover:border-border transition-all"
              >
                <Bug size={12} />
                Report broken link
              </a>
            </motion.div>
          )}

          {/* Search suggestion */}
          <motion.div className="mt-10" variants={itemVariants}>
            <p className="text-xs text-muted-foreground mb-3">
              Or try searching for what you need
            </p>
            <button
              onClick={() =>
                window.dispatchEvent(
                  new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true }),
                )
              }
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/50 text-muted-foreground text-xs hover:bg-accent hover:text-accent-foreground hover:border-brand-300 transition-all"
            >
              <Search size={13} />
              <span>Search {siteName}…</span>
              <kbd className="ml-1 text-[0.6rem] bg-background px-1.5 py-0.5 rounded-[3px] font-mono border border-border">
                ⌘K
              </kbd>
            </button>
          </motion.div>
        </motion.div>
      </main>

      {/* ── Mini Footer ── */}
      <footer className="py-6 px-6 border-t border-border bg-brand-50/50 dark:bg-[oklch(19.8%_0.006_264)]">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} {siteName}</span>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <Link to="/docs" className="hover:text-primary transition-colors">Docs</Link>
            <Link to="/about" className="hover:text-primary transition-colors">About</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
