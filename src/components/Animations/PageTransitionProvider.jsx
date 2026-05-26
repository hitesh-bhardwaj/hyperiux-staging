"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PageTransitionContext = createContext(null);

const CUBE_DRAW_DURATION = 1.45;
const CUBE_UNDRAW_DURATION = 1.25;
const CUBE_UNDRAW_DELAY = 1;

const OVERLAY_DRAW_OPACITY = 0.7;
const OVERLAY_UNDRAW_END_OPACITY = 0;

const TRANSITION_LOCK_DURATION = 6200;

/*
  1 = original cube size
  0.8 = 20% smaller
*/
const CUBE_SIZE_MULTIPLIER = 0.8;

function seededRandom(seed) {
  let value = seed;

  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function buildCubeFaces(vw, vh) {
  const random = seededRandom(89);
  const isMobileViewport = vw <= 542;

  const baseCubeW = isMobileViewport ? vw * 0.16 : vw * 0.048;
  const cubeW = baseCubeW * CUBE_SIZE_MULTIPLIER;
  const cubeH = cubeW * 1.22;
  const topH = cubeW * 1.02;

  const stepX = cubeW * 1.99;
  const stepY = cubeH + topH * 0.5;

  const startX = -cubeW * 3;
  const startY = -topH * 2;

  const rowsNeeded = Math.ceil(vh / stepY) + 6;
  const colsNeeded = Math.ceil(vw / stepX) + 8;

  const faces = [];

  for (let row = 0; row < rowsNeeded; row++) {
    for (let col = 0; col < colsNeeded; col++) {
      const shift = row % 2 === 1 ? stepX * 0.5 : 0;

      const x = startX + col * stepX + shift;
      const y = startY + row * stepY;

      const cx = x + cubeW;
      const topY = y;

      const top = [
        [cx, topY],
        [cx + cubeW, topY + topH * 0.5],
        [cx, topY + topH],
        [cx - cubeW, topY + topH * 0.5],
      ];

      const left = [
        [cx - cubeW, topY + topH * 0.5],
        [cx, topY + topH],
        [cx, topY + topH + cubeH],
        [cx - cubeW, topY + topH * 0.5 + cubeH],
      ];

      const right = [
        [cx, topY + topH],
        [cx + cubeW, topY + topH * 0.5],
        [cx + cubeW, topY + topH * 0.5 + cubeH],
        [cx, topY + topH + cubeH],
      ];

      /*
        Bottom-left to top-right diagonal order.
        Lower screen = bigger y.
        More left = smaller x.
      */
      const normalizedX = x / Math.max(1, vw);
      const normalizedY = y / Math.max(1, vh);

      const diagonalScore =
        normalizedX * 42 + (1 - normalizedY) * 42 + random() * 5;

      faces.push({
        points: top,
        score: diagonalScore + random() * 1.2,
      });

      faces.push({
        points: left,
        score: diagonalScore + random() * 1.2 + 1,
      });

      faces.push({
        points: right,
        score: diagonalScore + random() * 1.2 + 2,
      });
    }
  }

  faces.sort((a, b) => a.score - b.score);

  const total = faces.length;

  for (let i = 0; i < total; i++) {
    faces[i].revealStart = i / total;
    delete faces[i].score;
  }

  return faces;
}

function setupCanvas(canvas) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  /*
    Keep DPR low for transition performance.
  */
  const dpr = Math.min(window.devicePixelRatio || 1, 1.25);

  canvas.width = vw * dpr;
  canvas.height = vh * dpr;

  canvas.style.width = `${vw}px`;
  canvas.style.height = `${vh}px`;

  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  return {
    ctx,
    width: vw,
    height: vh,
    faces: buildCubeFaces(vw, vh),
  };
}

