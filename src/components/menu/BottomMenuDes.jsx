"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import SubMenu from "./SubMenu";
import { Facebook, FooterUnderlineLink, Instagram, Linkedin, Twitter } from "../Buttons";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import MobSubMenu from "./MobSubMenu";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import MiniCanvas from "./MiniCanvas";
// const VideoModal = dynamic(() => import("@/components/VideoPlayer"));


const BottomMenuDes = () => {
  const [open, setopen] = useState(false);
  const [bottomEnter, setBottomEnter] = useState(false);
  const [subevents, setsubEvents] = useState(false);
  // const scrollbar = useScrollbar();
  const [subMenu, setSubMenu] = useState(false);
  const [interactive, setInteractive] = useState(false);
  // const { navigateTo } = useAnimatedNavigation();
  const [mobSubMenu, setMobSubMenu] = useState(false);
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  //path change the pointer events will be auto
  useEffect(() => {
    // whenever route changes, reset to false
    setBottomEnter(false);
  }, [pathname]);
  // for interaction of inner menu to prevent glitch
  useEffect(() => {
    let timer;
    if (open) {
      // wait 500ms, then enable pointer events
      timer = setTimeout(() => setInteractive(true), 500);
    } else {
      // instantly disable pointer events
      setInteractive(false);
    }
    return () => clearTimeout(timer);
  }, [open]);
  // splitting of content
  useEffect(() => {
    const ctx = gsap.context(() => {
      const menuNav = document.querySelectorAll(".menu-navs");
      const menuNavShadow = document.querySelectorAll(".menu-navs-shadow");
      document.fonts.ready.then(() => {
        const navEl2 = new SplitText(menuNavShadow, {
          type: "chars",
          mask: "chars",
          charsClass: "nav-char-shadow inline-block",
        });
        const navEl = new SplitText(menuNav, {
          type: "chars",
          mask: "chars",
          charsClass: "nav-char inline-block",
        });
      });
    });
    return () => ctx.revert();
  }, []);

  //animation of open and close
  useGSAP(() => {
    if (open) {
      // scrollbar.__lenis && scrollbar.__lenis.stop();
      const tl = gsap.timeline();
      tl.to(".menu-overlay", {
        opacity: 1,
      });
      const menutags = document.querySelectorAll(".menu-tags");
      document.fonts.ready.then(() => {
        const menuEl = new SplitText(menutags, {
          type: "lines",
          mask: "lines",
        });
        if (globalThis.innerWidth > 1024) {
          gsap.from(menuEl.lines, {
            yPercent: 102,
            stagger: 0.1,
            delay: 0.2,
            duration: "power4.out",
            duration: 0.8,
          });
        } else {
          gsap.from(menuEl.lines, {
            yPercent: 102,
            stagger: 0.02,
            delay: 0.2,
            duration: "power4.out",
            duration: 0.8,
          });
        }
      });
      if (globalThis.innerWidth > 1024) {
        gsap.from(".menu-num", {
          yPercent: 50,
          opacity: 0,
          delay: 0.2,
          stagger: 0.1,
          duration: "power4.out",
          duration: 0.8,
        });
      } else {
        gsap.from(".menu-num", {
          yPercent: 50,
          opacity: 0,
          delay: 0.2,
          stagger: 0.02,
          duration: "power4.out",
          duration: 0.8,
        });
      }
      gsap.from(".menu-socials", {
        yPercent: 50,
        opacity: 0,
        duration: 0.8,
        delay: 0.5,
      });
      gsap.from(".cross-button", {
        // yPercent: 50,
        opacity: 0,
        duration: 0.8,
        delay: 0.5,
      });
      gsap.from(".menu-arrow", {
        yPercent: 50,
        delay: 1,
        opacity: 0,
        duration: 0.5,
        // ease: "power3.inOut",
      });
    } else {
      // scrollbar.__lenis && scrollbar.__lenis.start();
      const tl = gsap.timeline();
      tl.to(".menu-overlay", {
        opacity: 0,
        duration: 0.5,
      });
    }
  }, [open, ]);

  //menu hidden in footer animation
  useGSAP(() => {
    gsap.to("#bottom-menu", {
      // opacity:0,
      scrollTrigger: {
        trigger: "#footer-bottom",
        start: "top 80%",
        end: "top 80%",
        // markers:true,
        onEnter: () => {
          setBottomEnter(true);
          gsap.to("#bottom-menu", {
            opacity: 0,
            display: "hidden",
            pointerEvents: "none",
          });
        },
        onEnterBack: () => {
          setBottomEnter(true);
          gsap.to("#bottom-menu", {
            opacity: 0,
            display: "hidden",
            pointerEvents: "none",
          });
        },
        onLeaveBack: () => {
          setBottomEnter(false);
          gsap.to("#bottom-menu", {
            opacity: 1,
            display: "block",
            pointerEvents: "auto",
          });
        },
      },
    });
  }, []);

  //dynamic content on menu
  const [currentHeading, setCurrentHeading] = useState("");

  // useEffect(() => {
  //   const ctx = gsap.context(() => {
  //     sectionHeadings.forEach(({ id, text }) => {
  //       const triggerEl = document.getElementById(id);
  //       if (!triggerEl) return;

  //       ScrollTrigger.create({
  //         trigger: triggerEl,
  //         start: "top 70%",
  //         end: "bottom 70%",
  //         // markers:true,
  //         onEnter: () => handleHeadingChange(text),
  //         onEnterBack: () => handleHeadingChange(text),
  //         onLeave: () => handleHeadingChange(""),
  //         onLeaveBack: () => handleHeadingChange(""),
  //       });
  //     });
  //   });
  //   return () => ctx.revert();
  // }, []);

  // const handleHeadingChange = (newHeading) => {
  //   const dynamicMenu = document.querySelector(".dynamic-heading");
  //   const headingToSet = newHeading || "We are enigma";
  //   if (newHeading) {
  //     dynamicMenu.textContent = headingToSet;
  //     document.fonts.ready.then(() => {
  //       const dynamicSplit = new SplitText(dynamicMenu, {
  //         type: "words,chars,lines",
  //         mask: "lines",
  //       });

  //       gsap.fromTo(
  //         dynamicSplit.chars,
  //         {
  //           translateY: "200%",
  //         },
  //         {
  //           translateY: "0%",
  //           stagger: 0.01,
  //           duration: 0.8,
  //           ease: "power3.inOut",
  //         }
  //       );
  //     });
  //   } else {
  //     gsap.to(".dynamic-heading", {
  //       translateY: "0%",
  //       duration: 0.5,
  //       ease: "power3.inOut",
  //     });
  //   }
  //   setCurrentHeading(headingToSet);
  // };

  //show reel function
  const handleOpen = () => {
    setIsModalOpen(true);
    // scrollbar.__lenis && scrollbar.__lenis.stop();
  };

  const handleClose = () => {
    setIsModalOpen(false);
    // scrollbar.__lenis && scrollbar.__lenis.start();
  };

  return (
    <>
      <header>
        <div
          className={`fixed bottom-[3%] left-[50%] translate-x-[-50%] flex items-end  z-[400] duration-500 ease-out overflow-hidden text-white transition-all border ${open ? "h-[85vh] w-[80vw] rounded-[50px] border-transparent max-sm:rounded-[7vw] max-sm:w-[88vw] max-sm:h-[75vh]" : "h-[4vw] w-[37vw] bg-black/50 backdrop-blur-sm rounded-[18px]  border-white/30 max-sm:h-[15vw] max-sm:w-[88vw]"} ${bottomEnter ? "!pointer-events-none" : ""}`}
         
          id="bottom-menu"
        >
          <div
            className={`w-full h-[85vh] absolute top-0 flex max-sm:h-[75vh]
        ${open ? "opacity-100 duration-500 " : "opacity-0"} 
        ${interactive ? "pointer-events-auto " : "!pointer-events-none"}`}
          >
            <div className="w-[30%] h-full bg-[#111111] max-sm:hidden">
              {/* <LogoMorph open={open} fill={"fill-[#ff6b00]"} /> */}
              <MiniCanvas isMenuOpen={open}/>
            </div>
            <div className="w-full h-full flex flex-col max-sm:hidden bg-[#ff5f00]">
              <div
                className={`w-full h-full px-[4vw] pt-[3vw] pb-[4vw] menu-right-block relative z-[1] max-sm:px-[7vw] max-sm:pt-[10vw] duration-500 ${mobSubMenu ? "max-sm:opacity-0 max-sm:!pointer-events-none" : "delay-500 max-sm:opacity-100 max-sm:pointer-events-auto"}`}
              >
                <div className="w-full h-[98%]  flex flex-col justify-between ">
                  <div className="flex flex-col w-fit gap-[1.5vw] max-sm:gap-[7vw] ">
                    <div className=" font-display  w-fit h-fit ">
                      <div className=" w-fit flex gap-[1.5vw] items-center max-sm:gap-[3vw]  ">
                        <div className="w-fit text-[1.3vw] inline-block menu-num max-sm:text-[4.2vw] ">
                          01
                        </div>
                        <Link
                          href={"/about"}
                          className="relative w-fit h-fit menu-tags"
                        >
                          <span className="inline-block text-[3.4vw] leading-[1] menu-navs max-sm:text-[10vw]">
                            {["A", "b", "o", "u", "t"].map((ch, i) => (
                              <span
                                key={`top-${i}`}
                                style={{ "--d": `${i * 0.03}s` }}
                              >
                                {ch}
                              </span>
                            ))}
                          </span>
                          <span className="inline-block text-[3.4vw] leading-[1] menu-navs-shadow absolute left-0 top-0 max-sm:text-[10vw]">
                            {["A", "b", "o", "u", "t"].map((ch, i) => (
                              <span
                                key={`shadow-${i}`}
                                style={{ "--d": `${i * 0.03}s` }}
                              >
                                {ch}
                              </span>
                            ))}
                          </span>
                        </Link>
                      </div>
                    </div>
                    <div className="flex gap-[1.5vw] font-display items-center w-fit ">
                      <div className=" w-fit flex gap-[1.5vw] items-center max-sm:gap-[3vw] ">
                        <div className="w-fit text-[1.3vw] inline-block menu-num max-sm:text-[4.2vw] ">
                          02
                        </div>
                        <Link
                          href={"/portfolio"}
                          className="relative w-fit h-fit menu-tags"
                        >
                          <span className="inline-block text-[3.4vw] leading-[1] menu-navs max-sm:text-[10vw]">
                            {["W", "o", "r", "k"].map((ch, i) => (
                              <span
                                key={`top-${i}`}
                                style={{ "--d": `${i * 0.03}s` }}
                              >
                                {ch}
                              </span>
                            ))}
                          </span>
                          <span className="inline-block text-[3.4vw] leading-[1] menu-navs-shadow absolute left-0 top-0 max-sm:text-[10vw]">
                            {["W", "o", "r", "k"].map((ch, i) => (
                              <span
                                key={`shadow-${i}`}
                                style={{ "--d": `${i * 0.03}s` }}
                              >
                                {ch}
                              </span>
                            ))}
                          </span>
                        </Link>
                      </div>
                    </div>
                    <div className="relative w-full">
                      <div
                        className="flex gap-[1.5vw] font-display items-center w-fit "
                        onMouseEnter={() => {
                          if (open) {
                            setSubMenu(true);
                            setsubEvents(true);
                          }
                        }}
                        onMouseLeave={() => {
                          setSubMenu(false);
                          // setsubEvents(false);
                        }}
                      >
                        <div className=" w-fit flex gap-[1.5vw] items-center max-sm:gap-[3vw] relative ">
                          <div className="w-fit text-[1.3vw] inline-block menu-num max-sm:text-[4.2vw]">
                            03
                          </div>
                          <div
                            className="flex items-center gap-[1.2vw] group max-sm:gap-[3vw]"
                            onClick={() => {
                              setMobSubMenu(true);
                            }}
                          >
                            <div className="relative w-fit h-fit menu-tags flex items-center gap-[1vw] ">
                              <span className="inline-block text-[3.4vw] leading-[1] menu-navs max-sm:text-[10vw]">
                                {[
                                  "E",
                                  "x",
                                  "p",
                                  "e",
                                  "r",
                                  "t",
                                  "i",
                                  "s",
                                  "e",
                                ].map((ch, i) => (
                                  <span
                                    key={`top-${i}`}
                                    style={{ "--d": `${i * 0.015}s` }}
                                  >
                                    {ch}
                                  </span>
                                ))}
                              </span>
                              <span className="inline-block text-[3.4vw] leading-[1] menu-navs-shadow absolute left-0 top-0 max-sm:text-[10vw]">
                                {[
                                  "E",
                                  "x",
                                  "p",
                                  "e",
                                  "r",
                                  "t",
                                  "i",
                                  "s",
                                  "e",
                                ].map((ch, i) => (
                                  <span
                                    key={`shadow-${i}`}
                                    style={{ "--d": `${i * 0.015}s` }}
                                  >
                                    {ch}
                                  </span>
                                ))}
                              </span>
                            </div>
                            <div className="w-[1.8vw] h-[2vw] mt-[0.5vw] overflow-hidden menu-arrow max-sm:w-[8vw] max-sm:h-[8vw] max-sm:mt-[3.5vw]">
                              <div className="w-fit flex flex-nowrap translate-x-[-112%] group-hover:translate-x-0 group-hover:duration-500  group-hover:ease-in-out gap-[0.5vw] max-sm:w-[8vw] max-sm:h-[8vw] max-sm:translate-x-[-80%] max-sm:gap-[2vw] ">
                                <Image
                                  src={"/assets/icons/arrow-right.svg"}
                                  alt="arrow-right"
                                  className="w-[1.5vw] h-[1.5vw] object-contain !rotate-[45deg] !brightness-[26]  mt-[0.1vw] max-sm:w-[5vw] max-sm:h-[5vw]"
                                  width={40}
                                  height={40}
                                />
                                <Image
                                  src={"/assets/icons/arrow-right.svg"}
                                  alt="arrow-right"
                                  className="w-[1.5vw] h-[1.5vw] object-contain !rotate-[45deg] !brightness-[26] mt-[0.1vw] max-sm:w-[5vw] max-sm:h-[5vw]"
                                  width={40}
                                  height={40}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <SubMenu
                        subMenu={subMenu}
                        setSubMenu={setSubMenu}
                        subevents={subevents}
                        setsubEvents={setsubEvents}
                      />
                    </div>
                    <div className="flex gap-[1.5vw] font-display items-center w-fit ">
                      <div className=" w-fit flex gap-[1.5vw] items-center max-sm:gap-[3vw] ">
                        <div className="w-fit text-[1.3vw] inline-block menu-num max-sm:text-[4.2vw]">
                          04
                        </div>
                        <Link
                          href={"/careers"}
                          className="relative w-fit h-fit menu-tags"
                        >
                          <span className="inline-block text-[3.4vw] leading-[1] menu-navs max-sm:text-[10vw]">
                            {["C", "a", "r", "e", "e", "r"].map((ch, i) => (
                              <span
                                key={`top-${i}`}
                                style={{ "--d": `${i * 0.02}s` }}
                              >
                                {ch}
                              </span>
                            ))}
                          </span>
                          <span className="inline-block text-[3.4vw] leading-[1] menu-navs-shadow absolute left-0 top-0 max-sm:text-[10vw]">
                            {["C", "a", "r", "e", "e", "r"].map((ch, i) => (
                              <span
                                key={`shadow-${i}`}
                                style={{ "--d": `${i * 0.02}s` }}
                              >
                                {ch}
                              </span>
                            ))}
                          </span>
                        </Link>
                      </div>
                    </div>
                    <div
                      href={"#"}
                      className="flex gap-[1.5vw] font-display items-center w-fit "
                    >
                      <div className=" w-fit flex gap-[1.5vw] items-center max-sm:gap-[3vw] ">
                        <div className="w-fit text-[1.3vw] inline-block menu-num max-sm:text-[4.2vw]">
                          05
                        </div>
                        <Link
                          href={"/"}
                          className="relative w-fit h-fit menu-tags"
                        >
                          <span className="inline-block text-[3.4vw] leading-[1] menu-navs max-sm:text-[10vw]">
                            {["R", "e", "s", "o", "u", "r", "c", "e", "s"].map(
                              (ch, i) => (
                                <span
                                  key={`top-${i}`}
                                  style={{ "--d": `${i * 0.015}s` }}
                                >
                                  {ch}
                                </span>
                              )
                            )}
                          </span>
                          <span className="inline-block text-[3.4vw] leading-[1] menu-navs-shadow absolute left-0 top-0 max-sm:text-[10vw]">
                            {["R", "e", "s", "o", "u", "r", "c", "e", "s"].map(
                              (ch, i) => (
                                <span
                                  key={`shadow-${i}`}
                                  style={{ "--d": `${i * 0.015}s` }}
                                >
                                  {ch}
                                </span>
                              )
                            )}
                          </span>
                        </Link>
                      </div>
                    </div>
                    <div className="flex gap-[1.5vw] font-display items-center w-fit ">
                      <div className=" w-fit flex gap-[1.5vw] items-center max-sm:gap-[3vw] ">
                        <div className="w-fit text-[1.3vw] inline-block menu-num max-sm:text-[4.2vw]">
                          06
                        </div>
                        <Link
                          href={"/contact-us"}
                          className="relative w-fit h-fit menu-tags"
                        >
                          <span className="inline-block text-[3.4vw] leading-[1] menu-navs max-sm:text-[10vw]">
                            {["C", "o", "n", "t", "a", "c", "t"].map(
                              (ch, i) => (
                                <span
                                  key={`top-${i}`}
                                  style={{ "--d": `${i * 0.015}s` }}
                                >
                                  {ch}
                                </span>
                              )
                            )}
                          </span>
                          <span className="inline-block text-[3.4vw] leading-[1] menu-navs-shadow absolute left-0 top-0 max-sm:text-[10vw]">
                            {["C", "o", "n", "t", "a", "c", "t"].map(
                              (ch, i) => (
                                <span
                                  key={`shadow-${i}`}
                                  style={{ "--d": `${i * 0.015}s` }}
                                >
                                  {ch}
                                </span>
                              )
                            )}
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex justify-between pl-[3.2vw] max-sm:hidden">
                    <div className="flex flex-col text-[1.1vw] w-[21%] font-medium menu-socials gap-[0.4vw]">
                       <FooterUnderlineLink href="mailto:hi@hyperiux.com" menu>
                            hi@hyperiux.com
                          </FooterUnderlineLink>
                      <FooterUnderlineLink href="tel:+918745044555" menu>
                            +91 8745044555
                          </FooterUnderlineLink>
                    </div>
                    <div className="flex gap-[1vw] menu-socials">
                      <Facebook
                      href="#"
                        menuSocial={true}
                        className={"group-hover:text-[#ff5f00] hover:bg-white"}
                      />
                      <Twitter
                      href="#"
                        menuSocial={true}
                        className={"group-hover:text-[#ff5f00] hover:bg-white"}
                      />
                      <Linkedin
                      href="#"
                        menuSocial={true}
                        className={"group-hover:text-[#ff5f00] hover:bg-white"}
                      />
                      <Instagram
                      href="#"
                        menuSocial={true}
                        className={"group-hover:text-[#ff5f00] hover:bg-white"}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <MobSubMenu
                mobSubMenu={mobSubMenu}
                setMobSubMenu={setMobSubMenu}
              />
            </div>
            <div
              className={`w-[3.2vw] h-[3.2vw] mt-[0.1vw] bg-white rounded-full  absolute top-[3%] right-[3%] flex items-center justify-center rotate-45 z-[90] cross-button cursor-pointer p-[0.9vw] group max-sm:bottom-[1%] max-sm:right-[2%] max-sm:top-auto max-sm:h-[12vw] max-sm:w-[12vw] max-sm:p-[3vw] max-sm:hidden `}
              onClick={() => {
                
                setopen(false);
              }}
            >
              <Image
                src={"/assets/icons/cross-menu.svg"}
                alt="cross-menu"
                width={30}
                height={30}
                style={{
                  transitionTimingFunction: "cubic-bezier(0.625, 0.05, 0, 1)",
                }}
                className="w-full h-full object-contain group-hover:rotate-[180deg] duration-700"
              />
            </div>
          </div>
          <div
            className={`w-full  flex justify-between items-center p-[0.4vw] pl-[1vw] pr-[0.5vw] h-[4vw] absolute bottom-0 z-[90] duration-300 max-sm:h-[15vw] max-sm:pl-[7vw] max-sm:pr-[2vw] ${open ? "opacity-0 !pointer-events-none max-sm:opacity-100" : ""}`}
          >
            <div
              className={` flex gap-[1vw] h-full items-center duration-300 ${open ? "w-[5%]" : "w-[25%]"} max-sm:hidden`}
            >
              <Link
                href={"/"}
                className="w-full h-auto mt-[0.2vw]"
                onClick={(e) => {
                  e.preventDefault();
                  // navigateTo("/");
                  setopen(false);
                }}
              >
                <Image
                  src="/assets/icons/hyperiux-wordmark.svg"
                  alt="logo"
                  className="w-full h-full object-cover brightness-[20]"
                  width={50}
                  height={50}
                />
              </Link>
            </div>
            <div
              className={` flex justify-end gap-[0.5vw] items-center h-full duration-300 max-sm:w-full  ${open ? "w-[95%] !pointer-events-none " : "w-[90%]"}`}
            >
              {/* <div
                className="text-white w-[65%] h-[3vw] flex items-center relative font-display max-sm:w-[75%]"
                onClick={(e) => {
                  const target = e.currentTarget; 
                  setopen((prev) => !prev);
                  target.style.pointerEvents = "none";
                  setTimeout(() => {
                    if (target) {
                      target.style.pointerEvents = "auto";
                    }
                  }, 700);
                }}
              >
                <div
                  className={`absolute w-fit dynamic-heading max-sm:text-[4.2vw] ${open ? "max-sm:hidden" : ""}`}
                >
                </div>
                <div
                  className={`absolute w-fit dynamic-heading max-sm:text-[4.2vw] hidden max-sm:block ${open ? "opacity-100" : "opacity-0"}`}
                >
                  We Are Enigma
                </div>
              </div> */}

              <div
                className="w-[7vw] h-[2.7vw] rounded-[0.7vw] overflow-hidden mt-[0.1vw] max-sm:hidden"
                onClick={handleOpen}
              >
                <video
                  src="/assets/videos/header-showreel-2.mp4"
                  playsInline
                  loop
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
              </div>

              <div
                onClick={(e) => {
                  setMobSubMenu(false);
                  const target = e.currentTarget; // store before async
                  setopen((prev) => !prev);
                  target.style.pointerEvents = "none";
                  setTimeout(() => {
                    if (target) {
                      target.style.pointerEvents = "auto";
                    }
                  }, 700);
                }}
                style={{
                  transitionTimingFunction: "cubic-bezier(0.625, 0.05, 0, 1)",
                }}
                className={`w-[2.7vw] h-[2.7vw] mt-[0.1vw] bg-white rounded-[0.7vw]  relative flex flex-col gap-[0.3vw] items-center justify-center max-sm:h-[10vw] max-sm:w-[10vw] max-sm:rounded-[3vw] duration-700 max-sm:gap-[1vw] cursor-pointer`}
              >
                <span
                  className={`w-[1.2vw] h-[1.5px] bg-[#111111] rounded-full hamburger-line-1 ham-burger-line max-sm:!w-[5vw] ${open ? "opacity-0 duration-300" : " duration-300 delay-200"}`}
                />
                <span
                  className={`w-[1.2vw] h-[1.5px] bg-[#111111] rounded-full hamburger-line-2 ham-burger-line max-sm:!w-[5vw] ${open ? "opacity-0 duration-300" : "duration-300 delay-200"}`}
                />
                <span
                  className={`w-[1.2vw] h-[1.5px] bg-[#111111] rounded-full hamburger-line-3 ham-burger-line max-sm:!w-[5vw] ${open ? "opacity-0 duration-300" : "duration-300 delay-200"}`}
                />
                <div
                  className={`w-full h-full absolute max-sm:block hidden left-[27%] top-[48%] ${open ? "opacity-100 duration-300 delay-200" : "opacity-0 duration-300"}`}
                >
                  <span className="w-[5.5vw] h-[1.5px] bg-[#111111] rounded-full rotate-[-45deg] absolute" />
                  <span className="w-[5.5vw] h-[1.5px] bg-[#111111] rounded-full rotate-[45deg] absolute" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`fixed inset-0 w-screen h-screen bg-black/50 menu-overlay z-[399] backdrop-blur-md ${open ? "" : " pointer-events-none"} ${bottomEnter ? "pointer-events-none" : ""} `}
          onClick={() => {
            setopen(false);
          }}
        />
        <div className="hidden  fixed top-[3%] left-[5%] z-[500] w-[10vw] h-[10vw]">
          <Image
            src={"/assets/icons/enigma-logo.svg"}
            alt=""
            className="enigma-logo w-full h-full object-contain"
            width={70}
            height={70}
          />
        </div>

        {/* {isModalOpen && (
          <VideoModal
            poster="/assets/images/homepage/showreel-poster.webp"
            isOpen={isModalOpen}
            onClose={handleClose}
            videoSrc="/assets/videos/showreel.mp4"
          />
        )} */}
      </header>
    </>
  );
};

