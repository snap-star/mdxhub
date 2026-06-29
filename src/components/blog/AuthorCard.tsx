import React from 'react'
import { Link } from 'react-router'
import type { Author } from '@/lib/content/types'
import { Globe } from 'lucide-react'
import siteConfig from '../../../site.config.json'
import { 
  SiGithub, SiInstagram, SiX, SiFacebook, 
  SiTiktok, SiBluesky, SiThreads, SiReddit, SiMastodon, 
  SiYoutube, SiTwitch, SiMedium, SiStackoverflow, SiDevdotto
} from '@icons-pack/react-simple-icons';

interface AuthorCardProps {
  author: Author
  compact?: boolean
}

// Map author fields to icon and URL template
const SOCIAL_LINKS = [
  { key: 'github', icon: SiGithub, url: (val: string) => `https://github.com/${val}` },
  { key: 'twitter', icon: SiX, url: (val: string) => `https://twitter.com/${val}` },
  { key: 'linkedin', icon: Globe, url: (val: string) => `https://www.linkedin.com/in/${val}` },
  { key: 'instagram', icon: SiInstagram, url: (val: string) => `https://www.instagram.com/${val}` },
  { key: 'facebook', icon: SiFacebook, url: (val: string) => `https://www.facebook.com/${val}` },
  { key: 'tiktok', icon: SiTiktok, url: (val: string) => `https://www.tiktok.com/${val}` },
  { key: 'bluesky', icon: SiBluesky, url: (val: string) => `https://bsky.app/profile/${val}` },
  { key: 'threads', icon: SiThreads, url: (val: string) => `https://www.threads.net/${val}` },
  { key: 'reddit', icon: SiReddit, url: (val: string) => `https://www.reddit.com/user/${val}` },
  { key: 'mastodon', icon: SiMastodon, url: (val: string) => {
      // Handles "@user@server.social" or plain
      const parts = val.replace(/^@/, '').split('@');
      return parts.length === 2 ? `https://${parts[1]}/@${parts[0]}` : `https://mastodon.social/@${val}`;
    }
  },
  { key: 'youtube', icon: SiYoutube, url: (val: string) => `https://www.youtube.com/${val}` },
  { key: 'twitch', icon: SiTwitch, url: (val: string) => `https://www.twitch.tv/${val}` },
  { key: 'medium', icon: SiMedium, url: (val: string) => `https://medium.com/@${val}` },
  { key: 'stackoverflow', icon: SiStackoverflow, url: (val: string) => `https://stackoverflow.com/users/${val}` },
  { key: 'devto', icon: SiDevdotto, url: (val: string) => `https://dev.to/${val}` },
] as const;

export function AuthorCard({ author, compact = false }: AuthorCardProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2.5">
        <img
          src={author.avatar}
          alt={author.name}
          className="author-avatar w-9 h-9 object-cover shrink-0 rounded-full"
        />
        <div>
          <p className="text-sm font-semibold leading-tight">{author.name}</p>
          {author.bio && (
            <p className="text-xs text-muted-foreground leading-snug">
              {author.bio.length > 60 ? author.bio.slice(0, 60) + '…' : author.bio}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 border border-border rounded-xl bg-muted flex gap-5 items-start flex-wrap sm:flex-nowrap">
      <img
        src={author.avatar}
        alt={author.name}
        className="author-avatar w-16 h-16 object-cover shrink-0 rounded-full"
      />
      <div className="flex-1 min-w-0">
        <p className="text-[0.7rem] font-bold tracking-widest uppercase text-muted-foreground mb-1">
          Written by
        </p>
        <p className="text-lg font-bold mb-1.5">{author.name}</p>
        {author.bio && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {author.bio}
          </p>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {SOCIAL_LINKS.map(({ key, icon: Icon, url }) => {
            const val = author[key as keyof Author];
            if (!val) return null;
            return (
              <a 
                key={key} 
                href={url(val)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-primary no-underline hover:underline"
              >
                <Icon size={14} /> {val}
              </a>
            );
          })}
          {author.website && (
            <a href={author.website} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-primary no-underline hover:underline">
              <Globe size={14} /> {siteConfig.copyright || 'MDX Hub'}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
