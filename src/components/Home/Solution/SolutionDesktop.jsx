"use client";
import gsap from "gsap";
import Flip from "gsap/dist/Flip";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useEffect } from "react";
import Link from "next/link";
import { LinkButton } from "@/components/Buttons";
import HeadAnim from "@/components/Animations/HeadAnim";


gsap.registerPlugin(Flip, ScrollTrigger, useGSAP);

var gridItemClickListeners = [];
function repositionItems(clickedItem) {
  const currentState = Flip.getState(".ser-grid-item");
  const slot1 = document.querySelector('[ser-slot="1"]');
  const slot2 = document.querySelector('[ser-slot="2"]');
  const slot3 = document.querySelector('[ser-slot="3"]');
  const slot4 = document.querySelector('[ser-slot="4"]');
  const currSlot1Item = slot1.querySelector(".ser-grid-item");
  const currSlot2Item = slot2.querySelector(".ser-grid-item");
  const currSlot3Item = slot3.querySelector(".ser-grid-item");
  const currSlot4Item = slot4.querySelector(".ser-grid-item");
  if (clickedItem === currSlot1Item) {
    return;
  }
  slot1.appendChild(clickedItem);
  clickedItem.classList.add("is--active");
  if (currSlot1Item) {
    slot4.appendChild(currSlot1Item);
  }
  if (currSlot4Item && clickedItem !== currSlot4Item) {
    slot3.appendChild(currSlot4Item);
  } else if (currSlot3Item && clickedItem !== currSlot3Item) {
    slot3.appendChild(currSlot3Item);
  }
  if (
    currSlot3Item &&
    clickedItem !== currSlot3Item &&
    clickedItem !== currSlot4Item
  ) {
    slot2.appendChild(currSlot3Item);
  } else if (currSlot2Item && clickedItem !== currSlot2Item) {
    slot2.appendChild(currSlot2Item);
  }
  Flip.from(currentState, {
    duration: 0.6,
    ease: "power1.inOut",
  });
  document.querySelectorAll(".ser-grid-item").forEach((item) => {
    if (item !== slot1.querySelector(".ser-grid-item")) {
      item.classList.remove("is--active");
      gsap.to(item.querySelector(".is-ser-title"), {
        scale: 1,
        color: "#1a1a1a",
        duration: 0.6,
        ease: "power1.out",
      });
      gsap.to(item.querySelector(".ser-info-w"), {
        opacity: 0,
        duration: 0.4,
        color: "#1a1a1a",
        ease: "power1.out",
      });
      gsap.to(item.querySelector(".ser-grid-item-bg"), {
        opacity: 0,
        duration: 0.4,
        ease: "power1.out",
      });
      gsap.to(item.querySelector(".ser-links .link-line"), {
        color: "#1a1a1a",
        duration: 0.6,
        ease: "power1.out",
      });
    }
  });
  gsap.to(clickedItem.querySelector(".is-ser-title"), {
    scale: 0.9,
    color: clickedItem.classList.contains("ser-design") || clickedItem.classList.contains("ser-strategy") ? "#fefefe" : "#1a1a1a",
    duration: 0.6,
    ease: "power1.in",
  });
  gsap.to(clickedItem.querySelector(".ser-info-w"), {
    color: clickedItem.classList.contains("ser-design") || clickedItem.classList.contains("ser-strategy") ? "#fefefe" : "#1a1a1a",
    opacity: 1,
    duration: 0.5,
    ease: "power1.out",
    overwrite: "auto",
  }, "<");
  gsap.to(clickedItem.querySelector(".ser-grid-item-bg"), {
    opacity: 1,
    duration: 0.5,
    ease: "power1.out",
    delay: 0.4,
    overwrite: "auto",
  });
 
}

