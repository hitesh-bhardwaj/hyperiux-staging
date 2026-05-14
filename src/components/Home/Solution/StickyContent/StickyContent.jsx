"use client";

import React, { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { LinkButton } from "@/components/Buttons";

gsap.registerPlugin(ScrollTrigger, SplitText);

const DEFAULT_ITEMS = [
  {
    heading: "Development",
    label: "Learn More",
    href: "#",
    paragraph:
      "A human-centred, design-led approach to product development that leverages cutting-edge technologies & agile methodology, committed to putting you on a path to success in the ever-changing technological landscape. We craft digital solutions that are not just functional, but also intuitive and engaging.",
    solutions: [
      "USER EXPERIENCE (UX) DESIGN",
      "USER EXPERIENCE (UX) DESIGN",
      "USER EXPERIENCE (UX) DESIGN",
      "USER EXPERIENCE (UX) DESIGN",
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

function ArrowIcon() {
  return (
    <span className="flex size-[2.25vw] items-center justify-center rounded-full bg-[#ff5f00] text-white max-md:size-[4vw] max-sm:size-[9vw]">
      <svg
        viewBox="0 0 24 24"
        className="size-[1.05vw] max-md:size-[1.8vw] max-sm:size-[4vw]"
        fill="none"
      >
        <path
          d="M7 17L17 7M17 7H8M17 7V16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function StickyContentWrapper({
  items = DEFAULT_ITEMS,
  className = "",
  containerHeight,

  stepGap = 2,
  contentTransitionDuration = 0.8,
  contentDelay = 0.18,

  initialImageScale = 1.18,
  activeImageScale = 1,
  exitImageScale = 1.08,
}) {
  const sectionRef = useRef(null);

  const contentRefs = useRef([]);
  const imageRefs = useRef([]);
  const headingRefs = useRef([]);
  const paragraphRefs = useRef([]);
  const listRefs = useRef([]);
  const buttonRefs = useRef([]);

  contentRefs.current = [];
  imageRefs.current = [];
  headingRefs.current = [];
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

  const addHeadingRef = (el) => {
    if (el && !headingRefs.current.includes(el)) {
      headingRefs.current.push(el);
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
      const lists = listRefs.current;
      const buttons = buttonRefs.current;

      const headingSplits = headingRefs.current.map((el) => {
        return new SplitText(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-heading-line",
        });
      });

      const paragraphSplits = paragraphRefs.current.map((el) => {
        return new SplitText(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-paragraph-line",
        });
      });

      contents.forEach((content, index) => {
        gsap.set(content, {
          autoAlpha: index === 0 ? 1 : 0,
          zIndex: items.length - index,
        });
      });

      headingSplits.forEach((split, index) => {
        gsap.set(split.lines, {
          yPercent: index === 0 ? 0 : 110,
          autoAlpha: 1,
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
          y: index === 0 ? 0 : 24,
        });
      });

      buttons.forEach((button, index) => {
        gsap.set(button, {
          autoAlpha: index === 0 ? 1 : 0,
          y: index === 0 ? 0 : 24,
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

      const totalTimelineDuration = Math.max(1, (items.length - 1) * stepGap);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      items.forEach((_, index) => {
        if (index === items.length - 1) return;

        const currentContent = contents[index];
        const nextContent = contents[index + 1];

        const currentHeadingLines = headingSplits[index]?.lines || [];
        const nextHeadingLines = headingSplits[index + 1]?.lines || [];

        const currentParagraphLines = paragraphSplits[index]?.lines || [];
        const nextParagraphLines = paragraphSplits[index + 1]?.lines || [];

        const currentListChildren = lists[index]?.children || [];
        const nextListChildren = lists[index + 1]?.children || [];

        const currentButton = buttons[index];
        const nextButton = buttons[index + 1];

        const currentImage = images[index];
        const nextImage = images[index + 1];

        const stepStart = index * stepGap;
        const nextStart = stepStart + contentTransitionDuration + contentDelay;

        tl.set(
          nextContent,
          {
            autoAlpha: 1,
          },
          stepStart
        );

        tl.to(
          currentHeadingLines,
          {
            yPercent: -110,
            duration: contentTransitionDuration,
            ease: "power3.inOut",
            stagger: 0.035,
          },
          stepStart
        );

        tl.fromTo(
          nextHeadingLines,
          {
            yPercent: 110,
          },
          {
            yPercent: 0,
            duration: contentTransitionDuration,
            ease: "power3.inOut",
            stagger: 0.035,
          },
          nextStart
        );

        tl.to(
          currentParagraphLines,
          {
            yPercent: -110,
            duration: contentTransitionDuration,
            ease: "power3.inOut",
            stagger: 0.025,
          },
          stepStart + 0.04
        );

        tl.fromTo(
          nextParagraphLines,
          {
            yPercent: 110,
          },
          {
            yPercent: 0,
            duration: contentTransitionDuration,
            ease: "power3.inOut",
            stagger: 0.025,
          },
          nextStart + 0.04
        );

        tl.to(
          currentListChildren,
          {
            autoAlpha: 0,
            y: -22,
            duration: 0.45,
            ease: "power2.inOut",
            stagger: 0.045,
          },
          stepStart + 0.12
        );

        tl.fromTo(
          nextListChildren,
          {
            autoAlpha: 0,
            y: 22,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
            stagger: 0.06,
          },
          nextStart + 0.14
        );

        tl.to(
          currentButton,
          {
            autoAlpha: 0,
            y: -22,
            duration: 0.45,
            ease: "power2.inOut",
          },
          stepStart + 0.18
        );

        tl.fromTo(
          nextButton,
          {
            autoAlpha: 0,
            y: 22,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
          },
          nextStart + 0.22
        );

        tl.to(
          currentContent,
          {
            autoAlpha: 0,
            duration: 0.2,
            ease: "none",
          },
          nextStart + contentTransitionDuration * 0.8
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
        headingSplits.forEach((split) => split.revert());
        paragraphSplits.forEach((split) => split.revert());
      };
    }, sectionRef);

    return () => ctx.revert();
  }, [
    items,
    stepGap,
    contentTransitionDuration,
    contentDelay,
    initialImageScale,
    activeImageScale,
    exitImageScale,
  ]);

  if (!items.length) return null;

  return (
    <section
      ref={sectionRef}
      className={`relative w-screen ${className}`}
      style={{
        height: containerHeight || `${items.length * 100}vh`,
      }}
    >
      <div className="sticky top-[5%] flex h-screen w-screen justify-between overflow-hidden px-[5.4vw] py-[7.1vh] max-lg:flex-col-reverse max-lg:justify-start max-lg:px-[5vw] max-lg:py-[5vh] max-sm:px-[6vw]">
        <div className="relative h-full w-[43%] max-lg:h-[44%] max-lg:w-full">
          {items.map((item, index) => (
            <div
              key={`content-${index}`}
              ref={addContentRef}
              className="absolute inset-0 flex h-full w-full flex-col pt-[0.4vw] max-lg:pt-[3vh]"
            >
              <div className="flex w-full items-end justify-between gap-[2vw]">
                <h3
                  ref={addHeadingRef}
                  className="font-aeonik text-[3vw] font-normal leading-[1] tracking-[-0.045em] text-[#ff5f00] max-lg:text-[5.5vw] max-sm:text-[9vw]"
                >
                  {item.heading}
                </h3>
                <div ref={addButtonRef}>

                  <LinkButton

                    href={item.href || "#"}
                    className="text-[#111111]"
                    hover={"text-[#111111] group-hover:stroke-white"}
                    invert={false}
                    text={"Learn More"}
                  />
                </div>

              </div>

              <p
                ref={addParagraphRef}
                className="mt-[2.2vw] max-w-[40vw] font-aeonik text-[1.22vw] font-normal leading-[1.5] text-[#111111] max-lg:mt-[3vw] max-lg:max-w-[85vw] max-lg:text-[2.8vw] max-sm:mt-[5vw] max-sm:text-[4.4vw]"
              >
                {item.paragraph}
              </p>

              <ul
                ref={addListRef}
                className="mt-[5vw] flex list-none flex-col gap-[1.75vw] pb-[9.7vw] font-aeonik text-[1.12vw] uppercase leading-none tracking-[0.01em] text-[#111111] max-lg:mt-[7vw] max-lg:gap-[2.5vw] max-lg:pb-0 max-lg:text-[2.5vw] max-sm:gap-[4.5vw] max-sm:text-[4vw]"
              >
                {(item.solutions || []).map((solution, solutionIndex) => (
                  <li key={`${solution}-${solutionIndex}`}>
                    <Link href={item.solutionHref || "#"}>{solution}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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