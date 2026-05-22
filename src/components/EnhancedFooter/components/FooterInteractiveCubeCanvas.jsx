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

  cubeScale = 0.04,

  glowRadius = 280,
  glowPower = 2.0,
  baseLineWidth = 1,

  /*
    These now fade with cursor activity.
    When mouse is idle, they go to 0 quickly.
  */
  baseFaceOpacity = 0.42,
  baseBorderOpacity = 0.72,

  /*
    This controls radial white stroke around cursor.
  */
  radialStrokeOpacity = 1,

  /*
    Mouse movement smoothing.
  */
  mouseLerp = 0.16,
  selectionMouseLerp = 0.12,

  /*
    Separate in/out glow lerps.
    Out is higher so it disappears fast when mouse stops.
  */
  glowInLerp = 0.12,
  glowOutLerp = 0.32,
  idleFadeDelay = 520,

  idleGlowX = 0.58,
  idleGlowY = 0.45,

  dprLimit = 2,

  /*
    Hovered arrow faces.
    Increase opacity here.
  */
  arrowFillColor = "rgba(255, 255, 255, 1)",
  arrowFillOpacity = 1,
  arrowFillInLerp = 0.16,
  arrowFillOutLerp = 0.28,

  arrowBorderInLerp = 0.14,
  arrowBorderOutLerp = 0.3,

  arrowRadialFadeRadius = 420,
  arrowRadialFadePower = 1.0,
}) {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);

  const facesRef = useRef([]);
  const cubesRef = useRef([]);
  const lastArrowFacesRef = useRef([]);

  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const mouseSmoothRef = useRef({ x: 0, y: 0 });

  const mouseActualRef = useRef({ x: 0, y: 0 });
  const mouseSelectionRef = useRef({ x: 0, y: 0 });

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

          const noise = random() * 0.035;

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
            fillAlpha: baseFaceOpacity - noise,
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
            fillAlpha: baseFaceOpacity - noise,
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
            fillAlpha: baseFaceOpacity - noise,
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

      return Math.max(0.28, radialStrength);
    };

    const applyLastArrowRadialFade = (glowStrength) => {
      lastArrowFacesRef.current.forEach(({ face, radialStrength }) => {
        if (!face) return;

        face.arrowTarget = glowStrength * radialStrength;
      });
    };

    const updateArrowTargets = () => {
      /*
        Use a lerped selection mouse so the arrow does not jump harshly
        while still following fast cursor movement.
      */
      const mouse = mouseSelectionRef.current;
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
    const fillLerp =
      face.arrowTarget > face.arrowFill ? arrowFillInLerp : arrowFillOutLerp;

    const borderLerp =
      face.arrowTarget > face.arrowBorder
        ? arrowBorderInLerp
        : arrowBorderOutLerp;

    face.arrowFill = lerp(face.arrowFill, face.arrowTarget, fillLerp);
    face.arrowBorder = lerp(face.arrowBorder, face.arrowTarget, borderLerp);

    const center = getFaceCenter(face.points);

    const dx = center.x - mouse.x;
    const dy = center.y - mouse.y;
    const distance = Math.hypot(dx, dy);

    const rawInfluence = Math.max(0, 1 - distance / glowRadius);
    const influence = Math.pow(rawInfluence, glowPower) * glowStrength;

    /*
      NO BASE FACE FILL.
      Everything stays transparent unless hovered.
    */

    /*
      Hover arrow faces only.
      White filled faces.
    */
    if (face.arrowFill > 0.001) {
      drawPolygon(face.points);
      ctx.fillStyle = `rgba(255, 255, 255, ${
        face.arrowFill * arrowFillOpacity
      })`;
      ctx.fill();
    }

    /*
      NO BASE STROKE.
      Cube strokes stay transparent unless cursor is nearby.
    */

    /*
      Radial white strokes around cursor.
    */
    if (influence > 0.001) {
      drawPolygon(face.points);
      ctx.lineWidth = baseLineWidth;
      ctx.strokeStyle = `rgba(255, 255, 255, ${
        influence * radialStrokeOpacity
      })`;
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
      ctx.stroke();
    }

    /*
      Arrow white border overlay.
    */
    if (face.arrowBorder > 0.001) {
      drawPolygon(face.points);
      ctx.lineWidth = baseLineWidth;
      ctx.strokeStyle = `rgba(255, 255, 255, ${face.arrowBorder * 0.95})`;
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
      ctx.stroke();
    }
  });
};

    const setPointerFromClient = (clientX, clientY) => {
      updateBounds();

      const {
        left,
        top,
        width: boundsWidth,
        height: boundsHeight,
      } = boundsRef.current;

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
      const actual = mouseActualRef.current;
      const selection = mouseSelectionRef.current;

      /*
        Main radial glow lerp.
      */
      smooth.x = lerp(smooth.x, target.x, mouseLerp);
      smooth.y = lerp(smooth.y, target.y, mouseLerp);

      /*
        Arrow/cube selection lerp.
        This makes the cube fill trail smoother while moving.
      */
      selection.x = lerp(selection.x, actual.x, selectionMouseLerp);
      selection.y = lerp(selection.y, actual.y, selectionMouseLerp);

      if (isInsideRef.current && now - lastMoveTimeRef.current > idleFadeDelay) {
        glowTargetRef.current = 0;
      }

      const currentGlowLerp =
        glowTargetRef.current > glowStrengthRef.current
          ? glowInLerp
          : glowOutLerp;

      glowStrengthRef.current = lerp(
        glowStrengthRef.current,
        glowTargetRef.current,
        currentGlowLerp
      );

      /*
        Hard cleanup once almost invisible so nothing stays ghosted.
      */
      if (glowTargetRef.current === 0 && glowStrengthRef.current < 0.002) {
        glowStrengthRef.current = 0;

        facesRef.current.forEach((face) => {
          face.arrowTarget = 0;
          face.arrowFill = 0;
          face.arrowBorder = 0;
        });
      }

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
      mouseSelectionRef.current.x = idleX;
      mouseSelectionRef.current.y = idleY;

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
    baseFaceOpacity,
    baseBorderOpacity,
    radialStrokeOpacity,
    mouseLerp,
    selectionMouseLerp,
    glowInLerp,
    glowOutLerp,
    idleFadeDelay,
    idleGlowX,
    idleGlowY,
    dprLimit,
    arrowFillColor,
    arrowFillOpacity,
    arrowFillInLerp,
    arrowFillOutLerp,
    arrowBorderInLerp,
    arrowBorderOutLerp,
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