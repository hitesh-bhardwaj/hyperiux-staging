"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./index.module.css";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";


export const LinkButton = ({
  text,
  href,
  className = "",
  hover,
  invert,
  bgCircle,
  onClick,
  ...props
}) => {
  const containerRef = useRef(null);
  const baseRef = useRef(null);
  const topRef = useRef(null);

  const [isActive, setIsActive] = useState(false);

  const characters = useMemo(
    () => text.split("").map((char) => (char === " " ? "\u00A0" : char)),
    [text]
  );

  const staggerValue = useMemo(() => {
    return Math.max(0.01, 0.018 * (10 / characters.length));
  }, [characters.length]);

  useEffect(() => {
    if (!baseRef.current || !topRef.current) return;

    const baseChars = baseRef.current.querySelectorAll(".char");
    const topChars = topRef.current.querySelectorAll(".char");

    gsap.set(baseChars, {
      yPercent: 110,
      rotateX: 90,
      transformOrigin: "50% 50%",
      force3D: true,
    });

    gsap.set(topChars, {
      yPercent: 0,
      rotateX: 0,
      transformOrigin: "50% 50%",
      force3D: true,
    });
  }, []);

  const animateChars = (active) => {
    if (!baseRef.current || !topRef.current) return;

    const baseChars = baseRef.current.querySelectorAll(".char");
    const topChars = topRef.current.querySelectorAll(".char");

    gsap.killTweensOf([baseChars, topChars]);

    gsap.to(baseChars, {
      yPercent: active ? 0 : 110,
      rotateX: active ? 0 : 90,
      duration: 0.45,
      stagger: staggerValue,
      ease: "power2.out",
      overwrite: true,
    });

    gsap.to(topChars, {
      yPercent: active ? -110 : 0,
      rotateX: active ? -90 : 0,
      duration: 0.45,
      stagger: staggerValue,
      ease: "power2.out",
      overwrite: true,
    });
  };

  const activate = () => {
    setIsActive(true);
    animateChars(true);
  };

  const deactivate = () => {
    setIsActive(false);
    animateChars(false);
  };

  const handlePointerEnter = (e) => {
    if (e.pointerType === "touch") return;
    activate();
  };

  const handlePointerLeave = (e) => {
    if (e.pointerType === "touch") return;
    deactivate();
  };

  const handlePointerDown = (e) => {
    if (e.pointerType === "touch" || e.pointerType === "pen") {
      activate();
    }
  };

  const handlePointerUp = (e) => {
    if (e.pointerType === "touch" || e.pointerType === "pen") {
      window.setTimeout(() => {
        deactivate();
      }, 180);
    }
  };

  const handleFocus = () => {
    activate();
  };

  const handleBlur = () => {
    deactivate();
  };

  return (
    <Link
      scroll={false}
      href={href}
      {...props}
      onClick={onClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={`relative inline-block h-fit w-fit cursor-pointer text-black duration-500 group  ${className}`}
    >
      <div
        ref={containerRef}
        style={{ perspective: "800px" }}
        className="relative flex transform-gpu flex-col items-start"
      >
        {/* Bottom animated text layer */}
        <div
          ref={baseRef}
          className="flex w-fit items-center justify-between gap-[0.8vw] text-[1.35vw] max-sm:gap-[2vw] max-sm:text-[5vw]"
        >
          <div className="flex w-fit flex-col">
            <div className="flex w-fit overflow-hidden">
              {characters.map((char, i) => (
                <span
                  key={`base-${char}-${i}`}
                  className="flex items-center justify-center overflow-hidden "
                >
                  <span className="char inline-block transform-gpu">
                    {char}
                  </span>
                </span>
              ))}
            </div>

            <div
              className={`h-px w-full origin-right scale-x-0 rounded-full bg-current transition-transform duration-500 ease-[cubic-bezier(0.62,0.05,0.01,0.99)] group-hover:origin-left group-hover:scale-x-100 `}
            />
          </div>

          <div className="relative flex size-[2.5vw]  items-center justify-center max-sm:size-[10vw]">
            <div className="relative z-[2] flex size-[0.9vw] flex-col flex-nowrap overflow-hidden text-black max-sm:group-hover:text-white max-sm:size-[3vw]">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`absolute h-full w-full scale-100 transition-all duration-400 group-hover:-translate-y-full group-hover:translate-x-full group-hover:scale-[0.2] ${isActive
                    ? "-translate-y-full translate-x-full scale-[0.2]"
                    : ""
                  }`}
              >
                <path
                  d="M1.0167 14.838L14.8385 1.01623M3.52479 1.01623H14.8385V12.3299"
                  stroke="currentColor"
                  strokeWidth="2.03206"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`duration-300 ${hover ? hover : "group-hover:stroke-[#ffffff]"
                    } ${isActive && !hover ? "stroke-[#ffffff]" : ""}`}
                />
              </svg>

              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`absolute h-full w-full -translate-x-full translate-y-full scale-[0.2] transition-all duration-400 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:scale-100 ${isActive ? "translate-x-0 translate-y-0 scale-100" : ""
                  }`}
              >
                <path
                  d="M1.0167 14.838L14.8385 1.01623M3.52479 1.01623H14.8385V12.3299"
                  stroke="currentColor"
                  strokeWidth="2.03206"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`stroke-current duration-300 ${hover ? hover : "group-hover:stroke-[#ffffff]"
                    } ${isActive && !hover ? "stroke-[#ffffff]" : ""}`}
                />
              </svg>
            </div>

            <div
              className={`absolute inset-0 h-full w-full origin-center scale-0 rounded-full opacity-0 duration-500 ease-[cubic-bezier(0.62,0.05,0.01,0.99)] group-hover:scale-100 group-hover:opacity-100 ${isActive ? "scale-100 opacity-100" : ""
                } ${bgCircle ? bgCircle : "bg-[#ff5f00]"}`}
            />
          </div>
        </div>

        {/* Top visible text layer */}
        <div
          ref={topRef}
          className="pointer-events-none absolute left-0 top-0 flex text-[1.35vw] max-sm:text-[5vw] mt-[0.2vw] max-sm:mt-[1vw]"
        >
          {characters.map((char, i) => (
            <span
              key={`top-${char}-${i}`}
              className="overflow-hidden"
            >
              <span className="char inline-block font-sans font-normal leading-[1] transform-gpu">
                {char}
              </span>
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export const PrimaryButton = ({ text, href, className, invert, ...props }) => {

  return (
    <>
      <Link
        scroll={false}
        href={href}

        className="w-fit flex group hover:scale-[0.97] duration-400 ease-out relative z-10"
      >
        <div
          className={`w-fit relative h-full px-[3.5vw] overflow-hidden py-[0.7vw] rounded-full border border-white font-medium font-aeonik ${className}`}
        >
          <span className="z-[1] relative">{text}</span>
          <span className="w-full h-full absolute bottom-0 left-0 bg-[#ff5f00] origin-bottom scale-y-0 group-hover:scale-y-100 duration-300 ease-out" />
        </div>
        <div
          className={`w-[3.5vw] h-[3.5vw] p-[1.1vw] relative rounded-full border border-white overflow-hidden ${className}`}
        >
          <span className="w-full h-full absolute bottom-0 left-0 bg-[#ff5f00] origin-bottom scale-y-0 group-hover:scale-y-100 duration-300 ease-out" />
          <Image
            src={"/assets/icons/arrow-diagonal.svg"}
            alt="arrow-diagonal"
            width={50}
            height={50}
            className={`w-full h-full object-contain group-hover:rotate-45 duration-300 ${invert ? "invert" : ""}`}
          />
        </div>
      </Link>
    </>
  );
};

export const MainButton = ({ btnText, href, className }) => {
  // const { navigateTo } = useAnimatedNavigation();

  return (
    <>
      <Link
        scroll={false}
        className={`${styles.cta} ${styles.dark} ${className}`}
        href={href}
      // onClick={(e) => {
      //   e.preventDefault();
      //   navigateTo(link);
      // }}
      >
        <span className={`${styles.ctaDot} aspect-square`}></span>
        <span className={`${styles.ctaText} font-aeonikpro`}>{btnText}</span>
        <span className={styles.ctaArrow}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 16 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M2.343 8h11.314m0 0L8.673 3.016M13.657 8l-4.984 4.984"
            ></path>
          </svg>
        </span>
      </Link>
    </>
  );
};
export const WhiteButton = ({ btnText, link }) => {
  return (
    <>
      <Link
        className={`${styles.cta} ${styles.white} white-button `}
        href={link}
      >
        <span className={styles.ctaDot}></span>
        <span className={styles.ctaText}>{btnText}</span>
        <span className={styles.ctaArrow}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 16 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M2.343 8h11.314m0 0L8.673 3.016M13.657 8l-4.984 4.984"
            ></path>
          </svg>
        </span>
      </Link>
    </>
  );
};
export const WhiteNewButton = ({ btnText, link }) => {
  return (
    <>
      <Link className={`${styles.cta} ${styles.white}  `} href={link}>
        <span className={styles.ctaDot}></span>
        <span className={styles.ctaText}>{btnText}</span>
        <span className={styles.ctaArrow}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 16 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M2.343 8h11.314m0 0L8.673 3.016M13.657 8l-4.984 4.984"
            ></path>
          </svg>
        </span>
      </Link>
    </>
  );
};

export const Arrow = ({ className = "" }) => {
  return (
    <>
      <div className="w-full h-full mt-[-0.04vw] ml-[-0.04vw] flex flex-col flex-nowrap relative overflow-hidden ">
        <svg
          width="13"
          height="13"
          className="w-full h-full absolute group-hover:translate-y-[-100%] group-hover:translate-x-[100%] group-hover:scale-[0.5] duration-300 transition-all scale-[1]"
          viewBox="0 0 13 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.8825 11.312H10.8825V4.12354L2.32388 12.6821L0.909821 11.2681L9.46841 2.70947H2.27994V0.709473H11.8825C12.4346 0.709627 12.8825 1.15728 12.8825 1.70947V11.312Z"
            fill="#1A1A1A"
            className={`fill-current duration-300 `}
          />
        </svg>
        <svg
          width="13"
          height="13"
          className="w-full h-full absolute translate-y-[100%] translate-x-[-100%] group-hover:translate-x-0 group-hover:translate-y-0 duration-300 transition-all scale-[0.5] group-hover:scale-[1]"
          viewBox="0 0 13 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.8825 11.312H10.8825V4.12354L2.32388 12.6821L0.909821 11.2681L9.46841 2.70947H2.27994V0.709473H11.8825C12.4346 0.709627 12.8825 1.15728 12.8825 1.70947V11.312Z"
            fill="#1A1A1A"
            className={`fill-current duration-300 `}
          />
        </svg>
      </div>
    </>
  );
};

// "use client";
// import React, { useRef, useEffect, useMemo } from "react";
// import gsap from "gsap";
// import Link from "next/link";

// export function TextAnimation({
//   text,
//   href,
//   className = "",
//   hover,
//   invert,
//   ...props
// }) {
//   const containerRef = useRef(null);
//   const baseRef = useRef(null);
//   const topRef = useRef(null);
//   const characters = useMemo(
//     () => text.split("").map((char) => (char === " " ? "\u00A0" : char)),
//     [text]
//   );

//   const staggerValue = useMemo(() => {
//     return Math.max(0.01, 0.018 * (10 / characters.length));
//   }, [characters]);

//   useEffect(() => {
//     gsap.set(baseRef.current.querySelectorAll(".char"), {
//       y: 15,
//       rotateX: 90,
//     });
//     gsap.set(topRef.current.querySelectorAll(".char"), { y: 0, rotateX: 0 });
//   }, []);

//   const animateChars = (baseY, topY, rotateX, rotateX2) => {
//     const baseChars = baseRef.current.querySelectorAll(".char");
//     const topChars = topRef.current.querySelectorAll(".char");

//     gsap.to(baseChars, {
//       y: baseY,
//       rotateX: rotateX,
//       duration: 0.6,
//       stagger: staggerValue,
//       ease: "power2.out",
//     });

//     gsap.to(topChars, {
//       y: topY,
//       rotateX: rotateX2,
//       duration: 0.6,
//       stagger: staggerValue,
//       ease: "power2.out",
//     });
//   };

//   const handleMouseEnter = () => {
//     animateChars(0, -15, 0, -90);
//   };

//   const handleMouseLeave = () => {
//     animateChars(15, 0, 90, 0);
//   };

//   return (
//     <>
//       <Link
//         scroll={false}
//         href={href}
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//         className={`relative inline-block h-fit  group cursor-pointer ${hover ? "" : "hover:text-primary"} ${className}`}
//       >
//         <div
//           ref={containerRef}
//           style={{ perspective: "800px" }}
//           className="relative flex flex-col items-start transform-origin-center mb-[.2vw]"
//         >
//           {/* Bottom (Gray) Layer */}
//           <div
//             ref={baseRef}
//             className="flex w-fit justify-between gap-[0.5vw]  "
//           >
//             <div className="w-fit flex flex-col gap-[0.3vw]">
//               <div className="w-fit flex h-fit overflow-hidden">
//                 {characters.map((char, i) => (
//                   <span key={i} className="flex items-center justify-center">
//                     <span className="inline-block  char leading-[1.05] overflow-hidden   text-[#1a1a1a] group-hover:text-[#FF6B00]  font-sans text- font-normal transform-3d">
//                       {char}
//                     </span>
//                   </span>
//                 ))}
//               </div>
//               <div className="!h-[1.2px]  group-hover:w-full duration-500 ease-[cubic-bezier(0.62,0.05,0.01,0.99)] origin-right scale-x-0 group-hover:origin-left group-hover:scale-x-100 transition-transform w-full group-hover:bg-[#FF6B00] bg-[#1a1a1a] rounded-full"></div>
//             </div>
//             <div className="w-[0.9vw] h-[0.8vw] mt-[0.2vw] flex flex-col flex-nowrap relative overflow-hidden max-sm:w-[3vw] max-sm:h-[3vw] ">
//               <svg
//                 width="13"
//                 height="13"
//                 className="w-full h-full absolute group-hover:translate-y-[-100%] group-hover:translate-x-[100%] group-hover:scale-[0.5] duration-500 transition-all scale-[1]"
//                 viewBox="0 0 13 13"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M12.8825 11.312H10.8825V4.12354L2.32388 12.6821L0.909821 11.2681L9.46841 2.70947H2.27994V0.709473H11.8825C12.4346 0.709627 12.8825 1.15728 12.8825 1.70947V11.312Z"
//                   fill="#1A1A1A"
//                   className={`fill-current ${hover ? "" : "group-hover:fill-primary"} duration-300 `}
//                 />
//               </svg>
//               <svg
//                 width="13"
//                 height="13"
//                 className="w-full h-full absolute translate-y-[100%] translate-x-[-100%] group-hover:translate-x-0 group-hover:translate-y-0 duration-500 transition-all scale-[0.5] group-hover:scale-[1]"
//                 viewBox="0 0 13 13"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M12.8825 11.312H10.8825V4.12354L2.32388 12.6821L0.909821 11.2681L9.46841 2.70947H2.27994V0.709473H11.8825C12.4346 0.709627 12.8825 1.15728 12.8825 1.70947V11.312Z"
//                   fill="#1A1A1A"
//                   className={`fill-current ${hover ? "" : "group-hover:fill-primary"} duration-300 `}
//                 />
//               </svg>
//             </div>
//           </div>

//           {/* Top (Red) Layer */}
//           <div
//             ref={topRef}
//             className="absolute top-0 left-0 flex pointer-events-none"
//           >
//             {characters.map((char, i) => (
//               <span key={i} className="">
//                 <span className="inline-block char overflow-hidden  text-[#1a1a1a] group-hover:text-[#FF6B00]  font-sans leading-[1.05] font-normal transform-3d">
//                   {char}
//                 </span>
//               </span>
//             ))}
//           </div>
//         </div>
//       </Link>
//     </>
//   );
// }


export function FooterUnderlineLink({ href = "#", children, className = "", menu = false }) {
  const linkRef = useRef(null);
  const lineRef = useRef(null);

  const ease = "power2.inOut";
  const textShadowClass = "[text-shadow:0_1px_1px_rgba(17,17,17,0.9)]";

  const handleEnter = () => {
    gsap.killTweensOf(lineRef.current);
    gsap.set(lineRef.current, { transformOrigin: "left center" });
    gsap.to(lineRef.current, { scaleX: 1, duration: 0.45, ease });
  };

  const handleLeave = () => {
    gsap.killTweensOf(lineRef.current);
    gsap.set(lineRef.current, { transformOrigin: "right center" });
    gsap.to(lineRef.current, { scaleX: 0, duration: 0.45, ease });
  };

  return (
    <Link
      ref={linkRef}
      href={href}
      className={`relative block w-fit text-16 leading-[1.2] text-white duration-500 ${menu ? "" : `hover:text-[#ff5f00] ${textShadowClass}`} ${className}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <span className={menu ? "" : textShadowClass}>{children}</span>

      <span
        ref={lineRef}
        className={`absolute bottom-[-0.18vw] left-0 h-px w-full scale-x-0 ${menu ? "bg-white" : "bg-[#ff5f00]"}`}
      />
    </Link>
  );
}
