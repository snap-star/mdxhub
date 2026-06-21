import React from 'react'
import { Link, useParams } from 'react-router'

interface CategoryFilterProps {
  categories: string[]
  activeCategoryParam?: string
}

export function CategoryFilter({ categories, activeCategoryParam }: CategoryFilterProps) {
  const all = ['All', ...categories]

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.25rem',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
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
