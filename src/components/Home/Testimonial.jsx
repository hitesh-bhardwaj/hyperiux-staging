"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import TestimonialSectionInterActive from "./TestimonialSectionInterActive";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const Testimonial = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const heading = headingRef.current;

      if (!section || !heading) return;

      const split = new SplitText(heading, {
        type: "chars",
        charsClass: "testimonial-heading-char",
        mask: "chars",
      });

      gsap.set(split.chars, {
        yPercent: 110,
        opacity: 1,
        willChange: "transform",
      });

      gsap.to(split.chars, {
        yPercent: 0,
        duration: 0.28,
        stagger: {
          each: 0.02,
          from: "start",
        },
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          end: "30% 70%",
          scrub: true,
        },
        ease: "power3.out",
      });

      return () => {
        split.revert();
      };
    },
    {
      scope: sectionRef,
    },
  );

  return (
    <section
      ref={sectionRef}
      className="w-full h-[220vh] relative z-30"
      id="testimonial"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden mt-[-7%]">
        <div className="absolute inset-0 z-40 h-full w-full">
          <TestimonialSectionInterActive />
        </div>

        <div className="absolute inset-0 z-20 h-full w-full bg-[#fefefe] px-[5vw] flex items-center pointer-events-none">
          <h2
            ref={headingRef}
            className="w-[70%] leading-[1.2] text-[#ff6b00] relative z-30 text-[8vw] max-sm:text-[12vw] max-sm:mt-[-10vh]"
          >
            Stories that stick, results that show.
          </h2>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
