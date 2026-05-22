"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CubeCanvasBackground({ seededRandom }) {
  const canvasRef = useRef(null);
  const progressRef = useRef({ value: 0 });
  const facesRef = useRef([]);
  const sizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const random = seededRandom(89);

    let lastWidth = 0;
    let lastHeight = 0;
    let resizeRaf = 0;

    const buildFaces = (vw, vh) => {
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

          const bottomToTopBias = (1 - normalizedRow) * 40;
          const horizontalNoise = Math.sin(col * 1.4) * 1.5;
          const rowNoise = Math.sin(row * 1.2) * 1.2;
          const softRandom = random() * 3;

          const baseScore =
            bottomToTopBias + horizontalNoise + rowNoise + softRandom;

          faces.push({
            points: top,
            score: baseScore + random() * 1.5,
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

      faces.sort((a, b) => a.score - b.score);

      const total = faces.length;
      for (let i = 0; i < total; i++) {
        faces[i].revealStart = i / total;
        delete faces[i].score;
      }

      return faces;
    };

    const draw = () => {
      const progress = progressRef.current.value;
      const faces = facesRef.current;
      const { width, height } = sizeRef.current;

      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;

      const len = faces.length;

      for (let i = 0; i < len; i++) {
        const face = faces[i];
        const alpha = Math.max(
          0,
          Math.min(1, (progress - face.revealStart) * 22),
        );

        if (alpha <= 0) continue;

        const points = face.points;

        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);

        for (let j = 1; j < points.length; j++) {
          ctx.lineTo(points[j][0], points[j][1]);
        }

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isMobileViewport = vw <= 542;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobileViewport ? 1 : 2);

      sizeRef.current.width = vw;
      sizeRef.current.height = vh;

      canvas.width = vw * dpr;
      canvas.height = vh * dpr;

      canvas.style.width = `${vw}px`;
      canvas.style.height = `${vh}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (vw !== lastWidth || vh !== lastHeight) {
        lastWidth = vw;
        lastHeight = vh;
        facesRef.current = buildFaces(vw, vh);
      }

      draw();
    };

    const handleResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(resize);
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
        invalidateOnRefresh: true,
      },
    });

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(resizeRaf);
      window.removeEventListener("resize", handleResize);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [seededRandom]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-30 mt-[20vw] h-[140vh] w-screen"
    />
  );
}
