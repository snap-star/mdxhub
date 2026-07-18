import React from 'react'

interface ViewportMountProps {
  children: React.ReactNode
  /** Distance in px from viewport to trigger mount/unmount (default 300). */
  rootMargin?: number
  /** Placeholder shown while out of view. */
  fallback?: React.ReactNode
  /** Minimum height to reserve so the page doesn't jump (default 200). */
  minHeight?: number
}

/**
 * Mounts children when within `rootMargin` px of the viewport, and unmounts
 * them when scrolled out of that range. Heavy components like CodeSandbox and
 * Mermaid only consume memory while near the visible area.
 */
export function ViewportMount({
  children,
  rootMargin = 300,
  fallback,
  minHeight = 200,
}: ViewportMountProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [inViewport, setInViewport] = React.useState(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setInViewport(entry.isIntersecting),
      { rootMargin: `${rootMargin}px` },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin])

  return (
    <div ref={ref} style={{ minHeight: inViewport ? undefined : `${minHeight}px` }}>
      {inViewport ? children : fallback}
    </div>
  )
}
