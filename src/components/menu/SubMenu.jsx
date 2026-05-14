"use client";

import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import SubSubMenu from "./SubSubMenu";

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
      <span className="submenu-main-line flex whitespace-nowrap text-[1.6vw] leading-[1]">
        {chars.map((char, index) => (
          <span
            key={`main-${text}-${index}`}
            className="submenu-main-char inline-block whitespace-pre"
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>

      <span className="submenu-shadow-line absolute left-0 top-0 flex whitespace-nowrap text-[1.6vw] leading-[1]">
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

const SubMenu = ({ subMenu, setSubMenu, subevents, setsubEvents }) => {
  const menuItems = [
    { label: "Solution", href: "#" },
    { label: "Industry", href: "#" },
    { label: "Services", href: "#" },
  ];

  const [activeSub, setActiveSub] = useState(null);
  const [subSubMenu, setSubSubMenu] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray(".submenu-reveal-row");
      const arrows = gsap.utils.toArray(".sub-menu-arrow");

      if (subMenu) {
        gsap.fromTo(
          rows,
          {
            opacity: 0,
            yPercent: 20,
          },
          {
            opacity: 1,
            yPercent: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.06,
            overwrite: true,
          }
        );

        gsap.fromTo(
          arrows,
          {
            yPercent: 120,
            opacity: 0,
          },
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
        gsap.to(rows, {
          opacity: 0,
          yPercent: 10,
          duration: 0.3,
          ease: "power2.in",
          stagger: 0.04,
          overwrite: true,
        });

        gsap.to(arrows, {
          yPercent: 50,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          overwrite: true,
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [subMenu]);

  return (
    <div
      ref={rootRef}
      className={`absolute left-[100%] top-[30%] h-[30vw] w-[35vw] max-sm:hidden ${
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
        }}
      >
        <div className="flex w-fit flex-col gap-[0.5vw]">
          {menuItems.map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              className="submenu-reveal-row group h-fit w-fit font-display"
              onMouseEnter={() => {
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
                        className="mt-[0.1vw] h-full w-full !rotate-45 !brightness-[26] object-contain"
                        width={40}
                        height={40}
                      />
                      <Image
                        src="/assets/icons/arrow-right.svg"
                        alt="arrow-right"
                        className="mt-[0.1vw] h-full w-full !rotate-45 !brightness-[26] object-contain"
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