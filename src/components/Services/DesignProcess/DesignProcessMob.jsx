"use client"
import Copy from "@/components/Animations/Copy";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import React from "react";

const DesignProcessMob = ({ steps }) => {
    useGSAP(()=>{
        gsap.to(".steps-container",{
            clipPath:"rect(0% 100% 100% 0%)",
             stagger:0.5,
             ease:"none",
             scrollTrigger:{
                trigger:"#design-process",
                start:"top top",
                end:"bottom bottom",
                scrub:true,
             }
        })
    })
  return (
    <section
      className="w-screen h-[600vh] relative hidden max-sm:block"
      id="design-process"
    >
      <div className="sticky top-0 h-screen w-screen">
        {steps.map((step, index) => (
          <div
            className={`w-screen h-screen absolute inset-0 px-[7vw] py-[15%] flex flex-col gap-[10vw] justify-between steps-container ${step.textColor} ${step.bgColor}`}
            style={{
              clipPath:
                index === 0
                  ? "rect(0% 100% 100% 0%)" // fully visible
                  : "rect(100% 100% 100% 0%)", // clipped from top
            }}
            key={index}
          >
            <Copy>
              <h3 className="text-[10vw]">{step.title}</h3>
            </Copy>

            <div className="w-full h-[90%] flex flex-col gap-[8vw]">
              <div className="w-full h-[36vh] rounded-[4vw] overflow-hidden ">
                <Image
                  src={step.imageSrc}
                  className="w-full h-full object-cover"
                  width={600}
                  height={800}
                  alt="process-img"
                />
              </div>
              <div className="flex flex-col gap-[6vw]">
                <div className="flex gap-[4vw] items-center">
                  <Copy>
                    <span className="text-[5vw] font-display">0{index + 1} </span>
                  </Copy>
                  <Copy>
                    <h4 className="text-[7vw] font-display ">{step.subtitle}</h4>
                  </Copy>
                </div>
                {/* <Copy> */}
                  <p className="fadepara">{step.description}</p>
                {/* </Copy> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DesignProcessMob;
