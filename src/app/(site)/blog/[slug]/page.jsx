import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { sanityFetch } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import {
  BLOG_BY_SLUG_QUERY,
  ALL_BLOG_SLUGS_QUERY,
} from "@/sanity/queries/blog";
import "../../../../styles/blog.css";
import BlogLeftContent from "@/components/BlogDetail/BlogLeftContent";

export async function generateStaticParams() {
  const slugs = await sanityFetch(ALL_BLOG_SLUGS_QUERY);

  return (slugs ?? []).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await sanityFetch(BLOG_BY_SLUG_QUERY, { slug });

  if (!post) return {};

  return {
    title: `${post.title} — Hyperiux`,
    description: post.excerpt ?? "",
    openGraph: post.coverImage
      ? {
          images: [
            {
              url: urlFor(post.coverImage)
                .width(1200)
                .height(630)
                .quality(90)
                .url(),
            },
          ],
        }
      : undefined,
  };
}

const portableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    h4: ({ children }) => <h4>{children}</h4>,
    h5: ({ children }) => <h5>{children}</h5>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },

  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => <ol>{children}</ol>,
  },

  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },

  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    code: ({ children }) => <code>{children}</code>,

    link: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.blank ? "_blank" : "_self"}
        rel={value?.blank ? "noreferrer" : undefined}
      >
        {children}
      </a>
    ),
  },

  types: {
    image: ({ value }) => (
      <figure className="blog-figure">
        <div className="blog-inline-image">
          <Image
            src={urlFor(value).width(1200).height(675).quality(90).url()}
            fill
            alt={value.alt ?? ""}
            sizes="(max-width: 768px) 100vw, 720px"
          />
        </div>

        {value.caption && <figcaption>{value.caption}</figcaption>}
      </figure>
    ),
  },
};

const formatDate = (isoString) =>
  new Date(isoString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

function getBlockText(block) {
  if (!block) return "";

  if (typeof block === "string") return block;

  if (Array.isArray(block)) {
    return block.map(getBlockText).join(" ");
  }

  if (block.children && Array.isArray(block.children)) {
    return block.children.map((child) => child.text || "").join(" ");
  }

  return "";
}

function getAllTextFromPortableText(blocks = []) {
  if (!Array.isArray(blocks)) return "";

  return blocks
    .map((block) => {
      if (block?._type === "block") return getBlockText(block);
      return "";
    })
    .join(" ");
}

function getReadingTime(post) {
  const text = [
    post?.title || "",
    post?.excerpt || "",
    getAllTextFromPortableText(post?.body || []),
  ].join(" ");

  const words = text.trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 200));
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const post = await sanityFetch(BLOG_BY_SLUG_QUERY, { slug });

  if (!post) notFound();

  const coverUrl = post.coverImage
    ? urlFor(post.coverImage).width(1400).height(800).quality(90).url()
    : null;

  const publishedDate = post.publishedAt ? formatDate(post.publishedAt) : "";
  const readingTime = getReadingTime(post);

  const author = post.author
    ? {
        name: post.author.name,
        role: post.author.role,
        photoUrl: post.author.photo
          ? urlFor(post.author.photo).width(160).height(160).quality(90).url()
          : null,
      }
    : null;

  return (
    <main className="blog-page">
      {coverUrl && (
        <section className="w-screen h-screen relative flex items-center px-[5vw]">
          <Image
            src={coverUrl}
            fill
            alt={post.title}
            priority
            sizes="100vw"
            className="w-full h-full absolute brightness-50"
          />

          <h1 className="text-white relative z-[1]">{post.title}</h1>
        </section>
      )}

      <div className="w-full h-fit flex items-start relative justify-between px-[5vw] pt-[7%] overflow-visible">
        <BlogLeftContent
          category={post.category}
          publishedAt={publishedDate}
          readingTime={readingTime}
          title={post.title}
          author={author}
        />

        <article className="blog-article pb-[30%]!">
          {post.body && (
            <PortableText
              value={post.body}
              components={portableTextComponents}
            />
          )}
        </article>
      </div>
    </main>
  );
}