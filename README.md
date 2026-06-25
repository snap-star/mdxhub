# MDX Hub ✍️

A blazingly fast, highly interactive, and beautiful MDX-powered platform for building blogs and documentation sites. Built from the ground up to provide a world-class developer and authoring experience.

**No database required.** Just write your `.mdx` files in the `content/` directory, commit them to Git, and let the build system handle the rest.

---

## ✨ Features

- **Git-Backed CMS**: Write content as Markdown/MDX files right in your editor. Automatically discovered and routed using Vite.
- **Rich MDX Components**: Use React components directly inside your Markdown.
  - Native `<VideoEmbed />` (YouTube, Shorts, custom aspect ratios)
  - Interactive `<Callout />` admonitions
  - Author profile badges
- **True Syntax Highlighting**: High-fidelity code blocks using [Shiki.js](https://shiki.style/), matching classic IDE themes (Monokai for dark mode, GitHub Light for light mode).
- **Mathematical Equations**: Native LaTeX rendering using `remark-math` and KaTeX.
- **Automatic SEO**: Automatically generates `og:image`, `twitter:card`, canonical URLs, and metadata straight from your MDX frontmatter.
- **Beautiful UI**: Discord-inspired dark theme, fluid animations via Framer Motion, and seamless responsive design.

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Content**: [MDX v3](https://mdxjs.com/) with `remark-gfm` and `rehype-katex`
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first architecture)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **State Management**: [Zustand v5](https://zustand-demo.pmnd.rs/)
- **Icons**: `lucide-react` & `simple-icons`

---

## 📦 Getting Started

### Prerequisites
You will need **Node.js 20+** installed on your machine.

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📂 Project Structure

```text
├── content/              # Your Markdown/MDX content lives here!
│   ├── blog/             # All blog posts (auto-routed to /blog/*)
│   ├── docs/             # Documentation pages (auto-routed to /docs/*)
│   ├── authors/          # Author registry (authors.yaml)
│   └── about.mdx         # The special /about page
├── public/               # Static assets (images, RSS feeds, etc.)
├── src/                  
│   ├── components/       # Reusable React components (UI, MDX, Layout)
│   ├── lib/              # Utilities (content parsers, search logic)
│   ├── routes/           # React Router page definitions
│   ├── store/            # Zustand global state
│   ├── styles/           # Tailwind and custom CSS
│   └── main.tsx          # Application entry point
├── site.config.json      # Global site configuration (title, github URL)
└── package.json          # Project dependencies
```

---

## 📝 Authoring Content

To create a new blog post, simply create a new `.mdx` file in `content/blog/` with the following YAML frontmatter at the top:

### Basic syntax

```yaml
---
title: "My Awesome Post"
date: "2026-06-21"
author: "chigusa-asuha"
category: "Tutorial"
tags: ["react", "mdx", "vite"]
description: "A short summary for the post card and SEO meta description."
coverImage: "https://images.unsplash.com/..." # Used for thumbnail and OpenGraph preview
---

Your content goes here...
```

### Series Syntax

```yaml
---
title: "My Awesome Post" #your blog post title
date: "2026-06-21" # Format date YYYY-MM-DD
author: "chigusa-asuha" #author profile badge
category: "Tutorial"
tags: ["react", "mdx", "vite"] # An array tags.
description: "A short summary for the post card and SEO meta description."
coverImage: "https://images.unsplash.com/..." # Used for thumbnail and OpenGraph preview support local image byPath Location and url.
series: seriesName #Your Series Name used for series title in series nav and postcard badge
seriesOrder: seriesNumber (e.g: 1,2,3) # Used to sort the series ordering
---

Your content goes here...
```

For more detailed information, check out the [Creating Posts Guide](/blog/creating-posts-guide) in the local blog once the dev server is running.

---

## 🛠️ Build for Production

To generate a static production build:

```bash
npm run build
npm run preview
```

## 📜 License
MIT License. Created with ❤️
