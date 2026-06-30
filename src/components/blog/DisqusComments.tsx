import React from 'react'
import { useLocation } from 'react-router'

declare global {
  interface Window {
    DISQUS?: {
      reset: (args: { reload: boolean; config: () => void }) => void
    }
    disqus_config?: () => void
  }
}

interface DisqusCommentsProps {
  identifier: string
  title: string
  url?: string
}

function getCanonicalUrl(fallback: string) {
  const link = document.querySelector('link[rel="canonical"]')
  const href = link instanceof HTMLLinkElement ? link.href : null
  return href && href.length > 0 ? href : fallback
}

/**
 * Wraps children with IntersectionObserver-based lazy loading.
 * Only renders the actual content when the element scrolls near the viewport.
 */
function LazySection({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref}>
      {visible ? children : (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-sm text-muted-foreground">Loading comments…</span>
        </div>
      )}
    </div>
  )
}

/**
 * Inner component that handles Disqus embed script loading and reset.
 * Only mounted when LazySection makes it visible, ensuring the
 * div#disqus_thread DOM element exists before DISQUS.reset() is called.
 */
function DisqusEmbed({ identifier, title, url, shortname }: DisqusCommentsProps & { shortname: string }) {
  const location = useLocation()

  React.useEffect(() => {
    const fallbackUrl = typeof window !== 'undefined' ? window.location.href : ''
    const pageUrl = url ?? getCanonicalUrl(fallbackUrl)
    const pageIdentifier = identifier
    const pageTitle = title

    const config = function (this: unknown) {
      ;(this as { page: { url: string; identifier: string; title: string } }).page = {
        url: pageUrl,
        identifier: pageIdentifier,
        title: pageTitle,
      }
    }

    if (window.DISQUS) {
      window.DISQUS.reset({
        reload: true,
        config,
      })
      return
    }

    window.disqus_config = config

    const existing = document.getElementById('disqus-embed-script')
    if (existing) return

    const s = document.createElement('script')
    s.id = 'disqus-embed-script'
    s.src = `https://${shortname}.disqus.com/embed.js`
    s.async = true
    s.setAttribute('data-timestamp', String(Date.now()))
    document.body.appendChild(s)
  }, [identifier, title, url, shortname, location.key])

  return (
    <div className="disqus-thread-scope rounded-2xl px-4 py-6 text-foreground dark:text-foreground">
      <div id="disqus_thread" />
    </div>
  )
}

export function DisqusComments({ identifier, title, url }: DisqusCommentsProps) {
  const shortname = (import.meta.env.VITE_DISQUS_SHORTNAME as string | undefined)?.trim()

  if (!shortname) return null

  return (
    <LazySection>
      <DisqusEmbed identifier={identifier} title={title} url={url} shortname={shortname} />
    </LazySection>
  )
}
