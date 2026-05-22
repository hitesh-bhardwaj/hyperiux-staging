"use client";
import Image from "next/image";
import React from "react";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import gsap from "gsap";
import HeadAnim from "@/components/Animations/HeadAnim";
import { LinkButton } from "@/components/Buttons";
import Link from "next/link";
gsap.registerPlugin(ScrollTrigger, useGSAP);

const DesignProcessMore = ({ steps }) => {

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#design-process-more",
        start: "top top",
        end: "98% bottom",
        scrub: true,
        // markers:true
      },
      defaults: {
        ease: "none",
      },
    });
    tl.to(".container-1", {
      translateX: "-90%",
    })
      .to(
        ".container-1-content",
        {
          translateX: "90%",
        },
        "<"
      )
      .to(
        ".img-1-container",
        {
          translateX: "60%",
          scale: 0.9,
          translateY: "10%",
        },
        "<"
      )
      .to(
        ".container-2",
        {
          translateX: "0%",
        },
        "<"
      )
      .to(
        ".container-2-content",
        {
          translateX: "0%",
        },
        "<"
      )
      .to(
        ".img-2-container",
        {
          translateX: "-22%",
        },
        "<"
      )
      .to(
        ".img-2",
        {
          scale: 1.9,
          translateY: "-45%",
          borderRadius: "0.8vw",
        },
        "<"
      )
      .to(
        ".container-3",
        {
          translateX: "80%",
        },
        "<"
      )
      .from(
        ".container-4",
        {
          translateX: "100%",
        },
        "<"
      )
      .to(
        ".img-3-container",
        {
          translateX: "-85%",
          translateY: "-5%",
        },
        "<"
      )
      .to(
        ".img-3",
        {
          scale: 1.9,
        },
        "<"
      )
      .to(".container-2", {
        translateX: "-90%",
      })

      .to(
        ".container-2-content",
        {
          translateX: "90%",
        },
        "<"
      )
      .to(
        ".img-2-container",
        {
          translateX: "60%",
          scale: 0.9,
          translateY: "10%",
        },
        "<"
      )

      .to(
        ".container-3",
        {
          translateX: "0%",
        },
        "<"
      )
      .to(
        ".container-4",
        {
          translateX: "80%",
        },
        "<"
      )
      // .from(
      //   ".container-5",
      //   {
      //     translateX: "100%",
      //   },
      //   "<"
      // )
      .to(
        ".img-4",
        {
          scale: 1.9,
        },
        "<"
      )
      .to(
        ".img-4-container",
        {
          translateX: "-85%",
          translateY: "-5%",
        },
        "<"
      )
      .to(
        ".container-3-content",
        {
          translateX: "0%",
        },
        "<"
      )
      .to(
        ".img-3-container",
        {
          translateX: "-26%",
          translateY: "-10%",
        },
        "<"
      )
      .to(
        ".img-3",
        {
          scale: 3.7,
          translateY: "-50%",
          borderRadius: "0.3vw",
        },
        "<"
      )
      .to(".img-3-container", {
        translateX: "-33%",
        scale: 0.9,
        translateY: "7%",
      })
      .to(
        ".container-4",
        {
          translateX: "0%",
        },
        "<"
      )
      // .to(
      //   ".container-5",
      //   {
      //     translateX: "80%",
      //   },
      //   "<"
      // )
      // .from(
      //   ".container-6",
      //   {
      //     translateX: "100%",
      //   },
      //   "<"
      // )
      // .to(
      //   ".img-5",
      //   {
      //     scale: 1.9,
      //   },
      //   "<"
      // )
      // .to(
      //   ".img-5-container",
      //   {
      //     translateX: "-85%",
      //     translateY: "-5%",
      //   },
      //   "<"
      // )
      .to(
        ".container-4-content",
        {
          translateX: "0%",
        },
        "<"
      )
      .to(
        ".img-4-container",
        {
          translateX: "-26%",
          translateY: "-10%",
        },
        "<"
      )
      .to(
        ".img-4",
        {
          scale: 3.7,
          translateY: "-50%",
          borderRadius: "0.3vw",
        },
        "<"
      )
      // .to(".img-4-container", {
      //   translateX: "-30%",
      //   scale: 0.9,
      //   translateY: "10%",
      // })
      // .to(
      //   ".container-5",
      //   {
      //     translateX: "0%",
      //   },
      //   "<"
      // )
      // .to(
      //   ".container-6",
      //   {
      //     translateX: "80%",
      //   },
      //   "<"
      // )
      // .to(
      //   ".img-6",
      //   {
      //     scale: 2.9,
      //     // translateY: "-40%",
      //   },
      //   "<"
      // )
      // .to(
      //   ".img-6-container",
      //   {
      //     translateX: "-81.5%",
      //     translateY: "-10.5%",
      //   },
      //   "<"
      // )
      // .to(
      //   ".container-5-content",
      //   {
      //     translateX: "0%",
      //   },
      //   "<"
      // )
      // .to(
      //   ".img-5-container",
      //   {
      //     translateX: "-26%",
      //     translateY: "-10%",
      //   },
      //   "<"
      // )
      // .to(
      //   ".img-5",
      //   {
      //     scale: 3.7,
      //     translateY: "-50%",
      //     borderRadius: "0.3vw",
      //   },
      //   "<"
      // )
      // .to(".img-5-container", {
      //   translateX: "-30%",
      //   scale: 0.9,
      //   translateY: "10%",
      // })
      // .to(
      //   ".container-6",
      //   {
      //     translateX: "0%",
      //   },
      //   "<"
      // )
      // .to(
      //   ".container-6-content",
      //   {
      //     translateX: "0%",
      //   },
      //   "<"
      // )
      // .to(
      //   ".img-6-container",
      //   {
      //     translateX: "-27%",
      //   },
      //   "<"
      // )
      // .to(
      //   ".img-6",
      //   {
      //     scale: 3.7,
      //     translateY: "-50%",
      //     borderRadius: "0.3vw",
      //   },
      //   "<"
      // );
  });
  useGSAP(() => {
    gsap.to(".process-progress", {
      width: "90vw",
      ease: "none",
      scrollTrigger: {
        trigger: "#design-process-more",
        start: "top top",
        end: "98% bottom",
        scrub: true,
      },
    });
  });

  return (
    <section
      className="w-screen h-[450vh] relative z-[40] dark max-sm:hidden"
      id="design-process-more"
    >
      <div className="h-[105vh] sticky top-0 text-white w-screen overflow-hidden flex">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`w-screen h-full absolute overflow-hidden ${index === 0 ? "translate-x-[0%]" : index === 1 ? "translate-x-[80%]" : "translate-x-[93%]"} ${step.bgColor} ${step.containerClass} ${step.textColor}`}
          >
            <div className="w-full h-full">
              <div
                className={`w-screen flex absolute flex-col z-2 left-[5%] top-[7%] ${step.contentClass}  ${index == 0 ? "translate-x-0" : "translate-x-[-80%]"}`}
              >
                <HeadAnim>
                  <h3 className="text-[5vw] mb-[4vw]">{step.title}</h3>
                </HeadAnim>
                <div className="w-[37%] space-y-[2vw]">
                  <div className="flex justify-between items-end">

                    <h4 className="text-[3vw] font-display">{step.subtitle}</h4>
                    <LinkButton href={"#"} text={"Learn More"} className="text-current" hover={step.arrowCol} bgCircle={step.linkCircle}/>
                    </div>
                  
                    <p className="fadepara">{step.description}</p>
                    <ul className="space-y-[0.5vw] font-medium">
                      {step.serviceList.map((service,id)=>(
                        <li key={id}>
                          <Link href={"#"} className="uppercase text-current">
                          {service}
                          </Link>
                        </li>
                      ))}
                    </ul>
                </div>
              </div>
              <div
                className={`w-screen relative h-full ${index === 0 ? "translate-x-[-17%]" : index === 1 ? "translate-x-[-82%]" : "translate-x-[-88%]"} ${step.imgContainerClass}`}
              >
                <div
                  className={`${step.imgSize} overflow-hidden absolute bottom-[30%] right-[5%] ${step.imgClass} ${index == 0 ? "rounded-[1.5vw]" : ""}`}
                >
                  <Image
                    src={step.imageSrc}
                    height={483}
                    width={563}
                    alt={`process-${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex w-[90vw] items-center justify-between gap-[5vw] px-[4vw] absolute bottom-[18%] left-0">
          <div>
            <div className="flex gap-[1vw]">
              <p>01</p>
              <p>Design</p>
            </div>
            <span className="w-[10vw] absolute h-[1px] bg-white block mt-[1vw] process-progress" />
          </div>
          <div className="flex gap-[1vw]">
            <p>02</p>
            <p>Development</p>
          </div>
          <div className="flex gap-[1vw]">
            <p>03</p>
            <p>Marketing</p>
          </div>
          <div className="flex gap-[1vw]">
            <p>04</p>
            <p>Strategy</p>
          </div>
         
        </div>
      </div>
    </section>
  );
};

export default DesignProcessMore;
