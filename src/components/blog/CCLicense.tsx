import React from 'react'
import { getCCLicense } from '@/lib/utils'
import { Scale } from 'lucide-react'

interface CCLicenseProps {
  code: string
  author?: string
  year?: string | number
}

export function CCLicense({ code, author, year }: CCLicenseProps) {
  const license = getCCLicense(code)

  if (!license) return null

  return (
    <div className="cc-license">
      <div className="w-10 h-10 rounded-md bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shrink-0">
        <Scale size={18} color="white" />
      </div>
      <div className="flex-1">
        <p className="text-[0.8rem] font-semibold text-foreground mb-0.5">
          {code}
          {license.icon !== code && ` · ${license.icon}`}
        </p>
        <p className="text-[0.78rem] text-muted-foreground leading-relaxed">
          {author && `© ${year ?? new Date().getFullYear()} ${author} · `}
          <a
            href={license.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline no-underline"
          >
            {license.label}
          </a>
        </p>
      </div>
    </div>
  )
}
