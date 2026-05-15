"use client";

import gsap from "gsap";
import React, { useEffect } from "react";

function CutoutOverlayLayer({
  className = "",
  clipPath = "inset(0% 0% 0% 0%)",
}) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden bg-white clip-logo ${className}`}
      style={{
        clipPath,

        WebkitMaskImage: `linear-gradient(#fff 0 0), url("/hyperiux-icon-black.svg")`,
        maskImage: `linear-gradient(#fff 0 0), url("/hyperiux-icon-black.svg")`,

        WebkitMaskRepeat: "no-repeat, no-repeat",
        maskRepeat: "no-repeat, no-repeat",

        WebkitMaskPosition: "0 0, center center",
        maskPosition: "0 0, center center",

        WebkitMaskSize: "100% 100%, auto 20vw",
        maskSize: "100% 100%, auto 20vw",

        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
      }}
    />
  );
}

export const Loader = () => {
  useEffect(() => {
    gsap.set(".gradient-overlay", {
      "--fade-height": "-40%",
      "--fade-softness": "35%",
      willChange: "mask-image, -webkit-mask-image",
    });

    const cl = gsap.timeline();

    /*
      White overlay stays white.
      The transparent fade starts from bottom and rises upward
      as the counter loads.
    */
    

    cl.to(
      ".third-col",
      {
        translateY: "-20%",
        ease: "power3.inOut",
        duration: 0.8,
        delay: 0.6,
      },
      0
    ).to(".second-col", {
      translateY: "-30%",
      ease: "power3.inOut",
      delay: -0.9,
      duration: 1,
    });

    cl.to(".third-col", {
      translateY: "-80%",
      ease: "power3.inOut",
      duration: 1.5,
    }).to(".second-col", {
      translateY: "-60%",
      ease: "power3.inOut",
      delay: -1.4,
      duration: 1.5,
    });

    cl.to(".third-col", {
      translateY: "-90%",
      ease: "power3.inOut",
      duration: 1.5,
    })
      .to(".second-col", {
        translateY: "-90%",
        ease: "power3.inOut",
        delay: -1.4,
        duration: 1.5,
      })
      .to(".loader-num", {
        translateY: "-100%",
        stagger: 0.08,
        ease: "power3.in",
        delay: -0.1,
        duration: 0.5,
      });

      const tl = gsap.timeline()
      tl.to(
      ".gradient-overlay",
      {
        "--fade-height": "0%",
        duration: 0.8,
        delay:0.5,
        ease: "power3.inOut",
      },
      0
    )
      .to(
      ".gradient-overlay",
      {
        "--fade-height": "30%",
        duration: 2,
        ease: "power3.inOut",
      }
    )
    .to(
      ".gradient-overlay",
      {
        "--fade-height": "100%",
        duration: 1.2,
        ease: "power3.inOut",
      }
    )
    .to(".clip-logo",{
        z:100,
        duration: 2,
        ease: "power3.inOut",
    })

    return () => {
      cl.kill();
    };
  }, []);

  return (
    <section className="loader fixed inset-0 z-[9999] h-screen w-screen overflow-hidden">
      {/* White gradient mask reveal layer */}
      <div className="flex h-screen w-screen items-center justify-center ">
        <div
          className="gradient-overlay size-[20vw] bg-white"
          style={{
            WebkitMaskImage:
              "linear-gradient(to top, transparent 0%, transparent var(--fade-height), black calc(var(--fade-height) + var(--fade-softness)), black 100%)",
            maskImage:
              "linear-gradient(to top, transparent 0%, transparent var(--fade-height), black calc(var(--fade-height) + var(--fade-softness)), black 100%)",
          }}
        />
      </div>

      <div className="overlay absolute inset-0 z-[2] flex h-screen w-screen items-center justify-center">
        <CutoutOverlayLayer
          className="clip-overlay-top z-[3]"
          clipPath="inset(0% 0% 0% 0%)"
        />

        {/* Counter */}
        <div className="absolute right-[2%] top-[45%] z-[6] flex h-[7vw] overflow-hidden text-[7vw] font-medium text-[#111111]">
          <div className="loader-num second-col flex h-fit w-[4.5vw] flex-col">
            <span className="leading-[1]">0</span>
            <span className="leading-[1]">1</span>
            <span className="leading-[1]">2</span>
            <span className="leading-[1]">3</span>
            <span className="leading-[1]">4</span>
            <span className="leading-[1]">5</span>
            <span className="leading-[1]">6</span>
            <span className="leading-[1]">7</span>
            <span className="leading-[1]">8</span>
            <span className="leading-[1]">9</span>
          </div>

          <div className="loader-num third-col flex h-fit w-[4.5vw] flex-col">
            <span className="leading-[1]">0</span>
            <span className="leading-[1]">1</span>
            <span className="leading-[1]">2</span>
            <span className="leading-[1]">3</span>
            <span className="leading-[1]">4</span>
            <span className="leading-[1]">5</span>
            <span className="leading-[1]">6</span>
            <span className="leading-[1]">7</span>
            <span className="leading-[1]">8</span>
            <span className="leading-[1]">9</span>
          </div>

          <span className="loader-num leading-[1]">%</span>
        </div>
      </div>
    </section>
  );
};