"use client"
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import SplitText from "gsap/dist/SplitText";
import gsap from 'gsap';
import React, { useEffect, useRef } from 'react'
import { fadeUp } from "../Animations/gsapAnimations";
import FlowFieldHero from "../FlowFieldPlane";

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
    
      const secondSplit = new SplitText(".second-split", {
        type: "lines",
        linesClass: "split-line",
        mask: "lines",
      });

      gsap.set(firstSplit.lines, { yPercent: -10 });
      gsap.set(secondSplit.lines, { yPercent: 100 });
      gsap.set(".first-split",{
        opacity:1
      })
      gsap.set(".first-para",{
        opacity:1
      })
      gsap.from(firstSplit.chars,{
        yPercent:120,
        stagger:0.025,
        ease:"power1.inOut",
        delay:1
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
      gsap.to(secondSplit.lines, {
        yPercent: -10,
        stagger: 0.03,
        duration: 0.45,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "30% top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".about-cta-btn", {
        translateY: "0%",
        opacity: 1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "35% top",
          end: "bottom top",
          scrub: true,
        },
      });
      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, []);
  return (
    <section ref={containerRef} className='w-screen h-screen fixed px-[5vw] pb-[12%] flex items-end' id='hero'>
        {/* <div className='w-full h-full absolute inset-0'>
            <video
            playsInline
            muted
            autoPlay
            src={"/assets/models/bg-video.mp4"}
            loop
            />
 
        </div> */}
        <FlowFieldHero/>
        <div className='w-[80%]'>
              <h1 className="first-split flex flex-col font-aeonik! text-[7.8vw] leading-[1.1]! text-white opacity-0">
                <span>Empowering</span>
                <span>Brands Through</span>
                <span>Thoughtful Design</span>
              </h1>
        </div>
    </section>
  )
}

export default Hero