/// <reference types="vite/client" />

declare module '*.yaml' {
  const content: any
  export default content
}

declare module '*.mdx' {
  const content: any
  export const frontmatter: any
  export default content
}
