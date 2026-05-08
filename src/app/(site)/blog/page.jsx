import Image from 'next/image'
import Link from 'next/link'
import { sanityFetch } from '@/sanity/client'
import { urlFor } from '@/sanity/image'
import { ALL_BLOGS_QUERY } from '@/sanity/queries/blog'
import { Arrow } from '@/components/Buttons'

export const metadata = {
  title: 'Blog — Hyperiux',
  description: 'Ideas, insights, and perspectives from the Hyperiux team.',
}

const formatDate = (isoString) =>
  new Date(isoString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

const BlogCard = ({ post }) => (
  <Link
    href={`/blog/${post.slug}`}
    className="group flex flex-col gap-[1vw] max-sm:gap-[4vw]"
  >
    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-[1.2vw] max-sm:rounded-[3vw]">
      {post.image ? (
        <Image
          src={post.image}
          fill
          alt={post.title}
          className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <div className="w-full h-full bg-[#1a1a1a]" />
      )}

      <div className="absolute inset-0 px-[1.2vw] pt-[1.2vw] flex justify-between z-[2] max-sm:p-[4vw]">
        <span className="self-start px-[1.5vw] py-[0.7vw] bg-[#111111] text-white rounded-full text-[0.9vw] leading-[1] max-sm:px-[4.5vw] max-sm:py-[3vw] max-sm:text-[3.5vw]">
          {post.category}
        </span>

        <div className="self-start w-[2.2vw] h-[2.2vw] bg-white text-[#111111] flex items-center justify-end rounded-full overflow-hidden group-hover:w-[8vw] duration-500 max-sm:hidden">
          <p className="absolute left-[15%] top-[20%] opacity-0 group-hover:opacity-100 group-hover:delay-300 duration-300 font-display text-[0.75vw]">
            Read More
          </p>
          <div className="w-[2.2vw] h-[2.2vw] p-[0.7vw] shrink-0">
            <Arrow />
          </div>
        </div>
      </div>
    </div>

    <div className="flex flex-col gap-[0.5vw] pl-[0.5vw] max-sm:gap-[2vw]">
      <p className="text-[#111111] font-aeonik leading-[1.2] text-[1.45vw] max-sm:text-[4.5vw]">
        {post.title}
      </p>
      {post.excerpt && (
        <p className="opacity-60 text-[1vw] line-clamp-2 max-sm:text-[3.2vw]">
          {post.excerpt}
        </p>
      )}
      <p className="opacity-75 text-[1.05vw] max-sm:text-[3.5vw]">
        {post.publishedAt}
      </p>
    </div>
  </Link>
)

export default async function BlogListingPage() {
  const raw = await sanityFetch(ALL_BLOGS_QUERY)

  const posts = (raw ?? []).map((post) => ({
    title: post.title,
    slug: post.slug,
    image: post.coverImage ? urlFor(post.coverImage).width(800).height(600).quality(90).url() : null,
    excerpt: post.excerpt ?? null,
    category: post.category,
    publishedAt: post.publishedAt ? formatDate(post.publishedAt) : '',
  }))

  return (
    <main className="w-screen min-h-screen bg-[#fefefe] text-[#111111] pt-[12vw] pb-[8vw] px-[5vw] max-sm:pt-[30vw] max-sm:px-[7vw]">
      <h1 className="font-aeonik text-[6vw] leading-[1.05] mb-[5vw] max-sm:text-[12vw]">
        Ideas in Motion
      </h1>

      {posts.length === 0 ? (
        <p className="opacity-60 text-[1.2vw] max-sm:text-[4vw]">
          No posts published yet.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-x-[3vw] gap-y-[6vw] max-sm:grid-cols-1 max-sm:gap-y-[12vw] md:grid-cols-2">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </main>
  )
}
