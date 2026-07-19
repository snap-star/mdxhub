import React from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItemProps {
  question: string
  defaultOpen?: boolean
  children: React.ReactNode
}

export function FAQItem({ children }: FAQItemProps) {
  return <>{children}</>
}

interface FAQProps {
  defaultOpen?: number[]
  allowMultiple?: boolean
  children: React.ReactNode
}

function extractText(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join(' ')
  if (React.isValidElement(node)) {
    return extractText(node.props.children)
  }
  return ''
}

export function FAQ({ defaultOpen, allowMultiple = true, children }: FAQProps) {
  const items = React.useMemo(() => {
    const list: { question: string; defaultOpen?: boolean; content: React.ReactNode; text: string }[] = []
    React.Children.forEach(children, (child) => {
      if (React.isValidElement<FAQItemProps>(child) && child.type === FAQItem) {
        const text = extractText(child.props.children)
        list.push({
          question: child.props.question,
          defaultOpen: child.props.defaultOpen,
          content: child.props.children,
          text,
        })
      }
    })
    return list
  }, [children])

  const instanceId = React.useId()
  const [openIndices, setOpenIndices] = React.useState<Set<number>>(() => {
    const initial = new Set<number>()
    if (defaultOpen) {
      for (const idx of defaultOpen) {
        if (idx >= 0 && idx < items.length) initial.add(idx)
      }
    }
    items.forEach((item, idx) => {
      if (item.defaultOpen) initial.add(idx)
    })
    return initial
  })

  const toggle = (index: number) => {
    setOpenIndices((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        if (!allowMultiple) {
          next.clear()
        }
        next.add(index)
      }
      return next
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const getTriggerId = (i: number) => `${instanceId}-faq-trigger-${i}`
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle(index)
    }
    if (e.key === 'ArrowDown' && index < items.length - 1) {
      e.preventDefault()
      document.getElementById(getTriggerId(index + 1))?.focus()
    }
    if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault()
      document.getElementById(getTriggerId(index - 1))?.focus()
    }
    if (e.key === 'Home') {
      e.preventDefault()
      document.getElementById(getTriggerId(0))?.focus()
    }
    if (e.key === 'End') {
      e.preventDefault()
      document.getElementById(getTriggerId(items.length - 1))?.focus()
    }
  }

  if (items.length === 0) return null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.text,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 2) }}
      />
      <div className="my-8 rounded-xl border border-border bg-card shadow-sm overflow-hidden divide-y divide-border">
        {items.map((item, index) => {
          const isOpen = openIndices.has(index)
          const triggerId = `${instanceId}-faq-trigger-${index}`
          const panelId = `${instanceId}-faq-panel-${index}`

          return (
            <div key={index} className="group">
              <h3 className="m-0">
                <button
                  id={triggerId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`w-full flex items-center justify-between gap-3 px-5 py-4 sm:px-6 sm:py-4 text-left text-sm sm:text-base font-medium text-foreground bg-transparent border-0 cursor-pointer transition-colors duration-150 hover:bg-muted/40 focus-visible:outline-2 focus-visible:outline-brand-400 focus-visible:outline-offset-[-2px] focus-visible:rounded-none ${isOpen ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <span className="flex-1">{item.question}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-0 text-foreground' : '-rotate-90 text-muted-foreground'
                    }`}
                  />
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className={`grid transition-all duration-200 ease-in-out ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 text-sm sm:text-base text-foreground/80 leading-relaxed [&>:first-child]:mt-0 [&>p]:mb-3 [&>p:last-child]:mb-0 [&_pre]:my-3 [&_code]:text-sm">
                    {item.content}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
