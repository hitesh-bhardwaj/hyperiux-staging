"use client";

import React, { forwardRef } from "react";
import Image from "next/image";
import Link from "next/link";

const BottomMenuBar = forwardRef(function BottomMenuBar(
  { open, closeMenu, toggleMenu, dynamicHeadingRef },
  ref
) {
  return (
    <div
      ref={ref}
      className="absolute bottom-0 z-90 flex h-[4vw] w-full items-center justify-between p-[0.4vw] pl-[1vw] pr-[0.5vw] max-sm:h-[15vw] max-sm:pl-[7vw] max-sm:pr-[2vw]"
    >
      <div className="flex h-full w-[2.2vw] items-center gap-[1vw] max-sm:hidden">
        <Link href="/" onClick={closeMenu} className="mt-[0.2vw] h-auto w-full">
          <Image
            src="/hyperiux-icon-white.svg"
            alt="logo"
            className="h-full w-full object-contain"
            width={50}
            height={50}
          />
        </Link>
      </div>

      <button
        type="button"
        className="relative flex h-[3vw] w-[75%] items-center text-center font-display text-white max-sm:w-[75%]"
        onClick={toggleMenu}
      >
        <span className="relative w-full overflow-hidden text-center">
          <p
            ref={dynamicHeadingRef}
            className="dynamic-heading text-[1vw] leading-none text-white max-sm:text-[3.5vw]"
          >
            We are Hyperiux
          </p>
        </span>
      </button>

      <div className="flex h-full items-center justify-end gap-[0.5vw] max-sm:w-full">
        <button
          type="button"
          onClick={toggleMenu}
          className="relative mt-[0.1vw] flex h-[2.7vw] w-[2.7vw] cursor-pointer flex-col items-center justify-center gap-[0.3vw] rounded-[0.7vw] bg-white duration-700 ease-[cubic-bezier(0.625,0.05,0,1)] max-sm:h-[10vw] max-sm:w-[10vw] max-sm:gap-[1vw] max-sm:rounded-[3vw]"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span
                  className={`w-[1.2vw] h-[1.5px] bg-black-1 rounded-full hamburger-line-1 ham-burger-line max-sm:!w-[5vw] ${open ? "opacity-0 duration-300" : " duration-300 delay-200"}`}
                />
                <span
                  className={`w-[1.2vw] h-[1.5px] bg-black-1 rounded-full hamburger-line-2 ham-burger-line max-sm:!w-[5vw] ${open ? "opacity-0 duration-300" : "duration-300 delay-200"}`}
                />
                <span
                  className={`w-[1.2vw] h-[1.5px] bg-black-1 rounded-full hamburger-line-3 ham-burger-line max-sm:!w-[5vw] ${open ? "opacity-0 duration-300" : "duration-300 delay-200"}`}
                />

          <div
            className={[
              "absolute left-[27%] top-[48%] hidden h-full w-full max-sm:block",
              "transition-opacity duration-300",
              open ? "opacity-100 delay-200" : "opacity-0",
            ].join(" ")}
          >
            <span className="absolute h-[1.5px] w-[5.5vw] -rotate-45 rounded-full bg-[#111111]" />
            <span className="absolute h-[1.5px] w-[5.5vw] rotate-45 rounded-full bg-[#111111]" />
          </div>
        </button>
      </div>
    </div>
  );
});

export default BottomMenuBar;