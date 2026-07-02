import React from 'react'
import { Link } from 'react-router'
import { motion, useInView } from 'framer-motion'
import { useContentStore } from '@/store/contentStore'
import { CardGrid, Card } from '@/components/mdx/CardGrid'
import { Badge } from '@/components/mdx/Badge'
import { Callout } from '@/components/mdx/Callout'
import { Accordion, AccordionItem } from '@/components/mdx/Accordion'
import { Tabs, Tab } from '@/components/mdx/Tabs'
import { PostCard } from '@/components/blog/PostCard'
import { SEO } from '@/components/common/SEO'
import {
  ArrowRight, BookOpen, FileText, Search, Star,
} from 'lucide-react'
import siteConfig from '../../site.config.json'
import type { PostIndexEntry } from '@/lib/content/contentIndex';

const config = siteConfig as unknown as { siteUrl: string; description: string; githubUrl: string }

// ─── Parallax hook (subtle scroll-driven translate) ────────────────────

function useParallax(speed = 0.15) {
  const [offset, setOffset] = React.useState(0)
  React.useEffect(() => {
    let raf: number
    const handler = () => {
      raf = requestAnimationFrame(() => {
        setOffset(window.scrollY * speed)
      })
    }
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => {
      window.removeEventListener('scroll', handler)
      cancelAnimationFrame(raf)
    }
  }, [speed])
  return offset
}

function ParallaxLayer({ speed = 0.15, children, className = '' }: { speed?: number; children: React.ReactNode; className?: string }) {
  const offset = useParallax(speed)
  return (
    <div
      className={className}
      style={{ transform: `translateY(${offset}px)` }}
    >
      {children}
    </div>
  )
}

// ─── Wrapper for scroll-reveal sections (bidirectional fade) ───────────

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, margin: '-60px 0px' })

  return (
    <motion.section
      ref={ref}
      animate={{
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : 24,
      }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

// ─── Decorative floating orbs ──────────────────────────────────────────

const ORB_GRADIENTS = [
  'oklch(0.65 0.18 260 / 0.15), oklch(0.55 0.12 270 / 0.05), transparent',
  'oklch(0.6 0.15 230 / 0.12), oklch(0.55 0.1 280 / 0.06), transparent',
  'oklch(0.7 0.15 80 / 0.1), oklch(0.65 0.12 10 / 0.04), transparent',
  'oklch(0.65 0.14 160 / 0.1), oklch(0.6 0.1 190 / 0.04), transparent',
]

function FloatingOrbs({ count = 3 }: { count?: number }) {
  const positions = [
    { top: '-15%', left: '-8%', width: '45%', height: '45%', delay: '0s', duration: '20s' },
    { top: '60%', right: '-5%', width: '30%', height: '30%', delay: '-5s', duration: '25s' },
    { bottom: '-10%', left: '20%', width: '35%', height: '35%', delay: '-10s', duration: '22s' },
    { top: '20%', right: '30%', width: '20%', height: '20%', delay: '-15s', duration: '18s' },
  ]

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {positions.slice(0, count).map((pos, i) => (
        <div
          key={i}
          className="absolute rounded-full will-change-transform"
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            bottom: pos.bottom,
            width: pos.width,
            height: pos.height,
            backgroundImage: `linear-gradient(to bottom right, ${ORB_GRADIENTS[i % ORB_GRADIENTS.length]})`,
            animation: `float-orb ${pos.duration} ease-in-out ${pos.delay} infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes float-orb {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-15px, 15px) scale(0.95); }
          100% { transform: translate(20px, -10px) scale(1.02); }
        }
      `}</style>
    </div>
  )
}

// ─── Section divider (bidirectional fade) ─────────────────────────────

function SectionDivider() {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, margin: '-30px 0px' })
  return (
    <motion.div
      ref={ref}
      animate={{ opacity: isInView ? 0.8 : 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="relative h-24 sm:h-32 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-400/5 to-transparent" />
    </motion.div>
  )
}

// ─── Stats counter hook ────────────────────────────────────────────────

function useAnimatedCounter(end: number, duration = 1500) {
  const [count, setCount] = React.useState(0)
  React.useEffect(() => {
    if (end === 0) return
    const startTime = performance.now()
    let raf: number
    const update = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress < 1) raf = requestAnimationFrame(update)
    }
    raf = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf)
  }, [end, duration])
  return count
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  const animatedValue = useAnimatedCounter(value)
  return (
    <div className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-card/50 border border-border/60 backdrop-blur-sm">
      <div className="text-primary/70">{icon}</div>
      <span className="text-3xl sm:text-4xl font-bold text-foreground tabular-nums">
        {animatedValue}
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  )
}