function initServGrid() {
  // Set initial states for active and inactive items
  gsap.set(".ser-grid-item.is--active .is-ser-title", {
    scale: 0.9,
    color: document.querySelector(".ser-grid-item.is--active").classList.contains("ser-design") || document.querySelector(".ser-grid-item.is--active").classList.contains("ser-strategy") ? "#fefefe" : "#1a1a1a",
  });
  gsap.set(".ser-grid-item.is--active .ser-info-w", {
    opacity: 1,
  });
  gsap.set(".ser-grid-item.is--active .ser-grid-item-bg", {
    opacity: 1,
  });
  // gsap.set(".ser-grid-item.is--active .ser-links .link-line", {
  //   color: document.querySelector(".ser-grid-item.is--active").classList.contains("ser-design") || document.querySelector(".ser-grid-item.is--active").classList.contains("ser-strategy") ? "#fefefe" : "#1a1a1a",
  // });
  gsap.set(".ser-grid-item:not(.is--active) .ser-info-w", {
    opacity: 0,
  });
  gsap.set(".ser-grid-item:not(.is--active) .ser-grid-item-bg", {
    opacity: 0,
  });
  gsap.set(".ser-grid-item:not(.is--active) .is-ser-title", {
    color: "#1a1a1a",
  });
  // gsap.set(".ser-grid-item:not(.is--active) .ser-links .link-line", {
  //   color: "#1a1a1a",
  // });
  const gridItems = document.querySelectorAll(".ser-grid-item");
  gridItems.forEach((item) => {
    const clickListener = function () {
      repositionItems(item);
    };
    item.addEventListener("click", clickListener);
    gridItemClickListeners.push(clickListener);
  });
}

function destroyServGrid() {
  const gridItems = document.querySelectorAll(".ser-grid-item");
  gridItems.forEach((item, index) => {
    item.removeEventListener("click", gridItemClickListeners[index]);
  });
  gridItemClickListeners = [];
}

function initServices() {
  initServGrid();
}

function destroyServices() {
  destroyServGrid();
}

