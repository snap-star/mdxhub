import React from 'react'
import { useNavigate } from 'react-router'
import { useContentStore } from '@/store/contentStore'
import { Search, FileText, BookOpen } from 'lucide-react'

// We use native elements here to build the search palette since shadcn/ui command is based on it
// and it's cleaner for this specific global palette use-case.

export function SearchCommand() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const navigate = useNavigate()
  const search = useContentStore((s) => s.search)

  const results = React.useMemo(() => search(query), [query, search])
  const blogResults = results.filter((r) => r.type === 'blog')
  const docResults = results.filter((r) => r.type === 'doc')

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', down)
    return () => window.removeEventListener('keydown', down)
  }, [open])

  const onSelect = (slug: string, type: 'blog' | 'doc') => {
    setOpen(false)
    navigate(`/${type === 'blog' ? 'blog' : 'docs'}/${slug}`)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] bg-background/60 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-[600px] bg-background rounded-xl border border-border shadow-xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center p-4 border-b border-border">
          <Search size={18} className="text-muted-foreground mr-3" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documentation and blog posts..."
            className="flex-1 bg-transparent border-none outline-none text-base text-foreground placeholder:text-muted-foreground"
          />
          <kbd className="text-[0.7rem] bg-muted px-2 py-1 rounded-sm text-muted-foreground font-mono">
            ESC
          </kbd>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-2">
          {query && results.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No results found for "{query}".
            </div>
          )}

          {!query && (
            <div className="p-8 text-center text-muted-foreground">
              Type to start searching...
            </div>
          )}

          {blogResults.length > 0 && (
            <div className="mb-4">
              <div className="p-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Blog Posts
              </div>
              {blogResults.map((res) => (
                <button
                  key={res.slug}
                  onClick={() => onSelect(res.slug, 'blog')}
                  className="w-full flex items-center gap-3 p-3 bg-transparent border-none rounded-md cursor-pointer text-left hover:bg-muted"
                >
                  <FileText size={16} className="text-primary shrink-0" />
                  <div className="flex-1 overflow-hidden">
                    <div className="text-sm font-medium text-foreground">
                      {res.title}
                    </div>
                    {res.description && (
                      <div className="text-xs text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                        {res.description}
                      </div>
                    )}
                  </div>
                  {res.category && (
                    <span className="text-[0.7rem] px-1.5 py-0.5 bg-muted rounded-sm text-muted-foreground">
                      {res.category}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {docResults.length > 0 && (
            <div>
              <div className="p-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Documentation
              </div>
              {docResults.map((res) => (
                <button
                  key={res.slug}
                  onClick={() => onSelect(res.slug, 'doc')}
                  className="w-full flex items-center gap-3 p-3 bg-transparent border-none rounded-md cursor-pointer text-left hover:bg-muted"
                >
                  <BookOpen size={16} className="text-blue-500 shrink-0" />
                  <div className="flex-1 overflow-hidden">
                    <div className="text-sm font-medium text-foreground">
                      {res.title}
                    </div>
                    {res.description && (
                      <div className="text-xs text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                        {res.description}
                      </div>
                    )}
                  </div>
                  {res.section && (
                    <span className="text-[0.7rem] px-1.5 py-0.5 bg-muted rounded-sm text-muted-foreground">
                      {res.section}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
