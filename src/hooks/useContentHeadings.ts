import React from 'react'
import { extractHeadingsFromHtml, slugify, type HeadingItem } from '@/lib/utils'

export function useContentHeadings(contentSlug: string | undefined): HeadingItem[] {
  const [headings, setHeadings] = React.useState<HeadingItem[]>([])

  React.useEffect(() => {
    if (!contentSlug) return

    const target = document.querySelector('article.prose')
    if (!target) return

    const extract = () => {
      target.querySelectorAll('h2, h3').forEach(el => {
        if (!el.id) {
          el.id = slugify(el.textContent || '')
        }
      })
      setHeadings(extractHeadingsFromHtml(target.innerHTML))
    }

    extract()

    const observer = new MutationObserver(() => { extract() })
    observer.observe(target, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [contentSlug])

  return headings
}
