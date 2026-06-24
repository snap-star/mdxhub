import React from 'react'
import { SiX, SiFacebook, SiLinkerd } from '@icons-pack/react-simple-icons'
import { Link2, Check } from 'lucide-react'

interface ShareButtonsProps {
  title: string
  slug: string
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = React.useState(false)
  const url = typeof window !== 'undefined' ? `${window.location.origin}/blog/${slug}` : ''

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  }

  return (
    <div className="flex items-center gap-4 py-6 mt-8 border-t border-border">
      <span className="text-sm font-semibold text-foreground">Share this post:</span>
      <div className="flex gap-2">
        <a 
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          title="Share on X (Twitter)"
        >
          <SiX size={16} />
        </a>
        <a 
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-[#1877F2] hover:text-white transition-colors"
          title="Share on Facebook"
        >
          <SiFacebook size={16} />
        </a>
        <a 
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-[#0A66C2] hover:text-white transition-colors"
          title="Share on LinkedIn"
        >
          <SiLinkerd size={16} />
        </a>
        <button 
          onClick={handleCopy}
          className={`p-2 rounded-full transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground'}`}
          title="Copy link"
        >
          {copied ? <Check size={16} /> : <Link2 size={16} />}
        </button>
      </div>
    </div>
  )
}
