"use client";

import React, {
  useMemo,
  useRef,
  useEffect,
} from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const COLS = 20;
const ROWS = 12;
const TOTAL = COLS * ROWS;
const CURSOR_CIRCLE_SIZE = 300;
const CURSOR_SMALL_SIZE = 20; // small cursor size when inside section but not on text
const CURSOR_LERP = 0.12;
const SIZE_LERP = 0.12;

function seededRandom(seed) {
  let value = seed;
  return function () {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function getBottomToTopOrder(seed = 47) {
  const random = seededRandom(seed);
  return Array.from({ length: TOTAL }, (_, index) => {
    const row = Math.floor(index / COLS);
    const col = index % COLS;
    const bottomToTopBias = row * 10;
    const horizontalNoise = Math.sin(col * 1.7) * 1.5;
    const randomNoise = random() * 50.5;
    const score = bottomToTopBias + horizontalNoise + randomNoise;
    return { index, row, col, score };
  }).sort((a, b) => b.score - a.score);
}

const SectionBreak = () => {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const maskRectsRef = useRef([]);
  const revealOverlayRef = useRef(null);
  const rafTickerRef = useRef(null);

  const squareOrder = useMemo(() => getBottomToTopOrder(), []);

  // Refs to track raw mouse and lerped cursor state inside GSAP ticker
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const lerpedRef = useRef({ x: -9999, y: -9999, size: 0 });
  const isPointerFineRef = useRef(false);
  const isInSectionRef = useRef(false);
  const isOnTextRef = useRef(false); // NEW: tracks whether cursor is over text
  const hasPointerRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    isPointerFineRef.current = mq.matches;

    const handler = (e) => {
      isPointerFineRef.current = e.matches;
    };

    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    // Text element selectors to check hover against
    const TEXT_SELECTORS = [
      ".section-break-line-1",
      ".section-break-line-2",
      ".section-break-line-3",
      ".section-break-line-4",
      ".section-break-reveal-1",
      ".section-break-reveal-2",
      ".section-break-reveal-3",
    ];

    const getTextEls = () => {
      const section = sectionRef.current;
      if (!section) return [];
      return TEXT_SELECTORS.map((sel) => section.querySelector(sel)).filter(Boolean);
    };

    const isPointerOverText = (clientX, clientY) => {
      const els = getTextEls();
      return els.some((el) => {
        const rect = el.getBoundingClientRect();
        return (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        );
      });
    };

    const handlePointerMove = (e) => {
      if (!isPointerFineRef.current) return;

      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      hasPointerRef.current = true;

      const sticky = stickyRef.current;
      if (!sticky) return;

      const rect = sticky.getBoundingClientRect();
      isInSectionRef.current =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      // NEW: check if over text
      isOnTextRef.current = isInSectionRef.current && isPointerOverText(e.clientX, e.clientY);

      if (isInSectionRef.current && lerpedRef.current.x < -1000) {
        lerpedRef.current.x = e.clientX;
        lerpedRef.current.y = e.clientY;
      }
    };

    const handlePointerLeave = () => {
      isInSectionRef.current = false;
      isOnTextRef.current = false;
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  // GSAP ticker: lerp position + size, write directly to DOM.
  useEffect(() => {
    const updateMask = () => {
      const target = mouseRef.current;
      const lerped = lerpedRef.current;
      const el = revealOverlayRef.current;
      if (!el) return;

      if (!isPointerFineRef.current || !hasPointerRef.current) {
        el.style.clipPath = "circle(0px at -9999px -9999px)";
        el.style.webkitClipPath = "circle(0px at -9999px -9999px)";
        return;
      }

      lerped.x += (target.x - lerped.x) * CURSOR_LERP;
      lerped.y += (target.y - lerped.y) * CURSOR_LERP;

      // NEW: expand fully on text, shrink to small dot inside section, hide outside
      let targetSize = 0;
      if (isInSectionRef.current) {
        targetSize = isOnTextRef.current ? CURSOR_CIRCLE_SIZE : CURSOR_SMALL_SIZE;
      }

      lerped.size += (targetSize - lerped.size) * SIZE_LERP;

      const radius = lerped.size / 2.5;
      const circle = `circle(${radius}px at ${lerped.x}px ${lerped.y}px)`;

      el.style.clipPath = circle;
      el.style.webkitClipPath = circle;
    };

    gsap.ticker.add(updateMask);
    rafTickerRef.current = updateMask;

    return () => {
      gsap.ticker.remove(updateMask);
      if (rafTickerRef.current === updateMask) rafTickerRef.current = null;
    };
  }, []);

  // SVG SQUARE MASK ANIMATION
  useGSAP(() => {
    const orderedMaskRects = squareOrder
      .map((item) => maskRectsRef.current[item.index])
      .filter(Boolean);

    if (!orderedMaskRects.length) return;

    gsap.set(orderedMaskRects, { opacity: 1 });
    gsap.set("#solutions", { yPercent: 30 });

    const ml = gsap.timeline({
      scrollTrigger: {
        trigger: "#sectionBreak",
        start: "45% top",
        end: "bottom top",
        scrub: true,
        markers: false,
      },
      defaults: { ease: "none" },
    });

    ml.to(".first-section", { yPercent: -130 }).to(
      "#solutions",
      { yPercent: -70 },
      "<",
    );

    const squareTl = gsap.timeline({
      scrollTrigger: {
        id: "sectionBreakSquareMask",
        trigger: "#sectionBreak",
        start: "45% top",
        end: "100% 50%",
        scrub: true,
      },
    });

    squareTl.to(orderedMaskRects, {
      opacity: 0,
      duration: 0.2,
      stagger: { each: 0.008, from: "start" },
      ease: "none",
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st?.vars?.id === "sectionBreakSquareMask") st.kill();
      });
    };
  }, [squareOrder]);

  // TEXT SPLIT ANIMATION
  useGSAP(
    () => {
      const waitForFonts = async () => {
        if (typeof document !== "undefined" && document.fonts?.ready) {
          try { await document.fonts.ready; } catch (_) {}
        }
      };

      let splits = [];

      const initTextAnimation = async () => {
        await waitForFonts();

        const section = sectionRef.current;
        if (!section) return;

        const mqlDesktop =
          typeof window !== "undefined" ? window.innerWidth > 1024 : true;

        const baseClasses = [
          ".section-break-line-1",
          ".section-break-line-2",
          ".section-break-line-3",
          ".section-break-line-4",
        ];

        const revealClasses = [
          ".section-break-reveal-1",
          ".section-break-reveal-2",
          ".section-break-reveal-3",
          ".section-break-reveal-4",
        ];

        const baseEls = baseClasses
          .map((cls) => section.querySelector(cls))
          .filter(Boolean);

        const revealEls = revealClasses
          .map((cls) => section.querySelector(cls))
          .filter(Boolean);

        if (!baseEls.length) return;

        const baseSplits = baseEls.map(
          (el) =>
            new SplitText(el, {
              type: "lines,chars",
              mask: "lines",
              linesClass: "para-line",
            }),
        );

        const revealSplits = revealEls.map(
          (el) =>
            new SplitText(el, {
              type: "lines,chars",
              mask: "lines",
              linesClass: "para-line",
            }),
        );

        splits = [...baseSplits, ...revealSplits];

        splits.forEach((split) => {
          gsap.set(split.lines, { overflow: "hidden", display: "block" });
          gsap.set(split.chars, { y: 150 });
        });

        const textTl = gsap.timeline({
          scrollTrigger: {
            id: "sectionBreakTextSplit",
            trigger: section,
            start: mqlDesktop ? "5% top" : "2% 50%",
            end: mqlDesktop ? "40% top" : "45% 40%",
            scrub: true,
          },
        });

        const lineCount = baseEls.length;
        const staggerAmount = mqlDesktop ? 0.3 : 0.2;

        for (let i = lineCount - 1; i >= 0; i--) {
          const insertAt = i === lineCount - 1 ? 0 : "-=0.4";

          textTl.to(
            baseSplits[i].chars,
            {
              y: 0,
              stagger: { amount: staggerAmount, from: "end" },
              ease: "power2.out",
            },
            insertAt,
          );

          if (revealSplits[i]) {
            textTl.to(
              revealSplits[i].chars,
              {
                y: 0,
                stagger: { amount: staggerAmount, from: "end" },
                ease: "power2.out",
              },
              "<",
            );
          }
        }

        ScrollTrigger.refresh();
      };

      initTextAnimation();

      return () => {
        splits.forEach((split) => split?.revert());
        splits = [];
        ScrollTrigger.getAll().forEach((st) => {
          if (st?.vars?.id === "sectionBreakTextSplit") st.kill();
        });
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="sectionBreak"
      data-cursor-exclusion
      className="relative h-[180vw] mt-[-100vh] w-screen bg-[#111111] max-sm:h-fit max-sm:mt-0"
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen flex w-full items-center justify-center max-sm:relative max-sm:h-fit max-sm:py-[10vh] max-sm:px-[15vw]"
      >
        {/* BASE TEXT — always in DOM */}
        <div
          data-cursor-size="150px"
          className="relative z-1 w-screen px-[5vw]"
        >
          <div className="text-[7vw] leading-[1.4] font-aeonik text-[#fbfbfb] uppercase max-sm:text-[12.7vw]">
            <div className="section-break-line-1 block w-full">
              We Don&apos;t
            </div>
            <div className="section-break-line-2 block w-full">
              Just Offer
            </div>
            <div className="section-break-line-3 block w-full">
             SOLUTIONS,We 
            </div>
            <div className="section-break-line-4 block w-full">
              Craft Impact
            </div>
          </div>
        </div>

        {/*
          REVEAL OVERLAY — always in DOM.
          Mask position + size are written directly by the GSAP ticker,
          bypassing React state entirely for zero-lag lerped cursor tracking.
        */}
        <div
          ref={revealOverlayRef}
          className="fixed top-0 left-0 z-3 h-screen w-screen pointer-events-none"
          style={{
            clipPath: "circle(0px at -9999px -9999px)",
            WebkitClipPath: "circle(0px at -9999px -9999px)",
          }}
        >
          {/* ORANGE BG */}
          <div className="absolute inset-0 bg-[#ff5f00]" />

          {/* REVEAL TEXT */}
          <div className="absolute inset-0 flex items-center justify-center w-fit">
            <div className="w-fit px-[5vw]">
              <div className="text-[7vw] leading-[1.4] font-aeonik text-white uppercase max-sm:text-[11vw]">
                <div className="section-break-reveal-1 block w-full">
                  We Make
                </div>
                <div className="section-break-reveal-2 block w-full">
                 Cool things 
                </div>
                <div className="section-break-reveal-3 block w-full">
                  that do 
                </div>
                <div className="section-break-reveal-4 block w-full">
                  great business
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionBreak;