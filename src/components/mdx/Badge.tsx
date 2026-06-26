import React from 'react'
import {
  Check, Copy, Info, AlertTriangle, XCircle,
  Star, Heart, Zap, Shield, Clock, Calendar,
  BookOpen, FileText, Tag, Hash, Mail, Link2,
  Sun, Moon, Cloud, Download, Upload, RefreshCw,
  Plus, Minus, X, Search, Settings, User,
  Home, ArrowRight, ExternalLink, Globe,
  Lightbulb, Rocket, Sparkles, Target, Flag,
  type LucideIcon,
} from 'lucide-react'
import { SiGithub } from '@icons-pack/react-simple-icons'

interface BadgeProps {
  /** Variant: Tailwind color name or admonition name (note, tip, info, success, warning, danger, destructive) */
  variant?: string
  /** Icon name (string key into lucide-react icons) — no imports needed in MDX */
  icon?: string
  children?: React.ReactNode
  className?: string
}

// ─── Icon name → lucide component map ──────────────────────────────────────
const ICON_MAP: Record<string, LucideIcon> = {
  check: Check,
  copy: Copy,
  info: Info,
  warning: AlertTriangle,
  danger: XCircle,
  star: Star,
  heart: Heart,
  zap: Zap,
  shield: Shield,
  clock: Clock,
  calendar: Calendar,
  book: BookOpen,
  file: FileText,
  tag: Tag,
  hash: Hash,
  mail: Mail,
  link: Link2,
  sun: Sun,
  moon: Moon,
  cloud: Cloud,
  download: Download,
  upload: Upload,
  refresh: RefreshCw,
  plus: Plus,
  minus: Minus,
  close: X,
  search: Search,
  settings: Settings,
  user: User,
  home: Home,
  arrow: ArrowRight,
  external: ExternalLink,
  github: SiGithub,
  globe: Globe,
  bulb: Lightbulb,
  rocket: Rocket,
  sparkles: Sparkles,
  target: Target,
  flag: Flag,
}

// ─── Static color styles (fully spelled out for Tailwind JIT detection) ────
const COLOR_STYLES: Record<string, string> = {
  // Neutral tones
  slate: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-700',
  gray: 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-700',
  zinc: 'bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-900/30 dark:text-zinc-300 dark:border-zinc-700',
  neutral: 'bg-neutral-100 text-neutral-700 border-neutral-300 dark:bg-neutral-900/30 dark:text-neutral-300 dark:border-neutral-700',
  stone: 'bg-stone-100 text-stone-700 border-stone-300 dark:bg-stone-900/30 dark:text-stone-300 dark:border-stone-700',

  // Warm tones
  red: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',
  orange: 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700',
  amber: 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700',
  yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700',

  // Green tones
  lime: 'bg-lime-100 text-lime-700 border-lime-300 dark:bg-lime-900/30 dark:text-lime-300 dark:border-lime-700',
  green: 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700',
  teal: 'bg-teal-100 text-teal-700 border-teal-300 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700',

  // Blue / cool tones
  cyan: 'bg-cyan-100 text-cyan-700 border-cyan-300 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-700',
  sky: 'bg-sky-100 text-sky-700 border-sky-300 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-700',
  blue: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
  indigo: 'bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700',
  violet: 'bg-violet-100 text-violet-700 border-violet-300 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-700',
  purple: 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
  fuchsia: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300 dark:bg-fuchsia-900/30 dark:text-fuchsia-300 dark:border-fuchsia-700',
  pink: 'bg-pink-100 text-pink-700 border-pink-300 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700',
  rose: 'bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-700',
}

// ─── Semantic variant → color mapping ──────────────────────────────────────
const SEMANTIC_MAP: Record<string, string> = {
  note: 'slate',
  tip: 'emerald',
  info: 'blue',
  success: 'green',
  warning: 'amber',
  danger: 'red',
  destructive: 'red',
}

const FALLBACK_STYLE =
  'bg-brand-100 text-brand-700 border-brand-300 dark:bg-brand-900/30 dark:text-brand-300 dark:border-brand-700'

export function Badge({ variant = 'slate', icon, children, className }: BadgeProps) {
  // Resolve semantic name → color name → style string
  const color = SEMANTIC_MAP[variant] ?? variant
  const variantClasses = COLOR_STYLES[color] ?? FALLBACK_STYLE

  // Resolve icon string → lucide component
  const IconComponent = icon ? ICON_MAP[icon] : null

  const baseClasses =
    'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap transition-colors duration-150'

  return (
    <span className={`${baseClasses} ${variantClasses}${className ? ` ${className}` : ''}`}>
      {IconComponent && <IconComponent size={12} className="shrink-0" />}
      {children}
    </span>
  )
}
