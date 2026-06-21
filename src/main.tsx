import React from 'react'
import { createRoot } from 'react-dom/client'
import { AppRouter } from './router'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <AppRouter />
    </HelmetProvider>
  </React.StrictMode>,
)
