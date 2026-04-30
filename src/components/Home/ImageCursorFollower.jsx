"use client";

import React, { useEffect, useRef } from "react";

export default function ImageCursorFollower({
  defaultSrc = "/assets/images/cursor-shaped-img.png",
  pointerSrc = "/assets/cursors/cursor-pointer-image.png",
  size = 42,

  pointerSize = 42,

  rotationOffset = 90,

  positionLerp = 0.16,
  rotationLerp = 0.14,

  zIndex = 9999,
  hideDefaultCursor = true,
  minDistanceToRotate = 2,

  pointerSelector =
    'a, button, [role="button"], input, textarea, select, summary, label, [data-cursor="pointer"]',
}) {
  const cursorRef = useRef(null);

  const rafRef = useRef(null);

  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const lastMouseRef = useRef({ x: 0, y: 0 });

  const rotationRef = useRef(rotationOffset);
  const targetRotationRef = useRef(rotationOffset);

  const hasMovedRef = useRef(false);
  const visibleRef = useRef(false);
  const isPointerRef = useRef(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;

    targetRef.current.x = startX;
    targetRef.current.y = startY;
    currentRef.current.x = startX;
    currentRef.current.y = startY;
    lastMouseRef.current.x = startX;
    lastMouseRef.current.y = startY;

    cursor.style.opacity = "0";
    cursor.style.width = `${size}px`;
    cursor.style.height = `${size}px`;

    if (hideDefaultCursor) {
      document.documentElement.style.cursor = "none";
      document.body.style.cursor = "none";
    }

    const lerp = (start, end, amount) => {
      return start + (end - start) * amount;
    };

    const getShortestRotation = (currentAngle, targetAngle) => {
      let diff = targetAngle - currentAngle;

      while (diff > 180) diff -= 360;
      while (diff < -180) diff += 360;

      return currentAngle + diff;
    };

    const isPointerTarget = (target) => {
      if (!target || !(target instanceof Element)) return false;

      const matchedElement = target.closest(pointerSelector);

      if (matchedElement) return true;

      const computedCursor = window.getComputedStyle(target).cursor;
      return computedCursor === "pointer";
    };

    const setCursorMode = (isPointer) => {
      if (isPointerRef.current === isPointer) return;

      isPointerRef.current = isPointer;

      cursor.src = isPointer ? pointerSrc : defaultSrc;
      cursor.style.width = `${isPointer ? pointerSize : size}px`;
      cursor.style.height = `${isPointer ? pointerSize : size}px`;
    };

    const animate = () => {
      currentRef.current.x = lerp(
        currentRef.current.x,
        targetRef.current.x,
        positionLerp
      );

      currentRef.current.y = lerp(
        currentRef.current.y,
        targetRef.current.y,
        positionLerp
      );

      const shortestTarget = getShortestRotation(
        rotationRef.current,
        targetRotationRef.current
      );

      rotationRef.current = lerp(
        rotationRef.current,
        shortestTarget,
        rotationLerp
      );

      const scale = visibleRef.current ? 1 : 0.9;

      cursor.style.transform = `
        translate3d(${currentRef.current.x}px, ${currentRef.current.y}px, 0)
        translate(-50%, -50%)
        rotate(${rotationRef.current}deg)
        scale(${scale})
      `;

      rafRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (event) => {
      const x = event.clientX;
      const y = event.clientY;

      targetRef.current.x = x;
      targetRef.current.y = y;

      setCursorMode(isPointerTarget(event.target));

      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        visibleRef.current = true;

        currentRef.current.x = x;
        currentRef.current.y = y;
        lastMouseRef.current.x = x;
        lastMouseRef.current.y = y;

        cursor.style.opacity = "1";
        return;
      }

      const dx = x - lastMouseRef.current.x;
      const dy = y - lastMouseRef.current.y;

      const distance = Math.hypot(dx, dy);

      if (distance > minDistanceToRotate) {
        const movementAngle = Math.atan2(dy, dx) * (180 / Math.PI);
        targetRotationRef.current = movementAngle + rotationOffset;
      }

      lastMouseRef.current.x = x;
      lastMouseRef.current.y = y;

      if (!visibleRef.current) {
        visibleRef.current = true;
        cursor.style.opacity = "1";
      }
    };

    const handleMouseOver = (event) => {
      setCursorMode(isPointerTarget(event.target));
    };

    const handleMouseOut = (event) => {
      const nextTarget = event.relatedTarget;

      if (!nextTarget) {
        setCursorMode(false);
        return;
      }

      setCursorMode(isPointerTarget(nextTarget));
    };

    const handleMouseLeave = () => {
      visibleRef.current = false;
      cursor.style.opacity = "0";
    };

    const handleMouseEnter = () => {
      if (!hasMovedRef.current) return;

      visibleRef.current = true;
      cursor.style.opacity = "1";
    };

    rafRef.current = requestAnimationFrame(animate);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);

      if (hideDefaultCursor) {
        document.documentElement.style.cursor = "";
        document.body.style.cursor = "";
      }
    };
  }, [
    defaultSrc,
    pointerSrc,
    size,
    pointerSize,
    positionLerp,
    rotationLerp,
    rotationOffset,
    hideDefaultCursor,
    minDistanceToRotate,
    pointerSelector,
  ]);

  return (
    <img
      ref={cursorRef}
      src={defaultSrc}
      alt=""
      aria-hidden="true"
      draggable={false}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: `${size}px`,
        height: `${size}px`,
        zIndex,
        pointerEvents: "none",
        userSelect: "none",
        willChange: "transform, opacity",
        transition: "opacity 0.18s ease, width 0.18s ease, height 0.18s ease",
      }}
    />
  );
}