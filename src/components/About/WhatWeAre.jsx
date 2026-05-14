"use client";
import React, { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import WhatWeAreActive from "./WhatWeAreActive";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger);
const WhatWeAre = () => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const whatWe = document.querySelector(".whatweHead");
      const wEl = new SplitText(whatWe, {
        type: "chars,lines",
        mask: "lines",
      });
      //  i have to do it here because the animation and trigger is different
      if (globalThis.innerWidth > 1024) {
        
        gsap.fromTo(
          wEl.chars,
          {
            yPercent: 120,
          },
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.04,
            ease: "power1.inOut",
            scrollTrigger: {
              trigger: "#what-we",
              start: "top 70%",
              end: "30% 70%",
              scrub: true,
              // markers:true,
            },
          }
        );
        gsap.to(".word-play",{
          opacity:1,
          scrollTrigger:{
            trigger:"#what-we",
            start:"25% top",
            end:"45% top",
            scrub:true,
            // markers:true
          }
        })
        
      } else {
        
        gsap.fromTo(
          wEl.chars,
          {
            yPercent: 120,
          },
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.08,
            ease: "power1.inOut",
            scrollTrigger: {
              trigger: "#what-we",
              start: "top bottom",
              end: "30% 90%",
              scrub: true,
              // markers:true,
            },
          }
        );
       
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      className="w-screen h-[200vh] mt-[-110vh] relative bg-[#fefefe] z-[2] max-sm:mt-0"
      id="what-we"
    >
      <div className="h-screen flex items-center gap-[4vw] sticky top-0 mt-[-100vh] max-sm:mt-0 px-[5vw] w-screen overflow-hidden">
        <div className="w-screen h-screen absolute top-0 left-0">
          <WhatWeAreActive />
        </div>
        <div className="relative w-[70%] testimonial-heading max-sm:w-full max-sm:mt-[-10vh]">
          <h2 className="text-[#ff5f00] relative z-[1] text-[8vw] whatweHead max-sm:text-[11vw]">
            What we are?
          </h2>
        </div>
      </div>
    </section>
  );
};

export default WhatWeAre;
