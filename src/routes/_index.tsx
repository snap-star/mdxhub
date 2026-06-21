import React from 'react'
import { Navigate } from 'react-router'
import { Link } from 'react-router'
import { ArrowRight, BookOpen, PenTool, Zap, Shield, Search } from 'lucide-react'
import { SEO } from '@/components/common/SEO'

export default function Index() {
  return (
    <>
      <SEO />
      <Navigate to="/blog" replace />
    </>
  )
}
