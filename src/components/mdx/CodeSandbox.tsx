import React from 'react'
import { SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview, SandpackConsole } from '@codesandbox/sandpack-react'
import { githubLight, monokaiPro } from '@codesandbox/sandpack-themes'
import { useThemeStore } from '@/store/themeStore'
import { ViewportMount } from '@/components/common/ViewportMount'

export type SandpackTemplate = 'react' | 'react-ts' | 'vanilla' | 'vanilla-ts' | 'static' | 'node'

interface CodeSandboxProps {
  template?: SandpackTemplate
  files?: Record<string, string>
  caption?: string
  showConsole?: boolean
  editorHeight?: number
  previewHeight?: number
  autorun?: boolean
  showNavigator?: boolean
  showLineNumbers?: boolean
  wrapContent?: boolean
  showTabs?: boolean
  activeFile?: string
  visibleFiles?: string[]
  dependencies?: Record<string, string>
}

const DEFAULT_FILES: Record<string, Record<string, string>> = {
  react: {
    '/App.js': `export default function App() {
  return (
    <div>
      <h1>Hello, Sandpack!</h1>
      <p>Edit this code and see the changes live.</p>
    </div>
  )
}`,
    '/styles.css': `body{font-family:sans-serif;margin:0;padding:16px}`,
  },
  'react-ts': {
    '/App.tsx': `export default function App(): JSX.Element {
  return (
    <div>
      <h1>Hello, Sandpack!</h1>
      <p>Edit this code and see the changes live.</p>
    </div>
  )
}`,
    '/styles.css': `body{font-family:sans-serif;margin:0;padding:16px}`,
  },
  vanilla: {
    '/index.js': `document.getElementById('app').innerHTML = '<h1>Hello, Sandpack!</h1>'`,
    '/styles.css': `body{font-family:sans-serif;margin:0;padding:16px}`,
  },
  'vanilla-ts': {
    '/src/index.ts': `document.getElementById('app')!.innerHTML = '<h1>Hello, Sandpack!</h1>'`,
    '/styles.css': `body{font-family:sans-serif;margin:0;padding:16px}`,
  },
  static: {
    '/index.html': `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>Static Sandbox</title><link rel="stylesheet" href="/styles.css"/></head>
<body><div id="app"><h1>Hello, Sandpack!</h1></div></body>
</html>`,
    '/styles.css': `body{font-family:sans-serif;margin:0;padding:16px}`,
  },
  node: {
    '/index.js': `const http = require('http')
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Hello, Sandpack!\\n')
})
server.listen(3000, () => console.log('Running on http://localhost:3000/'))`,
  },
}

export function CodeSandbox({
  template = 'react',
  files,
  caption,
  showConsole = false,
  editorHeight = 350,
  previewHeight = 400,
  autorun = true,
  showNavigator = false,
  showLineNumbers = true,
  wrapContent = false,
  showTabs = true,
  activeFile,
  visibleFiles,
  dependencies,
}: CodeSandboxProps) {
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme)
  const sandpackTheme = resolvedTheme === 'dark' ? monokaiPro : githubLight

  const mergedFiles = React.useMemo(() => {
    const defaults = DEFAULT_FILES[template] ?? {}
    const result: Record<string, string> = {}
    for (const [key, value] of Object.entries({ ...defaults, ...files })) {
      result[key.startsWith('/') ? key : `/${key}`] = value
    }
    return result
  }, [template, files])

  const sandbox = (
    <div className="rounded-xl overflow-hidden border border-border shadow-sm bg-card">
      <SandpackProvider
        template={template}
        files={mergedFiles}
        theme={sandpackTheme}
        activeFile={activeFile}
        visibleFiles={visibleFiles}
        options={{
          autorun,
          autoReload: autorun,
          recompileMode: 'immediate',
          recompileDelay: 300,
          externalResources: [],
          bundlerTimeOut: 30000,
        }}
        customSetup={
          dependencies && Object.keys(dependencies).length > 0
            ? { dependencies }
            : undefined
        }
      >
        <SandpackLayout style={{ '--sp-layout-height': `${previewHeight}px` } as React.CSSProperties}>
          <SandpackCodeEditor
            style={{
              height: `${editorHeight}px`,
              maxHeight: `${editorHeight}px`,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontSize: '13px',
            }}
            showTabs={showTabs}
            showLineNumbers={showLineNumbers}
            showInlineErrors
            wrapContent={wrapContent}
            closableTabs
            initMode="user-visible"
          />
          <div className="flex flex-col">
            <SandpackPreview
              showNavigator={showNavigator}
              showOpenInCodeSandbox={false}
              style={{
                minHeight: `${previewHeight}px`,
                maxHeight: showConsole ? `${previewHeight * 0.65}px` : `${previewHeight}px`,
                overflow: 'auto',
              }}
            />
            {showConsole && (
              <SandpackConsole
                style={{
                  maxHeight: `${previewHeight * 0.4}px`,
                  overflow: 'auto',
                  borderTop: '1px solid var(--sp-colors-surface1, #e2e8f0)',
                }}
              />
            )}
          </div>
        </SandpackLayout>
      </SandpackProvider>
    </div>
  )

  return (
    <figure className="my-8 w-full">
      <ViewportMount rootMargin={400} minHeight={Math.min(editorHeight, previewHeight) + 80} fallback={
        <div className="rounded-xl overflow-hidden border border-border shadow-sm bg-card flex items-center justify-center h-48 text-sm text-muted-foreground">
          Loading sandbox…
        </div>
      }>
        {sandbox}
      </ViewportMount>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-muted-foreground italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
