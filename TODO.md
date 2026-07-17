

Todo · MD
MDXHub — Upgrade Roadmap

Prioritas 1: Migrasi SSG
- Evaluasi vite-react-ssg vs React Router v8 Framework Mode (ssr: false + prerender)
 Pindahkan fetch content-index.json di client → jadi data loader saat build (per-route static props)

- Generate static path untuk semua slug blog & docs dari content-index.json
 Pastikan react-helmet-async SEO tags ke-render ke HTML statis (bukan cuma di client)

- Test hydration mismatch di semua komponen interaktif (Tabs, Accordion, ThemeToggle)

- Update vercel.json — hapus SPA fallback rewrite kalau routing sudah full static

Prioritas 2: Performance
- Partial hydration: React.lazy() untuk Sandpack, Mermaid, KaTeX — load saat masuk viewport (IntersectionObserver)

- Audit bundle dengan rollup-plugin-visualizer — cek ukuran tiap vendor chunk

- Tambah srcset responsive + width/height eksplisit di semua gambar (hindari CLS)
 Font subsetting kalau pakai custom font (hapus glyph tak terpakai)

- Prefetch route dengan <Link prefetch="intent"> di React Router v8
 Pertimbangkan ganti Fuse.js → Pagefind (build-time index, lebih ringan untuk dataset besar)

- Ukur Lighthouse/PageSpeed sebelum & sesudah SSG untuk baseline

Prioritas 3: Security
- Security headers dasar (CSP, X-Frame-Options, HSTS, dll) — sudah di vercel.json

- Test CSP di securityheaders.com, fix violation dari Disqus/Sandpack/YouTube embed

- `pnpm audit` rutin + aktifkan Dependabot/Renovate
- Review kebijakan kontribusi MDX dari luar (MDX = JSX arbitrary, wajib manual review sebelum merge PR)
- Pastikan iframe Sandpack & Disqus punya sandbox attribute yang ketat
- Tambah Subresource Integrity (SRI) kalau ada script CDN eksternal

Prioritas 4: Fitur & DX
- Draft preview mode (lihat post draft: true tanpa publish ke prod)
- Related posts / "baca juga" berdasarkan tag/category overlap
- Reading progress bar di post (selain TOC scroll-spy yang sudah ada)
- View transition animation antar blog card → detail (native @view-transition API sudah didukung, tinggal diaktifkan di lebih banyak tempat)
- i18n dasar kalau nanti butuh multi-bahasa (opsional, lihat cara Fuwari handle README multi-bahasa sebagai referensi)
- Webmention / like counter (opsional, kalau mau lebih "social")

Prioritas 5: Testing & CI
- Unit test untuk generate-content-index.cjs (frontmatter parsing edge case)
- E2E smoke test (Playwright) untuk route utama: /, /blog, /blog/:slug, /docs, /search
- CI check: build gagal kalau ada broken internal link di MDX
- Visual regression test untuk komponen MDX kunci (Callout, Timeline, CardGrid)

Prioritas 6: Observability
- Error boundary reporting (Sentry atau sejenis) — supaya tahu kalau ada MDX yang gagal render di prod
- Web Vitals tracking (CLS, LCP, INP) setelah migrasi SSG untuk validasi improvement
- Analytics privacy-friendly (Plausible/Umami) sebagai alternatif kalau belum pakai apa pun

Catatan: SSG migration dulu (fondasi), baru performance tuning di atasnya, security headers bisa paralel karena independen, fitur baru & testing terakhir setelah arsitektur stabil.


