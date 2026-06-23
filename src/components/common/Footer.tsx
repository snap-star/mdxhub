import React from 'react'
import { Link } from 'react-router'
import { Logo } from './Logo'
import { Heart, Rss } from 'lucide-react'
import { siGithub, siX, siReact, siMdx, siVite } from 'simple-icons'
import type { SimpleIcon } from 'simple-icons'

function SimpleIconSvg({ icon, size = 14 }: { icon: SimpleIcon; size?: number }) {
  return (
    <svg role="img" viewBox="0 0 24 24" width={size} height={size} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <title>{icon.title}</title>
      <path d={icon.path} />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border pt-10 sm:pt-12 px-4 sm:px-6 pb-6 sm:pb-8 bg-brand-50/50 dark:bg-[oklch(19.8%_0.006_264)]">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-8 sm:gap-10 mb-8 sm:mb-10">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-1">
            <Logo />
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-[240px]">
              A modern MDX-powered platform for blogs and documentation.
            </p>
            <div className="flex gap-2 mt-4">
              {[
                { type: 'simple', icon: siGithub, href: 'https://github.com/snap-star/mdxhub', label: 'GitHub' },
                { type: 'simple', icon: siX, href: 'https://x.com/a0ki_san', label: 'Twitter' },
                { type: 'lucide', icon: Rss, href: '/rss.xml', label: 'RSS Feed' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  title={item.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all duration-150"
                >
                  {item.type === 'simple' ? (
                    <SimpleIconSvg icon={item.icon as SimpleIcon} size={14} />
                  ) : (
                    // @ts-ignore
                    <item.icon size={14} />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: 'Blog',
              links: [
                { label: 'All Posts', href: '/blog' },
                { label: 'Tutorials', href: '/blog/category/Tutorial' },
                { label: 'Guides', href: '/blog/category/Guide' },
              ],
            },
            {
              title: 'Docs',
              links: [
                { label: 'Introduction', href: '/docs/1-introduction' },
                { label: 'Installation', href: '/docs/2-guides/installation' },
                { label: 'Deployment', href: '/docs/3-deployment/hosting' },
                { label: 'MDX Authoring Guide', href: '/blog/creating-posts-guide' },
              ],
            },
            {
              title: 'More',
              links: [
                { label: 'Search', href: '/search' },
                { label: 'Tags', href: '/blog' },
                { label: 'Authors', href: '/about' },
              ],
            },
          ].map(({ title, links }) => (
            <div key={title}>
              <p className="font-semibold text-xs tracking-widest uppercase text-muted-foreground mb-3.5">
                {title}
              </p>
              <ul className="flex flex-col gap-2">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-6 flex justify-between items-center flex-wrap gap-2">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MDX Hub. Built with <Heart className="inline-block w-4 h-4 text-red-800/40 fill-red-400" /> in this chaotic world.
          </p>
          <div className="text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-2">
            Powered by{' '}
            <a href="https://react.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
              <SimpleIconSvg icon={siReact} size={14} />
              React
            </a>
            <span className="text-muted-foreground/50">+</span>
            <a href="https://mdxjs.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
              <SimpleIconSvg icon={siMdx} size={14} />
              MDX
            </a>
            <span className="text-muted-foreground/50">+</span>
            <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
              <SimpleIconSvg icon={siVite} size={14} />
              Vite
            </a>
          </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
