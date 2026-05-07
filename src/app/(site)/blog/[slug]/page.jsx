import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { sanityFetch } from '@/sanity/client'
import { urlFor } from '@/sanity/image'
import { BLOG_BY_SLUG_QUERY, ALL_BLOG_SLUGS_QUERY } from '@/sanity/queries/blog'

export async function generateStaticParams() {
  const slugs = await sanityFetch(ALL_BLOG_SLUGS_QUERY)
  return (slugs ?? []).map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await sanityFetch(BLOG_BY_SLUG_QUERY, { slug })
  if (!post) return {}
  return {
    title: `${post.title} — Hyperiux`,
    description: post.excerpt ?? '',
    openGraph: post.coverImage
      ? { images: [{ url: urlFor(post.coverImage).width(1200).height(630).quality(90).url() }] }
      : undefined,
  }
}

const portableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-[1.1vw] leading-[1.8] opacity-85 mb-[1.5vw] max-sm:text-[4vw] max-sm:mb-[5vw]">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="font-aeonik text-[2.5vw] leading-[1.2] mt-[3vw] mb-[1.5vw] max-sm:text-[7vw] max-sm:mt-[8vw] max-sm:mb-[4vw]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-aeonik text-[1.8vw] leading-[1.2] mt-[2.5vw] mb-[1vw] max-sm:text-[5.5vw] max-sm:mt-[6vw]">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-[3px] border-[#111111] pl-[2vw] my-[2vw] opacity-70 italic text-[1.2vw] max-sm:text-[4.2vw] max-sm:pl-[5vw]">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-medium">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    code: ({ children }) => (
      <code className="bg-[#f0f0f0] px-[0.4em] py-[0.1em] rounded text-[0.9em] font-mono">
        {children}
      </code>
    ),
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.blank ? '_blank' : '_self'}
        rel={value?.blank ? 'noreferrer' : undefined}
        className="underline underline-offset-2"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => (
      <figure className="my-[3vw] max-sm:my-[8vw]">
        <div className="relative w-full aspect-[16/9] rounded-[1vw] overflow-hidden max-sm:rounded-[3vw]">
          <Image
            src={urlFor(value).width(1200).height(675).quality(90).url()}
            fill
            alt={value.alt ?? ''}
            className="object-cover"
          />
        </div>
        {value.caption && (
          <figcaption className="text-center opacity-50 text-[0.9vw] mt-[0.8vw] max-sm:text-[3vw]">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
  },
}

const formatDate = (isoString) =>
  new Date(isoString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

export default async function BlogDetailPage({ params }) {
  const { slug } = await params
  const post = await sanityFetch(BLOG_BY_SLUG_QUERY, { slug })

  if (!post) notFound()

  const coverUrl = post.coverImage
    ? urlFor(post.coverImage).width(1400).height(800).quality(90).url()
    : null

  return (
    <main className="w-screen min-h-screen bg-[#fefefe] text-[#111111]">
      {coverUrl && (
        <div className="relative w-full h-[55vw] max-sm:h-[60vw] overflow-hidden">
          <Image
            src={coverUrl}
            fill
            alt={post.title}
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#fefefe]" />
        </div>
      )}

      <div className="px-[12vw] py-[6vw] max-sm:px-[7vw] max-sm:py-[10vw]">
        <div className="flex items-center gap-[1.5vw] mb-[2vw] max-sm:gap-[4vw] max-sm:mb-[5vw]">
          <span className="px-[1.5vw] py-[0.7vw] bg-[#111111] text-white rounded-full text-[0.9vw] leading-[1] max-sm:px-[4.5vw] max-sm:py-[3vw] max-sm:text-[3.5vw]">
            {post.category}
          </span>
          <span className="opacity-60 text-[1vw] max-sm:text-[3.5vw]">
            {post.publishedAt ? formatDate(post.publishedAt) : ''}
          </span>
        </div>

        <h1 className="font-aeonik text-[4vw] leading-[1.1] mb-[3vw] max-sm:text-[9vw] max-sm:mb-[6vw]">
          {post.title}
        </h1>

        {post.author && (
          <div className="flex items-center gap-[1vw] mb-[3vw] max-sm:gap-[3vw] max-sm:mb-[6vw]">
            {post.author.photo && (
              <div className="relative w-[2.5vw] h-[2.5vw] rounded-full overflow-hidden max-sm:w-[8vw] max-sm:h-[8vw]">
                <Image
                  src={urlFor(post.author.photo)?.width(80).height(80).url()}
                  fill
                  alt={post.author.name}
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className="text-[1vw] font-medium leading-[1.2] max-sm:text-[3.5vw]">{post.author.name}</p>
              {post.author.role && (
                <p className="text-[0.85vw] opacity-50 max-sm:text-[3vw]">{post.author.role}</p>
              )}
            </div>
          </div>
        )}

        {post.excerpt && (
          <p className="text-[1.3vw] leading-[1.6] opacity-70 mb-[4vw] border-b border-[#e0e0e0] pb-[4vw] max-sm:text-[4.5vw] max-sm:mb-[8vw] max-sm:pb-[8vw]">
            {post.excerpt}
          </p>
        )}

        {post.body && (
          <div className="max-w-[65ch]">
            <PortableText value={post.body} components={portableTextComponents} />
          </div>
        )}
      </div>
    </main>
  )
}
