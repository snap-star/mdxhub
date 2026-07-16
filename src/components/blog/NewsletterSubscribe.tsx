import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowRight, Sparkles, Shield, CheckCircle2 } from 'lucide-react'

interface NewsletterSubscribeProps {
  /** URL the form submits to (e.g. Mailchimp, EmailOctopus, Buttondown endpoint) */
  actionUrl?: string
  /** Shortname shown in the heading (default: "Stay Updated") */
  heading?: string
  /** Descriptive text (default: a friendly invitation) */
  description?: string
  /** Placeholder for the email input (default: "you@example.com") */
  placeholder?: string
  /** Button label (default: "Subscribe") */
  buttonLabel?: string
  /** Callback invoked after successful submission */
  onSubscribed?: (email: string) => void
  /** Compact mode for narrow containers like sidebars (stacks vertically, full-width form) */
  compact?: boolean
  /** Optional className for the outer div */
  className?: string
}

export function NewsletterSubscribe({
  actionUrl = '#',
  heading = 'Stay Updated',
  description = 'Get the latest posts delivered straight to your inbox. No spam, ever. Unsubscribe anytime.',
  placeholder = 'you@example.com',
  buttonLabel = 'Subscribe',
  onSubscribed,
  compact = false,
}: NewsletterSubscribeProps) {
  const [email, setEmail] = React.useState('')
  const [submitted, setSubmitted] = React.useState(false)
  const [subscribedEmail, setSubscribedEmail] = React.useState('')

  // Don't render when not configured — silently skipped
  if (actionUrl === '#') {
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    if (!email.trim()) {
      e.preventDefault()
      return
    }

    setSubscribedEmail(email)
    setSubmitted(true)
    onSubscribed?.(email)

    // Let the native form submission handle real URLs (opens in new tab)
    // Clear local state so they can try another email
    setEmail('')
  }

  const handleReset = () => {
    setSubmitted(false)
    setSubscribedEmail('')
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-brand-50/30 dark:from-card dark:via-card dark:to-brand-900/10 ${compact ? 'mt-4' : 'mt-12'}`}>
      {/* Subtle decorative gradient blobs — smaller in compact mode */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute rounded-full bg-brand-400/10 blur-3xl dark:bg-brand-500/5 ${compact ? '-top-10 -right-10 h-24 w-24' : '-top-20 -right-20 h-40 w-40'}`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-500/5 ${compact ? '-bottom-8 -left-8 h-20 w-20' : '-bottom-16 -left-16 h-32 w-32'}`}
      />

      <div className={`relative z-10 flex flex-col gap-4 ${compact ? 'p-4' : 'sm:flex-row sm:items-center gap-6 p-6 sm:p-8'}`}>
        {/* Icon + Text */}
        <div className={`flex items-start gap-3 ${compact ? '' : 'sm:gap-5 sm:flex-1'}`}>
          <div className={`shrink-0 flex items-center justify-center rounded-xl bg-brand-500/10 dark:bg-brand-500/20 ring-1 ring-brand-500/20 dark:ring-brand-500/30 ${compact ? 'w-10 h-10' : 'w-12 h-12'}`}>
            <Mail size={compact ? 18 : 22} className="text-brand-600 dark:text-brand-400" />
          </div>
          <div className="min-w-0">
            <h3 className={`flex items-center gap-2 font-bold text-foreground ${compact ? 'text-sm' : 'text-base sm:text-lg'}`}>
              {heading}
              <Sparkles size={compact ? 12 : 14} className="text-amber-500 shrink-0" />
            </h3>
            <p className={`mt-1 text-muted-foreground leading-relaxed ${compact ? 'text-xs' : 'text-sm'}`}>
              {description}
            </p>
          </div>
        </div>

        {/* Form / Success state */}
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }}
              className={`shrink-0 ${compact ? 'w-full' : 'w-full sm:w-auto sm:min-w-[300px]'}`}
            >
              <div className="flex flex-col items-center gap-3 rounded-xl bg-success/10 dark:bg-success/15 border border-success/25 px-4 py-3">
                <div className="flex items-center gap-2.5 w-full">
                  <CheckCircle2 size={compact ? 18 : 20} className="text-success shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className={`font-semibold text-foreground ${compact ? 'text-xs' : 'text-sm'}`}>
                      You're subscribed!
                    </p>
                    <p className={`text-muted-foreground truncate mt-0.5 ${compact ? 'text-[0.7rem]' : 'text-[0.78rem]'}`}>
                      {subscribedEmail}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="shrink-0 text-[0.72rem] font-medium text-muted-foreground hover:text-foreground underline underline-offset-2 decoration-dotted transition-colors"
                  >
                    Change email
                  </button>
                </div>
              </div>

              {/* Privacy note remains visible */}
              <p className="flex items-center gap-1 mt-2 text-[0.65rem] text-muted-foreground/70">
                <Shield size={10} className="shrink-0" />
                Check your inbox to confirm your subscription.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              action={actionUrl}
              method="POST"
              target="_blank"
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] as const }}
              className={`shrink-0 ${compact ? 'w-full' : 'w-full sm:w-auto sm:min-w-[300px]'}`}
            >
              <div className="flex gap-2">
                <div className="relative flex-1 min-w-0">
                  <input
                    type="email"
                    name="EMAIL"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={placeholder}
                    aria-label="Email address"
                    required
                    className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60
                      focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500
                      transition-all duration-200"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-brand-500 text-white text-sm font-semibold
                    hover:bg-brand-600 active:scale-[0.97]
                    shadow-lg shadow-brand-500/25 hover:shadow-brand-500/35
                    transition-all duration-200 shrink-0"
                >
                  {buttonLabel}
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>

              {/* Privacy note */}
              <p className="flex items-center gap-1 mt-2 text-[0.65rem] text-muted-foreground/70">
                <Shield size={10} className="shrink-0" />
                No spam — unsubscribe anytime.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