function drawCubes({ ctx, width, height, faces, progress, phase }) {
  if (!ctx) return;

  ctx.clearRect(0, 0, width, height);

  /*
    Cube face and outline colors.
  */
  ctx.fillStyle = "#111111";
  ctx.strokeStyle = "#1a1a1a";
  ctx.lineWidth = 1;

  for (let i = 0; i < faces.length; i++) {
    const face = faces[i];

    let alpha = 0;

    if (phase === "draw") {
      alpha = Math.max(0, Math.min(1, (progress - face.revealStart) * 16));
    }

    if (phase === "undraw") {
      /*
        Same bottom-left to top-right removal direction.
      */
      alpha = Math.max(
        0,
        Math.min(1, (face.revealStart - progress) * 16 + 1)
      );
    }

    if (alpha <= 0) continue;

    const points = face.points;

    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);

    for (let j = 1; j < points.length; j++) {
      ctx.lineTo(points[j][0], points[j][1]);
    }

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
}

function TransitionCanvas({ canvasApiRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvasApiRef.current = setupCanvas(canvas);

    const handleResize = () => {
      canvasApiRef.current = setupCanvas(canvas);

      drawCubes({
        ...canvasApiRef.current,
        progress: 0,
        phase: "draw",
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvasApiRef.current = null;
    };
  }, [canvasApiRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-screen w-screen pointer-events-none"
    />
  );
}

export function PageTransitionProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);

  const currentPathRef = useRef(pathname);
  const pendingRouteRef = useRef(null);
  const transitionProgressRef = useRef({ value: 0 });
  const phaseRef = useRef("draw");
  const timelineRef = useRef(null);
  const canvasApiRef = useRef(null);
  const unlockTimeoutRef = useRef(null);

  /*
    This motion value controls the black overlay.
    GSAP updates the ref, and then syncOverlayOpacity sends that value to Framer.
  */
  const overlayOpacity = useMotionValue(0);
  const overlayOpacityRef = useRef({ value: 0 });

  const syncOverlayOpacity = useCallback(() => {
    overlayOpacity.set(overlayOpacityRef.current.value);
  }, [overlayOpacity]);

  const hardStopLenis = useCallback(() => {
    lenis?.stop?.();

    window.__hyperiuxLenisLockedUntil = Date.now() + TRANSITION_LOCK_DURATION;

    window.dispatchEvent(
      new CustomEvent("hyperiux-lock-lenis-after-route", {
        detail: {
          duration: TRANSITION_LOCK_DURATION,
        },
      })
    );
  }, [lenis]);

  const refreshAfterTransition = useCallback(() => {
    if (unlockTimeoutRef.current) {
      window.clearTimeout(unlockTimeoutRef.current);
    }

    unlockTimeoutRef.current = window.setTimeout(() => {
      window.__hyperiuxLenisLockedUntil = 0;

      lenis?.resize?.();
      lenis?.start?.();

      requestAnimationFrame(() => {
        ScrollTrigger.refresh(true);
      });

      setTimeout(() => {
        lenis?.resize?.();
        ScrollTrigger.refresh(true);
      }, 300);
    }, 150);
  }, [lenis]);

  const renderCanvasFrame = useCallback(() => {
    if (!canvasApiRef.current) return;

    drawCubes({
      ...canvasApiRef.current,
      progress: transitionProgressRef.current.value,
      phase: phaseRef.current,
    });
  }, []);

  const push = useCallback(
    (href) => {
      if (!href) return;
      if (href === pathname) return;
      if (isTransitioning) return;

      pendingRouteRef.current = href;
      setIsTransitioning(true);
      setOverlayVisible(true);

      hardStopLenis();

      phaseRef.current = "draw";
      transitionProgressRef.current.value = 0;

      overlayOpacityRef.current.value = 0;
      overlayOpacity.set(0);

      timelineRef.current?.kill();

      requestAnimationFrame(() => {
        renderCanvasFrame();

        timelineRef.current = gsap.timeline({
          defaults: {
            ease: "power2.inOut",
          },
        });

        timelineRef.current
          /*
            Overlay opacity and cube draw start together.
            0 → 0.2 while cubes draw.
          */
          .to(
            overlayOpacityRef.current,
            {
              value: OVERLAY_DRAW_OPACITY,
              duration: CUBE_DRAW_DURATION,
              ease: "power2.inOut",
              onUpdate: syncOverlayOpacity,
            },
            0
          )
          .to(
            transitionProgressRef.current,
            {
              value: 1,
              duration: CUBE_DRAW_DURATION,
              ease: "power2.inOut",
              onUpdate: renderCanvasFrame,
            },
            0
          )
          .call(() => {
            router.push(href);
          });
      });
    },
    [
      pathname,
      isTransitioning,
      hardStopLenis,
      overlayOpacity,
      syncOverlayOpacity,
      renderCanvasFrame,
      router,
    ]
  );

  useEffect(() => {
    if (!isTransitioning) {
      currentPathRef.current = pathname;
      return;
    }

    if (currentPathRef.current === pathname) return;

    currentPathRef.current = pathname;

    /*
      New route has arrived.
      Keep cubes fully visible for 1 second.
      Then cubes undraw while overlay fades from current opacity to 0.
    */
    phaseRef.current = "undraw";
    transitionProgressRef.current.value = 0;

    timelineRef.current?.kill();

    requestAnimationFrame(() => {
      renderCanvasFrame();

      timelineRef.current = gsap.timeline({
        defaults: {
          ease: "power2.inOut",
        },
        onComplete: () => {
          /*
            At this point:
            - cube canvas is removed
            - overlay opacity is already 0
            So there is no final opacity snap.
          */
          setOverlayVisible(false);
          setIsTransitioning(false);

          pendingRouteRef.current = null;
          phaseRef.current = "draw";
          transitionProgressRef.current.value = 0;

          overlayOpacityRef.current.value = 0;
          overlayOpacity.set(0);

          refreshAfterTransition();
        },
      });

      /*
        New page stays covered for 1 second.
        Overlay remains at current opacity during this hold.
      */
      timelineRef.current.to({}, { duration: CUBE_UNDRAW_DELAY });

      /*
        Opacity and cube undraw are synced.
        Same start label. Same duration.
        Overlay fades from current opacity to 0, not to darker black.
      */
      timelineRef.current
        .to(
          overlayOpacityRef.current,
          {
            value: OVERLAY_UNDRAW_END_OPACITY,
            duration: CUBE_UNDRAW_DURATION,
            ease: "power2.inOut",
            onUpdate: syncOverlayOpacity,
          },
          "undrawStart"
        )
        .to(
          transitionProgressRef.current,
          {
            value: 1,
            duration: CUBE_UNDRAW_DURATION,
            ease: "power2.inOut",
            onUpdate: renderCanvasFrame,
          },
          "undrawStart"
        );
    });
  }, [
    pathname,
    isTransitioning,
    overlayOpacity,
    syncOverlayOpacity,
    renderCanvasFrame,
    refreshAfterTransition,
  ]);

  useEffect(() => {
    return () => {
      timelineRef.current?.kill();

      if (unlockTimeoutRef.current) {
        window.clearTimeout(unlockTimeoutRef.current);
      }
    };
  }, []);

  const contextValue = useMemo(() => {
    return {
      push,
      isTransitioning,
    };
  }, [push, isTransitioning]);

  return (
    <PageTransitionContext.Provider value={contextValue}>
      {children}

      <AnimatePresence>
        {overlayVisible && (
          <motion.div
            key="optimized-page-transition"
            className="fixed inset-0 z-[9998] pointer-events-auto overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
          >
            <motion.div
              className="absolute inset-0 bg-black/80 pointer-events-none"
              style={{
                opacity: overlayOpacity,
              }}
            />

            <TransitionCanvas canvasApiRef={canvasApiRef} />
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext);

  if (!context) {
    throw new Error(
      "usePageTransition must be used inside PageTransitionProvider"
    );
  }

  return context;
}