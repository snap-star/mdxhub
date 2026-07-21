/**
 * create-mdxhub — File Manifest
 *
 * Defines which files belong to each template variant.
 * Each entry is a glob-like pattern relative to the project root.
 *
 * Categories:
 *   shared   → included in ALL variants
 *   blogOnly → included in "full" and "blog" variants
 *   docsOnly → included in "full" and "docs" variants
 */

export const MANIFEST = {
  // ─── Shared (all variants) ──────────────────────────────────────────
  shared: [
    // Root configs
    'package.json',
    'pnpm-workspace.yaml',
    'tsconfig.json',
    'tsconfig.app.json',
    'tsconfig.node.json',
    'vite.config.ts',
    'react-router.config.ts',
    'eslint.config.js',
    'site.config.json',
    'vercel.json',
    '.gitignore',
    'LICENSE',
    'README.md',


    // App entry
    'app/entry.client.tsx',
    'app/root.tsx',

    // Public assets
    'public/robots.txt',

    // Scripts
    'scripts/build.mjs',
    'scripts/helpers.cjs',
    'scripts/build-analyze.cjs',
    'scripts/generate-content-index.cjs',
    'scripts/generate-rss.cjs',
    'scripts/generate-sitemap.cjs',
    'scripts/generate-image-variants.cjs',
    'scripts/watch-content.cjs',

    // Config
    'src/config/env.ts',

    // Common components
    'src/components/common/EditOnGitHub.tsx',
    'src/components/common/ErrorBoundary.tsx',
    'src/components/common/Footer.tsx',
    'src/components/common/LoadingSkeleton.tsx',
    'src/components/common/Logo.tsx',
    'src/components/common/Navbar.tsx',
    'src/components/common/NotFound.tsx',
    'src/components/common/SEO.tsx',
    'src/components/common/SectionBackground.tsx',
    'src/components/common/ThemeToggle.tsx',
    'src/components/common/ViewportMount.tsx',
    'src/components/common/LanguageSwitcher.tsx',

    // MDX components (shared)
    'src/components/mdx/Accordion.tsx',
    'src/components/mdx/Badge.tsx',
    'src/components/mdx/Callout.tsx',
    'src/components/mdx/CardGrid.tsx',
    'src/components/mdx/Chart.tsx',
    'src/components/mdx/CodeBlock.tsx',
    'src/components/mdx/CodeGroup.tsx',
    'src/components/mdx/CodeSandbox.tsx',
    'src/components/mdx/DiffView.tsx',
    'src/components/mdx/FAQ.tsx',
    'src/components/mdx/FileTree.tsx',
    'src/components/mdx/ImageLightbox.tsx',
    'src/components/mdx/MDXComponents.tsx',
    'src/components/mdx/Mermaid.tsx',
    'src/components/mdx/OptimizedImage.tsx',
    'src/components/mdx/ProfileBadge.tsx',
    'src/components/mdx/Steps.tsx',
    'src/components/mdx/Tabs.tsx',
    'src/components/mdx/Timeline.tsx',
    'src/components/mdx/Tooltip.tsx',
    'src/components/mdx/VideoEmbed.tsx',

    // Search
    'src/components/search/SearchCommand.tsx',

    // Transitions
    'src/components/transitions/PageTransition.tsx',

    // Hooks
    'src/hooks/useActiveHeading.ts',
    'src/hooks/useBlogPosts.ts',
    'src/hooks/useContentHeadings.ts',
    'src/hooks/useTranslation.ts',

    // Lib
    'src/lib/analytics.ts',
    'src/lib/createStore.ts',
    'src/lib/errorTracking.ts',
    'src/lib/github.ts',
    'src/lib/icon-map.ts',
    'src/lib/lightboxStore.ts',
    'src/lib/react-utils.ts',
    'src/lib/remark-reading-time.ts',
    'src/lib/tocStore.ts',
    'src/lib/utils.ts',
    'src/lib/seo/jsonld.ts',
    'src/lib/content/authorLoader.ts',
    'src/lib/content/contentIndex.ts',
    'src/lib/content/types.ts',

    // Stores
    'src/store/blogPrefsStore.ts',
    'src/store/navigationStore.ts',
    'src/store/themeStore.ts',
    'src/store/translationStore.ts',
    'src/store/contentStore.ts',

    // Routes (shared)
    'src/routes/_index.tsx',
    'src/routes/about.tsx',
    'src/routes/search._index.tsx',

    // Styles
    'src/index.css',

    // Translations
    'src/translations/en.json',
    'src/translations/ja.json',
    'src/translations/id.json',

    // @ alias
    '@/lib/utils.ts',
  ],

  // ─── Blog: essential guide/component-usage content ─────────────────
  // Only included in the "blog" variant (not "full" — it's always there)
  blogContentEssential: [
    // Tutorials and guides about using the platform
    'content/blog/tutorial/**',
    'content/blog/guide/**',
    'content/blog/showcase/**',

    // Author & about content
    'content/authors/authors.yaml',
    'content/about.mdx',
  ],

  // ─── Blog: sample/demo content (only for "full" variant) ──────────
  // Sample educational posts, news, travel, etc. — not guides about the platform
  blogContentSample: [
    'content/blog/javascript/**',
  ],

  // ─── Blog: infrastructure (shared components/routes for both full + blog) ─
  blogInfrastructure: [
    // Blog components
    'src/components/blog/AuthorCard.tsx',
    'src/components/blog/BackToTop.tsx',
    'src/components/blog/Breadcrumbs.tsx',
    'src/components/blog/CCLicense.tsx',
    'src/components/blog/CategoryFilter.tsx',
    'src/components/blog/DisqusCommentCount.tsx',
    'src/components/blog/DisqusComments.tsx',
    'src/components/blog/MobileTocSheet.tsx',
    'src/components/blog/NewsletterSubscribe.tsx',
    'src/components/blog/PostCard.tsx',
    'src/components/blog/PostGrid.tsx',
    'src/components/blog/PostListView.tsx',
    'src/components/blog/PostPagination.tsx',
    'src/components/blog/ReadingTime.tsx',
    'src/components/blog/SeriesBadge.tsx',
    'src/components/blog/SeriesNav.tsx',
    'src/components/blog/ShareButtons.tsx',
    'src/components/blog/SidebarCategories.tsx',
    'src/components/blog/SidebarWidget.tsx',
    'src/components/blog/SponsorCard.tsx',
    'src/components/blog/TableOfContents.tsx',
    'src/components/blog/TagCloud.tsx',

    // Blog layout & routes
    'src/layouts/BlogLayout.tsx',
    'src/routes/blog._index.tsx',
    'src/routes/blog.category._index.tsx',
    'src/routes/blog.category.$name.tsx',
    'src/routes/blog.tags._index.tsx',
    'src/routes/blog.tag.$tag.tsx',
    'src/routes/blog.$slug.tsx',

    // Blog styles
    'src/styles/blog.css',
  ],

  // ─── Docs-specific (full + docs) ────────────────────────────────────
  docsOnly: [
    // Content
    'content/docs/**',

    // Docs components
    'src/components/docs/DocsSidebar.tsx',
    'src/components/docs/PrevNextNav.tsx',
    'src/components/docs/VersionBadge.tsx',

    // Docs layout & routes
    'src/layouts/DocsLayout.tsx',
    'src/routes/docs._index.tsx',
    'src/routes/docs.$section.$slug.tsx',

    // Docs styles
    'src/styles/docs.css',
  ],

  // ─── Generated files (not copied from source — created by the CLI) ─
  generated: [
    'app/routes.ts',
    'public/content-index.json',
    'public/content-slug-map.json',
    'public/rss.xml',
    'public/sitemap.xml',
  ],
}

