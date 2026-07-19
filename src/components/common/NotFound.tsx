import { Link, useRouteError, isRouteErrorResponse, useLocation } from 'react-router'
import { SEO } from '@/components/common/SEO'
import { useTranslation } from '@/hooks/useTranslation'

function getErrorMessage(error: unknown): string {
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) return 'The page you are looking for does not exist or has been moved.'
    return error.statusText
  }
  if (error instanceof Error) return error.message
  return 'An unexpected error occurred.'
}

export function NotFound() {
  const { t } = useTranslation()
  const error = useRouteError()
  const location = useLocation()
  const is404 = isRouteErrorResponse(error) && error.status === 404
  const attemptedPath = isRouteErrorResponse(error) && error.status === 404
    ? (error.data as string) || location.pathname
    : location.pathname

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SEO title={is404 ? t('error.notFound') : t('error.somethingWentWrong')} />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="flex flex-col items-center text-center max-w-lg">
          <div className="relative mb-8">
            <div className="flex items-center gap-3">
              <span className="font-serif font-bold text-[6rem] sm:text-[8rem] leading-none tracking-tight text-foreground/15">4</span>
              <span className="font-serif font-bold text-[6rem] sm:text-[8rem] leading-none tracking-tight text-brand-400">0</span>
              <span className="font-serif font-bold text-[6rem] sm:text-[8rem] leading-none tracking-tight text-foreground/15">4</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight mb-3">
            {is404 ? t('error.notFound') : t('error.somethingWentWrong')}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">{getErrorMessage(error)}</p>
          {attemptedPath && (
            <div className="mb-8 px-4 py-2.5 rounded-lg bg-muted border border-border text-xs font-mono text-muted-foreground max-w-full truncate">
              <span className="text-muted-foreground/60">Attempted path: </span>
              <span className="text-foreground/80">{attemptedPath}</span>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card text-foreground font-medium text-sm hover:bg-muted hover:border-brand-300 transition-all">
              ← {t('error.goBack')}
            </button>
            <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all">
              {t('error.home')}
            </Link>
            <Link to="/blog" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card text-foreground font-medium text-sm hover:bg-muted hover:border-brand-300 transition-all">
              {t('nav.blog')}
            </Link>
          </div>
          <div className="mt-10">
            <p className="text-xs text-muted-foreground mb-3">{t('search.placeholder')}</p>
            <button
              onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/50 text-muted-foreground text-xs hover:bg-accent hover:text-accent-foreground transition-all"
            >
              {t('nav.search')} <kbd className="text-[0.6rem] bg-background px-1.5 py-0.5 rounded font-mono border border-border">⌘K</kbd>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
