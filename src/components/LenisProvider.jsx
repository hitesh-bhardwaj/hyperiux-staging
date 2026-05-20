"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
// import ImageCursorFollower from "./Home/ImageCursorFollower";

gsap.registerPlugin(ScrollTrigger);

function blockNativeScroll() {
  if (typeof window === "undefined") return;

  if (window.__hyperiuxPreventScroll || window.__hyperiuxPreventKeys) return;

  const prevent = (e) => {
    if (!window.__hyperiuxLoaderComplete) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };

  const preventKeys = (e) => {
    if (window.__hyperiuxLoaderComplete) return;

    const blockedKeys = [
      " ",
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "PageUp",
      "PageDown",
      "Home",
      "End",
    ];

    if (blockedKeys.includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  window.__hyperiuxPreventScroll = prevent;
  window.__hyperiuxPreventKeys = preventKeys;

  window.addEventListener("wheel", prevent, {
    passive: false,
    capture: true,
  });

  window.addEventListener("touchmove", prevent, {
    passive: false,
    capture: true,
  });

  window.addEventListener("keydown", preventKeys, {
    passive: false,
    capture: true,
  });
}

function unblockNativeScroll() {
  if (typeof window === "undefined") return;

  if (window.__hyperiuxPreventScroll) {
    window.removeEventListener("wheel", window.__hyperiuxPreventScroll, {
      capture: true,
    });

    window.removeEventListener("touchmove", window.__hyperiuxPreventScroll, {
      capture: true,
    });
  }

  if (window.__hyperiuxPreventKeys) {
    window.removeEventListener("keydown", window.__hyperiuxPreventKeys, {
      capture: true,
    });
  }

  window.__hyperiuxPreventScroll = null;
  window.__hyperiuxPreventKeys = null;
}

function LenisSync() {
  const lenis = useLenis();
  const pathname = usePathname();
  const loaderCompleteRef = useRef(false);

  const isHomePage = pathname === "/";

  useEffect(() => {
    if (!lenis) return;

    const refreshAfterStart = () => {
      requestAnimationFrame(() => {
        lenis.resize();
        lenis.start();

        requestAnimationFrame(() => {
          ScrollTrigger.refresh(true);
        });

        setTimeout(() => {
          lenis.resize();
          ScrollTrigger.refresh(true);
        }, 300);

        setTimeout(() => {
          lenis.resize();
          ScrollTrigger.refresh(true);
        }, 900);
      });
    };

    const stopForLoader = () => {
      if (!isHomePage) return;

      loaderCompleteRef.current = false;

      lenis.stop();
      blockNativeScroll();

      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    };

    const startAfterLoader = () => {
      loaderCompleteRef.current = true;

      unblockNativeScroll();
      refreshAfterStart();
    };

    /*
      Non-home pages do not have loader.
      So never wait for window.__hyperiuxLoaderComplete there.
    */
    if (!isHomePage) {
      loaderCompleteRef.current = true;
      window.__hyperiuxLoaderComplete = true;

      unblockNativeScroll();
      refreshAfterStart();

      return;
    }

    /*
      Homepage only:
      stop Lenis until Loader dispatches hyperiux-loader-complete.
    */
    if (window.__hyperiuxLoaderComplete) {
      startAfterLoader();
    } else {
      stopForLoader();
    }

    window.addEventListener("hyperiux-loader-lock-scroll", stopForLoader);
    window.addEventListener("hyperiux-loader-complete", startAfterLoader);

    return () => {
      window.removeEventListener("hyperiux-loader-lock-scroll", stopForLoader);
      window.removeEventListener("hyperiux-loader-complete", startAfterLoader);

      unblockNativeScroll();
    };
  }, [lenis, isHomePage, pathname]);

  useEffect(() => {
    if (!lenis) return;

    const refreshAll = () => {
      lenis.resize();

      if (!isHomePage) {
        lenis.start();
        ScrollTrigger.refresh(true);
        return;
      }

      if (window.__hyperiuxLoaderComplete || loaderCompleteRef.current) {
        lenis.start();
        ScrollTrigger.refresh(true);
      } else {
        lenis.stop();
      }
    };

    /*
      Non-home pages should refresh normally.
      Homepage refreshes only after loader is complete.
    */
    if (!isHomePage || window.__hyperiuxLoaderComplete) {
      requestAnimationFrame(refreshAll);
      setTimeout(refreshAll, 300);
      setTimeout(refreshAll, 900);
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        requestAnimationFrame(refreshAll);
      }
    };

    const onPageShow = () => {
      requestAnimationFrame(refreshAll);
    };

    const onFocus = () => {
      requestAnimationFrame(refreshAll);
    };

    window.addEventListener("focus", onFocus);
    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [lenis, pathname, isHomePage]);

  return null;
}

export default function LenisProvider({ children }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.4,
        syncTouch: false,
        infinite: false,
        autoResize: true,
      }}
    >
      <LenisSync />

      {children}
    </ReactLenis>
  );
}