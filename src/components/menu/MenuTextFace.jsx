"use client";

import Link from "next/link";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function MenuTextFace({
  text = "",
  href = "#",
  as = "link",
  className = "",
  onClick,
}) {
  const linkRef = useRef(null);
  const chars = Array.from(text);

  useEffect(() => {
    const link = linkRef.current;
    if (!link) return;

    const mainChars = link.querySelectorAll(".menu-nav-main-char");
    const shadowChars = link.querySelectorAll(".menu-nav-shadow-char");

    gsap.set(mainChars, {
      yPercent: 0,
      display: "inline-block",
      willChange: "transform",
    });

    gsap.set(shadowChars, {
      yPercent: 110,
      display: "inline-block",
      willChange: "transform",
    });

    const handleEnter = () => {
      gsap.killTweensOf([mainChars, shadowChars]);

      gsap.to(mainChars, {
        yPercent: -110,
        duration: 0.55,
        stagger: 0.014,
        ease: "power3.inOut",
        overwrite: true,
      });

      gsap.to(shadowChars, {
        yPercent: 0,
        duration: 0.55,
        stagger: 0.014,
        ease: "power3.inOut",
        overwrite: true,
      });
    };

    const handleLeave = () => {
      gsap.killTweensOf([mainChars, shadowChars]);

      gsap.to(mainChars, {
        yPercent: 0,
        duration: 0.55,
        stagger: 0.012,
        ease: "power3.inOut",
        overwrite: true,
      });

      gsap.to(shadowChars, {
        yPercent: 110,
        duration: 0.55,
        stagger: 0.012,
        ease: "power3.inOut",
        overwrite: true,
      });
    };

    link.addEventListener("mouseenter", handleEnter);
    link.addEventListener("mouseleave", handleLeave);

    return () => {
      link.removeEventListener("mouseenter", handleEnter);
      link.removeEventListener("mouseleave", handleLeave);
      gsap.killTweensOf([mainChars, shadowChars]);
    };
  }, [text]);

  const TextContent = (
    <span className="menu-tags main-menu-tag block">
      <span className="relative block h-[3.55vw] overflow-hidden leading-none max-sm:h-[10.5vw]">
        <span className="menu-nav-main flex whitespace-nowrap text-[3.4vw] leading-none max-sm:text-[10vw]">
          {chars.map((char, index) => (
            <span
              key={`main-${text}-${index}`}
              className="menu-nav-main-char inline-block whitespace-pre"
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>

        <span className="menu-nav-shadow absolute left-0 top-0 flex whitespace-nowrap text-[3.4vw] leading-none max-sm:text-[10vw]">
          {chars.map((char, index) => (
            <span
              key={`shadow-${text}-${index}`}
              className="menu-nav-shadow-char inline-block whitespace-pre"
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
      </span>
    </span>
  );

  const baseClassName = `relative block h-[3.55vw] w-fit overflow-hidden leading-none max-sm:h-[10.5vw] ${className}`;

  if (as === "button") {
    return (
      <div ref={linkRef} onClick={onClick} className={baseClassName}>
        {TextContent}
      </div>
    );
  }

  return (
    <Link
      ref={linkRef}
      href={href}
      onClick={onClick}
      className={baseClassName}
      prefetch={false}
    >
      {TextContent}
    </Link>
  );
}