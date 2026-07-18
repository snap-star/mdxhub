export interface ErrorLog {
  message: string
  stack?: string
  context?: Record<string, unknown>
  timestamp: number
  url: string
}

class ErrorTracker {
  private errors: ErrorLog[] = []
  private maxErrors = 50

  log(error: Error, context?: Record<string, unknown>) {
    const errorLog: ErrorLog = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : '',
    }
    this.errors.push(errorLog)
    if (this.errors.length > this.maxErrors) this.errors.shift()

    if (import.meta.env.VITE_ERROR_TRACKING_DSN) {
      this.sendToService(errorLog)
    }
  }

  private async sendToService(errorLog: ErrorLog) {
    try {
      await fetch(import.meta.env.VITE_ERROR_TRACKING_DSN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorLog),
      })
    } catch {
      // silent
    }
  }

  getErrors() {
    return [...this.errors]
  }
}

export const errorTracker = new ErrorTracker()
