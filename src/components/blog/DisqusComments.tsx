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

export function DisqusComments({ identifier, title, url }: DisqusCommentsProps) {
  const location = useLocation()
  const shortname = (import.meta.env.VITE_DISQUS_SHORTNAME as string | undefined)?.trim()

  React.useEffect(() => {
    if (!shortname) return

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

  if (!shortname) return null

  return (
    <div className="disqus-thread-scope rounded-2xl px-4 py-6 text-foreground dark:text-foreground">
      <div id="disqus_thread" />
    </div>
  )
}
