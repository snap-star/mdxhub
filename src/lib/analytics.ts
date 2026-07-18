import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals'
import { config } from '@/config/env'

type VitalName = 'CLS' | 'FCP' | 'LCP' | 'TTFB'

export function initAnalytics() {
  const id = config.VITE_ANALYTICS_ID
  if (!id) return

  const report = (name: VitalName, value: number) => {
    const body = { name, value, id, url: location.href }
    navigator.sendBeacon?.('/api/analytics', JSON.stringify(body))
  }

  onCLS((m) => report('CLS', m.value))
  onFCP((m) => report('FCP', m.value))
  onLCP((m) => report('LCP', m.value))
  onTTFB((m) => report('TTFB', m.value))
}
