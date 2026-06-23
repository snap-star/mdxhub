import React from 'react'
import { Link } from 'react-router'
import type { Author } from '@/lib/content/types'
import { Globe } from 'lucide-react'
import { SiGithub, SiInstagram, SiX } from '@icons-pack/react-simple-icons';

interface AuthorCardProps {
  author: Author
  compact?: boolean
}

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
    <div className="p-6 border border-border rounded-xl bg-muted flex gap-5 items-start">
      <img
        src={author.avatar}
        alt={author.name}
        className="author-avatar w-16 h-16 object-cover shrink-0 rounded-full"
      />
      <div className="flex-1">
        <p className="text-[0.7rem] font-bold tracking-widest uppercase text-muted-foreground mb-1">
          Written by
        </p>
        <p className="text-lg font-bold mb-1.5">{author.name}</p>
        {author.bio && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-3.5">
            {author.bio}
          </p>
        )}
        <div className="flex gap-2">
          {author.github && (
            <a href={`https://github.com/${author.github}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-primary no-underline hover:underline">
              <SiGithub size={14} /> @{author.github}
            </a>
          )}
          {author.twitter && (
            <a href={`https://twitter.com/${author.twitter}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-primary no-underline hover:underline">
              <SiX size={14} /> @{author.twitter}
            </a>
          )}
          {author.instagram && (
            <a href={`https://www.instagram.com/${author.instagram}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-primary no-underline hover:underline">
              <SiInstagram size={14} /> @{author.instagram}
            </a>
          )}
          {author.website && (
            <a href={author.website} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-primary no-underline hover:underline">
              <Globe size={14} /> <Link to={author.website}>MDX Hub</Link>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