const SolutionDesktop = () => {


  useGSAP(() => {
    if (globalThis.innerWidth < 541) {
    } else {
      initServices();
      const fadeUps = document.querySelectorAll(".serviceFadeUp");
      fadeUps.forEach((fadeUp) => {
        gsap.fromTo(
          fadeUp,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "Power3.out",
            scrollTrigger: {
              trigger: fadeUp,
              start: "top 85%",
            },
          }
        );
      });
      return () => {
        destroyServices();
      };
    }
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".shutter", {
        translateY: 102,
      });
      gsap.to(".shutter", {
        translateY: -1,
        ease: "none",
        stagger: { amount: 0.7, from: "end" },
        scrollTrigger: {
          trigger: ".shutter-container",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      
     
      <section className="bg-[#fefefe] pb-[2%] pt-[5%] h-fit w-full px-[5vw] relative z-[22] space-y-[4vw] max-sm:hidden" id="solutions">
        <div className="text-[#111111] text-[6.5vw] font-display z-[23] flex flex-col leading-[1.2] solutions-head max-sm:hidden">
        <HeadAnim>
          <h2 className="w-full">
            Explore <br/> Our Solutions
          </h2>
        </HeadAnim>
      </div>
        <div className="grid grid-cols-2 grid-rows-3 gap-[2vw]  min-h-[46vw] bg-[#fefefe] ">
          <div
            ser-slot="1"
            className="relative pointer-events-auto z-[99] serviceFadeUp ser-grid-slot is--active col-span-1 col-start-1 row-span-3 row-start-1 "
          >
            <div className="ser-grid-item is--active ser-design">
              <div className="absolute ser-grid-item-bg inset-0 opacity-0" />
              <div className="ser-grid-item-div ser-design  ">
                <div className="ser-content-w">
                  <div className="ser-titles-w">
                    <div className="ser-titles">
                      <h3 className="text-[2.5vw] is-ser-title  ">
                        Design
                      </h3>
                    </div>
                    <div className="ser-cross-w relative">
                      <div className="ser-cross w-embed   rotate-45">
                        <svg
                          width="31"
                          height="30"
                          className="w-full h-full object-cover"
                          viewBox="0 0 31 30"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2.06152 1.58789L29.0527 28.5791"
                            stroke="#1A1A1A"
                            strokeWidth="2.38571"
                            strokeLinecap="round"
                          />
                          <path
                            d="M2.06152 28.5796L29.0527 1.58841"
                            stroke="#1A1A1A"
                            strokeWidth="2.38571"
                            strokeLinecap="round"
                          />

                        </svg>
                      </div>
                      <div  className="absolute top-[5%] right-[10%] w-[8vw]">
                        <LinkButton text={"Learn More"} href={"#"} hover={true} className="text-white ser-links"/>
                      </div>
                    </div>
                  </div>
                  <div className="ser-info-100 px-[2%] ">
                    <div className="ser-info-w">
                      <div className="ser-info-abs">
                        <div className="ser-info-group">
                          <p className="font-medium mb-[2vw]">
                            A human-centred, design-led approach to product development that leverages cutting-edge technologies & agile methodology, committed to putting you on a path to success in the ever-changing technological landscape. We craft digital solutions that are not just functional, but also intuitive and engaging.
                          </p>
                        </div>
                        <div className="  flex flex-wrap  gap-x-[5vw] gap-y-[1.2vw]">
                          {Array.from({ length: 18 }).map((_, i) => (
                            <Link
                              key={i}
                              href="#"
                              data-split="letters"
                              data-letters-delay
                              className={`w-[40%] h-[2vw] relative links solutions-link buttonSplit`}
                            >
                              <div className="overflow-clip">
                                <p className="text-[0.9vw] uppercase buttonTextShadow ">
                                  User Interface Design
                                </p>
                              </div>
                              <span className="w-full h-[1px] bg-[#111111] mt-[1vw] block" />
                            </Link>
                          ))}
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            ser-slot="2"
            className="relative pointer-events-auto z-[99] serviceFadeUp ser-grid-slot col-span-1 col-start-2 row-span-1 row-start-1 "
          >
            <div className="ser-grid-item ser-development">
              <div className="absolute ser-grid-item-bg inset-0 opacity-0" />
              <div data-cursor-size="80px" data-cursor-color="#1a1a1a" data-cursor-text="Click" className="ser-grid-item-div ">
                <div className="ser-content-w">
                  <div className="ser-titles-w">
                    <div className="ser-titles">
                      <h3 className="text-[2.5vw] is-ser-title  ">
                        Development
                      </h3>
                    </div>
                    <div className="ser-cross-w relative">
                      <div className="ser-cross w-embed   rotate-45">
                        <svg
                          width="31"
                          className="w-full h-full object-cover"
                          height="30"
                          viewBox="0 0 31 30"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2.06152 1.58789L29.0527 28.5791"
                            stroke="#1A1A1A"
                            strokeWidth="2.38571"
                            strokeLinecap="round"
                          />
                          <path
                            d="M2.06152 28.5796L29.0527 1.58841"
                            stroke="#1A1A1A"
                            strokeWidth="2.38571"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <div  className="absolute top-[5%] right-[10%] w-[8vw]">
                        <LinkButton text={"Learn More"} href={"#"} hover={true} className="text-[#111111] ser-links"/>
                      </div>
                    </div>
                  </div>
                  <div className="ser-info-100 px-[2%] pl-[2.5%]  ">
                    <div className="ser-info-w">
                      <div className="ser-info-abs">
                        <div className="ser-info-group">
                          <p className="font-medium mb-[2vw]">
                            A human-centred, design-led approach to product development that leverages cutting-edge technologies & agile methodology, committed to putting you on a path to success in the ever-changing technological landscape. We craft digital solutions that are not just functional, but also intuitive and engaging.
                          </p>
                        </div>
                        <div className="  flex flex-wrap  gap-x-[5vw] gap-y-[1.2vw]">
                          {Array.from({ length: 18 }).map((_, i) => (
                            <Link
                              key={i}
                              href="#"
                              data-split="letters"
                              data-letters-delay
                              className={`w-[40%] h-[2vw] relative links solutions-link buttonSplit`}
                            >
                              <div className="overflow-clip">
                                <p className="text-[0.9vw] uppercase buttonTextShadow ">
                                  User Interface Design
                                </p>
                              </div>
                              <span className="w-full h-[1px] bg-[#111111] mt-[1vw] block" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            ser-slot="3"
            className="relative pointer-events-auto z-[99] serviceFadeUp ser-grid-slot col-span-1 col-start-2 row-span-1 row-start-2 "
          >
            <div className="ser-grid-item ser-strategy">
              <div className="absolute ser-grid-item-bg inset-0 opacity-0" />
              <div data-cursor-size="80px" data-cursor-color="#1a1a1a" data-cursor-text="Click" className="ser-grid-item-div ">
                <div className="ser-content-w">
                  <div className="ser-titles-w">
                    <div className="ser-titles">
                      <h3 className="text-[2.5vw] is-ser-title  ">
                        Strategy
                      </h3>
                    </div>
                    <div className="ser-cross-w relative">
                      <div className="ser-cross w-embed   rotate-45">
                        <svg
                          width="31"
                          className="w-full h-full object-cover"
                          height="30"
                          viewBox="0 0 31 30"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2.06152 1.58789L29.0527 28.5791"
                            stroke="#1A1A1A"
                            strokeWidth="2.38571"
                            strokeLinecap="round"
                          />
                          <path
                            d="M2.06152 28.5796L29.0527 1.58841"
                            stroke="#1A1A1A"
                            strokeWidth="2.38571"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <div  className="absolute top-[5%] right-[10%] w-[8vw]">
                        <LinkButton text={"Learn More"} href={"#"} hover={true} className="text-white ser-links"/>
                      </div>
                    </div>
                  </div>
                  <div className="ser-info-100 px-[2%] ">
                    <div className="ser-info-w">
                      <div className="ser-info-abs">
                        <div className="ser-info-group">
                          <p className="font-medium mb-[2vw]">
                            A human-centred, design-led approach to product development that leverages cutting-edge technologies & agile methodology, committed to putting you on a path to success in the ever-changing technological landscape. We craft digital solutions that are not just functional, but also intuitive and engaging.
                          </p>
                        </div>
                        <div className="  flex flex-wrap  gap-x-[5vw] gap-y-[1.2vw]">
                          {Array.from({ length: 18 }).map((_, i) => (
                            <Link
                              key={i}
                              href="#"
                              data-split="letters"
                              data-letters-delay
                              className={`w-[40%] h-[2vw] relative links solutions-link buttonSplit`}
                            >
                              <div className="overflow-clip">
                                <p className="text-[0.9vw] uppercase buttonTextShadow ">
                                  User Interface Design
                                </p>
                              </div>
                              <span className="w-full h-[1px] bg-[#111111] mt-[1vw] block" />
                            </Link>
                          ))}
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            ser-slot="4"
            className="relative pointer-events-auto z-[99] serviceFadeUp ser-grid-slot col-span-1 col-start-2 row-span-1 row-start-3 "
          >
            <div className="ser-grid-item ser-marketing">
              <div className="absolute ser-grid-item-bg inset-0 opacity-0" />
              <div data-cursor-size="80px" data-cursor-color="#1a1a1a" data-cursor-text="Click" className="ser-grid-item-div ">
                <div className="ser-content-w">
                  <div className="ser-titles-w">
                    <div className="ser-titles">
                      <h3 className="text-[2.5vw] is-ser-title  ">
                        Marketing
                      </h3>
                    </div>
                    <div className="ser-cross-w relative">
                      <div className="ser-cross w-embed    rotate-45">
                        <svg
                          width="31"
                          className="w-full h-full object-cover"
                          height="30"
                          viewBox="0 0 31 30"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2.06152 1.58789L29.0527 28.5791"
                            stroke="#1A1A1A"
                            strokeWidth="2.38571"
                            strokeLinecap="round"
                          />
                          <path
                            d="M2.06152 28.5796L29.0527 1.58841"
                            stroke="#1A1A1A"
                            strokeWidth="2.38571"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                       <div className="absolute top-[5%] right-[10%] w-[8vw]" >
                        <LinkButton text={"Learn More"} href={"#"} hover={true} className="text-[#111111] ser-links"/>
                      </div>
                    </div>
                  </div>
                  <div className="ser-info-100 px-[2%] ">
                    <div className="ser-info-w">
                      <div className="ser-info-abs">
                        <div className="ser-info-group">
                          <p className="font-medium mb-[2vw]">
                            A human-centred, design-led approach to product development that leverages cutting-edge technologies & agile methodology, committed to putting you on a path to success in the ever-changing technological landscape. We craft digital solutions that are not just functional, but also intuitive and engaging.
                          </p>
                        </div>
                        <div className="  flex flex-wrap  gap-x-[5vw] gap-y-[1.2vw]">
                          {Array.from({ length: 18 }).map((_, i) => (
                            <Link
                              key={i}
                              href="#"
                              data-split="letters"
                              data-letters-delay
                              className={`w-[40%] h-[2vw] relative links solutions-link buttonSplit`}
                            >
                              <div className="overflow-clip">
                                <p className="text-[0.9vw] uppercase buttonTextShadow ">
                                  User Interface Design
                                </p>
                              </div>
                              <span className="w-full h-[1px] bg-[#111111] mt-[1vw] block" />
                            </Link>
                          ))}
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SolutionDesktop;
