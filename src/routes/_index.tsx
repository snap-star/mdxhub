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
import { version as pkgVersion } from '../../package.json'
import type { PostIndexEntry } from '@/lib/content/contentIndex';
import { SectionBackground } from '@/components/common/SectionBackground'

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
        y: isInView ? 0 : 20,
      }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

// ─── Decorative floating orbs (enhanced) ───────────────────────────────

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
        <motion.div
          key={i}
          className="absolute rounded-full will-change-transform"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: i * 0.15, ease: [0.4, 0, 0.2, 1] }}
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
          0% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
          33% { transform: translate(35px, -20px) scale(1.04) rotate(4deg); }
          66% { transform: translate(-15px, 18px) scale(0.96) rotate(-2deg); }
          100% { transform: translate(25px, -10px) scale(1.02) rotate(2deg); }
        }
      `}</style>
    </div>
  )
}

// ─── Floating code symbols for hero ────────────────────────────────────

const CODE_SYMBOLS = ['{ }', '</>', '#', '//', '=>', '...', '()', '[]']

function FloatingSymbols() {
  const positions = [
    { top: '12%', left: '8%', delay: 0 },
    { top: '20%', right: '12%', delay: 1 },
    { bottom: '25%', left: '15%', delay: 2 },
    { top: '55%', right: '8%', delay: 0.5 },
    { bottom: '15%', right: '20%', delay: 1.5 },
    { top: '40%', left: '5%', delay: 2.5 },
    { top: '70%', left: '25%', delay: 3 },
    { bottom: '40%', right: '5%', delay: 0.8 },
  ]

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {positions.slice(0, 6).map((pos, i) => (
        <motion.span
          key={i}
          className="absolute font-mono text-xs sm:text-sm font-bold select-none"
          style={{
            top: pos.top,
            left: pos.left,
            right: (pos as { right?: string }).right,
            bottom: (pos as { bottom?: string }).bottom,
            color: `oklch(0.7 0.12 ${240 + i * 15} / 0.15)`,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: [0, 0.15, 0.1, 0.2, 0.08],
            y: [0, -8, 4, -4, 0],
          }}
          transition={{
            duration: 10,
            delay: pos.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {CODE_SYMBOLS[i % CODE_SYMBOLS.length]}
        </motion.span>
      ))}
    </div>
  )
}

// ─── Scroll indicator ──────────────────────────────────────────────────

function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.35 }}
    >
      <span className="text-[0.55rem] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
        Scroll
      </span>
      <motion.div
        className="w-4 h-6 rounded-full border border-muted-foreground/20 flex items-start justify-center pt-1"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          className="w-1 h-1.5 rounded-full bg-brand-500"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
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
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
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
    <div className="group flex flex-col items-center gap-2 p-6 rounded-2xl bg-card/50 border border-border/60 backdrop-blur-sm hover:bg-card/80 hover:border-brand-400/30 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-300">
      <div className="text-primary/70 group-hover:text-primary group-hover:scale-110 transition-all duration-300">{icon}</div>
      <span className="text-3xl sm:text-4xl font-bold text-foreground tabular-nums">
        {animatedValue}
      </span>
      <span className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">{label}</span>
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
      transition={{ duration: 0.35, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
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
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }          .animate-gradient {
          animation: gradient 5s ease infinite;
        }
      `}</style>
      <SEO
        title="Home"
        description={config.description || 'A blazingly fast documentation and blog platform built with React, Vite, and MDX.'}
      />

      {/* ──────── HERO ──────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated gradient mesh background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <ParallaxLayer speed={0.25} className="absolute inset-0">
            <motion.div
              className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-3xl"
              style={{ background: 'oklch(0.65 0.18 260 / 0.15), oklch(0.55 0.12 270 / 0.05)' }}
              animate={{
                x: [0, 40, -20, 30, 0],
                y: [0, -30, 20, -10, 0],
              }}
              transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
            />
          </ParallaxLayer>
          <ParallaxLayer speed={0.12} className="absolute inset-0">
            <motion.div
              className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full blur-3xl"
              style={{ background: 'oklch(0.6 0.15 230 / 0.12), oklch(0.55 0.1 280 / 0.06)' }}
              animate={{
                x: [0, -25, 15, -30, 0],
                y: [0, 15, -25, 8, 0],
              }}
              transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut' }}
            />
          </ParallaxLayer>
          <ParallaxLayer speed={0.05} className="absolute inset-0">
            <motion.div
              className="absolute top-[35%] right-[20%] w-[35%] h-[35%] rounded-full blur-3xl"
              style={{ background: 'oklch(0.7 0.15 80 / 0.1), oklch(0.65 0.12 10 / 0.04)' }}
              animate={{
                x: [0, 15, -8, 20, 0],
                y: [0, -12, 20, -5, 0],
              }}
              transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
            />
          </ParallaxLayer>
          {/* Dot grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />
          {/* Floating code symbols */}
          <FloatingSymbols />
        </div>

        <ParallaxLayer speed={-0.03} className="relative z-10 w-full">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 text-center py-20">
          {/* Version badge with enhanced styling */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 dark:bg-brand-500/15 border border-brand-500/20 dark:border-brand-500/25 text-brand-700 dark:text-brand-300 text-sm font-medium shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="absolute inset-0 rounded-full bg-brand-500 animate-ping opacity-30" />
                <span className="relative rounded-full bg-brand-500 h-2 w-2" />
              </span>
              {siteConfig.title} v{pkgVersion}
            </span>
          </motion.div>

          {/* Headline — enhanced gradient animation */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12, ease: [0.4, 0, 0.2, 1] }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-6"
          >
            Write content in{' '}
            <span className="bg-gradient-to-r from-brand-400 via-brand-500 via-purple-500 to-blue-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Markdown
            </span>
            ,<br />
            <span className="relative">
              ship with React.
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-brand-400/40 via-brand-500/40 to-blue-500/40"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.55, duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.18, ease: [0.4, 0, 0.2, 1] }}
            className="text-lg sm:text-xl text-muted-foreground max-w-[650px] mx-auto mb-10 leading-relaxed"
          >
            MDXHub is a blazingly fast blog and documentation platform.
            Write in Markdown, embed React components, and deploy anywhere.
          </motion.p>

          {/* CTA buttons — enhanced with glow effects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.26, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/blog"
              className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Blog <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <motion.span
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary via-brand-600 to-primary"
                initial={{ x: '-100%' }}
                whileHover={{ x: '0%' }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              />
            </Link>
            <Link
              to="/docs"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border-2 border-border bg-card text-foreground font-semibold hover:bg-accent hover:border-brand-400/60 hover:shadow-lg hover:shadow-brand-500/10 transition-all duration-300"
            >
              Read Docs <BookOpen size={18} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <a
              href={config.githubUrl || 'https://github.com/snap-star/mdxhub'}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl text-muted-foreground hover:text-foreground transition-all duration-300 hover:bg-card/50"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>Star</span>
            </a>
          </motion.div>

          {/* Stats row — staggered entrance */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.06, delayChildren: 0.38 },
              },
            }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-[700px] mx-auto"
          >
            {[
              { label: 'Posts', value: loaded ? posts.length : 0, icon: <FileText size={18} /> },
              { label: 'Docs', value: loaded ? docs.length : 0, icon: <BookOpen size={18} /> },
              { label: 'Categories', value: loaded ? categories.length : 0, icon: <Search size={18} /> },
              { label: 'Tags', value: loaded ? tags.length : 0, icon: <Star size={18} /> },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <StatCard label={stat.label} value={stat.value} icon={stat.icon} />
              </motion.div>
            ))}
          </motion.div>
        </div>
        </ParallaxLayer>

        {/* Scroll indicator */}
        <ScrollIndicator />
      </section>

      {/* Subtle section divider */}
      <SectionDivider />

      {/* ──────── TECH STACK ──────── */}
      <Section className="py-20 sm:py-28 relative overflow-hidden">
        <SectionBackground variant="tech" />
        <FloatingOrbs count={2} />
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="text-sm font-bold uppercase tracking-[0.15em] text-muted-foreground mb-6"
          >
            Built With
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.04 },
              },
            }}
            className="flex flex-wrap justify-center gap-3"
          >
            {TECH_STACK.map(({ name, color }) => (
              <motion.div
                key={name}
                variants={{
                  hidden: { opacity: 0, y: 12, scale: 0.9 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <Badge variant={color}>{name}</Badge>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ──────── FEATURES ──────── */}
      <Section className="py-20 sm:py-28 relative overflow-hidden">
        <SectionBackground variant="features" />
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            <Badge variant="info" icon="zap">Features</Badge>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.08, ease: [0.4, 0, 0.2, 1] }}
              className="font-serif text-3xl sm:text-4xl font-bold mt-6 mb-4 tracking-tight"
            >
              Everything you need to ship content
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.14 }}
              className="text-muted-foreground text-base sm:text-lg max-w-[600px] mx-auto"
            >
              MDXHub combines the simplicity of Markdown with the power of React — no compromises.
            </motion.p>
            {/* Decorative divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="h-px max-w-[200px] mx-auto mt-8 bg-gradient-to-r from-transparent via-brand-400/50 to-transparent"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: 0.12 }}
          >
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
          </motion.div>
        </div>
      </Section>

      {/* Subtle section divider */}
      <SectionDivider />

      {/* ──────── COMPONENT SHOWCASE ──────── */}
      <Section className="py-20 sm:py-28 relative overflow-hidden">
        <SectionBackground variant="showcase" />
        <FloatingOrbs count={3} />
        <div className="relative z-10 max-w-[900px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <Badge variant="success" icon="sparkles">Live Component Demo</Badge>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.08, ease: [0.4, 0, 0.2, 1] }}
              className="font-serif text-3xl sm:text-4xl font-bold mt-6 mb-4 tracking-tight"
            >
              See our MDX components in action
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.14 }}
              className="text-muted-foreground text-base sm:text-lg max-w-[600px] mx-auto"
            >
              Every component below is available globally in any <code className="text-sm bg-muted px-1.5 py-0.5 rounded">.mdx</code> file — no imports needed.
            </motion.p>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="h-px max-w-[200px] mx-auto mt-8 bg-gradient-to-r from-transparent via-brand-400/50 to-transparent"
            />
          </div>

          {/* Callout demo */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="mb-12"
          >
            <Callout type="info" title="What is MDXHub?">
              MDXHub is an open-source blog and documentation platform that lets you write content in Markdown
              and use React components inline. It's built with <strong>React 19</strong>, <strong>Vite 8</strong>,
              and <strong>Tailwind CSS 4</strong>, and features interactive components like live code sandboxes,
              diagrams, tabs, and accordions — all usable directly in your Markdown files.
            </Callout>
          </motion.div>

          {/* Badge wall */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.35, delay: 0.12 }}
            className="mb-12 p-6 rounded-xl border border-border bg-card hover:shadow-md hover:border-brand-400/30 transition-all duration-300"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-brand-500" />
              40+ Icon Options
            </h3>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.03 },
                },
              }}
              className="flex flex-wrap gap-2"
            >
              {[
                { variant: 'success' as const, icon: 'check' as const, label: 'Check' },
                { variant: 'info' as const, icon: 'info' as const, label: 'Info' },
                { variant: 'warning' as const, icon: 'warning' as const, label: 'Warning' },
                { variant: 'danger' as const, icon: 'danger' as const, label: 'Danger' },
                { variant: 'purple' as const, icon: 'star' as const, label: 'Star' },
                { variant: 'rose' as const, icon: 'heart' as const, label: 'Heart' },
                { variant: 'amber' as const, icon: 'bulb' as const, label: 'Idea' },
                { variant: 'emerald' as const, icon: 'rocket' as const, label: 'Rocket' },
                { variant: 'indigo' as const, icon: 'sparkles' as const, label: 'New' },
                { variant: 'blue' as const, icon: 'target' as const, label: 'Goal' },
                { variant: 'orange' as const, icon: 'flag' as const, label: 'Flag' },
                { variant: 'sky' as const, icon: 'cloud' as const, label: 'Cloud' },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  variants={{
                    hidden: { opacity: 0, y: 8, scale: 0.95 },
                    visible: { opacity: 1, y: 0, scale: 1 },
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge variant={item.variant} icon={item.icon}>{item.label}</Badge>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Tabs demo */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.35, delay: 0.16 }}
            className="mb-12 p-6 rounded-xl border border-border bg-card hover:shadow-md hover:border-brand-400/30 transition-all duration-300"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-brand-500" />
              Tabbed Content
            </h3>
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
          </motion.div>

          {/* Accordion FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="mb-8"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-brand-500" />
              FAQ
            </h3>
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
          </motion.div>
        </div>
      </Section>

      {/* ──────── LATEST POSTS ──────── */}
      {loaded && (featuredPosts.length > 0 || latestPosts.length > 0) && (
        <Section className="py-20 sm:py-28 relative overflow-hidden">
        <SectionBackground variant="posts" />
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}              transition={{ duration: 0.3 }}
          >
            <Badge variant="violet" icon="sparkles">Latest Content</Badge>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.08, ease: [0.4, 0, 0.2, 1] }}
                className="font-serif text-3xl sm:text-4xl font-bold mt-6 mb-4 tracking-tight"
              >
                Recent posts
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.14 }}
                className="text-muted-foreground text-base sm:text-lg"
              >
                Stay up to date with the latest articles, tutorials, and guides.
              </motion.p>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.22, ease: [0.4, 0, 0.2, 1] }}
                className="h-px max-w-[200px] mx-auto mt-8 bg-gradient-to-r from-transparent via-brand-400/50 to-transparent"
              />
            </div>

            {/* Featured posts */}
            {featuredPosts.length > 0 && (
              <div className="mb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 rounded-xl">
                  {featuredPosts.map((post, _i) => (
                    <AnimatedCard key={post.slug} post={post} index={_i} />
                  ))}
                </div>
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.18 }}
              className="text-center mt-10"
            >
              <Link
                to="/blog"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-border bg-card text-foreground font-medium hover:bg-accent hover:border-brand-400/50 hover:shadow-lg hover:shadow-brand-500/10 transition-all duration-300"
              >
                View All Posts <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </Section>
      )}

      {/* ──────── FINAL CTA ──────── */}
      <Section className="py-24 sm:py-32 relative overflow-hidden">
        <SectionBackground variant="cta" />
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>
        <div className="relative z-10 max-w-[700px] mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            <Badge variant="indigo" icon="rocket">Get Started</Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.08, ease: [0.4, 0, 0.2, 1] }}
            className="font-serif text-3xl sm:text-4xl font-bold mt-6 mb-4 tracking-tight"
          >
            Ready to ship your content?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.14 }}
            className="text-muted-foreground text-base sm:text-lg mb-10 max-w-[500px] mx-auto"
          >
            Start writing in Markdown, embed React components, and deploy anywhere. No database required.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.18 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/docs"
              className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Read the Docs <BookOpen size={18} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
              <motion.span
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary via-brand-600 to-primary"
                initial={{ x: '-100%' }}
                whileHover={{ x: '0%' }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              />
            </Link>
            <Link
              to="/blog"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border-2 border-border bg-card text-foreground font-medium hover:bg-accent hover:border-brand-400/60 hover:shadow-lg hover:shadow-brand-500/10 transition-all duration-300"
            >
              Browse Blog <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </Section>
    </div>
  )
}
