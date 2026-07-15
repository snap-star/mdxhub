import React from 'react'
import { Link, useNavigate } from 'react-router'
import {
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  LayoutGrid,
  List,
  RotateCcw,
  Calendar,
  Clock,
} from 'lucide-react'
import type { BlogViewMode } from '@/store/blogPrefsStore'
import type { SortMode, SortOrder } from '@/store/blogPrefsStore'

interface CategoryFilterProps {
  categories: string[]
  activeCategoryParam?: string
  sortMode: SortMode
  sortOrder: SortOrder
  viewMode: BlogViewMode
  onSortChange: (mode: SortMode) => void
  onOrderChange: (order: SortOrder) => void
  onViewChange: (mode: BlogViewMode) => void
  onReset: () => void
}

export function CategoryFilter({
  categories,
  activeCategoryParam,
  sortMode,
  sortOrder,
  viewMode,
  onSortChange,
  onOrderChange,
  onViewChange,
  onReset,
}: CategoryFilterProps) {
  const navigate = useNavigate()
  const all = ['All', ...categories]
  const isDefault =
    !activeCategoryParam &&
    sortMode === 'recent' &&
    sortOrder === 'desc' &&
    viewMode === 'card'

  return (
    <div className="w-full flex flex-col gap-4">
      {/* ── Row 1: Category filters ── */}
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
            <polyline points="6 9 12 15 18 9" />
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

      {/* ── Row 2: Sort, View, Reset controls ── */}
      <div className="flex items-center flex-wrap gap-2 sm:gap-3">
        {/* Sort control */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border shadow-sm">
          <ArrowUpDown size={14} className="text-muted-foreground shrink-0" />
          <span className="text-[0.75rem] font-medium text-muted-foreground mr-1 hidden sm:inline">
            Sort:
          </span>
          <button
            onClick={() => onSortChange('recent')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[0.75rem] font-medium transition-all ${
              sortMode === 'recent'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Clock size={12} />
            <span>Recent</span>
          </button>
          <button
            onClick={() => onSortChange('datePosted')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[0.75rem] font-medium transition-all ${
              sortMode === 'datePosted'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Calendar size={12} />
            <span>Date Posted</span>
          </button>

          {/* Order buttons */}
          <div className="w-px h-5 bg-border mx-1" />
          <button
            onClick={() => onOrderChange('desc')}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[0.75rem] font-medium transition-all ${
              sortOrder === 'desc'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
            title="Descending"
          >
            <ArrowDown size={12} />
            <span className="sr-only sm:not-sr-only">Desc</span>
          </button>
          <button
            onClick={() => onOrderChange('asc')}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[0.75rem] font-medium transition-all ${
              sortOrder === 'asc'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
            title="Ascending"
          >
            <ArrowUp size={12} />
            <span className="sr-only sm:not-sr-only">Asc</span>
          </button>
        </div>

        {/* View control */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border shadow-sm">
          <span className="text-[0.75rem] font-medium text-muted-foreground mr-1 hidden sm:inline">
            View:
          </span>
          <button
            onClick={() => onViewChange('card')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[0.75rem] font-medium transition-all ${
              viewMode === 'card'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
            title="Card View"
          >
            <LayoutGrid size={12} />
            <span>Cards</span>
          </button>
          <button
            onClick={() => onViewChange('list')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[0.75rem] font-medium transition-all ${
              viewMode === 'list'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
            title="List View"
          >
            <List size={12} />
            <span>List</span>
          </button>
        </div>

        {/* Reset button */}
        <button
          onClick={onReset}
          disabled={isDefault}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[0.75rem] font-medium transition-all border ${
            isDefault
              ? 'border-border/50 text-muted-foreground/50 cursor-not-allowed'
              : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent hover:border-brand-300 shadow-sm active:scale-95'
          }`}
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  )
}
