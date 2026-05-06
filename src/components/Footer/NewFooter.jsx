"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Facebook, Instagram, Linkedin, MainButton, Twitter } from "../Buttons";
import Link from "next/link";
import Copy from "../Animations/Copy";

gsap.registerPlugin(ScrollTrigger);

export const FooterBottom = ({ pathName, path }) => {
  const router = useRouter();
  const container = useRef(null);
  const text = useRef(null);
  const shadow = useRef(null);

  const THRESHOLD = 1000;
  const RESET_DELAY = 500;
  const [progress, setProgress] = useState(0);
  const accumRef = useRef(0);
  const timerRef = useRef();
  const hasNavRef = useRef(false);

  // Letter refs for GSAP animations
  const letterRefs = useRef({
    e: {
      group: null,
      first: null,
      second: null,
      timeline: null,
      isAnimated: false,
    },
    n: {
      group: null,
      first: null,
      second: null,
      timeline: null,
      isAnimated: false,
    },
    i: {
      group: null,
      first: null,
      second: null,
      timeline: null,
      isAnimated: false,
    },
    g: {
      group: null,
      first: null,
      second: null,
      timeline: null,
      isAnimated: false,
    },
    m: {
      group: null,
      first: null,
      second: null,
      timeline: null,
      isAnimated: false,
    },
    a: {
      group: null,
      first: null,
      second: null,
      timeline: null,
      isAnimated: false,
    },
  });

  const letterAnimations = {
    e: { firstMove: "x", direction: 1, secondMove: "x", secondStart: -1 },
    n: { firstMove: "y", direction: 1, secondMove: "y", secondStart: -1 },
    i: { firstMove: "x", direction: -1, secondMove: "x", secondStart: 1 },
    g: { firstMove: "y", direction: -1, secondMove: "y", secondStart: 1 },
    m: { firstMove: "x", direction: -1, secondMove: "x", secondStart: 1 },
    a: { firstMove: "x", direction: 1, secondMove: "x", secondStart: -1 },
  };

  const createHoverAnimation = (letter) => {
    const refs = letterRefs.current[letter];
    const config = letterAnimations[letter];

    if (!refs.first || !refs.second) return;

    const timeline = gsap.timeline({ paused: true });

    timeline
      .to(
        refs.first,
        {
          [config.firstMove]: config.direction > 0 ? "100%" : "-100%",
          duration: 0.6,
          ease: "power3.out",
        },
        0
      )
      .fromTo(
        refs.second,
        {
          [config.secondMove]: config.secondStart > 0 ? "100%" : "-100%",
        },
        {
          [config.secondMove]: "0%",
          duration: 0.6,
          ease: "power3.out",
        },
        0.05
      );

    refs.timeline = timeline;
  };

  const handleMouseEnter = (letter) => {
    const refs = letterRefs.current[letter];
    const config = letterAnimations[letter];

    if (!refs.timeline) return;

    if (!refs.isAnimated) {
      refs.timeline.timeScale(1).play();
      refs.isAnimated = true;
    } else {
      refs.timeline.kill();

      gsap.set(refs.first, { [config.firstMove]: "0%" });
      gsap.set(refs.second, {
        [config.secondMove]: config.secondStart > 0 ? "100%" : "-100%",
      });

      const tempText = refs.first.textContent;
      refs.first.textContent = refs.second.textContent;
      refs.second.textContent = tempText;

      const newTimeline = gsap.timeline();
      newTimeline
        .to(
          refs.first,
          {
            [config.firstMove]: config.direction > 0 ? "100%" : "-100%",
            duration: 0.5,
            ease: "power3.out",
          },
          0
        )
        .fromTo(
          refs.second,
          {
            [config.secondMove]: config.secondStart > 0 ? "100%" : "-100%",
          },
          {
            [config.secondMove]: "0%",
            duration: 0.5,
            ease: "power3.out",
          },
          0.05
        );

      refs.timeline = newTimeline;
    }
  };

  const handleMouseLeave = (letter) => {
    // Do nothing on mouse leave - letters stay in their current state
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const textSpans = text.current.querySelectorAll(".footer-span");
      gsap.set(textSpans, { y: "150%" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "20% bottom",
          end: "bottom bottom",
          scrub: true,
        },
      });

      tl.fromTo(
        textSpans,
        {
          y: "150%",
        },
        {
          y: "0%",
          duration: 1,
          stagger: {
            amount: 0.5,
          },
          ease: "sine.inOut",
        }
      ).to(
        shadow.current,
        {
          opacity: 0,
          duration: 1,
          ease: "power1.inOut",
        },
        "<"
      );

      gsap.delayedCall(0.1, () => {
        Object.keys(letterAnimations).forEach((letter) => {
          createHoverAnimation(letter);
        });
      });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const reset = () => {
      accumRef.current = 0;
      // gsap.to(".progress-bar", {
      //   width: "0%",
      //   duration: 1,
      //   ease: "power1.out",
      //   onUpdate() {
      //     setProgress(0);
      //   },
      // });
    };

    function navigateToAbout() {
      router.push(path, { scroll: false });
    }

    const onWheel = (e) => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      if (e.deltaY <= 0 || window.scrollY < maxScroll) {
        hasNavRef.current = false;
        clearTimeout(timerRef.current);
        reset();
        return;
      }

      accumRef.current = Math.min(accumRef.current + e.deltaY, THRESHOLD);
      const pct = (accumRef.current / THRESHOLD) * 100;
      // gsap.to(".progress-bar", {
      //   width: `${pct}%`,
      //   duration: 0.1,
      //   ease: "power1.out",
      //   onUpdate() {
      //     setProgress((accumRef.current / THRESHOLD) * 100);
      //   },
      // });

      clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        if (!hasNavRef.current) reset();
      }, RESET_DELAY);

      if (accumRef.current >= THRESHOLD && !hasNavRef.current) {
        hasNavRef.current = true;
        // gsap.to(".progress-bar", {
        //   width: "100%",
        //   duration: 0.4,
        //   ease: "power2.out",
        //   onComplete: () => navigateToAbout(),
        // });
      }
    };

    const onScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY < maxScroll) {
        hasNavRef.current = false;
        clearTimeout(timerRef.current);
        reset();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timerRef.current);
    };
  }, [router, path]);

  return (
    <>
      <div
        ref={container}
        className="w-screen h-[95vh] z-[1] relative"
        id="footer-bottom"
        style={{ clipPath: "rect(0px 100% 100% 0px)", boxShadow: '' }}
      >
        <div className="w-screen h-[95vh] fixed bg-gradient bottom-0 text-white flex flex-col justify-between items-center px-[4.5vw] pt-[5%] pb-[2%]">
          <div
            ref={shadow}
            className="opacity-100 bg-black/25 absolute inset-0 z-10 pointer-events-none"
          />

          <div className="w-full h-fit items-center flex justify-between">
            <div className="w-[60%]">
              <Copy>
                <h2 className="text-[5vw] uppercase">
                  Let's bring your ideas to life!
                </h2>
              </Copy>
            </div>
            <div className="w-[28%] flex flex-col gap-[1.5vw]">
              <Copy>
                <p>
                  We improve the world through thoughtful design and technology.
                </p>
              </Copy>
              {/* <div></div> */}
              <div className="fadeupanim">
                <MainButton btnText={"Say Hi"} link={"/"} />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-[2vw]">
            <div className="w-full flex flex-col gap-[1.5vw]">
              <div className="w-full flex justify-between items-end">
                <div className="w-[25%] flex flex-col gap-[1vw]">
                  <div className="flex flex-col text-[1vw] w-full font-medium gap-[0.4vw]">
                    <Link
                      href={"mailto:hi@weareenigma.com"}
                      className="link-line"
                    >
                      hi@weareenigma.com
                    </Link>
                    <Link href={"tel:+91 8745044555"} className="link-line">
                      +91 8745044555
                    </Link>
                  </div>
                  <div className="w-[75%] text-[1.1vw] font-medium">
                    Grandslam I-Thum, A-40, Sector- 62, Noida, Uttar Pradesh
                    (201309)
                  </div>

                  <div className="flex gap-[1vw] menu-socials mt-[1vw]">
                    <Facebook
                      menuSocial={true}
                      className={"group-hover:-invert"}
                      fill={"group-hover:fill-primary"}
                    />
                    <Twitter
                      menuSocial={true}
                      className={"group-hover:-invert"}
                      fill={"group-hover:fill-primary"}
                    />
                    <Linkedin
                      menuSocial={true}
                      className={"group-hover:-invert"}
                      fill={"group-hover:fill-primary"}
                    />
                    <Instagram
                      menuSocial={true}
                      className={"group-hover:-invert"}
                      fill={"group-hover:fill-primary"}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="w-fit h-fit overflow-hidden">
                    <div
                      ref={text}
                      className="!text-[18vw] font-display uppercase footer-bottom-text overflow-hidden leading-[0.8]"
                    >
                      {/* E */}
                      <div
                        ref={(el) => (letterRefs.current.e.group = el)}
                        className="relative inline-block overflow-hidden w-fit h-fit footer-span cursor-pointer leading-[0.8]"
                        onMouseEnter={() => handleMouseEnter("e")}
                        onMouseLeave={() => handleMouseLeave("e")}
                      >
                        <span
                          ref={(el) => (letterRefs.current.e.first = el)}
                          className="inline-block"
                        >
                          E
                        </span>
                        <span
                          ref={(el) => (letterRefs.current.e.second = el)}
                          className="inline-block absolute top-0 left-0 "
                        >
                          E
                        </span>
                      </div>

                      {/* N */}
                      <div
                        ref={(el) => (letterRefs.current.n.group = el)}
                        className="relative inline-block overflow-hidden w-fit h-fit footer-span cursor-pointer leading-[0.8]"
                        onMouseEnter={() => handleMouseEnter("n")}
                        onMouseLeave={() => handleMouseLeave("n")}
                      >
                        <span
                          ref={(el) => (letterRefs.current.n.first = el)}
                          className="inline-block"
                        >
                          N
                        </span>
                        <span
                          ref={(el) => (letterRefs.current.n.second = el)}
                          className="inline-block absolute top-0 left-0 "
                        >
                          N
                        </span>
                      </div>

                      {/* I */}
                      <div
                        ref={(el) => (letterRefs.current.i.group = el)}
                        className="relative inline-block overflow-hidden w-fit h-full footer-span cursor-pointer leading-[0.8]"
                        onMouseEnter={() => handleMouseEnter("i")}
                        onMouseLeave={() => handleMouseLeave("i")}
                      >
                        <span
                          ref={(el) => (letterRefs.current.i.first = el)}
                          className="inline-block"
                        >
                          I
                        </span>
                        <span
                          ref={(el) => (letterRefs.current.i.second = el)}
                          className="inline-block absolute top-0 left-0 "
                        >
                          I
                        </span>
                      </div>

                      {/* G */}
                      <div
                        ref={(el) => (letterRefs.current.g.group = el)}
                        className="relative inline-block overflow-hidden w-fit h-full footer-span cursor-pointer leading-[0.8]"
                        onMouseEnter={() => handleMouseEnter("g")}
                        onMouseLeave={() => handleMouseLeave("g")}
                      >
                        <span
                          ref={(el) => (letterRefs.current.g.first = el)}
                          className="inline-block"
                        >
                          G
                        </span>
                        <span
                          ref={(el) => (letterRefs.current.g.second = el)}
                          className="inline-block absolute top-0 left-0 "
                        >
                          G
                        </span>
                      </div>

                      {/* M */}
                      <div
                        ref={(el) => (letterRefs.current.m.group = el)}
                        className="relative inline-block overflow-hidden w-fit h-full footer-span cursor-pointer leading-[0.8]"
                        onMouseEnter={() => handleMouseEnter("m")}
                        onMouseLeave={() => handleMouseLeave("m")}
                      >
                        <span
                          ref={(el) => (letterRefs.current.m.first = el)}
                          className="inline-block"
                        >
                          M
                        </span>
                        <span
                          ref={(el) => (letterRefs.current.m.second = el)}
                          className="inline-block absolute top-0 left-0 "
                        >
                          M
                        </span>
                      </div>

                      {/* A */}
                      <div
                        ref={(el) => (letterRefs.current.a.group = el)}
                        className="relative inline-block overflow-hidden w-fit h-full footer-span cursor-pointer leading-[0.8]"
                        onMouseEnter={() => handleMouseEnter("a")}
                        onMouseLeave={() => handleMouseLeave("a")}
                      >
                        <span
                          ref={(el) => (letterRefs.current.a.first = el)}
                          className="inline-block"
                        >
                          A
                        </span>
                        <span
                          ref={(el) => (letterRefs.current.a.second = el)}
                          className="inline-block absolute top-0 left-0 "
                        >
                          A
                        </span>
                      </div>
                    </div>
                  </div>
                  <p>
                    © 2025 Enigma Digital Consulting LLP. All rights reserved
                    all wrongs reversed.
                  </p>
                </div>
              </div>
              <div className="w-full h-[1px] bg-white linenaim" />
            </div>
            <div className="flex w-full justify-between items-center">
              <p>Keep Scrolling To Learn More</p>
              <div className="flex flex-col w-[20%] gap-[1vw]">
                <h3 className="!text-[2.5vw] font-display">{pathName}</h3>
                <div className="w-full h-[5px] bg-white/20 rounded-full flex">
                  <span
                    style={{
                      width: `${progress}%`,
                    }}
                    className="w-0 h-full inline-block bg-white rounded-full progress-bar"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
