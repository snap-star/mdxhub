import React from 'react'

interface VideoEmbedProps {
  /** YouTube video ID, full YouTube URL, or any iframe-compatible URL */
  src: string
  /** Optional title for accessibility */
  title?: string
  /** Optional aspect ratio: '16/9' (default), '4/3', '1/1', '9/16' */
  aspect?: '16/9' | '4/3' | '1/1' | '9/16'
  /** Optional caption shown below the video */
  caption?: string
}

function resolveYouTubeEmbed(src: string): string {
  // Already an embed URL
  if (src.includes('youtube.com/embed/') || src.includes('player.vimeo.com')) return src

  // youtu.be short link
  const shortMatch = src.match(/youtu\.be\/([^?&]+)/)
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`

  // youtube.com/watch?v=
  const watchMatch = src.match(/[?&]v=([^?&]+)/)
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`

  // youtube.com/shorts/
  const shortsMatch = src.match(/youtube\.com\/shorts\/([^?&]+)/)
  if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`

  // Return as-is (supports any iframe URL)
  return src
}

const ASPECT_RATIOS: Record<string, string> = {
  '16/9': '56.25%',
  '4/3': '75%',
  '1/1': '100%',
  '9/16': '177.78%',
}

export function VideoEmbed({ src, title = 'Embedded video', aspect = '16/9', caption }: VideoEmbedProps) {
  const embedUrl = resolveYouTubeEmbed(src)
  const paddingTop = ASPECT_RATIOS[aspect] ?? '56.25%'

  return (
    <figure className="my-8 w-full">
      <div
        className="relative w-full rounded-xl overflow-hidden border border-border shadow-lg bg-black"
        style={{ paddingTop }}
      >
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 w-full h-full"
          style={{ border: 'none' }}
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-muted-foreground italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