// ─── Tech stack badges ─────────────────────────────────────────────────

const TECH_STACK = [
  { name: 'React 19', color: 'blue' as const },
  { name: 'Vite 8', color: 'sky' as const },
  { name: 'MDX 3', color: 'emerald' as const },
  { name: 'TypeScript 6', color: 'violet' as const },
  { name: 'Tailwind CSS 4', color: 'orange' as const },
  { name: 'Framer Motion 12', color: 'pink' as const },
  { name: 'Zustand 5', color: 'amber' as const },
  { name: 'Shiki 4', color: 'indigo' as const },
]

// ─── Animated featured post card (encapsulates useInView hook) ─────────

function AnimatedCard({ post, index }: { post: PostIndexEntry; index: number }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, margin: '-40px 0px' })
  return (
    <motion.div
      ref={ref}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
    >
      <PostCard post={post} index={index} />
    </motion.div>
  )
}

// ─── Home Page ─────────────────────────────────────────────────────────

export default function HomePage() {
  const posts = useContentStore((s) => s.posts)
  const docs = useContentStore((s) => s.docs)
  const status = useContentStore((s) => s.status)

  const categories = React.useMemo(
    () => [...new Set(posts.map((p) => p.category))],
    [posts],
  )
  const tags = React.useMemo(
    () => [...new Set(posts.flatMap((p) => p.tags))],
    [posts],
  )

  const featuredPosts = React.useMemo(
    () => posts.filter((p) => p.featured).slice(0, 3),
    [posts],
  )
  const latestPosts = React.useMemo(
    () => posts.slice(0, 3),
    [posts],
  )

  const loaded = status === 'loaded'

  return (
    <div className="overflow-hidden">
      <SEO
        title="Home"
        description={config.description || 'A blazingly fast documentation and blog platform built with React, Vite, and MDX.'}
      />

      {/* ──────── HERO ──────── */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Decorative background blobs — parallax at different speeds for depth */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <ParallaxLayer speed={0.25} className="absolute inset-0">
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-brand-400/20 via-brand-500/10 to-transparent blur-3xl" />
          </ParallaxLayer>
          <ParallaxLayer speed={0.12} className="absolute inset-0">
            <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-blue-500/15 via-purple-500/10 to-transparent blur-3xl" />
          </ParallaxLayer>
          <ParallaxLayer speed={0.05} className="absolute inset-0">
            <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full bg-gradient-to-br from-amber-400/10 to-transparent blur-3xl" />
          </ParallaxLayer>
          {/* Grid pattern overlay — moves with page */}
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <ParallaxLayer speed={-0.03} className="relative z-10 w-full">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 text-center py-20">
          {/* Brand badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <Badge variant="indigo" icon="sparkles">MDXHub v1.5.0</Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
          >
            Write content in{' '}
            <span className="bg-gradient-to-r from-brand-400 via-brand-500 to-blue-500 bg-clip-text text-transparent">
              Markdown
            </span>
            ,<br />
            ship with React.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-[650px] mx-auto mb-10 leading-relaxed"
          >
            MDXHub is a blazingly fast blog and documentation platform.
            Write in Markdown, embed React components, and deploy anywhere.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              Explore Blog <ArrowRight size={18} />
            </Link>
            <Link
              to="/docs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-foreground font-semibold hover:bg-accent hover:border-brand-400/50 transition-all duration-200"
            >
              Read Docs <BookOpen size={18} />
            </Link>
            <a
              href={config.githubUrl || 'https://github.com/snap-star/mdxhub'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>Star on GitHub</span>
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-[700px] mx-auto"
          >
            <StatCard label="Posts" value={loaded ? posts.length : 0} icon={<FileText size={18} />} />
            <StatCard label="Docs" value={loaded ? docs.length : 0} icon={<BookOpen size={18} />} />
            <StatCard label="Categories" value={loaded ? categories.length : 0} icon={<Search size={18} />} />
            <StatCard label="Tags" value={loaded ? tags.length : 0} icon={<Star size={18} />} />
          </motion.div>
        </div>
        </ParallaxLayer>
      </section>

      {/* Subtle section divider */}
      <SectionDivider />

      {/* ──────── TECH STACK ──────── */}
      <Section className="py-20 sm:py-28 relative overflow-hidden">
        <FloatingOrbs count={2} />
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-muted-foreground mb-4">
            Built With
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {TECH_STACK.map(({ name, color }) => (
              <Badge key={name} variant={color}>{name}</Badge>
            ))}
          </div>
        </div>
      </Section>

      {/* ──────── FEATURES ──────── */}
      <Section className="py-20 sm:py-28 bg-gradient-to-b from-transparent via-brand-50/30 dark:via-[oklch(22%_0.04_245/0.3)] to-transparent">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <Badge variant="info" icon="zap">Features</Badge>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-6 mb-4 tracking-tight">
              Everything you need to ship content
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-[600px] mx-auto">
              MDXHub combines the simplicity of Markdown with the power of React — no compromises.
            </p>
          </div>

          <div>
            <CardGrid columns={3}>
              <Card
                title="Lightning Fast"
                description="Built on Vite 8 with instant HMR, sub-second page loads, and automatic code splitting. Your dev experience will never be the same."
                icon="zap"
              />
              <Card
                title="MDX-Powered"
                description="Write content in Markdown with embedded React components. No build step, no config — just drop in interactive content."
                icon="file"
              />
              <Card
                title="Type-Safe"
                description="Full TypeScript 6 support with strict type checking. Catch errors at compile time, not runtime. Ship with confidence."
                icon="shield"
              />
              <Card
                title="Interactive Components"
                description="Live code sandboxes, diagrams, tabs, accordions, tooltips — all available in your Markdown. Your readers can edit and run code."
                icon="sparkles"
              />
              <Card
                title="SEO Optimized"
                description="JSON-LD structured data, Open Graph tags, auto-generated sitemap, RSS feed, and canonical URLs — search engines will love your content."
                icon="search"
              />
              <Card
                title="Open Source"
                description="MIT licensed. Self-host on Vercel, Netlify, or any static host. Full control over your content and data — no vendor lock-in."
                icon="heart"
              />
            </CardGrid>
          </div>
        </div>
      </Section>

      {/* Subtle section divider */}
      <SectionDivider />

      {/* ──────── COMPONENT SHOWCASE ──────── */}
      <Section className="py-20 sm:py-28 relative overflow-hidden">
        <FloatingOrbs count={3} />
        <div className="relative z-10 max-w-[900px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <Badge variant="success" icon="sparkles">Live Component Demo</Badge>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-6 mb-4 tracking-tight">
              See our MDX components in action
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-[600px] mx-auto">
              Every component below is available globally in any `.mdx` file — no imports needed.
            </p>
          </div>

          {/* Callout demo */}
          <div className="mb-12">
            <Callout type="info" title="What is MDXHub?">
              MDXHub is an open-source blog and documentation platform that lets you write content in Markdown
              and use React components inline. It's built with <strong>React 19</strong>, <strong>Vite 8</strong>,
              and <strong>Tailwind CSS 4</strong>, and features interactive components like live code sandboxes,
              diagrams, tabs, and accordions — all usable directly in your Markdown files.
            </Callout>
          </div>

          {/* Badge wall */}
          <div className="mb-12 p-6 rounded-xl border border-border bg-card">
            <h3 className="text-sm font-semibold text-foreground mb-4">40+ Icon Options</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="success" icon="check">Check</Badge>
              <Badge variant="info" icon="info">Info</Badge>
              <Badge variant="warning" icon="warning">Warning</Badge>
              <Badge variant="danger" icon="danger">Danger</Badge>
              <Badge variant="purple" icon="star">Star</Badge>
              <Badge variant="rose" icon="heart">Heart</Badge>
              <Badge variant="amber" icon="bulb">Idea</Badge>
              <Badge variant="emerald" icon="rocket">Rocket</Badge>
              <Badge variant="indigo" icon="sparkles">New</Badge>
              <Badge variant="blue" icon="target">Goal</Badge>
              <Badge variant="orange" icon="flag">Flag</Badge>
              <Badge variant="sky" icon="cloud">Cloud</Badge>
            </div>
          </div>

          {/* Tabs demo */}
          <div className="mb-12">
            <h3 className="text-sm font-semibold text-foreground mb-4">Tabbed Content</h3>
            <Tabs>
              <Tab label="Markdown" icon="file">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Write content using standard Markdown syntax. Everything you know and love — headings,
                    lists, code blocks, tables — works out of the box.
                  </p>
                </div>
              </Tab>
              <Tab label="Components" icon="sparkles">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Drop in React components anywhere in your Markdown. Badges, tooltips, tabs, accordions,
                    live code sandboxes — all available globally.
                  </p>
                </div>
              </Tab>
              <Tab label="Deploy" icon="rocket">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Build with <code>pnpm build</code> and deploy the output to Vercel, Netlify, Cloudflare
                    Pages, or any static hosting provider.
                  </p>
                </div>
              </Tab>
            </Tabs>
          </div>

          {/* Accordion FAQ */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-foreground mb-4">FAQ</h3>
            <Accordion>
              <AccordionItem title="Is MDXHub ready for production?">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Yes. MDXHub is built with production-grade tools (React 19, Vite 8, TypeScript 6) and
                    includes SEO, RSS, sitemaps, image optimization, and Disqus comments. It's deployed
                    on Vercel and serves content to real users.
                  </p>
                </div>
              </AccordionItem>
              <AccordionItem title="Can I add my own MDX components?">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Absolutely. Create a component in <code>src/components/mdx/</code>, register it in
                    <code> MDXComponents.tsx</code>, and it's available globally in all .mdx files — no imports needed.
                  </p>
                </div>
              </AccordionItem>
              <AccordionItem title="Do I need a database?">
                <div>
                  <p className="text-sm text-muted-foreground">
                    No. All content is stored as MDX files in the <code>content/</code> directory. A content
                    index is generated at build time for fast client-side searching. No database, no backend,
                    no API keys required.
                  </p>
                </div>
              </AccordionItem>
              <AccordionItem title="Can I host it myself?">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Yes. MDXHub generates a static <code>dist/</code> folder that can be deployed anywhere —
                    Vercel, Netlify, Cloudflare Pages, GitHub Pages, AWS S3, or any static file server.
                  </p>
                </div>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </Section>

      {/* ──────── LATEST POSTS ──────── */}
      {loaded && (featuredPosts.length > 0 || latestPosts.length > 0) && (
        <Section className="py-20 sm:py-28 bg-gradient-to-b from-transparent via-brand-50/30 dark:via-[oklch(22%_0.04_245/0.3)] to-transparent">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <Badge variant="violet" icon="sparkles">Latest Content</Badge>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-6 mb-4 tracking-tight">
                Recent posts
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg">
                Stay up to date with the latest articles, tutorials, and guides.
              </p>
            </div>

            {/* Featured posts */}
            {featuredPosts.length > 0 && (
              <div className="mb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredPosts.map((post, i) => (
                    <AnimatedCard key={post.slug} post={post} index={i} />
                  ))}
                </div>
              </div>
            )}

            <div className="text-center mt-10">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-foreground font-medium hover:bg-accent hover:border-brand-400/50 transition-all duration-200"
              >
                View All Posts <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </Section>
      )}

      {/* ──────── FINAL CTA ──────── */}
      <Section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-[-30%] left-[-20%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-brand-400/15 via-brand-500/5 to-transparent blur-3xl" />
        </div>
        <div className="relative z-10 max-w-[700px] mx-auto px-4 sm:px-6 text-center">
          <Badge variant="indigo" icon="rocket">Get Started</Badge>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-6 mb-4 tracking-tight">
            Ready to ship your content?
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg mb-10 max-w-[500px] mx-auto">
            Start writing in Markdown, embed React components, and deploy anywhere. No database required.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/docs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              Read the Docs <BookOpen size={18} />
            </Link>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-foreground font-medium hover:bg-accent hover:border-brand-400/50 transition-all duration-200"
            >
              Browse Blog <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </Section>
    </div>
  )
}
