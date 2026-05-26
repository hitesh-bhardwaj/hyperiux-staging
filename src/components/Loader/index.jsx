"use client";

import gsap from "gsap";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";
import { useLenis } from "lenis/react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(CustomEase, SplitText, ScrollTrigger);

const AUTO_CONTENT = [
  "Good things worth the wait!!",
  "Loading assets and magic behind...",
];

function CutoutOverlayLayer({
  className = "",
  clipPath = "inset(0% 0% 0% 0%)",
}) {
  return (
    <div
      className={`clip-logo absolute inset-0 overflow-hidden bg-white ${className}`}
      style={{
        clipPath,
        "--logo-size": "20vw",
        WebkitMaskImage: `linear-gradient(#fff 0 0), url("/hyperiux-icon-black.svg")`,
        maskImage: `linear-gradient(#fff 0 0), url("/hyperiux-icon-black.svg")`,
        WebkitMaskRepeat: "no-repeat, no-repeat",
        maskRepeat: "no-repeat, no-repeat",
        WebkitMaskPosition: "0 0, center center",
        maskPosition: "0 0, center center",
        WebkitMaskSize: "100% 100%, auto var(--logo-size)",
        maskSize: "100% 100%, auto var(--logo-size)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        willChange: "mask-size, -webkit-mask-size",
      }}
    />
  );
}

function AutoChangingSplitText({
  items = AUTO_CONTENT,
  interval = 2,
  duration = 0.75,
  stagger = 0.035,
  className = "",
  textClassName = "",
}) {
  const rootRef = useRef(null);
  const layerOneRef = useRef(null);
  const layerTwoRef = useRef(null);

  const activeLayerRef = useRef(0);
  const activeIndexRef = useRef(0);

  const splitRefs = useRef([null, null]);
  const delayedCallRef = useRef(null);
  const timelineRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const killedRef = useRef(false);

  useLayoutEffect(() => {
    if (!items?.length) return;

    const root = rootRef.current;
    const layerOne = layerOneRef.current;
    const layerTwo = layerTwoRef.current;

    if (!root || !layerOne || !layerTwo) return;

    killedRef.current = false;

    const layers = [layerOne, layerTwo];

    const clearSplit = (layerIndex) => {
      if (splitRefs.current[layerIndex]) {
        splitRefs.current[layerIndex].revert();
        splitRefs.current[layerIndex] = null;
      }
    };

    const createSplit = (layer, text, startYPercent = 100) => {
      layer.textContent = text;

      const split = new SplitText(layer, {
        type: "lines",
        mask: "lines",
        linesClass: "auto-changing-line",
      });

      gsap.set(split.lines, {
        yPercent: startYPercent,
        autoAlpha: 1,
        force3D: true,
        willChange: "transform",
      });

      return split;
    };

    const animateToNext = () => {
      if (killedRef.current || isAnimatingRef.current || items.length <= 1) {
        return;
      }

      isAnimatingRef.current = true;

      const currentLayerIndex = activeLayerRef.current;
      const nextLayerIndex = currentLayerIndex === 0 ? 1 : 0;

      const currentIndex = activeIndexRef.current;
      const nextIndex = (currentIndex + 1) % items.length;

      const currentLayer = layers[currentLayerIndex];
      const nextLayer = layers[nextLayerIndex];

      const currentSplit = splitRefs.current[currentLayerIndex];

      clearSplit(nextLayerIndex);

      gsap.set(currentLayer, {
        autoAlpha: 1,
        zIndex: 1,
      });

      gsap.set(nextLayer, {
        autoAlpha: 1,
        zIndex: 2,
      });

      const nextSplit = createSplit(nextLayer, items[nextIndex], 100);
      splitRefs.current[nextLayerIndex] = nextSplit;

      timelineRef.current?.kill();

      timelineRef.current = gsap.timeline({
        defaults: {
          ease: "power2.inOut",
        },
        onComplete: () => {
          gsap.set(currentLayer, {
            autoAlpha: 0,
            zIndex: 0,
          });

          clearSplit(currentLayerIndex);

          activeLayerRef.current = nextLayerIndex;
          activeIndexRef.current = nextIndex;

          isAnimatingRef.current = false;

          delayedCallRef.current?.kill();
          delayedCallRef.current = gsap.delayedCall(interval, animateToNext);
        },
      });

      timelineRef.current.to(
        currentSplit?.lines || [],
        {
          yPercent: -100,
          duration,
          stagger,
        },
        0
      );

      timelineRef.current.to(
        nextSplit.lines,
        {
          yPercent: 0,
          duration,
          stagger,
        },
        0
      );
    };

    const init = () => {
      if (killedRef.current) return;

      gsap.set(root, {
        overflow: "hidden",
      });

      gsap.set(layers, {
        position: "absolute",
        inset: 0,
        autoAlpha: 0,
        margin: 0,
      });

      splitRefs.current[0] = createSplit(layerOne, items[0], 0);

      gsap.set(layerOne, {
        autoAlpha: 1,
        zIndex: 2,
      });

      gsap.set(layerTwo, {
        autoAlpha: 0,
        zIndex: 0,
      });

      delayedCallRef.current?.kill();
      delayedCallRef.current = gsap.delayedCall(interval, animateToNext);
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(init);
    } else {
      init();
    }

    return () => {
      killedRef.current = true;

      delayedCallRef.current?.kill();
      timelineRef.current?.kill();

      clearSplit(0);
      clearSplit(1);
    };
  }, [items, interval, duration, stagger]);

  return (
    <div
      ref={rootRef}
      className={`relative overflow-hidden text-[1.5vw] ${className}`}
    >
      <p ref={layerOneRef} className={`leading-[1.2] ${textClassName}`} />
      <p ref={layerTwoRef} className={`leading-[1.2] ${textClassName}`} />
    </div>
  );
}

