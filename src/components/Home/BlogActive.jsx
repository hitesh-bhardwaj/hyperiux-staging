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
    slug: "#",
    image: "/assets/images/homepage/blogs/blog-img-2.jpg",
    category: "Design",
    publishedAt: "05.03.2026",
  },
  {
    title: "The New Rules of Conversion-Led Website Design",
    slug: "#",
    image: "/assets/images/homepage/blogs/blog-img-3.jpg",
    category: "Strategy",
   publishedAt: "05.03.2026",
  },
  {
    title: "How Motion Design Shapes Brand Memory",
    slug: "#",
    image: "/assets/images/homepage/blogs/blog-img-4.jpg",
    category: "Motion",
    publishedAt: "05.03.2026",
  },
  {
    title: "What Founders Get Wrong About Product Experience",
    slug: "#",
    image: "/assets/images/homepage/blogs/blog-img-5.jpg",
    category: "UX",
    publishedAt: "05.03.2026",
  },
  {
    title: "Building Websites That Sell Before They Speak",
    slug: "#",
    image: "/assets/images/homepage/blogs/blog-img-6.jpg",
    category: "Development",
    publishedAt: "05.03.2026",
  },
];

const BlogCard = ({ blog }) => {
  return (
    <Link
      href={blog.slug}
      className="w-full h-fit flex items-center cursor-pointer max-sm:h-[100vw]"
    >
      <div className="flex flex-col items-start justify-between gap-[1vw] w-full h-full max-sm:gap-[4vw]">
        <div className="w-full h-[32vw] relative overflow-hidden image-container rounded-[1.5vw] max-sm:h-[70vh] group max-sm:rounded-[4vw]">
          <div className="w-full h-full absolute top-0 left-0 px-[1.2vw] pt-[1.2vw] flex justify-between z-2 text-[0.9vw] max-sm:p-[4vw]">
            <div className="w-fit h-fit  px-[1.5vw] py-[0.7vw] bg-[#111111] rounded-full flex justify-center items-center z-2 text-white leading-[1] max-sm:px-[4.5vw] max-sm:py-[3vw] max-sm:text-[3.5vw]">
              {blog.category}
            </div>

            <div className="w-[2.2vw] h-[2.2vw]  text-white flex items-center justify-end rounded-full z-2 arrow-link relative overflow-hidden  duration-500  group-hover:bg-[#ff5f00] max-sm:bg-[#ff5f00] max-sm:h-[12vw] max-sm:w-[12vw]">

              <div className="w-[2.2vw] h-[2.2vw] p-[0.7vw] max-sm:h-[12vw] max-sm:w-[12vw] max-sm:p-[3.5vw]">
                <Arrow />
              </div>
            </div>
          </div>
<div className="relative w-full h-full overflow-hidden">
          <Image
            src={blog.image}
            width={700}
            height={500}
            loading="lazy"
            quality={100}
            alt={blog.title}
            className="object-cover w-full h-full object-top transition-all duration-500 ease-out group-hover:scale-[1.05]"
          />
          <span className="w-full h-full absolute top-0 left-0 bg-gradient-to-t from-black via-transparent to-white/0 z-[1]" />
          <span className="w-full h-full absolute top-0 left-0 bg-black/30 group-hover:opacity-0 transition-all duration-500 z-[1]" />
          </div>
          <div className="w-[95%] flex flex-col gap-[1vw] pl-[0.5vw] h-[20%] max-sm:gap-[3vw] absolute left-5 bottom-5 z-5 max-sm:bottom-10">
             <p className="opacity-75 text-16 max-sm:text-[3.5vw] text-white">
            {blog.publishedAt}
          </p>
          <p className="text-white font-aeonik leading-[1.2] text-[1.25vw]  max-w-[80%] max-sm:text-[3.8vw] max-sm:w-[95%]">
            {blog.title}
          </p>

        </div>
         

        </div>

        
      </div>
    </Link>
  );
};

const Blogs = ({ blogData = fallbackBlogs }) => {
  const swiperRef = useRef(null);
   const sliderRef = useRef(null);
    const progressRef = useRef(null);
  
    useEffect(() => {
    const progress = progressRef.current;
    if (!progress) return;
    const trackWidth = progress.parentElement.offsetWidth;
    const pillWidth = trackWidth / blogData.length;
    progress.style.width = `${pillWidth}px`;
  }, []);
  
   const handleScroll = () => {
    const slider = sliderRef.current;
    const progress = progressRef.current;
    if (!slider || !progress) return;
  
    const scrollLeft = slider.scrollLeft;
    const maxScroll = slider.scrollWidth - slider.clientWidth;
    const percentage = maxScroll > 0 ? scrollLeft / maxScroll : 0;
  
    // translate the pill across the track (track width - pill width)
    const trackWidth = progress.parentElement.offsetWidth;
    const pillWidth = trackWidth / blogData.length;
    progress.style.width = `${pillWidth}px`;
    progress.style.transform = `translateX(${percentage * (trackWidth - pillWidth)}px)`;
  };
  useEffect(() => {
    gsap.to(".blog-swiper", {
      translateX: "0%",
      opacity: 1,
      ease: "power2.out",
      duration: 1.4,
      scrollTrigger: {
        trigger: "#blog-horizontal",
        start: "top 50%",
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
              <h2 className="text-[5.2vw] max-sm:text-[11vw]">
                Ideas in Motion
              </h2>
            </HeadAnim>
            <div className="fadeup max-sm:hidden">
              <LinkButton
                text={"View All"}
                href={"#"}
                hover={"text-[#111111] group-hover:stroke-white"}
                invert={false}
                className="text-[1.35vw] "
              />
            </div>
          </div>

        </div>

        <div className="w-screen h-fit mt-[5vw] max-sm:hidden">
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
            slidesPerView={3.2}
            spaceBetween={20}
            speed={500}
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 40,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3.5,
                spaceBetween: 30,
              },
            }}
            className="w-full px-[5vw]! max-sm:px-[7vw]! blog-swiper translate-x-[40%] opacity-0"
          >
            {blogData.map((blog, index) => (
              <SwiperSlide key={`${blog.title}-${index}`}>
                <BlogCard blog={blog} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="hidden max-sm:block w-full max-sm:mt-[7vw]">
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          className="flex gap-[6vw] overflow-x-auto px-[5vw] snap-x snap-mandatory pb-[4vw] scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {blogData.map((blog, index) => (
  <div key={index} className="min-w-[86vw] snap-center">
    <BlogCard blog={blog} />
  </div>
))}
        </div>

        {/* Progress bar */}
<div className="w-[90%] mx-auto mt-[4vw] h-2 bg-white rounded-full overflow-hidden relative">
  <div
    ref={progressRef}
    className="h-full bg-[#FF5F00] rounded-full absolute left-0 top-0"
    style={{ width: "0%", transform: "translateX(0px)" }}
  />
</div>
      </div>
         <div className="fadeup hidden w-full max-sm:flex items-center justify-center mt-10">
              <LinkButton
                text={"View All"}
                href={"#"}
                hover={"text-[#111111] group-hover:stroke-white"}
                invert={false}
                className="text-[1.35vw] "
              />
            </div>
      </div>
    </section>
  );
};

export default Blogs;