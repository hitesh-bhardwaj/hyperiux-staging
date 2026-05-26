"use client";

import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import SubSubMenu from "./SubSubMenu";
import { usePageTransition } from "../Animations/PageTransitionProvider";

function SplitHoverLink({ text = "", className = "" }) {
  const linkTextRef = useRef(null);
  const chars = Array.from(text);

  useEffect(() => {
    const el = linkTextRef.current;
    if (!el) return;

    const mainChars = el.querySelectorAll(".submenu-main-char");
    const shadowChars = el.querySelectorAll(".submenu-shadow-char");

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
      className={`menu-tags submenu-reveal-tag relative h-[1.75vw] w-fit overflow-hidden leading-none ${className}`}
    >
      <span className="submenu-main-line flex whitespace-nowrap text-[1.6vw] leading-none">
        {chars.map((char, index) => (
          <span
            key={`main-${text}-${index}`}
            className="submenu-main-char inline-block whitespace-pre"
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>

      <span className="submenu-shadow-line absolute left-0 top-0 flex whitespace-nowrap text-[1.6vw] leading-none">
        {chars.map((char, index) => (
          <span
            key={`shadow-${text}-${index}`}
            className="submenu-shadow-char inline-block whitespace-pre"
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </div>
  );
}

const menuEasing = "cubic-bezier(0.625, 0.05, 0, 1)";

const SubMenu = ({ subMenu, setSubMenu, subevents, setsubEvents }) => {
  const { push: transitionPush, isTransitioning } = usePageTransition();

  const menuItems = [
    { label: "Solution", href: "/services" },
    { label: "Industry", href: "#" },
    { label: "Services", href: "#" },
  ];

  const [activeSub, setActiveSub] = useState(null);
  const [subSubMenu, setSubSubMenu] = useState(false);
  const [activeSubIndex, setActiveSubIndex] = useState(null);
  const rootRef = useRef(null);
  const subSquareRef = useRef(null);
  const subItemRefs = useRef([]);

  const handleSubMenuRoute = (event, item, index) => {
    if (!item.href || item.href === "#") {
      event.preventDefault();
      return;
    }

    event.preventDefault();

    if (isTransitioning) return;

    setSubMenu(false);
    setSubSubMenu(false);
    setsubEvents(false);
    setActiveSubIndex(null);

    transitionPush(item.href);
  };

  useEffect(() => {
    const square = subSquareRef.current;
    const items = subItemRefs.current.filter(Boolean);
    if (!square || !items.length) return;

    if (typeof window !== "undefined" && window.innerWidth < 640) {
      gsap.set(square, { scale: 0, opacity: 0 });
      gsap.set(items, { x: 0 });
      return;
    }

    if (activeSubIndex === null) {
      gsap.to(square, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        overwrite: "auto",
        ease: menuEasing,
      });

      gsap.to(items, {
        x: 0,
        duration: 0.4,
        ease: menuEasing,
        overwrite: "auto",
      });

      return;
    }

    gsap.to(square, {
      scale: 1,
      opacity: 1,
      duration: 0.3,
      overwrite: "auto",
      ease: menuEasing,
    });

    const targetItem = items[activeSubIndex];
    if (!targetItem) return;

    const targetY =
      targetItem.offsetTop + targetItem.offsetHeight / 2 - square.offsetHeight / 2;

    gsap.to(square, {
      y: targetY,
      rotation: activeSubIndex * 90,
      duration: 0.4,
      ease: menuEasing,
      overwrite: "auto",
    });

    const translateValue =
      typeof window !== "undefined" ? window.innerWidth * 0.012 : 16;

    items.forEach((item, index) => {
      const distance = Math.min(Math.abs(index - activeSubIndex) / 2, 1);

      gsap.to(item, {
        x: translateValue * (1 - distance),
        duration: 0.4,
        ease: menuEasing,
        overwrite: "auto",
      });
    });
  }, [activeSubIndex]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray(".submenu-reveal-row");
      const arrows = gsap.utils.toArray(".sub-menu-arrow");

      if (rows.length > 0) {
        if (subMenu) {
          gsap.fromTo(
            rows,
            { opacity: 0, yPercent: 20 },
            {
              opacity: 1,
              yPercent: 0,
              duration: 0.6,
              ease: "power3.out",
              stagger: 0.06,
              overwrite: true,
            }
          );
        } else {
          gsap.to(rows, {
            opacity: 0,
            yPercent: 10,
            duration: 0.3,
            ease: "power2.in",
            stagger: 0.04,
            overwrite: true,
          });
        }
      }

      if (arrows.length > 0) {
        if (subMenu) {
          gsap.fromTo(
            arrows,
            { yPercent: 120, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power3.out",
              stagger: 0.06,
              overwrite: true,
            }
          );
        } else {
          gsap.to(arrows, {
            yPercent: 50,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            overwrite: true,
          });
        }
      }
    }, rootRef);

    return () => ctx.revert();
  }, [subMenu]);

  return (
    <div
      ref={rootRef}
      className={`absolute left-full top-[30%] h-[30vw] w-[35vw] max-sm:hidden ${
        subevents ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        className="flex w-full gap-[5vw] pl-[7vw]"
        onMouseEnter={() => setSubMenu(true)}
        onMouseLeave={() => {
          setSubMenu(false);
          setSubSubMenu(false);
          setsubEvents(false);
          setActiveSubIndex(null);
        }}
      >
        <div className="relative flex w-fit flex-col gap-[0.5vw]">
          <div
            ref={subSquareRef}
            className="pointer-events-none absolute left-[-1vw] top-0 z-10 h-[0.6vw] w-[0.6vw] scale-0 bg-white opacity-0"
          />

          {menuItems.map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              ref={(el) => {
                subItemRefs.current[index] = el;
              }}
              className="submenu-reveal-row group h-fit w-fit font-display"
              onClick={(event) => handleSubMenuRoute(event, item, index)}
              onMouseEnter={() => {
                setActiveSubIndex(index);

                if (index < 2) {
                  setSubSubMenu(true);
                  setActiveSub(index + 1);
                } else {
                  setActiveSub(null);
                  setSubSubMenu(false);
                }
              }}
            >
              <div className="flex w-fit items-center gap-[1vw]">
                <SplitHoverLink text={item.label} />

                {index < 2 && (
                  <div className="sub-menu-arrow arrows mt-[0.5vw] h-[1.5vw] w-[1.2vw] overflow-hidden">
                    <div className="flex w-fit translate-x-[-108%] flex-nowrap gap-[0.5vw] group-hover:translate-x-[5.5%] group-hover:duration-500 group-hover:ease-in-out">
                      <Image
                        src="/assets/icons/arrow-right.svg"
                        alt="arrow-right"
                        className="mt-[0.1vw] h-full w-full rotate-45! brightness-[26]! object-contain"
                        width={40}
                        height={40}
                      />
                      <Image
                        src="/assets/icons/arrow-right.svg"
                        alt="arrow-right"
                        className="mt-[0.1vw] h-full w-full rotate-45! brightness-[26]! object-contain"
                        width={40}
                        height={40}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        <SubSubMenu subSubMenu={subSubMenu} activeSub={activeSub} />
      </div>
    </div>
  );
};

export default SubMenu;