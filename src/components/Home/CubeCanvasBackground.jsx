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

      const startX = -cubeW * 2.4;
      const startY = -topH * 1.2;

      const rowsNeeded = Math.ceil(vh / stepY) + 4;
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

          // More randomness while still moving mostly left-to-right
          const baseScore = col * 14;
          const rowOffset = row * 1.2;
          const softWave = Math.sin(row * 2.8 + col * 1.1) * 6;

          faces.push({
            points: top,
            score: baseScore + rowOffset + softWave + random() * 14 + 0,
          });

          faces.push({
            points: left,
            score: baseScore + rowOffset + softWave + random() * 14 + 1.2,
          });

          faces.push({
            points: right,
            score: baseScore + rowOffset + softWave + random() * 14 + 2.4,
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
      ctx.fillStyle = "#FF8101";
      ctx.fill();

      ctx.strokeStyle = "#FB6201";
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
      ease: "none",
      onUpdate: draw,
      scrollTrigger: {
        id: "testimonialCanvasCubeReveal",
        trigger: "#testimonial",
        start: "25% 70%",
        end: "45% top",
        scrub: true,
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
      className="absolute inset-0 z-[1] h-full w-full pointer-events-none"
    />
  );
}