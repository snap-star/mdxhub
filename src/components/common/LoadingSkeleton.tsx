import React from 'react'

interface LoadingSkeletonProps {
  text?: string
  minHeight?: string
  className?: string
}

export function LoadingSkeleton({
  text = 'Loading…',
  minHeight = '50vh',
  className = '',
}: LoadingSkeletonProps) {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ minHeight }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  )
}
