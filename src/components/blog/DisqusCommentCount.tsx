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
      className={className}
    >
      Comments
    </a>
  )
}

