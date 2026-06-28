# MDX Hub ✍️

![MDXHub](./public/mdxhub.png)

A blazingly fast, highly interactive, and beautiful MDX-powered platform for building blogs and documentation sites. Built from the ground up to provide a world-class developer and authoring experience.

**No database required.** Just write your `.md` or `.mdx` files in the `content/` directory, commit them to Git, and let the build system handle the rest.

---

## ✨ Features

### 📝 Content Authoring
- **Git-Backed CMS**: Write content as Markdown/MDX files right in your editor. Automatically discovered and routed using Vite's `import.meta.glob`.
- **Nested Content Routing**: Supports nested folders in `content/blog/**` and `content/docs/**`, with `index.mdx` folder slug support.
- **Relative MDX Assets**: Resolve image sources relative to the current content folder, or use static `/public` assets.
- **Rich MDX Components**: Use React components directly inside your Markdown — globally available, no imports needed.
- **Series Support**: Group related posts into series with automatic navigation between parts.
- **Draft System**: Set `draft: true` in frontmatter to exclude posts from the published feed.

### 🧩 Built-in MDX Components
| Component | Description |
| :--- | :--- |
| `<VideoEmbed />` | YouTube, Shorts, Vimeo — custom aspect ratios (`16/9`, `4/3`, `1/1`, `9/16`) |
| `<Callout />` | Admonitions: `note`, `tip`, `info`, `warning`, `danger` — with themed icons |
| `<Badge />` | Colorful inline pill — 22+ colors, 40+ icons, admonition variants |
| `<Tooltip />` | Accessible hover/focus tooltip with placement control (`top`, `bottom`, `left`, `right`) |
| `<ProfileBadge />` | Author profile card for About pages |
| `<CCLicense />` | One-line Creative Commons badge for any post |
| `<AuthorCard />` | Full author card with avatar, bio, and social links |

### 🖼️ Media & Rich Content
- **Image Lightbox**: Every image is clickable — opens a full-screen viewer with zoom (25%–400%), rotate, and keyboard (Escape) controls
- **Video Embeds**: YouTube, Shorts, Vimeo — auto-detected and lazy-loaded
- **Mathematical Equations**: Native LaTeX rendering using `remark-math` and KaTeX (inline `$...$` and block `$$...$$`)
- **Image Optimization**: Build-time WebP and AVIF variant generation via Sharp
- **Optimized Images**: `<picture>` elements with automatic format fallbacks

