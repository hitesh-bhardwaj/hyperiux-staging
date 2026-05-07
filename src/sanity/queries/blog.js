export const HOMEPAGE_BLOGS_QUERY = `
  *[_type == "blog"] | order(publishedAt desc)[0...6] {
    title,
    "slug": slug.current,
    coverImage,
    "category": category->name,
    publishedAt
  }
`

export const ALL_BLOGS_QUERY = `
  *[_type == "blog"] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    coverImage,
    excerpt,
    "category": category->name,
    "author": author->{ name, photo, role },
    publishedAt
  }
`

export const BLOG_BY_SLUG_QUERY = `
  *[_type == "blog" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    coverImage,
    excerpt,
    "category": category->name,
    "author": author->{ name, photo, role },
    publishedAt,
    body
  }
`

export const ALL_BLOG_SLUGS_QUERY = `
  *[_type == "blog"] { "slug": slug.current }
`
