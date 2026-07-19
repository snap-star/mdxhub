import React from 'react'
import { Check, Copy } from 'lucide-react'

interface DiffLine {
  type: 'add' | 'remove' | 'neutral'
  content: string
  lineBefore: number
  lineAfter: number
}

interface DiffViewProps {
  before: string
  after: string
  language?: string
}

function computeDiff(before: string, after: string): DiffLine[] {
  const beforeLines = before.split('\n')
  const afterLines = after.split('\n')
  const result: DiffLine[] = []
  let i = 0, j = 0
  let lineBefore = 0, lineAfter = 0

  while (i < beforeLines.length && j < afterLines.length) {
    if (beforeLines[i] === afterLines[j]) {
      result.push({ type: 'neutral', content: beforeLines[i], lineBefore: ++lineBefore, lineAfter: ++lineAfter })
      i++; j++
      continue
    }

    let found = false
    for (let k = 1; k <= Math.min(10, beforeLines.length - i - 1); k++) {
      if (beforeLines[i + k] === afterLines[j]) {
        for (let m = 0; m < k; m++) {
          result.push({ type: 'remove', content: beforeLines[i + m], lineBefore: ++lineBefore, lineAfter })
        }
        i += k
        found = true
        break
      }
    }
    if (found) continue

    for (let k = 1; k <= Math.min(10, afterLines.length - j - 1); k++) {
      if (beforeLines[i] === afterLines[j + k]) {
        for (let m = 0; m < k; m++) {
          result.push({ type: 'add', content: afterLines[j + m], lineAfter: ++lineAfter, lineBefore })
        }
        j += k
        found = true
        break
      }
    }
    if (found) continue

    result.push({ type: 'remove', content: beforeLines[i], lineBefore: ++lineBefore, lineAfter })
    result.push({ type: 'add', content: afterLines[j], lineAfter: ++lineAfter, lineBefore })
    i++; j++
  }

  while (i < beforeLines.length) {
    result.push({ type: 'remove', content: beforeLines[i], lineBefore: ++lineBefore, lineAfter })
    i++
  }
  while (j < afterLines.length) {
    result.push({ type: 'add', content: afterLines[j], lineAfter: ++lineAfter, lineBefore })
    j++
  }

  return result
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function tokenizeLine(line: string): string {
  let result = escapeHtml(line)
  result = result.replace(/(\/\/.*)$/gm, '<span class="token comment">$1</span>')
  result = result.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="token comment">$1</span>')
  result = result.replace(/\b(function|return|const|let|var|if|else|for|while|class|import|export|from|async|await|type|interface|extends|implements|new|throw|try|catch|finally|switch|case|default|break|continue|typeof|instanceof|void|delete|in|of|this|super|yield|static|get|set|enum|module|namespace|abstract|private|protected|public|readonly|declare|as|any|boolean|number|string|never|unknown|null|undefined|true|false)\b/g, '<span class="token keyword">$1</span>')
  result = result.replace(/\b(\d+\.?\d*)\b/g, '<span class="token number">$1</span>')
  result = result.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, '<span class="token string">"$1"</span>')
  result = result.replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, "<span class=\"token string\">'$1'</span>")
  result = result.replace(/`([^`\\]*(\\.[^`\\]*)*)`/g, '<span class="token string">`$1`</span>')
  return result
}

export function DiffView({ before, after, language = 'text' }: DiffViewProps) {
  const [copied, setCopied] = React.useState(false)
  const diff = React.useMemo(() => computeDiff(before, after), [before, after])
  const codeRef = React.useRef<HTMLDivElement>(null)

  const handleCopy = () => {
    if (codeRef.current) {
      const text = codeRef.current.textContent || ''
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-border shadow-sm bg-card">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400/90 shadow-sm" />
          <div className="w-3 h-3 rounded-full bg-amber-400/90 shadow-sm" />
          <div className="w-3 h-3 rounded-full bg-green-400/90 shadow-sm" />
        </div>
        <span className="text-[0.7rem] font-mono text-muted-foreground uppercase tracking-wider font-semibold">
          {language}
        </span>
        <button
          onClick={handleCopy}
          title="Copy diff"
          className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
        >
          {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
        </button>
      </div>
      <div ref={codeRef} className="overflow-x-auto">
        {diff.length === 0 && (
          <div className="px-4 py-3 text-sm text-muted-foreground font-mono italic">
            No differences
          </div>
        )}
        {diff.map((line, i) => {
          const isAdd = line.type === 'add'
          const isRemove = line.type === 'remove'
          const highlight = line.type !== 'neutral'
          return (
            <div
              key={i}
              className={`flex font-mono text-[0.8125rem] leading-relaxed ${
                isAdd ? 'bg-[oklch(62%_0.12_145/0.15)] dark:bg-[oklch(55%_0.12_145/0.12)]' : ''
              } ${isRemove ? 'bg-[oklch(62%_0.15_25/0.15)] dark:bg-[oklch(55%_0.15_25/0.12)]' : ''}`}
            >
              <div className={`w-10 shrink-0 text-right pr-2 select-none text-[0.7rem] leading-relaxed py-px ${
                isRemove ? 'text-red-500/70' : isAdd ? 'text-green-500/70' : 'text-muted-foreground/50'
              }`}>
                {line.lineBefore ? (
                  <span className={isRemove ? 'text-red-500/70' : 'text-muted-foreground/50'}>{line.lineBefore}</span>
                ) : (
                  <span className="invisible">.</span>
                )}
              </div>
              <div className="w-10 shrink-0 text-right pr-2 select-none text-[0.7rem] leading-relaxed py-px">
                {line.lineAfter ? (
                  <span className={isAdd ? 'text-green-500/70' : 'text-muted-foreground/50'}>{line.lineAfter}</span>
                ) : (
                  <span className="invisible">.</span>
                )}
              </div>
              <div className={`w-5 shrink-0 text-center select-none text-[0.7rem] leading-relaxed py-px ${
                isAdd ? 'text-green-600 dark:text-green-400' : ''
              } ${isRemove ? 'text-red-600 dark:text-red-400' : ''} ${highlight ? '' : 'text-muted-foreground/30'}`}>
                {isAdd ? '+' : isRemove ? '-' : ' '}
              </div>
              <div className="flex-1 pl-2 whitespace-pre overflow-x-auto leading-relaxed py-px">
                <span
                  className={`${isRemove ? 'text-red-700 dark:text-red-300' : ''} ${isAdd ? 'text-green-700 dark:text-green-300' : ''}`}
                  dangerouslySetInnerHTML={{ __html: tokenizeLine(line.content) || ' ' }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