export default BottomMenuDes;

const sectionHeadings = [
  { id: "hero-section", text: "We are Enigma" },
  { id: "hero", text: "We are Enigma" },
  { id: "about", text: "Discover about us" },
  { id: "work", text: "Our magic masterpieces" },
  { id: "work-mobile", text: "Our magic masterpieces" },
  { id: "sectionBreak", text: "We are Enigma" },
  { id: "culture", text: "We will take care of you XD" },
  { id: "what-we", text: "How we define us" },
  { id: "team", text: "The wizardss ✨" },
  { id: "intro", text: "We claim it!" },
  { id: "approach", text: "How we do the Magic ✨" },
  { id: "design-process", text: "Small steps BIGGER impact." },
  { id: "tool-marquee", text: "Ingredients to craft Potions 🧪" },
  { id: "testimonial-cards", text: "They say what they believe" },
  { id: "career-listing", text: "Check if there is something for you" },
  { id: "contact-form", text: "Fill up the form or Book your call " },
  { id: "awards", text: "Proofs that we're Amaaazing" },
  { id: "solutions", text: "What we offer to you.. :)" },
  { id: "industry-sample", text: "Industries we work with" },
  { id: "clients", text: "Logos are cool but clients are more" },
  { id: "testimonials", text: "Yayyy!! they believe us" },
  { id: "blogs", text: "We also geek out" },
  { id: "faqs", text: "Maybe you are concerned.." },
  { id: "footer", text: "Say 'Hi' to Know More About Magic  " },
  { id: "footer-bottom", text: "Scroll More For A New Journey" },
];