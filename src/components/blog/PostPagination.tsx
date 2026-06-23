import React from 'react'
import { Link } from 'react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { BlogPost } from '@/lib/content/types'

interface PostPaginationProps {
  prevPost?: BlogPost
  nextPost?: BlogPost
}

export function PostPagination({ prevPost, nextPost }: PostPaginationProps) {
  if (!prevPost && !nextPost) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
      {prevPost ? (
        <Link 
          to={`/blog/${prevPost.slug}`}
          className="flex flex-col gap-2 p-4 sm:p-5 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-sm transition-all group no-underline text-left"
        >
          <span className="text-[0.75rem] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Previous
          </span>
          <span className="font-serif font-medium text-foreground line-clamp-2 leading-tight">
            {prevPost.frontmatter.title}
          </span>
        </Link>
      ) : <div className="hidden sm:block" />}

      {nextPost ? (
        <Link 
          to={`/blog/${nextPost.slug}`}
          className="flex flex-col gap-2 p-4 sm:p-5 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-sm transition-all group no-underline text-right items-end sm:col-start-2"
        >
          <span className="text-[0.75rem] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
            Next <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </span>
          <span className="font-serif font-medium text-foreground line-clamp-2 leading-tight text-right">
            {nextPost.frontmatter.title}
          </span>
        </Link>
      ) : <div className="hidden sm:block" />}
    </div>
  )
}
