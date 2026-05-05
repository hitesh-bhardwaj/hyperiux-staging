"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
    const prev = history.scrollRestoration;
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    const NAV_DELAY = 200;

    const navigateToAbout = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      console.log("scrolling to top");
      requestAnimationFrame(() => {
        setTimeout(() => {
          router.push(path, { scroll: false });
        }, NAV_DELAY);
      });
    };

    const reset = () => {
      accumRef.current = 0;
      gsap.to(".progress-bar", {
        width: "0%",
        duration: 1,
        ease: "power1.out",
        onUpdate() {
          setProgress(0);
        },
      });
    };

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

      gsap.to(".progress-bar", {
        width: `${pct}%`,
        duration: 0.1,
        ease: "power1.out",
        onUpdate() {
          setProgress(pct);
        },
      });

      clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        if (!hasNavRef.current) reset();
      }, RESET_DELAY);

      if (accumRef.current >= THRESHOLD && !hasNavRef.current) {
        hasNavRef.current = true;
        gsap.to(".progress-bar", {
          width: "100%",
          duration: 0.4,
          ease: "power2.out",
          onComplete: navigateToAbout,
        });
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
      if ("scrollRestoration" in history) history.scrollRestoration = prev;
    };
  }, [router, path]);
  useEffect(() => {
  console.log( scrollbar.__lenis)
  const NAV_DELAY = 200; // ms — adjust to taste
  const navTimeoutRef = { current: null };

  const reset = () => {
    accumRef.current = 0;
    gsap.to(".progress-bar", {
      width: "0%",
      duration: 1,
      ease: "power1.out",
      onUpdate() {
        setProgress(0);
      },
    });
  };

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

    gsap.to(".progress-bar", {
      width: `${pct}%`,
      duration: 0.1,
      ease: "power1.out",
      onUpdate() {
        setProgress((accumRef.current / THRESHOLD) * 100);
      },
    });

    clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      if (!hasNavRef.current) reset();
    }, RESET_DELAY);

    if (accumRef.current >= THRESHOLD && !hasNavRef.current) {
      hasNavRef.current = true;
      gsap.to(".progress-bar", {
        width: "100%",
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
              // scrollbar.__lenis.stop()
          // 1) jump to top instantly
         
          // 2) wait a moment, then navigate
          navTimeoutRef.current = setTimeout(() => {
            navigateTo(path);
             scrollbar.__lenis.start()
          });
          //  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        },
      });
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
    if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
  };
}, [path, navigateTo, scrollbar.__lenis]);

  return (
    <>
      <div
        ref={container}
        className="w-screen h-[45vh] z-[1] relative"
        id="footer-bottom"
        style={{ clipPath: "rect(0px 100% 100% 0px)", boxShadow: "" }}
      >
        <div className="w-screen h-[45vh] footer-gradient fixed bottom-0 text-white flex justify-between items-center px-[5vw] pt-[2%]">
          <div
            ref={shadow}
            className="opacity-100 bg-black/25 absolute inset-0 z-10 pointer-events-none"
          />
          <div className="w-fit h-fit overflow-hidden ml-[-2vw]">
            <div
              ref={text}
              className="!text-[15vw] font-display font-medium uppercase footer-bottom-text overflow-hidden leading-[1]"
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
          <div className="flex flex-col w-[20%] gap-[1vw]">
            <p>Keep Scrolling To Learn More</p>
            <h3 className="!text-[2.5vw] font-display">{pathName}</h3>
            <div className="w-full h-[3px] bg-white/20 rounded-full flex">
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
    </>
  );
};
