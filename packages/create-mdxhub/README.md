# create-mdxhub

**create-mdxhub** — MDXHub is a blazingly fast documentation and blog platform built with **React 19**, **Vite 8**, **TailwindCSS v4**, and **MDX**.

## Usage

### Interactive mode (default)

```bash
npm create mdxhub@latest
pnpm create mdxhub@latest
# or
yarn create mdxhub
```

Follow the interactive prompts to choose:

- **Full** — Complete site with blog + docs + about page + all features
- **Blog** — Blog-only site with categories, tags, series, and author pages
- **Docs** — Documentation-only site with sidebar navigation and section grouping

### Non-interactive mode (CI/automation)

```bash
# Minimal (all defaults)
npm create mdxhub@latest -- --yes

# Full control
npx create-mdxhub --yes --name my-site --template blog --pm pnpm --skip-install
```

| Flag | Default | Description |
|---|---|---|
| `--yes`, `-y` | — | Skip all prompts |
| `--name <name>` | `my-mdxhub-site` | Project name |
| `--template <t>` | `full` | `full`, `blog`, or `docs` |
| `--pm <pm>` | `pnpm` | `pnpm`, `npm`, or `yarn` |
| `--skip-install` | — | Skip dependency installation |
| `--help`, `-h` | — | Show help

## Features

MDXHub comes packed with features out of the box:

- **⚡ Blazing fast** — React 19 + Vite 8 with SPA prerendering
- **📝 MDX-powered** — Write content in MDX with rich React components
- **🎨 Beautiful UI** — TailwindCSS v4 with dark mode, custom OKLCH palette
- **🔍 Full-text search** — Command palette (Cmd+K) search
- **🌍 i18n ready** — Built-in translation system (EN, JA, ID)
- **📱 Responsive** — Mobile-first design with slide-in docs sidebar
- **🔗 Social sharing** — Twitter, Facebook, LinkedIn, copy link
- **📊 Analytics** — Plausible / GA integration ready
- **💬 Comments** — Disqus integration ready
- **📰 Newsletter** — Mailchimp integration ready
- **📡 RSS / Sitemap** — Auto-generated RSS feed and XML sitemap
- **🎨 MDX components** — Callouts, tabs, accordions, code blocks with Shiki syntax highlighting, charts, Mermaid diagrams, and more

## Maintainer Docs

See [VERSIONING.md](./VERSIONING.md) for:

- Versioning strategy & release workflow
- How to update templates when the main project changes
- Adding new files to the template manifest
- Full architecture documentation
