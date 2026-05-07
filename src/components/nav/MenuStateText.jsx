"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function MenuStateText({ isMenuOpen, isMenuHovered }) {
  const baseTextRef = useRef(null);
  const openTextRef = useRef(null);
  const closeTextRef = useRef(null);

  const splitText = (text, keyPrefix) =>
    text.split("").map((char, index) => (
      <span
        key={`${keyPrefix}-${char}-${index}`}
        className="menu-state-char inline-block whitespace-pre"
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  const animateChars = (target, vars) => {
    if (!target) return;

    const chars = target.querySelectorAll(".menu-state-char");

    gsap.to(chars, {
      ...vars,
      stagger: 0.025,
      ease: "power2.inOut",
      overwrite: true,
    });
  };

  useEffect(() => {
    const baseChars = baseTextRef.current?.querySelectorAll(".menu-state-char");
    const openChars = openTextRef.current?.querySelectorAll(".menu-state-char");
    const closeChars =
      closeTextRef.current?.querySelectorAll(".menu-state-char");

    gsap.set(baseChars, { yPercent: 0 });
    gsap.set(openChars, { yPercent: 110 });
    gsap.set(closeChars, { yPercent: 110 });
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      animateChars(baseTextRef.current, {
        yPercent: -110,
        duration: 0.42,
      });

      animateChars(openTextRef.current, {
        yPercent: -110,
        duration: 0.42,
      });

      animateChars(closeTextRef.current, {
        yPercent: 0,
        duration: 0.42,
      });

      return;
    }

    if (isMenuHovered) {
      animateChars(baseTextRef.current, {
        yPercent: -110,
        duration: 0.42,
      });

      animateChars(openTextRef.current, {
        yPercent: 0,
        duration: 0.42,
      });

      animateChars(closeTextRef.current, {
        yPercent: 110,
        duration: 0.42,
      });

      return;
    }

    animateChars(closeTextRef.current, {
      yPercent: 110,
      duration: 0.42,
    });

    animateChars(openTextRef.current, {
      yPercent: 110,
      duration: 0.42,
    });

    animateChars(baseTextRef.current, {
      yPercent: 0,
      duration: 0.42,
    });
  }, [isMenuOpen, isMenuHovered]);

  return (
    <div className="relative h-[1.15vw] min-w-[3.2vw] overflow-hidden text-left font-aeonik text-[1vw] leading-[1] ">
      <span ref={baseTextRef} className="absolute left-0 top-0 flex">
        {splitText("Menu", "menu")}
      </span>

      <span ref={openTextRef} className="absolute left-0 top-0 flex">
        {splitText("Open", "open")}
      </span>

      <span ref={closeTextRef} className="absolute left-0 top-0 flex">
        {splitText("Close", "close")}
      </span>
    </div>
  );
}