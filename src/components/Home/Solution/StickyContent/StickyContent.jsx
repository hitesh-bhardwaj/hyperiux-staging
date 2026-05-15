"use client";

import React, { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import { LinkButton } from "@/components/Buttons";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);

const DEFAULT_ITEMS = [
  {
    heading: "Development",
    label: "Learn More",
    href: "#",
    paragraph:
      "A human-centred, design-led approach to product development that leverages cutting-edge technologies & agile methodology, committed to putting you on a path to success in the ever-changing technological landscape.",
    solutions: [
      "USER EXPERIENCE (UX) DESIGN",
      "USER INTERFACE (UI) DESIGN",
      "RESPONSIVE WEB DESIGN",
      "DESIGN SYSTEMS",
    ],
    image: "/assets/images/homepage/work/our-work-1.png",
    alt: "Development",
  },
  {
    heading: "Design",
    label: "Learn More",
    href: "#",
    paragraph:
      "We shape digital products through user research, interface systems, prototypes, and high-fidelity experience design that feels clear, credible, and conversion-ready.",
    solutions: [
      "PRODUCT DESIGN",
      "UX AUDIT",
      "DESIGN SYSTEMS",
      "INTERFACE DESIGN",
    ],
    image: "/assets/images/homepage/work/our-work-2.png",
    alt: "Design",
  },
];

function getHeadingState(index, activeIndex) {
  const offset = index - activeIndex;

  if (offset < 0) {
    return {
      yPercent: -75 - Math.abs(offset) * 40,
      scale: 0,
      autoAlpha: 0,
      color: "#A1A1A1",
    };
  }

  if (offset === 0) {
    return {
      yPercent: 0,
      scale: 1,
      autoAlpha: 1,
      color: "#ff5f00",
    };
  }

  if (offset === 1) {
    return {
      yPercent: 80,
      scale: 0.42,
      autoAlpha: 1,
      color: "#A1A1A1",
    };
  }

  if (offset === 2) {
    return {
      yPercent: 160,
      scale: 0,
      autoAlpha: 0,
      color: "#A1A1A1",
    };
  }

  return {
    yPercent: 260,
    scale: 0,
    autoAlpha: 0,
    color: "#A1A1A1",
  };
}

