"use client";

import React, { useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import HeadAnim from "../Animations/HeadAnim";
import TestimonialSectionInterActive from "./TestimonialSectionInterActive";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const COLS = 20;
const ROWS = 12;
const TOTAL = COLS * ROWS;

function seededRandom(seed) {
  let value = seed;

  return function () {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function getLeftToRightRandomOrder(seed = 89) {
  const random = seededRandom(seed);

  return Array.from({ length: TOTAL }, (_, index) => {
    const row = Math.floor(index / COLS);
    const col = index % COLS;

    const leftToRightBias = col * 1.8;

    const randomNoise = random() * 10.5;

    const localClusterNoise =
      Math.sin(row * 2.17 + col * 1.31) * 2.5 +
      Math.cos(row * 1.73 - col * 2.41) * 2.5;

    const score = leftToRightBias + randomNoise + localClusterNoise;

    return {
      index,
      row,
      col,
      score,
    };
  }).sort((a, b) => a.score - b.score);
}

const Testimonial = () => {
  const sectionRef = useRef(null);
  const maskRectsRef = useRef([]);

  const squareOrder = useMemo(() => getLeftToRightRandomOrder(), []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const orderedMaskRects = squareOrder
        .map((item) => maskRectsRef.current[item.index])
        .filter(Boolean);

      if (!orderedMaskRects.length) return;

      gsap.set(orderedMaskRects, {
        opacity: 1,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          id: "testimonialSquareMaskReveal",
          trigger: section,
          start: "top 30%",
          end: "95% bottom",
          scrub: true,
        //   markers: true,
        },
      });

      tl.to(orderedMaskRects, {
        opacity: 0,
        duration: 0.2,
        stagger: {
          each: 0.008,
        },
        ease: "none",
      });

      return () => {
        ScrollTrigger.getAll().forEach((st) => {
          if (st?.vars?.id === "testimonialSquareMaskReveal") {
            st.kill();
          }
        });
      };
    },
    {
      scope: sectionRef,
      dependencies: [squareOrder],
    }
  );

  return (
    <section
      ref={sectionRef}
      className="w-full h-[240vh] relative z-30 "
      id="testimonial"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden mt-[-20%]">
        {/* Behind section */}
        <div className="absolute inset-0 z-10 h-full w-full">
          <TestimonialSectionInterActive />
        </div>

        {/* SVG mask */}
        <svg
          className="pointer-events-none absolute h-0 w-0"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <defs>
            <mask
              id="testimonial-grid-mask"
              maskUnits="objectBoundingBox"
              maskContentUnits="objectBoundingBox"
            >
              <rect x="0" y="0" width="1" height="1" fill="black" />

              {Array.from({ length: TOTAL }).map((_, index) => {
                const row = Math.floor(index / COLS);
                const col = index % COLS;

                return (
                  <rect
                    key={index}
                    ref={(el) => {
                      maskRectsRef.current[index] = el;
                    }}
                    className="testimonial-mask-cell"
                    x={col / COLS}
                    y={row / ROWS}
                    width={1 / COLS + 0.001}
                    height={1 / ROWS + 0.001}
                    fill="white"
                    opacity="1"
                  />
                );
              })}
            </mask>
          </defs>
        </svg>

        {/* First absolute section being removed by mask */}
        <div
          className="absolute inset-0 z-20 h-full w-full bg-[#fefefe]  px-[5vw] flex items-center pointer-events-none"
          style={{
            WebkitMaskImage: "url(#testimonial-grid-mask)",
            maskImage: "url(#testimonial-grid-mask)",
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
          }}
        >
          <HeadAnim>
            <h2 className="w-[70%]  leading-[1.2] text-[#ff6b00] relative z-30 text-[8vw] max-sm:text-[12vw] max-sm:mt-[-10vh]">
              Stories that stick, results that show.
            </h2>
          </HeadAnim>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;