import React from 'react'
import { Link, useLocation } from 'react-router'
import { useNavigationStore } from '@/store/navigationStore'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { Logo } from '@/components/common/Logo'
import { Menu, X, Search, BookOpen, Rss, Info } from 'lucide-react'
import siteConfig from '../../../site.config.json'
import { version as pkgVersion } from '../../../package.json'

const GithubIcon = ({ size = 24 }: { size?: number }) => (
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
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

// Global Cmd+K search opener event
function openSearch() {
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true }))
}

const NAV_LINKS = [
  { href: '/blog', label: 'Blog' },
  { href: '/docs', label: 'Docs' },
  { href: '/about', label: 'About' },
]

export function Navbar() {
  const toggleMobileSidebar = useNavigationStore((s) => s.toggleMobileSidebar)
  const isMobileSidebarOpen = useNavigationStore((s) => s.isMobileSidebarOpen)
  const [scrolled, setScrolled] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const location = useLocation()

  React.useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close mobile menu on navigation
  React.useEffect(() => {
    setMobileMenuOpen(false) // eslint-disable-line react-hooks/set-state-in-effect
  }, [location.pathname])

  const isDocsPage = location.pathname.startsWith('/docs')

  return (
    <>
      <header
        className={`sticky top-0 z-50 h-16 flex items-center px-4 sm:px-6 transition-all duration-300 ${
          scrolled
            ? 'border-b border-border bg-brand-50/90 dark:bg-[oklch(20.5%_0.042_245/0.97)] dark:border-[oklch(30%_0.055_245/0.6)] backdrop-blur-md'
            : 'border-b border-transparent bg-brand-50/30 dark:bg-[oklch(18.5%_0.038_245/0.85)]'
        }`}
      >
        <div className="mx-auto w-full max-w-[1400px] flex items-center gap-4 sm:gap-6">
          <Logo />

          {/* Desktop nav links */}
          <nav className="hidden md:flex ml-4 flex-1 gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                to={href}
                className="px-3.5 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right side: github + search + theme toggle + hamburger */}
          <div className="ml-auto flex items-center gap-2">
            {/* GitHub badge */}
            <a
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-0 rounded-md overflow-hidden border border-border text-[0.75rem] font-mono font-semibold hover:border-brand-400 transition-colors group"
              title="GitHub Repository"
            >
              <span className="flex items-center gap-1.5 px-2.5 py-1.5 bg-muted text-muted-foreground group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                <GithubIcon size={14} />
              </span>
              <span className="px-2.5 py-1.5 bg-brand-500/10 text-brand-600 dark:text-brand-300 group-hover:bg-brand-500/20 transition-colors">
                v{pkgVersion}
              </span>
            </a>

            {/* Search trigger (desktop) */}
            <button
              onClick={openSearch}
              title="Search (Ctrl+K)"
              className="hidden md:flex items-center gap-2 px-3.5 py-1.5 min-w-[140px] border border-border rounded-md bg-muted text-muted-foreground text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
            >
              <Search size={14} />
              <span>Search…</span>
              <kbd className="ml-auto text-[0.7rem] bg-background px-1.5 py-0.5 rounded-[3px] font-mono border border-border">
                ⌘K
              </kbd>
            </button>

            {/* Mobile search icon */}
            <button
              onClick={openSearch}
              title="Search"
              className="md:hidden p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
            >
              <Search size={20} />
            </button>

            <ThemeToggle />

            {/* Mobile hamburger — opens docs sidebar on docs pages, or mobile nav on others */}
            <button
              onClick={() => {
                if (isDocsPage) {
                  toggleMobileSidebar()
                } else {
                  setMobileMenuOpen((o) => !o)
                }
              }}
              aria-label="Toggle menu"
              className="md:hidden p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
            >
              {(isDocsPage ? isMobileSidebarOpen : mobileMenuOpen)
                ? <X size={20} />
                : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer (blog / non-docs pages) */}
      <>
        {/* Backdrop */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
        {/* Drawer */}
        <div
          className="fixed top-16 left-0 right-0 z-50 md:hidden border-b border-[oklch(30%_0.055_245/0.5)] bg-brand-50/98 dark:bg-[oklch(20.5%_0.042_245/0.98)] backdrop-blur-md transition-all duration-300 overflow-hidden"
          style={{ maxHeight: mobileMenuOpen ? '400px' : '0', opacity: mobileMenuOpen ? 1 : 0 }}
        >
          <nav className="flex flex-col p-4 gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                to={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[0.95rem] font-medium transition-colors ${
                  location.pathname.startsWith(href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-accent'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {label === 'Blog' && <Rss size={18} />}
                {label === 'Docs' && <BookOpen size={18} />}
                {label === 'About' && <Info size={18} />}
                {label}
              </Link>
            ))}
            <a
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[0.95rem] font-medium text-foreground hover:bg-accent transition-colors"
            >
              <GithubIcon size={18} />
              GitHub
            </a>
            <div className="mt-2 pt-3 border-t border-border">
              <button
                onClick={() => { setMobileMenuOpen(false); openSearch() }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[0.95rem] font-medium text-foreground hover:bg-accent transition-colors"
              >
                <Search size={18} />
                Search…
              </button>
            </div>
          </nav>
        </div>
      </>
    </>
  )
}
