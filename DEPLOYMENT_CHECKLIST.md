# Pre-Deployment Checklist

## Code Quality

- [X] All tests passing (`pnpm test`)
- [ ] TypeScript checks pass (`pnpm exec tsc -b`)
- [ ] Linting passes (`pnpm lint`)
- [X] Build succeeds (`pnpm build`)

## Content

- [ ] No broken internal links
- [ ] All required frontmatter fields present
- [ ] `pnpm build` generates fresh content index

## Environment

- [ ] `.env.local` configured for production
- [ ] Analytics ID set (if used)
- [ ] Error tracking endpoint set (if used)
- [ ] Disqus shortname set (if used)

## Performance

- [ ] Lighthouse score > 90
- [ ] Bundle analyzed (`pnpm build:analyze`)
- [ ] No oversized chunks

## Security

- [ ] No exposed secrets in code
- [ ] Dependencies up to date (`pnpm audit`)
- [ ] CSP headers reviewed in `vercel.json`
- [ ] HSTS enabled (already configured)
