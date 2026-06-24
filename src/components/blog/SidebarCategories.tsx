import React from 'react'
import { Link } from 'react-router'
import { Folder, Atom, GraduationCap, Code, Terminal, Layers } from 'lucide-react'
import { SidebarWidget } from './SidebarWidget'

interface SidebarCategoriesProps {
  categoryCounts: Record<string, number>
}

// Optional icon mapping for known categories
const getCategoryIcon = (cat: string) => {
  const c = cat.toLowerCase()
  if (c.includes('react') || c.includes('jsx')) return <Atom size={16} />
  if (c.includes('tutorial') || c.includes('guide')) return <GraduationCap size={16} />
  if (c.includes('css') || c.includes('style')) return <Layers size={16} />
  if (c.includes('script') || c.includes('code')) return <Code size={16} />
  if (c.includes('terminal') || c.includes('cli')) return <Terminal size={16} />
  return <Folder size={16} />
}

export function SidebarCategories({ categoryCounts }: SidebarCategoriesProps) {
  const maxCount = Math.max(1, ...Object.values(categoryCounts))

  return (
    <SidebarWidget title="Categories" icon={<Folder size={16} />}>
      <div className="flex flex-col gap-2">
        {Object.entries(categoryCounts)
          .sort((a, b) => b[1] - a[1]) // Sort by post count descending
          .map(([cat, count]) => (
            <Link
              key={cat}
              to={`/blog/category/${cat}`}
              className="relative overflow-hidden group flex items-center justify-between p-2.5 rounded-lg border border-transparent hover:border-border transition-all duration-300"
            >
              {/* Progress Bar Background */}
              <div 
                className="absolute inset-0 bg-primary/5 dark:bg-primary/10 rounded-lg origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" 
                style={{ width: `${(count / maxCount) * 100}%` }}
              />
              
              <div className="relative z-10 flex items-center gap-2.5 text-[0.95rem] text-foreground/80 group-hover:text-primary transition-colors group-hover:translate-x-1 duration-300">
                <span className="text-muted-foreground group-hover:text-primary transition-colors">
                  {getCategoryIcon(cat)}
                </span>
                <span className="font-medium">{cat}</span>
              </div>
              
              <span className="relative z-10 bg-muted text-muted-foreground text-xs font-semibold px-2 py-0.5 rounded-full group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                {count}
              </span>
            </Link>
          ))}
      </div>
    </SidebarWidget>
  )
}
