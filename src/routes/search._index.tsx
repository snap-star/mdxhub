import React from 'react'
import { useContentStore } from '@/store/contentStore'
import { CardGrid, Card } from '@/components/mdx/CardGrid'
import { Breadcrumbs } from '@/components/blog/Breadcrumbs'
import { SEO } from '@/components/common/SEO'
import { breadcrumbListJsonLd } from '@/lib/seo/jsonld'
import { Search, FileText, BookOpen, Sparkles, Clock } from 'lucide-react'
import siteConfig from '../../site.config.json'

const config = siteConfig as unknown as { siteUrl: string }

export default function SearchPage() {
  const [query, setQuery] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)
  const search = useContentStore((s) => s.search)

  const results = React.useMemo(() => search(query), [query, search])
  const blogResults = results.filter((r) => r.type === 'blog')
  const docResults = results.filter((r) => r.type === 'doc')

  // Auto-focus input on mount
  React.useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Debounced recent searches from localStorage
  const [recentSearches, setRecentSearches] = React.useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('mdxhub-recent-searches')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const saveRecentSearch = React.useCallback((q: string) => {
    if (!q.trim()) return
    setRecentSearches((prev) => {
      const next = [q, ...prev.filter((s) => s !== q)].slice(0, 5)
      try {
        localStorage.setItem('mdxhub-recent-searches', JSON.stringify(next))
      } catch { /* ignore */ }
      return next
    })
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    saveRecentSearch(query)
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <SEO
        title="Search"
        description="Search blog posts and documentation."
        jsonLd={[
          breadcrumbListJsonLd({
            siteUrl: config.siteUrl,
            itemListElement: [
              { label: 'Home', href: '/' },
              { label: 'Search' },
            ],
          }),
        ]}
      />

      <div className="mb-6 sm:mb-8">
        <Breadcrumbs items={[
          { label: 'Search' },
        ]} />
      </div>

      <header className="mb-10">
        <h1 className="font-serif text-3xl sm:text-[2.5rem] font-bold mb-3 sm:mb-4 tracking-tight">
          Search
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          Find blog posts and documentation articles across the entire site.
        </p>
      </header>

      {/* Search form */}
      <form onSubmit={handleSearch} className="relative mb-10" role="search">
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground">
            <Search size={20} />
          </div>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search blog posts and documentation..."
            className="w-full pl-12 pr-12 py-4 text-base sm:text-lg bg-card border-2 border-border rounded-xl
                       text-foreground placeholder:text-muted-foreground/60
                       focus:outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10
                       transition-all duration-200"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
        <p className="mt-2 text-xs text-muted-foreground flex items-center gap-3">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono text-[0.7rem]">Enter</kbd> to save to recent searches</span>
          <span className="text-muted-foreground/40">·</span>
          <span>Results update as you type</span>
        </p>
      </form>

      {/* Results */}
      {!query ? (
        <div className="text-center py-16">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl bg-muted">
            <Sparkles size={28} className="text-muted-foreground" />
          </div>
          <p className="text-lg text-muted-foreground mb-2">
            Type something to start searching
          </p>
          <p className="text-sm text-muted-foreground/60 max-w-md mx-auto">
            Search across all blog posts and documentation.
            Use <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono">⌘K</kbd> from anywhere for quick access.
          </p>

          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <div className="mt-10 pt-8 border-t border-border max-w-md mx-auto">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                <Clock size={13} /> Recent Searches
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {recentSearches.map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuery(q)}
                    className="px-3 py-1.5 rounded-lg bg-muted text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors border border-border"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-16">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl bg-muted">
            <Search size={28} className="text-muted-foreground" />
          </div>
          <p className="text-lg text-muted-foreground mb-1">
            No results for &ldquo;{query}&rdquo;
          </p>
          <p className="text-sm text-muted-foreground/60">
            Try a different search term or browse{' '}
            <a href="/blog" className="text-primary hover:underline">all posts</a>
            {' '}or{' '}
            <a href="/docs" className="text-primary hover:underline">documentation</a>.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
            <Search size={14} />
            <span>
              Found <strong className="text-foreground">{results.length}</strong> result{results.length === 1 ? '' : 's'} for &ldquo;<strong className="text-foreground">{query}</strong>&rdquo;
            </span>
          </div>

          {/* Blog posts results */}
          {blogResults.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2.5">
                <FileText size={18} className="text-primary" />
                Blog Posts
                <span className="text-sm font-normal text-muted-foreground">({blogResults.length})</span>
              </h2>
              <CardGrid columns={2}>
                {blogResults.map((res) => (
                  <Card
                    key={`blog-${res.slug}`}
                    title={res.title}
                    description={res.description || 'No description available.'}
                    icon="file"
                    href={`/blog/${res.slug}`}
                    linkText="Read Post"
                  >
                    <div className="flex flex-wrap gap-2 mt-1">
                      {res.category && (
                        <span className="text-[0.7rem] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                          {res.category}
                        </span>
                      )}
                      {res.tags?.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[0.7rem] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </Card>
                ))}
              </CardGrid>
            </section>
          )}

          {/* Documentation results */}
          {docResults.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2.5">
                <BookOpen size={18} className="text-blue-500" />
                Documentation
                <span className="text-sm font-normal text-muted-foreground">({docResults.length})</span>
              </h2>
              <CardGrid columns={2}>
                {docResults.map((res) => (
                  <Card
                    key={`doc-${res.slug}`}
                    title={res.title}
                    description={res.description || 'No description available.'}
                    icon="book"
                    href={`/docs/${res.slug}`}
                    linkText="Read Docs"
                  >
                    {res.section && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-[0.7rem] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium">
                          {res.section}
                        </span>
                      </div>
                    )}
                  </Card>
                ))}
              </CardGrid>
            </section>
          )}
        </>
      )}
    </div>
  )
}
