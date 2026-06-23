import React from 'react'
import { Link, useNavigate } from 'react-router'
import { Filter } from 'lucide-react'

interface CategoryFilterProps {
  categories: string[]
  activeCategoryParam?: string
}

export function CategoryFilter({ categories, activeCategoryParam }: CategoryFilterProps) {
  const navigate = useNavigate()
  const all = ['All', ...categories]

  return (
    <div className="w-full">
      {/* Mobile View: Native Select Dropdown */}
      <div className="sm:hidden relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
          <Filter size={14} />
        </div>
        <select
          value={activeCategoryParam || 'All'}
          onChange={(e) => {
            const val = e.target.value
            navigate(val === 'All' ? '/blog' : `/blog/category/${val}`)
          }}
          className="w-full pl-9 pr-10 py-2.5 bg-card border border-border rounded-xl text-sm font-medium text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
        >
          {all.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'All' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      {/* Desktop View: Wrapping Pills */}
      <div className="hidden sm:flex flex-wrap gap-2">
        {all.map((cat) => {
          const isAll = cat === 'All'
          const isActive = isAll ? !activeCategoryParam : cat === activeCategoryParam
          return (
            <Link
              key={cat}
              to={isAll ? '/blog' : `/blog/category/${cat}`}
              className={`category-filter-btn ${isActive ? 'active' : ''}`}
            >
              {cat}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
