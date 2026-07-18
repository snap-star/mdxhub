# Phase 1 ✅ — Dead Code Removed
- [x] `package.json:isbot` (zero imports)
- [x] `utils.ts:6-8 cn()` (never called → also removed `clsx` + `tailwind-merge` deps)
- [x] `utils.ts:99-105 timeAgo()` (dead export)
- [x] `utils.ts:167-177 groupBy()` (dead export)
- [x] `utils.ts:19-25 pathToSlug()` (dead in src/)
- [x] `contentStore.ts:189-199` 4 selector exports (`useAllPosts`, `useFeaturedPosts`, `useAllDocs`, `useContentStatus`)
- [ ] `useBlogPosts.ts:17,42,83 sortMode` — stored/returned but sort logic only uses `sortOrder`; kept — used by `CategoryFilter.tsx` for UI tab display

# Phase 2 ✅ — Stdlib + Native Platform Replaces Dep
- [x] `utils.ts:59-73 date-fns` → `toLocaleDateString('en-US', {...})`
- [x] `contentStore.ts:99-110 fuse.js` → `.filter(s => ...)` for ~50 items
- [x] `react-helmet-async` → React 19 native `<title>`/`<meta>` auto-hoisting (removed dep)
- [x] Tooltip `@base-ui/react` → pure CSS tooltip (no dep)
- 5 deps removed: `date-fns`, `fuse.js`, `@base-ui/react`, `react-helmet-async`, `isbot`

# Phase 3 — Over-engineering (partial)
- [x] `NotFound.tsx:1-238` → ~70-line static error page (no framer-motion, no GitHub issue reporter)
- [x] `ErrorBoundary.tsx:1-188` → ~40-line class component (no framer-motion, no GitHub issue reporter)
- [x] `SectionBackground.tsx:1-76` → CSS gradient backgrounds (no framer-motion blobs)
- [x] `root.tsx:92-98` — removed AnimatePresence + PageTransition (CSS `@view-transition` already configured, was redundant)
- [ ] `scripts/build.mjs:1-40` — thin orchestrator → `&&` in package.json scripts
- [x] ~~`themeStore.ts:1-73` — kept, Zustand already installed, no savings~~

# Phase 4 ✅ — Duplication
- [x] `walk()` + `escapeXml()` extracted to `scripts/helpers.cjs` (reused by 3 scripts)
- [ ] ~~`parseFrontmatter()` — unique implementations (hand-rolled vs js-yaml), not worth extracting~~
- [ ] ~~`computeReadingTime()` — different module systems (TS vs CJS), tolerable duplication~~