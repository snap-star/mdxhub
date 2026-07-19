import React from 'react'

function idsEqual(a: string[], b: string[]) {
  return a.length === b.length && a.every((v, i) => v === b[i])
}

export function useActiveHeading(ids: string[]): string {
  const [activeId, setActiveId] = React.useState('')
  const ref = React.useRef<string[]>([])

  React.useEffect(() => {
    if (ids.length === 0) return
    if (idsEqual(ref.current, ids)) return
    ref.current = ids

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      { rootMargin: '-20% 0% -70% 0%' },
    )
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [ids])

  return activeId
}
