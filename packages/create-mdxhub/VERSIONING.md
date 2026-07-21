# create-mdxhub — Versioning & Maintenance Guide

## Table of Contents

1.  [Architecture Overview](#architecture-overview)
2.  [CLI Flags & Non-interactive Mode](#cli-flags--non-interactive-mode)
3.  [Versioning Strategy](#versioning-strategy)
4.  [Package Structure](#package-structure)
5.  [How Templates Work](#how-templates-work)
6.  [Updating Templates](#updating-templates)
7.  [Adding New Files to a Template](#adding-new-files-to-a-template)
8.  [Release Workflow](#release-workflow)
9.  [Development Workflow](#development-workflow)
10. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

`create-mdxhub` is a scaffolding CLI inside the MDXHub monorepo at `packages/create-mdxhub/`. It lets users bootstrap a new MDXHub project by running:

```bash
npm create mdxhub@latest
```

The CLI works in two modes:

### Production mode (published on npm)

All template files are pre-assembled into `packages/create-mdxhub/templates/full/`. The CLI reads directly from this bundled directory — no dependency on the parent project at runtime.

### Development mode (testing locally)

When the `templates/full/` directory doesn't exist yet (or is empty), the CLI walks up the filesystem to find the mdxhub project root (where `package.json` has `"name": "mdxhub"`) and reads files from there using the manifest patterns.

---

## CLI Flags & Non-interactive Mode

The CLI supports two modes: **interactive** (default) and **non-interactive** (CI/automation).

### Interactive Mode

```bash
npx create-mdxhub
```

Walks through 4 interactive prompts: project name, template variant, package manager, and confirmation.

### Non-interactive Mode

```bash
# Minimal (all defaults)
npx create-mdxhub --yes

# Full control
npx create-mdxhub --yes --name my-site --template blog --pm pnpm --skip-install
```

When `--yes` is passed, all prompts are skipped. Values come from flags or defaults.

### CLI Flag Reference

| Flag | Type | Default | Description |
|---|---|---|---|
| `--yes`, `-y` | boolean | `false` | Skip all prompts (non-interactive mode) |
| `--name <name>` | string | `my-mdxhub-site` | Project name (alphanumeric, hyphens, underscores, dots) |
| `--template <t>` | `full`, `blog`, `docs` | `full` | Template variant to scaffold |
| `--pm <pm>` | `pnpm`, `npm`, `yarn` | `pnpm` | Package manager for dependency installation |
| `--skip-install` | boolean | `false` | Skip `pnpm install` after scaffolding (for CI/testing) |
| `--help`, `-h` | — | — | Show usage help and exit |

### CI Pipeline Example

```yaml
# .github/workflows/test-scaffold.yml
jobs:
  scaffold:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npx create-mdxhub --yes --name test-site --template full --pm npm --skip-install
      - run: cd test-site && npm install && npm run build
```

---

## Versioning Strategy

### Independent Versioning

`create-mdxhub` uses **independent versioning** from the main `mdxhub` project. This is the industry-standard pattern used by Vite (`create-vite`), Next.js (`create-next-app`), and others.

**Why independent?**

| Scenario | Impact on `mdxhub` | Impact on `create-mdxhub` |
|---|---|---|
| Bug fix in a React component | Patch bump (`1.5.9` → `1.5.10`) | **No release needed** |
| New MDX component added | Minor bump | **Should release** (template needs update) |
| Breaking config change | Major bump | **Should release** (template needs update) |
| CLI bug fix (no template change) | No release | **Patch bump** |
| New CLI feature (better prompts) | No release | **Minor bump** |

### Version Convention

Follow [SemVer](https://semver.org/):

| Bump | When |
|---|---|
| **Patch** (`1.0.0` → `1.0.1`) | CLI bug fixes, template patches (typo fixes, dependency bumps) |
| **Minor** (`1.0.0` → `1.1.0`) | New features, new sample content, new MDX components added to templates |
| **Major** (`1.0.0` → `2.0.0`) | Breaking changes in scaffolded project structure |

### Version Location

The single source of truth is:

```
packages/create-mdxhub/package.json  →  "version": "1.0.0"
```

There is no relationship between this version and the root `package.json` version.

---

## Package Structure

```
packages/create-mdxhub/
├── package.json               # npm package config, bin entry, version
├── README.md                  # Quick-start for end users
├── VERSIONING.md              # THIS FILE — maintainer docs
├── src/
│   ├── index.js               # CLI entry point — interactive prompts
│   └── manifest.js            # File manifest → template file lists per variant
├── scripts/
│   └── assemble-templates.mjs # Build script: copies project files into templates/
└── templates/
    └── full/                  # Pre-assembled template (260+ files)
        ├── package.json
        ├── app/
        ├── content/
        ├── public/
        ├── scripts/
        ├── src/
        ├── .github/
        ├── @/
        └── ... (all other project files)
```

### Key Files

#### `src/manifest.js`

The manifest defines six categories:

| Category | Included in | Description |
|---|---|---|
| `shared` | All variants | Config files, common components, MDX components, hooks, stores, lib utilities, styles, scripts |
| `blogInfrastructure` | `full` + `blog` | Blog components (PostCard, CategoryFilter, etc.), BlogLayout, blog routes, blog.css |
| `blogContentEssential` | `full` + `blog` | Essential guide/component-usage content: `tutorial/`, `guide/`, `showcase/`, `authors/`, `about.mdx` |
| `blogContentSample` | `full` only | Sample/demo content (not included for blog-only variant): `architecture/`, `javascript/`, `news/`, `react/`, `tailwindcss-v4/`, `travel/`, `trpc-zod/`, `zustand/` |
| `docsOnly` | `full` + `docs` | Docs content, DocsSidebar, PrevNextNav, VersionBadge, DocsLayout, docs routes, docs.css |
| `generated` | (not copied) | Files created by the CLI at scaffold time: `app/routes.ts`, `public/*` build artifacts |

The manifest also exports helper functions:

- **`resolveFiles(variant)`** — Returns the list of file patterns to copy for a given variant.
- **`generateRoutesConfig(variant)`** — Generates variant-aware `app/routes.ts` content.
- **`getAllFilePatterns()`** — Returns all file patterns for template assembly.

#### `src/index.js`

The CLI entry point. Supports two modes:

**Interactive mode** (no flags):

1.  Parse CLI flags (`--yes`, `--name`, `--template`, `--pm`, `--skip-install`, `--help`)
2.  Display welcome banner
3.  Prompt for **project name**
4.  Prompt for **template variant** (full / blog / docs)
5.  Prompt for **package manager** (pnpm / npm / yarn)
6.  Show summary & ask for confirmation
7.  **Copy files** — iterate over manifest patterns, glob-match from source root, copy to target dir
8.  **Generate `app/routes.ts`** — variant-aware route config
9.  **Remove irrelevant content** — e.g., `content/docs/` for blog-only variant; sample blog posts for blog-only variant
10. **Patch Navbar & Footer** — remove variant-irrelevant nav links and footer sections
11. **Customize `package.json`** — set project name, keep version (imported by Navbar)
12. **Customize `site.config.json`** — set title, description
13. **Install dependencies** via the chosen package manager
14. Show next steps

**Non-interactive mode** (`--yes`):

Skips steps 2–6 and 14. Uses flag values or defaults for project name, variant, and package manager.

#### `scripts/assemble-templates.mjs`

Build script that copies all files from the manifest (`getAllFilePatterns()`) from the mdxhub project root into `templates/full/`. Run this after making changes to the main project that should be reflected in the template.

#### `scripts/e2e-test.mjs`

End-to-end test runner. Verifies:
- All 3 variants scaffold correctly (files, routes, content filtering)
- The full variant builds successfully (pnpm install + pnpm build)
- Non-interactive mode (`--yes`) works and produces correct output

---

## How Templates Work

### The Manifest-Driven Approach

Rather than maintaining three separate template directories (which would cause massive duplication), we use a **single full template** with a manifest that defines what belongs where.

```
manifest.js
├── shared  ──────────────────┐
├── blogOnly ──┐              │
├── docsOnly ──┤              │
└── generated  │              │
               │              │
        ┌──────┴──────┐       │
        │   "full"    ├───────┴──────── Both blogOnly + docsOnly
        ├──────┬──────┤
        │"blog"│"docs"│
        └──────┴──────┘
```

When the user selects a variant:

- **Full**: copies `shared` + `blogOnly` + `docsOnly`
- **Blog**: copies `shared` + `blogOnly`
- **Docs**: copies `shared` + `docsOnly`

### The Generated Routes File

`app/routes.ts` is **not copied** from the template — it's generated by the CLI at scaffold time. This is because the routes file differs between variants:

- **Full**: includes blog routes + docs routes + static routes
- **Blog**: includes only blog routes + static routes
- **Docs**: includes only docs routes + static routes

---

## Updating Templates

When you make changes to the main MDXHub project and want those changes reflected in what `create-mdxhub` scaffolds, follow these steps:

### 1. Make your changes in the main project

Edit source files in `src/`, `content/`, `app/`, `scripts/`, configuration files, etc. as needed.

### 2. Update the manifest (if adding new files)

If you added a **new file** that should be included in the template, add it to the appropriate category in `packages/create-mdxhub/src/manifest.js`:

```js
// Example: adding a new component
shared: [
  // ... existing entries ...
  'src/components/common/MyNewComponent.tsx',   // ← ADD THIS
],
```

### 3. Re-assemble the templates

Run the assembly script from the **monorepo root**:

```bash
node packages/create-mdxhub/scripts/assemble-templates.mjs
```

This copies all files listed in the manifest from the mdxhub project into `packages/create-mdxhub/templates/full/`.

### 4. Test the CLI locally

```bash
cd /tmp
node /path/to/mdxhub/packages/create-mdxhub/src/index.js
```

Walk through the interactive prompts and verify:
- Files are copied correctly
- `app/routes.ts` is generated with the correct variant
- `package.json` and `site.config.json` are customized
- The scaffolded project can install and run

### 5. Bump the version

```bash
cd packages/create-mdxhub
```

Update the `version` field in `package.json` following SemVer.

### 6. Publish (see [Release Workflow](#release-workflow))

---

## Adding New Files to a Template

Here's a complete checklist for adding a new file to the template:

1.  **Create the file** in the main mdxhub project.
2.  **Add it to the manifest** in `packages/create-mdxhub/src/manifest.js` under the appropriate category.
3.  **Re-assemble** with `node packages/create-mdxhub/scripts/assemble-templates.mjs`.
4.  **Verify** it appears in `packages/create-mdxhub/templates/full/`.
5.  **Test** the CLI scaffolds the new file correctly.

### Example: Adding a new blog component

```diff
// packages/create-mdxhub/src/manifest.js
blogInfrastructure: [
  // ... existing blog components ...
+ 'src/components/blog/NewBlogWidget.tsx',
],
```

Then reassemble.

### Example: Adding a new shared component (both blog + docs)

```diff
shared: [
  // ... existing shared components ...
+ 'src/components/common/NewSharedWidget.tsx',
],
```

---

## Release Workflow

### Prerequisites

- Node.js >= 18
- pnpm (or npm)
- npm account with access to publish `create-mdxhub`
- Logged in: `npm login`

### Step-by-step Release

#### 1. Prepare the templates

```bash
# From the monorepo root
git checkout main
git pull
node packages/create-mdxhub/scripts/assemble-templates.mjs
```

#### 2. Bump the version

Edit `packages/create-mdxhub/package.json`:

```json
{
  "name": "create-mdxhub",
  "version": "1.1.0",  // ← bump this
  // ...
}
```

Follow [SemVer](https://semver.org/):
- Patch (`1.0.0` → `1.0.1`): bug fixes, dependency bumps
- Minor (`1.0.0` → `1.1.0`): new features, new components in template
- Major (`1.0.0` → `2.0.0`): breaking changes

#### 3. Commit and tag

```bash
git add packages/create-mdxhub/
git commit -m "chore(create-mdxhub): bump to v1.1.0"
git tag create-mdxhub@v1.1.0
git push && git push --tags
```

#### 4. Publish to npm

```bash
cd packages/create-mdxhub
npm publish
```

#### 5. Verify

```bash
# Create a temporary directory
cd /tmp
# Test the published package
npm create mdxhub@latest
```

### Automated Release via GitHub Actions

The existing `.github/workflows/release.yml` workflow auto-creates GitHub Releases when `package.json` is updated on `main`. Consider extending it to also publish to npm:

```yaml
# Add to release.yml or create a new workflow
name: Publish create-mdxhub

on:
  push:
    tags:
      - 'create-mdxhub@v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: 'https://registry.npmjs.org'
      - run: node packages/create-mdxhub/scripts/assemble-templates.mjs
      - run: npm publish
        working-directory: packages/create-mdxhub
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## Development Workflow

### First-time setup

```bash
# From monorepo root
cd packages/create-mdxhub
npm install
```

### Iterating on the CLI logic

Edit files in `packages/create-mdxhub/src/` and test directly:

```bash
# Quick smoke test (non-interactive mode — no prompts)
node /path/to/mdxhub/packages/create-mdxhub/src/index.js --yes --name test-smoke --template full --pm pnpm --skip-install

# Or create a throwaway test directory for interactive testing
mkdir -p /tmp/mdxhub-test && cd /tmp/mdxhub-test
node /path/to/mdxhub/packages/create-mdxhub/src/index.js
```

### Running the e2e test suite

```bash
pnpm --filter create-mdxhub test:e2e
```

This assembles the latest templates and runs 141+ assertions covering:
- Scaffolding all 3 variants
- Building the full variant
- Verifying non-interactive mode

### Iterating on templates

1.  Make changes in the main mdxhub project.
2.  Re-assemble: `node packages/create-mdxhub/scripts/assemble-templates.mjs`.
3.  Test the CLI.

### Running the assembly script

```bash
# Always run from the monorepo root
node packages/create-mdxhub/scripts/assemble-templates.mjs

# Output:
#   ℹ Assembling templates...
#   ℹ Cleaning existing template directory...
#   ✓ Templates assembled:
#      Files copied: 260
#      Skipped:      0
#      Errors:       0
#      Location:     packages/create-mdxhub/templates/full
```

---

## Troubleshooting

### "Files copied: 0" when assembling

The assembly script couldn't find the mdxhub project root. Make sure you're running from within the monorepo:

```bash
# Correct (from monorepo root)
node packages/create-mdxhub/scripts/assemble-templates.mjs

# Wrong (from inside the package)
cd packages/create-mdxhub
node scripts/assemble-templates.mjs   # ❌ PROJECT_ROOT will be wrong
```

### CLI can't find template files in production

If `templates/full/` is missing or incomplete, the CLI falls back to walking up the filesystem. In production (npm package), the `templates/full/` directory MUST exist. Re-run assembly before publishing.

### "Skipped" files during assembly

Some manifest patterns may not match any file. Common causes:

- The file was deleted from the main project but not removed from the manifest
- The pattern is incorrect (typo in path)
- A glob pattern (`content/blog/**`) doesn't match because the directory is empty

To clean up stale manifest entries, remove them from `manifest.js` and re-assemble.

### The scaffolded project doesn't build

Possible causes:

1.  `app/root.tsx` was not copied — check it's in `MANIFEST.shared`.
2.  A new dependency was added to `package.json` but `pnpm-lock.yaml` wasn't updated.
3.  A new module import doesn't exist in the template — add it to the manifest.

---

## Appendices

### A. File Reference: `manifest.js`

| Section | Files covered |
|---|---|
| `shared` | 65+ entries: configs, app entry, common/MDX components, hooks, lib, stores, routes, styles, tests, translations |
| `blogInfrastructure` | 32 entries: blog components, layout, 6 routes, blog.css |
| `blogContentEssential` | 5 patterns: `tutorial/**`, `guide/**`, `showcase/**`, `authors/`, `about.mdx` |
| `blogContentSample` | 8 patterns: `architecture/**`, `javascript/**`, `news/**`, `react/**`, `tailwindcss-v4/**`, `travel/**`, `trpc-zod/**`, `zustand/**` |
| `docsOnly` | 6 entries: docs content, 3 docs components, layout, 2 routes, docs.css |
| `generated` | 5 entries: app/routes.ts, public/* build artifacts |

### B. CLI Flow Diagram

```
                 ┌───────────────────────────────────┐
                 │        CLI Entry (index.js)        │
                 │  Parse flags: --yes, --name, etc.   │
                 └──────────────┬────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
           ┌────────▼────────┐    ┌─────────▼─────────┐
           │  --yes FLAG?     │    │   Interactive      │
           │  No prompts      │    │   4 prompts        │
           │  Use flag vals   │    │  + confirmation    │
           └────────┬────────┘    └─────────┬─────────┘
                    │                       │
                    └───────────┬───────────┘
                                │
                 ┌──────────────▼──────────────┐
                 │  scaffold() shared function   │
                 │                              │
                 │  1. Copy files (manifest)     │
                 │  2. Generate routes.ts        │
                 │  3. Remove irrelevant content │
                 │  4. Patch Navbar & Footer     │
                 │  5. Customize package.json    │
                 │  6. Customize site.config.json│
                 └──────────────┬──────────────┘
                                │
                 ┌──────────────▼──────────────┐
                 │  Install dependencies        │
                 │  (skipped with --skip-install)│
                 └──────────────┬──────────────┘
                                │
                 ┌──────────────▼──────────────┐
                 │  Next steps / Done           │
                 └─────────────────────────────┘
```

### C. File Counts per Variant

| Variant | Files | Content included |
|---|---|---|
| `full` | ~258 | All blog (guides + samples) + all docs + all components |
| `blog` | ~146 | Blog infrastructure + essential guides only (no sample posts) |
| `docs` | ~147 | All docs + docs components only (no blog) |
| Generated | — | `app/routes.ts`, `public/content-index.json`, `public/content-slug-map.json`, `public/rss.xml`, `public/sitemap.xml` |
