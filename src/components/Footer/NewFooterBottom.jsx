"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import FooterInteractiveCubeCanvas from "./FooterInteractiveCubeCanvas";
import InteractiveOrangeGradientCanvas from "./InteractiveOrangeGradientCanvas";
import { Facebook, FooterUnderlineLink, Instagram, Linkedin, MainButton, PrimaryButton, Twitter } from "../Buttons";

gsap.registerPlugin(ScrollTrigger);

function FooterAnimatedLink({ href = "#", children, className = "" }) {
  const linkRef = useRef(null);
  const text = String(children);

  const ease = "power2.inOut";
 const textShadowClass =
  "[text-shadow:0_1px_1px_rgba(17,17,17,0.9)]";

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
      color: "#ff5f00",
      stagger: 0.012,
      ease,
      overwrite: true,
    });

    gsap.to(shadows, {
      yPercent: 0,
      duration: 0.5,
      color: "#ff5f00",
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
      color: "#ffffff",
      duration: 0.5,
      stagger: 0.012,
      ease,
      overwrite: true,
    });

    gsap.to(shadows, {
      yPercent: 110,
      duration: 0.5,
      color: "#ffffff",
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
      className={`relative block w-fit overflow-hidden text-[1.25vw] leading-[1.15] text-white ${textShadowClass} ${className}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <span className="relative block overflow-hidden pb-[0.22vw]">
        <span className="flex">
          {text.split("").map((char, index) => (
            <span
              key={`char-${char}-${index}`}
              className={`footer-link-char inline-block whitespace-pre ${textShadowClass}`}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>

        <span className="absolute left-0 top-0 flex">
          {text.split("").map((char, index) => (
            <span
              key={`shadow-${char}-${index}`}
              className={`footer-link-shadow inline-block whitespace-pre ${textShadowClass}`}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
      </span>

      <span className="footer-link-line absolute bottom-0 left-0 h-px w-full scale-x-0 bg-[#ff5f00]" />
    </Link>
  );
}


export const NewFooterBottom = () => {
  const container = useRef(null);
  const bottomFooterRef = useRef(null);
  const [progress, setProgress] = useState(0);

  return (
    <>
      
      <div id="footer" className="relative bg-[#111111] ">
        <div
          ref={container}
          className="w-screen h-fit relative max-sm:h-fit "
          id="footer-bottom"
        >
          <div className="relative overflow-hidden w-screen h-full  text-white flex flex-col px-[5vw] pt-[5vw] pb-[2vw] max-sm:h-fit max-sm:py-[10%]">
            <div className="interactive-canvas absolute inset-0 top-0 z-1 pointer-events-auto">
              <FooterInteractiveCubeCanvas
               
              />
            </div>

            <div className="relative z-10 flex flex-1 flex-col gap-[12vw] justify-between">
              <div className="flex flex-col w-full items-start justify-between">
                <h2 className="font-aeonik text-[5.2vw] leading-[0.95] tracking-[-0.04em] w-[45%]">
                  Let&apos;s Bring Your Ideas
                  To Life!
                </h2>
                <div className="mt-7">
 <MainButton href={"#"} btnText={"Say Hi"} className={"bg-white! text-[#111111]!"}/>
 </div>
                {/* <Link
                  href="#"
                  className="px-[2vw] w-fit py-[0.7vw] mt-[2vw] bg-white flex justify-center group items-center overflow-hidden gap-[1vw] text-[#111111] font-aeonik text-[1.45vw]"
                  scroll={false}
                >
                  <span className="w-[0.5vw] h-[0.5vw] bg-[#ff5f00] group-hover:scale-[20] group-hover:bg-[#ff5f00] group-hover:duration-300 duration-300 ease-out group-hover:translate-x-[2.5vw]" />
                  <span className="relative inline-block z-2 group-hover:text-white group-hover:translate-x-[-25%] duration-400 ease-out">
                    Say Hi
                  </span>
                </Link> */}
              </div>

              <div className="w-full flex justify-between items-end">
                <div className="w-full h-fit flex flex-col gap-[5vw]">
                  <div className="w-full flex justify-between">
                    <div className="flex gap-[12vw] w-full">
                      <div className="flex flex-col gap-[1.4vw] w-[30%]">
                        <div className="flex flex-col gap-[1.5vw] leading-[1.2] font-aeonik">
                          <FooterUnderlineLink href="mailto:hi@hyperiux.com">
                            hi@hyperiux.com
                          </FooterUnderlineLink>

                          <FooterUnderlineLink href="tel:+918745044555">
                            +91 8745044555
                          </FooterUnderlineLink>

                          <p className="w-full text-[1.25vw] [text-shadow:0_1px_0_#111111]">
                            Grandslam I-Thum, A-40, Sector- 62, Noida, Uttar
                            Pradesh (201309)
                          </p>
                          <div className="flex gap-[1vw] menu-socials mt-[1vw]">
                            <Facebook
                            href="#"
                              className={"group-hover:-invert"}
                              fill={"group-hover:fill-primary"}
                            />
                            <Twitter
                            href="#"
                              className={"group-hover:-invert"}
                              fill={"group-hover:fill-primary"}
                            />
                            <Linkedin
                            href="#"
                              className={"group-hover:-invert"}
                              fill={"group-hover:fill-primary"}
                            />
                            <Instagram
                            href="#"
                              className={"group-hover:-invert"}
                              fill={"group-hover:fill-primary"}
                            />
                          </div>
                          <p className="font-aeonik text-white pt-[2vw] text-[0.9vw] ">
                            © 2026 Hyperiux Immersion Labs. All rights reserved.
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-[1.2vw]">
                        <h3 className="font-aeonik text-[1.6vw] font-medium">
                          Company
                        </h3>

                        <div className="flex flex-col gap-[0.75vw] font-aeonik">
                          <FooterAnimatedLink href="#">
                            About
                          </FooterAnimatedLink>
                          <FooterAnimatedLink href="#">Work</FooterAnimatedLink>
                          <FooterAnimatedLink href="#">
                            Expertise
                          </FooterAnimatedLink>
                          <FooterAnimatedLink href="#">
                            Career
                          </FooterAnimatedLink>
                          <FooterAnimatedLink href="#">
                            Resources
                          </FooterAnimatedLink>
                          <FooterAnimatedLink href="#">
                            Contact us
                          </FooterAnimatedLink>
                        </div>
                      </div>
                      <div className="flex flex-col gap-[1.2vw]">
                        <h3 className="font-aeonik text-[1.6vw] font-medium">
                         Discover
                        </h3>

                        <div className="flex flex-col gap-[0.8vw] font-aeonik">
                          <FooterAnimatedLink href="#">
                            The Vault
                          </FooterAnimatedLink>
                          <FooterAnimatedLink href="#">Labs</FooterAnimatedLink>
                        </div>
                      </div>
                    </div>
                  </div>


                </div>
                {/* <div className="pointer-events-none flex h-full justify-end">
                  <div className="flex flex-col w-[15vw]">
                    <div className="flex flex-col gap-[1vw]">
                      <p>Keep Scrolling To Learn More</p>
                      <h3 className="!text-[2.5vw] font-display">About Us</h3>
                      <div className="w-full h-[3px] bg-white/20 rounded-full flex">
                        <span
                          style={{
                            width: `${progress}%`,
                          }}
                          className="w-0 h-full inline-block bg-[#ff5f00] rounded-full progress-bar"
                        />
                      </div>
                    </div>
                  </div>
                </div> */}

              </div>

            </div>
            <div className="w-full h-[15vw] absolute bottom-0 z-2 pointer-events-none ml-[-5vw] bg-linear-to-t from-[#111111] to-[#11111100]"/>
            <div className="w-full h-[15vw] absolute top-0 z-2 pointer-events-none  ml-[-5vw] bg-linear-to-b from-[#111111] to-[#11111100]"/>
          </div>
        

        </div>

        <div
          ref={bottomFooterRef}
          className="w-screen h-[20vw]  max-sm:h-[30vh] bottom-footer relative z-[2]"
        // style={{ clipPath: "rect(0px 100% 100% 0px)" }}
        >
          <div className="flex h-[20vw] justify-between items-center w-full px-[5vw] max-sm:flex-col max-sm:pt-[10%] max-sm:pb-[5%] max-sm:h-[30vh]">
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
                    "0vw center, 12.5vw center, 25vw center, 37.5vw center, 50vw center, 59vw center, 68vw center, 80vw center",
                  maskPosition:
                    "0vw center, 12.5vw center, 25vw center, 37.5vw center, 50vw center, 59vw center, 68vw center, 80vw center",
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
                    { src: "/assets/icons/i-outline.svg", left: "59vw" },
                    { src: "/assets/icons/u-outline.svg", left: "68vw" },
                    { src: "/assets/icons/x-outline.svg", left: "80vw" },
                  ].map((item, index) => (
                    <img
                      key={index}
                      src={item.src}
                      alt=""
                      className="absolute top-1/2 -translate-y-1/2 w-[10vw] h-[10vw] select-none opacity-0"
                      style={{ left: item.left }}
                      draggable={false}
                    />
                  ))}
                </div>
              </div>


            </div>


          </div>
        </div>
        <div className="bg-linear-to-tr w-full h-full  from-white/10 via-[#11111100] to-white/0 absolute pointer-events-none inset-0 z-2"/>
        <div className="bg-linear-to-tr w-full top-0 right-0 h-full from-white/0 via-[#11111100] to-white/10 absolute pointer-events-none z-2"/>



      </div>
    </>
  );
};