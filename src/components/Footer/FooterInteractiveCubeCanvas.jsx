"use client";

import React, { useEffect, useRef } from "react";

function seededRandom(seed) {
  let value = seed;

  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

export default function FooterInteractiveCubeCanvas({
  className = "",

  cubeScale = 0.062,

  glowRadius = 260,
  glowPower = 2.2,

  baseLineWidth = 1,
  baseBorderOpacity = 0.35,
  orangeBorderOpacity = 0.58,

  mouseLerp = 0.085,
  glowLerp = 0.065,
  idleFadeDelay = 120,

  idleGlowX = 0.58,
  idleGlowY = 0.45,

  dprLimit = 2,
}) {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const facesRef = useRef([]);

  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const mouseSmoothRef = useRef({ x: 0, y: 0 });

  const glowStrengthRef = useRef(0);
  const glowTargetRef = useRef(0);

  const lastMoveTimeRef = useRef(0);
  const isInsideRef = useRef(false);

  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext("2d");
    const random = seededRandom(89);

    let width = 0;
    let height = 0;

    const lerp = (start, end, amount) => {
      return start + (end - start) * amount;
    };

    const buildFaces = () => {
      const cubeW = width * cubeScale;
      const cubeH = cubeW * 1.22;
      const topH = cubeW * 1.02;

      const stepX = cubeW * 1.99;
      const stepY = cubeH + topH * 0.5;

      const startX = -cubeW * 2.6;
      const startY = -topH * 1.4;

      const rowsNeeded = Math.ceil(height / stepY) + 5;
      const colsNeeded = Math.ceil(width / stepX) + 8;

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

          const noise = random() * 0.06;

          faces.push({
            points: top,
            fillAlpha: 0.08 + noise,
          });

          faces.push({
            points: left,
            fillAlpha: 0.11 + noise,
          });

          faces.push({
            points: right,
            fillAlpha: 0.14 + noise,
          });
        }
      }

      return faces;
    };

    const getFaceCenter = (points) => {
      let x = 0;
      let y = 0;

      points.forEach((point) => {
        x += point[0];
        y += point[1];
      });

      return {
        x: x / points.length,
        y: y / points.length,
      };
    };

    const drawPolygon = (points) => {
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);

      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
      }

      ctx.closePath();
    };

    const draw = () => {
      const mouse = mouseSmoothRef.current;
      const glowStrength = glowStrengthRef.current;

      ctx.clearRect(0, 0, width, height);

      facesRef.current.forEach((face) => {
        const center = getFaceCenter(face.points);

        const dx = center.x - mouse.x;
        const dy = center.y - mouse.y;
        const distance = Math.hypot(dx, dy);

        const rawInfluence = Math.max(0, 1 - distance / glowRadius);
        const influence = Math.pow(rawInfluence, glowPower) * glowStrength;

        drawPolygon(face.points);

        ctx.fillStyle = `rgba(255, 255, 255, ${face.fillAlpha})`;
        ctx.fill();

        ctx.lineWidth = baseLineWidth;
        ctx.strokeStyle = `rgba(255, 255, 255, ${baseBorderOpacity})`;
        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";
        ctx.stroke();

        if (influence > 0.002) {
          drawPolygon(face.points);

          ctx.lineWidth = baseLineWidth;
          ctx.strokeStyle = `rgba(255, 95, 0, ${
            influence * orangeBorderOpacity
          })`;
          ctx.shadowBlur = 0;
          ctx.shadowColor = "transparent";
          ctx.stroke();
        }
      });
    };

    const animate = () => {
      const now = performance.now();
      const target = mouseTargetRef.current;
      const smooth = mouseSmoothRef.current;

      smooth.x = lerp(smooth.x, target.x, mouseLerp);
      smooth.y = lerp(smooth.y, target.y, mouseLerp);

      if (isInsideRef.current && now - lastMoveTimeRef.current > idleFadeDelay) {
        glowTargetRef.current = 0;
      }

      glowStrengthRef.current = lerp(
        glowStrengthRef.current,
        glowTargetRef.current,
        glowLerp
      );

      draw();

      rafRef.current = requestAnimationFrame(animate);
    };

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, dprLimit);

      width = rect.width;
      height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const idleX = width * idleGlowX;
      const idleY = height * idleGlowY;

      mouseTargetRef.current.x = idleX;
      mouseTargetRef.current.y = idleY;
      mouseSmoothRef.current.x = idleX;
      mouseSmoothRef.current.y = idleY;

      glowStrengthRef.current = 0;
      glowTargetRef.current = 0;
      lastMoveTimeRef.current = performance.now();
      isInsideRef.current = false;

      facesRef.current = buildFaces();
      draw();
    };

    const handlePointerMove = (event) => {
      const rect = wrapper.getBoundingClientRect();

      isInsideRef.current = true;
      lastMoveTimeRef.current = performance.now();
      glowTargetRef.current = 1;

      const nextX = event.clientX - rect.left;
      const nextY = event.clientY - rect.top;

      mouseTargetRef.current.x = Math.max(0, Math.min(width, nextX));
      mouseTargetRef.current.y = Math.max(0, Math.min(height, nextY));
    };

    const handlePointerLeave = () => {
      isInsideRef.current = false;
      glowTargetRef.current = 0;
    };

    resize();

    wrapper.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    wrapper.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", resize);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      wrapper.removeEventListener("pointermove", handlePointerMove);
      wrapper.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", resize);

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [
    cubeScale,
    glowRadius,
    glowPower,
    baseLineWidth,
    baseBorderOpacity,
    orangeBorderOpacity,
    mouseLerp,
    glowLerp,
    idleFadeDelay,
    idleGlowX,
    idleGlowY,
    dprLimit,
  ]);

  return (
    <div
      ref={wrapperRef}
      className={`pointer-events-auto absolute inset-0 z-[1] overflow-hidden ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{
          display: "block",
        }}
      />
    </div>
  );
}