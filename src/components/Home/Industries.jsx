"use client";

import React from "react";
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

const Industries = () => {
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
            // markers: true,
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
      className="w-screen h-fit bg-[#F2F2F2] py-[7%] flex flex-col gap-[5vw] pb-[10%] mt-[70vw] relative z-30 text-[#111111] px-[5vw]"
      id="industries"
    >
      <HeadAnim>
        <h2 className="text-[6.5vw] leading-[1.2] max-sm:text-[11vw] max-sm:w-[80%] mx-auto">
          Industries We Work in
        </h2>
      </HeadAnim>

      <div className="w-full flex flex-col items-end gap-[2vw]">
        {industriesData.map((item) => (
          <div
            key={item.number}
            className="w-[65%] bg-white radius h-[23vw] flex justify-between pr-[3vw] industry-card"
          >
            <div className="w-[25vw] h-full border-r border-black/10 flex justify-end items-end text-[#FF5F00] text-[18vw]">
              <p className="leading-[0.8] font-aeonik">{item.number}</p>
            </div>

            <div className="w-[33vw] flex flex-col gap-[2vw] justify-center">
              <h3 className="text-[#FF5F00] text-[2.5vw]">{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Industries;