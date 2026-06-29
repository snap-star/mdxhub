# Contributing to MDX Hub

First off, thank you for considering contributing to MDX Hub! 🎉 We're thrilled
to have you here. Whether you're fixing a bug, writing content, improving
documentation, or proposing a new feature — every contribution is valued.

This guide will walk you through the project, how to set up your environment,
and how to submit your first pull request.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [What We're Building](#what-were-building)
- [Ways to Contribute](#ways-to-contribute)
- [Getting Started](#getting-started)
- [Project Architecture](#project-architecture)
- [Coding Guidelines](#coding-guidelines)
- [Pull Request Process](#pull-request-process)
- [Content Contributions](#content-contributions)
- [Reporting Bugs & Feature Requests](#reporting-bugs--feature-requests)

---

## Code of Conduct

This project is governed by the [Contributor Covenant v2.1](CODE_OF_CONDUCT.md).
By participating, you agree to uphold this code. Please report unacceptable
behavior by opening a confidential issue on GitHub.

---

## What We're Building

MDX Hub is a blazingly fast, MDX-powered platform for blogs and documentation
sites. It runs on:

- **React 19** with Vite 8
- **Tailwind CSS v4** (CSS-first, OKLCH color spaces)
- **MDX v3** for content authoring
- **React Router v8** for routing
- **Zustand v5** for state management
- **Framer Motion 12** for animations
- **Shiki v4** for syntax highlighting
- **TypeScript 6** across the board

No database needed — content is Git-backed Markdown/MDX files.

---

## Ways to Contribute

### 🐛 Report Bugs

Open an issue on GitHub with:
- A clear, descriptive title
- Steps to reproduce (including any content files if relevant)
- Expected vs. actual behavior
- Screenshots if applicable
- Browser and OS details

### 💡 Suggest Features

Open a feature request issue describing:
- What problem the feature solves
- How you envision it working
- Any relevant examples from other projects

### 📝 Write Content

The easiest way to contribute! Write blog posts or improve documentation.
See [Content Contributions](#content-contributions) below.

### 🧑‍💻 Submit Code

Fork the repo, make your changes, and open a pull request. We accept:

- Bug fixes
- Performance improvements
- New MDX components
- UI/UX enhancements
- Build pipeline improvements
- Dependency updates

### 📖 Improve Documentation

Found a typo, unclear instruction, or missing information in the docs?
PRs to `content/docs/` or the project README are always welcome.

---

## Getting Started

### Prerequisites

- **Node.js 20+** and **pnpm 9+** (or npm 10+)

### Fork & Clone

```bash
git clone https://github.com/snap-star/mdxhub.git
cd mdxhub
pnpm install
```

### Start Development

```bash
pnpm run dev
```

Opens at [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
pnpm run build
```

### Lint

```bash
pnpm run lint
```

---

## Project Architecture

```text
├── content/                  # Your Markdown/MDX content
│   ├── blog/                 # Blog posts (auto-routed to /blog/*)
│   ├── docs/                 # Documentation pages (/docs/*)
│   ├── authors/              # Author profiles (YAML)
│   └── about.mdx             # About page
├── src/
│   ├── components/
│   │   ├── blog/             # Blog-specific components
│   │   ├── docs/             # Docs-specific components
│   │   ├── mdx/              # Global MDX components
│   │   ├── common/           # Navbar, Footer, SEO, etc.
│   │   └── search/           # Command palette search
│   ├── routes/               # React Router page definitions
│   ├── layouts/              # RootLayout, BlogLayout, DocsLayout
│   ├── store/                # Zustand stores
│   ├── lib/                  # Utilities, types, remark plugins
│   └── styles/               # CSS overrides
├── scripts/                  # Build scripts (RSS, sitemap, images)
├── site.config.json          # Site-wide configuration
└── public/                   # Static assets + generated files
```

Key files to know:

| File | Purpose |
| :--- | :--- |
| `site.config.json` | Centralized site configuration (title, URL, SEO, profile, hero, share) |
| `content/authors/authors.yaml` | Author profiles registry |
| `src/components/mdx/MDXComponents.tsx` | Global MDX component registration |
| `src/lib/content/types.ts` | Content type definitions |
| `src/router.tsx` | Route definitions |

---

## Coding Guidelines

### TypeScript

- Strict mode is enabled in `tsconfig.app.json`
- Use explicit types for function parameters and return values where the type
  isn't trivially inferred
- Prefer `interface` over `type` for object shapes
- Avoid `any` — use `unknown` and narrow with type guards instead
- Run `npx tsc --noEmit` before pushing to catch type errors

### React

- Use **function components** with hooks — no class components
- Keep components focused and composable
- Use `React.useMemo` / `React.useCallback` for expensive computations, but
  don't over-optimize prematurely
- Import React hooks from `'react'` (not from the global namespace)

### Styling

- Use **Tailwind CSS v4** utility classes exclusively
- Follow the CSS-first architecture: configure via CSS `@theme` directives,
  not `tailwind.config.*`
- The project uses OKLCH color spaces for the brand palette (`brand-50`
  through `brand-950` in oklch)
- Use CSS View Transitions (`@view-transition` and `view-transition-name`)
  when adding page-level animations

### State Management

- Global state belongs in Zustand stores (`src/store/`)
- Prefer local component state (`useState`) before reaching for global state
- Use Zustand's persist middleware sparingly — only for user preferences
  (e.g., theme)

### Components

- One component per file, exported as a named export
- File names match component names (PascalCase)
- Place components in the appropriate subdirectory under `src/components/`
- MDX components registered globally go in `src/components/mdx/` and must be
  added to `MDXComponents.tsx`

### Performance

- Lazy-load images and videos by default
- Use `React.lazy` / code splitting for heavy third-party components
- Add manual chunk splits in `vite.config.ts` for large libraries

### Commit Messages

We don't enforce a strict commit style, but clear messages help reviews:

```text
feat: add table of contents scroll-spy animation
fix: correct reading time calculation for CJK characters
docs: update installation guide for pnpm users
chore: bump tailwindcss to v4.3.1
refactor: extract social link buttons into shared component
```

---

## Pull Request Process

1. **Fork the repository** and create a feature branch from `main`
2. **Make your changes** following the coding guidelines above
3. **Test your changes**:
   - Run `pnpm run dev` and verify in the browser
   - Run `npx tsc --noEmit` to check types
   - Run `pnpm run lint` to check code style
   - If you added a new feature, include a demo in a content file or PR
     description
4. **Open a pull request** against the `main` branch with:
   - A clear title describing the change
   - A description of what was changed and why
   - Screenshots or GIFs for UI changes
   - Closes `#issue-number` if relevant
5. A maintainer will review your PR. We aim to respond within 48 hours.
   Expect feedback and possibly requests for changes — that's normal!
6. Once approved, your PR will be squash-merged into `main`.

### Before You Open a PR

- Make sure your branch is up to date with `main`:
  ```bash
  git fetch upstream
  git rebase upstream/main
  ```
- Avoid adding unrelated changes or running formatters across the entire
  codebase — keep your diff focused

---

## Content Contributions

Writing content is one of the best ways to contribute — no deep coding knowledge
needed!

### Blog Posts

Create a new `.mdx` file in `content/blog/`:

```yaml
---
title: "My Awesome Post"
date: "2026-06-30"
author: "your-author-id"       # Must match an id in authors.yaml
category: "Tutorial"
tags: ["react", "vite"]
description: "A short summary for the post card and SEO."
coverImage: "https://example.com/image.png"
draft: true                    # Set to false when ready to publish
---
```

> **Tip:** Set `draft: false` only when the post is ready. Draft posts are
> hidden from the feed during development.

### Adding Yourself as an Author

Add your profile to `content/authors/authors.yaml`:

```yaml
- id: your-author-id
  name: "Your Name"
  avatar: "/path-to-avatar.png"
  bio: "A short bio about you."
  github: your-github-username
  website: https://your-website.com
```

### Documentation

Improve existing docs in `content/docs/` or add new pages. Each doc page
uses frontmatter:

```yaml
---
title: "Page Title"
section: "Section Name"
order: 1
description: "Brief description for sidebar and SEO."
---
```

### MDX Components

You can use any of the [built-in MDX components](https://mdxhub.vercel.app/blog/demo-mdx-components)
in your content — no import needed. They're globally registered.

---

## Reporting Bugs & Feature Requests

### Bugs

Open a GitHub issue with the `bug` label. Include:

1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Browser, OS, and device details
5. Any error messages from the browser console

### Feature Requests

Open a GitHub issue with the `enhancement` label. Include:

1. What the feature does and why it's useful
2. How it should work (mockups or examples help!)
3. Any relevant implementation ideas

---

## Questions?

If you're unsure about anything — whether it's a bug, a feature idea, or just
how to get started — open a discussion on GitHub. No question is too small.

Thank you for helping make MDX Hub better! 🙏

---

**MDX Hub** — Built with ❤️ by [snap-star](https://github.com/snap-star)
