import React from 'react'
import { extractHeadingsFromHtml, slugify, type HeadingItem } from '@/lib/utils'

/**
 * Uses MutationObserver to detect when MDX content is rendered in the DOM
 * and extracts headings for the table of contents.
 */
export function useContentHeadings(contentSlug: string | undefined): HeadingItem[] {
  const [headings, setHeadings] = React.useState<HeadingItem[]>([])

  React.useEffect(() => {
    if (!contentSlug) return

    const extract = () => {
      const article = document.querySelector('article.prose')
      if (!article) return

      // Ensure all h2/h3 have an id so TOC navigation works
      article.querySelectorAll('h2, h3').forEach(el => {
        if (!el.id) {
          el.id = slugify(el.textContent || '')
        }
      })
      setHeadings(extractHeadingsFromHtml(article.innerHTML))
    }

    const target = document.querySelector('article.prose')
    if (!target) return

    // If the article already has content, extract immediately
    if (target.textContent && target.textContent.trim().length > 0) {
      extract()
      return
    }

    // Otherwise wait for content to be rendered
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          extract()
          observer.disconnect()
          return
        }
      }
    })

    observer.observe(target, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [contentSlug])

  return headings
}
