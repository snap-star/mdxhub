import React from 'react'
import { SiX, SiGithub, SiDiscord } from '@icons-pack/react-simple-icons'
import { Check } from 'lucide-react'
import siteConfig from '../../../site.config.json'

const MailIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const MapPinIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

// ─── Config ───────────────────────────────────────────────────────────────

interface ProfileConfig {
  name: string
  avatar: string
  title: string
  location: string
  bio: string
  discord?: string
  github?: string
  twitter?: string
  email?: string
}

interface SiteConfig {
  githubUrl: string
  profile?: ProfileConfig
}

const config = siteConfig as unknown as SiteConfig
const profile = (config.profile ?? {}) as ProfileConfig

const hasDiscord = !!profile.discord
const hasGithub = !!profile.github
const hasTwitter = !!profile.twitter
const hasEmail = !!profile.email

// ─── Copy Discord Button ─────────────────────────────────────────────────

function CopyDiscordButton({ discordTag }: { discordTag: string }) {
  const [copied, setCopied] = React.useState(false)
  const username = discordTag.replace(/^@/, '')

  const handleCopy = () => {
    navigator.clipboard.writeText(username)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={`p-2 sm:p-2.5 rounded-full transition-colors ${
        copied
          ? 'bg-[#5865F2] text-white'
          : 'bg-muted/50 hover:bg-[#5865F2] hover:text-white dark:hover:bg-[#5865F2] dark:hover:text-white'
      }`}
      aria-label={copied ? 'Copied!' : `Copy Discord username: ${username}`}
      title={`Chat with me on Discord: ${discordTag}`}
    >
      {copied ? <Check size={20} /> : <SiDiscord size={20} />}
    </button>
  )
}

// ─── Component ────────────────────────────────────────────────────────────

export function ProfileBadge() {
  return (
    <div className="my-10 max-w-[800px] mx-auto rounded-3xl overflow-hidden bg-card border border-border shadow-xl group">
      {/* Banner / Header */}
      <div className="h-32 sm:h-44 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />
      </div>

      {/* Profile Content */}
      <div className="px-6 sm:px-10 pb-10 relative">
        {/* Avatar */}
        <div className="absolute -top-16 sm:-top-20 left-6 sm:left-10">
          <div className="p-1.5 bg-card rounded-full shadow-lg group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-500 ease-out">
            <img
              src={profile.avatar || '/snap-star.png'}
              alt={profile.name || 'Profile'}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover bg-muted"
            />
          </div>
        </div>

        {/* Actions / Links */}
        <div className="flex justify-end pt-4 sm:pt-6 gap-2 sm:gap-3 mb-4 sm:mb-8">
          {hasGithub && (
            <a
              href={`https://github.com/${profile.github}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 sm:p-2.5 rounded-full bg-muted/50 hover:bg-brand-950 hover:text-brand-600 dark:hover:bg-brand-950/20 dark:hover:text-brand-300 transition-colors"
              aria-label="GitHub"
            >
              <SiGithub size={20} className="hover:text-white" />
            </a>
          )}
          {hasTwitter && (
            <a
              href={`https://x.com/${profile.twitter}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 sm:p-2.5 rounded-full bg-muted/50 hover:bg-black hover:text-white dark:hover:bg-brand-950/20 dark:hover:text-brand-300 transition-colors"
              aria-label="Twitter / X"
            >
              <SiX size={20} className="hover:text-white" />
            </a>
          )}
          {hasDiscord && (
            <CopyDiscordButton discordTag={profile.discord!} />
          )}
          {hasEmail && (
            <a
              href={`mailto:${profile.email}`}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-muted/90 hover:bg-brand-950/20 hover:text-brand-100 dark:hover:bg-brand-500/20 dark:hover:text-brand-300 font-medium text-sm transition-colors flex items-center gap-2"
              aria-label="Contact"
            >
              <MailIcon size={16} /> <span className="hidden sm:inline">Message Me</span>
            </a>
          )}
        </div>

        {/* Bio info */}
        <div className="mt-6 sm:mt-0">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif mb-2 tracking-tight text-foreground">
            {profile.name || 'Chigusa Asuha'}
          </h2>
          {profile.title && (
            <p className="text-brand-600 dark:text-brand-400 font-medium text-lg mb-5">
              {profile.title}
            </p>
          )}

          {profile.location && (
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1.5"><MapPinIcon size={16} /> {profile.location}</span>
            </div>
          )}

          {profile.bio && (
            <p className="leading-relaxed text-foreground/80 text-[1.05rem]">
              {profile.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
