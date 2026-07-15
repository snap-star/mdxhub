import { motion } from 'framer-motion'

// ─── Animated brand background variants ────────────────────────────

const SECTION_BG_VARIANTS = {
  tech: {
    blobs: [
      { color: 'oklch(0.65 0.18 260 / 0.12)', size: '45%', top: '-10%', left: '-5%', duration: 25 },
      { color: 'oklch(0.55 0.12 270 / 0.08)', size: '30%', bottom: '-5%', right: '-8%', duration: 30 },
    ],
  },
  features: {
    blobs: [
      { color: 'oklch(0.65 0.14 190 / 0.12)', size: '50%', top: '-15%', right: '-10%', duration: 28 },
      { color: 'oklch(0.6 0.12 170 / 0.08)', size: '35%', bottom: '-10%', left: '-5%', duration: 32 },
    ],
  },
  showcase: {
    blobs: [
      { color: 'oklch(0.62 0.16 330 / 0.1)', size: '40%', top: '-8%', left: '10%', duration: 22 },
      { color: 'oklch(0.6 0.14 350 / 0.08)', size: '35%', bottom: '-8%', right: '5%', duration: 27 },
      { color: 'oklch(0.65 0.1 300 / 0.06)', size: '25%', top: '40%', right: '30%', duration: 20 },
    ],
  },
  posts: {
    blobs: [
      { color: 'oklch(0.68 0.14 80 / 0.1)', size: '40%', top: '-10%', left: '20%', duration: 26 },
      { color: 'oklch(0.66 0.12 60 / 0.08)', size: '30%', bottom: '-5%', right: '-8%', duration: 30 },
    ],
  },
  cta: {
    blobs: [
      { color: 'oklch(0.64 0.18 280 / 0.12)', size: '55%', top: '-20%', left: '-15%', duration: 24 },
      { color: 'oklch(0.58 0.14 290 / 0.08)', size: '35%', bottom: '-10%', right: '-10%', duration: 28 },
    ],
  },
}

export function SectionBackground({ variant = 'tech' }: { variant?: keyof typeof SECTION_BG_VARIANTS }) {
  const config = SECTION_BG_VARIANTS[variant] || SECTION_BG_VARIANTS.tech
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {config.blobs.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl will-change-transform"
          style={{
            width: blob.size,
            height: blob.size,
            top: blob.top,
            left: blob.left,
            right: (blob as { right?: string }).right,
            bottom: (blob as { bottom?: string }).bottom,
            background: blob.color,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          animate={{
            x: [0, i % 2 === 0 ? 30 : -25, i % 2 === 0 ? -15 : 20, 0],
            y: [0, i % 2 === 0 ? -20 : 15, i % 2 === 0 ? 10 : -10, 0],
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5,
          }}
        />
      ))}
      {/* Gradient edge fade overlays for cleaner section transitions */}
      <div className="absolute top-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-b from-background to-transparent pointer-events-none z-[2]" />
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-[2]" />
    </div>
  )
}
