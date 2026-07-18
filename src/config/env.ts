import { z } from 'zod'

const envSchema = z.object({
  VITE_SITE_URL: z.string().url().default('https://mdxhub.vercel.app'),
  VITE_DISQUS_SHORTNAME: z.string().optional(),
  VITE_ANALYTICS_ID: z.string().optional(),
  VITE_GITHUB_TOKEN: z.string().optional(),
  VITE_ERROR_TRACKING_DSN: z.string().url().optional(),
})

type Env = z.infer<typeof envSchema>

function validateEnv(): Env {
  const env = {
    VITE_SITE_URL: import.meta.env.VITE_SITE_URL,
    VITE_DISQUS_SHORTNAME: import.meta.env.VITE_DISQUS_SHORTNAME,
    VITE_ANALYTICS_ID: import.meta.env.VITE_ANALYTICS_ID,
    VITE_GITHUB_TOKEN: import.meta.env.VITE_GITHUB_TOKEN,
    VITE_ERROR_TRACKING_DSN: import.meta.env.VITE_ERROR_TRACKING_DSN,
  }

  const parsed = envSchema.safeParse(env)
  if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.flatten())
    throw new Error('Environment validation failed')
  }

  return parsed.data
}

export const config = validateEnv()
