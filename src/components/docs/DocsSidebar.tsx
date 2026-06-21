import React from 'react'
import { Link, useLocation } from 'react-router'
import { useContentStore } from '@/store/contentStore'
import { useNavigationStore } from '@/store/navigationStore'
import { ChevronDown, ChevronRight, BookOpen } from 'lucide-react'

interface SidebarSectionProps {
  sectionSlug: string
  sectionLabel: string
  items: Array<{ slug: string; title: string; order?: number }>
  isOpen: boolean
  onToggle: () => void
}

function SidebarSection({ sectionSlug, sectionLabel, items, isOpen, onToggle }: SidebarSectionProps) {
  const location = useLocation()

  return (
    <div className="mb-1">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-2 py-1.5 bg-transparent border-none cursor-pointer rounded-md hover:bg-accent transition-colors"
      >
        <span className="sidebar-section-title m-0 p-0">{sectionLabel}</span>
        {isOpen
          ? <ChevronDown size={13} className="text-muted-foreground" />
          : <ChevronRight size={13} className="text-muted-foreground" />}
      </button>

      {isOpen && (
        <ul className="list-none p-0 pb-1 pl-0 m-0">
          {items.map((item) => {
            const href = `/docs/${item.slug}`
            const isActive = location.pathname === href || location.pathname === href + '/'
            return (
              <li key={item.slug}>
                <Link to={href} className={`sidebar-link ${isActive ? 'active' : ''}`}>
                  {item.title}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export function DocsSidebar() {
  const docs = useContentStore((s) => s.docs)
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({})

  // Group docs by section
  const sections = React.useMemo(() => {
    const map: Record<string, { label: string; items: typeof docs }> = {}
    docs.forEach((doc) => {
      const key = doc.sectionSlug
      if (!map[key]) {
        map[key] = {
          label: doc.frontmatter.section,
          items: [],
        }
      }
      map[key].items.push(doc)
    })
    const sectionOrderMap: Record<string, number> = {
      'getting-started': 1,
      'guides': 2,
      'deployment': 3,
      'troubleshooting': 4,
    }

    return Object.entries(map)
      .map(([key, val]) => ({
        key,
        label: val.label,
        items: val.items
          .sort((a, b) => (a.frontmatter.order ?? 99) - (b.frontmatter.order ?? 99))
          .map((d) => ({ slug: d.slug, title: d.frontmatter.title, order: d.frontmatter.order })),
      }))
      .sort((a, b) => {
        const orderA = sectionOrderMap[a.key] ?? 99
        const orderB = sectionOrderMap[b.key] ?? 99
        return orderA - orderB
      })
  }, [docs])

  // Open all sections by default — only run once when sections first populated
  React.useEffect(() => {
    setOpenSections((prev) => {
      const next = { ...prev }
      let changed = false
      sections.forEach((s) => {
        if (!(s.key in next)) {
          next[s.key] = true
          changed = true
        }
      })
      return changed ? next : prev
    })
  }, [sections])

  return (
    <nav aria-label="Documentation navigation">
      <div className="flex items-center gap-2 px-2 pb-4 mb-1">
        <BookOpen size={16} className="text-primary" />
        <span className="text-sm font-semibold text-foreground">
          Documentation
        </span>
      </div>

      {sections.map((section) => (
        <SidebarSection
          key={section.key}
          sectionSlug={section.key}
          sectionLabel={section.label}
          items={section.items}
          isOpen={openSections[section.key] ?? true}
          onToggle={() =>
            setOpenSections((prev) => ({ ...prev, [section.key]: !prev[section.key] }))
          }
        />
      ))}

      {docs.length === 0 && (
        <p className="text-[0.8rem] text-muted-foreground px-2 py-1 italic">
          No docs found.
        </p>
      )}
    </nav>
  )
}
