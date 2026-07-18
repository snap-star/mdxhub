import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { describe, it, expect } from 'vitest'

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(<ErrorBoundary><div>hello</div></ErrorBoundary>)
    expect(screen.getByText('hello')).toBeInTheDocument()
  })

  it('catches errors and displays fallback', () => {
    function ThrowError() {
      throw new Error('test error')
    }
    const original = console.error
    console.error = () => {}
    render(<ErrorBoundary><ThrowError /></ErrorBoundary>)
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    expect(screen.getByText('Try Again')).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
    console.error = original
  })
})
