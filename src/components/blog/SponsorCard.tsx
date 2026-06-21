import React from 'react'
import { Heart } from 'lucide-react'

export function SponsorCard() {
  return (
    <div className="mt-8 p-6 rounded-2xl border border-border bg-gradient-to-b from-card to-brand-50/30 dark:to-[oklch(18.5%_0.038_245/0.3)] relative overflow-hidden group">
      {/* Background glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-400/0 via-brand-400/0 to-brand-400/10 dark:to-brand-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-pink-100 dark:bg-pink-950/50 text-pink-500 rounded-lg">
          <Heart size={20} className="fill-current" />
        </div>
        <h3 className="font-bold text-foreground">Support Our Work ^_^)/</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-5 leading-relaxed relative z-10">
        If you find our content and tools helpful, consider becoming a sponsor. Your support helps us keep building open-source projects!
      </p>
      
      <a
        href="https://ko-fi.com/snapstar"
        className="block w-full text-center py-2.5 px-4 rounded-xl bg-brand-50 text-brand-700 dark:bg-[oklch(22%_0.040_245)] dark:text-brand-300 font-medium hover:bg-brand-100 dark:hover:bg-[oklch(28%_0.055_245)] transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400 relative z-10"
      >
        Become a Sponsor
      </a>
    </div>
  )
}
