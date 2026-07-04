import React from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'
import { useLightboxStore, closeLightbox } from '@/lib/lightboxStore'

// ─── Overlay backdrop animation variants ────────────────────────────────

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

// NOTE: variants use ONLY opacity — scale is controlled via inline style
// so zoom/rotate buttons can update the transform without framer-motion overriding it
const imageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { type: 'spring' as const, damping: 25, stiffness: 300 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
}

// ─── Component ──────────────────────────────────────────────────────────

export function ImageLightbox() {
  const { open, src, alt } = useLightboxStore()
  const [scale, setScale] = React.useState(1)
  const [rotation, setRotation] = React.useState(0)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const [dragging, setDragging] = React.useState(false)
  const dragStart = React.useRef({ x: 0, y: 0, posX: 0, posY: 0 })
  const pinchRef = React.useRef<{ dist: number; scale: number } | null>(null)
  const activePointers = React.useRef<Map<number, { x: number; y: number }>>(new Map())
  const imageRef = React.useRef<HTMLImageElement>(null)
  const prevSrcRef = React.useRef(src)

  // Reset zoom and position on new image
  React.useEffect(() => {
    if (src === prevSrcRef.current) return
    prevSrcRef.current = src
    setScale(1)
    setRotation(0)
    setPosition({ x: 0, y: 0 })
  }, [src])

  React.useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox()
      }
    }

    // Prevent body scrolling when lightbox is open
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeLightbox()
    }
  }

  const zoomIn = () => setScale((s) => Math.min(s + 0.5, 4))
  const zoomOut = () => setScale((s) => Math.max(s - 0.5, 0.25))
  const rotate = () => setRotation((r) => r + 90)

  // ─── Drag to pan ───────────────────────────────────────────────────

  const isZoomed = scale > 1

  const handlePointerDown = (e: React.PointerEvent) => {
    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    // If second finger touches → start pinch
    if (activePointers.current.size === 2) {
      e.preventDefault()
      const ptrs = Array.from(activePointers.current.values())
      const dist = Math.hypot(ptrs[0].x - ptrs[1].x, ptrs[0].y - ptrs[1].y)
      pinchRef.current = { dist, scale }
      setDragging(false)
      return
    }

    if (!isZoomed) return
    e.preventDefault()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    dragStart.current = { x: e.clientX, y: e.clientY, posX: position.x, posY: position.y }
    setDragging(true)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    const ptr = activePointers.current.get(e.pointerId)
    if (ptr) {
      ptr.x = e.clientX
      ptr.y = e.clientY
    }

    // Pinch zoom with two fingers
    if (activePointers.current.size === 2 && pinchRef.current) {
      e.preventDefault()
      const ptrs = Array.from(activePointers.current.values())
      const dist = Math.hypot(ptrs[0].x - ptrs[1].x, ptrs[0].y - ptrs[1].y)
      const newScale = Math.min(4, Math.max(0.25, (dist / pinchRef.current.dist) * pinchRef.current.scale))
      setScale(newScale)
      return
    }

    if (!dragging) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    setPosition({ x: dragStart.current.posX + dx, y: dragStart.current.posY + dy })
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    activePointers.current.delete(e.pointerId)

    // End pinch
    if (activePointers.current.size < 2) {
      pinchRef.current = null
    }

    if (!dragging) return
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    setDragging(false)
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="lightbox-backdrop"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.25 }}
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-label={alt || 'Image viewer'}
        >
          {/* ── Close button ── */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 text-white/80 hover:bg-black/60 hover:text-white transition-colors"
            aria-label="Close viewer"
          >
            <X size={22} />
          </button>

          {/* ── Toolbar ── */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 rounded-full bg-black/50 px-4 py-2.5 backdrop-blur-sm">
            <button
              onClick={zoomOut}
              className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut size={18} />
            </button>
            <span className="text-xs text-white/50 font-mono min-w-[3ch] text-center select-none">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={zoomIn}
              className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn size={18} />
            </button>
            <span className="w-px h-5 bg-white/15 mx-1" />
            <button
              onClick={rotate}
              className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Rotate"
            >
              <RotateCw size={18} />
            </button>
          </div>

          {/* ── Image ── */}
          <motion.img
            key={src}
            ref={imageRef}
            src={src}
            alt={alt}
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
              maxWidth: '90vw',
              maxHeight: '85vh',
              objectFit: 'contain',
              cursor: isZoomed ? (dragging ? 'grabbing' : 'grab') : 'zoom-out',
              borderRadius: '8px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
              touchAction: 'none',
            }}
            className="select-none"
            draggable={false}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onClick={() => { if (!isZoomed) closeLightbox() }}
          />

          {/* ── Caption ── */}
          {alt && (
            <p className="absolute bottom-20 left-1/2 -translate-x-1/2 text-sm text-white/60 bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-sm max-w-[80vw] truncate pointer-events-none">
              {alt}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
