"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function seededRandom(seed) {
  let value = seed;

  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

export default function CubeCanvasBackground() {
  const canvasRef = useRef(null);
  const progressRef = useRef({ value: 0 });
  const facesRef = useRef([]);
  const tweenRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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

      const startX = -cubeW * 2.4;

      /*
        Slightly more negative startY and extra rows so top edge is covered.
      */
      const startY = -topH * 2.5;

      const rowsNeeded = Math.ceil(vh / stepY) + 7;
      const colsNeeded = Math.ceil(vw / stepX) + 6;

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

          /*
            Bottom-to-top reveal.
            Bottom rows get lower scores and appear first.
          */
          const normalizedRow = row / Math.max(1, rowsNeeded - 1);

          const bottomToTopBias = (1 - normalizedRow) * 100;
          const horizontalNoise = Math.sin(col * 1.7) * 6;
          const rowWave = Math.sin(row * 2.2 + col * 0.7) * 4;
          const softRandom = random() * 14;

          const baseScore =
            bottomToTopBias + horizontalNoise + rowWave + softRandom;

          faces.push({
            points: top,
            score: baseScore + random() * 2 + 0,
          });

          faces.push({
            points: left,
            score: baseScore + random() * 2 + 1.2,
          });

          faces.push({
            points: right,
            score: baseScore + random() * 2 + 2.4,
          });
        }
      }

      return faces.sort((a, b) => a.score - b.score);
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

      ctx.fillStyle = "#111111";
      ctx.fill();

      ctx.strokeStyle = "#1a1a1a";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    };

    const draw = () => {
      const progress = progressRef.current.value;
      const faces = facesRef.current;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      /*
        IMPORTANT:
        Makes all cubes finish filling before scroll progress reaches 1.
        Without this, the last top cubes stay semi-transparent/empty.
      */
      const REVEAL_END_AT = 0.88;
      const LOCAL_FADE_SPEED = 18;

      faces.forEach((face, index) => {
        const start = (index / Math.max(1, faces.length - 1)) * REVEAL_END_AT;

        const alpha = gsap.utils.clamp(
          0,
          1,
          (progress - start) * LOCAL_FADE_SPEED
        );

        drawFace(face.points, alpha);
      });
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

      ScrollTrigger.refresh();
    };

    resize();

    tweenRef.current = gsap.to(progressRef.current, {
      value: 1,
      ease: "none",
      onUpdate: draw,
      scrollTrigger: {
        id: "testimonial",
        trigger: "#testimonial",
        start: "20% 80%",
        end: "95% bottom",
        scrub: true,
        invalidateOnRefresh: true,
        // markers: true,
      },
    });

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);

      if (tweenRef.current) {
        tweenRef.current.scrollTrigger?.kill();
        tweenRef.current.kill();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
    />
  );
}