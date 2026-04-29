"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Facebook, Instagram, Linkedin, Twitter } from "../Buttons";
import Link from "next/link";
import HeadAnim from "../Animations/HeadAnim";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export const NewFooterBottom = ({ pathName, path }) => {
  const container = useRef(null);
  const squareRefs = useRef([]);

  const THRESHOLD = 1000;
  const RESET_DELAY = 500;

  const [progress, setProgress] = useState(0);
  const accumRef = useRef(0);
  const timerRef = useRef();
  const hasNavRef = useRef(false);

  const footerSquares = [
    { col: 0, row: 0, baseColor: "rgba(255,255,255,0.4)" },
    { col: 1, row: 0, baseColor: "rgba(255,255,255,0.3)" },
    { col: 2, row: 0, baseColor: "rgba(255,255,255,0.2)" },
    { col: 3, row: 0, baseColor: "rgba(255,255,255,0.1)" },
    { col: 4, row: 0, baseColor: "rgba(255,255,255,0.05)" },

    { col: 1, row: 1, baseColor: "rgba(255,255,255,0.4)" },
    { col: 2, row: 1, type: "sayHi" },
    { col: 3, row: 1, baseColor: "rgba(255,255,255,0.2)" },
    { col: 4, row: 1, baseColor: "rgba(255,255,255,0.1)" },

    { col: 2, row: 2, baseColor: "rgba(255,255,255,0.4)" },
    { col: 3, row: 2, baseColor: "rgba(255,255,255,0.3)" },
    { col: 4, row: 2, baseColor: "rgba(255,255,255,0.2)" },

    { col: 3, row: 3, baseColor: "rgba(255,255,255,0.4)" },
    { col: 4, row: 3, baseColor: "rgba(255,255,255,0.3)" },

    { col: 4, row: 4, baseColor: "rgba(255,255,255,0.4)" },
  ];

  useEffect(() => {
    const diagonalGroups = {};

    footerSquares.forEach((square, index) => {
      if (square.type === "sayHi") return;

      const el = squareRefs.current[index];
      if (!el) return;

      const diagonalKey = square.row + (4 - square.col);

      if (!diagonalGroups[diagonalKey]) {
        diagonalGroups[diagonalKey] = [];
      }

      diagonalGroups[diagonalKey].push({
        el,
        baseColor: square.baseColor,
      });
    });

    const orderedGroups = Object.keys(diagonalGroups)
      .map(Number)
      .sort((a, b) => a - b)
      .map((key) => diagonalGroups[key]);

    const allSquares = orderedGroups.flat();

    gsap.set(
      allSquares.map((item) => item.el),
      {
        backgroundColor: (index, target) => {
          const found = allSquares.find((item) => item.el === target);
          return found?.baseColor || "rgba(255,255,255,0.3)";
        },
      },
    );

    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 2,
    });

    orderedGroups.forEach((group, index) => {
      const startTime = index * 0.15;
      const elements = group.map((item) => item.el);

      tl.to(
        elements,
        {
          backgroundColor: "rgba(255,255,255,0.7)",
          duration: 0.65,
          ease: "sine.inOut",
        },
        startTime,
      ).to(
        elements,
        {
          backgroundColor: (i, target) => {
            const found = group.find((item) => item.el === target);
            return found?.baseColor || "rgba(255,255,255,0.3)";
          },
          duration: 0.65,
          ease: "sine.inOut",
        },
        startTime + 0.65,
      );
    });

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    const reset = () => {
      accumRef.current = 0;

      gsap.to(".progress-bar", {
        width: "0%",
        duration: 1,
        ease: "power1.out",
        onUpdate() {
          setProgress(0);
        },
      });
    };

    const onWheel = (e) => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      if (e.deltaY <= 0 || window.scrollY < maxScroll) {
        hasNavRef.current = false;
        clearTimeout(timerRef.current);
        reset();
        return;
      }

      accumRef.current = Math.min(accumRef.current + e.deltaY, THRESHOLD);
      const pct = (accumRef.current / THRESHOLD) * 100;

      gsap.to(".progress-bar", {
        width: `${pct}%`,
        duration: 0.1,
        ease: "power1.out",
        onUpdate() {
          setProgress((accumRef.current / THRESHOLD) * 100);
        },
      });

      clearTimeout(timerRef.current);

      timerRef.current = window.setTimeout(() => {
        if (!hasNavRef.current) reset();
      }, RESET_DELAY);

      if (accumRef.current >= THRESHOLD && !hasNavRef.current) {
        hasNavRef.current = true;

        gsap.to(".progress-bar", {
          width: "100%",
          duration: 0.4,
          ease: "power2.out",
        });
      }
    };

    const onScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      if (window.scrollY < maxScroll) {
        hasNavRef.current = false;
        clearTimeout(timerRef.current);
        reset();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timerRef.current);
    };
  }, [path]);

  return (
    <>
      <div
        ref={container}
        className="w-screen h-[85vh] z-[1] relative max-sm:h-fit"
        id="footer-bottom"
      >
        <div className="relative overflow-hidden w-screen h-[85vh] footer-gradient bottom-0 text-white flex flex-col justify-between items-center px-[5vw] pt-[3%] pb-[2%] max-sm:pt-[10%] max-sm:justify-start max-sm:gap-[15vw] max-sm:h-fit max-sm:pb-[10%]">
          <div className="absolute right-0 top-0 z-[3] grid grid-cols-5 grid-rows-5">
            {footerSquares.map((square, index) => {
              const style = {
                gridColumnStart: square.col + 1,
                gridRowStart: square.row + 1,
              };

              if (square.type === "sayHi") {
                return (
                  <Link
                    key={index}
                    href="/contact-us"
                    className="size-[10vw] bg-[#111111] flex justify-center group items-center overflow-hidden gap-[1vw] text-white font-aeonik text-[1.5vw]"
                    style={style}
                    scroll={false}
                  >
                    <span className="w-[0.8vw] h-[0.8vw] bg-[#ff6b00] group-hover:scale-[20] group-hover:bg-white group-hover:duration-[0.6s] duration-[0.4s] ease-out group-hover:translate-x-[500%]" />
                    <span className="relative inline-block z-[2] group-hover:text-[#ff6b00] group-hover:translate-x-[-25%] duration-400 ease-out">
                      Say Hi
                    </span>
                  </Link>
                );
              }

              return (
                <div
                  key={index}
                  ref={(el) => {
                    squareRefs.current[index] = el;
                  }}
                  className={`size-[10vw]`}
                  style={{
                    ...style,
                    backgroundColor: square.baseColor,
                  }}
                />
              );
            })}
          </div>

          <div className="relative z-[2] w-full h-fit items-center flex justify-between max-sm:flex-col max-sm:gap-[7vw]">
            <div className="w-[30%] max-sm:w-[90%]">
              <HeadAnim>
                <h2 className="text-[3.5vw] max-sm:text-[11vw] max-sm:text-center">
                  Let&apos;s Bring Your Ideas To Life!
                </h2>
              </HeadAnim>
            </div>
          </div>

          <div className="relative z-[2] w-full flex gap-[5vw] items-end max-sm:flex-col pb-[2%]">
            <div className="w-[25%] flex flex-col gap-[0.8vw] max-sm:w-full max-sm:items-center max-sm:gap-[4vw]">
              <div className="flex flex-col text-[1vw] w-full font-medium gap-[0.4vw] max-sm:text-[4.2vw] max-sm:items-center max-sm:gap-[3vw]">
                <Link href="mailto:hi@weareenigma.com" className="link-line">
                  hi@weareenigma.com
                </Link>
                <Link href="tel:+918745044555" className="link-line">
                  +91 8745044555
                </Link>
              </div>

              <div className="w-[75%] text-[1.1vw] font-medium max-sm:text-[4.2vw] max-sm:text-center under-multi-parent">
                <span className="under-multi">
                  Grandslam I-Thum, A-40, Sector- 62, Noida, Uttar Pradesh
                  (201309)
                </span>
              </div>

              <div className="flex gap-[1vw] menu-socials mt-[1vw] max-sm:gap-[3vw]">
                <Facebook
                  menuSocial
                  className="group-hover:-invert"
                  fill="group-hover:fill-[#ff6b00]"
                />
                <Twitter
                  menuSocial
                  className="group-hover:-invert"
                  fill="group-hover:fill-[#ff6b00]"
                />
                <Linkedin
                  menuSocial
                  className="group-hover:-invert"
                  fill="group-hover:fill-[#ff6b00]"
                />
                <Instagram
                  menuSocial
                  className="group-hover:-invert"
                  fill="group-hover:fill-[#ff6b00]"
                />
              </div>
            </div>

            
          </div>
        </div>
      </div>

      <div
        className="w-screen h-[18vw] bg-[#111111] max-sm:h-[30vh]"
        style={{ clipPath: "rect(0px 100% 100% 0px)" }}
      >
        <div className="flex h-[18vw] fixed bottom-0 w-full px-[5vw] justify-between items-center max-sm:flex-col max-sm:pt-[10%] max-sm:pb-[5%] max-sm:h-[30vh]">
          {/* <div className="w-[60%] h-full flex items-end pb-[3%] max-sm:order-1 max-sm:w-[70%]">
            <p className="text-white max-sm:text-[3.5vw] max-sm:text-center">
              © 2025 Enigma Digital Consulting LLP. All rights reserved all
              wrongs reversed.
            </p>
          </div> */}

          {/* <div className="w-[22%] flex flex-col max-sm:w-[80%] max-sm:items-center max-sm:gap-[4vw]">
            <p className="text-white">Keep Scrolling To Learn More</p>

            <div className="flex flex-col w-full gap-[1vw] max-sm:items-center max-sm:gap-[3vw]">
              <h3 className="text-[2.5vw] font-aeonik text-white max-sm:text-[11vw]">
                {pathName}
              </h3>

              <div className="w-full h-[5px] bg-white/10 flex">
                <span
                  style={{ width: `${progress}%` }}
                  className="w-0 h-full inline-block bg-[#ff6b00] progress-bar"
                />
              </div>
            </div>
          </div> */}
          <div className="w-fit flex gap-[2.5vw]">
              {["h", "y", "p", "e", "r", "i", "u", "x"].map((letter, index) => (
                <Image
                  key={letter}
                  src={`/assets/icons/${letter}.svg`}
                  alt=""
                  className={`size-[10vw] ${
                    index === 5 || index === 6 ? "ml-[-3vw]" : ""
                  }`}
                  width={50}
                  height={50}
                />
              ))}
            </div>
        </div>
      </div>
    </>
  );
};
