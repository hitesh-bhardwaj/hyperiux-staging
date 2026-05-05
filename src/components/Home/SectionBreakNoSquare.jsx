"use client";

import React, { useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import SolutionDesktop from "./Solution/SolutionDesktop";
import SectionBreak from "./SectionBreak";

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

    return {
      index,
      row,
      col,
      score,
    };
  }).sort((a, b) => b.score - a.score);
}

const SectionBreakSample = () => {
  const sectionRef = useRef(null);
  const maskRectsRef = useRef([]);
  const squareOrder = useMemo(() => getBottomToTopOrder(), []);

  // SVG SQUARE MASK ANIMATION ONLY
  useGSAP(() => {
    const orderedMaskRects = squareOrder
      .map((item) => maskRectsRef.current[item.index])
      .filter(Boolean);

    if (!orderedMaskRects.length) return;

    gsap.set(orderedMaskRects, {
      opacity: 1,
    });
    gsap.set("#solutions", {
      yPercent: 30,
    });

    const ml = gsap.timeline({
      scrollTrigger: {
        trigger: "#sectionBreak",
        start: "45% top",
        end: "bottom top",
        scrub: true,
      },
      defaults: {
        ease: "none",
      },
    });
    ml.to(".first-section", {
      yPercent: -130,
    }).to(
      "#solutions",
      {
        yPercent: -70,
      },
      "<",
    );

    const squareTl = gsap.timeline({
      scrollTrigger: {
        id: "sectionBreakSquareMask",
        trigger: "#sectionBreak",
        start: "45% top",
        end: "100% 50%",
        scrub: true,
        // markers: true,
      },
    });

    squareTl.to(orderedMaskRects, {
      opacity: 0,
      duration: 0.2,
      stagger: {
        each: 0.008,
        from: "start",
      },
      ease: "none",
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st?.vars?.id === "sectionBreakSquareMask") {
          st.kill();
        }
      });
    };
  }, [squareOrder]);

  // TEXT SPLIT ANIMATION ONLY
  useGSAP(
    () => {
      const waitForFonts = async () => {
        if (typeof document !== "undefined" && document.fonts?.ready) {
          try {
            await document.fonts.ready;
          } catch (_) {}
        }
      };

      let splits = [];

      const initTextAnimation = async () => {
        await waitForFonts();

        const section = sectionRef.current;
        if (!section) return;

        const mqlDesktop =
          typeof window !== "undefined" ? window.innerWidth > 1024 : true;

        const lineClasses = [
          ".section-break-line-1",
          ".section-break-line-2",
          ".section-break-line-3",
          ".section-break-line-4",
        ];

        const elements = lineClasses
          .map((cls) => section.querySelector(cls))
          .filter(Boolean);

        if (!elements.length) return;

        splits = elements.map(
          (el) =>
            new SplitText(el, {
              type: "lines,chars",
              mask: "lines",
              linesClass: "para-line",
            }),
        );

        splits.forEach((split) => {
          gsap.set(split.lines, {
            overflow: "hidden",
            display: "block",
          });

          gsap.set(split.chars, {
            y: 150,
          });
        });

        const textTl = gsap.timeline({
          scrollTrigger: {
            id: "sectionBreakTextSplit",
            trigger: section,
            start: mqlDesktop ? "5% top" : "2% 80%",
            end: mqlDesktop ? "45% top" : "45% 60%",
            scrub: true,
            // markers: true,
          },
        });

        splits
          .slice()
          .reverse()
          .forEach((split, index) => {
            textTl.to(
              split.chars,
              {
                y: 0,
                stagger: {
                  amount: mqlDesktop ? 0.3 : 0.2,
                  from: "end",
                },
                ease: "power2.out",
              },
              index === 0 ? 0 : "-=0.4",
            );
          });

        ScrollTrigger.refresh();
      };

      initTextAnimation();

      return () => {
        splits.forEach((split) => split?.revert());
        splits = [];

        ScrollTrigger.getAll().forEach((st) => {
          if (st?.vars?.id === "sectionBreakTextSplit") {
            st.kill();
          }
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
      className="relative z-[20] h-[224vw] w-screen bg-[#111111]  max-sm:h-fit max-sm:mt-0"
    >
      <div className="sticky top-0 h-fit w-screen">
        <div className=" h-fit w-screen z-[20]">
          <SectionBreak />
        </div>
      </div>
      <div className=" z-10 h-fit absolute bottom-0 pb-[10%] w-screen bg-[#fefefe] second-section">
        <SolutionDesktop />
      </div>
    </section>
  );
};

export default SectionBreakSample;