export default function StickyContentWrapper({
  items = DEFAULT_ITEMS,
  className = "",
  containerHeight,

  stepGap = 2,
  contentTransitionDuration = 0.8,

  initialImageScale = 1.18,
  activeImageScale = 1,
  exitImageScale = 1.08,

  snapIdleDelay = 1000,
  snapDuration = 0.75,
}) {
  const sectionRef = useRef(null);
  const activeIndexRef = useRef(0);
  const snapTimeoutRef = useRef(null);
  const isSnappingRef = useRef(false);

  const contentRefs = useRef([]);
  const imageRefs = useRef([]);
  const headingStackRefs = useRef([]);
  const paragraphRefs = useRef([]);
  const listRefs = useRef([]);
  const buttonRefs = useRef([]);

  contentRefs.current = [];
  imageRefs.current = [];
  headingStackRefs.current = [];
  paragraphRefs.current = [];
  listRefs.current = [];
  buttonRefs.current = [];

  const addContentRef = (el) => {
    if (el && !contentRefs.current.includes(el)) {
      contentRefs.current.push(el);
    }
  };

  const addImageRef = (el) => {
    if (el && !imageRefs.current.includes(el)) {
      imageRefs.current.push(el);
    }
  };

  const addHeadingStackRef = (el) => {
    if (el && !headingStackRefs.current.includes(el)) {
      headingStackRefs.current.push(el);
    }
  };

  const addParagraphRef = (el) => {
    if (el && !paragraphRefs.current.includes(el)) {
      paragraphRefs.current.push(el);
    }
  };

  const addListRef = (el) => {
    if (el && !listRefs.current.includes(el)) {
      listRefs.current.push(el);
    }
  };

  const addButtonRef = (el) => {
    if (el && !buttonRefs.current.includes(el)) {
      buttonRefs.current.push(el);
    }
  };

  useLayoutEffect(() => {
    if (!sectionRef.current || !items.length) return;

    const ctx = gsap.context(() => {
      const contents = contentRefs.current;
      const images = imageRefs.current;
      const headings = headingStackRefs.current;
      const lists = listRefs.current;
      const buttons = buttonRefs.current;

      const solutionLinkListeners = [];
      const solutionLinkSplits = [];

      const paragraphSplits = paragraphRefs.current.map((el) => {
        return new SplitText(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-paragraph-line",
        });
      });

      const initSolutionLinkHovers = () => {
        const links = sectionRef.current.querySelectorAll(".solutions-link");

        links.forEach((link) => {
          const mainText = link.querySelector(".solutions-link-main");
          const shadowText = link.querySelector(".solutions-link-shadow");
          const line = link.querySelector(".solutions-link-line");

          if (!mainText || !shadowText || !line) return;

          const mainSplit = new SplitText(mainText, {
            type: "chars",
            charsClass: "solutions-char",
          });

          const shadowSplit = new SplitText(shadowText, {
            type: "chars",
            charsClass: "solutions-char",
          });

          solutionLinkSplits.push(mainSplit, shadowSplit);

          gsap.set(mainSplit.chars, {
            yPercent: 0,
            display: "inline-block",
          });

          gsap.set(shadowSplit.chars, {
            yPercent: 0,
            display: "inline-block",
          });

          gsap.set(line, {
            scaleX: 1,
            transformOrigin: "right center",
          });

          const enter = () => {
            gsap.killTweensOf([mainSplit.chars, shadowSplit.chars, line]);

            gsap.to(mainSplit.chars, {
              yPercent: -100,
              duration: 0.5,
              stagger: 0.012,
              ease: "power2.out",
              overwrite: true,
            });

            gsap.to(shadowSplit.chars, {
              yPercent: -100,
              duration: 0.5,
              stagger: 0.012,
              ease: "power2.out",
              overwrite: true,
            });

            gsap
              .timeline()
              .to(line, {
                scaleX: 0,
                duration: 0.35,
                transformOrigin: "right center",
                ease: "power2.inOut",
              })
              .set(line, {
                transformOrigin: "left center",
              })
              .to(line, {
                scaleX: 1,
                duration: 0.4,
                ease: "power2.inOut",
              });
          };

          const leave = () => {
            gsap.killTweensOf([mainSplit.chars, shadowSplit.chars]);

            gsap.to(mainSplit.chars, {
              yPercent: 0,
              duration: 0.5,
              stagger: 0.01,
              ease: "power2.out",
              overwrite: true,
            });

            gsap.to(shadowSplit.chars, {
              yPercent: 0,
              duration: 0.5,
              stagger: 0.01,
              ease: "power2.out",
              overwrite: true,
            });
          };

          link.addEventListener("mouseenter", enter);
          link.addEventListener("mouseleave", leave);

          solutionLinkListeners.push({
            link,
            enter,
            leave,
          });
        });
      };

      const setActiveContentZIndex = (activeIndex) => {
        contents.forEach((content, index) => {
          gsap.set(content, {
            zIndex:
              index === activeIndex
                ? items.length + 100
                : items.length - index,
            pointerEvents: index === activeIndex ? "auto" : "none",
          });
        });
      };

      contents.forEach((content, index) => {
        gsap.set(content, {
          autoAlpha: index === 0 ? 1 : 0,
          zIndex: index === 0 ? items.length + 100 : items.length - index,
          pointerEvents: index === 0 ? "auto" : "none",
        });
      });

      headings.forEach((heading, index) => {
        const state = getHeadingState(index, 0);

        gsap.set(heading, {
          yPercent: state.yPercent,
          scale: state.scale,
          autoAlpha: state.autoAlpha,
          color: state.color,
          transformOrigin: "left center",
          willChange: "transform, opacity, color",
        });
      });

      paragraphSplits.forEach((split, index) => {
        gsap.set(split.lines, {
          yPercent: index === 0 ? 0 : 110,
          autoAlpha: 1,
        });
      });

      lists.forEach((list, index) => {
        const children = list?.children || [];

        gsap.set(children, {
          autoAlpha: index === 0 ? 1 : 0,
          y: index === 0 ? 0 : 16,
        });
      });

      buttons.forEach((button, index) => {
        gsap.set(button, {
          autoAlpha: index === 0 ? 1 : 0,
          y: index === 0 ? 0 : 16,
          pointerEvents: index === 0 ? "auto" : "none",
        });
      });

      images.forEach((image, index) => {
        gsap.set(image, {
          zIndex: items.length - index,
          clipPath: "inset(0% 0% 0% 0%)",
          scale: index === 0 ? activeImageScale : initialImageScale,
          transformOrigin: "center center",
        });
      });

      initSolutionLinkHovers();

      const totalTimelineDuration = Math.max(1, (items.length - 1) * stepGap);

      const snapPoints =
        items.length <= 1
          ? [0]
          : items.map((_, index) => index / (items.length - 1));

      const getClosestSnapIndex = (progress) => {
        return snapPoints.reduce((closestIndex, snapPoint, index) => {
          const currentDistance = Math.abs(progress - snapPoint);
          const closestDistance = Math.abs(progress - snapPoints[closestIndex]);

          return currentDistance < closestDistance ? index : closestIndex;
        }, 0);
      };

      const scheduleManualSnap = (trigger) => {
        if (snapTimeoutRef.current) {
          clearTimeout(snapTimeoutRef.current);
          snapTimeoutRef.current = null;
        }

        if (isSnappingRef.current) return;

        snapTimeoutRef.current = setTimeout(() => {
          if (!trigger || isSnappingRef.current) return;

          const currentScroll = window.scrollY || window.pageYOffset || 0;

          /*
            IMPORTANT:
            Snap only while the user is inside this ScrollTrigger container.
            If user has moved outside the section, do nothing.
          */
          const isInsideContainer =
            currentScroll >= trigger.start && currentScroll <= trigger.end;

          if (!isInsideContainer) return;

          const snapIndex = getClosestSnapIndex(trigger.progress);
          const snapProgress = snapPoints[snapIndex];

          const targetScroll =
            trigger.start + (trigger.end - trigger.start) * snapProgress;

          /*
            Safety check:
            Do not snap outside this container's scroll range.
          */
          const clampedTargetScroll = gsap.utils.clamp(
            trigger.start,
            trigger.end,
            targetScroll
          );

          if (Math.abs(currentScroll - clampedTargetScroll) < 2) {
            activeIndexRef.current = snapIndex;
            setActiveContentZIndex(snapIndex);
            return;
          }

          isSnappingRef.current = true;

          gsap.to(window, {
            scrollTo: clampedTargetScroll,
            duration: snapDuration,
            ease: "power3.inOut",
            overwrite: true,
            onComplete: () => {
              activeIndexRef.current = snapIndex;
              setActiveContentZIndex(snapIndex);

              isSnappingRef.current = false;
            },
            onInterrupt: () => {
              isSnappingRef.current = false;
            },
          });
        }, snapIdleDelay);
      };

      setActiveContentZIndex(0);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "98% bottom",
          scrub: 1,
          invalidateOnRefresh: true,

          onUpdate: (self) => {
            const currentScroll = window.scrollY || window.pageYOffset || 0;

            const isInsideContainer =
              currentScroll >= self.start && currentScroll <= self.end;

            const closestIndex = getClosestSnapIndex(self.progress);

            if (closestIndex !== activeIndexRef.current) {
              activeIndexRef.current = closestIndex;
              setActiveContentZIndex(closestIndex);
            }

            if (!isInsideContainer) {
              if (snapTimeoutRef.current) {
                clearTimeout(snapTimeoutRef.current);
                snapTimeoutRef.current = null;
              }

              return;
            }

            scheduleManualSnap(self);
          },

          onRefresh: (self) => {
            const closestIndex = getClosestSnapIndex(self.progress);

            activeIndexRef.current = closestIndex;
            setActiveContentZIndex(closestIndex);
          },
        },
      });

      items.forEach((_, index) => {
        if (index === items.length - 1) return;

        const currentContent = contents[index];
        const nextContent = contents[index + 1];

        const currentParagraphLines = paragraphSplits[index]?.lines || [];
        const nextParagraphLines = paragraphSplits[index + 1]?.lines || [];

        const currentListChildren = lists[index]?.children || [];
        const nextListChildren = lists[index + 1]?.children || [];

        const currentButton = buttons[index];
        const nextButton = buttons[index + 1];

        const currentImage = images[index];
        const nextImage = images[index + 1];

        const stepStart = index * stepGap;

        /*
          Reduced content gap:
          Next content starts while current content is leaving.
        */
        const nextStart = stepStart + 0.18;
        const contentHideTime = stepStart + contentTransitionDuration + 0.15;

        const nextActiveIndex = index + 1;

        tl.set(
          nextContent,
          {
            autoAlpha: 1,
          },
          stepStart
        );

        tl.to(
          headings,
          {
            yPercent: (i) => getHeadingState(i, nextActiveIndex).yPercent,
            scale: (i) => getHeadingState(i, nextActiveIndex).scale,
            autoAlpha: (i) => getHeadingState(i, nextActiveIndex).autoAlpha,
            color: (i) => getHeadingState(i, nextActiveIndex).color,
            duration: contentTransitionDuration,
            ease: "power2.inOut",
            stagger: 0,
          },
          stepStart
        );

        tl.to(
          currentParagraphLines,
          {
            yPercent: -110,
            duration: 0.55,
            ease: "power3.inOut",
            stagger: 0.0,
          },
          stepStart
        );

        tl.fromTo(
          nextParagraphLines,
          {
            yPercent: 110,
          },
          {
            yPercent: 0,
            duration: 0.6,
            ease: "power3.inOut",
            stagger: 0.0,
          },
          nextStart - 0.1
        );

        tl.to(
          currentListChildren,
          {
            autoAlpha: 0,
            y: -16,
            duration: 0.32,
            ease: "power2.inOut",
            stagger: 0.01,
          },
          stepStart + 0.04
        );

        tl.fromTo(
          nextListChildren,
          {
            autoAlpha: 0,
            y: 16,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.38,
            ease: "power2.out",
            stagger: 0.01,
          },
          nextStart + 0.08
        );

        tl.to(
          currentButton,
          {
            autoAlpha: 0,
            y: -16,
            pointerEvents: "none",
            duration: 0.32,
            ease: "power2.inOut",
          },
          stepStart + 0.06
        );

        tl.fromTo(
          nextButton,
          {
            autoAlpha: 0,
            y: 16,
            pointerEvents: "none",
          },
          {
            autoAlpha: 1,
            y: 0,
            pointerEvents: "auto",
            duration: 0.38,
            ease: "power2.out",
          },
          nextStart + 0.1
        );

        tl.to(
          currentContent,
          {
            autoAlpha: 0,
            duration: 0.1,
            ease: "none",
          },
          contentHideTime
        );

        tl.to(
          currentImage,
          {
            clipPath: "inset(0% 0% 100% 0%)",
            scale: exitImageScale,
            duration: stepGap,
            ease: "none",
          },
          stepStart
        );

        tl.to(
          nextImage,
          {
            scale: activeImageScale,
            duration: stepGap,
            ease: "none",
          },
          stepStart
        );
      });

      tl.duration(totalTimelineDuration);

      ScrollTrigger.refresh();

      return () => {
        if (snapTimeoutRef.current) {
          clearTimeout(snapTimeoutRef.current);
          snapTimeoutRef.current = null;
        }

        isSnappingRef.current = false;

        paragraphSplits.forEach((split) => split.revert());

        solutionLinkListeners.forEach(({ link, enter, leave }) => {
          link.removeEventListener("mouseenter", enter);
          link.removeEventListener("mouseleave", leave);
        });

        solutionLinkSplits.forEach((split) => split?.revert());
      };
    }, sectionRef);

    return () => ctx.revert();
  }, [
    items,
    stepGap,
    contentTransitionDuration,
    initialImageScale,
    activeImageScale,
    exitImageScale,
    snapIdleDelay,
    snapDuration,
  ]);

  if (!items.length) return null;

  return (
    <section
      ref={sectionRef}
      className={`relative w-screen ${className}`}
      style={{
        height: containerHeight || `${items.length * 70}vh`,
      }}
    >
      <div className="sticky top-[5%] flex h-screen w-screen justify-between overflow-hidden px-[5.4vw] py-[7.1vh] max-lg:flex-col-reverse max-lg:justify-start max-lg:px-[5vw] max-lg:py-[5vh] max-sm:px-[6vw]">
        <div className="relative h-full w-[45%] max-lg:h-[44%] max-lg:w-full">
          <div className="absolute left-0 top-0 z-5 flex w-full items-start justify-between gap-[2vw]">
            <div className="relative h-[9vw] w-[70%] overflow-visible max-lg:h-[13vw] max-sm:h-[22vw]">
              {items.map((item, index) => (
                <h3
                  key={`heading-${index}`}
                  ref={addHeadingStackRef}
                  className="absolute left-0 top-0 ml-[-0.2vw] whitespace-nowrap font-aeonik text-[3.5vw] font-normal leading-none tracking-[-0.045em] max-lg:text-[5.5vw] max-sm:text-[9vw]"
                >
                  {item.heading}
                </h3>
              ))}
            </div>

            <div className="relative mt-[0.4vw] min-h-[3vw] min-w-[10vw] shrink-0 max-sm:min-h-[10vw] max-sm:min-w-[32vw]">
              {items.map((item, index) => (
                <div
                  key={`button-${index}`}
                  ref={addButtonRef}
                  className="absolute right-0 top-0"
                >
                  <LinkButton
                    href={item.href || "#"}
                    className="text-[#111111]"
                    hover="text-[#111111] group-hover:stroke-white"
                    invert={false}
                    text={item.label || "Learn More"}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-full pt-[11vw] max-lg:pt-[5vw] max-sm:pt-[28vw]">
            {items.map((item, index) => (
              <div
                key={`content-${index}`}
                ref={addContentRef}
                className="absolute inset-x-0 top-[8vw] flex h-[calc(100%-11vw)] w-full flex-col max-lg:top-[5vw] max-lg:h-[calc(100%-16vw)] max-sm:top-[28vw] max-sm:h-[calc(100%-28vw)]"
              >
                <div
                  ref={addParagraphRef}
                  className="max-w-[40vw] font-aeonik text-[1.22vw] font-normal leading-normal text-[#111111] max-lg:max-w-[85vw] max-lg:text-[2.8vw] max-sm:text-[4.4vw]"
                dangerouslySetInnerHTML={{__html:item.paragraph}}/>

                <div
                  ref={addListRef}
                  className="mt-[3vw] flex flex-wrap gap-x-[3vw] gap-y-[1.7vw] pb-[9.7vw] font-aeonik text-[#111111] max-lg:mt-[7vw] max-lg:gap-x-[6vw] max-lg:gap-y-[2.8vw] max-lg:pb-0 max-sm:gap-y-[4vw]"
                >
                  {(item.solutions || []).map((solution, solutionIndex) => {
                    const label =
                      typeof solution === "string"
                        ? solution
                        : solution?.label || "";

                    const href =
                      typeof solution === "string"
                        ? item.solutionHref || "#"
                        : solution?.href || item.solutionHref || "#";

                    return (
                      <Link
                        key={`${label}-${solutionIndex}`}
                        href={href}
                        className="solutions-link relative h-[1.5vw] w-[43%] text-current max-lg:h-[3.2vw] max-sm:h-[5.5vw] max-sm:w-full"
                      >
                        <div className="relative h-[1.1vw] overflow-hidden max-lg:h-[2.5vw] max-sm:h-[4.7vw]">
                          <p className="solutions-link-main font-aeonik text-[0.9vw] uppercase leading-[1.1] tracking-[0.01em] max-lg:text-[2.2vw] max-sm:text-[3.8vw]">
                            {label}
                          </p>

                          <p className="solutions-link-shadow absolute left-0 top-full font-aeonik text-[0.9vw] uppercase leading-[1.1] tracking-[0.01em] max-lg:text-[2.2vw] max-sm:text-[3.8vw]">
                            {label}
                          </p>
                        </div>

                        <span className="solutions-link-line mt-[0.3vw] block h-px w-full bg-current max-sm:mt-[1vw]" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-[90%] w-[45%] overflow-hidden rounded-[2.4vw] max-lg:mt-[3vh] max-lg:h-[37%] max-lg:w-full max-lg:rounded-[3.5vw] max-sm:rounded-[5vw]">
          {items.map((item, index) => (
            <div
              key={`image-${index}`}
              ref={addImageRef}
              className="absolute inset-0 h-full w-full overflow-hidden rounded-[2.4vw] max-lg:rounded-[3.5vw] max-sm:rounded-[5vw]"
            >
              {item.renderImage ? (
                item.renderImage(item, index)
              ) : (
                <Image
                  src={item.image}
                  alt={item.alt || `sticky-image-${index + 1}`}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1024px) 90vw, 50vw"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}