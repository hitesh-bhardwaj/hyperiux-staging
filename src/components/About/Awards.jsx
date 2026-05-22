"use client";

import React, { useRef } from "react";
import ImagesAnimation from "./ImageAnimation";
import Copy from "../Animations/Copy";
import { SplitText } from "gsap/SplitText";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import HeadAnim from "../Animations/HeadAnim";

gsap.registerPlugin(SplitText, ScrollTrigger);

const Awards = () => {
  const awardsTextRef = useRef(null);

  const awardsData = [
    { name: "Awwwards", title: "Site Of The Day", year: "2020" },
    { name: "Awwwards", title: "Developer Award", year: "2021" },
    { name: "CSS Design Awards", title: "Website of the Year", year: "2021" },
    { name: "FWA", title: "Site Of The Month", year: "2022" },
    { name: "Webby Awards", title: "Best Visual Design", year: "2022" },
    { name: "Behance", title: "Interaction Design Award", year: "2023" },
  ];

  return (
    <section
      ref={awardsTextRef}
      className="h-full w-screen px-[4vw] pb-[5vw] relative z-[3] bg-[#fefefe] max-sm:px-[7vw] max-sm:py-[15%]"
      id="awards"
    >
      <ImagesAnimation awardsRef={awardsTextRef} />

      <div className="w-full h-full max-sm:space-y-[20vw]">
        <div className="w-full h-[70vh] relative max-sm:h-fit">
          <div className="text-center flex items-center justify-center h-full">
            <HeadAnim delay={0.2}>
              <h2 className="uppercase text-[20.5vw] text-[#111111] tracking-tight max-sm:text-[19vw]">
                AWARDS
              </h2>
            </HeadAnim>
          </div>
        </div>

        <div className="space-y-[2vw] pb-[3vw] max-sm:space-y-[8vw]">
          {awardsData.map((award, idx) => (
            <div
              key={idx}
              className="flex w-full justify-between relative pb-[1.5vw] group max-sm:items-end max-sm:pb-[3vw]"
            >
              <div className="flex items-center justify-center gap-[7vw] max-sm:flex-col max-sm:items-start max-sm:gap-[2vw]">
                <Copy>
                  <p className="text-[1.8vw] text-[#111111] font-aeonik w-[18vw] max-sm:w-fit max-sm:text-[7vw]">
                    {award.name}
                  </p>
                </Copy>

                <Copy>
                  <p className="capitalize font-medium text-[#868686] text-[1.565vw] max-sm:text-[4.2vw]">
                    {award.title}
                  </p>
                </Copy>
              </div>

              <div>
                <Copy>
                  <p className="text-[#868686] text-[1.565vw] font-aeonik max-sm:text-[4vw]">
                    {award.year}
                  </p>
                </Copy>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-black/10 lineanim" />

              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-orange-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 z-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Awards;