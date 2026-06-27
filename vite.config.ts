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
import type { Plugin } from 'unified'
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerNotationFocus,
} from '@shikijs/transformers'
import path from 'path'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
  plugins: [
    tailwindcss(),
    ViteImageOptimizer({
      // PNG: lossy compression with high quality
      png: { quality: 80, effort: 10 },
      // JPEG: lossy compression
      jpeg: { quality: 80, progressive: true, mozjpeg: true },
      // WebP: generated alongside originals for modern browsers
      webp: { quality: 75, effort: 6 },
      // AVIF: next-gen format, more aggressive compression
      avif: { quality: 50, effort: 7 },
      // SVG: strip metadata
      svg: { plugins: ['preset-default', 'removeDimensions'] },
      // Also optimize images in the public directory
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
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // Core React ecosystem
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router/') || id.includes('node_modules/react-helmet-async/') ||
              id.includes('node_modules/scheduler/')) {
            return 'vendor-react'
          }
          // Animation (framer-motion is ~150KB+)
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-framer'
          }
          // MDX runtime
          if (id.includes('node_modules/@mdx-js/react')) {
            return 'vendor-mdx'
          }
          // Syntax highlighting (shiki bundles many grammars/themes)
          if (id.includes('node_modules/shiki') || id.includes('node_modules/@shikijs')) {
            return 'vendor-shiki'
          }
          // KaTeX math rendering (includes CSS + fonts)
          if (id.includes('node_modules/katex')) {
            return 'vendor-katex'
          }
          // Icon library (lucide-react accumulates size across many icon imports)
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons'
          }
          // State management & search
          if (id.includes('node_modules/zustand') || id.includes('node_modules/fuse.js')) {
            return 'vendor-state'
          }
          // Date utilities (imported across many components via @/lib/utils)
          if (id.includes('node_modules/date-fns/')) {
            return 'vendor-date'
          }
          // UI utilities
          if (id.includes('node_modules/clsx/') || id.includes('node_modules/tailwind-merge/') ||
              id.includes('node_modules/class-variance-authority/') || id.includes('node_modules/cmdk/')) {
            return 'vendor-ui'
          }
        },
      },
    },
  },
})
