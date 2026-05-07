"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import FooterInteractiveCubeCanvas from "./FooterInteractiveCubeCanvas";
import InteractiveOrangeGradientCanvas from "./InteractiveOrangeGradientCanvas";

gsap.registerPlugin(ScrollTrigger);

function FooterAnimatedLink({ href = "#", children, className = "" }) {
  const linkRef = useRef(null);
  const text = String(children);

  const ease = "power2.inOut";

  useEffect(() => {
    const link = linkRef.current;
    if (!link) return;

    const chars = link.querySelectorAll(".footer-link-char");
    const shadows = link.querySelectorAll(".footer-link-shadow");
    const line = link.querySelector(".footer-link-line");

    gsap.set(chars, { yPercent: 0 });
    gsap.set(shadows, { yPercent: 110 });
    gsap.set(line, {
      scaleX: 0,
      transformOrigin: "left center",
    });
  }, []);

  const handleEnter = () => {
    const link = linkRef.current;
    if (!link) return;

    const chars = link.querySelectorAll(".footer-link-char");
    const shadows = link.querySelectorAll(".footer-link-shadow");
    const line = link.querySelector(".footer-link-line");

    gsap.killTweensOf([chars, shadows, line]);

    gsap.to(chars, {
      yPercent: -110,
      duration: 0.5,
      stagger: 0.012,
      ease,
      overwrite: true,
    });

    gsap.to(shadows, {
      yPercent: 0,
      duration: 0.5,
      stagger: 0.012,
      ease,
      overwrite: true,
    });

    gsap.set(line, {
      transformOrigin: "left center",
    });

    gsap.to(line, {
      scaleX: 1,
      duration: 0.55,
      ease,
      overwrite: true,
    });
  };

  const handleLeave = () => {
    const link = linkRef.current;
    if (!link) return;

    const chars = link.querySelectorAll(".footer-link-char");
    const shadows = link.querySelectorAll(".footer-link-shadow");
    const line = link.querySelector(".footer-link-line");

    gsap.killTweensOf([chars, shadows, line]);

    gsap.to(chars, {
      yPercent: 0,
      duration: 0.5,
      stagger: 0.012,
      ease,
      overwrite: true,
    });

    gsap.to(shadows, {
      yPercent: 110,
      duration: 0.5,
      stagger: 0.012,
      ease,
      overwrite: true,
    });

    gsap.set(line, {
      transformOrigin: "right center",
    });

    gsap.to(line, {
      scaleX: 0,
      duration: 0.55,
      ease,
      overwrite: true,
    });
  };

  return (
    <Link
      ref={linkRef}
      href={href}
      className={`relative block w-fit overflow-hidden text-[1.25vw] leading-[1.15] text-[#111111] ${className}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <span className="relative block overflow-hidden pb-[0.22vw]">
        <span className="flex">
          {text.split("").map((char, index) => (
            <span
              key={`char-${char}-${index}`}
              className="footer-link-char inline-block whitespace-pre"
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>

        <span className="absolute left-0 top-0 flex">
          {text.split("").map((char, index) => (
            <span
              key={`shadow-${char}-${index}`}
              className="footer-link-shadow inline-block whitespace-pre"
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
      </span>

      <span className="footer-link-line absolute bottom-0 left-0 h-px w-full scale-x-0 bg-[#111111]" />
    </Link>
  );
}

function FooterUnderlineLink({ href = "#", children, className = "" }) {
  const linkRef = useRef(null);
  const lineRef = useRef(null);

  const ease = "power2.inOut";

  const handleEnter = () => {
    gsap.killTweensOf(lineRef.current);

    gsap.set(lineRef.current, {
      transformOrigin: "left center",
    });

    gsap.to(lineRef.current, {
      scaleX: 1,
      duration: 0.45,
      ease,
    });
  };

  const handleLeave = () => {
    gsap.killTweensOf(lineRef.current);

    gsap.set(lineRef.current, {
      transformOrigin: "right center",
    });

    gsap.to(lineRef.current, {
      scaleX: 0,
      duration: 0.45,
      ease,
    });
  };

  return (
    <Link
      ref={linkRef}
      href={href}
      className={`relative block w-fit text-[1.25vw] leading-[1.2] text-[#111111] ${className}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <span>{children}</span>
      <span
        ref={lineRef}
        className="absolute bottom-[-0.18vw] left-0 h-px w-full scale-x-0 bg-[#111111]"
      />
    </Link>
  );
}

function DiscoverShimmer({ children = "Discover" }) {
  return <span className="discover-shimmer-text">{children}</span>;
}

export const NewFooterBottom = () => {
  const container = useRef(null);
  const bottomFooterRef = useRef(null);
  const [progress, setProgress] = useState(0);

  return (
    <>
      <style jsx global>{`
        .discover-shimmer-text {
          display: inline-block;
          background: linear-gradient(
            90deg,
            #ff5f00 0%,
            #ff5f00bf 45%,
            #ffffff 60%,
            #ff5f00bf 75%,
            #ff5f00 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;

          animation: discoverShimmerMove 6s linear infinite;
        }

        @keyframes discoverShimmerMove {
          0% {
            background-position: 200% center;
          }

          50% {
            background-position: 100% center;
          }

          100% {
            background-position: 0% center;
          }
        }
      `}</style>

      <div
        ref={container}
        className="w-screen h-[53vw] z-[1] relative max-sm:h-fit"
        id="footer-bottom"
      >
        <div className="relative overflow-hidden w-screen h-full bg-white bottom-0 text-[#111111] flex flex-col px-[5vw] pt-[5vw] pb-[2vw] max-sm:h-fit max-sm:py-[10%]">
          <div className="interactive-canvas absolute inset-0 top-0 z-[1] pointer-events-auto">
            <FooterInteractiveCubeCanvas
              cubeScale={0.032}
              glowRadius={450}
              glowPower={2.15}
              mouseLerp={0.08}
              glowLerp={0.025}
              idleFadeDelay={100}
              orangeBorderOpacity={0.58}
              arrowFillOpacity={1}
              arrowFillLerp={0.055}
              arrowBorderLerp={0.04}
              arrowRadialFadeRadius={380}
              arrowRadialFadePower={0.1}
            />
          </div>

          <div className="relative z-[2] flex flex-1 flex-col justify-between">
            <div className="flex w-full items-start justify-between">
              <h2 className="font-aeonik text-[5.2vw] leading-[0.95] tracking-[-0.04em] max-w-[55vw]">
                Let&apos;s Bring Your Ideas
                <br />
                To Life!
              </h2>

              <Link
                href="#"
                className="px-[2vw] w-fit py-[0.7vw] mt-[2vw] bg-[#111111] flex justify-center group items-center overflow-hidden gap-[1vw] text-white font-aeonik text-[1.45vw]"
                scroll={false}
              >
                <span className="w-[0.5vw] h-[0.5vw] bg-[#ff5f00] group-hover:scale-[20] group-hover:bg-[#ff5f00] group-hover:duration-[0.3s] duration-[0.3s] ease-out group-hover:translate-x-[2.5vw]" />
                <span className="relative inline-block z-[2] group-hover:text-white group-hover:translate-x-[-25%] duration-400 ease-out">
                  Say Hi
                </span>
              </Link>
            </div>

            <div className="w-full h-fit flex flex-col gap-[5vw]">
              <div className="w-full flex justify-between">
                <div className="flex flex-col gap-[4.3vw]">
                  <div className="flex flex-col gap-[1.2vw]">
                    <h3 className="font-aeonik text-[1.6vw] font-medium">
                      <DiscoverShimmer>Discover</DiscoverShimmer>
                    </h3>

                    <div className="flex flex-col gap-[0.8vw] font-aeonik">
                      <FooterAnimatedLink href="#">
                        The Vault
                      </FooterAnimatedLink>
                      <FooterAnimatedLink href="#">Labs</FooterAnimatedLink>
                    </div>
                  </div>

                  <div className="flex flex-col gap-[1.4vw]">
                    <h3 className="font-aeonik text-[1.6vw] font-medium">
                      Contact Us
                    </h3>

                    <div className="flex flex-col gap-[1vw] leading-[1.2] font-aeonik">
                      <FooterUnderlineLink href="mailto:hi@hyperiux.com">
                        hi@hyperiux.com
                      </FooterUnderlineLink>

                      <FooterUnderlineLink href="tel:+918745044555">
                        +91 8745044555
                      </FooterUnderlineLink>

                      <p className="max-w-[18vw] text-[1.25vw] leading-[1.2]">
                        Grandslam I-Thum, A-40, Sector- 62, Noida, Uttar
                        Pradesh (201309)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-[5vw]">
                  <div className="flex flex-col gap-[1.2vw]">
                    <h3 className="font-aeonik text-[1.6vw] font-medium">
                      Company
                    </h3>

                    <div className="flex flex-col gap-[0.75vw] font-aeonik">
                      <FooterAnimatedLink href="/about">
                        About
                      </FooterAnimatedLink>
                      <FooterAnimatedLink href="/work">Work</FooterAnimatedLink>
                      <FooterAnimatedLink href="/expertise">
                        Expertise
                      </FooterAnimatedLink>
                      <FooterAnimatedLink href="/careers">
                        Career
                      </FooterAnimatedLink>
                      <FooterAnimatedLink href="/resources">
                        Resources
                      </FooterAnimatedLink>
                      <FooterAnimatedLink href="/contact-us">
                        Contact us
                      </FooterAnimatedLink>
                    </div>
                  </div>

                  <div className="flex flex-col gap-[1.2vw]">
                    <h3 className="font-aeonik text-[1.6vw] font-medium">
                      Socials
                    </h3>

                    <div className="flex flex-col gap-[0.75vw] font-aeonik">
                      <FooterAnimatedLink href="#">Facebook</FooterAnimatedLink>
                      <FooterAnimatedLink href="#">Twitter</FooterAnimatedLink>
                      <FooterAnimatedLink href="#">Linkedin</FooterAnimatedLink>
                      <FooterAnimatedLink href="#">
                        Instagram
                      </FooterAnimatedLink>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none flex h-full items-end justify-center">
                <p className="font-aeonik text-[1.05vw] text-[#111111]">
                  Keep Scrolling
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={bottomFooterRef}
        className="w-screen h-[20vw] bg-[#010101] max-sm:h-[30vh] bottom-footer"
        style={{ clipPath: "rect(0px 100% 100% 0px)" }}
      >
        <div className="flex h-[20vw] justify-between items-center fixed bottom-0 w-full px-[5vw] max-sm:flex-col max-sm:pt-[10%] max-sm:pb-[5%] max-sm:h-[30vh]">
          <div className="flex flex-col">
            <div
              className="relative h-[10vw] w-[95vw] overflow-hidden"
              style={{
                WebkitMaskImage:
                  "url('/assets/icons/h.svg'), url('/assets/icons/y.svg'), url('/assets/icons/p.svg'), url('/assets/icons/e.svg'), url('/assets/icons/r.svg'), url('/assets/icons/i.svg'), url('/assets/icons/u.svg'), url('/assets/icons/x.svg')",
                maskImage:
                  "url('/assets/icons/h.svg'), url('/assets/icons/y.svg'), url('/assets/icons/p.svg'), url('/assets/icons/e.svg'), url('/assets/icons/r.svg'), url('/assets/icons/i.svg'), url('/assets/icons/u.svg'), url('/assets/icons/x.svg')",

                WebkitMaskRepeat:
                  "no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat",
                maskRepeat:
                  "no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat",

                WebkitMaskSize:
                  "10vw 10vw, 10vw 10vw, 10vw 10vw, 10vw 10vw, 10vw 10vw, 10vw 10vw, 10vw 10vw, 10vw 10vw",
                maskSize:
                  "10vw 10vw, 10vw 10vw, 10vw 10vw, 10vw 10vw, 10vw 10vw, 10vw 10vw, 10vw 10vw, 10vw 10vw",

                WebkitMaskPosition:
                  "0vw center, 12.5vw center, 25vw center, 37.5vw center, 50vw center, 59.5vw center, 69vw center, 82vw center",
                maskPosition:
                  "0vw center, 12.5vw center, 25vw center, 37.5vw center, 50vw center, 59.5vw center, 69vw center, 82vw center",
              }}
            >
              <InteractiveOrangeGradientCanvas
                speed={1}
                overlayOpacity={1}
                trailLerp={0.22}
                trailWidth={40}
                trailBlur={50}
                trailFade={0.035}
                interactionRef={bottomFooterRef}
                className="absolute inset-0"
              />

              <div className="absolute inset-0 pointer-events-none">
                {[
                  { src: "/assets/icons/h-outline.svg", left: "0vw" },
                  { src: "/assets/icons/y-outline.svg", left: "12.5vw" },
                  { src: "/assets/icons/p-outline.svg", left: "25vw" },
                  { src: "/assets/icons/e-outline.svg", left: "37.5vw" },
                  { src: "/assets/icons/r-outline.svg", left: "50vw" },
                  { src: "/assets/icons/i-outline.svg", left: "59.5vw" },
                  { src: "/assets/icons/u-outline.svg", left: "69vw" },
                  { src: "/assets/icons/x-outline.svg", left: "82vw" },
                ].map((item, index) => (
                  <img
                    key={index}
                    src={item.src}
                    alt=""
                    className="absolute top-1/2 -translate-y-1/2 w-[10vw] h-[10vw] select-none opacity-20"
                    style={{ left: item.left }}
                    draggable={false}
                  />
                ))}
              </div>
            </div>

            <p className="font-aeonik text-white pt-[2vw] ">
              © 2026 Hyperiux Immersion Labs. All rights reserved.
            </p>
          </div>

          <div className="flex flex-col w-[15vw] absolute right-[5vw] bottom-[3vw]">
            <div className="flex w-full gap-[1vw] relative justify-center items-center py-[0.5vw] bg-white text-[#111111]">
              <h3 className="text-[1.5vw] font-display">About Us</h3>

              <div
                className="w-full h-full absolute bg-[#ff5f00] flex justify-center items-center"
                style={{ clipPath: `inset(0% ${100 - progress}% 0% 0%)` }}
              >
                <h3 className="text-[1.5vw] font-display text-white">
                  About Us
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};