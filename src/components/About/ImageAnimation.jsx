"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "@/components/Footer/base.css";

const MathUtils = {
  lerp: (a, b, n) => (1 - n) * a + n * b,
  distance: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1),
};

const TOTAL_IMAGES = 7;
const TRAIL_LENGTH = 100;

export default function ImagesAnimation({ awardsRef }) {
  const imagesRef = useRef([]);

  const mousePos = useRef({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });
  const cacheMousePos = useRef({ x: 0, y: 0 });

  const zIndexVal = useRef(1);
  const imgPosition = useRef(0);
  const isInsideAwards = useRef(false);
  const hasMouseMoved = useRef(false);
  const rafRef = useRef(null);

  const threshold = 80;

  const handleMouseMove = (event) => {
    const awardsEl = awardsRef?.current;
    if (!awardsEl) return;

    const rect = awardsEl.getBoundingClientRect();

    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    isInsideAwards.current = inside;

    if (!inside) return;

    mousePos.current = {
      x: event.clientX,
      y: event.clientY,
    };

    if (!hasMouseMoved.current) {
      hasMouseMoved.current = true;
      lastMousePos.current = { ...mousePos.current };
      cacheMousePos.current = { ...mousePos.current };
    }
  };

  const getMouseDistance = () => {
    const current = mousePos.current;
    const last = lastMousePos.current;

    return MathUtils.distance(current.x, current.y, last.x, last.y);
  };

  const showNextImage = () => {
    const img = imagesRef.current[imgPosition.current];
    if (!img) return;

    const width = img.offsetWidth || window.innerWidth * 0.17;
    const height = img.offsetHeight || window.innerHeight * 0.3;

    gsap.killTweensOf(img);

    gsap
      .timeline()
      .set(img, {
        opacity: 1,
        scale: 0.2,
        rotateZ: gsap.utils.random(-35, 35),
        zIndex: 9999 + zIndexVal.current,
        x: cacheMousePos.current.x - width / 2,
        y: cacheMousePos.current.y - height / 2,
      })
      .to(img, {
        ease: "expo.out",
        rotateZ: 0,
        opacity: 1,
        scale: 1,
        duration: 0.85,
        x: mousePos.current.x - width / 2,
        y: mousePos.current.y - height / 2,
      })
      .to(
        img,
        {
          ease: "power4.inOut",
          opacity: 0,
          rotateZ: gsap.utils.random(-15, 15),
          duration: 0.65,
          scale: 0,
        },
        "-=0.45"
      );
  };

  const render = () => {
    cacheMousePos.current.x = MathUtils.lerp(
      cacheMousePos.current.x,
      mousePos.current.x,
      0.12
    );

    cacheMousePos.current.y = MathUtils.lerp(
      cacheMousePos.current.y,
      mousePos.current.y,
      0.12
    );

    const distance = getMouseDistance();

    if (hasMouseMoved.current && isInsideAwards.current && distance > threshold) {
      showNextImage();

      zIndexVal.current += 1;
      imgPosition.current =
        (imgPosition.current + 1) % imagesRef.current.length;

      lastMousePos.current = { ...mousePos.current };
    }

    rafRef.current = requestAnimationFrame(render);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      imagesRef.current.forEach((img) => {
        if (img) gsap.killTweensOf(img);
      });
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9998] pointer-events-none overflow-visible max-sm:hidden"
      aria-hidden="true"
    >
      {[...Array(TRAIL_LENGTH)].map((_, index) => {
        const imgIndex = (index % TOTAL_IMAGES) + 1;

        return (
          <img
            key={index}
            ref={(el) => {
              if (el) imagesRef.current[index] = el;
            }}
            src={`/assets/images/aboutpage/award-${imgIndex}.webp`}
            alt=""
            draggable={false}
            onError={() => {
              console.warn(
                `Award trail image not found: /assets/images/aboutpage/award-${imgIndex}.webp`
              );
            }}
            className="content__img fixed top-0 left-0 !w-[17vw] !h-[30vh] rounded-[0.7vw] !object-contain"
            style={{
              opacity: 0,
              pointerEvents: "none",
              willChange: "transform, opacity",
              transform: "translate3d(0,0,0) scale(0)",
            }}
          />
        );
      })}
    </div>
  );
}