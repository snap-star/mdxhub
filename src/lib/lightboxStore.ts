import { createStore } from './createStore'

interface LightboxState {
  open: boolean
  src: string
  alt: string
}

const { setState, useStore } = createStore<LightboxState>({
  open: false,
  src: '',
  alt: '',
})

/** Call this from any component to open the lightbox */
export function openLightbox(src: string, alt: string = '') {
  setState({ open: true, src, alt })
}

export function closeLightbox() {
  setState({ open: false })
}

export function useLightboxStore(): LightboxState {
  return useStore()
}
