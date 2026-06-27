import React from 'react'
import { Navigate } from 'react-router'
import { SEO } from '@/components/common/SEO'

export default function Index() {
  return (
    <>
      <SEO />
      <Navigate to="/blog" replace />
    </>
  )
}