export const Loader = ({ maxExtraWait = 4500, settleDelay = 500 }) => {
  const lenis = useLenis();

  const loaderTlRef = useRef(null);
  const counterTlRef = useRef(null);
  const waitTweenRef = useRef(null);
  const forceReadyTweenRef = useRef(null);

  const windowLoadedRef = useRef(false);
  const fontsLoadedRef = useRef(false);
  const threeLoadedRef = useRef(false);
  const forcedReadyRef = useRef(false);
  const hasCompletedRef = useRef(false);
  const introRevealReadyDispatchedRef = useRef(false);

  useEffect(() => {
    window.__hyperiuxLoaderComplete = false;
    window.__hyperiuxIntroRevealReady = false;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    lenis?.scrollTo?.(0, {
      immediate: true,
      force: true,
    });

    window.dispatchEvent(new Event("hyperiux-loader-lock-scroll"));

    lenis?.stop?.();

    CustomEase.create("clipLogoEase", "1,0,1,.59");

    gsap.set(".gradient-overlay", {
      "--fade-height": "-40%",
      "--fade-softness": "35%",
      willChange: "mask-image, -webkit-mask-image",
    });

    gsap.set(".clip-logo", {
      "--logo-size": "20vw",
      scale: 1,
      xPercent: 0,
      transformOrigin: "center center",
    });

    gsap.set(".loader", {
      autoAlpha: 1,
      pointerEvents: "auto",
    });

    gsap.set(".loader-content", {
      autoAlpha: 1,
      yPercent: 0,
    });

    gsap.set(".loader-num", {
      yPercent: 0,
    });

    const dispatchIntroRevealReady = () => {
      if (introRevealReadyDispatchedRef.current) return;

      introRevealReadyDispatchedRef.current = true;

      window.__hyperiuxIntroRevealReady = true;
      window.dispatchEvent(new Event("hyperiux-intro-reveal-ready"));
    };

    const isBehindReady = () => {
      return (
        windowLoadedRef.current &&
        fontsLoadedRef.current &&
        threeLoadedRef.current
      );
    };

    const completeLoader = () => {
      if (hasCompletedRef.current) return;

      hasCompletedRef.current = true;

      window.__hyperiuxLoaderComplete = true;
      window.dispatchEvent(new Event("hyperiux-loader-complete"));

      requestAnimationFrame(() => {
        lenis?.resize?.();
        lenis?.start?.();

        requestAnimationFrame(() => {
          ScrollTrigger.refresh(true);
        });

        setTimeout(() => {
          lenis?.resize?.();
          ScrollTrigger.refresh(true);
        }, 300);

        setTimeout(() => {
          lenis?.resize?.();
          ScrollTrigger.refresh(true);
        }, 900);
      });
    };

    const playExitAnimation = () => {
      if (hasCompletedRef.current) return;

      loaderTlRef.current
        .to(".loader-content", {
          autoAlpha: 0,
          yPercent: -20,
          duration: 0.35,
          ease: "power2.inOut",
        })
        .to(
          ".loader-num",
          {
            yPercent: -100,
            stagger: 0.08,
            ease: "power3.in",
            duration: 0.5,
          },
          "-=0.2"
        )
        .to(
          ".clip-logo",
          {
            "--logo-size": "1060vw",
            duration: 0.9,
            xPercent: 100,
            scale: 250,
            ease: "expo.in",
          },
          "-=0.2"
        )

        /*
          SYNC POINT:
          Intro starts while the loader is opening,
          but only when this loader timeline has actually reached this point.
        */
        .call(dispatchIntroRevealReady, null, "-=0.42")

        .to(
          ".loader",
          {
            autoAlpha: 0,
            pointerEvents: "none",
            duration: 0.5,
            ease: "power2.out",
            onComplete: completeLoader,
          },
          "-=0.25"
        );
    };

    const waitUntilReadyThenExit = () => {
      const startedWaitingAt = performance.now();

      const check = () => {
        const waited = performance.now() - startedWaitingAt;

        if (
          isBehindReady() ||
          forcedReadyRef.current ||
          waited >= maxExtraWait
        ) {
          gsap.delayedCall(settleDelay / 1000, playExitAnimation);
          return;
        }

        waitTweenRef.current = gsap.delayedCall(0.15, check);
      };

      check();
    };

    counterTlRef.current = gsap.timeline();

    counterTlRef.current
      .to(
        ".third-col",
        {
          yPercent: -20,
          ease: "power3.inOut",
          duration: 0.8,
          delay: 0.6,
        },
        0
      )
      .to(
        ".second-col",
        {
          yPercent: -30,
          ease: "power3.inOut",
          duration: 1,
        },
        "-=0.9"
      )
      .to(".third-col", {
        yPercent: -80,
        ease: "power3.inOut",
        duration: 1.5,
      })
      .to(
        ".second-col",
        {
          yPercent: -60,
          ease: "power3.inOut",
          duration: 1.5,
        },
        "-=1.4"
      )
      .to(".third-col", {
        yPercent: -90,
        ease: "power3.inOut",
        duration: 1.5,
      })
      .to(
        ".second-col",
        {
          yPercent: -90,
          ease: "power3.inOut",
          duration: 1.5,
        },
        "-=1.4"
      );

    loaderTlRef.current = gsap.timeline({
      onComplete: waitUntilReadyThenExit,
    });

    loaderTlRef.current
      .to(
        ".gradient-overlay",
        {
          "--fade-height": "0%",
          duration: 0.8,
          delay: 0.5,
          ease: "power3.inOut",
        },
        0
      )
      .to(".gradient-overlay", {
        "--fade-height": "30%",
        duration: 2,
        ease: "power3.inOut",
      })
      .to(".gradient-overlay", {
        "--fade-height": "100%",
        duration: 1.8,
        ease: "power3.inOut",
      });

    const handleWindowLoad = () => {
      windowLoadedRef.current = true;
    };

    if (document.readyState === "complete") {
      windowLoadedRef.current = true;
    } else {
      window.addEventListener("load", handleWindowLoad, { once: true });
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        fontsLoadedRef.current = true;
      });
    } else {
      fontsLoadedRef.current = true;
    }

    const manager = THREE.DefaultLoadingManager;

    const oldOnLoad = manager.onLoad;
    const oldOnError = manager.onError;
    const oldOnProgress = manager.onProgress;
    const oldOnStart = manager.onStart;

    if (manager.itemsTotal === 0) {
      gsap.delayedCall(0.5, () => {
        if (
          manager.itemsTotal === 0 ||
          manager.itemsLoaded >= manager.itemsTotal
        ) {
          threeLoadedRef.current = true;
        }
      });
    } else if (manager.itemsLoaded >= manager.itemsTotal) {
      threeLoadedRef.current = true;
    }

    manager.onStart = (...args) => {
      threeLoadedRef.current = false;
      oldOnStart?.(...args);
    };

    manager.onProgress = (...args) => {
      threeLoadedRef.current = false;
      oldOnProgress?.(...args);
    };

    manager.onLoad = (...args) => {
      threeLoadedRef.current = true;
      oldOnLoad?.(...args);
    };

    manager.onError = (...args) => {
      threeLoadedRef.current = true;
      oldOnError?.(...args);
    };

    forceReadyTweenRef.current = gsap.delayedCall(maxExtraWait / 1000, () => {
      forcedReadyRef.current = true;
    });

    return () => {
      window.removeEventListener("load", handleWindowLoad);

      loaderTlRef.current?.kill();
      counterTlRef.current?.kill();
      waitTweenRef.current?.kill();
      forceReadyTweenRef.current?.kill();

      manager.onStart = oldOnStart;
      manager.onLoad = oldOnLoad;
      manager.onError = oldOnError;
      manager.onProgress = oldOnProgress;

      if (!hasCompletedRef.current) {
        lenis?.start?.();
      }
    };
  }, [lenis, maxExtraWait, settleDelay]);

  return (
    <section className="loader fixed inset-0 z-[9999] h-screen w-screen overflow-hidden">
      <div className="flex h-screen w-screen items-center justify-center">
        <div
          className="gradient-overlay size-[20vw] bg-[#111111]"
          style={{
            WebkitMaskImage:
              "linear-gradient(to top, transparent 0%, transparent var(--fade-height), black calc(var(--fade-height) + var(--fade-softness)), black 100%)",
            maskImage:
              "linear-gradient(to top, transparent 0%, transparent var(--fade-height), black calc(var(--fade-height) + var(--fade-softness)), black 100%)",
          }}
        />
      </div>

      <div className="overlay absolute inset-0 z-[2] flex h-screen w-screen items-center justify-center">
        <CutoutOverlayLayer
          className="clip-overlay-top z-[3]"
          clipPath="inset(0% 0% 0% 0%)"
        />

        <div className="absolute right-[2%] top-[45%] z-[6] flex h-[7vw] overflow-hidden text-[7vw] font-medium text-[#111111]">
          <div className="loader-num second-col flex h-fit w-[4.5vw] flex-col">
            <span className="leading-[1]">0</span>
            <span className="leading-[1]">1</span>
            <span className="leading-[1]">2</span>
            <span className="leading-[1]">3</span>
            <span className="leading-[1]">4</span>
            <span className="leading-[1]">5</span>
            <span className="leading-[1]">6</span>
            <span className="leading-[1]">7</span>
            <span className="leading-[1]">8</span>
            <span className="leading-[1]">9</span>
          </div>

          <div className="loader-num third-col flex h-fit w-[4.5vw] flex-col">
            <span className="leading-[1]">0</span>
            <span className="leading-[1]">1</span>
            <span className="leading-[1]">2</span>
            <span className="leading-[1]">3</span>
            <span className="leading-[1]">4</span>
            <span className="leading-[1]">5</span>
            <span className="leading-[1]">6</span>
            <span className="leading-[1]">7</span>
            <span className="leading-[1]">8</span>
            <span className="leading-[1]">9</span>
          </div>
        </div>

        <div className="loader-content absolute left-[2%] top-[53%] z-[4] w-[30vw] -translate-y-1/2 text-[1.2vw] text-[#111111]">
          <AutoChangingSplitText
            items={AUTO_CONTENT}
            interval={2}
            duration={0.75}
            stagger={0.035}
            className="h-[5.5vw] w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default Loader;