"use client";

import gsap from "gsap";
import React, { useEffect } from "react";
import { CustomEase } from "gsap/CustomEase";
gsap.registerPlugin(CustomEase);

function CutoutOverlayLayer({
  className = "",
  clipPath = "inset(0% 0% 0% 0%)",
}) {
  return (
    <div
      className={`clip-logo absolute inset-0 overflow-hidden bg-white ${className}`}
      style={{
        clipPath,
        "--logo-size": "20vw",
        WebkitMaskImage: `linear-gradient(#fff 0 0), url("/hyperiux-icon-black.svg")`,
        maskImage: `linear-gradient(#fff 0 0), url("/hyperiux-icon-black.svg")`,
        WebkitMaskRepeat: "no-repeat, no-repeat",
        maskRepeat: "no-repeat, no-repeat",
        WebkitMaskPosition: "0 0, center center",
        maskPosition: "0 0, center center",
        /*
          Important:
          We animate this variable instead of scaling the whole layer.
          The SVG mask gets recalculated at the new size instead of being
          bitmap-stretched by transform scale.
        */
        WebkitMaskSize: "100% 100%, auto var(--logo-size)",
        maskSize: "100% 100%, auto var(--logo-size)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        willChange: "mask-size, -webkit-mask-size",
      }}
    />
  );
}

export const Loader = () => {
  useEffect(() => {
    CustomEase.create("clipLogoEase", "1,0,1,.59");
    gsap.set(".gradient-overlay", {
      "--fade-height": "-40%",
      "--fade-softness": "35%",
      willChange: "mask-image, -webkit-mask-image",
    });

    gsap.set(".clip-logo", {
      "--logo-size": "20vw",
    });

    const cl = gsap.timeline();

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

    const tl = gsap.timeline();

    tl.to(
      ".gradient-overlay",
      {
        "--fade-height": "0%",
        duration: 0.8,
        delay: 0.5,
        ease: "power3.inOut",
      },
      0
    )
      .to(".gradient-overlay", {
        "--fade-height": "30%",
        duration: 2,
        ease: "power3.inOut",
      })
      .to(".gradient-overlay", {
        "--fade-height": "100%",
        duration: 1.8,
        ease: "power3.inOut",
      })

      /*
        Z/scale illusion without transform-scaling the mask layer.
        This grows the actual SVG mask size from the center.
      */
      .to(
        ".clip-logo",
        {
          "--logo-size": "1060vw",
          duration: 0.9,
          translateX:"50%",
          scale:250,
          ease: "expo.in",
        //  ease: CustomEase.create("custom", "M0,0 C0.355,0.039 0.653,0.04 0.811,0.188 1.003,0.368 0.978,0.743 1,1 "),
        //   ease: "power4.in",
        },
        "-=0.35"
      )
      .to(
        ".loader",
        {
          autoAlpha: 0,
          pointerEvents: "none",
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.25"
      );

    return () => {
      cl.kill();
      tl.kill();
    };
  }, []);

  return (
    <section className="loader fixed inset-0 z-[9999] h-screen w-screen overflow-hidden">
      <div className="flex h-screen w-screen items-center justify-center">
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

        </div>
      </div>
    </section>
  );
};