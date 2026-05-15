"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const ComingSoonAbout = () => {
  const sectionRef = useRef(null);
  const paragraphRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const paragraph = paragraphRef.current;

    if (!section || !paragraph) return;

    let split;

    const ctx = gsap.context(() => {
      split = new SplitText(paragraph, {
        type: "lines",
        mask: "lines",
        linesClass: "about-para-line",
      });

      gsap.set(split.lines, {
        yPercent: 110,
        autoAlpha: 0,
      });

      gsap.set(".about-small-reveal", {
        yPercent: 80,
        autoAlpha: 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 50%",
          end: "top 35%",
          toggleActions: "play none none reverse",
          once: false,
          // markers: true,
        },
      });

      tl.to(".about-small-reveal", {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.9,
        stagger: 0.08,
        ease: "power4.out",
      }).to(
        split.lines,
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 1.1,
          stagger: 0.09,
          ease: "power4.out",
        },
        "-=0.8"
      );
    }, section);

    ScrollTrigger.refresh();

    return () => {
      split?.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative inset-0 z-[200] flex flex-col justify-between h-auto gap-[10vw] w-screen overflow-hidden px-[7vw] pt-[9vw] pb-[2vw] max-sm:pb-[15vw] text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_42%,rgba(255,255,255,0.26)_0%,rgba(255,255,255,0.14)_18%,rgba(255,255,255,0.06)_35%,rgba(0,0,0,0)_58%),radial-gradient(circle_at_12%_92%,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.07)_20%,rgba(0,0,0,0)_48%)]" />

      <div className="relative flex h-full w-full flex-col justify-between">
        <div>
          <div className="overflow-hidden">
            <p className="about-small-reveal font-aeonik text-[1.9vw] leading-[1.1] max-md:text-[3vw] max-sm:text-[5vw]">
              About <span className="text-[#ff5f00]">Hyperiux</span>
            </p>
          </div>

          <div className=" max-w-[82vw] max-md:mt-[5vw] max-md:pl-0">
            <p
              ref={paragraphRef}
              className="font-aeonik text-[2.45vw] font-normal leading-[1.55] tracking-[-0.025em] text-white max-md:text-[4.2vw] max-sm:text-[6vw]"
            >
              <span className="w-[20vw] inline-block max-md:hidden"/>We unravel complex design challenges through meticulous user
              research, expert analysis, prototyping, and collaborative design
              with users and stakeholders. Harnessing the power of cutting edge
              tools and our proprietary approach we craft delightful and
              intuitive experiences.
            </p>
          </div>

          <div className="mt-[5vw] flex flex-col gap-[2.2vw] max-md:mt-[10vw] max-md:gap-[5vw]">
            

          </div>
        </div>

        
      </div>
      <div className="overflow-hidden w-full flex justify-between max-md:flex-col-reverse max-md:gap-[7vw] max-md:items-center">

          <p className="about-small-reveal font-aeonik text-[1vw] leading-[1.2] text-white/85 max-md:text-[1.8vw] max-sm:text-[4vw]">
            © 2026 Hyperiux Immersion Labs.
          </p>

            <div className="flex gap-[2vw] overflow-hidden font-aeonik text-[1.15vw] leading-[1.25] text-white/90 max-md:text-[2.3vw] max-sm:text-[4vw] max-md:flex-col">
              <a  target="_blank"  href="mailto:hi@hyperiux.com" className="about-small-reveal cursor-pointer">hi@hyperiux.com</a>
              <a target="_blank" href="tel:+91 8745044555" className="about-small-reveal cursor-pointer">+91 8745044555</a>
            </div>
        </div>
    </section>
  );
};

export default ComingSoonAbout;