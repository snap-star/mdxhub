/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DISQUS_SHORTNAME?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.yaml' {
  const content: Record<string, unknown>[]
  export default content
}

declare module '*.mdx' {
  const content: React.ComponentType
  export const frontmatter: Record<string, unknown>
  export default content
}
