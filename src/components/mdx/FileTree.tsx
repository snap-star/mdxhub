import React from 'react'
import { ChevronRight, Folder, FolderOpen, FileText } from 'lucide-react'

interface FileNode {
  name: string
  children?: FileNode[]
  open?: boolean
}

interface FileTreeProps {
  tree: FileNode[]
  className?: string
}

function FileTreeNode({ node, depth }: { node: FileNode; depth: number }) {
  const [open, setOpen] = React.useState(node.open ?? true)
  const hasChildren = !!node.children?.length

  return (
    <div>
      <div className="flex items-center gap-1.5 py-px">
        <span style={{ width: depth * 20 }} className="shrink-0" />
        {hasChildren ? (
          <button
            onClick={() => setOpen(!open)}
            className="shrink-0 p-0.5 rounded transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-brand-400"
            aria-label={open ? 'Collapse' : 'Expand'}
          >
            <ChevronRight size={14} className={`transition-transform ${open ? 'rotate-90' : ''}`} />
          </button>
        ) : (
          <span className="w-5 shrink-0" />
        )}
        {hasChildren ? (
          open ? (
            <FolderOpen size={16} className="shrink-0 text-brand-500" />
          ) : (
            <Folder size={16} className="shrink-0 text-brand-500" />
          )
        ) : (
          <FileText size={16} className="shrink-0 text-muted-foreground" />
        )}
        <span className="text-foreground">{node.name}</span>
      </div>
      {hasChildren && open && (
        <div>
          {node.children!.map((child) => (
            <FileTreeNode key={child.name} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export function FileTree({ tree, className = '' }: FileTreeProps) {
  if (!tree || tree.length === 0) return null

  return (
    <div className={`my-6 rounded-xl border border-border bg-card p-4 font-mono text-sm ${className}`}>
      {tree.map((node, i) => (
        <FileTreeNode key={node.name} node={node} depth={0} />
      ))}
    </div>
  )
}
