import React from 'react'

const GithubIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

const TwitterIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)

const MailIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const MapPinIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

export function ProfileBadge() {
  return (
    <div className="my-10 max-w-[800px] mx-auto rounded-3xl overflow-hidden bg-card border border-border shadow-xl group">
      {/* Banner / Header */}
      <div className="h-32 sm:h-44 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />
      </div>

      {/* Profile Content */}
      <div className="px-6 sm:px-10 pb-10 relative">
        {/* Avatar */}
        <div className="absolute -top-16 sm:-top-20 left-6 sm:left-10">
          <div className="p-1.5 bg-card rounded-full shadow-lg group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-500 ease-out">
            <img 
              src="/snap-star.png" 
              alt="Chigusa Asuha" 
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover bg-muted"
            />
          </div>
        </div>

        {/* Actions / Links */}
        <div className="flex justify-end pt-4 sm:pt-6 gap-2 sm:gap-3 mb-4 sm:mb-8">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 sm:p-2.5 rounded-full bg-muted/50 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/20 dark:hover:text-brand-300 transition-colors" aria-label="GitHub">
            <GithubIcon size={20} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 sm:p-2.5 rounded-full bg-muted/50 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/20 dark:hover:text-brand-300 transition-colors" aria-label="Twitter">
            <TwitterIcon size={20} />
          </a>
          <a href="mailto:hello@example.com" className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors flex items-center gap-2 text-sm shadow-sm" aria-label="Contact">
            <MailIcon size={16} /> <span className="hidden sm:inline">Message Me</span>
          </a>
        </div>

        {/* Bio info */}
        <div className="mt-6 sm:mt-0">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif mb-2 tracking-tight text-foreground">Chigusa Asuha</h2>
          <p className="text-brand-600 dark:text-brand-400 font-medium text-lg mb-5">Lead Developer & Creative Technologist</p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-sm text-muted-foreground mb-6">
            <span className="flex items-center gap-1.5"><MapPinIcon size={16} /> East Java, Indonesia</span>
          </div>

          <p className="leading-relaxed text-foreground/80 text-[1.05rem]">
            I love building beautiful, performant, and accessible web applications. 
            When I'm not coding, you can find me writing articles about React, experimenting with new UI frameworks, or exploring the intersection of design and engineering.
          </p>
        </div>
      </div>
    </div>
  )
}
