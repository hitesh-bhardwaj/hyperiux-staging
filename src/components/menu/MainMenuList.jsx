"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import MenuTextFace from "./MenuTextFace";
import SubMenu from "./SubMenu";

const MENU_ITEMS = [
  {
    label: "About",
    href: "/about",
    activePaths: ["/about"],
  },
  {
    label: "Work",
    href: "/our-portfolio",
    activePaths: ["/our-portfolio"],
  },
  {
    label: "Expertise",
    hasSubMenu: true,
    activePaths: ["/expertise", "/services","/solution-detail"],
  },
  {
    label: "Career",
    href: "/careers",
    activePaths: ["/careers", "/career"],
  },
  {
    label: "Resources",
    href: "/",
    activePaths: ["/resources", "/blogs", "/blog", "/insights"],
  },
  {
    label: "Contact",
    href: "/contact-us",
    activePaths: ["/contact-us", "/contact"],
  },
];

function normalizePath(pathname) {
  if (!pathname) return "/";

  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

function getActiveRouteIndex(pathname) {
  const currentPath = normalizePath(pathname);

  return MENU_ITEMS.findIndex((item) => {
    if (!item.activePaths?.length) return false;

    return item.activePaths.some((activePath) => {
      const normalizedActivePath = normalizePath(activePath);

      if (normalizedActivePath === "/") {
        return currentPath === "/";
      }

      return (
        currentPath === normalizedActivePath ||
        currentPath.startsWith(`${normalizedActivePath}/`)
      );
    });
  });
}

export default function MainMenuList({
  open,
  subMenu,
  setSubMenu,
  subevents,
  setSubEvents,
  setMobSubMenu,
  activeMenuIndex,
  setActiveMenuIndex,
  resolvedMenuIndex,
  closeMenu,
}) {
  const pathname = usePathname();

  const wrapperRef = useRef(null);
  const itemRefs = useRef([]);

  const [indicatorY, setIndicatorY] = useState(0);

  const activeRouteIndex = useMemo(() => {
    const index = getActiveRouteIndex(pathname);
    return index === -1 ? null : index;
  }, [pathname]);

  const visibleMenuIndex =
    resolvedMenuIndex !== null && resolvedMenuIndex !== undefined
      ? resolvedMenuIndex
      : activeRouteIndex;

  const deactivateSubMenu = () => {
    setSubMenu(false);
    setSubEvents(false);
  };

  const handleNormalItemEnter = (index) => {
    deactivateSubMenu();
    setActiveMenuIndex(index);
  };

  const handleExpertiseEnter = (index) => {
    setActiveMenuIndex(index);

    if (open) {
      setSubMenu(true);
      setSubEvents(true);
    }
  };

  useEffect(() => {
    if (visibleMenuIndex === null || visibleMenuIndex === undefined) return;

    const item = itemRefs.current[visibleMenuIndex];
    const wrapper = wrapperRef.current;

    if (!item || !wrapper) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    setIndicatorY(itemRect.top - wrapperRect.top + itemRect.height / 2);
  }, [visibleMenuIndex, pathname]);

  return (
    <div
      ref={wrapperRef}
      className="relative flex w-fit flex-col gap-[1.5vw] max-sm:gap-[7vw]"
      onMouseLeave={() => {
        setActiveMenuIndex(null);
        deactivateSubMenu();
      }}
    >
      <div
        className={[
          "absolute left-[-1.2vw] top-0 z-10 h-[0.8vw] w-[0.8vw] bg-white pointer-events-none max-sm:hidden",
          "transition-all duration-500 ease-[cubic-bezier(0.625,0.05,0,1)]",
          visibleMenuIndex === null || visibleMenuIndex === undefined
            ? "scale-0 opacity-0"
            : "scale-100 opacity-100",
        ].join(" ")}
        style={{
          transform: `translateY(calc(${indicatorY}px - 50%)) rotate(${
            visibleMenuIndex === null || visibleMenuIndex === undefined
              ? 0
              : visibleMenuIndex * 90
          }deg)`,
        }}
      />

      {MENU_ITEMS.map((item, index) => {
        const isActive = visibleMenuIndex === index;

        if (item.hasSubMenu) {
          return (
            <div
              key={item.label}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className={[
                "relative w-full transition-transform duration-500 ease-[cubic-bezier(0.625,0.05,0,1)]",
                isActive ? "translate-x-[1.5vw]" : "translate-x-0",
              ].join(" ")}
            >
              <div className="overflow-hidden">
                <div
                  className="main-menu-tag flex w-fit items-center gap-[1.5vw] font-display"
                  onMouseEnter={() => handleExpertiseEnter(index)}
                >
                  <button
                    type="button"
                    className="group flex items-center gap-[1.2vw] max-sm:gap-[3vw]"
                    onClick={() => setMobSubMenu(true)}
                  >
                    <MenuTextFace
                      text="Expertise"
                      as="span"
                      className="flex items-center gap-[1vw]"
                    />

                    <div className="menu-arrow mt-[0.5vw] h-[2vw] w-[1.8vw] overflow-hidden max-sm:mt-[3.5vw] max-sm:h-[8vw] max-sm:w-[8vw]">
                      <div className="flex w-fit translate-x-[-112%] flex-nowrap gap-[0.5vw] transition-transform duration-500 ease-in-out group-hover:translate-x-0 max-sm:h-[8vw] max-sm:w-[8vw] max-sm:translate-x-[-80%] max-sm:gap-[2vw]">
                        <Image
                          src="/assets/icons/arrow-right.svg"
                          alt="arrow-right"
                          className="mt-[0.1vw] h-[1.5vw] w-[1.5vw] rotate-45 brightness-[26] object-contain max-sm:h-[5vw] max-sm:w-[5vw]"
                          width={40}
                          height={40}
                        />

                        <Image
                          src="/assets/icons/arrow-right.svg"
                          alt="arrow-right"
                          className="mt-[0.1vw] h-[1.5vw] w-[1.5vw] rotate-45 brightness-[26] object-contain max-sm:h-[5vw] max-sm:w-[5vw]"
                          width={40}
                          height={40}
                        />
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <SubMenu
                subMenu={subMenu}
                setSubMenu={setSubMenu}
                subevents={subevents}
                setsubEvents={setSubEvents}
              />
            </div>
          );
        }

        return (
          <div
            key={item.label}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className={[
              "transition-transform duration-500 ease-[cubic-bezier(0.625,0.05,0,1)]",
              isActive ? "translate-x-[1.5vw]" : "translate-x-0",
            ].join(" ")}
            onMouseEnter={() => handleNormalItemEnter(index)}
          >
            <div className="overflow-hidden">
              <div className="main-menu-tag flex w-fit items-center gap-[1.5vw] font-display">
                <MenuTextFace
                  text={item.label}
                  href={item.href}
                  onClick={closeMenu}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}