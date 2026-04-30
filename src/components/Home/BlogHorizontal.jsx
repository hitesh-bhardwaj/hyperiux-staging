"use client";

import React, { useRef } from "react";
import HeadAnim from "../Animations/HeadAnim";
import { Arrow, LinkButton } from "../Buttons";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const fallbackBlogs = [
  {
    title: "Why Great Digital Products Feel Effortless",
    slug: "/blog/why-great-digital-products-feel-effortless",
    image: "/assets/images/homepage/blogs/blog-img-2.jpg",
    category: "Design",
    publishedAt: "29 April 2026",
  },
  {
    title: "The New Rules of Conversion-Led Website Design",
    slug: "/blog/conversion-led-website-design",
    image: "/assets/images/homepage/blogs/blog-img-3.jpg",
    category: "Strategy",
    publishedAt: "24 April 2026",
  },
  {
    title: "How Motion Design Shapes Brand Memory",
    slug: "/blog/motion-design-brand-memory",
    image: "/assets/images/homepage/blogs/blog-img-4.jpg",
    category: "Motion",
    publishedAt: "18 April 2026",
  },
  {
    title: "What Founders Get Wrong About Product Experience",
    slug: "/blog/founders-product-experience",
    image: "/assets/images/homepage/blogs/blog-img-5.jpg",
    category: "UX",
    publishedAt: "12 April 2026",
  },
  {
    title: "Building Websites That Sell Before They Speak",
    slug: "/blog/websites-that-sell",
    image: "/assets/images/homepage/blogs/blog-img-6.jpg",
    category: "Development",
    publishedAt: "07 April 2026",
  },
];

const BlogCard = ({ blog }) => {
  return (
    <Link
      href={blog.slug}
      className="min-w-[28vw] h-[30vw] flex items-center cursor-pointer max-sm:min-w-[80vw] max-sm:items-start"
    >
      <div className="flex flex-col items-start justify-between gap-[1vw] w-full h-full max-sm:h-fit max-sm:gap-[4vw]">
        <div className="w-full h-[60%] relative overflow-hidden image-container radius max-sm:h-[25vh] group">
          <div className="w-full h-full absolute top-0 left-0 px-[1.2vw] pt-[1.2vw] flex justify-between z-[2] text-[0.9vw] max-sm:p-[4vw]">
            <div className="w-fit h-fit px-[1.5vw] py-[0.7vw] bg-[#111111] rounded-full flex justify-center items-center z-[2] text-white leading-[1] max-sm:px-[4.5vw] max-sm:py-[3vw] max-sm:text-[3.5vw]">
              {blog.category}
            </div>

            <div className="w-[2.2vw] h-[2.2vw] bg-white text-[#111111] flex items-center justify-end rounded-full z-[2] arrow-link relative overflow-hidden group-hover:w-[8vw] duration-500 max-sm:hidden">
              <p className="absolute left-[15%] top-[20%] opacity-0 group-hover:opacity-[100] group-hover:delay-300 duration-300 font-display">
                Read More
              </p>

              <div className="w-[2.2vw] h-[2.2vw] p-[0.7vw]">
                <Arrow />
              </div>
            </div>
          </div>

          <Image
            src={blog.image}
            width={700}
            height={500}
            alt={blog.title}
            className="object-cover w-full h-full object-top transition-all duration-500 ease-out group-hover:scale-[1.05]"
          />
        </div>

        <div className="w-[95%] flex flex-col gap-[1vw] pl-[0.5vw] h-[45%] max-sm:gap-[3vw]">
          <p className="text-[#111111] font-light text-[1.25vw] max-sm:text-[4.5vw]">
            {blog.title}
          </p>

          <p className="opacity-75 text-[0.8vw] max-sm:text-[3.5vw]">
            {blog.publishedAt}
          </p>
        </div>
      </div>
    </Link>
  );
};

const BlogHorizontal = ({ blogData = fallbackBlogs }) => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;

      if (!section || !track) return;

      const getScrollAmount = () => {
        return -(track.scrollWidth - window.innerWidth + window.innerWidth * 0.01);
      };

      gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
        //   markers: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="w-screen py-[7%] h-[200vh] bg-[#fefefe] text-[#111111]"
      id="blog-horizontal"
    >
      <div className="w-screen h-fit overflow-hidden sticky top-[10%]">
        <div className="flex flex-col px-[5vw] w-full items-end max-sm:px-[7vw]">
          <div className="w-full flex justify-between items-end max-sm:flex-col max-sm:items-start max-sm:gap-[6vw]">
            <HeadAnim>
              <h2 className="text-[5.7vw] max-sm:text-[11vw]">
                Ideas in Motion
              </h2>
            </HeadAnim>

            <LinkButton
              href="/blog"
              text="View All"
              className="max-sm:hidden"
            />
          </div>

          <span className="w-full h-[1px] bg-[#111111] mt-[3vw] mb-[2vw] lineanim max-sm:bg-black/20 max-sm:my-[4vw]" />

          <LinkButton
            href="/blog"
            text="View All Blogs"
            className="!hidden max-sm:block"
          />
        </div>

        <div
          ref={trackRef}
          className="w-max flex gap-[2vw] px-[5vw] will-change-transform"
        >
          {blogData.map((blog, index) => (
            <BlogCard key={`${blog.title}-${index}`} blog={blog} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogHorizontal;