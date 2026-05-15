// components/ComingSoonOverlay/ComingSoonOverlay.jsx

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, useGSAP);

function getTimeLeft(targetDate) {
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const diff = Math.max(target - now, 0);

  const totalSeconds = Math.floor(diff / 1000);

  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds / (60 * 60)) % 24);
  const mins = Math.floor((totalSeconds / 60) % 60);
  const secs = Math.floor(totalSeconds % 60);

  return {
    days,
    hours,
    mins,
    secs,
  };
}

function TimerBox({ value, label }) {
  return (
    <div className="flex h-[5.8vw] min-h-[72px] w-[7vw] min-w-[92px] flex-col items-center justify-center rounded-[0.65vw] border border-white/15 max-lg:h-[78px] max-lg:w-[100px] max-sm:h-[60px] max-sm:min-h-[60px] max-sm:w-[70px] max-sm:min-w-[70px] max-sm:rounded-[10px]">
      <span className="!font-orbitron text-[2vw] leading-none tracking-[-0.06em] text-white max-lg:text-[34px] max-sm:text-[24px]">
        {String(value).padStart(2, "0")}
      </span>

      <span className="mt-[0.5vw] font-orbitron text-[0.65vw] uppercase tracking-[0.04em] text-white/90 max-lg:text-[10px] max-sm:mt-[5px] max-sm:text-[8px]">
        {label}
      </span>
    </div>
  );
}

export default function ComingSoonOverlay({
  targetDate = "2026-10-01T00:00:00",
  title,
}) {
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const timerRef = useRef(null);
  const clickTextRef = useRef(null);
  const logoRef = useRef(null);

  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate));

  const timerItems = useMemo(
    () => [
      {
        value: timeLeft.days,
        label: "Days",
      },
      {
        value: timeLeft.hours,
        label: "Hours",
      },
      {
        value: timeLeft.mins,
        label: "Mins",
      },
      {
        value: timeLeft.secs,
        label: "Secs",
      },
    ],
    [timeLeft]
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [targetDate]);

  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        const headingSplit = new SplitText(headingRef.current, {
          type: "chars,words,lines",
          charsClass: "split-char",
          wordsClass: "split-word",
          linesClass: "split-line",
          mask: "lines",
        });

        const clickSplit = new SplitText(clickTextRef.current, {
          type: "lines,words",
          linesClass: "click-line",
          wordsClass: "click-word",
          mask: "lines",
        });
        

        gsap.set(logoRef.current, {
          autoAlpha: 0,
          y: 16,
        });

        gsap.set(headingSplit.chars, {
          yPercent: 115,
          opacity: 0,
          rotateX: -80,
          transformOrigin: "50% 100%",
          willChange: "transform, opacity",
        });

        gsap.set(timerRef.current, { 
          autoAlpha: 0,
          y: 28,
          scale: 0.96,
          filter: "blur(8px)",
        });

        gsap.set(clickSplit.lines, {
          yPercent: 120,
          opacity: 0,
          willChange: "transform, opacity",
        });

        const tl = gsap.timeline({
          defaults: {
            ease: "cubic-bezier(1,-0.02,.55,.9)",
          },
        });

        tl.to(logoRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          delay:0.5,
          ease: "power3.inOut",
        })
          .to(
            headingSplit.chars,
            {
              yPercent: 0,
              opacity: 1,
            //   delay:0.5,
              rotateX: 0,
              duration: 1.5,
              stagger: {
                each: 0.018,
                from: "start",
              },
              ease: "power4.inOut",
            },
            "-=0.6"
          )
          .to(
            timerRef.current,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 1.2,
              ease: "power3.inOut",
            },
            "-=0.8"
          )
          .to(
            clickSplit.lines,
            {
              yPercent: 0,
              opacity: 1,
              duration: 1.2,
              stagger: 0.08,
              ease: "power4.inOut",
            },
            "-=0.8"
          );

        return () => {
          headingSplit.revert();
          clickSplit.revert();
        };
      }, containerRef);

      return () => ctx.revert();
    },
    {
      scope: containerRef,
    }
  );

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-[80] h-screen w-screen overflow-hidden text-white"
    >
      {/* Logo */}
      <div
        ref={logoRef}
        className="absolute left-[2.4vw] top-[4.6vh] z-[5] max-sm:left-[6vw] max-sm:top-[4vh]"
      >
        <img
          src="/assets/icons/hyperiux-wordmark.svg"
          alt="Hyperiux"
          className="h-auto w-[10.6vw] min-w-[150px] brightness-[20] max-sm:w-[135px] max-sm:min-w-0"
        />
      </div>

      {/* Hero Text */}
      <div className="absolute left-[2.5vw] top-1/2 z-[5] -translate-y-[47%] max-lg:top-[46%] max-sm:left-[6vw] max-sm:top-[30%]">
        <h1
          ref={headingRef}
          className="max-w-[45vw] text-[6vw] text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)] max-lg:max-w-[620px] max-lg:text-[72px] max-md:text-[58px] max-sm:max-w-[88vw] max-sm:text-[44px]"
        >
          {title}
        </h1>
      </div>

      {/* Countdown Timer */}
      <div
        ref={timerRef}
        className="absolute bottom-[7.8vh] left-1/2 z-[5] -translate-x-1/2 max-sm:bottom-[12vh]"
      >
        <div className="flex items-center rounded-[0.85vw] border border-white/15 bg-white/[0.08] px-[0.9vw] py-[0.8vw] backdrop-blur-md max-lg:rounded-[14px] max-lg:px-[10px] max-lg:py-[10px] max-sm:rounded-[14px] max-sm:px-[8px] max-sm:py-[8px]">
          {timerItems.map((item, index) => (
            <React.Fragment key={item.label}>
              <TimerBox value={item.value} label={item.label} />

              {index < timerItems.length - 1 && (
                <div className="mx-[0.8vw] mt-[-0.7vw] flex h-[3vw] min-h-[46px] flex-col items-center justify-center text-[1.6vw] leading-none text-white max-lg:mx-[10px] max-lg:text-[24px] max-sm:mx-[6px] max-sm:min-h-[36px] max-sm:gap-[9px] max-sm:text-[18px]">
                  <span className="leading-5">.</span>
                  <span className="leading-5">.</span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Bottom Right Hint */}
      <div className="absolute bottom-[5.8vh] right-[2.6vw] z-[5] max-sm:bottom-[4vh] max-sm:right-[6vw]">
        <p
          ref={clickTextRef}
          className="text-[1.25vw] text-white max-lg:text-[18px] max-sm:text-[14px]"
        >
          Click and Hold To Experience
        </p>
      </div>
    </div>
  );
}