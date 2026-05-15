"use client";

import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";

import { motion } from "framer-motion";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const COLS = 20;
const ROWS = 12;
const TOTAL = COLS * ROWS;

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

function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });
  useEffect(() => {
    const update = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", update);
    return () => window.removeEventListener("mousemove", update);
  }, []);
  return mousePosition;
}

function useIsPointerFine() {
  const [isPointerFine, setIsPointerFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setIsPointerFine(mq.matches);
    const handler = (e) => setIsPointerFine(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isPointerFine;
}

const SectionBreak = () => {
  const sectionRef = useRef(null);
  const maskRectsRef = useRef([]);
  const revealOverlayRef = useRef(null);

  const squareOrder = useMemo(() => getBottomToTopOrder(), []);

  const [isHovered, setIsHovered] = useState(false);
  const [isInSection, setIsInSection] = useState(false);
  const [smoothPos, setSmoothPos] = useState(null);
  const smoothSizeRef = useRef(0);
  const [smoothSize, setSmoothSize] = useState(0);

  const { x, y } = useMousePosition();
  const isPointerFine = useIsPointerFine();

  // 0 outside section, 40 idle inside, 500 hovering text area
  const targetSize = !isInSection ? 0 : isHovered ? 500 : 40;

  useEffect(() => {
    if (!isPointerFine) return;
    let animationFrame;
    const lerp = (start, end, factor) => start + (end - start) * factor;
    const animate = () => {
      setSmoothPos((prev) => {
        if (x === null || y === null) return prev;
        if (prev === null) return { x, y };
        return { x: lerp(prev.x, x, 0.15), y: lerp(prev.y, y, 0.15) };
      });
      // Lerp size so scale-in and scale-out are smooth
      smoothSizeRef.current = lerp(smoothSizeRef.current, targetSize, 0.1);
      setSmoothSize(smoothSizeRef.current);
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [x, y, isPointerFine, targetSize]);

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
        ];

        const revealClasses = [
          ".section-break-reveal-1",
          ".section-break-reveal-2",
          ".section-break-reveal-3",
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

        // Hide all chars below their line containers
        splits.forEach((split) => {
          gsap.set(split.lines, { overflow: "hidden", display: "block" });
          gsap.set(split.chars, { y: 150 });
        });

        const textTl = gsap.timeline({
          scrollTrigger: {
            id: "sectionBreakTextSplit",
            trigger: section,
            start: mqlDesktop ? "5% top" : "2% 80%",
            end: mqlDesktop ? "35% top" : "45% 60%",
            scrub: true,
          },
        });

        const lineCount = baseEls.length;
        const staggerAmount = mqlDesktop ? 0.3 : 0.2;

        // For each line, add the base tween first, then immediately add the
        // reveal tween at "<" (same start time). Both tweens share identical
        // stagger params so every char rises in perfect lockstep.
        // We do NOT merge the arrays — that caused reveal chars to stagger
        // after base chars since they came second in the combined array.
        for (let i = lineCount - 1; i >= 0; i--) {
          const insertAt = i === lineCount - 1 ? 0 : "-=0.4";

          // Base line tween
          textTl.to(
            baseSplits[i].chars,
            {
              y: 0,
              stagger: { amount: staggerAmount, from: "end" },
              ease: "power2.out",
            },
            insertAt,
          );

          // Reveal line tween — starts at EXACTLY the same timeline position
          // as the base tween above ("< " = start of previous tween)
          if (revealSplits[i]) {
            textTl.to(
              revealSplits[i].chars,
              {
                y: 0,
                stagger: { amount: staggerAmount, from: "end" },
                ease: "power2.out",
              },
              "<", // ← same moment as base tween, not after it
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
      className="relative z-20 h-[220vw] mt-[-100vh] w-screen bg-[#111111] max-sm:h-fit max-sm:mt-0"
      onMouseEnter={() => setIsInSection(true)}
      onMouseLeave={() => { setIsInSection(false); setIsHovered(false); }}
    >
      <div
        className="sticky top-0 h-screen flex w-full items-center justify-center max-sm:relative max-sm:h-fit max-sm:py-[10vh] max-sm:px-[15vw]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* BASE TEXT — always in DOM */}
        <div
          data-cursor-size="150px"
          className="relative z-1 w-screen text-center"
        >
          <div className="text-[7vw] leading-normal font-aeonik text-[#fbfbfb] uppercase max-sm:text-[12.7vw]">
            <div className="section-break-line-1 block w-full">
              We Don&apos;t
            </div>
            <div className="section-break-line-2 block w-full">
              Just Offer SOLUTIONS
            </div>
            <div className="section-break-line-3 block w-full">
              We Craft Impact
            </div>
          </div>
        </div>

        {/*
          REVEAL OVERLAY — always in DOM (never conditionally rendered).
          Keeping it always mounted means GSAP can split + set y:150 on
          the reveal chars at the same time as the base chars on mount.
          Visibility is controlled purely by WebkitMaskSize (0px when idle).
        */}
        <motion.div
          ref={revealOverlayRef}
          className="fixed top-0 left-0 w-screen h-screen z-3 pointer-events-none"
          style={{
            WebkitMaskImage:
              "radial-gradient(circle at center, black 50%, transparent 51%)",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "-9999px -9999px",
            WebkitMaskSize: "0px 0px",
          }}
          animate={
            isPointerFine && smoothPos !== null
              ? {
                  WebkitMaskPosition: `${smoothPos.x - smoothSize / 2}px ${smoothPos.y - smoothSize / 2}px`,
                  WebkitMaskSize: `${smoothSize}px ${smoothSize}px`,
                }
              : {
                  WebkitMaskPosition: "-9999px -9999px",
                  WebkitMaskSize: "0px 0px",
                }
          }
          transition={{
            duration: 0,
          }}
        >
          {/* ORANGE BG */}
          <div className="absolute inset-0 bg-[#ff5f00]" />

          {/* REVEAL TEXT */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-screen text-center">
              <div className="text-[7vw] leading-normal font-aeonik text-white uppercase max-sm:text-[11vw]">
                <div className="section-break-reveal-1 block w-full">
                  We Make Cool
                </div>
                <div className="section-break-reveal-2 block w-full">
                 things that do 
                </div>
                <div className="section-break-reveal-3 block w-full">
                  great business
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SectionBreak;