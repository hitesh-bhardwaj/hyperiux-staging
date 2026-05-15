"use client";

import GlassGradientScene from "@/components/Home/HyperiuxGlassHeroConcept";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import SplitText from "gsap/dist/SplitText";
import Link from "next/link";
import { MainButton, PrimaryButton } from "../Buttons";
import Image from "next/image";
// import dynamic from "next/dynamic";

gsap.registerPlugin(ScrollTrigger, SplitText);

// const HyperiuxGlassHeroConcept = dynamic(
//   () => import("@/components/Home/HyperiuxGlassHeroConcept/SecondSection"),
//   {
//     ssr: true,
//   },
// );
function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function CubeCanvasBackground() {
  const canvasRef = useRef(null);
  const progressRef = useRef({ value: 0 });
  const facesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const random = seededRandom(89);

    const buildFaces = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isMobileViewport = vw <= 542;

      const cubeW = isMobileViewport ? vw * 0.15 : vw * 0.041;
      const cubeH = cubeW * 1.22;
      const topH = cubeW * 1.02;

      const stepX = cubeW * 1.99;
      const stepY = cubeH + topH * 0.5;

      const startX = -cubeW * 2.8;
      const startY = -topH * 1.5;

      const rowsNeeded = Math.ceil(vh / stepY) + 5;
      const colsNeeded = Math.ceil(vw / stepX) + 7;

      const faces = [];

      for (let row = 0; row < rowsNeeded; row++) {
        for (let col = 0; col < colsNeeded; col++) {
          const shift = row % 2 === 1 ? stepX * 0.5 : 0;

          const x = startX + col * stepX + shift;
          const y = startY + row * stepY;

          const cx = x + cubeW;
          const topY = y;

          const top = [
            [cx, topY],
            [cx + cubeW, topY + topH * 0.5],
            [cx, topY + topH],
            [cx - cubeW, topY + topH * 0.5],
          ];

          const left = [
            [cx - cubeW, topY + topH * 0.5],
            [cx, topY + topH],
            [cx, topY + topH + cubeH],
            [cx - cubeW, topY + topH * 0.5 + cubeH],
          ];

          const right = [
            [cx, topY + topH],
            [cx + cubeW, topY + topH * 0.5],
            [cx + cubeW, topY + topH * 0.5 + cubeH],
            [cx, topY + topH + cubeH],
          ];

          const normalizedRow = row / Math.max(1, rowsNeeded - 1);

          // lower score appears first
          // bottom rows first, top rows last
          const bottomToTopBias = (1 - normalizedRow) * 40;

          // very small variation only, no diagonal direction
          const horizontalNoise = Math.sin(col * 1.4) * 1.5;
          const rowNoise = Math.sin(row * 1.2) * 1.2;
          const softRandom = random() * 3;

          const baseScore =
            bottomToTopBias + horizontalNoise + rowNoise + softRandom;

          faces.push({
            points: top,
            score: baseScore + random() * 1.5 + 0,
          });

          faces.push({
            points: left,
            score: baseScore + random() * 1.5 + 1.2,
          });

          faces.push({
            points: right,
            score: baseScore + random() * 1.5 + 2.4,
          });
        }
      }

      return faces.sort((a, b) => a.score - b.score);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      facesRef.current = buildFaces();
      draw();
    };

    const drawFace = (points, alpha) => {
      if (alpha <= 0) return;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);

      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
      }

      ctx.closePath();
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    };

    const draw = () => {
      const progress = progressRef.current.value;
      const faces = facesRef.current;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      faces.forEach((face, index) => {
        const start = index / faces.length;
        const alpha = gsap.utils.clamp(0, 1, (progress - start) * 22);

        drawFace(face.points, alpha);
      });
    };

    resize();

    const tween = gsap.to(progressRef.current, {
      value: 1,
      ease: "power2.out",
      onUpdate: draw,
      scrollTrigger: {
        id: "introCanvasCubeReveal",
        trigger: ".container",
        start: "top 10%",
        end: "60% top",
        scrub: true,
        // markers:true,
        invalidateOnRefresh: true,
      },
    });

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-30 mt-[20vw] h-[140vh] w-screen pointer-events-none"
    />
  );
}

