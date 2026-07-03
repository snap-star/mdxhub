import {
  Check, Copy, Info, AlertTriangle, XCircle,
  Star, Heart, Zap, Shield, Clock, Calendar,
  BookOpen, FileText, Tag, Hash, Mail, Link2,
  Sun, Moon, Cloud, Download, Upload, RefreshCw,
  Plus, Minus, X, Search, Settings, User,
  Home, ArrowRight, ExternalLink, Globe,
  Lightbulb, Rocket, Sparkles, Target, Flag, Terminal,
  type LucideIcon,
} from 'lucide-react'

/**
 * Shared icon name → component map used by Badge, CardGrid, Steps, Tabs,
 * and other MDX components. Each key is an icon name used in MDX
 * component props (e.g. `icon="zap"`), and the value is the corresponding
 * lucide-react icon component.
 *
 * @example
 * ```tsx
 * const IconComponent = ICON_MAP['zap']
 * // → Zap component from lucide-react
 * ```
 */
export const ICON_MAP: Record<string, LucideIcon> = {
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
  globe: Globe,
  bulb: Lightbulb,
  rocket: Rocket,
  sparkles: Sparkles,
  target: Target,
  flag: Flag,
  terminal: Terminal,
}

export type { LucideIcon }
