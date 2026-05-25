"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { usePathname } from "next/navigation";

import BottomMenuOverlay from "./BottomMenuOverlay";
import BottomMenuContent from "./BottomMenuContent";
import BottomMenuBar from "./BottomMenuBar";

import { sectionHeadings } from "./menuUtils";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function BottomMenuDes() {
  const [open, setOpen] = useState(false);
  const [bottomEnter, setBottomEnter] = useState(false);
  const [subevents, setSubEvents] = useState(false);
  const [subMenu, setSubMenu] = useState(false);
  const [mobSubMenu, setMobSubMenu] = useState(false);
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);

  const pathname = usePathname();

  const headerRef = useRef(null);
  const menuWrapperRef = useRef(null);
  const menuContentRef = useRef(null);
  const bottomHeaderRef = useRef(null);
  const backgroundOverlayRef = useRef(null);

  const menuTlRef = useRef(null);
  const revealTlRef = useRef(null);
  const revealDelayRef = useRef(null);

  const dynamicHeadingRef = useRef(null);
  const dynamicSplitRef = useRef(null);
  const activeHeadingRef = useRef("");
  const headingTweenRef = useRef(null);

  const resolvedMenuIndex =
    activeMenuIndex !== null && activeMenuIndex !== undefined
      ? activeMenuIndex
      : subMenu
        ? 2
        : null;

  const closeMenu = () => {
    setOpen(false);
    setMobSubMenu(false);
    setSubMenu(false);
    setSubEvents(false);
    setActiveMenuIndex(null);
  };

  const toggleMenu = () => {
    setMobSubMenu(false);
    setSubMenu(false);
    setSubEvents(false);
    setActiveMenuIndex(null);
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  const resetRevealItemsToHidden = () => {
    const content = menuContentRef.current;
    if (!content) return;

    gsap.set(content.querySelectorAll(".main-menu-tag"), {
      yPercent: 105,
      opacity: 0,
    });

    gsap.set(content.querySelectorAll(".menu-socials"), {
      yPercent: 50,
      opacity: 0,
    });

    gsap.set(content.querySelectorAll(".cross-button"), {
      opacity: 0,
    });

    gsap.set(content.querySelectorAll(".menu-arrow"), {
      yPercent: 50,
      opacity: 0,
    });
  };

  const setRevealItemsVisible = () => {
    const content = menuContentRef.current;
    if (!content) return;

    gsap.set(content.querySelectorAll(".main-menu-tag"), {
      yPercent: 0,
      opacity: 1,
    });

    gsap.set(content.querySelectorAll(".menu-socials"), {
      yPercent: 0,
      opacity: 1,
    });

    gsap.set(content.querySelectorAll(".cross-button"), {
      opacity: 1,
    });

    gsap.set(content.querySelectorAll(".menu-arrow"), {
      yPercent: 0,
      opacity: 1,
    });
  };

  const runMenuContentReveal = () => {
    const content = menuContentRef.current;
    if (!content) return;

    revealTlRef.current?.kill();

    const mainMenuTags = content.querySelectorAll(".main-menu-tag");
    const socials = content.querySelectorAll(".menu-socials");
    const crossButton = content.querySelectorAll(".cross-button");
    const menuArrow = content.querySelectorAll(".menu-arrow");

    gsap.set(mainMenuTags, {
      yPercent: 105,
      opacity: 0,
    });

    gsap.set(socials, {
      yPercent: 50,
      opacity: 0,
    });

    gsap.set(crossButton, {
      opacity: 0,
    });

    gsap.set(menuArrow, {
      yPercent: 50,
      opacity: 0,
    });

    revealTlRef.current = gsap.timeline();

    revealTlRef.current
      .to(mainMenuTags, {
        yPercent: 0,
        opacity: 1,
        stagger: {
          each:
            typeof window !== "undefined" && window.innerWidth > 1024
              ? 0.08
              : 0.035,
          from: "start",
        },
        duration: 0.8,
        ease: "power4.out",
      })

      .to(
        socials,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        0.35
      )

      .to(
        crossButton,
        {
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        0.35
      )

      .to(
        menuArrow,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
        },
        0.5
      );
  };

  useEffect(() => {
    const wrapper = menuWrapperRef.current;
    const content = menuContentRef.current;
    const bottomHeader = bottomHeaderRef.current;
    const overlay = backgroundOverlayRef.current;

    if (!wrapper || !content || !bottomHeader || !overlay) return;

    const getMenuSizes = () => {
      const isMobile = window.innerWidth <= 640;

      return {
        closedWidth: isMobile ? "88vw" : "36vw",
        closedHeight: isMobile ? "15vw" : "4vw",
        closedRadius: isMobile ? "4vw" : "1vw",

        openWidth: isMobile ? "88vw" : "80vw",
        openHeight: isMobile ? "75vh" : "85vh",
        openRadius: isMobile ? "7vw" : "2vw",
      };
    };

    const setupTimeline = () => {
      const sizes = getMenuSizes();

      menuTlRef.current?.kill();

      gsap.set(wrapper, {
        width: sizes.closedWidth,
        height: sizes.closedHeight,
        borderRadius: sizes.closedRadius,
        borderColor: "rgba(255,255,255,0.1)",
        backgroundColor: "rgba(0,0,0,0.3)",
        backdropFilter: "blur(10px)",
        webkitBackdropFilter: "blur(10px)",
      });

      gsap.set(content, {
        opacity: 0,
        pointerEvents: "none",
      });

      gsap.set(bottomHeader, {
        opacity: 1,
        pointerEvents: "auto",
      });

      gsap.set(overlay, {
        opacity: 0,
        pointerEvents: "none",
      });

      resetRevealItemsToHidden();

      const tl = gsap.timeline({
        paused: true,
        defaults: {
          ease: "power4.inOut",
        },
      });

      tl.to(
        overlay,
        {
          opacity: 1,
          duration: 0.45,
          pointerEvents: "auto",
        },
        0
      );

      tl.to(
        bottomHeader,
        {
          opacity: 0,
          duration: 0.25,
          pointerEvents: "none",
        },
        0
      );

      tl.to(
        wrapper,
        {
          width: sizes.openWidth,
          borderRadius: sizes.openRadius,
          duration: 0.7,
        },
        0
      );

      tl.to(
        wrapper,
        {
          height: sizes.openHeight,
          borderRadius: sizes.openRadius,
          borderColor: "rgba(255,255,255,0)",
          backgroundColor: "rgba(0,0,0,0)",
          backdropFilter: "blur(0px)",
          webkitBackdropFilter: "blur(0px)",
          duration: 0.7,
        },
        0.25
      );

      tl.set(
        content,
        {
          pointerEvents: "auto",
        },
        0.55
      );

      tl.to(
        content,
        {
          opacity: 1,
          duration: 0.25,
          ease: "power2.out",
        },
        0.55
      );

      menuTlRef.current = tl;

      if (open) {
        tl.progress(1);
        setRevealItemsVisible();
      }
    };

    setupTimeline();

    const handleResize = () => {
      setupTimeline();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      menuTlRef.current?.kill();
      revealTlRef.current?.kill();
      revealDelayRef.current?.kill();
    };
  }, []);

  useEffect(() => {
    const tl = menuTlRef.current;
    const content = menuContentRef.current;

    if (!tl || !content) return;

    revealDelayRef.current?.kill();
    revealTlRef.current?.kill();

    if (open) {
      tl.play();

      revealDelayRef.current = gsap.delayedCall(0.4, () => {
        runMenuContentReveal();
      });
    } else {
      setRevealItemsVisible();
      tl.reverse();
    }
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
    const header = headerRef.current;

    if (!footer || !header) return;

    const trigger = ScrollTrigger.create({
      trigger: footer,
      start: "top 80%",
      end: "bottom bottom",

      onEnter: () => {
        setBottomEnter(true);

        gsap.to(header, {
          yPercent: 120,
          opacity: 0,
          pointerEvents: "none",
          duration: 0.55,
          ease: "power3.out",
          overwrite: true,
        });
      },

      onLeaveBack: () => {
        setBottomEnter(false);

        gsap.to(header, {
          yPercent: 0,
          opacity: 1,
          pointerEvents: "auto",
          duration: 0.55,
          ease: "power3.out",
          overwrite: true,
        });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <header
      ref={headerRef}
      className="header fixed inset-x-0 bottom-[3%] z-[400] pointer-events-none"
    >
      <BottomMenuOverlay ref={backgroundOverlayRef} onClick={closeMenu} />

      <div
        ref={menuWrapperRef}
        id="bottom-menu"
        className="pointer-events-auto fixed bottom-[3%] left-1/2 z-[400] flex -translate-x-1/2 items-end overflow-hidden border text-white"
      >
        <BottomMenuContent
          ref={menuContentRef}
          open={open}
          mobSubMenu={mobSubMenu}
          setMobSubMenu={setMobSubMenu}
          subMenu={subMenu}
          setSubMenu={setSubMenu}
          subevents={subevents}
          setSubEvents={setSubEvents}
          activeMenuIndex={activeMenuIndex}
          setActiveMenuIndex={setActiveMenuIndex}
          resolvedMenuIndex={resolvedMenuIndex}
          closeMenu={closeMenu}
        />

        <BottomMenuBar
          ref={bottomHeaderRef}
          open={open}
          closeMenu={closeMenu}
          toggleMenu={toggleMenu}
          dynamicHeadingRef={dynamicHeadingRef}
        />
      </div>
    </header>
  );
}