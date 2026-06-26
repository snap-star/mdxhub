import React from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'

// ─── Lightbox state (simple module-level store, no Zustand needed) ─────

interface LightboxState {
  open: boolean
  src: string
  alt: string
}

let currentState: LightboxState = { open: false, src: '', alt: '' }
const listeners = new Set<React.DispatchWithoutAction>()

function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

function getSnapshot(): LightboxState {
  return currentState
}

function emitChange() {
  listeners.forEach((fn) => fn())
}

/** Call this from any component to open the lightbox */
export function openLightbox(src: string, alt: string = '') {
  currentState = { open: true, src, alt }
  emitChange()
}

function closeLightbox() {
  currentState = { ...currentState, open: false }
  emitChange()
}

// ─── React hook ─────────────────────────────────────────────────────────

function useLightboxStore() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

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
  const imageRef = React.useRef<HTMLImageElement>(null)

  // Reset zoom on new image
  React.useEffect(() => {
    setScale(1)
    setRotation(0)
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
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              maxWidth: '90vw',
              maxHeight: '85vh',
              objectFit: 'contain',
              cursor: scale > 1 ? 'grab' : 'zoom-out',
              borderRadius: '8px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
            }}
            className="select-none"
            draggable={false}
            onClick={handleBackdropClick}
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
