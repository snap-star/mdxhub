import { defineConfig } from 'vitest/config'
import { reactRouter } from '@react-router/dev/vite'
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
import type { Plugin } from 'unified'
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerNotationFocus,
} from '@shikijs/transformers'
import path from 'path'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    tailwindcss(),
    ViteImageOptimizer({
      png: { quality: 80, effort: 10 },
      jpeg: { quality: 80, progressive: true, mozjpeg: true },
      webp: { quality: 75, effort: 6 },
      avif: { quality: 50, effort: 7 },
      svg: { plugins: ['preset-default', 'removeDimensions'] },
      includePublic: true,
    }),
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
          rehypeUnwrapImages as unknown as Plugin,
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
    reactRouter(),
    yaml(),
    process.env.ANALYZE ? visualizer({ open: true, gzipSize: true, brotliSize: true, filename: 'dist/stats.html' }) : null,
  ].filter(Boolean),
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
  test: {
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: true,
    env: {
      VITE_SITE_URL: 'https://mdxhub.vercel.app',
      VITE_DISQUS_SHORTNAME: 'mdxhub',
    },
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router/') ||
              id.includes('node_modules/scheduler/')) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-framer'
          }
          if (id.includes('node_modules/shiki') || id.includes('node_modules/@shikijs')) {
            return 'vendor-shiki'
          }
          if (id.includes('node_modules/katex')) {
            return 'vendor-katex'
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons'
          }
          if (id.includes('node_modules/@codesandbox/sandpack')) {
            return 'vendor-sandpack'
          }
          if (id.includes('node_modules/zustand')) {
            return 'vendor-misc'
          }
        },
      },
    },
  },
})
