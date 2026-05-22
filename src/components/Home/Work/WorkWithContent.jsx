"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import Link from "next/link";
import { SplitText } from "gsap/SplitText";
import ScrollToPlugin from "gsap/dist/ScrollToPlugin";
import { LinkButton } from "@/components/Buttons";
import { fadeUp, lineAnim } from "@/components/Animations/gsapAnimations";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);

const Work = () => {
  fadeUp();
  lineAnim();

  useEffect(() => {
    let ctx;
    let cancelled = false;

    const cleanupFns = [];

    const init = async () => {
      try {
        await (document.fonts?.ready ?? Promise.resolve());
        if (cancelled) return;

        ctx = gsap.context(() => {
          gsap.from(".work-container", {
            scale: 0.75,
            yPercent: 0,
            rotateX: 20,
            scrollTrigger: {
              trigger: "#work",
              start: "top 80%",
              end: "15% 80%",
              scrub: true,
            },
          });

          const el1 = document.querySelector(".work-2-content-1");
          const el2 = document.querySelector(".work-2-content-2");
          const el3 = document.querySelector(".work-4-content-1");
          const el4 = document.querySelector(".work-4-content-2");

          const workEl1 = el1
            ? new SplitText(el1, { type: "lines", mask: "lines" })
            : null;

          const workEl2 = el2
            ? new SplitText(el2, { type: "lines", mask: "lines" })
            : null;

          const workEl3 = el3
            ? new SplitText(el3, { type: "lines", mask: "lines" })
            : null;

          const workEl4 = el4
            ? new SplitText(el4, { type: "lines", mask: "lines" })
            : null;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: "#work",
              start: "2% top",
              end: "99% bottom",
              scrub: true,
            },
            defaults: { ease: "none" },
          });

          tl.to(".work-1-mockup-container", { xPercent: -104.5, ease: "none" })
            .to(".work-1-mockup", {
              clipPath: "inset(100% 0% 0% 0%)",
              delay: -0.5,
              ease: "none",
            })
            .to(".work-mockup-1-img", { scale: 1.4, delay: -0.5 })
            .from(".work-mockup-2-img", { scale: 1.4, delay: -0.5 })
            .to(".work-1-content", {
              scale: 0.75,
              delay: -0.5,
              opacity: 0.3,
              ease: "none",
            })
            .to(".work-2-content", {
              yPercent: -122,
              delay: -0.4,
              ease: "none",
            })
            .to(".work-1-content", { opacity: 0, duration: 0.1, ease: "none" })
            .to(".work-1-mockup-container", {
              scale: 0.75,
              delay: -0.1,
              opacity: 0.3,
              ease: "none",
              onStart: () =>
                gsap.to(".work-1-mockup-container", { zIndex: 1, duration: 0 }),
              onReverseComplete: () =>
                gsap.to(".work-1-mockup-container", { zIndex: 4, duration: 0 }),
            })
            .to(".work-2-content", {
              xPercent: -104,
              delay: -0.5,
              ease: "none",
              onStart: () =>
                gsap.to(".work-2-content", { zIndex: 4, duration: 0 }),
              onReverseComplete: () =>
                gsap.to(".work-2-content", { zIndex: -1, duration: 0 }),
            })
            .to(".work-2-title", {
              yPercent: -50,
              color: "#ffffff",
              delay: -0.5,
              ease: "power3.inOut",
            })
            .to(".work-2-subtext", {
              yPercent: -110,
              delay: -0.5,
              ease: "power3.inOut",
            })
            .to(".work-2-subtitles", {
              yPercent: -50,
              color: "#ffffff",
              delay: -0.5,
              ease: "power3.inOut",
            })
            .to(".work-2-content", {
              backgroundColor: "#DE051F",
              delay: -0.5,
              ease: "power3.inOut",
            })
            .to(
              workEl1?.lines ?? [],
              { yPercent: -102, ease: "power3.inOut" },
              "<"
            )
            .to(
              ".work-2-content-1-link",
              { zIndex: 0, yPercent: -150, ease: "power3.inOut" },
              "<"
            )
            .from(
              workEl2?.lines ?? [],
              { yPercent: 102, ease: "power3.inOut" },
              "<"
            )
            .from(
              ".work-2-content-2-link",
              { yPercent: 150, opacity: 0, zIndex: 0, ease: "power3.inOut" },
              "<"
            )
            .to(".work-1-mockup-container", { opacity: 0, duration: 0.1 })
            .to(".work-3-mockup-container", {
              yPercent: -122,
              ease: "none",
              delay: -0.5,
            })
            .to(".work-3-mockup-container", {
              xPercent: -104.5,
              ease: "none",
              onStart: () =>
                gsap.to(".work-3-mockup-container", { zIndex: 0, duration: 0 }),
              onReverseComplete: () =>
                gsap.to(".work-3-mockup-container", { zIndex: 1, duration: 0 }),
            })
            .to(".work-3-mockup", {
              clipPath: "inset(100% 0% 0% 0%)",
              delay: -0.5,
              ease: "none",
            })
            .to(".work-mockup-3-img", { scale: 1.4, delay: -0.5 })
            .from(".work-mockup-4-img", { scale: 1.4, delay: -0.5 })
            .to(".work-2-content", {
              scale: 0.75,
              delay: -0.5,
              opacity: 0,
              ease: "none",
              onStart: () =>
                gsap.to(".work-2-content", { zIndex: 0, duration: 0 }),
              onReverseComplete: () =>
                gsap.to(".work-2-content", { zIndex: 4, duration: 0 }),
            })
            .to(".work-4-content", {
              yPercent: -123.5,
              delay: -0.4,
              onStart: () =>
                gsap.to(".work-4-content", { zIndex: -1, duration: 0 }),
              onReverseComplete: () =>
                gsap.to(".work-4-content", { zIndex: 4, duration: 0 }),
            })
            .to(".work-4-content", {
              xPercent: -104,
              ease: "none",
              onStart: () =>
                gsap.to(".work-4-content", { zIndex: 4, duration: 0 }),
              onReverseComplete: () =>
                gsap.to(".work-4-content", { zIndex: -1, duration: 0 }),
            })
            .to(".work-3-mockup-container", {
              scale: 0.75,
              delay: -0.5,
              opacity: 0,
            })
            .to(".work-4-mockup-container", { yPercent: -123.5, delay: -0.4 })
            .to(".work-4-mockup-container", {
              xPercent: -104.5,
              ease: "none",
              onStart: () =>
                gsap.to(".work-4-mockup-container", { zIndex: 4, duration: 0 }),
              onReverseComplete: () =>
                gsap.to(".work-4-mockup-container", {
                  zIndex: -1,
                  duration: 0,
                }),
            })
            .to(".work-4-mockup", {
              clipPath: "inset(100% 0% 0% 0%)",
              delay: -0.5,
              ease: "none",
            })
            .to(".work-mockup-5-img", { scale: 1.4, delay: -0.5 })
            .from(".work-mockup-6-img", { scale: 1.4, delay: -0.5 })
            .to(".work-4-content", {
              backgroundColor: "#ff5e01",
              delay: -1,
              ease: "power3.inOut",
            })
            .to(workEl3?.lines ?? [], {
              yPercent: -102,
              delay: -1.1,
              ease: "power3.inOut",
            })
            .to(
              ".work-4-content-1-link",
              { zIndex: 0, yPercent: -150, ease: "power3.inOut" },
              "<"
            )
            .from(
              workEl4?.lines ?? [],
              { yPercent: 102, ease: "power3.inOut" },
              "<"
            )
            .from(
              ".work-4-content-2-link",
              { yPercent: 100, opacity: 0, zIndex: 0, ease: "power3.inOut" },
              "<"
            )
            .to(".work-4-title", {
              yPercent: -50,
              delay: -1.1,
              ease: "power3.inOut",
            })
            .to(".work-4-subtext", {
              yPercent: -110,
              delay: -1.1,
              ease: "power3.inOut",
            })
            .to(".work-4-subtitles", {
              yPercent: -50,
              delay: -1.1,
              ease: "power3.inOut",
            })
            .to(".work-4-content", { scale: 0.75, delay: -0.5, opacity: 0 })
            .to(".work-5-content", {
              yPercent: -125,
              ease: "none",
              delay: -0.5,
            });

          ScrollTrigger.refresh();

          // --- Robust Idle Snap Logic ---
          let snapDelay = null;
          let snapTween = null;
          let isSnapping = false;
          let lastScrollY = window.scrollY || window.pageYOffset || 0;

          /*
            Existing snap points.
            These are vh-progress values inside the #work section.
          */
          const snapPoints = [12, 111.7, 211.4, 311.2, 411, 495];

          const SNAP_IDLE_DELAY = 1; // 1 second of no scroll activity
          const SNAP_TOLERANCE = 8;

          const getWorkScrollData = () => {
            const section = document.getElementById("work");
            if (!section) return null;

            const rect = section.getBoundingClientRect();
            const sectionTop = window.scrollY + rect.top;
            const sectionHeight = section.offsetHeight;

            const minScroll = sectionTop;
            const maxScroll = sectionTop + sectionHeight - window.innerHeight;

            const currentScroll = window.scrollY || window.pageYOffset || 0;
            const scrollInside = currentScroll - sectionTop;

            const isInsideWork =
              currentScroll > minScroll && currentScroll < maxScroll;

            return {
              section,
              sectionTop,
              sectionHeight,
              minScroll,
              maxScroll,
              currentScroll,
              scrollInside,
              isInsideWork,
            };
          };

          const getNearestSnapPoint = (vhProgress) => {
            return snapPoints.reduce((prev, curr) =>
              Math.abs(curr - vhProgress) < Math.abs(prev - vhProgress)
                ? curr
                : prev
            );
          };

          const snapToNearest = () => {
            if (isSnapping) return;

            const data = getWorkScrollData();
            if (!data || !data.isInsideWork) return;

            const {
              sectionTop,
              currentScroll,
              minScroll,
              maxScroll,
              scrollInside,
            } = data;

            const vhProgress = (scrollInside / window.innerHeight) * 100;
            const nearest = getNearestSnapPoint(vhProgress);

            const rawTargetY = sectionTop + (nearest / 100) * window.innerHeight;

            const targetY = Math.round(
              gsap.utils.clamp(minScroll, maxScroll, rawTargetY)
            );

            if (Math.abs(currentScroll - targetY) < SNAP_TOLERANCE) return;

            isSnapping = true;

            if (snapTween) {
              snapTween.kill();
              snapTween = null;
            }

            snapTween = gsap.to(window, {
              scrollTo: {
                y: targetY,
                autoKill: false,
              },
              duration: 0.75,
              ease: "power3.inOut",
              overwrite: true,
              onComplete: () => {
                window.scrollTo(0, targetY);

                gsap.delayedCall(0.12, () => {
                  isSnapping = false;
                });
              },
              onInterrupt: () => {
                isSnapping = false;
              },
            });
          };

          const scheduleSnap = () => {
            if (snapDelay) {
              snapDelay.kill();
              snapDelay = null;
            }

            if (isSnapping) return;

            const data = getWorkScrollData();

            /*
              Do not schedule snapping outside #work.
              This prevents the page being pulled back after user leaves.
            */
            if (!data || !data.isInsideWork) return;

            snapDelay = gsap.delayedCall(SNAP_IDLE_DELAY, snapToNearest);
          };

          const onScroll = () => {
            const currentY = window.scrollY || window.pageYOffset || 0;

            if (isSnapping) {
              lastScrollY = currentY;
              return;
            }

            const data = getWorkScrollData();

            if (!data || !data.isInsideWork) {
              if (snapDelay) {
                snapDelay.kill();
                snapDelay = null;
              }

              lastScrollY = currentY;
              return;
            }

            /*
              Reset the timer on every real scroll movement.
              Snap only happens after 1s of no movement.
            */
            if (Math.abs(currentY - lastScrollY) > 1) {
              scheduleSnap();
            }

            lastScrollY = currentY;
          };

          window.addEventListener("scroll", onScroll, { passive: true });

          cleanupFns.push(() => {
            window.removeEventListener("scroll", onScroll);

            if (snapDelay) {
              snapDelay.kill();
              snapDelay = null;
            }

            if (snapTween) {
              snapTween.kill();
              snapTween = null;
            }

            isSnapping = false;

            workEl1?.revert();
            workEl2?.revert();
            workEl3?.revert();
            workEl4?.revert();
          });
        });
      } catch {
        // If fonts.ready rejects for some reason, skip waiting.
      }
    };

    init();

    return () => {
      cancelled = true;
      cleanupFns.forEach((fn) => fn && fn());
      ctx?.revert();
    };
  }, []);

  return (
    <section
      className="w-screen h-[600vh]  pt-[7vw] bg-[#fefefe] relative z-2 max-sm:hidden "
      id="work"
      style={{ perspective: "1500px" }}
    >
      <div className="w-full h-screen px-[5vw] flex flex-wrap justify-between gap-[1vw] gap-y-[10vh] sticky top-0 pt-[3%] z-4! work-container overflow-hidden">
        <div className="w-[44vw] h-[83vh] radius bg-[#215CFF] p-[2vw] flex flex-col justify-between pb-[3vw] work-1-content">
          <div className="flex flex-col gap-[2.5vw]">
            <p className="text-[7.5vw] w-[75%] font-aeonik text-white leading-[1.15]">
              Montra
            </p>

            <div className="flex flex-col text-white w-[85%] gap-[2vw] text-[1.35vw]">
              <p>
                We specialize in crafting one-of-a-kind, unforgettable
                experiences that captivate and engage your customers, leaving
                them craving for more.
              </p>

              <div
                data-cursor-color="#1a1a1a"
                data-cursor-text="View"
                data-cursor-size="86px"
                className="w-fit"
              >
                <LinkButton
                  text={"View Project"}
                  href={"#"}
                  bgCircle="bg-white"
                  hover={"text-white group-hover:text-[#ff5f00]"}
                  invert={true}
                  className="text-[1.35vw] text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between text-[1.2vw] text-white">
            <span>2023</span>
            <div className="flex gap-[2.5vw]">
              <span>Web Design</span>
              <span>Branding</span>
              <span>Marketing</span>
            </div>
          </div>
        </div>

        <div className="w-[44vw] h-[83vh] radius overflow-hidden flex justify-center items-center work-1-mockup-container relative z-4">
          <div
            className="w-full h-full absolute z-2 work-1-mockup"
            style={{ clipPath: "inset(0% 0% 0% 0%)" }}
          >
            <Link className="w-full h-full" href={"/mockup-1"}>
              <Image
                quality={100}
                src={"/assets/images/homepage/work/our-work-1.png"}
                alt=""
                className="w-full h-full object-cover work-mockup-1-img"
                width={800}
                height={500}
              />
            </Link>
          </div>

          <div className="w-full h-[83vh] absolute radius flex flex-col justify-between">
            <Link className="w-full h-full" href={"/mockup-2"}>
              <Image
                quality={100}
                src={"/assets/images/homepage/work/our-work-2.png"}
                alt=""
                className="w-full h-full object-cover work-mockup-2-img"
                width={800}
                height={500}
              />
            </Link>
          </div>
        </div>

        <div className="w-[44vw] h-[83vh] radius overflow-hidden bg-[#FFE53F] p-[2vw] flex flex-col justify-between pb-[3vw] work-2-content translate-x-[104%] translate-y-[10%] z-3 text-[#111111]">
          <div className="flex flex-col gap-[2.5vw]">
            <div className="text-[7.5vw] w-full h-[8vw] overflow-hidden font-aeonik leading-[1.15]">
              <div className="flex flex-col work-2-title title">
                <span>Yellow</span>
                <span>Patronum</span>
              </div>
            </div>

            <div className="relative w-full h-fit">
              <div className="flex flex-col w-[85%] gap-[2vw] text-[1.35vw] text-[#111111] absolute top-0">
                <p className="work-2-content-1">
                  We specialize in crafting one-of-a-kind, unforgettable
                  experiences that captivate and engage your customers, leaving
                  them craving for more.
                </p>

                <div className="relative z-2 overflow-hidden">
                  <div
                    className="work-2-content-1-link w-fit"
                    data-cursor-color="#1a1a1a"
                    data-cursor-text="View"
                    data-cursor-size="86px"
                  >
                    <LinkButton
                      text={"View Project"}
                      href={"#"}
                      hover={"text-[#111111] group-hover:stroke-white"}
                      invert={false}
                      className="text-[1.35vw] "
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col w-[85%] gap-[2vw] text-[1.35vw] text-white absolute top-0">
                <p className="work-2-content-2">
                  We specialize in crafting one-of-a-kind, unforgettable
                  experiences that captivate and engage your customers, leaving
                  them craving for more. We specialize in crafting
                  one-of-a-kind, unforgettable experiences that captivate and
                  engage your customers, leaving them craving for more.
                </p>

                <div className="relative z-2 overflow-hidden">
                  <div
                    className="work-2-content-2-link w-fit"
                    data-cursor-color="#1a1a1a"
                    data-cursor-text="View"
                    data-cursor-size="86px"
                  >
                    <LinkButton
                      text={"View Project"}
                      href={"#"}
                      bgCircle={"bg-white"}
                      hover={"text-white group-hover:text-[#ff5f00]"}
                      invert={true}
                      className="text-[1.35vw] text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between text-[1.2vw] work-2-subtitles h-[1.65vw] overflow-hidden">
            <div className="flex flex-col work-2-subtext">
              <span>2024</span>
              <span>2023</span>
            </div>

            <div className="flex gap-[2.5vw]">
              <div className="flex flex-col work-2-subtext">
                <span>Web Design</span>
                <span>Web Design</span>
              </div>
              <div className="flex flex-col work-2-subtext">
                <span>Branding</span>
                <span>Marketing</span>
              </div>
              <div className="flex flex-col work-2-subtext">
                <span>Marketing</span>
                <span>Branding</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[44vw] h-[83vh] radius overflow-hidden flex flex-col justify-between work-3-mockup-container z-1 relative translate-y-[10%]">
          <div
            className="w-full h-full absolute top-0 left-0 z-2 work-3-mockup"
            style={{ clipPath: "inset(0% 0% 0% 0%)" }}
          >
            <Link className="w-full h-full" href={"/mockup-3"}>
              <Image
                quality={100}
                src={"/assets/images/homepage/work/our-work-3.png"}
                alt=""
                className="w-full h-full object-cover work-mockup-3-img"
                width={800}
                height={500}
              />
            </Link>
          </div>

          <div className="w-full h-[83vh] absolute top-0 left-0 radius flex flex-col justify-between">
            <Link className="w-full h-full" href={"/mockup-4"}>
              <Image
                quality={100}
                src={"/assets/images/homepage/work/our-work-4.png"}
                alt=""
                className="w-full h-full object-cover work-mockup-4-img"
                width={800}
                height={500}
              />
            </Link>
          </div>
        </div>

        <div className="w-[44vw] h-[83vh] radius overflow-hidden bg-[#215CFF] p-[2vw] flex flex-col justify-between pb-[3vw] work-4-content translate-x-[104%] translate-y-[-100.5%] z-1">
          <div className="flex flex-col gap-[2.5vw]">
            <div className="text-[7.5vw] w-full h-[8vw] overflow-hidden text-white font-aeonik leading-[1.15]">
              <div className="flex flex-col work-4-title title">
                <span className="text-[7.5vw] block">Montra App</span>
                <span>Monielink</span>
              </div>
            </div>

            <div className="relative w-full h-fit">
              <div className="flex flex-col w-[85%] gap-[2vw] text-[1.35vw] text-white absolute top-0">
                <p className="work-4-content-1">
                  We specialize in crafting one-of-a-kind, unforgettable
                  experiences that captivate and engage your customers, leaving
                  them craving for more.
                </p>

                <div className="relative z-2 overflow-hidden">
                  <div
                    className="work-4-content-1-link w-fit"
                    data-cursor-color="#1a1a1a"
                    data-cursor-text="View"
                    data-cursor-size="86px"
                  >
                    <LinkButton
                      text={"View Project"}
                      href={"#"}
                      bgCircle={"bg-white"}
                      hover={"text-white group-hover:text-[#ff5f00]"}
                      invert={true}
                      className="text-[1.35vw] text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col w-[85%] gap-[2vw] text-[1.35vw] text-white absolute top-0">
                <p className="work-4-content-2">
                  We specialize in crafting one-of-a-kind, unforgettable
                  experiences that captivate and engage your customers, leaving
                  them craving for more. We specialize in crafting
                  one-of-a-kind, unforgettable experiences that captivate and
                  engage your customers, leaving them craving for more.
                </p>

                <div className="relative z-2 overflow-hidden">
                  <div
                    className="work-4-content-2-link"
                    data-cursor-color="#1a1a1a"
                    data-cursor-text="View"
                    data-cursor-size="86px"
                  >
                    <LinkButton
                      text={"View Project"}
                      href={"#"}
                      bgCircle={"bg-white"}
                      hover={"text-white group-hover:text-[#ff5f00]"}
                      invert={true}
                      className="text-[1.35vw] text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between text-[1.2vw] work-4-subtitles h-[1.65vw] text-white overflow-hidden">
            <div className="flex flex-col work-4-subtext">
              <span>2025</span>
              <span>2025</span>
            </div>

            <div className="flex gap-[2.5vw]">
              <div className="flex flex-col work-4-subtext">
                <span>Web Design</span>
                <span>Web Design</span>
              </div>
              <div className="flex flex-col work-4-subtext">
                <span>Branding</span>
                <span>Marketing</span>
              </div>
              <div className="flex flex-col work-4-subtext">
                <span>Marketing</span>
                <span>Branding</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[44vw] h-[83vh] radius overflow-hidden flex flex-col justify-between work-4-mockup-container z-1 relative translate-y-[-100.5%] translate-x-[0%]">
          <div
            className="w-full h-full absolute top-0 left-0 z-2 work-4-mockup"
            style={{ clipPath: "inset(0% 0% 0% 0%)" }}
          >
            <Link className="w-full h-full" href={"/mockup-3"}>
              <Image
                quality={100}
                src={"/assets/images/homepage/work/our-work-5.png"}
                alt=""
                className="w-full h-full object-cover work-mockup-5-img"
                width={800}
                height={500}
              />
            </Link>
          </div>

          <div className="w-full h-[83vh] absolute top-0 left-0 radius flex flex-col justify-between">
            <Link className="w-full h-full" href={"/mockup-4"}>
              <Image
                quality={100}
                src={"/assets/images/homepage/work/our-work-6.png"}
                alt=""
                className="w-full h-full object-cover work-mockup-6-img"
                width={800}
                height={500}
              />
            </Link>
          </div>
        </div>

        <div
          className="w-[44vw] h-[83vh] radius overflow-hidden bg-[#734EFF] translate-x-[104.5%] translate-y-[-211%] work-5-content z-1 group"
          data-cursor-color="#1a1a1a"
          data-cursor-text="View All"
          data-cursor-size="86px"
        >
          <Link
            href={"/portfolio"}
            className="p-[2vw] flex flex-col justify-between pb-[3vw] h-full w-full"
          >
            <div className="text-[7.5vw] w-full h-fit overflow-hidden text-white font-aeonik leading-[1.12]">
              <div className="flex flex-col work-5-title title">
                <span>View All</span>
                <span>Projects</span>
              </div>
            </div>

            <div className="w-full h-fit flex justify-end pr-[1vw] pb-[1vw]">
              <div className="w-[5vw] h-[5vw] group-hover:scale-[0.75] duration-500 ease-out">
                <Image
                  width={40}
                  height={40}
                  src={"/assets/icons/portfolio-arrow.svg"}
                  alt="arrow"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Work;