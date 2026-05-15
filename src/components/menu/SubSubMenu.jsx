"use client";

import gsap from "gsap";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

function SplitHoverLink({ text = "", className = "" }) {
  const linkTextRef = useRef(null);
  const chars = Array.from(text);

  useEffect(() => {
    const el = linkTextRef.current;
    if (!el) return;

    const mainChars = el.querySelectorAll(".subsubmenu-main-char");
    const shadowChars = el.querySelectorAll(".subsubmenu-shadow-char");

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
        duration: 0.5,
        stagger: 0.012,
        ease: "power3.inOut",
        overwrite: true,
      });

      gsap.to(shadowChars, {
        yPercent: 0,
        duration: 0.5,
        stagger: 0.012,
        ease: "power3.inOut",
        overwrite: true,
      });
    };

    const handleLeave = () => {
      gsap.killTweensOf([mainChars, shadowChars]);

      gsap.to(mainChars, {
        yPercent: 0,
        duration: 0.5,
        stagger: 0.01,
        ease: "power3.inOut",
        overwrite: true,
      });

      gsap.to(shadowChars, {
        yPercent: 110,
        duration: 0.5,
        stagger: 0.01,
        ease: "power3.inOut",
        overwrite: true,
      });
    };

    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
      gsap.killTweensOf([mainChars, shadowChars]);
    };
  }, [text]);

  return (
    <div
      ref={linkTextRef}
      className={`menu-sub-sub-tags relative h-[1.75vw] w-fit overflow-hidden leading-none ${className}`}
    >
      <span className="subsubmenu-main-line flex whitespace-nowrap text-[1.6vw] leading-none">
        {chars.map((char, index) => (
          <span
            key={`main-${text}-${index}`}
            className="subsubmenu-main-char inline-block whitespace-pre"
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>

      <span className="subsubmenu-shadow-line absolute left-0 top-0 flex whitespace-nowrap text-[1.6vw] leading-none">
        {chars.map((char, index) => (
          <span
            key={`shadow-${text}-${index}`}
            className="subsubmenu-shadow-char inline-block whitespace-pre"
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </div>
  );
}

const menuEasing = "cubic-bezier(0.625, 0.05, 0, 1)";

const SubSubMenu = ({ subSubMenu, activeSub }) => {
  const rootRef = useRef(null);
  const subSubSquareRef = useRef(null);
  const subSubItemRefs = useRef([]);
  const [activeNestedIndex, setActiveNestedIndex] = useState(null);

  const menuItems = ["Design", "Development", "Marketing", "Strategy"];
  const menuItems2 = ["Fintech", "HealthCare", "Education", "Electronics"];

  const activeItems = activeSub === 1 ? menuItems : activeSub === 2 ? menuItems2 : [];

  // Reset active index when activeSub changes (switching between Solution/Industry)
  useEffect(() => {
    setActiveNestedIndex(null);
  }, [activeSub]);

  // Square animation for nested items
  useEffect(() => {
    const square = subSubSquareRef.current;
    const items = subSubItemRefs.current.filter(Boolean);
    if (!square || !items.length) return;

    // Remove square animation in mobile only
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      gsap.set(square, { scale: 0, opacity: 0 });
      gsap.set(items, { x: 0 });
      return;
    }

    if (activeNestedIndex === null) {
      gsap.to(square, { scale: 0, opacity: 0, duration: 0.3, overwrite: "auto", ease: menuEasing });
      gsap.to(items, { x: 0, duration: 0.4, ease: menuEasing, overwrite: "auto" });
      return;
    }

    gsap.to(square, { scale: 1, opacity: 1, duration: 0.3, overwrite: "auto", ease: menuEasing });

    const targetItem = items[activeNestedIndex];
    if (!targetItem) return;

    const targetY = targetItem.offsetTop + targetItem.offsetHeight / 2 - square.offsetHeight / 2;

    gsap.to(square, {
      y: targetY,
      rotation: activeNestedIndex * 90,
      duration: 0.4,
      ease: menuEasing,
      overwrite: "auto",
    });

    const translateValue = typeof window !== "undefined" ? window.innerWidth * 0.012 : 16;

    items.forEach((item, index) => {
      const distance = Math.min(Math.abs(index - activeNestedIndex) / 2, 1);
      gsap.to(item, {
        x: translateValue * (1 - distance),
        duration: 0.4,
        ease: menuEasing,
        overwrite: "auto",
      });
    });
  }, [activeNestedIndex]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray(".subsubmenu-reveal-row");

      if (subSubMenu && activeSub) {
        gsap.fromTo(
          rows,
          { yPercent: 102, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power4.out",
            stagger: 0.05,
            overwrite: true,
          }
        );
      } else {
        gsap.to(rows, {
          yPercent: 102,
          opacity: 0,
          duration: 0.45,
          ease: "power3.inOut",
          stagger: 0.035,
          overwrite: true,
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [subSubMenu, activeSub]);

  return (
    <div
      ref={rootRef}
      className="flex w-full gap-[5vw]"
      onMouseLeave={() => setActiveNestedIndex(null)}
    >
      <div className="relative flex w-fit flex-col gap-[0.5vw]">
        {/* Animated square for nested items */}
        <div
          ref={subSubSquareRef}
          className="pointer-events-none absolute left-[-1vw] top-0 z-10 h-[0.6vw] w-[0.6vw] scale-0 bg-white opacity-0"
        />

        {activeItems.map((label, index) => (
          <Link
            key={`${activeSub}-${label}-${index}`}
            href="#"
            ref={(el) => { subSubItemRefs.current[index] = el; }}
            className="subsubmenu-reveal-row h-fit w-fit font-display"
            onMouseEnter={() => setActiveNestedIndex(index)}
          >
            <div className="flex w-fit items-center gap-[1vw]">
              <SplitHoverLink text={label} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SubSubMenu;