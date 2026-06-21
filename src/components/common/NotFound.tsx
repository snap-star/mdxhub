import React from 'react'
import { Link, useRouteError, isRouteErrorResponse } from 'react-router'
import { Home, AlertTriangle } from 'lucide-react'

export function NotFound() {
  const error = useRouteError()
  let errorMessage = 'An unexpected error occurred.'
  
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      errorMessage = 'The page you are looking for does not exist or has been moved.'
    } else {
      errorMessage = error.statusText
    }
  } else if (error instanceof Error) {
    errorMessage = error.message
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-center">
      <div className="mb-6 p-4 bg-muted rounded-full text-muted-foreground">
        <AlertTriangle size={48} />
      </div>
      <h1 className="text-4xl font-bold font-serif mb-4 tracking-tight">Oops! Page not found</h1>
      <p className="text-lg text-muted-foreground mb-10 max-w-[500px] leading-relaxed">
        {errorMessage}
      </p>
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
      >
        <Home size={18} />
        Return to Home
      </Link>
    </div>
  )
}
