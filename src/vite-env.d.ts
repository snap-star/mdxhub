/// <reference types="vite/client" />

declare module '*.yaml' {
  const content: Record<string, unknown>[]
  export default content
}

declare module '*.mdx' {
  const content: React.ComponentType
  export const frontmatter: Record<string, unknown>
  export default content
}
