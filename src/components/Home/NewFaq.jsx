"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import Copy from "../Animations/Copy";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import HeadAnim from "../Animations/HeadAnim";
gsap.registerPlugin(ScrollTrigger);
export default function NewFaq({ allowMultiple = false, content }) {
  // keep track of which indexes are open
  const [openIndexes, setOpenIndexes] = useState([]);

  function toggleIndex(i) {
    if (allowMultiple) {
      // multiple: toggle in/out of the array
      setOpenIndexes((prev) =>
        prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
      );
    } else {
      // single: either clear or only keep this one
      setOpenIndexes((prev) => (prev.includes(i) ? [] : [i]));
    }
  }
  useLayoutEffect(() => {
    ScrollTrigger.refresh();
  }, [openIndexes]);


  return (
    <section
      className="px-[5vw] pb-[10%] w-full bg-[#fefefe] text-[#111111] relative max-sm:py-[15%] max-sm:min-h-screen max-md:min-h-screen dark z-[40] max-sm:px-[7vw]"
      id="faqs"
    >
      <div className="flex flex-col items-center gap-[5vw] max-sm:gap-[10vw] max-md:justify-center max-sm:items-start">
        {/* <Copy> */}
        <HeadAnim>
          <h2 className="w-[68%] text-center text-[6.5vw] max-sm:text-[11vw] max-sm:w-full max-sm:text-left">
            In Case You Were Wondering
          </h2>
        </HeadAnim>
        {/* </Copy> */}
        
        <div className="w-full  max-sm:w-full max-sm:space-y-[5vw] max-md:w-[90%] max-md:py-[3vw] max-md:space-y-[3vw] relative z-[10]">
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

// M 0 100 V 0 Q 50 0 100 0 V 0 H 0 z

function AccordionItem({ question, answer, isOpen, onToggle }) {
  const coverRef = useRef();

  return (
    <div className="w-full group  overflow-hidden relative z-[10] faq-tab fadeupanim accordion-block group">
      <div className="w-full mr-auto relative">
        {/* Base line (always visible) */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-black/10"></div>

        {/* Hover animated orange line */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-orange-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700"></div>

        <div className="inset-0 w-full relative">
          <div
            ref={coverRef}
            className="w-full h-full bg-[#111111] absolute top-0 z-0 left-0 origin-top scale-y-0"
          />
          <div className="relative w-full h-full z-10 px-[3vw] max-sm:rounded-[2.5vw] content mix-blend-difference duration-300 max-sm:px-0">
            <button
              onClick={onToggle}
              aria-expanded={isOpen}
              className="cursor-pointer w-full h-full py-[3.5vw] flex items-center justify-between max-sm:pb-[7vw]"
            >
              <h4 className="text-[1.5vw] font-medium text-left leading-[1.2] max-sm:text-[4.5vw] max-sm:w-[80%] max-md:text-[3vw] max-md:w-[80%]">
                {question}
              </h4>
              <div
              style={{ transitionTimingFunction: "cubic-bezier(0.625, 0.05, 0, 1)" }}
                className={`w-[3vw] h-auto relative duration-700 max-sm:w-[8vw] ${
                  !isOpen ? "group-hover:rotate-[180deg]" : "group-hover:rotate-[315deg] rotate-[45deg]"
                }`}
              >
                <span className="w-[1.5vw] rounded-full h-[2px] bg-[#1a1a1a] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 duration-300 transform-origin-center max-sm:w-[5vw] max-sm:h-[1.5px]"></span>

                <span
               
                  className={`w-[1.5vw] rounded-full h-[2px] bg-[#1a1a1a] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 duration-300 transform-origin-center max-sm:w-[5vw] max-sm:h-[1.5px] ${
                    isOpen ? "rotate-90" : "rotate-90"
                  }`}
                ></span>
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0, y: 20 }}
                  animate={{ height: "auto", opacity: 1, y: 0 }}
                  onAnimationComplete={() => {
                    ScrollTrigger.refresh();
                  }}
                  exit={{ height: 0, opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="pb-[3.5vw] w-4/5 max-sm:pb-[8vw] max-sm:w-[95%] max-sm:text-[4.2vw]">
                    <p>{answer}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
