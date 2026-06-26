import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import yaml from '@rollup/plugin-yaml'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { remarkReadingTime } from './src/lib/remark-reading-time'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeShiki from '@shikijs/rehype'
import rehypeUnwrapImages from 'rehype-unwrap-images'
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerNotationFocus,
} from '@shikijs/transformers'
import path from 'path'

export default defineConfig({
  plugins: [
    tailwindcss(),
    {
      enforce: 'pre' as const,
      ...mdx({
        remarkPlugins: [
          remarkFrontmatter,
          remarkReadingTime,
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
          remarkGfm,
          remarkMath,
        ],
        rehypePlugins: [
          rehypeUnwrapImages,
          rehypeSlug,
          rehypeKatex,
          [rehypeAutolinkHeadings, { behavior: 'wrap', properties: { className: ['anchor-link'] } }],
          [
            rehypeShiki,
            {
              themes: {
                light: 'github-light',
                dark: 'monokai',
              },
              defaultColor: false,
              defaultLanguage: 'text',
              fallbackLanguage: 'text',
              transformers: [
                transformerNotationDiff(),
                transformerNotationHighlight(),
                transformerNotationWordHighlight(),
                transformerNotationFocus(),
              ],
              addLanguageClass: true,
            },
          ],
        ],
        providerImportSource: '@mdx-js/react',
      }),
    },
    react({
      include: /\.(md|mdx|js|jsx|ts|tsx)$/,
    }),
    yaml(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@content': path.resolve(__dirname, './content'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
