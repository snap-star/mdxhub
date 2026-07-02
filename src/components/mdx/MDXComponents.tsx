/* eslint-disable react-refresh/only-export-components */

import React from 'react'
import { Link, useLocation } from 'react-router'
import { Badge } from './Badge'
import { Callout } from './Callout'
import { ProfileBadge } from './ProfileBadge'
import { VideoEmbed } from './VideoEmbed'
import { Tooltip } from './Tooltip'
import { CCLicense } from '../blog/CCLicense'
import { AuthorCard } from '../blog/AuthorCard'
import { resolveContentAssetUrl } from '@/lib/utils'
import { openLightbox } from '@/lib/lightboxStore'
import { OptimizedImage } from './OptimizedImage'
import { Tabs, Tab } from './Tabs'
import { Steps, Step } from './Steps'
import { Mermaid } from './Mermaid'
import { CodeBlock } from './CodeBlock'
import { CodeSandbox } from './CodeSandbox'
import { Accordion, AccordionItem } from './Accordion'
import { CardGrid, Card } from './CardGrid'

// ─── MDX Image Component (separate component so hooks aren't called in a render function) ──

function MDXImg(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const location = useLocation()
  const src = props.src
  let resolvedSrc = src

  if (src && !src.startsWith('/') && !src.startsWith('http') && !src.startsWith('//') && !src.startsWith('#')) {
    const contentAssetUrl = resolveContentAssetUrl(location.pathname, src)
    if (contentAssetUrl) {
      resolvedSrc = contentAssetUrl
    } else {
      const basePath = location.pathname.endsWith('/') ? location.pathname : `${location.pathname}/`
      try {
        resolvedSrc = new URL(src, `${window.location.origin}${basePath}`).pathname
      } catch {
        resolvedSrc = `${basePath}${src}`
      }
    }
  }

  return (
    <span className="my-6 block">
      <button
        onClick={() => openLightbox(resolvedSrc ?? '', props.alt ?? '')}
        className="block w-full p-0 border-0 bg-transparent cursor-zoom-in"
        aria-label={props.alt ? `View image: ${props.alt}` : 'View image'}
      >
        <OptimizedImage
          imgClassName="rounded-lg border border-border w-full object-cover max-h-[500px] transition-transform duration-200 hover:scale-[1.01]"
          usePicture={true}
          {...props}
          src={resolvedSrc || ''}
        />
      </button>
      {props.alt && <span className="block text-center text-sm italic text-muted mt-2 dark:text-muted-foreground">{props.alt}</span>}
    </span>
  )
}

export const MDXComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h1 className="text-4xl font-bold mt-10 mb-6" {...props} />,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h2 className="text-2xl font-bold mt-10 mb-4" {...props} />,
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className="text-xl font-bold mt-8 mb-3" {...props} />,
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h4 className="text-lg font-bold mt-6 mb-2" {...props} />,
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <p className="mb-4 leading-relaxed" {...props} />,
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isInternal = props.href?.startsWith('/') || props.href?.startsWith('#')
    if (isInternal) {
      return <Link to={props.href!} {...props as React.AnchorHTMLAttributes<HTMLAnchorElement>} />
    }
    return <a target="_blank" rel="noopener noreferrer" {...props} />
  },
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
  li: (props: React.HTMLAttributes<HTMLLIElement>) => <li {...props} />,
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => <blockquote className="border-l-4 border-brand-400 pl-4 italic text-muted my-6" {...props} />,
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => <hr className="my-8 border-border" {...props} />,
  img: MDXImg,
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => <thead className="border-b border-border bg-muted/50" {...props} />,
  tbody: (props: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody className="divide-y divide-border" {...props} />,
  tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => <tr className="transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted" {...props} />,
  th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground" {...props} />,
  td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => <td className="p-4 align-middle" {...props} />,
  pre: CodeBlock,
  Badge,
  Callout,
  Tooltip,
  CCLicense,
  ProfileBadge,
  VideoEmbed,
  AuthorCard,
  Tabs,
  Tab,
  Steps,
  Step,
  Mermaid,
  CodeSandbox,
  Accordion,
  AccordionItem,
  CardGrid,
  Card,
}
