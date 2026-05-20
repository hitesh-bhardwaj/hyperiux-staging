"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import SubMenu from "./SubMenu";
import MobSubMenu from "./MobSubMenu";
import MiniCanvas from "./MiniCanvas";
import MenuTextFace from "./MenuTextFace";

import {
  Facebook,
  FooterUnderlineLink,
  Instagram,
  Linkedin,
  Twitter,
} from "../Buttons";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { usePathname } from "next/navigation";

import {
  getClosedMenuState,
  menuEase,
  resetMenuStyles,
  sectionHeadings,
} from "./menuUtils";

gsap.registerPlugin(CustomEase, ScrollTrigger, SplitText);

export default function BottomMenuDes() {
  const [open, setOpen] = useState(false);
  const [bottomEnter, setBottomEnter] = useState(false);
  const [subevents, setSubEvents] = useState(false);
  const [subMenu, setSubMenu] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [mobSubMenu, setMobSubMenu] = useState(false);
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);

  const pathname = usePathname();

  const mainSquareRef = useRef(null);
  const mainItemRefs = useRef([]);

  const backgroundOverlayRef = useRef(null);
  const menuWrapperRef = useRef(null);
  const menuContentRef = useRef(null);
  const seprationLineRef = useRef(null);
  const menuTimeline = useRef(null);
  const bottomHeaderRef = useRef(null);

  const dynamicHeadingRef = useRef(null);
  const dynamicSplitRef = useRef(null);
  const activeHeadingRef = useRef("");
  const headingTweenRef = useRef(null);

  const isMenuAnimatingRef = useRef(false);
  const resetMenuTimerRef = useRef(null);

  const resolvedMenuIndex = subMenu ? 2 : activeMenuIndex;

  const closeMenu = () => {
    setOpen(false);
    setMobSubMenu(false);
    setSubMenu(false);
    setSubEvents(false);
    setActiveMenuIndex(null);
  };

  const toggleMenu = () => {
    if (isMenuAnimatingRef.current) return;

    setMobSubMenu(false);
    setSubMenu(false);
    setSubEvents(false);
    setActiveMenuIndex(null);

    setOpen((prev) => !prev);
  };

  useEffect(() => {
    let timer;

    if (open) {
      timer = setTimeout(() => setInteractive(true), 500);
    } else {
      setInteractive(false);
    }

    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    setBottomEnter(false);
    setOpen(false);
    setMobSubMenu(false);
    setSubMenu(false);
    setSubEvents(false);
    setActiveMenuIndex(null);
    setInteractive(false);

    resetMenuStyles({
      menuTimeline,
      menuWrapperRef,
      menuContentRef,
      bottomHeaderRef,
      seprationLineRef,
      backgroundOverlayRef,
      isMenuAnimatingRef,
    });
  }, [pathname]);

  useEffect(() => {
    const square = mainSquareRef.current;
    const items = mainItemRefs.current.filter(Boolean);

    if (!square || !items.length) return;

    if (typeof window !== "undefined" && window.innerWidth < 640) {
      gsap.set(square, { scale: 0, opacity: 0 });
      gsap.set(items, { x: 0 });
      return;
    }

    if (resolvedMenuIndex === null) {
      gsap.to(square, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        overwrite: "auto",
        ease: menuEase,
      });

      gsap.to(items, {
        x: 0,
        duration: 0.4,
        ease: menuEase,
        overwrite: "auto",
      });

      return;
    }

    const targetItem = items[resolvedMenuIndex];
    if (!targetItem) return;

    const targetY =
      targetItem.offsetTop +
      targetItem.offsetHeight / 2 -
      square.offsetHeight / 2;

    gsap.to(square, {
      scale: 1,
      opacity: 1,
      duration: 0.3,
      overwrite: "auto",
      ease: menuEase,
    });

    gsap.to(square, {
      y: targetY,
      rotation: resolvedMenuIndex * 90,
      duration: 0.4,
      ease: menuEase,
      overwrite: "auto",
    });

    const totalTranslateImpact = 2;
    const translateValue =
      typeof window !== "undefined" ? window.innerWidth * 0.015 : 20;

    items.forEach((item, index) => {
      const distance = Math.min(
        Math.abs(index - resolvedMenuIndex) / totalTranslateImpact,
        1
      );

      gsap.to(item, {
        x: translateValue * (1 - distance),
        duration: 0.4,
        ease: menuEase,
        overwrite: "auto",
      });
    });
  }, [resolvedMenuIndex]);

  useEffect(() => {
    CustomEase.create("menuEase", "0.625,0.05,0,1");

    const mm = gsap.matchMedia();

    mm.add("(min-width: 641px)", () => {
      const tl = gsap.timeline({
        paused: true,

        onStart: () => {
          isMenuAnimatingRef.current = true;

          if (menuContentRef.current) {
            menuContentRef.current.style.pointerEvents = "auto";
          }
        },

        onComplete: () => {
          isMenuAnimatingRef.current = false;
        },

        onReverseComplete: () => {
          isMenuAnimatingRef.current = false;

          if (menuContentRef.current) {
            menuContentRef.current.style.pointerEvents = "none";
          }

          gsap.set(backgroundOverlayRef.current, {
            pointerEvents: "none",
          });

          if (bottomHeaderRef.current) {
            bottomHeaderRef.current.style.pointerEvents = "auto";
          }
        },
      });

      gsap.set(backgroundOverlayRef.current, {
        opacity: 0,
        pointerEvents: "none",
      });

      gsap.set(menuWrapperRef.current, getClosedMenuState());

      gsap.set(menuContentRef.current, {
        opacity: 0,
        pointerEvents: "none",
      });

      gsap.set(seprationLineRef.current, {
        opacity: 0,
      });

      gsap.set(bottomHeaderRef.current, {
        opacity: 1,
        pointerEvents: "auto",
      });

      tl.to(
        menuWrapperRef.current,
        {
          width: "80vw",
          borderRadius: "30px",
          borderColor: "rgba(255,255,255,0.1)",
          backgroundColor: "rgba(0,0,0,0.3)",
          duration: 0.5,
          ease: "menuEase",
        },
        0
      );

      tl.to(
        backgroundOverlayRef.current,
        {
          opacity: 1,
          duration: 0.8,
          ease: "menuEase",
          pointerEvents: "auto",
        },
        0
      );

      tl.to(
        bottomHeaderRef.current,
        {
          opacity: 0,
          duration: 0.3,
          ease: "menuEase",
          pointerEvents: "none",
        },
        0.1
      );

      tl.to(
        menuWrapperRef.current,
        {
          height: "85vh",
          borderRadius: "50px",
          borderColor: "rgba(255,255,255,0)",
          backgroundColor: "rgba(0,0,0,0)",
          backdropFilter: "blur(0px)",
          webkitBackdropFilter: "blur(0px)",
          duration: 0.5,
          ease: "menuEase",
        },
        0.35
      );

      tl.fromTo(
        menuContentRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          ease: "menuEase",
        },
        0.35
      );

      tl.to(
        seprationLineRef.current,
        {
          opacity: 1,
          duration: 0.5,
          ease: "menuEase",
        },
        0.5
      );

      menuTimeline.current = tl;
    });

    mm.add("(max-width: 640px)", () => {
      const tl = gsap.timeline({
        paused: true,

        onStart: () => {
          isMenuAnimatingRef.current = true;

          if (menuContentRef.current) {
            menuContentRef.current.style.pointerEvents = "auto";
          }
        },

        onComplete: () => {
          isMenuAnimatingRef.current = false;
        },

        onReverseComplete: () => {
          isMenuAnimatingRef.current = false;

          if (menuContentRef.current) {
            menuContentRef.current.style.pointerEvents = "none";
          }

          gsap.set(backgroundOverlayRef.current, {
            pointerEvents: "none",
          });
        },
      });

      gsap.set(backgroundOverlayRef.current, {
        opacity: 0,
        pointerEvents: "none",
      });

      gsap.set(menuWrapperRef.current, getClosedMenuState());

      gsap.set(menuContentRef.current, {
        opacity: 0,
        pointerEvents: "none",
      });

      tl.to(
        backgroundOverlayRef.current,
        {
          opacity: 1,
          duration: 0.5,
          pointerEvents: "auto",
          ease: "menuEase",
        },
        0
      );

      tl.to(
        bottomHeaderRef.current,
        {
          opacity: 0,
          duration: 0.25,
          pointerEvents: "none",
          ease: "menuEase",
        },
        0
      );

      tl.to(
        menuWrapperRef.current,
        {
          width: "88vw",
          height: "75vh",
          borderRadius: "7vw",
          borderColor: "rgba(255,255,255,0)",
          backgroundColor: "rgba(0,0,0,0)",
          backdropFilter: "blur(0px)",
          webkitBackdropFilter: "blur(0px)",
          duration: 0.55,
          ease: "menuEase",
        },
        0
      );

      tl.to(
        menuContentRef.current,
        {
          opacity: 1,
          duration: 0.5,
          ease: "menuEase",
        },
        0.2
      );

      menuTimeline.current = tl;
    });

    return () => mm.revert();
  }, []);

  useEffect(() => {
  const tl = menuTimeline.current;
  if (!tl) return;

  isMenuAnimatingRef.current = true;

  if (open) {
    tl.play();
  } else {
    tl.reverse();
  }

  clearTimeout(resetMenuTimerRef.current);

  resetMenuTimerRef.current = setTimeout(() => {
    isMenuAnimatingRef.current = false;
  }, 900);

  return () => clearTimeout(resetMenuTimerRef.current);
}, [open]);

  useEffect(() => {
    if (!open) return;

    gsap.fromTo(
      ".main-menu-tag",
      { yPercent: 105, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        stagger: {
          each:
            typeof window !== "undefined" && window.innerWidth > 1024
              ? 0.08
              : 0.035,
          from: "start",
        },
        delay: 0.5,
        duration: 0.8,
        ease: "power4.out",
        overwrite: true,
      }
    );

    gsap.fromTo(
      ".menu-socials",
      { yPercent: 50, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.8,
        ease: "power3.out",
        overwrite: true,
      }
    );

    gsap.fromTo(
      ".cross-button",
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.8,
        delay: 0.8,
        ease: "power3.out",
        overwrite: true,
      }
    );

    gsap.fromTo(
      ".menu-arrow",
      { yPercent: 50, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        delay: 1,
        duration: 0.5,
        ease: "power3.out",
        overwrite: true,
      }
    );
  }, [open]);

  const handleHeadingChange = (newHeading) => {
    const headingEl = dynamicHeadingRef.current;
    if (!headingEl) return;

    const headingToSet = newHeading || "We are Hyperiux";

    if (activeHeadingRef.current === headingToSet) return;

    activeHeadingRef.current = headingToSet;
    headingTweenRef.current?.kill();

    if (dynamicSplitRef.current) {
      dynamicSplitRef.current.revert();
      dynamicSplitRef.current = null;
    }

    headingEl.textContent = headingToSet;

    requestAnimationFrame(() => {
      if (!headingEl) return;

      dynamicSplitRef.current = new SplitText(headingEl, {
        type: "lines,words,chars",
        mask: "lines",
        charsClass: "dynamic-heading-char",
        wordsClass: "dynamic-heading-word",
        linesClass: "dynamic-heading-line",
      });

      const chars = dynamicSplitRef.current.chars;

      gsap.set(chars, {
        yPercent: 120,
        autoAlpha: 0,
        force3D: true,
        willChange: "transform",
      });

      headingTweenRef.current = gsap.to(chars, {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.75,
        stagger: 0.012,
        ease: "power3.out",
        overwrite: true,
      });
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      handleHeadingChange("We are Hyperiux");

      sectionHeadings.forEach(({ id, text }) => {
        const triggerEl = document.getElementById(id);
        if (!triggerEl) return;

        ScrollTrigger.create({
          trigger: triggerEl,
          start: "top 70%",
          end: "bottom 70%",
          onEnter: () => handleHeadingChange(text),
          onEnterBack: () => handleHeadingChange(text),
        });
      });

      ScrollTrigger.refresh();
    });

    return () => {
      headingTweenRef.current?.kill();

      if (dynamicSplitRef.current) {
        dynamicSplitRef.current.revert();
        dynamicSplitRef.current = null;
      }

      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const footer = document.getElementById("footer");
    if (!footer) return;

    const trigger = ScrollTrigger.create({
      trigger: footer,
      start: "top 80%",
      end: "bottom bottom",

      onEnter: () => {
        setBottomEnter(true);

        gsap.to("#bottom-menu", {
          opacity: 0,
          pointerEvents: "none",
          duration: 0.35,
          ease: "power2.out",
          overwrite: true,
        });
      },

      onLeaveBack: () => {
        setBottomEnter(false);

        gsap.to("#bottom-menu", {
          opacity: 1,
          pointerEvents: "auto",
          duration: 0.35,
          ease: "power2.out",
          overwrite: true,
        });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <header>
      <div
        ref={backgroundOverlayRef}
        className="fixed inset-0 z-[399] bg-black/30 opacity-0 pointer-events-none"
        onClick={closeMenu}
      />

      <div
        ref={menuWrapperRef}
        id="bottom-menu"
        className={`fixed bottom-[3%] left-[50%] z-[400] flex translate-x-[-50%] items-end overflow-hidden border text-white ${
          bottomEnter ? "pointer-events-none!" : ""
        }`}
      >
        <div
          ref={menuContentRef}
          className={`absolute top-0 flex h-[85vh] w-full opacity-0 pointer-events-none max-sm:h-[75vh] ${
            interactive ? "pointer-events-auto" : ""
          }`}
        >
          <div className="h-full w-[30%] bg-[#111111] max-sm:hidden">
            <MiniCanvas isMenuOpen={open} />
          </div>

          <div className="flex h-full w-full flex-col bg-[#ff5f00]">
            <div
              className={`menu-right-block relative z-1 h-full w-full px-[4vw] pb-[4vw] pt-[3vw] duration-500 max-sm:px-[7vw] max-sm:pt-[10vw] ${
                mobSubMenu
                  ? "max-sm:pointer-events-none! max-sm:opacity-0"
                  : "delay-500 max-sm:pointer-events-auto max-sm:opacity-100"
              }`}
            >
              <div className="flex h-[98%] w-full flex-col justify-between">
                <div
                  className="relative flex w-fit flex-col gap-[1.5vw] max-sm:gap-[7vw]"
                  onMouseLeave={() => setActiveMenuIndex(null)}
                >
                  <div
                    ref={mainSquareRef}
                    className="absolute left-[-1.2vw] top-0 z-10 h-[0.8vw] w-[0.8vw] scale-0 bg-white opacity-0 pointer-events-none max-sm:left-[-4vw] max-sm:h-[2.5vw] max-sm:w-[2.5vw]"
                  />

                  <div
                    ref={(el) => {
                      mainItemRefs.current[0] = el;
                    }}
                    className="flex w-fit items-center gap-[1.5vw] font-display"
                    onMouseEnter={() => setActiveMenuIndex(0)}
                  >
                    <MenuTextFace
                      text="About"
                      href="/about"
                      onClick={closeMenu}
                    />
                  </div>

                  <div
                    ref={(el) => {
                      mainItemRefs.current[1] = el;
                    }}
                    className="flex w-fit items-center gap-[1.5vw] font-display"
                    onMouseEnter={() => setActiveMenuIndex(1)}
                  >
                    <MenuTextFace
                      text="Work"
                      href="/work"
                      onClick={closeMenu}
                    />
                  </div>

                  <div
                    className="relative w-full"
                    ref={(el) => {
                      mainItemRefs.current[2] = el;
                    }}
                  >
                    <div
                      className="flex w-fit items-center gap-[1.5vw] font-display"
                      onMouseEnter={() => {
                        setActiveMenuIndex(2);

                        if (open) {
                          setSubMenu(true);
                          setSubEvents(true);
                        }
                      }}
                      onMouseLeave={() => setSubMenu(false)}
                    >
                      <div className="relative flex w-fit items-center gap-[1.5vw] max-sm:gap-[3vw]">
                        <div
                          className="group flex items-center gap-[1.2vw] max-sm:gap-[3vw]"
                          onClick={() => setMobSubMenu(true)}
                        >
                          <MenuTextFace
                            text="Expertise"
                            as="button"
                            className="flex items-center gap-[1vw]"
                          />

                          <div className="menu-arrow mt-[0.5vw] h-[2vw] w-[1.8vw] overflow-hidden max-sm:mt-[3.5vw] max-sm:h-[8vw] max-sm:w-[8vw]">
                            <div className="flex w-fit translate-x-[-112%] flex-nowrap gap-[0.5vw] group-hover:translate-x-0 group-hover:duration-500 group-hover:ease-in-out max-sm:h-[8vw] max-sm:w-[8vw] max-sm:translate-x-[-80%] max-sm:gap-[2vw]">
                              <Image
                                src="/assets/icons/arrow-right.svg"
                                alt="arrow-right"
                                className="mt-[0.1vw] h-[1.5vw] w-[1.5vw] rotate-45! brightness-[26]! object-contain max-sm:h-[5vw] max-sm:w-[5vw]"
                                width={40}
                                height={40}
                              />

                              <Image
                                src="/assets/icons/arrow-right.svg"
                                alt="arrow-right"
                                className="mt-[0.1vw] h-[1.5vw] w-[1.5vw] rotate-45! brightness-[26]! object-contain max-sm:h-[5vw] max-sm:w-[5vw]"
                                width={40}
                                height={40}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <SubMenu
                      subMenu={subMenu}
                      setSubMenu={setSubMenu}
                      subevents={subevents}
                      setsubEvents={setSubEvents}
                    />
                  </div>

                  <div
                    ref={(el) => {
                      mainItemRefs.current[3] = el;
                    }}
                    className="flex w-fit items-center gap-[1.5vw] font-display"
                    onMouseEnter={() => setActiveMenuIndex(3)}
                  >
                    <MenuTextFace
                      text="Career"
                      href="/careers"
                      onClick={closeMenu}
                    />
                  </div>

                  <div
                    ref={(el) => {
                      mainItemRefs.current[4] = el;
                    }}
                    className="flex w-fit items-center gap-[1.5vw] font-display"
                    onMouseEnter={() => setActiveMenuIndex(4)}
                  >
                    <MenuTextFace
                      text="Resources"
                      href="/"
                      onClick={closeMenu}
                    />
                  </div>

                  <div
                    ref={(el) => {
                      mainItemRefs.current[5] = el;
                    }}
                    className="flex w-fit items-center gap-[1.5vw] font-display"
                    onMouseEnter={() => setActiveMenuIndex(5)}
                  >
                    <MenuTextFace
                      text="Contact"
                      href="/contact-us"
                      onClick={closeMenu}
                    />
                  </div>
                </div>

                <div className="flex w-full justify-between pl-[3.2vw] max-sm:hidden">
                  <div className="menu-socials flex w-[21%] flex-col gap-[0.4vw] text-[1.1vw] font-medium">
                    <FooterUnderlineLink href="mailto:hi@hyperiux.com" menu>
                      hi@hyperiux.com
                    </FooterUnderlineLink>

                    <FooterUnderlineLink href="tel:+918745044555" menu>
                      +91 8745044555
                    </FooterUnderlineLink>
                  </div>

                  <div className="menu-socials flex gap-[1vw]">
                    <Facebook
                      href="#"
                      menuSocial={true}
                      className="hover:bg-white group-hover:text-[#ff5f00]"
                    />
                    <Twitter
                      href="#"
                      menuSocial={true}
                      className="hover:bg-white group-hover:text-[#ff5f00]"
                    />
                    <Linkedin
                      href="#"
                      menuSocial={true}
                      className="hover:bg-white group-hover:text-[#ff5f00]"
                    />
                    <Instagram
                      href="#"
                      menuSocial={true}
                      className="hover:bg-white group-hover:text-[#ff5f00]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <MobSubMenu
              mobSubMenu={mobSubMenu}
              setMobSubMenu={setMobSubMenu}
            />
          </div>

          <div
            className="cross-button group absolute right-[3%] top-[3%] z-90 mt-[0.1vw] flex h-[3.2vw] w-[3.2vw] rotate-45 cursor-pointer items-center justify-center rounded-full bg-white p-[0.9vw] max-sm:bottom-[1%] max-sm:right-[2%] max-sm:top-auto max-sm:hidden max-sm:h-[12vw] max-sm:w-[12vw] max-sm:p-[3vw]"
            onClick={closeMenu}
          >
            <Image
              src="/assets/icons/cross-menu.svg"
              alt="cross-menu"
              width={30}
              height={30}
              style={{
                transitionTimingFunction: "cubic-bezier(0.625, 0.05, 0, 1)",
              }}
              className="h-full w-full object-contain duration-700 group-hover:rotate-180"
            />
          </div>
        </div>

        <div
          ref={bottomHeaderRef}
          className="absolute bottom-0 z-90 flex h-[4vw] w-full items-center justify-between p-[0.4vw] pl-[1vw] pr-[0.5vw] max-sm:h-[15vw] max-sm:pl-[7vw] max-sm:pr-[2vw]"
        >
          <span
            ref={seprationLineRef}
            className="absolute left-1/2 top-[-0.5vw] h-0.5 w-full -translate-x-1/2 bg-[#1A1A1A] opacity-0"
            style={{ display: "block" }}
          />

          <div className="flex h-full w-[2.2vw] items-center gap-[1vw] max-sm:hidden">
            <Link href="/" onClick={closeMenu} className="mt-[0.2vw] h-auto w-full">
              <Image
                src="/hyperiux-icon-white.svg"
                alt="logo"
                className="h-full w-full object-contain"
                width={50}
                height={50}
              />
            </Link>
          </div>

          <div
            className="relative flex h-[3vw] w-[65%] items-center text-white font-display max-sm:w-[75%]"
            onClick={toggleMenu}
          >
            <div className="relative overflow-hidden">
              <p
                ref={dynamicHeadingRef}
                className="dynamic-heading text-[1vw] leading-none text-white max-sm:text-[3.5vw]"
              >
                We are Hyperiux
              </p>
            </div>
          </div>

          <div className="flex h-full items-center justify-end gap-[0.5vw] max-sm:w-full">
            <div
              onClick={toggleMenu}
              style={{
                transitionTimingFunction: "cubic-bezier(0.625, 0.05, 0, 1)",
              }}
              className="relative mt-[0.1vw] flex h-[2.7vw] w-[2.7vw] cursor-pointer flex-col items-center justify-center gap-[0.3vw] rounded-[0.7vw] bg-white duration-700 max-sm:h-[10vw] max-sm:w-[10vw] max-sm:gap-[1vw] max-sm:rounded-[3vw]"
            >
              <span
                className={`ham-burger-line hamburger-line-1 h-[1.5px] w-[1.2vw] rounded-full bg-black-1 max-sm:!w-[5vw] ${
                  open ? "opacity-0 duration-300" : "duration-300 delay-200"
                }`}
              />

              <span
                className={`ham-burger-line hamburger-line-2 h-[1.5px] w-[1.2vw] rounded-full bg-black-1 max-sm:!w-[5vw] ${
                  open ? "opacity-0 duration-300" : "duration-300 delay-200"
                }`}
              />

              <span
                className={`ham-burger-line hamburger-line-3 h-[1.5px] w-[1.2vw] rounded-full bg-black-1 max-sm:!w-[5vw] ${
                  open ? "opacity-0 duration-300" : "duration-300 delay-200"
                }`}
              />

              <div
                className={`absolute left-[27%] top-[48%] hidden h-full w-full max-sm:block ${
                  open
                    ? "opacity-100 delay-200 duration-300"
                    : "opacity-0 duration-300"
                }`}
              >
                <span className="absolute h-[1.5px] w-[5.5vw] -rotate-45 rounded-full bg-[#111111]" />
                <span className="absolute h-[1.5px] w-[5.5vw] rotate-45 rounded-full bg-[#111111]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}