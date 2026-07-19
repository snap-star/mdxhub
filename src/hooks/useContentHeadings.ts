import React from 'react'
import { extractHeadingsFromHtml, slugify, type HeadingItem } from '@/lib/utils'

function areEqual(a: HeadingItem[], b: HeadingItem[]) {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i].id !== b[i].id || a[i].text !== b[i].text || a[i].level !== b[i].level) return false
  }
  return true
}

export function useContentHeadings(contentSlug: string | undefined): HeadingItem[] {
  const [headings, setHeadings] = React.useState<HeadingItem[]>([])
  const ref = React.useRef<HeadingItem[]>([])

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
      const next = extractHeadingsFromHtml(target.innerHTML)
      if (!areEqual(ref.current, next)) {
        ref.current = next
        setHeadings(next)
      }
    }

    extract()

    const observer = new MutationObserver(() => { extract() })
    observer.observe(target, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [contentSlug])

  return headings
}
