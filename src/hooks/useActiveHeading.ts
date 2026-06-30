import React from 'react'

/**
 * Tracks which heading is currently visible in the viewport.
 * Uses IntersectionObserver with a rootMargin that activates the heading
 * when it's near the top of the viewport.
 */
export function useActiveHeading(ids: string[]): string {
  const [activeId, setActiveId] = React.useState('')

  React.useEffect(() => {
    if (ids.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0% -70% 0%' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [ids])

  return activeId
}
