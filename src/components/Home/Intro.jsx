"use client";

import GlassGradientScene from "@/components/Home/HyperiuxGlassHeroConcept";
import HyperiuxGlassHeroConcept from "@/components/Home/HyperiuxGlassHeroConcept/SecondSection";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import SplitText from "gsap/dist/SplitText";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger, SplitText);

const COLS = 20;
const ROWS = 12;
const TOTAL = COLS * ROWS;

function seededRandom(seed) {
  let value = seed;

  return function () {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function getDiagonalOrder(seed = 89) {
  const random = seededRandom(seed);

  return Array.from({ length: TOTAL }, (_, index) => {
    const row = Math.floor(index / COLS);
    const col = index % COLS;

    const bottomRightBias = row * 1.6 + col * 0.55;
    const randomNoise = random() * 2.5;

    const localClusterNoise =
      Math.sin(row * 2.17 + col * 1.31) * 2.5 +
      Math.cos(row * 1.73 - col * 2.41) * 2.5;

    return {
      index,
      row,
      col,
      score: bottomRightBias + randomNoise + localClusterNoise,
    };
  }).sort((a, b) => b.score - a.score);
}

export default function Intro() {
  const containerRef = useRef(null);
  const firstSectionRef = useRef(null);
  const secondSectionRef = useRef(null);
  const pixelCellsRef = useRef([]);

  const squareOrder = useMemo(() => getDiagonalOrder(), []);

  const [firstVariant, setFirstVariant] = useState("glass");
  const [firstBackgroundVariant, setFirstBackgroundVariant] = useState("video");

  const [secondVariant, setSecondVariant] = useState("glass");
  const [secondBackgroundVariant, setSecondBackgroundVariant] =
    useState("gradient");

  useEffect(() => {
    const ctx = gsap.context(() => {
      const firstSplit = new SplitText(".first-split", {
        type: "lines",
        linesClass: "split-line",
        mask: "lines",
      });

      const secondSplit = new SplitText(".second-split", {
        type: "lines",
        linesClass: "split-line",
        mask: "lines",
      });

      const orderedCells = squareOrder
        .map((item) => pixelCellsRef.current[item.index])
        .filter(Boolean);

      gsap.set(firstSplit.lines, { yPercent: -10 });
      gsap.set(secondSplit.lines, { yPercent: 100 });
      gsap.set(orderedCells, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "40% top",
          scrub: true,
          invalidateOnRefresh: true,
          // markers: true,
        },
      });
      tl.to(orderedCells, {
        opacity: 1,
        duration: 0.04,
        stagger: {
          each: 0.003,
        },
        ease: "none",
      });

      gsap.to(secondSplit.lines, {
        yPercent: -10,
        stagger: 0.03,
        duration: 0.45,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "20% top",
          end: "50% top",
          scrub: true,
          // markers:true
        },
      });
      gsap.to(".about-cta", {
        translateY: "0%",
        opacity:1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "40% top",
          end: "55% top",
          scrub: true,
          // markers:true
        },
      });

      gsap.to(firstSectionRef.current, {
        translateY: "80%",
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      // gsap.to(secondSectionRef.current,{
      //   opacity:1,
      //    ease:"power1.in",
      //   scrollTrigger:{
      //     trigger:".hero",
      //     start:"3% top",
      //     end:"10% top",
      //     scrub:true,
      //     markers:true
      //   }
      // })

      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, [squareOrder]);

  return (
    <div ref={containerRef} className="container h-fit ">
      <div className="w-screen h-screen hero">
        <section
          ref={firstSectionRef}
          className="first-section-portal pointer-events-none inset-0 z-20 h-screen w-screen overflow-hidden bg-black"
        >
          <div className="relative h-screen w-full overflow-hidden">
            <GlassGradientScene
              variant={firstVariant}
              setVariant={setFirstVariant}
              backgroundVariant={firstBackgroundVariant}
              setBackgroundVariant={setFirstBackgroundVariant}
              showControls={false}
              modelSrc="/assets/models/hyperiexLogoNo2.glb"
              videoSrc="/assets/models/bg-video.mp4"
              modelScale={0.07}
              modelThickness={1.25}
              modelPosition={[0, 0, 1.4]}
              modelRotation={[0, 0, 0]}
            />

            <div className="pointer-events-none absolute inset-0 z-20 flex h-full w-full items-end justify-between px-[5vw] pb-[5%]">
              <h1 className="first-split font-aeonik! flex flex-col pb-[4vw] text-[7.8vw] leading-[1.1]! text-white">
                <span>Digital</span>
                <span>Experience</span>
                <span>Design Agency</span>
              </h1>

              <p className="first-split mt-[-1vw] w-[35%] text-[1.05vw] text-white font-ageo">
                Harnessing the power of Emotion, Design, Technology &
                Neuromarketing, we create Digital Brand Experiences that propel
                your success in the enigmatic realm of bits & bytes.
              </p>
            </div>
          </div>
        </section>
      </div>
      <section
        ref={secondSectionRef}
        className="second-section-portal relative inset-0 z-40 h-[40vw] overflow-hidden w-screen bg-white"
      >
        <HyperiuxGlassHeroConcept
          variant={secondVariant}
          setVariant={setSecondVariant}
          backgroundVariant={secondBackgroundVariant}
          setBackgroundVariant={setSecondBackgroundVariant}
          modelPosition={[-1.1, -0.1, 1.4]}
          showControls={false}
          modelThickness={1.25}
          modelScale={0.07}
          modelSrc="/assets/models/hyperiexLogoNo2.glb"
          videoSrc="/assets/models/bg-video.mp4"
        />

        <div className=" absolute inset-0 z-30  flex h-full w-full items-start justify-end px-[5vw]">
          <div className="w-[53%] text-[#111111]">
            <p className="second-split mb-5 text-sm uppercase text-black/50">
              About Us
            </p>

            <h2 className="second-split font-aeonik! text-[3.2vw] leading-[1]">
              From Concept to Conversion We&apos;re Changing the Face of Web.
            </h2>

            <p className="second-split mt-8 text-[1.45vw] leading-[1.5] text-black/65">
              We unravel complex design challenges through meticulous user research, expert analysis, prototyping, and collaborative design with users and stakeholders. Harnessing the power of cutting-edge tools and our proprietary approach we craft delightful and intuitive experiences.
            </p>

            <p className="second-split mt-8 w-[85%] text-[1.55vw] leading-[1.4] text-black/65">
              <strong>Wh</strong>at you <strong>ju</strong>st{" "}
              <strong>ex</strong>perienced is <strong>cal</strong>led{" "}
              <strong>bio</strong>nic <strong>rea</strong>ding.
              <br /> <strong>Le</strong>arn <strong>mo</strong>re{" "}
              <strong>ab</strong>out it <strong>he</strong>re.
            </p>
            <Link
              key={"#"}
              href="/contact-us"
              className="px-[2vw] w-fit py-[0.7vw] mt-[3vw] bg-[#111111]  flex justify-center group items-center overflow-hidden gap-[1vw] text-white font-aeonik text-[1.45vw] about-cta translate-y-[50%] opacity-0"
              scroll={false}
            >
              <span className="w-[0.5vw] h-[0.5vw] bg-[#ff5f00] group-hover:scale-[20] group-hover:bg-[#ff5f00] group-hover:duration-[0.3s] duration-[0.3s] ease-out group-hover:translate-x-[2.5vw]" />
              <span className="relative inline-block z-[2] group-hover:text-white group-hover:translate-x-[-25%] duration-400 ease-out">
                Say Hi
              </span>
            </Link>
          </div>
        </div>
      </section>

      <div className="pointer-events-none absolute inset-0 z-30 h-screen w-screen overflow-hidden">
        {Array.from({ length: TOTAL }).map((_, index) => {
          const row = Math.floor(index / COLS);
          const col = index % COLS;

          return (
            <div
              key={index}
              ref={(el) => {
                pixelCellsRef.current[index] = el;
              }}
              className="absolute bg-white will-change-opacity"
              style={{
                left: `${(col / COLS) * 100}%`,
                top: `${(row / ROWS) * 100}%`,
                width: `${100 / COLS + 0.05}%`,
                height: `${100 / ROWS + 0.05}%`,
                opacity: 0,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
