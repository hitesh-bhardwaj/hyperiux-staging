"use client";

import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import SplitText from "gsap/dist/SplitText";
import { useEffect, useRef, useState } from "react";
import CubeCanvasBackground from "../../3D/CubeCanvasBackground";
import About from "./About";
import Hero from "./Hero";

gsap.registerPlugin(ScrollTrigger, SplitText);

function seededRandom(seed) {
  let value = seed;

  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

export default function IntroSequence() {
  const containerRef = useRef(null);
  const modelGroupRef = useRef(null);
  const parentModelGroupRef = useRef(null);
  const modelIntroRotationOffsetRef = useRef({ y: -3 });

  const introRevealPlayedRef = useRef(false);
  const introRevealTlRef = useRef(null);
  const modelRevealTlRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

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
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 542);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let firstSplit;
    let firstPara;
    let secondSplit;

    const waitForR3FRef = (ref, callback, tries = 0) => {
      if (ref.current) {
        callback(ref.current);
        return;
      }

      if (tries > 120) return;

      requestAnimationFrame(() => {
        waitForR3FRef(ref, callback, tries + 1);
      });
    };

    const ctx = gsap.context(() => {
      firstSplit = new SplitText(".first-split", {
        type: "lines,chars",
        linesClass: "split-line",
        mask: "lines",
      });

      firstPara = new SplitText(".first-para", {
        type: "lines,words",
        linesClass: "split-line",
        mask: "lines",
      });

      secondSplit = new SplitText(".second-split", {
        type: "lines",
        linesClass: "split-line",
        mask: "lines",
      });

      gsap.set(".first-split", { opacity: 1 });
      gsap.set(".first-para", { opacity: 1 });

      gsap.set(firstSplit.lines, { yPercent: -10 });
      gsap.set(secondSplit.lines, { yPercent: 100 });

      if (!introRevealPlayedRef.current) {
        gsap.set(firstSplit.chars, { yPercent: 120, autoAlpha: 1 });
        gsap.set(firstPara.words, { yPercent: 120, autoAlpha: 1 });
      } else {
        gsap.set(firstSplit.chars, { yPercent: 0, autoAlpha: 1 });
        gsap.set(firstPara.words, { yPercent: 0, autoAlpha: 1 });
      }

      const playIntroReveal = () => {
        if (introRevealPlayedRef.current) return;

        /*
          HARD GATE:
          This intro can only run when the loader timeline dispatches
          hyperiux-intro-reveal-ready.
        */
        if (!window.__hyperiuxIntroRevealReady) return;

        introRevealPlayedRef.current = true;

        introRevealTlRef.current?.kill();
        modelRevealTlRef.current?.kill();

        introRevealTlRef.current = gsap.timeline({
          defaults: { ease: "power2.out" },
        });

        introRevealTlRef.current
          .to(
            firstSplit.chars,
            {
              yPercent: 0,
              stagger: 0.025,
              duration: 0.6,
              ease: "power1.inOut",
            },
            0
          )
          .to(
            firstPara.words,
            {
              yPercent: 0,
              stagger: 0.01,
              duration: 0.8,
              ease: "power1.inOut",
            },
            0.3
          );

        waitForR3FRef(parentModelGroupRef, (parentGroup) => {
          modelRevealTlRef.current?.kill();

          modelRevealTlRef.current = gsap.timeline();

          modelRevealTlRef.current
            .fromTo(
              parentGroup.scale,
              { x: 0, y: 0, z: 0 },
              {
                x: 1,
                y: 1,
                z: 1,
                delay: 0.5,
                duration: 1.2,
                ease: "power3.inOut",
              },
              0
            )
            .fromTo(
              parentGroup.position,
              { x: 1.35, y: -0.12, z: 0 },
              {
                x: 0,
                y: 0,
                z: 0,
                delay: 0.5,
                duration: 1.2,
                ease: "power3.inOut",
              },
              0
            )
            .to(
              modelIntroRotationOffsetRef.current,
              {
                y: 0,
                delay: 1,
                duration: 1.5,
                ease: "power3.out",
              },
              0
            );
        });
      };

      /*
        IMPORTANT:
        No fallback timer here.
        No hyperiux-loader-intro-start here.
        This waits only for the loader's sync event.
      */
      if (window.__hyperiuxIntroRevealReady) {
        requestAnimationFrame(playIntroReveal);
      } else {
        window.addEventListener("hyperiux-intro-reveal-ready", playIntroReveal, {
          once: true,
        });
      }

      gsap.to(firstPara.lines, {
        yPercent: -120,
        stagger: 0.03,
        duration: 0.45,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "20% top",
          scrub: true,
        },
      });

      gsap.to(firstSplit.lines, {
        yPercent: -120,
        stagger: 0.03,
        duration: 0.45,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "20% top",
          scrub: true,
        },
      });

      gsap.to(secondSplit.lines, {
        yPercent: -10,
        stagger: 0.03,
        duration: 0.45,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: container,
          start: "20% top",
          end: "50% top",
          scrub: true,
        },
      });

      gsap.to(".about-cta", {
        yPercent: 0,
        opacity: 1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: container,
          start: "35% top",
          end: "50% top",
          scrub: true,
        },
      });

      if (!isMobile) {
        gsap.to(".second-section-portal", {
          opacity: 1,
          scrollTrigger: {
            trigger: ".hero",
            start: "30% top",
            end: "bottom 60%",
            scrub: true,
          },
        });
      }

      ScrollTrigger.refresh();

      return () => {
        window.removeEventListener(
          "hyperiux-intro-reveal-ready",
          playIntroReveal
        );
      };
    }, container);

    return () => {
      introRevealTlRef.current?.kill();
      modelRevealTlRef.current?.kill();

      firstSplit?.revert();
      firstPara?.revert();
      secondSplit?.revert();

      ctx.revert();
    };
  }, [isMobile]);

  return (
    <div ref={containerRef} className="container relative z-2 h-fit" id="hero">
      <div className="hero sticky top-0 h-screen w-screen">
        <Hero
          isMobile={isMobile}
          modelGroupRef={modelGroupRef}
          parentModelGroupRef={parentModelGroupRef}
          modelIntroRotationOffsetRef={modelIntroRotationOffsetRef}
        />
      </div>

      <About isMobile={isMobile} />

      <CubeCanvasBackground seededRandom={seededRandom} />
    </div>
  );
}