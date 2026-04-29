"use client";

import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
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

const styles = `
@media (min-width:542px){
  .awards-swiper .swiper-slide {
    width: 23vw !important;
    height: 20vw !important;
    transition: all 0.5s ease !important;
  }

  .swiper-slide.hovered {
    width: 40vw !important;
    height: 30vw !important;
    transition: all 0.5s ease !important;
  }
}
`;

const BlogCard = ({ img, text, date, index, activeIndex, category, link }) => {
  const isActive = activeIndex === index;

  return (
    <Link
      href={link}
      className="w-full h-full flex items-center cursor-pointer max-sm:items-start"
    >
      <div
        data-cursor-color="#1a1a1a"
        data-cursor-text="Drag"
        data-cursor-size="80px"
        className="flex flex-col items-start justify-between gap-[1vw] w-full h-full max-sm:h-fit max-sm:gap-[4vw]"
      >
        <div className="w-full h-full relative overflow-hidden image-container radius max-sm:h-[25vh] group">
          <div className="w-full h-full absolute top-0 left-0 px-[1.2vw] pt-[1.2vw] flex justify-between z-[2] text-[0.9vw] max-sm:p-[4vw]">
            <div className="w-fit h-fit px-[1.5vw] py-[0.7vw] bg-[#111111] rounded-full flex justify-center items-center z-[2] text-white leading-[1] max-sm:px-[4.5vw] max-sm:py-[3vw] max-sm:text-[3.5vw]">
              {category}
            </div>

            <div
              className={`w-[2.2vw] h-[2.2vw] bg-white text-[#111111] flex items-center justify-end rounded-full  z-[2] arrow-link relative overflow-hidden group-hover:w-[8vw] duration-500 max-sm:hidden ${
                isActive ? "opacity-100" : "opacity-0 !pointer-events-none"
              } transition-all duration-500 ease`}
            >
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
            className={`object-cover w-full h-full object-top transition-all duration-500 ease-out  group-hover:scale-[1] ${
              isActive ? "scale-[1.05]" : "scale-100"
            }`}
          />
        </div>

        <div className="w-[95%] flex flex-col pl-[1vw] gap-[1vw] h-[40%] max-sm:gap-[3vw]">
          <p
            className={`text-[#111111] font-light transition-all duration-500 ease max-sm:text-[4.5vw] ${
              isActive ? "text-[1.6vw]" : "text-[0.97vw]"
            }`}
          >
            {text}
          </p>

          <p
            className={`opacity-75 max-sm:text-[3.5vw] ${
              isActive ? "text-[1vw]" : "text-[0.8vw]"
            }`}
          >
            {date}
          </p>
        </div>
      </div>
    </Link>
  );
};

const Blogs = ({ blogData = fallbackBlogs }) => {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const normalizedBlogs = blogData.map((item) => ({
    title: item.title,
    image: item?.mainImage?.asset?.url || item.image,
    category: item?.categories?.[0]?.title || item.category || "Insights",
    date: item.publishedAt || "29 April 2026",
    link: item?.slug?.current
      ? `/blog/${item.slug.current}`
      : item.slug || item.link || "#",
  }));

  return (
    <section
      id="blogs"
      className="w-full h-[55vw] overflow-hidden relative z-[30] bg-[#fefefe] pt-[5%] max-sm:py-[15%] max-sm:h-fit max-sm:pb-[15%] text-[#111111]"
    >
      <style jsx>{styles}</style>

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

      <div className="w-[100vw] h-full flex items-center justify-center fadeup mt-[3vw] max-sm:mt-[8vw]">
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          speed={500}
          initialSlide={0}
          spaceBetween={30}
          loop
          slidesPerView="auto"
          breakpoints={{
            480: { slidesPerView: 1, spaceBetween: 15 },
            720: { slidesPerView: 1, spaceBetween: 15 },
            1024: { slidesPerView: 1, spaceBetween: 30 },
            1280: { slidesPerView: 4, spaceBetween: 30 },
          }}
          className="awards-swiper w-full h-full flex items-center justify-center !px-[5vw] max-sm:!px-[7vw]"
        >
          {normalizedBlogs.map((item, index) => (
            <SwiperSlide
              key={index}
              className={activeIndex === index ? "hovered" : ""}
            >
              <BlogCard
                img={item.image}
                text={item.title}
                date={item.date}
                index={index}
                activeIndex={activeIndex}
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