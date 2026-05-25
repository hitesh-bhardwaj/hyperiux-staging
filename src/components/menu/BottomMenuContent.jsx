"use client";

import React, { forwardRef } from "react";
import Image from "next/image";

import MiniCanvas from "./MiniCanvas";
import MobSubMenu from "./MobSubMenu";
import MainMenuList from "./MainMenuList";
import CircularButton from "../Buttons/CircularButton";
import { FooterUnderlineLink } from "../Buttons";

const BottomMenuContent = forwardRef(function BottomMenuContent(
  {
    open,
    mobSubMenu,
    setMobSubMenu,
    subMenu,
    setSubMenu,
    subevents,
    setSubEvents,
    activeMenuIndex,
    setActiveMenuIndex,
    resolvedMenuIndex,
    closeMenu,
  },
  ref
) {
  return (
    <div
      ref={ref}
      className="absolute top-0 flex h-[85vh] w-full opacity-0 pointer-events-none max-sm:h-[75vh]"
    >
      <div className="h-full w-[30%] bg-[#111111] max-sm:hidden">
        <MiniCanvas isMenuOpen={open} />
      </div>

      <div className="flex h-full w-full flex-col bg-[#ff5f00]">
        <div
          className={[
            "menu-right-block relative z-1 h-full w-full px-[4vw] pb-[4vw] pt-[3vw]",
            "transition-opacity duration-500 max-sm:px-[7vw] max-sm:pt-[10vw]",
            mobSubMenu
              ? "max-sm:pointer-events-none max-sm:opacity-0"
              : "max-sm:pointer-events-auto max-sm:opacity-100",
          ].join(" ")}
        >
          <div className="flex h-[98%] w-full flex-col justify-between">
            <MainMenuList
              open={open}
              subMenu={subMenu}
              setSubMenu={setSubMenu}
              subevents={subevents}
              setSubEvents={setSubEvents}
              setMobSubMenu={setMobSubMenu}
              activeMenuIndex={activeMenuIndex}
              setActiveMenuIndex={setActiveMenuIndex}
              resolvedMenuIndex={resolvedMenuIndex}
              closeMenu={closeMenu}
            />

            <div className="flex w-full justify-between pl-[3.2vw] max-sm:hidden">
              <div className="menu-socials flex w-[21%] flex-col gap-[0.4vw] text-[1.1vw] font-medium">
                <FooterUnderlineLink href="mailto:hi@hyperiux.com" menu>
                  hi@hyperiux.com
                </FooterUnderlineLink>

                <FooterUnderlineLink href="tel:+918178026136" menu>
                  +91 8178 026 136
                </FooterUnderlineLink>
              </div>

              <div className="menu-socials flex gap-[1vw]">
                <CircularButton
                  variant="facebook"
                  href="#"
                  menuSocial={true}
                  className="hover:bg-white group-hover:text-[#ff5f00]"
                />

                <CircularButton
                  variant="twitter"
                  href="#"
                  menuSocial={true}
                  className="hover:bg-white group-hover:text-[#ff5f00]"
                />

                <CircularButton
                  variant="linkedin"
                  href="#"
                  menuSocial={true}
                  className="hover:bg-white group-hover:text-[#ff5f00]"
                />

                <CircularButton
                  variant="instagram"
                  href="#"
                  menuSocial={true}
                  className="hover:bg-white group-hover:text-[#ff5f00]"
                />
              </div>
            </div>
          </div>
        </div>

        <MobSubMenu mobSubMenu={mobSubMenu} setMobSubMenu={setMobSubMenu} />
      </div>

      <button
        type="button"
        className="cross-button group absolute right-[3%] top-[3%] z-90 mt-[0.1vw] flex h-[3.2vw] w-[3.2vw] rotate-45 cursor-pointer items-center justify-center rounded-full bg-white p-[0.9vw] max-sm:hidden"
        onClick={closeMenu}
        aria-label="Close menu"
      >
        <Image
          src="/assets/icons/cross-menu.svg"
          alt="cross-menu"
          width={30}
          height={30}
          className="h-full w-full object-contain duration-700 group-hover:rotate-180"
        />
      </button>
    </div>
  );
});

export default BottomMenuContent;