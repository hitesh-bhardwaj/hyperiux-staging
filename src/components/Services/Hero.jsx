"use client"
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import SplitText from "gsap/dist/SplitText";
import gsap from 'gsap';
import React, { useEffect, useRef } from 'react'
import { fadeUp } from "../Animations/gsapAnimations";
import FlowFieldHero from "../3D/FlowFieldPlane";

const Hero = () => {
  fadeUp()
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const firstSplit = new SplitText(".first-split", {
        type: "lines,chars",
        linesClass: "split-line",
        mask: "lines",
      });
      const firstPara = new SplitText(".first-para", {
        type: "lines,words",
        linesClass: "split-line",
        mask: "lines",
      });

      gsap.set(firstSplit.lines, { yPercent: -10 });
      gsap.set(".first-split", {
        opacity: 1
      })
      gsap.set(".first-para", {
        opacity: 1
      })
      gsap.from(firstSplit.chars, {
        yPercent: 120,
        stagger: 0.025,
        ease: "power1.inOut",
        delay: 1
      })
      gsap.to(firstSplit.lines, {
        yPercent: -120,
        stagger: 0.03,
        duration: 0.45,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "60% top",
          scrub: true,
        },
      });
      gsap.from(
        firstPara.words,
        {
          yPercent: 120,
          stagger: 0.01,
          duration: 0.8,
          delay: 1,

          ease: "power1.inOut",
        },)
      gsap.to(
        firstPara.lines,
        {
          yPercent: -120,
          stagger: 0.01,
          duration: 0.5,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "40% top",
            scrub: true,
          },
        },)

      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, []);
  return (
    <section ref={containerRef} className='w-screen h-screen px-[5vw] pb-[12%] flex items-end sticky top-0' id='hero'>

      <FlowFieldHero />
      <div className='w-[70%] space-y-[1.5vw] relative z-[2]'>
        <h1 className="first-split flex flex-col font-aeonik! text-[7.8vw] leading-[1.1]! text-white opacity-0">
          <span>Creating Ambitious Brands</span>

        </h1>
        <p className="text-[1.4vw] w-[60%] opacity-0 first-para">
          We are a globally recognised, award-winning UI UX design studio. Our comprehensive range of services leverages our full expertise to boost your digital presence to celestial heights.
        </p>
      </div>
    </section>
  )
}

export default Hero