export default function Intro() {
  const containerRef = useRef(null);
  const firstSectionRef = useRef(null);
  const secondSectionRef = useRef(null);
  const [firstVariant, setFirstVariant] = useState("glass");
  const [firstBackgroundVariant, setFirstBackgroundVariant] = useState("video");
  const [secondVariant, setSecondVariant] = useState("glass");
  const [secondBackgroundVariant, setSecondBackgroundVariant] =
    useState("gradient");

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 542);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

      const secondSplit = new SplitText(".second-split", {
        type: "lines",
        linesClass: "split-line",
        mask: "lines",
      });

      gsap.set(firstSplit.lines, { yPercent: -10 });
      gsap.set(secondSplit.lines, { yPercent: 100 });
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
        delay: 0.5
      })
      gsap.from(firstPara.words, {
        yPercent: 120,
        stagger: 0.01,
        duration: 1,
        ease: "power1.inOut",
        delay: 1
      })
      gsap.to(firstPara.lines, {
        yPercent: -120,
        stagger: 0.03,
        duration: 0.45,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "20% top",
          scrub: true,
        },
      });
      gsap.to(firstSplit.lines, {
        yPercent: -120,
        stagger: 0.03,
        duration: 0.45,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "20% top",
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
          start: "20% top",
          end: "50% top",
          scrub: true,
        },
      });

      gsap.to(".about-cta", {
        translateY: "0%",
        opacity: 1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "35% top",
          end: "50% top",
          scrub: true,
          // markers: true,
        },
      });

      if(!isMobile) {
      gsap.to(".second-section-portal ", {
        opacity: 1,
        scrollTrigger: {
          trigger: ".hero",
          start: "30% top",
          end: "bottom 60%",
          scrub: true,
          // markers:true
        },
      });
    }

      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, [isMobile]);

  


  return (
    <div ref={containerRef} className="container h-fit  relative">
      <div className="w-screen h-screen hero">
        <section
          ref={firstSectionRef}
          className="first-section-portal pointer-events-none inset-0 fixed z-2 h-screen w-screen overflow-hidden bg-black"
        >
          <div className="relative h-screen w-full overflow-hidden ">


            <div className="hidden max-sm:block ">

              <div className="h-screen w-full ">

          
          <Image
            src="/assets/images/homepage/hero-bg.png"
            alt="hero-bg"
            className="absolute inset-0 w-full h-full object-cover"
            width={900}
            height={900}
          />
          </div>

          <div className="absolute inset-0 bg-black/20" />

        
         

            </div>

            {!isMobile && (

            <GlassGradientScene
              variant={firstVariant}
              setVariant={setFirstVariant}
              backgroundVariant={firstBackgroundVariant}
              setBackgroundVariant={setFirstBackgroundVariant}
              showControls={false}
              modelSrc="/assets/models/hyperiexLogoNo2.glb"
              videoSrc="/assets/models/bg-video.mp4"
              modelScale={0.06}
              modelThickness={1.25}
              modelPosition={[1.1, 0, 1.4]}
              modelRotation={[0, 0, 0]}
            />

            )}

            {/* <div className="pointer-events-none absolute inset-0 z-20 flex flex-col max-sm:justify-start max-sm:pt-[32%] justify-center h-full w-full gap-[4vw] px-[5vw] pb-[8%] pt-[10%]">
              <h1 className="first-split font-aeonik! flex flex-col  text-[8vw] max-sm:text-[12.5vw] leading-[1.1]! text-white opacity-0">
                <span>Digital</span>
                <span>Experience</span>
                <span>Design Agency</span>
              </h1>

              <p className="first-para mt-[-1vw] max-sm:text-[4.2vw] max-sm:mt-[4.2vw] max-sm:leading-normal max-sm:w-full w-[53%] text-[1.4vw] text-white opacity-0">
                As a leading UI UX and web design agency, we harness the power of <span className="font-medium">Emotion, Design, Technology, and Neuromarketing </span>  to craft digital brand experiences that drive real results.
              </p>
            </div>  */}
          </div>

        </section>
      </div>

      

    <section
  ref={secondSectionRef}
  className="second-section-portal relative inset-0 z-40 h-[40vw] max-sm:h-[85vh] bg-white mt-[-3vw] max-sm:mt-0 overflow-hidden w-screen opacity-0 max-sm:opacity-100"
>
  <div className="absolute inset-0 z-30 flex h-full w-full items-start max-sm:items-center justify-end max-sm:justify-center max-sm:h-[80vh] px-[5vw] max-sm:px-[7vw]">
    <div className="w-[60%] max-sm:w-full text-[#111111]">
      <h2 className="second-split font-aeonik! text-[3.2vw] max-sm:text-[10vw] leading-none max-sm:leading-[1.1] max-sm:pb-[5vw]">
        <div className="h-full translate-y-[-0.9vw] max-sm:translate-y-0 inline-block max-sm:block my-auto text-[1.2vw] max-sm:text-[3.5vw] mr-[4vw] max-sm:mr-[3vw] max-sm:pb-[6vw] text-black/50">
          About Us
        </div>
        From Concept to Conversion We&apos;re Changing the Face of Web.
      </h2>

            <p className="second-split mt-[4.5vw] text-[1.45vw] max-sm:text-[4.5vw] leading-normal text-black/65">
              <strong className="font-semibold text-black/65">W</strong>e{" "}
              <strong className="font-semibold text-black/65">un</strong>ravel{" "}
              <strong className="font-semibold text-black/65">com</strong>plex{" "}
              <strong className="font-semibold text-black/65">de</strong>sign{" "}
              <strong className="font-semibold text-black/65">chal</strong>lenges{" "}
              <strong className="font-semibold text-black/65">thro</strong>ugh{" "}
              <strong className="font-semibold text-black/65">me</strong>ticulous{" "}
              <strong className="font-semibold text-black/65">us</strong>er{" "}
              <strong className="font-semibold text-black/65">re</strong>search,{" "}
              <br/>
              <strong className="font-semibold text-black/65">ex</strong>pert{" "}
              <strong className="font-semibold text-black/65">a</strong>nalysis,{" "}
              <strong className="font-semibold text-black/65">pro</strong>totyping,{" "}
              <strong className="font-semibold text-black/65">a</strong>nd{" "}
              <strong className="font-semibold text-black/65">col</strong>laborative{" "}
              <strong className="font-semibold text-black/65">de</strong>sign{" "}
              <strong className="font-semibold text-black/65">wi</strong>th{" "}
              <strong className="font-semibold text-black/65">us</strong>ers{" "}
              <strong className="font-semibold text-black/65">a</strong>nd{" "}
              <strong className="font-semibold text-black/65">stake</strong>holders.{" "}
              
              <strong className="font-semibold text-black/65">Har</strong>nessing{" "}
              <strong className="font-semibold text-black/65">the</strong>{" "}
              <strong className="font-semibold text-black/65">pow</strong>er{" "}
              <strong className="font-semibold text-black/65">of</strong>{" "}
              <strong className="font-semibold text-black/65">cut</strong>ting-edge{" "}
              <strong className="font-semibold text-black/65">to</strong>ols{" "}
              <strong className="font-semibold text-black/65">a</strong>nd{" "}
              <strong className="font-semibold text-black/65">o</strong>ur{" "}
              <strong className="font-semibold text-black/65">pro</strong>prietary{" "}
              <br/>

              <strong className="font-semibold text-black/65">ap</strong>proach{" "}
              <strong className="font-semibold text-black/65">w</strong>e{" "}
              <strong className="font-semibold text-black/65">cr</strong>aft{" "}
              <strong className="font-semibold text-black/65">de</strong>lightful{" "}
              <strong className="font-semibold text-black/65">a</strong>nd{" "}
              <strong className="font-semibold text-black/65">in</strong>tuitive{" "}
              <strong className="font-semibold text-black/65">ex</strong>periences.
            </p>

            <p className="second-split mt-8 max-sm:mt-12 w-[70%] max-sm:text-[4.5vw] max-sm:w-full text-[1.55vw] leading-[1.4] text-black/65">
              What you just experienced is called bionic reading.
              Learn more about it here.
            </p>

      <div className="w-fit h-fit mt-[3vw] max-sm:mt-[8vw] about-cta translate-y-[50%] opacity-0">
        <MainButton href={"#"} btnText={"Say Hi"} />
      </div>
    </div>
  </div>
</section>

      <CubeCanvasBackground />
    </div>
  );
}
