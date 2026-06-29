import React from 'react'
import { SiX, SiFacebook } from '@icons-pack/react-simple-icons'
import { Link2, Check, Share2, Globe } from 'lucide-react'
import siteConfig from '../../../site.config.json'

// ─── Types ──────────────────────────────────────────────────────────────────

interface PlatformEntry {
  enabled?: boolean
}

interface ShareConfig {
  tagline?: string
  taglineSubtitle?: string
  platforms?: {
    twitter?: PlatformEntry
    facebook?: PlatformEntry
    linkedin?: PlatformEntry
    copyLink?: PlatformEntry
  }
}

interface SiteConfig {
  githubUrl: string
  share?: ShareConfig
}

const config = siteConfig as unknown as SiteConfig
const shareConfig = config.share ?? {}
const platforms = shareConfig.platforms ?? {}

// ─── Props ──────────────────────────────────────────────────────────────────

interface ShareButtonsProps {
  title: string
  slug: string
}

// ─── Platform definitions ───────────────────────────────────────────────────

interface PlatformStyle {
  hoverBg: string
  hoverText: string
  icon: React.ReactNode
  shareUrl: (title: string, url: string) => string
}

const platformDefs: Record<string, PlatformStyle> = {
  twitter: {
    hoverBg: 'hover:bg-black dark:hover:bg-white',
    hoverText: 'hover:text-white dark:hover:text-black',
    icon: <SiX size={16} />,
    shareUrl: (title, url) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  facebook: {
    hoverBg: 'hover:bg-[#1877F2]',
    hoverText: 'hover:text-white',
    icon: <SiFacebook size={16} />,
    shareUrl: (_, url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  linkedin: {
    hoverBg: 'hover:bg-[#0A66C2]',
    hoverText: 'hover:text-white',
    icon: <Globe size={16} />,
    shareUrl: (title, url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
}

const buttonBaseClass =
  'inline-flex items-center justify-center w-10 h-10 rounded-full border border-border bg-muted text-muted-foreground transition-all duration-200 hover:scale-110 hover:shadow-md focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2'

// ─── Component ──────────────────────────────────────────────────────────────

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = React.useState(false)
  const url =
    typeof window !== 'undefined'
      ? `${window.location.origin}/blog/${slug}`
      : ''

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tagline = shareConfig.tagline ?? 'Enjoyed this article?'
  const taglineSubtitle =
    shareConfig.taglineSubtitle ?? 'Share it with your community'

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6 mt-8 mb-8 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        {/* Tagline */}
        <div className="flex items-start gap-3">
          <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary shrink-0 mt-0.5">
            <Share2 size={16} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground m-0">
              {tagline}
            </h4>
            {taglineSubtitle && (
              <p className="text-xs text-muted-foreground mt-0.5 m-0 leading-relaxed">
                {taglineSubtitle}
              </p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Twitter / X */}
          {platforms.twitter?.enabled !== false && (
            <a
              href={platformDefs.twitter.shareUrl(title, url)}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on X (Twitter)"
              className={`${buttonBaseClass} ${platformDefs.twitter.hoverBg} ${platformDefs.twitter.hoverText}`}
            >
              {platformDefs.twitter.icon}
            </a>
          )}

          {/* Facebook */}
          {platforms.facebook?.enabled !== false && (
            <a
              href={platformDefs.facebook.shareUrl(title, url)}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on Facebook"
              className={`${buttonBaseClass} ${platformDefs.facebook.hoverBg} ${platformDefs.facebook.hoverText}`}
            >
              {platformDefs.facebook.icon}
            </a>
          )}

          {/* LinkedIn */}
          {platforms.linkedin?.enabled !== false && (
            <a
              href={platformDefs.linkedin.shareUrl(title, url)}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on LinkedIn"
              className={`${buttonBaseClass} ${platformDefs.linkedin.hoverBg} ${platformDefs.linkedin.hoverText}`}
            >
              {platformDefs.linkedin.icon}
            </a>
          )}

          {/* Copy Link */}
          {platforms.copyLink?.enabled !== false && (
            <button
              onClick={handleCopy}
              title="Copy link"
              className={`${buttonBaseClass} ${
                copied
                  ? 'bg-green-500/10 text-green-600 border-green-200 dark:border-green-800 shadow-sm'
                  : 'hover:bg-primary hover:text-primary-foreground hover:border-primary'
              }`}
            >
              {copied ? <Check size={16} /> : <Link2 size={16} />}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
