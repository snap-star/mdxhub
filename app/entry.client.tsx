import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HydratedRouter } from 'react-router/dom'
import '../src/index.css'

createRoot(document).render(
  <StrictMode>
    <HydratedRouter />
  </StrictMode>,
)
