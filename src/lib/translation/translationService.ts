// ─── Content Translation Service ────────────────────────────────────────

interface TranslatedContent<T> {
  original: T
  translated: T
}

interface TranslationOptions {
  locale: string
  sourceLanguage?: string
  targetLanguage?: string
  preserveFormat?: boolean
}

async function translateContent<T>(
  content: T,
  options: TranslationOptions
): Promise<TranslatedContent<T>> {
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        locale: options.locale,
        sourceLanguage: options.sourceLanguage || 'en',
        targetLanguage: options.targetLanguage || options.locale,
        preserveFormat: options.preserveFormat ?? true,
      }),
    })\n
    if (!response.ok) {
      throw new Error(`Translation failed: ${response.status}`)
    }

    const result = await response.json() as TranslatedContent<T>
    return result
  } catch (err) {
    console.error('[Translation] Failed to translate content:', err)
    return { original: content, translated: content }
  }
}

export const translationService = { translateContent }
