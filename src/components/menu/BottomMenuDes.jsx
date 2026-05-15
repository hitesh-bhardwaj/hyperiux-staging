"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import SubMenu from "./SubMenu";
import {
  Facebook,
  FooterUnderlineLink,
  Instagram,
  Linkedin,
  Twitter,
} from "../Buttons";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase } from "gsap/CustomEase";
import MobSubMenu from "./MobSubMenu";
import { usePathname } from "next/navigation";
import MiniCanvas from "./MiniCanvas";
import VideoPlayer from "../VideoPlayer";

gsap.registerPlugin(useGSAP, CustomEase);

function MenuTextFace({
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
    >
      {TextContent}
    </Link>
  );
}

// Animated square indicator — mirrors OsmoMenuDesktop's mainSquareRef logic
function AnimatedSquare({ squareRef }) {
  return (
    <div
      ref={squareRef}
      className="absolute top-0 left-[-1.2vw] w-[0.8vw] h-[0.8vw] bg-white scale-0 opacity-0 pointer-events-none z-10 max-sm:left-[-4vw] max-sm:w-[2.5vw] max-sm:h-[2.5vw]"
      style={{ position: "absolute" }}
    />
  );
}

function MenuRow({
  index,
  text,
  href = "#",
  onClick,
  children,
  className = "",
  itemRef,
}) {
  return (
    <div
      ref={itemRef}
      className={`flex w-fit items-center gap-[1.5vw] font-display ${className}`}
    >
      <div className="flex w-fit items-center gap-[1.5vw] max-sm:gap-[3vw]">
        {children || <MenuTextFace text={text} href={href} onClick={onClick} />}
      </div>
    </div>
  );
}

