export function SectionBackground({ variant = 'tech' }: { variant?: string }) {
  const gradients: Record<string, string> = {
    tech: 'from-blue-500/5 via-purple-500/5 to-transparent',
    features: 'from-cyan-500/5 via-teal-500/5 to-transparent',
    showcase: 'from-pink-500/5 via-rose-500/5 to-transparent',
    posts: 'from-lime-500/5 via-green-500/5 to-transparent',
    cta: 'from-violet-500/5 via-indigo-500/5 to-transparent',
  }
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[variant] || gradients.tech}`} />
      <div className="absolute top-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  )
}
