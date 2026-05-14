"use client";

import React, { useRef, useEffect } from "react";
import HeadAnim from "../Animations/HeadAnim";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const industriesData = [
  {
    number: "01",
    title: "Electronics",
    description:
      "For BSFI-Fintech brands, we offer full-funnel digital marketing solutions that power growth at every stage. By merging data-driven strategies with innovative creative execution, we optimize customer journeys, boost product adoption, and secure long-term success in a rapidly evolving digital ecosystem.",
  },
  {
    number: "02",
    title: "Fintech",
    description:
      "For fintech brands, we build digital experiences that simplify complexity, increase trust, and improve user adoption across every customer touchpoint.",
  },
  {
    number: "03",
    title: "Education",
    description:
      "For fintech brands, we build digital experiences that simplify complexity, increase trust, and improve user adoption across every customer touchpoint.",
  },
  {
    number: "04",
    title: "Technology",
    description:
      "For fintech brands, we build digital experiences that simplify complexity, increase trust, and improve user adoption across every customer touchpoint.",
  },
  {
    number: "05",
    title: "Banking",
    description:
      "For fintech brands, we build digital experiences that simplify complexity, increase trust, and improve user adoption across every customer touchpoint.",
  },
];

const IndustriesCardMobile = ({ item, index, total }) => {
  return (
    <div className="min-w-[88vw] min-h-[58vh] bg-white rounded-3xl flex flex-col p-[8vw] gap-[10vw] snap-center">
      <div className="flex justify-end">
        <p className="text-[#FF5F00] text-60 leading-[0.8] font-aeonik">
          {item.number}
        </p>
      </div>

      <div className="flex flex-col gap-[8vw]">
        <h3 className="text-[#FF5F00] text-32">{item.title}</h3>
        <p className="text-16 leading-normal text-[#111111]">
          {item.description}
        </p>
      </div>
    </div>
  );
};

const Industries = () => {
  const sliderRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
  const progress = progressRef.current;
  if (!progress) return;
  const trackWidth = progress.parentElement.offsetWidth;
  const pillWidth = trackWidth / industriesData.length;
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
  const pillWidth = trackWidth / industriesData.length;
  progress.style.width = `${pillWidth}px`;
  progress.style.transform = `translateX(${percentage * (trackWidth - pillWidth)}px)`;
};

  useGSAP(() => {
    const cards = gsap.utils.toArray(".industry-card");

    cards.forEach((card) => {
      gsap.fromTo(
        card,
        {
          width: "65%",
        },
        {
          width: "100%",
          ease: "power1.out",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom 35%",
            scrub: true,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (cards.includes(st.trigger)) st.kill();
      });
    };
  }, []);

  return (
    <section
      className="w-screen h-fit bg-[#F2F2F2] py-[7%] flex flex-col gap-[5vw] max-sm:gap-[12vw] pb-[10%] relative z-30 text-[#111111] "
      id="industries"
    >
      <HeadAnim>
        <h2 className="text-[5.2vw] px-[5vw] leading-[1.2] max-sm:text-[11vw] max-sm:w-[80%] w-[50%]">
          Industries We Work in
        </h2>
      </HeadAnim>

      {/* Desktop layout — hidden on mobile */}
      <div className="w-full px-[5vw] flex flex-col items-end gap-[2vw] max-sm:hidden">
        {industriesData.map((item) => (
          <div
            key={item.number}
            className="w-[65%] bg-white radius h-[23vw] flex justify-between pr-[3vw] industry-card"
          >
            <div className="w-[25vw] h-full border-r border-black/10 flex justify-end items-end text-[#FF5F00] text-60">
              <p className="leading-[0.8] font-aeonik">{item.number}</p>
            </div>

            <div className="w-[33vw] flex flex-col gap-[2vw] justify-center">
              <h3 className="text-[#FF5F00] text-32">{item.title}</h3>
              <p className="text-16">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile slider — hidden on desktop */}
      <div className="hidden max-sm:block w-full">
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          className="flex gap-[6vw] overflow-x-auto px-[5vw] snap-x snap-mandatory pb-[4vw] scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {industriesData.map((item, index) => (
            <IndustriesCardMobile
              key={item.number}
              item={item}
              index={index}
              total={industriesData.length}
            />
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
    </section>
  );
};

export default Industries;