const BottomMenuDes = () => {
  const [open, setopen] = useState(false);
  const [bottomEnter, setBottomEnter] = useState(false);
  const [subevents, setsubEvents] = useState(false);
  const [subMenu, setSubMenu] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [mobSubMenu, setMobSubMenu] = useState(false);
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Square animation state
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const mainSquareRef = useRef(null);
  const mainItemRefs = useRef([]);
  const menuEasing = "cubic-bezier(0.625, 0.05, 0, 1)";

  // Refs for OsmoMenuDesktop-style timeline animation
  const backgroundOverlayRef = useRef(null);
  const menuWrapperRef = useRef(null);
  const menuContentRef = useRef(null);
  const seprationLineRef = useRef(null);
  const menuTimeline = useRef(null);
  const bottomHeaderRef = useRef(null);

  useEffect(() => {
    setBottomEnter(false);
    setopen(false);
    setMobSubMenu(false);
    setSubMenu(false);
    setsubEvents(false);
  }, [pathname]);

  useEffect(() => {
    let timer;

    if (open) {
      timer = setTimeout(() => setInteractive(true), 500);
    } else {
      setInteractive(false);
    }

    return () => clearTimeout(timer);
  }, [open]);

  // Square animation effect — mirrors OsmoMenuDesktop's useEffect for mainSquareRef
  // When subMenu is open, lock the square on Expertise (index 2)
  const resolvedMenuIndex = subMenu ? 2 : activeMenuIndex;

  useEffect(() => {
    const square = mainSquareRef.current;
    const items = mainItemRefs.current.filter(Boolean);
    if (!square || !items.length) return;

    // Remove square animation in mobile only
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      gsap.set(square, { scale: 0, opacity: 0 });
      gsap.set(items, { x: 0 });
      return;
    }

    if (resolvedMenuIndex === null) {
      gsap.to(square, { scale: 0, opacity: 0, duration: 0.3, overwrite: "auto", ease: menuEasing });
      gsap.to(items, { x: 0, duration: 0.4, ease: menuEasing, overwrite: "auto" });
      return;
    }

    gsap.to(square, { scale: 1, opacity: 1, duration: 0.3, overwrite: "auto", ease: menuEasing });

    const targetItem = items[resolvedMenuIndex];
    if (!targetItem) return;

    const targetY = targetItem.offsetTop + (targetItem.offsetHeight / 2) - (square.offsetHeight / 2);

    gsap.to(square, {
      y: targetY,
      rotation: resolvedMenuIndex * 90,
      duration: 0.4,
      ease: menuEasing,
      overwrite: "auto",
    });

    const totalTranslateImpact = 2;
    const translateValue = typeof window !== "undefined" ? window.innerWidth * 0.015 : 20;

    items.forEach((item, index) => {
      const distance = Math.min(Math.abs(index - resolvedMenuIndex) / totalTranslateImpact, 1);
      gsap.to(item, {
        x: translateValue * (1 - distance),
        duration: 0.4,
        ease: menuEasing,
        overwrite: "auto",
      });
    });
  }, [resolvedMenuIndex]);

  // OsmoMenuDesktop-style timeline: created once, played/reversed on toggle
  useEffect(() => {
    let mm = gsap.matchMedia();
    CustomEase.create("menuEase", "0.625,0.05,0,1");

    mm.add("(min-width: 542px)", () => {
      const tl = gsap.timeline({ paused: true });
      const wrapper = menuWrapperRef.current;
      const content = menuContentRef.current;
      const overlay = backgroundOverlayRef.current;
      const sepLine = seprationLineRef.current;

      // Initial states — closed menu
      gsap.set(overlay, { opacity: 0, pointerEvents: "none" });
      gsap.set(wrapper, {
        width: "37vw",
        height: "4vw",
        borderRadius: "18px",
        borderColor: "rgba(255,255,255,0.3)",
        backgroundColor: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      });
      gsap.set(content, { pointerEvents: "none" });
      gsap.set(sepLine, { opacity: 0 });

      // --- STEP 1: Width expansion first ---
      tl.to(
        wrapper,
        {
          width: "80vw",
          borderRadius: "30px",
          borderColor: "rgba(255,255,255,0.1)",
          backgroundColor: "rgba(0,0,0,0.3)",
          duration: 0.6,
          ease: "menuEase",
        },
        0,
      );

      // Background overlay starts fading in alongside width
      tl.to(
        overlay,
        {
          opacity: 1,
          duration: 0.8,
          ease: "menuEase",
          pointerEvents: "auto",
        },
        0,
      );

      // Fade out the bottom header bar as width expands
      tl.to(
        bottomHeaderRef.current,
        {
          opacity: 0,
          duration: 0.3,
          ease: "menuEase",
          pointerEvents: "none",
        },
        0.1,
      );

      // --- STEP 2: Height expansion upward (starts after width begins) ---
      tl.to(
        wrapper,
        {
          height: "85vh",
          borderRadius: "50px",
          borderColor: "rgba(255,255,255,0)",
          backgroundColor: "rgba(0,0,0,0)",
          backdropFilter: "blur(0px)",
          WebkitBackdropFilter: "blur(0px)",
          duration: 0.8,
          ease: "menuEase",
        },
        0.35,
      );

      // Content panel fades in as the wrapper expands upward
      tl.fromTo(
        content,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.6,
          ease: "menuEase",
        },
        0.35,
      );

      // Separation line appears as height expands
      tl.to(
        sepLine,
        {
          opacity: 1,
          duration: 0.5,
          ease: "menuEase",
        },
        0.5,
      );

      tl.eventCallback("onStart", () => {
        if (content) content.style.pointerEvents = "auto";
      });
      tl.eventCallback("onReverseComplete", () => {
        if (content) content.style.pointerEvents = "none";
        gsap.set(overlay, { pointerEvents: "none" });
        if (bottomHeaderRef.current) bottomHeaderRef.current.style.pointerEvents = "auto";
      });

      menuTimeline.current = tl;
    });

    mm.add("(max-width: 640px)", () => {
      // For mobile, we rely on original CSS transitions for the wrapper, 
      // but we still need a simple timeline to manage overlay and content opacity.
      const tl = gsap.timeline({ paused: true });
      const content = menuContentRef.current;
      const overlay = backgroundOverlayRef.current;

      tl.to(overlay, { opacity: 1, duration: 0.5, pointerEvents: "auto" }, 0);
      tl.to(content, { opacity: 1, duration: 0.5 }, 0.2);

      tl.eventCallback("onStart", () => {
        if (content) content.style.pointerEvents = "auto";
      });
      tl.eventCallback("onReverseComplete", () => {
        if (content) content.style.pointerEvents = "none";
        gsap.set(overlay, { pointerEvents: "none" });
      });

      menuTimeline.current = tl;
    });

    return () => mm.revert();
  }, []);

  // Play/reverse the timeline when open state changes
  useEffect(() => {
    if (!menuTimeline.current) return;
    if (open) {
      menuTimeline.current.play();
    } else {
      menuTimeline.current.reverse();
    }
  }, [open]);

  // Original text reveal animations for menu items
  useGSAP(() => {
    if (open) {
      gsap.fromTo(
        ".main-menu-tag",
        {
          yPercent: 105,
          opacity: 0,
        },
        {
          yPercent: 0,
          opacity: 1,
          stagger: {
            each: globalThis.innerWidth > 1024 ? 0.08 : 0.035,
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
        {
          yPercent: 50,
          opacity: 0,
        },
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
        {
          opacity: 0,
        },
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
        {
          yPercent: 50,
          opacity: 0,
        },
        {
          yPercent: 0,
          opacity: 1,
          delay: 1,
          duration: 0.5,
          ease: "power3.out",
          overwrite: true,
        }
      );
    }
  }, [open]);

  useGSAP(() => {
    gsap.to("#bottom-menu", {
      scrollTrigger: {
        trigger: "#footer-bottom",
        start: "top 80%",
        end: "top 80%",
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
        onEnterBack: () => {
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
      },
    });
  }, []);

  const handleOpen = () => {
    setIsModalOpen(true);
  };
  const handleClose = () => {
    setIsModalOpen(false);
  };

  // Nav items config: index 2 is "Expertise" (has submenu)
  const navItems = [
    { text: "About", href: "/about" },
    { text: "Work", href: "/work" },
    null, // Expertise — rendered separately
    { text: "Career", href: "/careers" },
    { text: "Resources", href: "/" },
    { text: "Contact", href: "/contact-us" },
  ];

  return (
    <header>
      <div
        ref={menuWrapperRef}
        className={`fixed bottom-[3%] left-[50%] z-400 flex translate-x-[-50%] items-end overflow-hidden border text-white transition-all duration-500 ease-out ${
          open
            ? "h-[85vh] w-[80vw] rounded-[50px] border-transparent max-sm:h-[75vh] max-sm:w-[88vw] max-sm:rounded-[7vw]"
            : "h-[4vw] w-[37vw] rounded-[18px] border-white/30 bg-black/50 backdrop-blur-sm max-sm:h-[15vw] max-sm:w-[88vw]"
        } ${bottomEnter ? "pointer-events-none!" : ""}`}
        id="bottom-menu"
      >
        <div
          ref={menuContentRef}
          className={`absolute top-0 flex h-[85vh] w-full max-sm:h-[75vh] opacity-0 pointer-events-none ${
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
                {/* NAV LIST with square animation */}
                <div
                  className="relative flex w-fit flex-col gap-[1.5vw] max-sm:gap-[7vw]"
                  onMouseLeave={() => setActiveMenuIndex(null)}
                >
                  {/* The animated square */}
                  <AnimatedSquare squareRef={mainSquareRef} />

                  {/* 0: About */}
                  <MenuRow
                    index={0}
                    text="About"
                    href="/about"
                    itemRef={(el) => { mainItemRefs.current[0] = el; }}
                    onMouseEnter={() => setActiveMenuIndex(0)}
                  >
                    <div
                      onMouseEnter={() => setActiveMenuIndex(0)}
                    >
                      <MenuTextFace text="About" href="/about" />
                    </div>
                  </MenuRow>

                  {/* 1: Work */}
                  <MenuRow
                    index={1}
                    text="Work"
                    href="/work"
                    itemRef={(el) => { mainItemRefs.current[1] = el; }}
                  >
                    <div onMouseEnter={() => setActiveMenuIndex(1)}>
                      <MenuTextFace text="Work" href="/work" />
                    </div>
                  </MenuRow>

                  {/* 2: Expertise (with submenu) */}
                  <div
                    className="relative w-full"
                    ref={(el) => { mainItemRefs.current[2] = el; }}
                  >
                    <div
                      className="flex w-fit items-center gap-[1.5vw] font-display"
                      onMouseEnter={() => {
                        setActiveMenuIndex(2);
                        if (open) {
                          setSubMenu(true);
                          setsubEvents(true);
                        }
                      }}
                      onMouseLeave={() => {
                        setSubMenu(false);
                      }}
                    >
                      <div className="relative flex w-fit items-center gap-[1.5vw] max-sm:gap-[3vw]">
                        <div
                          className="group flex items-center gap-[1.2vw] max-sm:gap-[3vw]"
                          onClick={() => {
                            setMobSubMenu(true);
                          }}
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
                      setsubEvents={setsubEvents}
                    />
                  </div>

                  {/* 3: Career */}
                  <div
                    ref={(el) => { mainItemRefs.current[3] = el; }}
                    className="flex w-fit items-center gap-[1.5vw] font-display"
                    onMouseEnter={() => setActiveMenuIndex(3)}
                  >
                    <MenuTextFace text="Career" href="/careers" />
                  </div>

                  {/* 4: Resources */}
                  <div
                    ref={(el) => { mainItemRefs.current[4] = el; }}
                    className="flex w-fit items-center gap-[1.5vw] font-display"
                    onMouseEnter={() => setActiveMenuIndex(4)}
                  >
                    <MenuTextFace text="Resources" href="/" />
                  </div>

                  {/* 5: Contact */}
                  <div
                    ref={(el) => { mainItemRefs.current[5] = el; }}
                    className="flex w-fit items-center gap-[1.5vw] font-display"
                    onMouseEnter={() => setActiveMenuIndex(5)}
                  >
                    <MenuTextFace text="Contact" href="/contact-us" />
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
            onClick={() => {
              setopen(false);
            }}
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
          className="absolute bottom-0 z-90 flex h-[4vw] w-full items-center justify-between p-[0.4vw] pl-[1vw] pr-[0.5vw] max-sm:h-[15vw] max-sm:pl-[7vw] max-sm:pr-[2vw] relative"
        >
          <span
            ref={seprationLineRef}
            className="w-full h-0.5 absolute top-[-.5vw] left-1/2 -translate-x-1/2 bg-[#1A1A1A] opacity-0"
            style={{ display: "block" }}
          />
          <div
            className="flex h-full items-center gap-[1vw] w-[25%] max-sm:hidden"
          >
            <Link
              href="/"
              className="mt-[0.2vw] h-auto w-full"
              onClick={(e) => {
                e.preventDefault();
                setopen(false);
              }}
            >
              <Image
                src="/assets/icons/hyperiux-wordmark.svg"
                alt="logo"
                className="h-full w-full object-cover brightness-[20]"
                width={50}
                height={50}
              />
            </Link>
          </div>

          <div
            className="flex h-full items-center justify-end gap-[0.5vw] w-[90%] max-sm:w-full"
          >
            {/* <div
              className="mt-[0.1vw] h-[2.7vw] w-[7vw] overflow-hidden rounded-[0.7vw] max-sm:hidden"
              onClick={handleOpen}
            >
              <video
                src="/assets/videos/header-showreel-2.mp4"
                playsInline
                loop
                autoPlay
                muted
                className="h-full w-full object-cover"
              />
            </div> */}

            <div
              onClick={(e) => {
                setMobSubMenu(false);

                const target = e.currentTarget;
                setopen((prev) => !prev);

                target.style.pointerEvents = "none";

                setTimeout(() => {
                  if (target) {
                    target.style.pointerEvents = "auto";
                  }
                }, 700);
              }}
              style={{
                transitionTimingFunction: "cubic-bezier(0.625, 0.05, 0, 1)",
              }}
              className="relative mt-[0.1vw] flex h-[2.7vw] w-[2.7vw] cursor-pointer flex-col items-center justify-center gap-[0.3vw] rounded-[0.7vw] bg-white duration-700 max-sm:h-[10vw] max-sm:w-[10vw] max-sm:gap-[1vw] max-sm:rounded-[3vw]"
            >
              <span
                className={`ham-burger-line hamburger-line-1 h-[1.5px] w-[1.2vw] rounded-full bg-[#111111] max-sm:w-[5vw]! ${
                  open ? "opacity-0 duration-300" : "delay-200 duration-300"
                }`}
              />
              <span
                className={`ham-burger-line hamburger-line-2 h-[1.5px] w-[1.2vw] rounded-full bg-[#111111] max-sm:w-[5vw]! ${
                  open ? "opacity-0 duration-300" : "delay-200 duration-300"
                }`}
              />
              <span
                className={`ham-burger-line hamburger-line-3 h-[1.5px] w-[1.2vw] rounded-full bg-[#111111] max-sm:w-[5vw]! ${
                  open ? "opacity-0 duration-300" : "delay-200 duration-300"
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

      <div
        ref={backgroundOverlayRef}
        className={`menu-overlay fixed inset-0 z-399 h-screen w-screen bg-black/50 opacity-0 backdrop-blur-md pointer-events-none ${bottomEnter ? "pointer-events-none" : ""}`}
        onClick={() => {
          setopen(false);
        }}
      />

      <div className="fixed left-[5%] top-[3%] z-500 hidden h-[10vw] w-[10vw]">
        <Image
          src="/assets/icons/enigma-logo.svg"
          alt=""
          className="enigma-logo h-full w-full object-contain"
          width={70}
          height={70}
        />
      </div>

      {isModalOpen && (
        <VideoPlayer
          poster="/assets/images/homepage/showreel-poster.webp"
          isOpen={isModalOpen}
          onClose={handleClose}
          videoSrc="/assets/videos/showreel.mp4"
        />
      )}
    </header>
  );
};

export default BottomMenuDes;