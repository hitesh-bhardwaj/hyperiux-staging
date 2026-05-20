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
      const items = gsap.utils.toArray(
        section.querySelectorAll("[data-faq-item]")
      );

      items.forEach((item) => {
        const line = item.querySelector("[data-faq-line]");
        const row = item.querySelector("[data-faq-row]");

        if (!line || !row) return;

        gsap.set(line, {
          scaleX: 0,
          transformOrigin: "left center",
        });

        gsap.set(row, {
          autoAlpha: 0,
          y: 16,
        });
      });

      ScrollTrigger.batch(items, {
        start: "top 80%",
        once: true,
        batchMax: 1,
        onEnter: (batch) => {
          const item = batch?.[0];
          if (!item) return;

          const line = item.querySelector("[data-faq-line]");
          const row = item.querySelector("[data-faq-row]");

          if (!line || !row) return;

          const tl = gsap.timeline({
            defaults: {
              ease: "power2.out",
            },
          });

          tl.to(line, {
            scaleX: 1,
            duration: 0.85,
          });

          tl.to(
            row,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.4,
            },
            "-=0.45"
          );
        },
      });
    }, section);

    return () => ctx.revert();
  }, [content]);

  return (
    <section
      ref={sectionRef}
      className="dark relative z-40 w-full overflow-hidden bg-[#fefefe] px-[5vw] pb-[10%] pt-[5%] text-[#111111] max-md:min-h-screen max-sm:min-h-screen max-sm:px-[7vw] max-sm:py-[15%]"
      id="faqs"
    >
      <div className="flex flex-col gap-[5vw] max-md:justify-center max-sm:gap-[10vw]">
        <HeadAnim>
          <h2 className="w-[65%] text-[6.5vw] max-sm:w-full max-sm:text-left max-sm:text-[11vw]">
            In Case You Were Wondering
          </h2>
        </HeadAnim>

        <div className="relative z-10 w-full max-md:w-[90%] max-md:space-y-[3vw] max-md:py-[3vw] max-sm:w-full max-sm:space-y-[5vw]">
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
  const itemRef = useRef(null);
  const innerRef = useRef(null);
  const fillLineRef = useRef(null);
  const isHoveringRef = useRef(false);

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

  useLayoutEffect(() => {
    const line = fillLineRef.current;
    if (!line) return;

    gsap.set(line, {
      scaleX: 0,
      transformOrigin: "left center",
    });
  }, []);

  useLayoutEffect(() => {
    const line = fillLineRef.current;
    if (!line) return;

    gsap.killTweensOf(line);

    if (isOpen) {
      gsap.set(line, {
        transformOrigin: "left center",
      });

      gsap.to(line, {
        scaleX: 1,
        duration: 0.7,
        ease: "power3.inOut",
        overwrite: true,
      });
    } else {
      gsap.set(line, {
        transformOrigin: "right center",
      });

      gsap.to(line, {
        scaleX: 0,
        duration: 0.7,
        ease: "power3.inOut",
        overwrite: true,
      });
    }
  }, [isOpen]);

  const showFillLine = () => {
    const line = fillLineRef.current;
    if (!line) return;

    isHoveringRef.current = true;

    gsap.killTweensOf(line);

    gsap.set(line, {
      transformOrigin: "left center",
    });


  };

  const hideFillLine = () => {
    const line = fillLineRef.current;
    if (!line) return;

    isHoveringRef.current = false;

    if (isOpen) return;

    gsap.killTweensOf(line);

    gsap.to(line, {
      scaleX: 0,
      duration: 0.7,
      ease: "power3.inOut",
      overwrite: true,
    });
  };

  return (
    <div
      ref={itemRef}
      data-faq-item
      onPointerEnter={(e) => {
        if (e.pointerType === "touch") return;
        showFillLine();
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "touch") return;
        hideFillLine();
      }}
      className="accordion-block faq-tab fadeup fadeupanim relative z-10 w-full overflow-hidden"
    >
      <div className="relative mr-auto w-full">
        <div className="absolute bottom-0 left-0 z-[20] h-[2px] w-full overflow-hidden">
          <span
            data-faq-line
            className="absolute inset-0 z-[1] block h-full w-full origin-left bg-[#D9D9D9]"
          />

          <span
            ref={fillLineRef}
            aria-hidden="true"
            className="line-fill absolute inset-0 z-[2] block h-full w-full origin-left scale-x-0 bg-orange-500"
          />
        </div>

        <div className="relative inset-0 w-full">
          <div className="content relative z-10 h-full w-full px-[3vw] mix-blend-difference duration-300 max-sm:rounded-[2.5vw] max-sm:px-0">
            <button
              data-faq-row
              onClick={onToggle}
              aria-expanded={isOpen}
              className="flex h-full w-full cursor-pointer items-center justify-between py-[3.5vw] max-sm:pb-[7vw]"
            >
              <h4 className="text-left text-[1.45vw] font-medium leading-[1.2] max-md:w-[80%] max-md:text-[3vw] max-sm:w-[80%] max-sm:text-[4.5vw]">
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
                className="relative h-auto w-[3vw] shrink-0 max-sm:w-[8vw]"
              >
                <span className="absolute left-1/2 top-1/2 h-0.5 w-[1.5vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1a1a1a] max-sm:h-[1.5px] max-sm:w-[5vw]" />
                <span className="absolute left-1/2 top-1/2 h-0.5 w-[1.5vw] -translate-x-1/2 -translate-y-1/2 rotate-90 rounded-full bg-[#1a1a1a] max-sm:h-[1.5px] max-sm:w-[5vw]" />
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
                className="w-4/5 pb-[3.5vw] text-[1.25vw] max-sm:w-[95%] max-sm:pb-[8vw] max-sm:text-[4.2vw]"
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