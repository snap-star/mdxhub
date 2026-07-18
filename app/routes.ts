import { route } from "@react-router/dev/routes"

export default [
  route("", "../src/routes/_index.tsx"),
  route("about", "../src/routes/about.tsx"),
  route("search", "../src/routes/search._index.tsx"),
  {
    path: "blog",
    file: "../src/layouts/BlogLayout.tsx",
    children: [
      route("", "../src/routes/blog._index.tsx"),
      route("category", "../src/routes/blog.category._index.tsx"),
      route("category/:name", "../src/routes/blog.category.$name.tsx"),
      route("tags", "../src/routes/blog.tags._index.tsx"),
      route("tag/:tag", "../src/routes/blog.tag.$tag.tsx"),
      route(":slug/*", "../src/routes/blog.$slug.tsx"),
    ],
  },
  {
    path: "docs",
    file: "../src/layouts/DocsLayout.tsx",
    children: [
      route("", "../src/routes/docs._index.tsx"),
      route("*", "../src/routes/docs.$section.$slug.tsx"),
    ],
  },
]
