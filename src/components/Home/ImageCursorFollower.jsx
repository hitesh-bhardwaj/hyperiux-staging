"use client";

import React, { useEffect, useRef } from "react";

export default function ImageCursorFollower({
  defaultSrc = "/assets/images/black-pointer-bold.png",
  pointerSrc = "/assets/cursors/cursor-pointer-image.png",

  size = 42,
  pointerSize = 42,

  rotationOffset = 90,

  positionLerp = 0.18,
  rotationLerp = 0.2,

  zIndex = 2147483647,
  hideDefaultCursor = true,
  minDistanceToRotate = 2,

  // NEW
  idleRotateDelay = 1000,
  idleDirectionAngle = -90,

  pointerSelector =
    'a, button, [role="button"], input, textarea, select, summary, label, .cursor-pointer, [data-cursor="pointer"], [style*="cursor:pointer"], [style*="cursor: pointer"]',
}) {
  const cursorRef = useRef(null);
  const rafRef = useRef(null);
  const idleTimerRef = useRef(null);

  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const lastMouseRef = useRef({ x: 0, y: 0 });

  const rotationRef = useRef(rotationOffset);
  const targetRotationRef = useRef(rotationOffset);

  const hasMovedRef = useRef(false);
  const visibleRef = useRef(false);
  const isPointerRef = useRef(false);
  const isInsideWindowRef = useRef(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let styleTag = null;
    let lastKnownTarget = null;

    const idleUpRotation = idleDirectionAngle + rotationOffset;

    const clearIdleTimer = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
    };

    const startIdleTimer = () => {
      clearIdleTimer();

      idleTimerRef.current = setTimeout(() => {
        if (!visibleRef.current || !isInsideWindowRef.current) return;

        /*
          Smoothly rotate back to "up".
          Existing animate() lerps rotationRef toward targetRotationRef.
        */
        targetRotationRef.current = idleUpRotation;
      }, idleRotateDelay);
    };

    const applyNoCursorClass = () => {
      document.documentElement.classList.add("custom-cursor-active");
      document.body?.classList.add("custom-cursor-active");
    };

    const removeNoCursorClass = () => {
      document.documentElement.classList.remove("custom-cursor-active");
      document.body?.classList.remove("custom-cursor-active");
    };

    if (hideDefaultCursor) {
      styleTag = document.createElement("style");
      styleTag.setAttribute("data-custom-cursor-style", "true");

      styleTag.innerHTML = `
        html.custom-cursor-active,
        html.custom-cursor-active *,
        html.custom-cursor-active *::before,
        html.custom-cursor-active *::after,
        body.custom-cursor-active,
        body.custom-cursor-active *,
        body.custom-cursor-active *::before,
        body.custom-cursor-active *::after,
        html.custom-cursor-active canvas,
        html.custom-cursor-active svg,
        html.custom-cursor-active svg *,
        html.custom-cursor-active iframe {
          cursor: none !important;
        }

        .custom-cursor-image {
          cursor: none !important;
        }
      `;

      document.head.appendChild(styleTag);
      applyNoCursorClass();
    }

    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;

    targetRef.current.x = startX;
    targetRef.current.y = startY;
    currentRef.current.x = startX;
    currentRef.current.y = startY;
    lastMouseRef.current.x = startX;
    lastMouseRef.current.y = startY;

    rotationRef.current = idleUpRotation;
    targetRotationRef.current = idleUpRotation;

    cursor.style.opacity = "0";
    cursor.style.width = `${size}px`;
    cursor.style.height = `${size}px`;

    const lerp = (start, end, amount) => start + (end - start) * amount;

    const getShortestRotation = (currentAngle, targetAngle) => {
      let diff = targetAngle - currentAngle;

      while (diff > 180) diff -= 360;
      while (diff < -180) diff += 360;

      return currentAngle + diff;
    };

    const hasPointerClass = (element) => {
      if (!element || !(element instanceof Element)) return false;

      return Array.from(element.classList || []).some((className) => {
        return (
          className === "cursor-pointer" ||
          className.includes("cursor-pointer")
        );
      });
    };

    const hasInlinePointerStyle = (element) => {
      if (!element || !(element instanceof HTMLElement)) return false;
      return element.style?.cursor === "pointer";
    };

    const isPointerTarget = (target) => {
      if (!target || !(target instanceof Element)) return false;

      const matchedElement = target.closest(pointerSelector);
      if (matchedElement) return true;

      let current = target;

      while (current && current !== document.body) {
        if (hasPointerClass(current)) return true;
        if (hasInlinePointerStyle(current)) return true;
        current = current.parentElement;
      }

      return false;
    };

    const setCursorMode = (isPointer) => {
      if (isPointerRef.current === isPointer) return;

      isPointerRef.current = isPointer;

      cursor.src = isPointer ? pointerSrc : defaultSrc;
      cursor.style.width = `${isPointer ? pointerSize : size}px`;
      cursor.style.height = `${isPointer ? pointerSize : size}px`;
    };

    const hideCustomCursor = () => {
      clearIdleTimer();

      isInsideWindowRef.current = false;
      visibleRef.current = false;
      cursor.style.opacity = "0";
      setCursorMode(false);

      targetRotationRef.current = idleUpRotation;

      if (hideDefaultCursor) {
        applyNoCursorClass();
      }
    };

    const showCustomCursor = () => {
      if (!hasMovedRef.current) return;

      isInsideWindowRef.current = true;
      visibleRef.current = true;
      cursor.style.opacity = "1";

      startIdleTimer();

      if (hideDefaultCursor) {
        applyNoCursorClass();
      }
    };

    const syncCursorAtPoint = (x, y, target = null, immediate = false) => {
      targetRef.current.x = x;
      targetRef.current.y = y;

      if (target) {
        lastKnownTarget = target;
        setCursorMode(isPointerTarget(target));
      } else if (lastKnownTarget) {
        setCursorMode(isPointerTarget(lastKnownTarget));
      }

      if (immediate) {
        currentRef.current.x = x;
        currentRef.current.y = y;
        lastMouseRef.current.x = x;
        lastMouseRef.current.y = y;
      }
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
        translate(-40%, -30%)
        rotate(${rotationRef.current}deg)
        scale(${scale})
      `;

      rafRef.current = requestAnimationFrame(animate);
    };

    const handlePointerMove = (event) => {
      if (hideDefaultCursor) {
        applyNoCursorClass();
      }

      clearIdleTimer();

      const x = event.clientX;
      const y = event.clientY;

      const isFirstMove = !hasMovedRef.current;

      hasMovedRef.current = true;
      isInsideWindowRef.current = true;
      visibleRef.current = true;
      cursor.style.opacity = "1";

      syncCursorAtPoint(x, y, event.target, isFirstMove || !visibleRef.current);

      const dx = x - lastMouseRef.current.x;
      const dy = y - lastMouseRef.current.y;
      const distance = Math.hypot(dx, dy);

      if (distance > minDistanceToRotate) {
        const movementAngle = Math.atan2(dy, dx) * (180 / Math.PI);
        targetRotationRef.current = movementAngle + rotationOffset;
      }

      lastMouseRef.current.x = x;
      lastMouseRef.current.y = y;

      startIdleTimer();
    };

    const handlePointerOver = (event) => {
      if (hideDefaultCursor) {
        applyNoCursorClass();
      }

      lastKnownTarget = event.target;
      setCursorMode(isPointerTarget(event.target));

      if (visibleRef.current) {
        startIdleTimer();
      }
    };

    const handlePointerOut = (event) => {
      const nextTarget = event.relatedTarget;

      if (!nextTarget) {
        hideCustomCursor();
        return;
      }

      lastKnownTarget = nextTarget;
      setCursorMode(isPointerTarget(nextTarget));
    };

    const handleWindowMouseOut = (event) => {
      if (!event.relatedTarget && !event.toElement) {
        hideCustomCursor();
      }
    };

    const handleWindowMouseOver = (event) => {
      if (hideDefaultCursor) {
        applyNoCursorClass();
      }

      if (event.clientX >= 0 && event.clientY >= 0) {
        showCustomCursor();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        hideCustomCursor();
        return;
      }

      if (hideDefaultCursor) {
        applyNoCursorClass();
      }

      visibleRef.current = false;
      cursor.style.opacity = "0";
      targetRotationRef.current = idleUpRotation;
      clearIdleTimer();
    };

    const handleWindowBlur = () => {
      hideCustomCursor();
    };

    const handleWindowFocus = () => {
      if (hideDefaultCursor) {
        applyNoCursorClass();
      }

      visibleRef.current = false;
      cursor.style.opacity = "0";
      targetRotationRef.current = idleUpRotation;
      clearIdleTimer();
    };

    const handlePointerDown = (event) => {
      if (hideDefaultCursor) {
        applyNoCursorClass();
      }

      if (event.clientX !== undefined && event.clientY !== undefined) {
        syncCursorAtPoint(event.clientX, event.clientY, event.target, false);
      }

      startIdleTimer();
    };

    rafRef.current = requestAnimationFrame(animate);

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    document.addEventListener("pointerover", handlePointerOver, true);
    document.addEventListener("pointerout", handlePointerOut, true);
    window.addEventListener("mouseout", handleWindowMouseOut, true);
    window.addEventListener("mouseover", handleWindowMouseOver, true);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);
    window.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearIdleTimer();

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerover", handlePointerOver, true);
      document.removeEventListener("pointerout", handlePointerOut, true);
      window.removeEventListener("mouseout", handleWindowMouseOut, true);
      window.removeEventListener("mouseover", handleWindowMouseOver, true);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      window.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      removeNoCursorClass();

      if (styleTag) {
        styleTag.remove();
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
    idleRotateDelay,
    idleDirectionAngle,
  ]);

  return (
    <img
      ref={cursorRef}
      className="custom-cursor-image max-sm:hidden"
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
        transition: "opacity 0.12s ease, width 0.12s ease, height 0.12s ease",
        transform: "translate3d(-9999px, -9999px, 0)",
      }}
    />
  );
}