"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import HeadAnim from "../Animations/HeadAnim";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function NewFaq({ allowMultiple = false, content }) {
  const [openIndexes, setOpenIndexes] = useState([]);
  const sectionRef = useRef(null);

  function toggleIndex(i) {
    if (allowMultiple) {
      setOpenIndexes((prev) =>
        prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
      );
    } else {
      setOpenIndexes((prev) => (prev.includes(i) ? [] : [i]));
    }
  }

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray(section.querySelectorAll("[data-faq-item]"));

      items.forEach((item) => {
        const line = item.querySelector("[data-faq-line]");
        const row = item.querySelector("[data-faq-row]");
        if (!line || !row) return;
        gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
        gsap.set(row, { autoAlpha: 0, y: 16 });
      });

      // Reveal strictly one-by-one as you scroll.
      ScrollTrigger.batch(items, {
        // Trigger a bit later so the draw is clearly visible.
        start: "top 70%",
        once: true,
        batchMax: 1,
        onEnter: (batch) => {
          const item = batch?.[0];
          if (!item) return;
          const line = item.querySelector("[data-faq-line]");
          const row = item.querySelector("[data-faq-row]");
          if (!line || !row) return;

          const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
          tl.to(line, { scaleX: 1, duration: 0.85 });
          tl.to(row, { autoAlpha: 1, y: 0, duration: 0.4 }, "-=0.45");
        },
      });
    }, section);

    return () => ctx.revert();
  }, [content]);

  return (
    <section
      ref={sectionRef}
      className="px-[5vw] pt-[5%] pb-[10%] w-full bg-[#fefefe] text-[#111111] relative max-sm:py-[15%] max-sm:min-h-screen max-md:min-h-screen dark z-40 max-sm:px-[7vw] overflow-hidden"
      id="faqs"
    >
      <div className="flex flex-col  gap-[5vw] max-sm:gap-[10vw] max-md:justify-center">
        <HeadAnim>
          <h2 className="w-[45%] text-[5.2vw] max-sm:text-[11vw] max-sm:w-full max-sm:text-left">
            In Case You Were Wondering
          </h2>
        </HeadAnim>

        <div className="w-full max-sm:w-full max-sm:space-y-[5vw] max-md:w-[90%] max-md:py-[3vw] max-md:space-y-[3vw] relative z-10">
          {content.map((f, i) => (
            <AccordionItem
              key={i}
              question={f.question}
              answer={f.answer}
              isOpen={openIndexes.includes(i)}
              onToggle={() => toggleIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function AccordionItem({ question, answer, isOpen, onToggle }) {
  const innerRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  useLayoutEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    const updateHeight = () => {
      setContentHeight(inner.scrollHeight);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(inner);

    return () => resizeObserver.disconnect();
  }, [answer]);

  return (
    <div
      data-faq-item
      className="w-full group overflow-hidden relative z-10 faq-tab fadeupanim accordion-block fadeup"
    >
      <div className="w-full mr-auto relative">
        {/* <div className="absolute bottom-0 left-0 w-full h-px bg-black/10" /> */}

        {/* Draw line (gray) on scroll, then hover/open fills orange left->right */}
        <div className="absolute bottom-0 left-0 w-full h-[2px]">
          <span
            data-faq-line
            className="absolute inset-0 z-[1] block h-full w-full origin-left bg-black/35"
          />
          <span
            aria-hidden="true"
            className={`absolute inset-0 z-[2] block h-full w-full origin-left bg-orange-500 scale-x-0 transition-[transform] duration-[500ms] ease-[cubic-bezier(0.215,0.61,0.355,1)] ${
              isOpen ? "scale-x-100" : "group-hover:scale-x-100"
            }`}
          />
        </div>

        <div className="inset-0 w-full relative">
          <div className="relative w-full h-full z-10 px-[3vw] max-sm:rounded-[2.5vw] content mix-blend-difference duration-300 max-sm:px-0">
            <button
              data-faq-row
              onClick={onToggle}
              aria-expanded={isOpen}
              className="cursor-pointer w-full h-full py-[3.5vw] flex items-center justify-between max-sm:pb-[7vw]"
            >
              <h4 className="text-[1.5vw] font-medium text-left leading-[1.2] max-sm:text-[4.5vw] max-sm:w-[80%] max-md:text-[3vw] max-md:w-[80%]">
                {question}
              </h4>

              <motion.div
                animate={{
                  rotate: isOpen ? 45 : 0,
                }}
                transition={{
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="w-[3vw] h-auto relative max-sm:w-[8vw] shrink-0"
              >
                <span className="w-[1.5vw] rounded-full h-0.5 bg-[#1a1a1a] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-sm:w-[5vw] max-sm:h-[1.5px]" />
                <span className="w-[1.5vw] rounded-full h-0.5 bg-[#1a1a1a] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 max-sm:w-[5vw] max-sm:h-[1.5px]" />
              </motion.div>
            </button>

            <motion.div
              initial={false}
              animate={{
                height: isOpen ? contentHeight : 0,
                opacity: isOpen ? 1 : 0,
              }}
              transition={{
                height: {
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                },
                opacity: {
                  duration: isOpen ? 0.35 : 0.2,
                  ease: "easeOut",
                },
              }}
              className="overflow-hidden will-change-[height]"
            >
              <motion.div
                ref={innerRef}
                animate={{
                  y: isOpen ? 0 : 16,
                }}
                transition={{
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="pb-[3.5vw] text-[1.25vw] w-4/5 max-sm:pb-[8vw] max-sm:w-[95%] max-sm:text-[4.2vw]"
              >
                <p>{answer}</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