### 🎨 Visual & UX
- **True Syntax Highlighting**: High-fidelity code blocks using [Shiki.js](https://shiki.style/) — Monokai (dark mode), GitHub Light (light mode)
- **Code Block Enhancements**: macOS-style window controls, language label, copy button with checkmark feedback
- **Line Highlighting**: Shiki transformers for diff, highlight, word highlight, and focus annotations
- **Discord-Inspired Dark Theme**: Full OKLCH color palette with brand blue accents
- **Page Transitions**: Fluid Framer Motion `AnimatePresence` transitions with scroll-to-top on navigation
- **Responsive Design**: Mobile-first with dedicated mobile sidebar drawer and bottom TOC sheet

### 🔍 Search & Navigation
- **Full-Text Search**: Press `Ctrl+K`/`Cmd+K` anywhere — fuzzy search across all blog posts and docs using Fuse.js
- **Table of Contents**: Scroll-spy powered by IntersectionObserver, with mobile slide-out sheet
- **Breadcrumbs**: Contextual navigation in blog posts and docs pages
- **Category & Tag Filtering**: Filter blog posts by category or tag, with sidebar widgets and tag clouds
- **Series Navigation**: Inline series indicator with prev/next navigation between parts

### 🔗 SEO & Discovery
- **Automatic SEO**: Per-page `og:image`, `twitter:card`, canonical URLs, and meta tags via `react-helmet-async`
- **Sitemap**: Auto-generated `sitemap.xml` (74+ URLs) with `lastmod` dates from file modification times
- **Robots.txt**: Auto-generated with `Allow: /` and `Sitemap:` directive
- **RSS Feed**: Auto-generated `/rss.xml` with all published blog posts, categories, tags, and author metadata
- **Disqus Comments**: Per-post commenting with comment count badges on cards
- **Share Buttons**: Social sharing for every blog post

### ⚡ Performance
- **Image Optimization**: Build-time WebP/AVIF generation, lazy loading, and responsive `<picture>` elements
- **Code Splitting**: Manual chunk splitting for React, Framer Motion, Shiki, KaTeX, icons, and utilities
- **CSS View Transitions**: Native `@view-transition` API for smooth page navigations
- **Lazy Loading**: Images and videos are lazy-loaded by default

---

## 🚀 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) |
| **Bundler** | [Vite 8](https://vitejs.dev/) |
| **Content** | [MDX v3](https://mdxjs.com/) with `remark-gfm`, `remark-math`, and `rehype-katex` |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first architecture, OKLCH color spaces) |
| **Routing** | [React Router v8](https://reactrouter.com/) |
| **State Management** | [Zustand v5](https://zustand-demo.pmnd.rs/) with persistence middleware |
| **Animation** | [Framer Motion 12](https://www.framer.com/motion/) |
| **Syntax Highlighting** | [Shiki v4](https://shiki.style/) (dual-theme, diff/highlight/focus transformers) |
| **Math Rendering** | [KaTeX](https://katex.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) + [Simple Icons](https://simpleicons.org/) |
| **Search** | [Fuse.js](https://fusejs.io/) (fuzzy search) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) + [Base UI](https://base-ui.com/) |
| **Image Processing** | [Sharp](https://sharp.pixelplumbing.com/) |
| **Language** | [TypeScript 6](https://www.typescriptlang.org/) |

---

## 📦 Getting Started

### Prerequisites

You will need **Node.js 20+** and **pnpm 9+** (or npm 10+) installed on your machine.

### Installation

```bash
git clone https://github.com/snap-star/mdxhub.git
cd mdxhub
pnpm install
```

### Start Development

```bash
pnpm run dev
```

This starts the Vite dev server at [http://localhost:3000](http://localhost:3000). On startup, it automatically generates the RSS feed and sitemap.

### Production Build

```bash
pnpm run build
```

The build pipeline:
1. Generates WebP/AVIF image variants from source images
2. Generates the RSS feed (`public/rss.xml`)
3. Generates the sitemap (`public/sitemap.xml`) and `robots.txt`
4. Type-checks the project with TypeScript
5. Bundles everything with Vite into `dist/`

Preview the build locally:

```bash
pnpm run preview
```

---

## 📂 Project Structure

```text
├── content/                    # Your Markdown/MDX content lives here
│   ├── blog/                  # Blog posts (auto-routed to /blog/*)
│   │   ├── react-19-complete-*/   # 30-part React 19 series
│   │   ├── tailwindcss-v4/        # 5-part Tailwind CSS v4 series
│   │   ├── trpc-zod/              # tRPC + Zod series
│   │   ├── zustand/               # Zustand series
│   │   └── *.mdx                  # Standalone posts
│   ├── docs/                  # Documentation pages (auto-routed to /docs/*)
│   │   ├── 1-introduction/
│   │   ├── 2-guides/
│   │   ├── 3-deployment/
│   │   ├── 4-troubleshooting/
│   │   ├── 5-author/
│   │   └── 6-project-status/
│   ├── authors/
│   │   └── authors.yaml      # Author profiles registry
│   └── about.mdx              # Rendered at /about
├── public/                    # Static assets served at root
│   ├── rss.xml               # Auto-generated RSS feed (via prebuild)
│   ├── sitemap.xml            # Auto-generated sitemap (via prebuild)
│   ├── robots.txt             # Auto-generated robots.txt (via prebuild)
│   └── ...                    # Images, icons, etc.
├── scripts/
│   ├── generate-image-variants.cjs   # WebP/AVIF generation
│   ├── generate-rss.cjs              # RSS feed generation
│   └── generate-sitemap.cjs          # Sitemap + robots.txt generation
├── src/
│   ├── components/
│   │   ├── blog/             # Blog-specific components (PostCard, TOC, Breadcrumbs, etc.)
│   │   ├── docs/             # Docs-specific components (Sidebar, PrevNextNav, etc.)
│   │   ├── mdx/              # Global MDX components (Callout, VideoEmbed, Badge, etc.)
│   │   ├── common/           # Shared components (Navbar, Footer, SEO, ThemeToggle)
│   │   ├── search/           # Search command palette (Cmd+K)
│   │   └── transitions/      # Page transition wrapper
│   ├── layouts/              # RootLayout, BlogLayout, DocsLayout
│   ├── routes/               # React Router page definitions
│   ├── lib/                  # Utilities, content types, remark plugins
│   ├── store/                # Zustand stores (content, navigation, theme)
│   └── styles/               # Blog and docs theme overrides
├── site.config.json          # GitHub URL configuration
├── vercel.json               # Vercel SPA rewrites config
└── package.json              # Project dependencies and scripts
```

---

## 🧭 Routing Rules

- `content/about.mdx` → `/about`
- `content/docs/**/*.{md,mdx}` → `/docs/*`
- `content/blog/**/*.{md,mdx}` → `/blog/*`
- `content/blog/**/index.mdx` → `/blog/**` (folder slug)
- `content/docs/**/index.mdx` → `/docs/**` (folder slug)

### Valid Routes

| Path | Source |
| :--- | :--- |
| `/` | Redirects to `/blog` |
| `/about` | `content/about.mdx` |
| `/blog` | Blog index (all posts) |
| `/blog/:slug` | Individual blog post |
| `/blog/category/:name` | Filtered by category |
| `/blog/tag/:tag` | Filtered by tag |
| `/docs` | Docs landing page |
| `/docs/:section/:slug` | Individual doc page |

### Invalid Routes

- `/about/me` — only `/about` is supported for the standalone about page
- `/docs/about` — docs pages must live under `content/docs/`
- `/content/docs/guides/installation` — URLs do not include the `content/` prefix

---

## 📝 Authoring Content

### Blog Post Frontmatter

```yaml
---
title: "My Awesome Post"
date: "2026-06-21"
author: "chigusa-asuha"     # Must match an id in content/authors/authors.yaml
category: "Tutorial"
tags: ["react", "mdx", "vite"]
description: "A short summary for the post card and SEO meta description."
coverImage: "https://..."    # Thumbnail and Open Graph image
cc: "CC-BY-4.0"              # Optional Creative Commons license
series: "My Series Name"     # Optional — groups related posts
seriesOrder: 1               # Optional — sort order within a series
draft: false                 # Optional — hides from feed when true
featured: true               # Optional — shows in featured posts widget
readingTime: 5               # Optional — override auto-calculated reading time
---
```

### Doc Page Frontmatter

```yaml
---
title: "Getting Started"
section: "Introduction"       # Section name shown in sidebar
order: 1                      # Sort order within section
description: "Learn how to…"
version: "v1.0"              # Optional version badge
draft: false
toc: true                     # Enable table of contents (default: true)
---
```

Blog slugs are derived from the file path. Files under `content/blog/**` map to `/blog/...`, and `index.mdx` inside a folder maps to the folder slug.

For more detailed information, check out the [Creating Posts Guide](/blog/creating-posts-guide) once the dev server is running.

---

## 🔧 Scripts Reference

| Command | Description |
| :--- | :--- |
| `pnpm run dev` | Start dev server (generates RSS + sitemap on startup) |
| `pnpm run build` | Image variants → RSS → sitemap → type-check → production build |
| `pnpm run preview` | Serve the production build locally |
| `pnpm run lint` | Run ESLint on all source files |

### Prebuild Pipeline

The following scripts run automatically before every production build:

1. **`scripts/generate-image-variants.cjs`** — Generates WebP and AVIF variants of all content images using Sharp
2. **`scripts/generate-rss.cjs`** — Generates `public/rss.xml` from all published blog posts
3. **`scripts/generate-sitemap.cjs`** — Generates `public/sitemap.xml` and `public/robots.txt`

---

## 🌐 Configuration

### Site Config

Edit `site.config.json` at the project root:

```json
{
  "githubUrl": "https://github.com/snap-star/mdxhub"
}
```

### Authors Registry

Register authors in `content/authors/authors.yaml`:

```yaml
- id: chigusa-asuha
  name: "Chigusa Asuha"
  avatar: "/snap-star.png"
  bio: "Lead Developer & Creative Technologist."
  github: snap-star
  website: https://mdxhub.vercel.app/
```

### SEO Configuration

SEO metadata (site URL, title, description, Open Graph defaults) is configured in `src/components/common/SEO.tsx`. The site URL is currently set to `https://mdxhub.vercel.app` — update this before deploying to a custom domain.

---

## 🚢 Deployment

This project is a fully static SPA. Deploy to any static host:

### Vercel (Recommended)

The included `vercel.json` handles SPA routing automatically:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

1. Push to GitHub
2. Import to Vercel (auto-detects Vite)
3. Done

### Netlify

Add a `public/_redirects` file or `netlify.toml` with:

```
/*    /index.html   200
```

---

## 📜 License

MIT License. Created with ❤️ by [snap-star](https://github.com/snap-star).
