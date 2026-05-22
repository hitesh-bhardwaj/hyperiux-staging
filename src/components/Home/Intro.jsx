"use client";

import HyperiuxGlassHeroScene from "@/components/3D/HyperiuxGlassHeroScene";
import gsap from "gsap";
import React, { useEffect, useRef, useState } from "react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import SplitText from "gsap/dist/SplitText";
import { MainButton } from "../Buttons";
import Image from "next/image";
import CubeCanvasBackground from "../3D/CubeCanvasBackground";
import FloatingBlocks from "../3D/FloatingBlocks";

gsap.registerPlugin(ScrollTrigger, SplitText);


function seededRandom(seed) {
  let value = seed;

  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

// Bionic/parsing content for About section
const content = [
  [
    ["W", "e"],
    ["un", "ravel"],
    ["com", "plex"],
    ["de", "sign"],
    ["chal", "lenges"],
    ["thro", "ugh"],
    ["me", "ticulous"],
    ["us", "er"],
    ["re", "search,"],
  ],
  [
    ["ex", "pert"],
    ["a", "nalysis,"],
    ["pro", "totyping,"],
    ["a", "nd"],
    ["col", "laborative"],
    ["de", "sign"],
    ["wi", "th"],
    ["us", "ers"],
    ["a", "nd"],
    ["stake", "holders."],
    ["Har", "nessing"],
    ["the", ""],
    ["pow", "er"],
    ["of", ""],
    ["cut", "ting-edge"],
    ["to", "ols"],
    ["a", "nd"],
    ["o", "ur"],
    ["pro", "prietary"],
  ],
  [
    ["ap", "proach"],
    ["w", "e"],
    ["cr", "aft"],
    ["de", "lightful"],
    ["a", "nd"],
    ["in", "tuitive"],
    ["ex", "periences."],
  ],
];

export default function Intro() {
  const containerRef = useRef(null);
  const firstSectionRef = useRef(null);
  const secondSectionRef = useRef(null);
  // const lenis = useLenis()
  const modelGroupRef = useRef(null);
  const parentModelGroupRef = useRef(null);
  const modelIntroRotationOffsetRef = useRef({ y: -3 });

  const introRevealPlayedRef = useRef(false);
  const introRevealTlRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 542);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let firstSplit;
    let firstPara;
    let secondSplit;

    const waitForR3FRef = (ref, callback, tries = 0) => {
      if (ref.current) {
        callback(ref.current);
        return;
      }

      if (tries > 120) return;

      requestAnimationFrame(() => {
        waitForR3FRef(ref, callback, tries + 1);
      });
    };

    const ctx = gsap.context(() => {
      firstSplit = new SplitText(".first-split", {
        type: "lines,chars",
        linesClass: "split-line",
        mask: "lines",
      });

      firstPara = new SplitText(".first-para", {
        type: "lines,words",
        linesClass: "split-line",
        mask: "lines",
      });

      secondSplit = new SplitText(".second-split", {
        type: "lines",
        linesClass: "split-line",
        mask: "lines",
      });

      gsap.set(".first-split", {
        opacity: 1,
      });

      gsap.set(".first-para", {
        opacity: 1,
      });

      gsap.set(firstSplit.lines, {
        yPercent: -10,
      });

      gsap.set(secondSplit.lines, {
        yPercent: 100,
      });

      if (!introRevealPlayedRef.current) {
        gsap.set(firstSplit.chars, {
          yPercent: 120,
          autoAlpha: 1,
        });

        gsap.set(firstPara.words, {
          yPercent: 120,
          autoAlpha: 1,
        });
      } else {
        gsap.set(firstSplit.chars, {
          yPercent: 0,
          autoAlpha: 1,
        });

        gsap.set(firstPara.words, {
          yPercent: 0,
          autoAlpha: 1,
        });
      }

      const playIntroReveal = () => {
        if (introRevealPlayedRef.current) return;

        introRevealPlayedRef.current = true;

        introRevealTlRef.current?.kill();

        introRevealTlRef.current = gsap.timeline({
          defaults: {
            ease: "power2.out",
          },
        });

        introRevealTlRef.current
          .to(
            firstSplit.chars,
            {
              yPercent: 0,
              stagger: 0.025,
              duration: 0.6,
              ease: "power1.inOut",
            },
            0
          )
          .to(
            firstPara.words,
            {
              yPercent: 0,
              stagger: 0.01,
              duration: 0.8,
              ease: "power1.inOut",
            },
            0.3
          );

        waitForR3FRef(parentModelGroupRef, (parentGroup) => {
          const modelTl = gsap.timeline();

          modelTl
            .fromTo(
              parentGroup.scale,
              {
                x: 0,
                y: 0,
                z: 0,
              },
              {
                x: 1,
                y: 1,
                z: 1,
                delay: 0.5,
                duration: 1.2,
                ease: "power3.inOut",
              },
              0
            )
            .fromTo(
              parentGroup.position,
              {
                x: 1.35,
                y: -0.12,
                z: 0,
              },
              {
                x: 0,
                y: 0,
                z: 0,
                delay: 0.5,
                duration: 1.2,
                ease: "power3.inOut",
              },
              0
            )
            .to(
              modelIntroRotationOffsetRef.current,
              {
                y: 0,
                delay: 1,
                duration: 1.5,
                ease: "power3.out",
              },
              0
            );
        });
      };

      /*
        Start from early loader event.
        This makes the intro reveal overlap the loader exit,
        instead of waiting for the loader to be fully gone.
      */
      if (window.__hyperiuxLoaderComplete) {
        playIntroReveal();
      } else {
        window.addEventListener("hyperiux-loader-intro-start", playIntroReveal, {
          once: true,
        });

        window.addEventListener("hyperiux-loader-complete", playIntroReveal, {
          once: true,
        });
      }

      const fallbackReveal = window.setTimeout(() => {
        if (!introRevealPlayedRef.current) {
          playIntroReveal();
        }
      }, 9000);

      gsap.to(firstPara.lines, {
        yPercent: -120,
        stagger: 0.03,
        duration: 0.45,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "20% top",
          scrub: true,
        },
      });

      gsap.to(firstSplit.lines, {
        yPercent: -120,
        stagger: 0.03,
        duration: 0.45,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "20% top",
          scrub: true,
        },
      });

      gsap.to(secondSplit.lines, {
        yPercent: -10,
        stagger: 0.03,
        duration: 0.45,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: container,
          start: "20% top",
          end: "50% top",
          scrub: true,
        },
      });

      gsap.to(".about-cta", {
        yPercent: 0,
        opacity: 1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: container,
          start: "35% top",
          end: "50% top",
          scrub: true,
        },
      });

      if (!isMobile) {
        gsap.to(".second-section-portal", {
          opacity: 1,
          scrollTrigger: {
            trigger: ".hero",
            start: "30% top",
            end: "bottom 60%",
            scrub: true,
          },
        });
      }

      ScrollTrigger.refresh();

      return () => {
        window.clearTimeout(fallbackReveal);

        window.removeEventListener(
          "hyperiux-loader-intro-start",
          playIntroReveal
        );

        window.removeEventListener("hyperiux-loader-complete", playIntroReveal);
      };
    }, container);

    return () => {
      introRevealTlRef.current?.kill();

      firstSplit?.revert();
      firstPara?.revert();
      secondSplit?.revert();

      ctx.revert();
    };
  }, [isMobile]);

  return (
    <div ref={containerRef} className="container relative z-2 h-fit" id="hero">
      <div className="hero sticky top-0 h-screen w-screen">
        <section
          ref={firstSectionRef}
          className="first-section-portal pointer-events-none inset-0 z-2 h-screen w-screen overflow-hidden bg-black"
        >
          <div className="relative h-screen w-full overflow-hidden">
            {isMobile && (
              <div className="hidden max-sm:block">
                <div className="h-screen w-full">
                  <Image
                    src="/assets/images/homepage/hero-bg.png"
                    alt="hero-bg"
                    className="absolute inset-0 h-full w-full object-cover"
                    width={900}
                    height={900}
                    priority
                  />
                </div>

                <div className="absolute inset-0 bg-black/20" />
              </div>
            )}

            {!isMobile && (
              <HyperiuxGlassHeroScene
                showControls={false}
                modelSrc="/assets/models/hyperiexLogoNo2.glb"
                videoSrc="/assets/models/bg-shader-noise-video.mp4"
                modelScale={0.06}
                modelThickness={1.25}
                modelPosition={[1.1, 0, 1.4]}
                modelRotation={[0, 0, 0]}
                modelGroupRef={modelGroupRef}
                parentModelGroupRef={parentModelGroupRef}
                modelIntroRotationOffsetRef={modelIntroRotationOffsetRef}
              />
            )}

            <div className="pointer-events-none absolute inset-0 z-20 flex h-full w-full flex-col justify-center gap-[4vw] px-[5vw] pb-[8%] pt-[10%] max-sm:justify-start max-sm:pt-[32%]">
              <h1 className="first-split font-aeonik! flex flex-col text-[7.5vw] leading-[1.1]! text-white opacity-0 max-sm:text-[12.5vw]">
                <span>Digital</span>
                <span>Experience</span>
                <span>Design Agency</span>
              </h1>

              <p className="first-para mt-[-1vw] w-[53%] text-[1.4vw] text-white opacity-0 max-sm:mt-[4.2vw] max-sm:w-full max-sm:text-[4.2vw] max-sm:leading-normal">
                As a leading UI UX and web design agency, we harness the power
                of{" "}
                <span className="font-medium">
                  Emotion, Design, Technology, and Neuromarketing
                </span>{" "}
                to craft digital brand experiences that drive real results.
              </p>
            </div>
          </div>
        </section>
      </div>

      <section
        ref={secondSectionRef}
        className="second-section-portal relative inset-0 z-40 mt-[-3vw] h-[40vw] w-screen overflow-hidden bg-white opacity-0 max-sm:mt-0 max-sm:h-[85vh] max-sm:opacity-100"
      >
        {!isMobile && (
          <FloatingBlocks
            modelPosition={[-2.2, 0.3, 0]}
            modelRotation={[Math.PI / 2, 0, 0]}
            modelScale={0.0035}
          />
        )}

        <div className="pointer-events-none absolute inset-0 z-30 flex h-full w-full items-start justify-end px-[5vw] max-sm:h-[80vh] max-sm:items-center max-sm:justify-center max-sm:px-[7vw]">
          <div className="pointer-events-auto w-[60%] text-[#111111] max-sm:w-full">
            <h2 className="second-split font-aeonik! text-[3.2vw] leading-none max-sm:pb-[5vw] max-sm:text-[10vw] max-sm:leading-[1.1]">
              <div className="my-auto mr-[4vw] inline-block h-full translate-y-[-0.9vw] text-[1.2vw] text-black/50 max-sm:mr-[3vw] max-sm:block max-sm:translate-y-0 max-sm:pb-[6vw] max-sm:text-[3.5vw]">
                About Us
              </div>
              From Concept to Conversion We&apos;re Changing the Face of Web.
            </h2>

            <p className="second-split mt-[4.5vw] text-[1.45vw] leading-normal text-black/65 max-sm:text-[4.5vw]">
              {content.map((line, lineIndex) => (
                <span key={lineIndex}>
                  {line.map(([highlight, rest], wordIndex) => (
                    <span key={wordIndex}>
                      <strong className="font-semibold text-black/65">
                        {highlight}
                      </strong>
                      {rest}{" "}
                    </span>
                  ))}
                  {lineIndex !== content.length - 1 && <br />}
                </span>

              ))}
            </p>

            <p className="second-split mt-8 w-[70%] text-[1.55vw] leading-[1.4] text-black/65 max-sm:mt-12 max-sm:w-full max-sm:text-[4.5vw]">
              What you just experienced is called bionic reading. Learn more
              about it here.
            </p>

            <div className="about-cta mt-[3vw] h-fit w-fit translate-y-[50%] opacity-0 max-sm:mt-[8vw]">
              <MainButton href={"#"} btnText={"Say Hi"} />
            </div>
          </div>
        </div>
      </section>

      <CubeCanvasBackground seededRandom={seededRandom} />
    </div>
  );
}