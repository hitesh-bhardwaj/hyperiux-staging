"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HyperiuxMaskedTrail from "./components/HyperiuxMaskedTrail";
import CharRevealLink from "../Animations/CharRevealLink";
import { FooterUnderlineLink, MainButton } from "../Buttons";
import Image from "next/image";
import FlowFieldHero from "../3D/FlowFieldPlane";
import { CONTACT_LINKS, FOOTER_LINK_SECTIONS, SOCIAL_LINKS } from "./data";
import CircularButton from "../Buttons/CircularButton";
import { usePageTransition } from "../Animations/PageTransitionProvider";
// import { usePageTransition } from "../PageTransitionProvider";

gsap.registerPlugin(ScrollTrigger);

const EXTRA_SCROLL_MAX = 900;
const EXTRA_SCROLL_TRIGGER_THRESHOLD = 42;
const EXTRA_SCROLL_RESET_DELAY = 550;

export const Footer = ({
  progressEyebrow = "Keep Scrolling to know more",
  progressTitle = "About Us",
  progressRoute = "/about",
}) => {
  const { push: transitionPush, isTransitioning } = usePageTransition();

  const container = useRef(null);

  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const progressRef = useRef(0);
  const extraScrollValueRef = useRef(0);
  const resetTimeoutRef = useRef(null);
  const progressTweenRef = useRef(null);
  const hasTriggeredRouteRef = useRef(false);
  const touchLastYRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 542);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    hasTriggeredRouteRef.current = false;
    progressRef.current = 0;
    extraScrollValueRef.current = 0;
    setProgress(0);
  }, [progressRoute]);

  useEffect(() => {
    const clearResetTimeout = () => {
      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = null;
      }
    };

    const killProgressTween = () => {
      progressTweenRef.current?.kill();
      progressTweenRef.current = null;
    };

    const setProgressValue = (value) => {
      const clamped = Math.max(0, Math.min(100, value));

      progressRef.current = clamped;
      setProgress(clamped);
    };

    const getIsAtPageBottom = () => {
      const doc = document.documentElement;

      const scrollTop = window.scrollY || doc.scrollTop;
      const scrollHeight = doc.scrollHeight;
      const clientHeight = window.innerHeight;

      return scrollTop + clientHeight >= scrollHeight - 4;
    };

    const resetProgressAfterStop = () => {
      clearResetTimeout();

      resetTimeoutRef.current = window.setTimeout(() => {
        if (hasTriggeredRouteRef.current) return;

        if (progressRef.current < EXTRA_SCROLL_TRIGGER_THRESHOLD) {
          killProgressTween();

          progressTweenRef.current = gsap.to(progressRef, {
            current: 0,
            duration: 0.55,
            ease: "power2.out",
            onUpdate: () => {
              const value = progressRef.current;

              extraScrollValueRef.current = (value / 100) * EXTRA_SCROLL_MAX;
              setProgress(value);
            },
            onComplete: () => {
              progressRef.current = 0;
              extraScrollValueRef.current = 0;
              setProgress(0);
            },
          });
        }
      }, EXTRA_SCROLL_RESET_DELAY);
    };

    const completeAndRoute = () => {
      if (hasTriggeredRouteRef.current) return;

      hasTriggeredRouteRef.current = true;

      clearResetTimeout();
      killProgressTween();

      progressTweenRef.current = gsap.to(progressRef, {
        current: 100,
        duration: 0.45,
        ease: "power3.out",
        onUpdate: () => {
          setProgress(progressRef.current);
        },
        onComplete: () => {
          setProgress(100);

          /*
            Route through the page transition provider.
            The provider handles:
            - stopping Lenis
            - dimming the current page
            - drawing cubes
            - changing route
            - undrawing cubes
            - restarting Lenis
          */
          transitionPush(progressRoute);
        },
      });
    };

    const updateExtraScroll = (delta) => {
      if (hasTriggeredRouteRef.current || isTransitioning) return;

      const isAtBottom = getIsAtPageBottom();

      if (!isAtBottom) {
        if (progressRef.current > 0) {
          killProgressTween();

          progressRef.current = 0;
          extraScrollValueRef.current = 0;
          setProgress(0);
        }

        return;
      }

      extraScrollValueRef.current += delta;

      extraScrollValueRef.current = Math.max(
        0,
        Math.min(EXTRA_SCROLL_MAX, extraScrollValueRef.current)
      );

      const nextProgress =
        (extraScrollValueRef.current / EXTRA_SCROLL_MAX) * 100;

      killProgressTween();
      setProgressValue(nextProgress);

      if (nextProgress >= EXTRA_SCROLL_TRIGGER_THRESHOLD) {
        completeAndRoute();
        return;
      }

      resetProgressAfterStop();
    };

    const handleWheel = (event) => {
      if (hasTriggeredRouteRef.current || isTransitioning) {
        event.preventDefault();
        return;
      }

      const isAtBottom = getIsAtPageBottom();

      if (!isAtBottom) return;

      if (event.deltaY > 0) {
        event.preventDefault();

        const intensity = Math.min(Math.abs(event.deltaY), 120);
        updateExtraScroll(intensity);
      }

      if (event.deltaY < 0 && progressRef.current > 0) {
        event.preventDefault();

        const intensity = Math.min(Math.abs(event.deltaY), 90);
        updateExtraScroll(-intensity * 1.15);
      }
    };

    const handleTouchStart = (event) => {
      touchLastYRef.current = event.touches?.[0]?.clientY ?? null;
    };

    const handleTouchMove = (event) => {
      if (hasTriggeredRouteRef.current || isTransitioning) {
        event.preventDefault();
        return;
      }

      if (touchLastYRef.current === null) return;

      const currentY = event.touches?.[0]?.clientY ?? touchLastYRef.current;
      const delta = touchLastYRef.current - currentY;

      touchLastYRef.current = currentY;

      const isAtBottom = getIsAtPageBottom();

      if (!isAtBottom) return;

      if (delta > 0) {
        event.preventDefault();

        const intensity = Math.min(Math.abs(delta), 80);
        updateExtraScroll(intensity * 2.2);
      }

      if (delta < 0 && progressRef.current > 0) {
        event.preventDefault();

        const intensity = Math.min(Math.abs(delta), 60);
        updateExtraScroll(-intensity * 2);
      }
    };

    const handleTouchEnd = () => {
      touchLastYRef.current = null;

      if (
        !hasTriggeredRouteRef.current &&
        !isTransitioning &&
        progressRef.current < EXTRA_SCROLL_TRIGGER_THRESHOLD
      ) {
        resetProgressAfterStop();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      clearResetTimeout();
      killProgressTween();

      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [progressRoute, transitionPush, isTransitioning]);

  return (
    <div id="footer" className="relative bg-[#111111]">
      <div
        ref={container}
        className="w-screen h-fit relative max-sm:h-[120vh]"
        id="footer-bottom"
      >
        <div className="relative overflow-hidden w-screen h-full text-white flex flex-col px-[5vw] pt-[5vw] max-sm:px-[7vw] pb-[2vw] max-sm:pb-0 max-sm:h-fit max-sm:pt-[18%]">
          {!isMobile && (
            <div className="absolute inset-0 top-0 z-1 pointer-events-auto">
              <FlowFieldHero texturePath="/assets/textures/orange.png" />
            </div>
          )}

          <div className="relative z-10 flex flex-1 flex-col gap-[12vw] justify-between">
            <div className="flex flex-col w-full gap-[2vw] max-sm:gap-[8vw] items-start justify-between">
              <h2 className="font-aeonik text-[6.5vw] max-sm:text-[10vw] leading-[0.95] max-sm:leading-[1.2]! w-[60%] max-sm:w-[80%]">
                Let&apos;s Bring Your Ideas To Life!
              </h2>

              <div className="mt-7">
                <MainButton
                  href="#"
                  btnText="Say Hi"
                  className="bg-white! text-[#111111]!"
                />
              </div>
            </div>

            <div className="w-full flex justify-between items-end">
              <div className="w-full h-fit flex flex-col gap-[5vw] max-sm:gap-[12vw]">
                <div className="w-full flex justify-between">
                  <div className="flex gap-[12vw] w-full max-sm:flex-col max-sm:gap-[10vw]">
                    <div className="flex flex-col gap-[1.4vw] w-[35vw] max-sm:w-full max-sm:order-3 max-sm:gap-[6vw]">
                      <div className="flex flex-col pt-0 max-sm:pt-[4vw] gap-[1.5vw] leading-[1.2] font-aeonik max-sm:gap-[6vw]">
                        {CONTACT_LINKS.map((link) => (
                          <FooterUnderlineLink href={link.href} key={link.type}>
                            {link.label}
                          </FooterUnderlineLink>
                        ))}

                        <p className="w-full text-16 [text-shadow:0_1px_0_#111111] max-sm:text-[5vw]">
                          Grandslam I-Thum, A-40, Sector- 62, Noida, Uttar
                          Pradesh (201309)
                        </p>

                        <div className="flex gap-[1vw] menu-socials mt-[1vw] max-sm:gap-[7vw] max-sm:mt-[4vw]">
                          {SOCIAL_LINKS.map(({ href, key }) => (
                            <CircularButton
                              variant={key}
                              key={key}
                              href={href}
                              className="group-hover:-invert"
                              fill="group-hover:fill-primary"
                            />
                          ))}
                        </div>

                        <p className="font-aeonik max-sm:hidden text-white pt-[2vw] text-[0.9vw] max-sm:text-[3.5vw] max-sm:pt-[8vw]">
                          © 2026 Hyperiux Immersion Labs. All rights reserved.
                        </p>
                      </div>
                    </div>

                    <div className="flex max-sm:gap-[8vw] gap-[12vw] max-sm:w-[75%] max-sm:justify-between max-sm:order-2">
                      {FOOTER_LINK_SECTIONS.map((section) => (
                        <div
                          key={section.title}
                          className={`flex flex-col gap-[1.2vw] max-sm:gap-[7vw] ${section.className}`}
                        >
                          <h3 className="font-aeonik text-[1.6vw] font-medium max-sm:text-[4.5vw]">
                            {section.title}
                          </h3>

                          <div
                            className={`flex flex-col font-aeonik ${
                              section.title === "Company"
                                ? "gap-[0.75vw] text-16 max-sm:gap-[4vw]"
                                : "gap-[0.8vw] max-sm:gap-[4vw]"
                            }`}
                          >
                            {section.links.map((link) => (
                              <CharRevealLink href={link.href} key={link.text}>
                                {link.text}
                              </CharRevealLink>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pointer-events-none flex h-full items-end max-sm:justify-start">
                      <div className="flex flex-col w-[18vw] max-sm:w-[80%]">
                        <div className="flex flex-col gap-[1vw] max-sm:gap-[2vw]">
                          <p className="text-16">{progressEyebrow}</p>

                          <h3 className="text-[2.5vw] max-sm:text-[8vw] font-display">
                            {progressTitle}
                          </h3>

                          <div className="w-full h-0.75 bg-white/20 rounded-full flex overflow-hidden">
                            <span
                              style={{
                                width: `${progress}%`,
                              }}
                              className="h-full inline-block bg-[#ff5f00] rounded-full progress-bar"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden max-sm:block">
                  <div className="w-full h-auto">
                    <Image
                      src="/assets/icons/hyperiux-footer.png"
                      alt="hyperiux"
                      width={400}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <p className="font-aeonik text-white pt-[2vw] text-center mx-auto text-[0.9vw] max-sm:text-[3.2vw] max-sm:pt-[8vw]">
                    © 2026 Hyperiux Immersion Labs. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-[35vw] absolute bottom-0 z-2 pointer-events-none ml-[-5vw] bg-linear-to-t from-[#111111] to-[#11111100]" />
        </div>
      </div>

      {!isMobile && <HyperiuxMaskedTrail />}
    </div>
  );
};