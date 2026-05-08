"use client";

import React, { useRef, useState, useLayoutEffect, useEffect } from "react";
import { Facebook, Instagram, Linkedin, Twitter } from "../Buttons";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import { EffectCube, Autoplay } from "swiper/modules";

import gsap from "gsap";
import SplitText from "gsap/SplitText";
import Copy from "../Animations/Copy";
import HeadAnim from "../Animations/HeadAnim";
// import { vLineAnim } from "../gsapAnimations";
gsap.registerPlugin(SplitText);

const teamMembers = [
  {
    name: "Bhaskar Varshney",
    role: "CEO, Enigma",
    profileImg: "/assets/images/bhaskar-sir.png",
    mainImg: "/assets/images/aboutpage/bhaskar-sir.png",
  },
  { name: "Jane Doe", role: "CTO, Enigma", profileImg: "/assets/images/homepage/testimonial/testimonial-image-1.png", mainImg: "/assets/images/aboutpage/bhaskar-sir.png" },
  { name: "John Smith", role: "Lead Designer", profileImg: "/assets/images/homepage/testimonial/testimonial-image-2.png", mainImg: "/assets/images/aboutpage/bhaskar-sir.png" },
  { name: "Emily Davis", role: "Marketing Head", profileImg: "/assets/images/homepage/testimonial/testimonial-image-3.png", mainImg: "/assets/images/aboutpage/bhaskar-sir.png" },
  { name: "Michael Chen", role: "VP of Engineering", profileImg: "/assets/images/homepage/testimonial/testimonial-image-4.png", mainImg: "/assets/images/aboutpage/bhaskar-sir.png" },
];

const slideTexts = [
  `Bhaskar leads Enigma's vision and strategy. He loves elegant systems,
   strong coffee, and shipping ambitious products on ruthless timelines.Bhaskar leads Enigma's vision and strategy. He loves elegant systems,
   strong coffee, and shipping ambitious products on ruthless timelines.Bhaskar leads Enigma's vision and strategy. He loves elegant systems,
   strong coffee, and shipping ambitious products on ruthless timelines.`,
  `Jane architects our platform. She's obsessed with performance budgets,
   DX, and CI that never flakes.Bhaskar leads Enigma's vision and strategy. He loves elegant systems,
   strong coffee, and shipping ambitious products on ruthless timelines.Bhaskar leads Enigma's vision and strategy. He loves elegant systems,
   strong coffee, and shipping ambitious products on ruthless timelines.`,
  `John turns chaos into clarity. Grids, type, and micro-interactions are his
   love language.Bhaskar leads Enigma's vision and strategy. He loves elegant systems,
   strong coffee, and shipping ambitious products on ruthless timelines.Bhaskar leads Enigma's vision and strategy. He loves elegant systems,
   strong coffee, and shipping ambitious products on ruthless timelines.`,
  `Emily tells our story to the world. Campaigns, community, and conversion—
   and she still answers support tickets when it matters.Bhaskar leads Enigma's vision and strategy. He loves elegant systems,
   strong coffee, and shipping ambitious products on ruthless timelines.Bhaskar leads Enigma's vision and strategy. He loves elegant systems,
   strong coffee, and shipping ambitious products on ruthless timelines.`,
  `Michael scales our engineering excellence. Clean code, mentorship, and 
   building the systems that let our team move fast without breaking things.Bhaskar leads Enigma's vision and strategy. He loves elegant systems,
   strong coffee, and shipping ambitious products on ruthless timelines.Bhaskar leads Enigma's vision and strategy. He loves elegant systems,
   strong coffee, and shipping ambitious products on ruthless timelines.`,
];

