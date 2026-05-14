"use client";

import gsap from "gsap";
import Link from "next/link";
import React, { useEffect, useRef } from "react";

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
      <span className="subsubmenu-main-line flex whitespace-nowrap text-[1.6vw] leading-[1]">
        {chars.map((char, index) => (
          <span
            key={`main-${text}-${index}`}
            className="subsubmenu-main-char inline-block whitespace-pre"
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>

      <span className="subsubmenu-shadow-line absolute left-0 top-0 flex whitespace-nowrap text-[1.6vw] leading-[1]">
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

const SubSubMenu = ({ subSubMenu, activeSub }) => {
  const rootRef = useRef(null);

  const menuItems = ["Design", "Development", "Marketing", "Strategy"];
  const menuItems2 = ["Fintech", "HealthCare", "Education", "Electronics"];

  const activeItems = activeSub === 1 ? menuItems : activeSub === 2 ? menuItems2 : [];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray(".subsubmenu-reveal-row");

      if (subSubMenu && activeSub) {
        gsap.fromTo(
          rows,
          {
            yPercent: 102,
            opacity: 0,
          },
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
    <div ref={rootRef} className="flex w-full gap-[5vw]">
      <div className="flex w-fit flex-col gap-[0.5vw]">
        {activeItems.map((label, index) => (
          <Link
            key={`${activeSub}-${label}-${index}`}
            href="#"
            className="subsubmenu-reveal-row h-fit w-fit font-display"
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