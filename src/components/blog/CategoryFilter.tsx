import React from 'react'
import { Link, useParams } from 'react-router'

interface CategoryFilterProps {
  categories: string[]
  activeCategoryParam?: string
}

export function CategoryFilter({ categories, activeCategoryParam }: CategoryFilterProps) {
  const all = ['All', ...categories]

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 w-full max-w-full scrollbar-none snap-x">
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
  )
}
