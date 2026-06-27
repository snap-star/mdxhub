import React from 'react'
import { useLocation } from 'react-router'

declare global {
  interface Window {
    DISQUSWIDGETS?: {
      getCount: (args?: { reset?: boolean }) => void
    }
  }
}

interface DisqusCommentCountProps {
  identifier: string
  href: string
  className?: string
}

export function DisqusCommentCount({
  identifier,
  href,
  className,
}: DisqusCommentCountProps) {
  const location = useLocation()
  const shortname = (import.meta.env.VITE_DISQUS_SHORTNAME as string | undefined)?.trim()

  const disqusUrl = React.useMemo(() => {
    if (!href || typeof window === 'undefined') return undefined

    let url = href

    // Handle #-only hrefs (like "#disqus_thread"): use current page URL
    if (url.startsWith('#')) {
      url = window.location.href
    }
    // Handle relative paths (like "/blog/my-post#disqus_thread")
    else if (!/^https?:\/\//.test(url)) {
      if (url.startsWith('/')) {
        url = `${window.location.origin}${url}`
      } else {
        return undefined
      }
    }

    // Strip the #disqus_thread fragment — Disqus adds it internally when matching
    return url.replace(/#disqus_thread.*$/, '')
  }, [href])

  React.useEffect(() => {
    if (!shortname) return

    if (window.DISQUSWIDGETS) {
      window.DISQUSWIDGETS.getCount({ reset: true })
      return
    }

    const existing = document.getElementById('disqus-count-script')
    if (existing) return

    const s = document.createElement('script')
    s.id = 'disqus-count-script'
    s.src = `https://${shortname}.disqus.com/count.js`
    s.async = true
    document.body.appendChild(s)
  }, [shortname, location.key])

  if (!shortname) return null

  return (
    <a
      href={href}
      data-disqus-identifier={identifier}
      data-disqus-url={disqusUrl}
      className={`${className ? `${className} ` : ''}disqus-comment-count`}
    >
      Comments
    </a>
  )
}