const Teams = () => {
  // vLineAnim()
  const sectionRef = useRef(null);
  const swiperRef = useRef(null);

  // IMPORTANT: separate refs for desktop & mobile copies
  const textDesktopRef = useRef(null);
  const textMobileRef = useRef(null);

  const splitInstanceRef = useRef(null);
  const tlRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isSmall, setIsSmall] = useState(false); // track breakpoint (matches Tailwind 'sm')

  // keep CSS var for progress
  const setProgress = (value) => {
    if (sectionRef.current) {
      sectionRef.current.style.setProperty("--progress", value);
    }
  };

  const getCircularOrder = (arr, centerIndex) => {
    const total = arr.length;
    const order = [];
    for (let offset = -2; offset <= 2; offset++) {
      const idx = (centerIndex + offset + total) % total;
      order.push(arr[idx]);
    }
    return order;
  };

  const handleNext = () => swiperRef.current?.slideNext();
  const handlePrev = () => swiperRef.current?.slidePrev();

  // Track viewport size to decide which text node is visible
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)"); // Tailwind 'sm' breakpoint
    const update = () => setIsSmall(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  // Helper: get the currently visible <p> for SplitText
  const getActiveTextElement = () => {
    const mobileEl = textMobileRef.current;
    const desktopEl = textDesktopRef.current;

    // Prefer the element that is actually visible (display not none)
    if (isSmall && mobileEl && getComputedStyle(mobileEl).display !== "none") {
      return mobileEl;
    }
    if (!isSmall && desktopEl && getComputedStyle(desktopEl).display !== "none") {
      return desktopEl;
    }
    // Fallbacks
    return (isSmall ? mobileEl : desktopEl) || desktopEl || mobileEl || null;
  };

  // Animate the left text whenever activeIndex OR viewport size changes
  useLayoutEffect(() => {
    const el = getActiveTextElement();
    if (!el) return;

    // Kill previous timeline and split
    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }
    if (splitInstanceRef.current) {
      splitInstanceRef.current.revert();
      splitInstanceRef.current = null;
    }

    // Create fresh SplitText
    // Note: remove 'mask:"lines"' if your GSAP version < 3.12
    const split = new SplitText(el, { type: "lines",mask:"lines" });
    splitInstanceRef.current = split;

    // Animate lines
    const tl = gsap.timeline();
    tl.set(split.lines, { yPercent: 110, opacity: 0 });
    tl.to(split.lines, {
      yPercent: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power3.out",
      stagger: 0.06,
      clearProps: "transform,opacity",
    });

    tlRef.current = tl;

    // Cleanup when unmounting or changing target
    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }
      if (splitInstanceRef.current) {
        splitInstanceRef.current.revert();
        splitInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, isSmall]);

  return (
    <section
      id="team"
      data-cursor-color="#ffffff"
      ref={sectionRef}
      className="bg-[#060709] w-screen h-fit relative max-sm:h[150vh] light overflow-hidden"
    >
      <div className="w-full h-full px-[4vw] py-[5vw] flex justify-between max-sm:flex-col max-sm:px-[7vw] max-sm:py-[15%] max-sm:gap-[5vw]">
        {/* Left Section */}
        <div className="w-[70%] flex flex-col gap-[3vw]">
          <div className="w-full flex justify-start">
            <div className="w-[80%] max-sm:w-full">
              <HeadAnim>
                <h2 className="text-[5.7vw] text-[#E1E1E1] font-aeonik max-sm:text-[11vw]">
                  The minds behind the magic!
                </h2>
              </HeadAnim>
            </div>
          </div>

          {/* Desktop text (visible on >= sm) */}
          <div className="w-full flex justify-end max-sm:hidden">
            <div className="w-[50%] flex items-start justify-end flex-col text-white space-y-[3vw]">
              <div>
                <p
                  key={`desk-${activeIndex}`}
                  ref={textDesktopRef}
                  className="slide-data leading-[1.5] will-change-transform"
                >
                  {slideTexts[activeIndex]}
                </p>
              </div>
              <div className="flex gap-[1vw] menu-socials">
                <Facebook menuSocial={true} className={"group-hover:invert"} />
                <Twitter menuSocial={true} className={"group-hover:invert"} />
                <Linkedin menuSocial={true} className={"group-hover:invert"} />
                <Instagram menuSocial={true} className={"group-hover:invert"} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Section (Swiper + mobile text) */}
        <div className="w-[25%] h-[80vh] ml-[3vw] mt-[3%] flex flex-col items-center justify-center max-sm:w-full max-sm:h-fit max-sm:ml-0 max-sm:gap-[10vw] max-sm:order-1">
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            effect={"cube"}
            grabCursor={true}
            cubeEffect={{
              shadow: true,
              slideShadows: true,
              shadowOffset: 20,
              shadowScale: 0.94,
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            }}
            loop={true}
            onAutoplayTimeLeft={(_, _time, progress) => {
              setProgress(`${(1 - progress) * 100}%`);
            }}
            onSlideChange={(swiper) => {
              const real = swiper.realIndex ?? swiper.activeIndex ?? 0;
              setActiveIndex(real);
              setProgress("0%");
            }}
            modules={[EffectCube, Autoplay]}
            className="mySwiper w-full"
          >
            {teamMembers.map((member, index) => (
              <SwiperSlide key={index}>
                <div
                  data-cursor-size="80px"
                  data-cursor-text="Drag"
                  data-cursor-color="#ffffff"
                  data-cursor-text-color="#1a1a1a"
                  className="w-[23vw] h-[68vh] overflow-hidden relative max-sm:w-full max-sm:h-[65vh]"
                >
                  <div className="absolute flex flex-col gap-[1vw] w-full items-center top-[5%] z-[2] max-sm:gap-[4vw]">
                    <div className="h-[3px] w-[90%] bg-white/30 rounded-full overflow-hidden flex">
                      <span
                        className="h-full bg-white inline-block"
                        style={{
                          width: "var(--progress, 0%)",
                          transition: "width 80ms linear",
                        }}
                      />
                    </div>
                    <div className="w-[90%] flex gap-[1vw] items-center max-sm:gap-[3vw]">
                      <div className="w-[3vw] h-[3vw] rounded-full overflow-hidden max-sm:w-[12vw] max-sm:h-[12vw]">
                        <Image
                          src={member.profileImg}
                          alt={member.name}
                          className="w-full h-full"
                          width={50}
                          height={50}
                        />
                      </div>
                      <div className="w-fit flex flex-col text-white">
                        <p className="text-[1.5vw] font-aeonik font-medium max-sm:text-[7vw]">
                          {member.name}
                        </p>
                        <p>{member.role}</p>
                      </div>
                    </div>
                  </div>
                  <Image
                    alt={member.name}
                    width={500}
                    height={900}
                    className="w-full h-full object-cover"
                    src={member.mainImg}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Mobile text (visible on < sm) */}
          <div className="w-full max-sm:flex justify-end hidden relative z-[20]">
            <div className="w-full flex items-start justify-end flex-col text-white space-y-[3vw] max-sm:space-y-[12vw]">
              <div>
                <p
                  key={`mob-${activeIndex}`}
                  ref={textMobileRef}
                  className="slide-data leading-[1.5] will-change-transform"
                >
                  {slideTexts[activeIndex]}
                </p>
              </div>
              <div className="flex gap-[1vw] menu-socials max-sm:gap-[2.5vw]">
                <Facebook menuSocial={true} className={"group-hover:invert"} />
                <Twitter menuSocial={true} className={"group-hover:invert"} />
                <Linkedin menuSocial={true} className={"group-hover:invert"} />
                <Instagram menuSocial={true} className={"group-hover:invert"} />
              </div>
            </div>
          </div>
        </div>

        <div className="w-[15%] flex justify-end items-center max-sm:w-full">
          <div className="w-fit flex flex-col gap-[0.7vw] items-center z-[5] max-sm:flex-row">
            <div
              className="w-[3vw] h-[3vw] mb-[1vw] rounded-full  p-[0.7vw] flex justify-center items-center cursor-pointer group transition-all duration-300 ease-in text-white hover:text-primary -rotate-90 max-sm:rotate-[-180deg] max-sm:w-[7vw] max-sm:h-[7vw]"
              onClick={handlePrev}
            >
              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.09961 20.6162L17.5391 12.1768L9.09961 3.7373" stroke="currentColor" strokeWidth="3.37578" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="flex flex-col items-center relative overflow-hidden max-sm:hidden">
              <div className="flex flex-col items-center transition-all duration-500  min-w-[5vw]">
                {getCircularOrder(teamMembers, activeIndex).map((member, positionIndex) => {
                  const isActive = positionIndex === 2;
                  const size = isActive ? 5 : 3;
                  return (
                    <div
                      key={member.name}
                      onClick={() => {
                        const realIndex = teamMembers.findIndex((m) => m.name === member.name);
                        setActiveIndex(realIndex);
                        swiperRef.current?.slideToLoop(realIndex);
                      }}
                      className="cursor-pointer transition-all duration-500 relative rounded-full overflow-hidden my-[0.5vw]"
                      style={{ width: `${size}vw`, height: `${size}vw`, opacity: isActive ? 1 : 0.5 }}
                    >
                      <Image src={member.profileImg} alt={member.name} width={50} height={50} className="w-full h-full object-cover rounded-full" />
                      <svg className="absolute top-0 left-0" width="100%" height="100%" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="17.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="transparent" />
                        <circle
                          cx="18"
                          cy="18"
                          r="17.5"
                          stroke="white"
                          strokeWidth="1"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 17.5}
                          strokeDashoffset={isActive ? 0 : 2 * Math.PI * 17.5}
                          style={{ transition: isActive ? "stroke-dashoffset 5s linear" : "none" }}
                        />
                      </svg>
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              className="w-[3vw] h-[3vw] mt-[1vw] rounded-full  p-[0.7vw] flex text-white justify-center items-center cursor-pointer group transition-all duration-300 ease-in hover:text-primary rotate-90 max-sm:rotate-[0deg] max-sm:w-[7vw] max-sm:h-[7vw] max-sm:mt-[-0.5vw]"
              onClick={handleNext}
            >
              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.09961 20.6162L17.5391 12.1768L9.09961 3.7373" stroke="currentColor" strokeWidth="3.37578" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

    
    </section>
  );
};

export default Teams;
