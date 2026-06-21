import React from 'react'
import { Link } from 'react-router'
import { Folder } from 'lucide-react'

interface SidebarCategoriesProps {
  categoryCounts: Record<string, number>
}

export function SidebarCategories({ categoryCounts }: SidebarCategoriesProps) {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
        <Folder size={16} /> Categories
      </h3>
      <div className="flex flex-col gap-1.5">
        {Object.entries(categoryCounts)
          .sort((a, b) => b[1] - a[1]) // Sort by post count descending
          .map(([cat, count]) => (
            <Link
              key={cat}
              to={`/blog/category/${cat}`}
              className="flex items-center justify-between py-1.5 text-[0.95rem] text-foreground/80 hover:text-brand-500 transition-colors group"
            >
              <span>{cat}</span>
              <span className="bg-muted text-muted-foreground text-xs font-medium px-2 py-0.5 rounded-full group-hover:bg-brand-50 dark:group-hover:bg-brand-500/20 group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">
                {count}
              </span>
            </Link>
          ))}
      </div>
    </div>
  )
}
