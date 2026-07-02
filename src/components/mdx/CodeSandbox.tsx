import React from 'react'
import { SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview, SandpackConsole } from '@codesandbox/sandpack-react'
import { githubLight, monokaiPro } from '@codesandbox/sandpack-themes'
import { useThemeStore } from '@/store/themeStore'

// ─── Types ─────────────────────────────────────────────────────────────────

export type SandpackTemplate = 'react' | 'react-ts' | 'vanilla' | 'vanilla-ts' | 'static' | 'node'

interface CodeSandboxProps {
  /** The project template (default: "react") */
  template?: SandpackTemplate
  /**
   * A record of file paths to file contents.
   * Each key is an absolute path (e.g. "/App.js"), and the value is the source code.
   *
   * @example
   * ```mdx
   * <CodeSandbox
   *   files={{
   *     "/App.js": `
   *       export default function App() {
   *         return <h1>Hello!</h1>
   *       }
   *     `.trim(),
   *   }}
   * />
   * ```
   */
  files?: Record<string, string>
  /** Optional caption shown below the sandbox */
  caption?: string
  /** Whether to show the console panel (default: false) */
  showConsole?: boolean
  /** Height of the editor in pixels (default: 350) */
  editorHeight?: number
  /** Height of the preview in pixels (default: 400). When showConsole is true, the console shares this space. */
  previewHeight?: number
  /** Whether to auto-run the code (default: true) */
  autorun?: boolean
  /** Whether to show the navigation/refresh bar (default: false) */
  showNavigator?: boolean
  /** Whether to show line numbers in the editor (default: true) */
  showLineNumbers?: boolean
  /** Whether to wrap long lines in the editor (default: false) */
  wrapContent?: boolean
  /** Whether to show the Tabs header in the editor (default: true) */
  showTabs?: boolean
  /** External dependencies to add (e.g. { "axios": "latest", "lodash": "latest" }) */
  dependencies?: Record<string, string>
}

// ─── Default template files ────────────────────────────────────────────────

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
    '/styles.css': `body {
  font-family: sans-serif;
  margin: 0;
  padding: 16px;
}`,
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
    '/styles.css': `body {
  font-family: sans-serif;
  margin: 0;
  padding: 16px;
}`,
  },
  vanilla: {
    '/index.js': `const app = document.getElementById('app')
app.innerHTML = '<h1>Hello, Sandpack!</h1>'`,
    '/styles.css': `body {
  font-family: sans-serif;
  margin: 0;
  padding: 16px;
}`,
  },
  'vanilla-ts': {
    '/src/index.ts': `const app = document.getElementById('app')!
app.innerHTML = '<h1>Hello, Sandpack!</h1>'`,
    '/styles.css': `body {
  font-family: sans-serif;
  margin: 0;
  padding: 16px;
}`,
  },
  static: {
    '/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Static Sandbox</title>
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  <div id="app">
    <h1>Hello, Sandpack!</h1>
  </div>
</body>
</html>`,
    '/styles.css': `body {
  font-family: sans-serif;
  margin: 0;
  padding: 16px;
}`,
  },
}

// ─── Component ─────────────────────────────────────────────────────────────

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
  dependencies,
}: CodeSandboxProps) {
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme)
  const isDark = resolvedTheme === 'dark'
  const sandpackTheme = isDark ? monokaiPro : githubLight

  // Merge user files with template defaults — user files take precedence
  const mergedFiles = React.useMemo(() => {
    const templateDefaults = DEFAULT_FILES[template] ?? {}
    return {
      ...templateDefaults,
      ...files,
    }
  }, [template, files])

  // ── Build custom style overrides to match the project's design ──────────
  const customStyle = React.useMemo(
    () => ({
      borderRadius: '0',
      border: 'none',
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontSize: '13px',
    }),
    [],
  )

  // Normalize the file keys — Sandpack expects paths like "/App.js"
  const normalizedFiles = React.useMemo(() => {
    const result: Record<string, string> = {}
    for (const [key, value] of Object.entries(mergedFiles)) {
      const normalizedKey = key.startsWith('/') ? key : `/${key}`
      result[normalizedKey] = value
    }
    return result
  }, [mergedFiles])

  return (
    <figure className="my-8 w-full">
      <div
        className="rounded-xl overflow-hidden border border-border shadow-sm bg-card"
        style={{ fontFamily: 'inherit' }}
      >
        <SandpackProvider
          template={template}
          files={normalizedFiles}
          theme={sandpackTheme}
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
              style={customStyle}
              showTabs={showTabs}
              showLineNumbers={showLineNumbers}
              showInlineErrors
              wrapContent={wrapContent}
              closableTabs
              initMode="immediate"
              className="sandpack-editor"
            />
            <div className="flex flex-col">
              <SandpackPreview
                showNavigator={showNavigator}
                showOpenInCodeSandbox={false}
                className="sandpack-preview"
                style={{
                  minHeight: `${previewHeight}px`,
                  maxHeight: showConsole ? `${previewHeight * 0.6}px` : `${previewHeight}px`,
                  overflow: 'auto',
                }}
              />
              {showConsole && (
                <SandpackConsole
                  className="sandpack-console"
                  style={{
                    maxHeight: `${previewHeight * 0.45}px`,
                    overflow: 'auto',
                    borderTop: '1px solid var(--sp-colors-surface1, #e2e8f0)',
                  }}
                />
              )}
            </div>
          </SandpackLayout>
        </SandpackProvider>
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-muted-foreground italic">
          {caption}
        </figcaption>
      )}

      {/* ── Scoped styles for sandpack theming ── */}
      <style>{`
        .sandpack-editor {
          height: ${editorHeight}px !important;
          max-height: ${editorHeight}px;
          overflow: auto;
        }
        .sandpack-editor > div {
          height: 100% !important;
        }
        .sandpack-preview iframe {
          width: 100% !important;
        }
      `}</style>
    </figure>
  )
}
