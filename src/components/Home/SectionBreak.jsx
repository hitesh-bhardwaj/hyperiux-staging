"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import SplitText from "gsap/dist/SplitText";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, ScrollTrigger);

const SectionBreak = () => {
  const sectionRef = useRef(null);
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "5% top",
        end: "bottom bottom",
        scrub: true,
        // markers:true
      },
    });
    tl.to(".break-clip", {
      clipPath: "inset(0% 0% 0% 0%)",
      stagger: 0.1,
      scale: 1,
    });
    tl.to(
      ".break-scale",
      {
        translateY: "0%",
        stagger: 0.1,
      },
      "<",
    );
    tl.to(".break-scale", {
      delay: -0.7,
      stagger: 0.1,
      color: "#111111",
    });

    tl.to(".break-second-container", {
      clipPath: "inset(0% 0% 0% 0%)",
      delay: -0.4,
      duration: 0.7,
    }).to(
      ".break-second-text",
      {
        opacity: 1,

        stagger: {
          from: "end",
          amount: 0.25,
        },
      },
      "<",
    );
    const al = gsap.timeline({
      scrollTrigger: {
        trigger: "#sectionbreak",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
      defaults: {
        ease: "none",
      },
    });
    gsap.set(".break-second", {
      yPercent: 20,
    });
    al.to(".section-break-text", {
      yPercent: -20,
    });
    al.to(".break-second", {
      yPercent: 0,
    },"<");
  }, []);
  return (
    <section
      ref={sectionRef}
      id="sectionbreak"
      className="w-screen h-[300vh] bg-white text-[#111111]"
    >
      <div className="w-screen h-screen sticky top-0 flex items-center px-[5vw] uppercase font-medium font-aeonik mt-[-30vw] text-[7vw]">
        <div className=" section-break-text w-[70%] mx-auto  leading-[1.1] flex flex-wrap items-center justify-center gap-x-[2vw] gap-y-[1vw]">
          <div
            style={{ clipPath: "inset(0% 0% 100% 0%)" }}
            className="break-clip scale-[1.2] overflow-visible"
          >
            <div className="break-scale  translate-y-[30%] text-[#ff5f00]">
              We
            </div>
          </div>
          <div
            style={{ clipPath: "inset(0% 0% 100% 0%)" }}
            className="break-clip scale-[1.2]"
          >
            <div className="break-scale  translate-y-[30%] text-[#ff5f00]">
              Don't
            </div>
          </div>
          <div
            style={{ clipPath: "inset(0% 0% 100% 0%)" }}
            className="break-clip scale-[1.2]"
          >
            <div className="break-scale  translate-y-[30%] text-[#ff5f00]">
              Just
            </div>
          </div>
          <div
            style={{ clipPath: "inset(0% 0% 100% 0%)" }}
            className="break-clip scale-[1.2]"
          >
            <div className="break-scale  translate-y-[30%] text-[#ff5f00]">
              Make
            </div>
          </div>
          <div
            style={{ clipPath: "inset(0% 0% 100% 0%)" }}
            className="break-clip scale-[1.2]"
          >
            <div className="break-scale  translate-y-[30%] text-[#ff5f00]">
              Things
            </div>
          </div>
          <div
            style={{ clipPath: "inset(0% 0% 100% 0%)" }}
            className="break-clip scale-[1.2]"
          >
            <div className="break-scale  translate-y-[30%] text-[#ff5f00]">
              Look
            </div>
          </div>
          <div
            style={{ clipPath: "inset(0% 0% 100% 0%)" }}
            className="break-clip scale-[1.2]"
          >
            <div className="break-scale  translate-y-[30%] text-[#ff5f00]">
              Good
            </div>
          </div>
        </div>
        <div
          className="w-screen h-screen absolute inset-0 bg-[#111111] flex items-center justify-center break-second-container"
          style={{ clipPath: "inset(100% 0% 0% 0%)" }}
        >
          <div className="flex flex-col items-center text-white break-second ">
            <div className="leading-[1] break-second-text opacity-10">we craft</div>
            <div className="leading-[1] break-second-text opacity-10">
              experiences that
            </div>
            <div className="text-[#ff5f00] leading-[1] break-second-text opacity-10">
              Create impact
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionBreak;
