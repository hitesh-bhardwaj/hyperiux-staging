"use client";

import GlassGradientScene from "@/components/Home/HyperiuxGlassHeroConcept";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import SplitText from "gsap/dist/SplitText";
import Link from "next/link";
import dynamic from "next/dynamic";

gsap.registerPlugin(ScrollTrigger, SplitText);

const HyperiuxGlassHeroConcept = dynamic(
  () => import("@/components/Home/HyperiuxGlassHeroConcept/SecondSection"),
  {
    ssr: true,
  },
);
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

      const cubeW = vw * 0.041;
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
      className="absolute inset-0 z-[30] mt-[20vw] h-[140vh] w-screen pointer-events-none"
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      const firstSplit = new SplitText(".first-split", {
        type: "lines",
        linesClass: "split-line",
        mask: "lines",
      });
      const firstPara = new SplitText(".first-para", {
        type: "lines",
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
      gsap.to(".second-section-portal ", {
        opacity:1,
        scrollTrigger: {
          trigger: ".hero",
          start: "30% top",
          end: "bottom 60%",
          scrub: true,
          // markers:true
        },
      });

      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="container h-fit relative">
      <div className="w-screen h-screen hero">
        <section
          ref={firstSectionRef}
          className="first-section-portal pointer-events-none inset-0 fixed z-2 h-screen w-screen overflow-hidden bg-black"
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
              modelPosition={[1, 0, 1.4]}
              modelRotation={[0, 0, 0]}
            />

            <div className="pointer-events-none absolute inset-0 z-20 flex h-full w-full items-end justify-between px-[5vw] pb-[5%]">
              <h1 className="first-split font-aeonik! flex flex-col pb-[4vw] text-[7.8vw] leading-[1.1]! text-white">
                <span>Digital</span>
                <span>Experience</span>
                <span>Design Agency</span>
              </h1>

              <p className="first-para mt-[-1vw] w-[35%] text-[1.05vw] text-white font-ageo">
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
        className="second-section-portal relative inset-0 z-40 h-[40vw] mt-[-5vw] overflow-hidden w-screen opacity-0"
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

        <div className="absolute inset-0 z-30 flex h-full w-full items-start justify-end px-[5vw]">
          <div className="w-[53%] text-[#111111]">
            <p className="second-split mb-5 text-sm uppercase text-black/50">
              About Us
            </p>

            <h2 className="second-split font-aeonik! text-[3.2vw] leading-[1]">
              From Concept to Conversion We&apos;re Changing the Face of Web.
            </h2>

            <p className="second-split mt-8 text-[1.45vw] leading-[1.5] text-black/65">
              We unravel complex design challenges through meticulous user
              research, expert analysis, prototyping, and collaborative design
              with users and stakeholders. Harnessing the power of cutting-edge
              tools and our proprietary approach we craft delightful and
              intuitive experiences.
            </p>

            <p className="second-split mt-8 w-[85%] text-[1.55vw] leading-[1.4] text-black/65">
              <strong>Wh</strong>at you <strong>ju</strong>st{" "}
              <strong>ex</strong>perienced is <strong>cal</strong>led{" "}
              <strong>bio</strong>nic <strong>rea</strong>ding.
              <br /> <strong>Le</strong>arn <strong>mo</strong>re{" "}
              <strong>ab</strong>out it <strong>he</strong>re.
            </p>

            <Link
              key="#"
              href="/contact-us"
              className="px-[2vw] w-fit py-[0.7vw] mt-[3vw] bg-[#111111] flex justify-center group items-center overflow-hidden gap-[1vw] text-white font-aeonik text-[1.45vw] about-cta translate-y-[50%] opacity-0"
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

      <CubeCanvasBackground />
    </div>
  );
}
