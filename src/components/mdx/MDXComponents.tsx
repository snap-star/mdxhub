import React from 'react'
import { Link } from 'react-router'
import { Callout } from './Callout'
import { ProfileBadge } from './ProfileBadge'
import { VideoEmbed } from './VideoEmbed'
import { CCLicense } from '../blog/CCLicense'
import { Check, Copy } from 'lucide-react'

// Custom CodeBlock to add Copy button and Terminal header
function CodeBlock(props: any) {
  const [copied, setCopied] = React.useState(false)
  const codeRef = React.useRef<HTMLPreElement>(null)

  const handleCopy = () => {
    if (codeRef.current) {
      const text = codeRef.current.textContent || ''
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Find language class from either <pre> or inner <code>
  const preClassName = typeof props.className === 'string' ? props.className : ''
  const codeClassName = typeof props.children?.props?.className === 'string' ? props.children.props.className : ''
  const combinedClasses = `${preClassName} ${codeClassName}`
  
  // Match 'language-js', 'language-c++', 'language-typescript', etc.
  const langMatch = combinedClasses.match(/language-([\w\-\+\#]+)/)
  const lang = langMatch ? langMatch[1] : 'text'

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-border shadow-sm bg-card code-block-wrapper flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400/90 shadow-sm" />
          <div className="w-3 h-3 rounded-full bg-amber-400/90 shadow-sm" />
          <div className="w-3 h-3 rounded-full bg-green-400/90 shadow-sm" />
        </div>
        <span className="text-[0.7rem] font-mono text-muted-foreground uppercase tracking-wider font-semibold">
          {lang}
        </span>
        <button
          onClick={handleCopy}
          title="Copy code"
          className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
        >
          {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
        </button>
      </div>
      <div className="relative overflow-hidden w-full">
        <pre {...props} ref={codeRef} className={`${preClassName} m-0 overflow-x-auto text-[0.875rem] leading-[1.7] w-full`} style={{ ...props.style, margin: 0, padding: '1.25rem 1.5rem', borderRadius: 0, border: 'none' }} />
      </div>
    </div>
  )
}

export const MDXComponents = {
  h1: (props: any) => <h1 className="text-4xl font-bold mt-10 mb-6" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-bold mt-10 mb-4" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-bold mt-8 mb-3" {...props} />,
  h4: (props: any) => <h4 className="text-lg font-bold mt-6 mb-2" {...props} />,
  p: (props: any) => <p className="mb-4 leading-relaxed" {...props} />,
  a: (props: any) => {
    const isInternal = props.href?.startsWith('/') || props.href?.startsWith('#')
    if (isInternal) {
      return <Link to={props.href} {...props} />
    }
    return <a target="_blank" rel="noopener noreferrer" {...props} />
  },
  ul: (props: any) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
  li: (props: any) => <li {...props} />,
  blockquote: (props: any) => <blockquote className="border-l-4 border-brand-400 pl-4 italic text-muted my-6" {...props} />,
  hr: (props: any) => <hr className="my-8 border-border" {...props} />,
  img: (props: any) => (
    <figure className="my-6">
      <img className="rounded-lg border border-border w-full object-cover max-h-[500px]" loading="lazy" {...props} />
      {props.alt && <figcaption className="text-center text-sm text-muted mt-2">{props.alt}</figcaption>}
    </figure>
  ),
  table: (props: any) => (
    <div className="my-6 w-full overflow-y-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  thead: (props: any) => <thead className="border-b border-border bg-muted/50" {...props} />,
  tbody: (props: any) => <tbody className="divide-y divide-border" {...props} />,
  tr: (props: any) => <tr className="transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted" {...props} />,
  th: (props: any) => <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground" {...props} />,
  td: (props: any) => <td className="p-4 align-middle" {...props} />,
  pre: CodeBlock,
  Callout,
  CCLicense,
  ProfileBadge,
  VideoEmbed,
}
