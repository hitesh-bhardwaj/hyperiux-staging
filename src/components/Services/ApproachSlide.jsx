"use client";
import React, { useEffect } from "react";
import Copy from "../Animations/Copy";
// import { lineAnim } from "../gsapAnimations";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import HeadAnim from "../Animations/HeadAnim";

const ApproachSlide = () => {
  //   lineAnim();

  useEffect(() => {
    if (globalThis.innerWidth > 1024) {
      const ctx = gsap.context(() => {
        gsap.set(".solution-top-shutter", {
          translateY: 102,
        });
        gsap.to(".solution-top-shutter", {
          translateY: -1,
          ease: "none",
          stagger: { amount: 0.7, from: "end" },
          scrollTrigger: {
            trigger: ".solution-top-shutter-container",
            start: "top bottom",
            end: "bottom top",
            // markers:true,
            scrub: true,
          },
        });
        // gsap.set(".solution-bottom-shutter", {
        //   translateY: 102,
        // });
        // gsap.to(".solution-bottom-shutter", {
        //   translateY: -1,
        //   ease: "none",
        //   stagger: { amount: 0.7, from: "end" },
        //   scrollTrigger: {
        //     trigger: ".solution-bottom-shutter-container",
        //     start: "top bottom",
        //     end: "bottom top",
        //     // markers:true,
        //     scrub: true,
        //   },
        // });
      });
      return () => ctx.revert();
    }
  }, []);
  useGSAP(() => {
    if (globalThis.innerWidth > 1024) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#approach",
          start: "top 70%",
          end: "bottom top",
          scrub: true,
          // markers:true,
        },
      });
      tl.fromTo(
        ".step-1",
        {
          xPercent: 70,
        },
        {
          xPercent: -20,
        }
      )
        .fromTo(
          ".step-2",
          {
            xPercent: -20,
          },
          {
            xPercent: 50,
          },
          "<"
        )
        .fromTo(
          ".step-3",
          {
            xPercent: 70,
          },
          {
            xPercent: 0,
          },
          "<"
        )
        .fromTo(
          ".step-4",
          {
            xPercent: -50,
          },
          {
            xPercent: 50,
          },
          "<"
        )
        .fromTo(
          ".step-5",
          {
            xPercent: 150,
          },
          {
            xPercent: 0,
          },
          "<"
        );
    }
  });

  return (
    <>
      
      <section
        className="h-fit w-screen bg-white  py-[10%] approach-section  relative z-[22] overflow-hidden max-sm:mt-0 max-sm:py-[15%] max-sm:bg-black-1"
        id="approach"
      >
        <div className="px-[4vw] space-y-[10vw] text-[#111111] approach-content  max-sm:px-[7vw] max-sm:space-y-[20vw]">
          {/* <Copy> */}
          <HeadAnim>

            <h2 className="text-[5.4vw] relative approach-head text-[#111111] max-sm:text-[11vw] ">
              Our Approach
            </h2>

          </HeadAnim>
          {/* </Copy> */}
          <div className="flex flex-col items-end justify-between">
            <div className="w-full  space-y-[2vw] max-sm:space-y-[8vw]">
              <div className="w-full flex flex-col gap-[2vw] max-sm:gap-[8vw]">
                <div className="w-full flex flex-col justify-end step-1">
                  <Copy>
                    <h3 className="text-[8vw] leading-[1.2] uppercase  max-sm:text-[11vw] max-sm:mb-[7vw]">
                      Define
                    </h3>
                  </Copy>
                  <div className="w-[65%] max-sm:w-full">
                    <p className="text-[1.25vw]">
                     Develop a thorough understanding of the project, audience, and objectives to formulate a strategy
                    </p>
                  </div>
                </div>
                <span className="w-full h-[1px] bg-[#111111] block lineanim approach-line "></span>
              </div>
              <div className="w-full flex flex-col gap-[2vw] max-sm:gap-[8vw]">
                <div className="w-full flex flex-col justify-start step-2">
                    <Copy>
                      <h3 className="text-[8vw] leading-[1.2] uppercase max-sm:text-[11vw] max-sm:mb-[7vw]">
                        Design
                      </h3>
                    </Copy>
                    <div className="w-[70%] max-sm:w-full">
                      <p className="text-[1.25vw]">
                        Craft a purposeful design to reflect the objectives and indicate the direction for the entire project.
                      </p>
                    </div>

                </div>
                <span className="w-full h-[1px] bg-[#111111] block  lineanim approach-line"></span>
              </div>
              <div className="w-full flex flex-col gap-[2vw] max-sm:gap-[8vw]">
                <div className="w-full flex flex-col justify-end step-3">
                  
                    <Copy>
                      <h3 className="text-[8vw] leading-[1.2] uppercase max-sm:text-[11vw] max-sm:mb-[7vw]">
                        Implement
                      </h3>
                    </Copy>
                    <div className="w-[70%] max-sm:w-full">
                      <p className="text-[1.25vw]">
                        Bring the design to life in the form of an interactive and functional prototype. review, refine and optimise
                      </p>
                    </div>
                   
                </div>
                <span className="w-full h-[1px] bg-[#111111] block lineanim approach-line"></span>
              </div>
              <div className="w-full flex flex-col gap-[2vw] max-sm:gap-[8vw]">
                <div className="w-full flex flex-col justify-start step-4">
                    <Copy>
                      <h3 className="text-[8vw] leading-[1.2] uppercase max-sm:text-[11vw] max-sm:mb-[7vw]">
                        Develop
                      </h3>
                    </Copy>
                    <div className="w-[70%] max-sm:w-full">
                      <p className="text-[1.25vw]">
                        Craft a purposeful design to reflect the objectives and indicate the direction for the entire project.
                      </p>
                    </div>
                </div>
                <span className="w-full h-[1px] bg-[#111111] block lineanim approach-line"></span>
              </div>
              {/* <div className="w-full flex flex-col gap-[2vw] max-sm:gap-[8vw] ">
                <div className="w-full flex flex-col justify-end step-5">
                    <Copy>
                      <h3 className="text-[8vw] leading-[1.2] uppercase max-sm:text-[11vw] max-sm:mb-[7vw]">
                        Deliver
                      </h3>
                    </Copy>
                    <div className="w-[70%] max-sm:w-full">
                      <p className="text-[1.25vw]">
                        For BSFI-Fintech brands, we offer full-funnel digital
                        marketing solutions that power growth at every stage. 
                      </p>
                    </div>
                   
                </div>
                <span className="w-full h-[1px] bg-[#111111] block  lineanim approach-line"></span>
              </div> */}
            </div>
          </div>
        </div>
        <div></div>
      </section>
    </>
  );
};

export default ApproachSlide;
