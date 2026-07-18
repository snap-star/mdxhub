# Pre-Deployment Checklist

## Code Quality

- [X] All tests passing (`pnpm test`)
- [X] TypeScript checks pass (`pnpm exec tsc -b`)
- [X] Linting passes (`pnpm lint`)
- [X] Build succeeds (`pnpm build`)

## Content

- [X] No broken internal links
- [X] All required frontmatter fields present
- [X] `pnpm build` generates fresh content index

## Environment

- [X] `.env.local` configured for production
- [ ] Analytics ID set (if used)
- [ ] Error tracking endpoint set (if used)
- [X] Disqus shortname set (if used)

## Performance

- [ ] Lighthouse score > 90
- [X] Bundle analyzed (`pnpm build:analyze`)
- [X] No oversized chunks

## Security

- [X] No exposed secrets in code
- [X] Dependencies up to date (`pnpm audit`)
- [X] CSP headers reviewed in `vercel.json`
- [X] HSTS enabled (already configured)
