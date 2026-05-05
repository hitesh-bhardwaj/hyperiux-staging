"use client";

import React, { useEffect, useRef } from "react";
import HeadAnim from "../Animations/HeadAnim";
import { Arrow, LinkButton } from "../Buttons";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import gsap from "gsap";

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
      className="w-full h-[20vw] flex items-center cursor-pointer max-sm:h-[65vw]"
    >
      <div className="flex flex-col items-start justify-between gap-[1vw] w-full h-full max-sm:gap-[4vw]">
        <div className="w-full h-[75%] relative overflow-hidden image-container radius max-sm:h-[25vh] group">
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

        <div className="w-[95%] flex flex-col gap-[1vw] pl-[0.5vw] h-[20%] max-sm:gap-[3vw]">
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

const Blogs = ({ blogData = fallbackBlogs }) => {
  const swiperRef = useRef(null);
  useEffect(()=>{
    gsap.to(".blog-swiper",{
      translateX:"0%",
      opacity:1,
      ease:"power2.out",
      duration:1.4,
      scrollTrigger:{
        trigger:"#blog-horizontal",
        start:"top 50%",
        // markers:true
        // end:"bottom "
      }
    })
  })

  return (
    <section
      className="w-screen py-[7%] h-fit bg-[#fefefe] text-[#111111] relative z-4"
      id="blog-horizontal"
    >
      <div className="w-screen h-fit overflow-hidden">
        <div className="flex flex-col px-[5vw] w-full items-end max-sm:px-[7vw]">
          <div className="w-full flex justify-between items-end max-sm:flex-col max-sm:items-start max-sm:gap-[6vw]">
            <HeadAnim>
              <h2 className="text-[5.7vw] max-sm:text-[11vw]">
                Ideas in Motion
              </h2>
            </HeadAnim>
           <div className="fadeup">
            <LinkButton
              href="/blog"
              text="View All"
              className="max-sm:hidden "
            />

           </div>
          </div>

          <span className="w-full h-[1px] bg-[#111111] mt-[3vw] mb-[2vw] lineDraw max-sm:bg-black/20 max-sm:my-[4vw]" />

          <LinkButton
            href="/blog"
            text="View All Blogs"
            className="!hidden max-sm:block"
          />
        </div>

        <div className="w-screen h-fit mt-[3vw]">
          <Swiper
            modules={[FreeMode]}
            freeMode={{
              enabled: true,
              momentum: true,
              sticky: false,
            }}
            grabCursor={true}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            slidesPerView={3}
            spaceBetween={30}
            speed={500}
            breakpoints={{
              0: {
                slidesPerView: 1.15,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            className="w-full !px-[5vw] max-sm:!px-[7vw] blog-swiper translate-x-[40%] opacity-0"
          >
            {blogData.map((blog, index) => (
              <SwiperSlide key={`${blog.title}-${index}`}>
                <BlogCard blog={blog} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Blogs;