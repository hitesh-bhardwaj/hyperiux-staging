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
  glowLerp = 0.025,
  idleFadeDelay = 1000,

  idleGlowX = 0.58,
  idleGlowY = 0.45,

  dprLimit = 2,

  arrowFillColor = "rgba(255, 95, 0, 1)",
  arrowFillOpacity = 1,
  arrowFillLerp = 0.045,
  arrowBorderLerp = 0.035,

  arrowRadialFadeRadius = 380,
  arrowRadialFadePower = 1.2,
}) {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);

  const facesRef = useRef([]);
  const cubesRef = useRef([]);
  const lastArrowFacesRef = useRef([]);

  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const mouseSmoothRef = useRef({ x: 0, y: 0 });

  // This is the real cursor position, used for cube selection.
  // It prevents the arrow from lagging behind badly on fast movement.
  const mouseActualRef = useRef({ x: 0, y: 0 });

  const glowStrengthRef = useRef(0);
  const glowTargetRef = useRef(0);

  const lastMoveTimeRef = useRef(0);
  const isInsideRef = useRef(false);

  const boundsRef = useRef({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

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

    const clamp = (value, min, max) => {
      return Math.max(min, Math.min(max, value));
    };

    const updateBounds = () => {
      const rect = wrapper.getBoundingClientRect();

      boundsRef.current.left = rect.left;
      boundsRef.current.top = rect.top;
      boundsRef.current.width = rect.width;
      boundsRef.current.height = rect.height;

      width = rect.width;
      height = rect.height;
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
      const cubes = [];

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

          const cubeCenter = {
            x: cx,
            y: topY + topH + cubeH * 0.42,
          };

          const topFace = {
            points: top,
            type: "top",
            row,
            col,
            cubeCenter,
            fillAlpha: 0.08 + noise,
            arrowFill: 0,
            arrowBorder: 0,
            arrowTarget: 0,
          };

          const leftFace = {
            points: left,
            type: "left",
            row,
            col,
            cubeCenter,
            fillAlpha: 0.11 + noise,
            arrowFill: 0,
            arrowBorder: 0,
            arrowTarget: 0,
          };

          const rightFace = {
            points: right,
            type: "right",
            row,
            col,
            cubeCenter,
            fillAlpha: 0.14 + noise,
            arrowFill: 0,
            arrowBorder: 0,
            arrowTarget: 0,
          };

          faces.push(topFace, leftFace, rightFace);

          cubes.push({
            row,
            col,
            center: cubeCenter,
            faces: {
              top: topFace,
              left: leftFace,
              right: rightFace,
            },
          });
        }
      }

      cubesRef.current = cubes;

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

    const getNearestCube = (mouse) => {
      let nearestCube = null;
      let nearestDistance = Infinity;

      cubesRef.current.forEach((cube) => {
        const dx = cube.center.x - mouse.x;
        const dy = cube.center.y - mouse.y;
        const distance = dx * dx + dy * dy;

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestCube = cube;
        }
      });

      return nearestCube;
    };

    const getCube = (row, col) => {
      return cubesRef.current.find(
        (cube) => cube.row === row && cube.col === col
      );
    };

    const getRadialStrength = (face, mouse) => {
      const center = getFaceCenter(face.points);

      const dx = center.x - mouse.x;
      const dy = center.y - mouse.y;
      const distance = Math.hypot(dx, dy);

      const rawRadial = Math.max(0, 1 - distance / arrowRadialFadeRadius);
      const radialStrength = Math.pow(rawRadial, arrowRadialFadePower);

      return Math.max(0.18, radialStrength);
    };

    const applyLastArrowRadialFade = (glowStrength) => {
      lastArrowFacesRef.current.forEach(({ face, radialStrength }) => {
        if (!face) return;

        face.arrowTarget = glowStrength * radialStrength;
      });
    };

    const updateArrowTargets = () => {
      // Use actual cursor position for selection, not the smoothed position.
      // This keeps the filled cubes responsive even when the cursor moves fast.
      const mouse = mouseActualRef.current;
      const glowStrength = glowStrengthRef.current;

      facesRef.current.forEach((face) => {
        face.arrowTarget = 0;
      });

      if (!isInsideRef.current || glowStrength < 0.01) {
        applyLastArrowRadialFade(glowStrength);
        return;
      }

      const anchorCube = getNearestCube(mouse);

      if (!anchorCube) {
        applyLastArrowRadialFade(glowStrength);
        return;
      }

      const diagonalCol =
        anchorCube.row % 2 === 0 ? anchorCube.col : anchorCube.col + 1;

      const arrowCubes = [
        getCube(anchorCube.row, anchorCube.col),
        getCube(anchorCube.row, anchorCube.col + 1),
        getCube(anchorCube.row + 1, diagonalCol),
      ].filter(Boolean);

      const nextArrowFaces = [];

      arrowCubes.forEach((cube) => {
        const selectedFaces = [cube.faces.top, cube.faces.right].filter(
          Boolean
        );

        selectedFaces.forEach((face) => {
          const radialStrength = getRadialStrength(face, mouse);

          face.arrowTarget = glowStrength * radialStrength;

          nextArrowFaces.push({
            face,
            radialStrength,
          });
        });
      });

      lastArrowFacesRef.current = nextArrowFaces;
    };

    const draw = () => {
      const mouse = mouseSmoothRef.current;
      const glowStrength = glowStrengthRef.current;

      ctx.clearRect(0, 0, width, height);

      updateArrowTargets();

      facesRef.current.forEach((face) => {
        face.arrowFill = lerp(face.arrowFill, face.arrowTarget, arrowFillLerp);
        face.arrowBorder = lerp(
          face.arrowBorder,
          face.arrowTarget,
          arrowBorderLerp
        );

        const center = getFaceCenter(face.points);

        const dx = center.x - mouse.x;
        const dy = center.y - mouse.y;
        const distance = Math.hypot(dx, dy);

        const rawInfluence = Math.max(0, 1 - distance / glowRadius);
        const influence = Math.pow(rawInfluence, glowPower) * glowStrength;

        // base face fill
        drawPolygon(face.points);
        ctx.fillStyle = `rgba(255, 255, 255, ${face.fillAlpha})`;
        ctx.fill();

        // orange arrow fill
        if (face.arrowFill > 0.001) {
          drawPolygon(face.points);
          ctx.fillStyle = arrowFillColor.replace(
            /rgba?\(([^)]+)\)/,
            `rgba(255, 95, 0, ${face.arrowFill * arrowFillOpacity})`
          );
          ctx.fill();
        }

        // white base border is always drawn first
        drawPolygon(face.points);
        ctx.lineWidth = baseLineWidth;
        ctx.strokeStyle = `rgba(255, 255, 255, ${baseBorderOpacity})`;
        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";
        ctx.stroke();

        // radial orange hover border
        if (influence > 0.001) {
          drawPolygon(face.points);
          ctx.lineWidth = baseLineWidth;
          ctx.strokeStyle = `rgba(255, 95, 0, ${
            influence * orangeBorderOpacity
          })`;
          ctx.shadowBlur = 0;
          ctx.shadowColor = "transparent";
          ctx.stroke();
        }

        // arrow orange border as smooth overlay
        if (face.arrowBorder > 0.001) {
          drawPolygon(face.points);
          ctx.lineWidth = baseLineWidth;
          ctx.strokeStyle = `rgba(255, 95, 0, ${face.arrowBorder * 0.85})`;
          ctx.shadowBlur = 0;
          ctx.shadowColor = "transparent";
          ctx.stroke();
        }
      });
    };

    const setPointerFromClient = (clientX, clientY) => {
      updateBounds();

      const { left, top, width: boundsWidth, height: boundsHeight } = boundsRef.current;

      const localX = clientX - left;
      const localY = clientY - top;

      const inside =
        localX >= 0 &&
        localX <= boundsWidth &&
        localY >= 0 &&
        localY <= boundsHeight;

      if (!inside) {
        if (isInsideRef.current) {
          isInsideRef.current = false;
          glowTargetRef.current = 0;
        }

        return;
      }

      const x = clamp(localX, 0, width);
      const y = clamp(localY, 0, height);

      isInsideRef.current = true;
      lastMoveTimeRef.current = performance.now();
      glowTargetRef.current = 1;

      mouseTargetRef.current.x = x;
      mouseTargetRef.current.y = y;

      mouseActualRef.current.x = x;
      mouseActualRef.current.y = y;
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
      updateBounds();

      const dpr = Math.min(window.devicePixelRatio || 1, dprLimit);

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
      mouseActualRef.current.x = idleX;
      mouseActualRef.current.y = idleY;

      glowStrengthRef.current = 0;
      glowTargetRef.current = 0;
      lastMoveTimeRef.current = performance.now();
      isInsideRef.current = false;

      lastArrowFacesRef.current = [];

      facesRef.current = buildFaces();
      draw();
    };

    const handlePointerMove = (event) => {
      setPointerFromClient(event.clientX, event.clientY);
    };

    const handlePointerLeaveWindow = () => {
      isInsideRef.current = false;
      glowTargetRef.current = 0;
    };

    resize();

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    window.addEventListener("pointerrawupdate", handlePointerMove, {
      passive: true,
    });

    window.addEventListener("pointerleave", handlePointerLeaveWindow);
    window.addEventListener("blur", handlePointerLeaveWindow);
    window.addEventListener("resize", resize);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerrawupdate", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeaveWindow);
      window.removeEventListener("blur", handlePointerLeaveWindow);
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
    arrowFillColor,
    arrowFillOpacity,
    arrowFillLerp,
    arrowBorderLerp,
    arrowRadialFadeRadius,
    arrowRadialFadePower,
  ]);

  return (
    <div
      ref={wrapperRef}
      className={`pointer-events-auto absolute h-[60vw] inset-0 z-[1] overflow-hidden ${className}`}
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