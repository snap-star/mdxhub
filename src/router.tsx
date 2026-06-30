import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'

import { RootLayout } from '@/layouts/RootLayout'
import { BlogLayout } from '@/layouts/BlogLayout'
import { DocsLayout } from '@/layouts/DocsLayout'

import { NotFound } from '@/components/common/NotFound'

// ─── Lazy-loaded route components ──────────────────────────────────────────
//
// Each route is code-split so that its JS is only loaded when the user
// navigates to that section, significantly reducing the initial bundle size.
//
// The About page was already lazy-loaded — now all routes follow the same pattern.

const Index = React.lazy(() => import('@/routes/_index'))
const BlogIndex = React.lazy(() => import('@/routes/blog._index'))
const BlogPost = React.lazy(() => import('@/routes/blog.$slug'))
const BlogCategory = React.lazy(() => import('@/routes/blog.category.$name'))
const BlogTag = React.lazy(() => import('@/routes/blog.tag.$tag'))
const DocsIndex = React.lazy(() => import('@/routes/docs._index'))
const DocPage = React.lazy(() => import('@/routes/docs.$section.$slug'))
const AboutPage = React.lazy(() => import('@/routes/about'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Index /> },
      { path: 'about', element: <AboutPage /> },
      {
        path: 'blog',
        element: <BlogLayout />,
        children: [
          { index: true, element: <BlogIndex /> },
          { path: 'category/:name', element: <BlogCategory /> },
          { path: 'tag/:tag', element: <BlogTag /> },
          { path: ':slug/*', element: <BlogPost /> },
        ],
      },
      {
        path: 'docs',
        element: <DocsLayout />,
        children: [
          { index: true, element: <DocsIndex /> },
          { path: '*', element: <DocPage /> },
        ],
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
