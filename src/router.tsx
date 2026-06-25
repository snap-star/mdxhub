import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'

import { RootLayout } from '@/layouts/RootLayout'
import { BlogLayout } from '@/layouts/BlogLayout'
import { DocsLayout } from '@/layouts/DocsLayout'

import Index from '@/routes/_index'
import BlogIndex from '@/routes/blog._index'
import BlogPost from '@/routes/blog.$slug'
import BlogCategory from '@/routes/blog.category.$name'
import BlogTag from '@/routes/blog.tag.$tag'
import DocsIndex from '@/routes/docs._index'
import DocPage from '@/routes/docs.$section.$slug'
import AboutPage from '@/routes/about'
import { NotFound } from '@/components/common/NotFound'

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
