import React from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'

export function Logo() {
  const [hovered, setHovered] = React.useState(false)

  // Document icon paths (default)
  const docRects = [
    { x: 2, y: 3, width: 5, height: 12, rx: 1.5, opacity: 0.9 },
    { x: 9, y: 3, width: 7, height: 5, rx: 1.5, opacity: 0.7 },
    { x: 9, y: 10, width: 7, height: 5, rx: 1.5, opacity: 0.5 },
  ]

  // Home icon paths (on hover)
  const homePaths = [
    // Roof
    'M9 1.5L2 7.5V16.5H16V7.5L9 1.5Z',
    // Door
    'M7 16.5V10.5H11V16.5',
  ]

  return (
    <Link
      to="/"
      className="flex items-center gap-2 shrink-0 no-underline group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon mark */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-brand overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--color-brand-500), var(--color-brand-700))' }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative">
          {/* Document icon — fades out on hover */}
          <motion.g
            animate={{ opacity: hovered ? 0 : 1, scale: hovered ? 0.6 : 1 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{ transformOrigin: 'center' }}
          >
            {docRects.map((r, i) => (
              <rect
                key={i}
                x={r.x} y={r.y} width={r.width} height={r.height}
                rx={r.rx} fill="white" opacity={r.opacity}
              />
            ))}
          </motion.g>

          {/* Home icon — fades in on hover */}
          <motion.g
            animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.6 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{ transformOrigin: 'center' }}
          >
            {homePaths.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="white"
                opacity={i === 0 ? 0.95 : 0.85}
                stroke="white"
                strokeWidth="0.5"
              />
            ))}
          </motion.g>
        </svg>
      </div>

      {/* Wordmark */}
      <span className="text-[1.05rem] font-bold tracking-tight text-foreground font-sans">
        MDX
        <span className="text-primary">Hub</span>
      </span>
    </Link>
  )
}
