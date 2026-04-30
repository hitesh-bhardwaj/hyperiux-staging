"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import Image from "next/image";
import { Arrow, LinkButton } from "../Buttons/index";
import Link from "next/link";
import HeadAnim from "../Animations/HeadAnim";

const fallbackBlogs = [
  {
    title: "Why Great Digital Products Feel Effortless",
    slug: "/blog/why-great-digital-products-feel-effortless",
    image: "/assets/images/homepage/blogs/blog-img-1.png",
    category: "Design",
    publishedAt: "29 April 2026",
  },
  {
    title: "The New Rules of Conversion-Led Website Design",
    slug: "/blog/conversion-led-website-design",
    image: "/assets/images/homepage/blogs/blog-img-1.png",
    category: "Strategy",
    publishedAt: "24 April 2026",
  },
  {
    title: "How Motion Design Shapes Brand Memory",
    slug: "/blog/motion-design-brand-memory",
    image: "/assets/images/homepage/blogs/blog-img-1.png",
    category: "Motion",
    publishedAt: "18 April 2026",
  },
  {
    title: "What Founders Get Wrong About Product Experience",
    slug: "/blog/founders-product-experience",
    image: "/assets/images/homepage/blogs/blog-img-1.png",
    category: "UX",
    publishedAt: "12 April 2026",
  },
  {
    title: "Building Websites That Sell Before They Speak",
    slug: "/blog/websites-that-sell",
    image: "/assets/images/homepage/blogs/blog-img-1.png",
    category: "Development",
    publishedAt: "07 April 2026",
  },
];

const BlogCard = ({ img, text, date, category, link }) => {
  return (
    <Link
      href={link}
      className="w-full h-[35vw] flex items-center cursor-pointer max-sm:items-start"
    >
      <div className="flex flex-col items-start justify-between gap-[1vw] w-full h-full max-sm:h-fit max-sm:gap-[4vw]">
        <div className="w-full h-[50%] relative overflow-hidden image-container radius max-sm:h-[25vh] group">
          <div className="w-full h-full absolute top-0 left-0 px-[1.2vw] pt-[1.2vw] flex justify-between z-[2] text-[0.9vw] max-sm:p-[4vw]">
            <div className="w-fit h-fit px-[1.5vw] py-[0.7vw] bg-[#111111] rounded-full flex justify-center items-center z-[2] text-white leading-[1] max-sm:px-[4.5vw] max-sm:py-[3vw] max-sm:text-[3.5vw]">
              {category}
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
            src={img}
            width={700}
            height={500}
            alt={text}
            className="object-cover w-full h-full object-top transition-all duration-500 ease-out group-hover:scale-[1.05]"
          />
        </div>

        <div className="w-[95%] flex flex-col gap-[1vw] pl-[0.5vw] h-[45%] max-sm:gap-[3vw]">
          <p className="text-[#111111] font-light text-[1.25vw] max-sm:text-[4.5vw]">
            {text}
          </p>

          <p className="opacity-75 text-[0.8vw] max-sm:text-[3.5vw]">
            {date}
          </p>
        </div>
      </div>
    </Link>
  );
};

const Blogs = ({ blogData = fallbackBlogs }) => {
  const swiperRef = useRef(null);

  const normalizedBlogs = blogData.map((item) => ({
    title: item.title,
    image: item?.mainImage?.asset?.url || item.image,
    category: item?.categories?.[0]?.title || item.category || "Insights",
    date: item.publishedAt || "29 April 2026",
    link: item?.slug?.current
      ? `/blog/${item.slug.current}`
      : item.slug || item.link || "#",
  }));

  const sliderBlogs = [...normalizedBlogs, ...normalizedBlogs];

  return (
    <section
      id="blogs"
      className="w-full h-fit overflow-hidden relative z-[30] bg-[#fefefe] pt-[5%] max-sm:py-[15%] max-sm:h-fit max-sm:pb-[15%] text-[#111111]"
    >
      <div className="flex flex-col px-[5vw] w-full items-end max-sm:px-[7vw]">
        <div className="w-full flex justify-between items-end max-sm:flex-col max-sm:items-start max-sm:gap-[6vw]">
          <HeadAnim>
            <h2 className="text-[5.7vw] max-sm:text-[11vw]">
              Ideas in Motion
            </h2>
          </HeadAnim>

          <LinkButton href="/blog" text="View All" className="max-sm:hidden" />
        </div>

        <span className="w-full h-[1px] bg-[#111111] mt-[3vw] mb-[2vw] lineanim max-sm:bg-black/20 max-sm:my-[4vw]" />

        <LinkButton
          href="/blog"
          text="View All Blogs"
          className="!hidden max-sm:block"
        />
      </div>

      <div className="w-[100vw] h-fit flex items-center justify-center fadeup mt-[3vw] max-sm:mt-[8vw]">
        <Swiper
          modules={[FreeMode]}
          loop={true}
          loopAdditionalSlides={sliderBlogs.length}
          freeMode={{
            enabled: true,
            momentum: true,
            sticky: false,
          }}
          grabCursor={true}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          speed={500}
          spaceBetween={30}
          slidesPerView="auto"
          breakpoints={{
            480: { slidesPerView: 1, spaceBetween: 15 },
            720: { slidesPerView: 1, spaceBetween: 15 },
            1024: { slidesPerView: 2, spaceBetween: 24 },
            1280: { slidesPerView: 3, spaceBetween: 30 },
          }}
          className="awards-swiper w-full h-full flex items-center justify-center !px-[5vw] max-sm:!px-[7vw]"
        >
          {sliderBlogs.map((item, index) => (
            <SwiperSlide key={`${item.title}-${index}`}>
              <BlogCard
                img={item.image}
                text={item.title}
                date={item.date}
                category={item.category}
                link={item.link}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Blogs;