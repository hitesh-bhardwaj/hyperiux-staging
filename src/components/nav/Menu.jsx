"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { HoverFillLink } from "./HoverFillLink";
import { navigationData } from "./data";
import { useLenis } from "lenis/react";
import MenuStateText from "./MenuStateText";

gsap.registerPlugin(CustomEase, ScrollTrigger);

export function Menu() {
  const backgroundOverlayRef = useRef(null);
  const menuWrapperRef = useRef(null);
  const headerRef = useRef(null);
  const menuContentRef = useRef(null);
  const menuInnerRef = useRef(null);
  const seprationLineRef = useRef(null);

  const menuTimeline = useRef(null);
  const isFooterActiveRef = useRef(false);

  const col2Ref = useRef(null);
  const col3Ref = useRef(null);
  const mainSquareRef = useRef(null);
  const mainItemRefs = useRef([]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuHovered, setIsMenuHovered] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedSubIndex, setSelectedSubIndex] = useState(null);
  const [selectedNestedIndex, setSelectedNestedIndex] = useState(null);

  const [activeMainIndex, setActiveMainIndex] = useState(null);
  const [activeSubIndex, setActiveSubIndex] = useState(null);
  const [activeNestedIndex, setActiveNestedIndex] = useState(null);

  const lenis = useLenis();

  const menuEasing = "cubic-bezier(0.625, 0.05, 0, 1)";

  useEffect(() => {
    const square = mainSquareRef.current;
    const items = mainItemRefs.current.filter(Boolean);

    if (!square || !items.length) return;

    if (activeMainIndex === null) {
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

    const targetItem = items[activeMainIndex];

    if (!targetItem) return;

    const targetY =
      targetItem.offsetTop +
      targetItem.offsetHeight / 2 -
      square.offsetHeight / 2;

    gsap.to(square, {
      y: targetY,
      rotation: activeMainIndex * 90,
      duration: 0.4,
      ease: menuEasing,
      overwrite: "auto",
    });

    const totalTranslateImpact = 2;
    const translateValue = window.innerWidth * 0.015;

    items.forEach((item, index) => {
      const distance = Math.min(
        Math.abs(index - activeMainIndex) / totalTranslateImpact,
        1
      );

      gsap.to(item, {
        x: translateValue * (1 - distance),
        duration: 0.4,
        ease: menuEasing,
        overwrite: "auto",
      });
    });
  }, [activeMainIndex]);

  useEffect(() => {
    if (!col2Ref.current) return;

    const children = Array.from(col2Ref.current.children);
    if (children.length < 2) return;

    const square = children[0];
    const items = children.slice(1);

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
      targetItem.offsetTop +
      targetItem.offsetHeight / 2 -
      square.offsetHeight / 2;

    gsap.to(square, {
      y: targetY,
      rotation: activeSubIndex * 90,
      duration: 0.4,
      ease: menuEasing,
      overwrite: "auto",
    });

    const totalTranslateImpact = 2;
    const translateValue = window.innerWidth * 0.01;

    items.forEach((item, index) => {
      const distance = Math.min(
        Math.abs(index - activeSubIndex) / totalTranslateImpact,
        1
      );

      gsap.to(item, {
        x: translateValue * (1 - distance),
        duration: 0.4,
        ease: menuEasing,
        overwrite: "auto",
      });
    });
  }, [activeSubIndex, activeMainIndex]);

  useEffect(() => {
    if (!col3Ref.current) return;

    const children = Array.from(col3Ref.current.children);
    if (children.length < 2) return;

    const square = children[0];
    const items = children.slice(1);

    if (activeNestedIndex === null) {
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

    const targetItem = items[activeNestedIndex];

    if (!targetItem) return;

    const targetY =
      targetItem.offsetTop +
      targetItem.offsetHeight / 2 -
      square.offsetHeight / 2;

    gsap.to(square, {
      y: targetY,
      rotation: activeNestedIndex * 90,
      duration: 0.4,
      ease: menuEasing,
      overwrite: "auto",
    });

    const totalTranslateImpact = 2;
    const translateValue = window.innerWidth * 0.01;

    items.forEach((item, index) => {
      const distance = Math.min(
        Math.abs(index - activeNestedIndex) / totalTranslateImpact,
        1
      );

      gsap.to(item, {
        x: translateValue * (1 - distance),
        duration: 0.4,
        ease: menuEasing,
        overwrite: "auto",
      });
    });
  }, [activeNestedIndex, activeSubIndex]);

  useEffect(() => {
    if (activeMainIndex !== null && col2Ref.current) {
      const items = Array.from(col2Ref.current.children).slice(1);

      gsap.killTweensOf(items);

      gsap.fromTo(
        items,
        { opacity: 0, y: -14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: "elastic.out(0.9, 0.6)",
        }
      );
    }
  }, [activeMainIndex]);

  useEffect(() => {
    if (activeSubIndex !== null && col3Ref.current) {
      const items = Array.from(col3Ref.current.children).slice(1);

      gsap.killTweensOf(items);

      gsap.fromTo(
        items,
        { opacity: 0, y: -14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: "elastic.out(0.9, 0.6)",
        }
      );
    }
  }, [activeMainIndex, activeSubIndex]);

  useEffect(() => {
    CustomEase.create("menuEase", "0.625,0.05,0,1");

    const tl = gsap.timeline({ paused: true });

    const menuFadeItems = gsap.utils.toArray(
      menuInnerRef.current?.querySelectorAll(".menu-fade-item") || []
    );

    gsap.set(backgroundOverlayRef.current, {
      opacity: 0,
      pointerEvents: "none",
    });

    gsap.set(seprationLineRef.current, {
      opacity: 0,
    });

    gsap.set(menuContentRef.current, {
      clipPath: "inset(120% 0% 0% 0%)",
      WebkitClipPath: "inset(120% 0% 0% 0%)",
      pointerEvents: "none",
    });

    gsap.set(menuFadeItems, {
      opacity: 0,
      yPercent:40,
    });

    tl.to(
      backgroundOverlayRef.current,
      {
        opacity: 1,
        duration: 0.75,
        ease: "power2.inOut",
        pointerEvents: "auto",
      },
      0
    );

    tl.to(
      menuWrapperRef.current,
      {
        width: "98vw",
        duration: 1,
        ease: "menuEase",
      },
      0.08
    );

    tl.to(
      menuContentRef.current,
      {
        clipPath: "inset(0% 0% 0% 0%)",
        WebkitClipPath: "inset(0% 0% 0% 0%)",
        duration: 0.5,
        ease: "power2.inOut",
      },
      0.36
    );

    tl.to(
      menuFadeItems,
      {
        opacity: 1,
        yPercent: 0,
        duration: 0.5,
        stagger: 0.02,
        ease: "power2.inOut",
      },
      0.42
    );

    tl.to(
      seprationLineRef.current,
      {
        opacity: 1,
        duration: 0.45,
        ease: "power2.inOut",
      },
      0.45
    );

    tl.eventCallback("onStart", () => {
      if (menuContentRef.current) {
        menuContentRef.current.style.pointerEvents = "auto";
      }
    });

    tl.eventCallback("onReverseComplete", () => {
      if (menuContentRef.current) {
        menuContentRef.current.style.pointerEvents = "none";
      }

      gsap.set(backgroundOverlayRef.current, {
        pointerEvents: "none",
      });
    });

    menuTimeline.current = tl;

    return () => {
      tl.kill();
    };
  }, []);

  const closeMenu = () => {
    if (!menuTimeline.current) return;

    menuTimeline.current.reverse();
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    if (!menuTimeline.current) return;

    if (isFooterActiveRef.current) return;

    if (menuTimeline.current.reversed() || !isMenuOpen) {
      menuTimeline.current.play();
      setIsMenuOpen(true);
    } else {
      menuTimeline.current.reverse();
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (!lenis) return;

    if (isMenuOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [lenis, isMenuOpen]);

  useEffect(() => {
    const footer =
      document.querySelector("#footer-bottom") ||
      document.querySelector("#footer");

    const menu = menuWrapperRef.current;
    const overlay = backgroundOverlayRef.current;

    if (!footer || !menu || !overlay) return;

    const hideMenu = () => {
      isFooterActiveRef.current = true;

      gsap.killTweensOf([menu, overlay]);

      gsap.to(menu, {
        opacity: 0,
        duration: 0.35,
        ease: "power2.out",
        pointerEvents: "none",
        overwrite: true,
      });

      gsap.to(overlay, {
        opacity: 0,
        duration: 0.35,
        ease: "power2.out",
        pointerEvents: "none",
        overwrite: true,
      });
    };

    const showMenu = () => {
      isFooterActiveRef.current = false;

      gsap.killTweensOf([menu, overlay]);

      gsap.to(menu, {
        opacity: 1,
        duration: 0.35,
        ease: "power2.out",
        pointerEvents: "auto",
        overwrite: true,
      });

      if (isMenuOpen) {
        gsap.to(overlay, {
          opacity: 1,
          duration: 0.35,
          ease: "power2.out",
          pointerEvents: "auto",
          overwrite: true,
        });
      } else {
        gsap.set(overlay, {
          opacity: 0,
          pointerEvents: "none",
        });
      }
    };

    const trigger = ScrollTrigger.create({
      id: "hideMenuOnFooterBottom",
      trigger: footer,
      start: "top bottom",
      end: "bottom bottom",
      onEnter: hideMenu,
      onLeaveBack: showMenu,
      invalidateOnRefresh: true,
      // markers: true,
    });

    return () => {
      trigger.kill();
    };
  }, [isMenuOpen]);

  return (
    <>
      <div
        onClick={closeMenu}
        ref={backgroundOverlayRef}
        className="fixed h-screen w-screen z-[800] bg-black/50 top-0 left-0 pointer-events-none"
      />

      <div
        ref={menuWrapperRef}
        onMouseEnter={() => setIsMenuHovered(true)}
        onMouseLeave={() => setIsMenuHovered(false)}
        className="fixed z-[999] opacity-100 pointer-events-auto pl-[1.5vw] pr-[0.5vw] py-[0.3vw] text-white bg-[#111111] bottom-[1vw] left-1/2 -translate-x-1/2 w-[35vw] h-fit rounded-md border border-white/20"
      >
        <div
          ref={menuContentRef}
          style={{
            clipPath: "inset(120% 0% 0% 0%)",
            WebkitClipPath: "inset(120% 0% 0% 0%)",
          }}
          className="absolute pb-[3vw] p-[1vw] bottom-[2vw] mb-[0.5vw] -left-[0.07%] w-[100.12%] h-[40vw] bg-[#111111] rounded-md origin-bottom overflow-hidden border border-white/20 border-b-0 rounded-b-none"
        >
          <div
            ref={menuInnerRef}
            className="h-full w-full flex items-center justify-center gap-[1vw]"
          >
            <div
              className=" bg-[#1A1A1A] flex items-start p-[2vw] rounded-md overflow-hidden h-full gap-[2vw] w-[70vw]"
              onMouseLeave={() => {
                setActiveMainIndex(selectedIndex);
                setActiveSubIndex(selectedSubIndex);
                setActiveNestedIndex(selectedNestedIndex);
              }}
            >
              <div className="w-full h-full flex flex-col relative">
                <div
                  ref={mainSquareRef}
                  className="absolute top-0 left-[-1vw] w-[0.8vw] h-[0.8vw] bg-[#ff5f00] scale-0 opacity-0 pointer-events-none z-10"
                />

                {navigationData.map((item, index) => (
                  <div
                    key={index}
                    ref={(el) => {
                      mainItemRefs.current[index] = el;
                    }}
                  >
                    <HoverFillLink
                      href={item.href}
                      onClick={() => {
                        setSelectedIndex(index);
                        setSelectedSubIndex(null);
                        setSelectedNestedIndex(null);
                      }}
                      onMouseEnter={() => {
                        setActiveMainIndex(index);
                        setActiveSubIndex(null);
                      }}
                      isActive={activeMainIndex === index}
                      className="text-[3vw] menu-fade-item text-left transition-colors duration-300 font-aeonik"
                    >
                      {item.name}
                    </HoverFillLink>
                  </div>
                ))}
              </div>

              <div className="w-full h-full relative">
                {activeMainIndex !== null &&
                  navigationData[activeMainIndex].sublinks && (
                    <div
                      ref={col2Ref}
                      className="p-[2vw] h-fit rounded-md flex flex-col relative"
                    >
                      <div className="absolute top-0 left-[1vw] w-[0.6vw] h-[0.6vw] bg-[#ff5f00] scale-0 opacity-0 pointer-events-none z-10" />

                      {navigationData[activeMainIndex].sublinks.map(
                        (subItem, subIndex) => (
                          <div key={subIndex} className="opacity-0">
                            <HoverFillLink
                              href={subItem.href}
                              onClick={() => {
                                setSelectedIndex(activeMainIndex);
                                setSelectedSubIndex(subIndex);
                                setSelectedNestedIndex(null);
                              }}
                              onMouseEnter={() => setActiveSubIndex(subIndex)}
                              isActive={
                                activeSubIndex === subIndex ||
                                (activeSubIndex === null &&
                                  activeMainIndex === selectedIndex &&
                                  selectedSubIndex === subIndex)
                              }
                              className="text-[2vw] text-left font-aeonik"
                            >
                              {subItem.name}
                            </HoverFillLink>
                          </div>
                        )
                      )}
                    </div>
                  )}
              </div>

              <div className="w-full h-full relative">
                {activeMainIndex !== null &&
                  activeSubIndex !== null &&
                  navigationData[activeMainIndex].sublinks[activeSubIndex]
                    ?.nestedLinks && (
                    <div
                      ref={col3Ref}
                      className="p-[2vw] w-full h-fit rounded-md flex flex-col relative"
                    >
                      <div className="absolute top-0 left-[1vw] w-[0.6vw] h-[0.6vw] bg-[#ff5f00] scale-0 opacity-0 pointer-events-none z-10" />

                      {navigationData[activeMainIndex].sublinks[
                        activeSubIndex
                      ].nestedLinks.map((nestedItem, nestedIndex) => (
                        <div key={nestedIndex} className="opacity-0">
                          <HoverFillLink
                            href={nestedItem.href}
                            onClick={() => {
                              setSelectedIndex(activeMainIndex);
                              setSelectedSubIndex(activeSubIndex);
                              setSelectedNestedIndex(nestedIndex);
                            }}
                            onMouseEnter={() =>
                              setActiveNestedIndex(nestedIndex)
                            }
                            isActive={
                              activeMainIndex === selectedIndex &&
                              activeSubIndex === selectedSubIndex &&
                              selectedNestedIndex === nestedIndex
                            }
                            className="text-[2vw] block font-aeonik"
                          >
                            {nestedItem.name}
                          </HoverFillLink>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>

            <div className=" h-full flex flex-col justify-between w-[30vw]">
              <div className="space-y-[.5vw]">
                <div className="menu-fade-item aspect-video h-auto w-full overflow-hidden rounded-md">
                  <video
                    className="h-full w-full object-contain"
                    autoPlay
                    loop
                    muted
                    playsInline
                    src="/assets/videos/showreel.mp4"
                  />
                </div>

                <p className="font-aeonik menu-fade-item">Show Reel</p>
              </div>

              <div className="flex flex-col pb-[.2vw] gap-[.1vw]">
                <HoverFillLink
                  href="#"
                  className="text-[1.2vw] font-aeonik w-fit menu-fade-item"
                >
                  LABS
                </HoverFillLink>

                <HoverFillLink
                  href="#"
                  className="text-[1.2vw] font-aeonik w-fit menu-fade-item"
                >
                  VAULT
                </HoverFillLink>
              </div>
            </div>
          </div>
        </div>

        <header
          ref={headerRef}
          className="flex items-center justify-between relative"
        >
          <span
            ref={seprationLineRef}
            className="w-full h-[2px] absolute top-[-.5vw] left-1/2 -translate-x-1/2 bg-[#1A1A1A] transition-all duration-300 opacity-0"
            style={{ display: "block" }}
          />

          <div className="w-[8vw] h-auto relative">
            <Image
              src="/assets/icons/hyperiux-wordmark.svg"
              alt="logo"
              width={100}
              height={100}
              className="w-full h-full object-contain brightness-0 invert"
            />
          </div>

          <div
            onClick={toggleMenu}
            className="flex cursor-pointer duration-300 transition-all hover:bg-[#2E2A2A] p-[1vw] rounded-md items-center justify-center"
          >
            <MenuStateText
              isMenuOpen={isMenuOpen}
              isMenuHovered={isMenuHovered}
            />

            <div className="w-[1.5vw] h-[1vw] relative flex items-center justify-center">
              <span
                className={`absolute block w-full h-px bg-white transition-all duration-300 ${
                  isMenuOpen ? "rotate-45" : "-translate-y-[0.3vw]"
                }`}
              />

              <span
                className={`absolute block w-full h-px bg-white transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45" : "translate-y-[0.3vw]"
                }`}
              />
            </div>
          </div>
        </header>
      </div>
    </>
  );
}