// ─── All file patterns (for template assembly) ───────────────────────
export function getAllFilePatterns() {
  return [
    ...MANIFEST.shared,
    ...MANIFEST.blogInfrastructure,
    ...MANIFEST.blogContentEssential,
    ...MANIFEST.blogContentSample,
    ...MANIFEST.docsOnly,
  ]
}

/**
 * Resolve which files to include for a given variant.
 *
 * Logic:
 *   full → shared + blogInfrastructure + blogContentEssential + blogContentSample + docsOnly
 *   blog → shared + blogInfrastructure + blogContentEssential
 *   docs → shared + docsOnly
 */
export function resolveFiles(variant) {
  const files = [...MANIFEST.shared]

  if (variant === 'full') {
    files.push(...MANIFEST.blogInfrastructure)
    files.push(...MANIFEST.blogContentEssential)
    files.push(...MANIFEST.blogContentSample)
    files.push(...MANIFEST.docsOnly)
  } else if (variant === 'blog') {
    files.push(...MANIFEST.blogInfrastructure)
    files.push(...MANIFEST.blogContentEssential)
  } else if (variant === 'docs') {
    files.push(...MANIFEST.docsOnly)
  }

  return files
}

/**
 * Generate variant-aware `app/routes.ts` content.
 */
export function generateRoutesConfig(variant) {
  const blogRoutes =
    variant === 'full' || variant === 'blog'
      ? `
  {
    path: "blog",
    file: "../src/layouts/BlogLayout.tsx",
    children: [
      route("", "../src/routes/blog._index.tsx"),
      route("category", "../src/routes/blog.category._index.tsx"),
      route("category/:name", "../src/routes/blog.category.$name.tsx"),
      route("tags", "../src/routes/blog.tags._index.tsx"),
      route("tag/:tag", "../src/routes/blog.tag.$tag.tsx"),
      route(":slug/*", "../src/routes/blog.$slug.tsx"),
    ],
  },`
      : ''

  const docsRoutes =
    variant === 'full' || variant === 'docs'
      ? `
  {
    path: "docs",
    file: "../src/layouts/DocsLayout.tsx",
    children: [
      route("", "../src/routes/docs._index.tsx"),
      route("*", "../src/routes/docs.$section.$slug.tsx"),
    ],
  },`
      : ''

  return `import { route } from "@react-router/dev/routes"

export default [
  route("", "../src/routes/_index.tsx"),
  route("about", "../src/routes/about.tsx"),
  route("search", "../src/routes/search._index.tsx"),${blogRoutes}${docsRoutes}
]
`
}
