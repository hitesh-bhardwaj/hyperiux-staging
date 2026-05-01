"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function LenisSync() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    if (!lenis) return;

    const refreshAll = () => {
      lenis.resize();
      lenis.start();
      ScrollTrigger.refresh(true);
    };

    requestAnimationFrame(refreshAll);
    setTimeout(refreshAll, 300);
    setTimeout(refreshAll, 800);

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
  }, [lenis, pathname]);

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