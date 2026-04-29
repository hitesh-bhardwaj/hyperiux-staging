"use client";
import Image from "next/image";
import React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { LinkButton } from "../Buttons";
import HeadAnim from "../Animations/HeadAnim";
gsap.registerPlugin(ScrollTrigger);

const industries = [
  {
    title: "Fintech",
    description:
      " For BSFI-Fintech brands, we offer full-funnel digital marketing solutions that power growth at every stage. By merging data-driven strategies with innovative creative execution, we optimize customer journeys, boost product adoption, and secure long-term success in a rapidly evolving digital ecosystem.",
    image: "/assets/images/homepage/industries/fintech.png",
  },
  {
    title: "Fashion & Lifestyle",
    description:
      " For BSFI-Fintech brands, we offer full-funnel digital marketing solutions that power growth at every stage. By merging data-driven strategies with innovative creative execution, we optimize customer journeys, boost product adoption, and secure long-term success in a rapidly evolving digital ecosystem.",
    image: "/assets/images/homepage/industries/industry-img-1.png",
  },
  {
    title: "E-Commerce",
    description:
      " For BSFI-Fintech brands, we offer full-funnel digital marketing solutions that power growth at every stage. By merging data-driven strategies with innovative creative execution, we optimize customer journeys, boost product adoption, and secure long-term success in a rapidly evolving digital ecosystem.",
    image: "/assets/images/homepage/industries/industry-img-2.png",
  },
  {
    title: "Information Technology",
    description:
      " For BSFI-Fintech brands, we offer full-funnel digital marketing solutions that power growth at every stage. By merging data-driven strategies with innovative creative execution, we optimize customer journeys, boost product adoption, and secure long-term success in a rapidly evolving digital ecosystem.",
    image: "/assets/images/homepage/industries/industry-img-3.png",
  },

  {
    title: "Healthcare",
    description:
      " For BSFI-Fintech brands, we offer full-funnel digital marketing solutions that power growth at every stage. By merging data-driven strategies with innovative creative execution, we optimize customer journeys, boost product adoption, and secure long-term success in a rapidly evolving digital ecosystem.",
    image: "/assets/images/homepage/industries/industry-img-4.png",
  },

  // ... add 6 more!
];
const IndustrySample = () => {
  const getTransforms = (index) => {
    if (index === 0) return { translateY: -80, rotateZ: -4, opacity: 0.3 };
    if (index === 1) return { translateY: -135, rotateZ: -7, opacity: 0.2 };
    if (index === 2) return { translateY: -160, rotateZ: -10, opacity: 0.2 };
    return { translateY: -190, rotateZ: -10, opacity: 0.2 };
  };

  useGSAP(() => {
    if (globalThis.innerWidth > 1024) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#industry-sample",
          start: "top 70%",
          end: "bottom bottom",
          scrub: true,
          // markers:true,
        },
        defaults: {
          ease: "power1.inOut",
        },
      });
      tl.to(".industry", {
        rotateZ: 0,
        translateY: 0,
        translateX: 0,
        duration: 1,
        stagger: 0.1,
      }).to(
        ".industry-overlay",
        {
          opacity: 0,
          duration: 1,
          stagger: 0.1,
        },
        "<"
      );
    } else {
    }
  });
  return (
    <section
      className="w-screen h-fit  bg-[#fefefe] pt-[10%] relative z-30 dark max-sm:pt-[10%] overflow-hidden text-[#111111]  mt-[75vw] "
      id="industry-sample"
    >
      <div className="flex flex-col gap-[8vw] max-sm:gap-[6vw]">
        <div className="w-full flex justify-between items-end px-[5vw] max-sm:flex-col max-sm:items-start max-sm:gap-[3vw] max-sm:px-[7vw]">
          
          <HeadAnim>
            <h2 className=" text-[7.5vw] leading-[1.2] w-[70%] max-sm:text-[11vw] max-sm:w-[80%]  ">
              Industries We Work With
            </h2>

          </HeadAnim>
          
          <LinkButton
            href={"#"}
            text={"View All Industries"}
            className="font-medium"
          />
          
        </div>
        <div className="flex flex-col h-full  ">
          <div className="w-full h-fit bg-[#fefefe] relative z-[9] flex flex-col justify-between items-center    pt-[3vw]">
            <div className="flex justify-between gap-[5vw] px-[5vw] max-sm:flex-col max-sm:px-[7vw]">
              {/* <HeadAnim> */}
                <h3 className="text-[2.5vw]  w-[40%]  max-sm:text-[7vw]">
                  Electronics
                </h3>
              {/* </HeadAnim> */}
              <div className="w-[60%] flex flex-col gap-[1vw] pr-[2vw]  max-sm:order-1 max-sm:w-full">
                <p className="text-[#595959] max-sm:mb-[4vw]">
                  For BSFI-Fintech brands, we offer full-funnel digital
                  marketing solutions that power growth at every stage. By
                  merging data-driven strategies with innovative creative
                  execution, we optimize customer journeys, boost product
                  adoption, and secure long-term success in a rapidly evolving
                  digital ecosystem.
                </p>
                {/* <LinkButton
                  href={"#"}
                  text={"Learn More"}
                  className="font-medium"
                /> */}
              </div>
              <div className="w-[20vw] h-[10vw] rounded-[1vw] overflow-hidden max-sm:w-full max-sm:h-[26vh] max-sm:rounded-[4vw]">
                <Image
                  src={"/assets/images/homepage/industries/industry-img-3.png"}
                  alt=""
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <span className="w-[95%] px-[5vw] h-[1px] mt-[2vw] bg-black/10 inline-block max-sm:my-[7vw] max-sm:w-[85%]" />
          </div>

          <div className="relative w-full">
            {industries.map((item, index) => {
              const { translateY, rotateZ, opacity } = getTransforms(index);

              return (
                <div
                  key={index}
                  className={`w-full h-fit bg-[#fefefe] relative z-[${industries.length - index}] flex flex-col justify-between items-center pt-[2vw] industry max-sm:!translate-y-0 max-sm:!translate-x-0 max-sm:!rotate-z-0  max-sm:pb-[7vw]`}
                  style={{
                    transform: `translateY(${translateY}%) rotateZ(${rotateZ}deg)`,
                  }}
                >
                  <div
                    className="w-full h-full bg-gradient-to-b from-black to-transparent absolute top-0 left-0 industry-overlay max-sm:hidden"
                    style={{
                      opacity,
                    }}
                  />

                  <div className="flex justify-between gap-[5vw] px-[5vw] max-sm:flex-col max-sm:px-[7vw]">
                    <h3 className="text-[2.5vw]  w-[40%] max-sm:text-[7vw] max-sm:w-[80%]">
                      {item.title}
                    </h3>
                    <div className="w-[60%] flex flex-col gap-[1vw] pr-[2vw] max-sm:order-1 max-sm:w-full ">
                      <p className="text-[#595959] max-sm:mb-[4vw]">
                        {item.description}
                      </p>
                      {/* <MainButton btnText={"Know More"} link={"#"}/> */}
                      {/* <LinkButton
                        text={"Learn More"}
                        href={"#"}
                        className="font-medium"
                      /> */}
                    </div>
                    <div className="w-[20vw] h-[10vw] rounded-[1vw] overflow-hidden max-sm:w-full max-sm:h-[26vh] max-sm:rounded-[4vw]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <span
                    className={`w-[95%] px-[5vw] h-[1px] mt-[2vw] bg-black/10 inline-block max-sm:mt-[7vw] max-sm:w-[85%] ${index == 4 ? "!hidden" : ""}`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustrySample;
