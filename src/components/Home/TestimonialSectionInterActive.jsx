"use client";

import React, { useLayoutEffect, useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import CubeCanvasBackground from "./CubeCanvasBackground";

gsap.registerPlugin(SplitText, ScrollTrigger);

const data = [
  {
    img: "/assets/images/homepage/testimonial/testimonial-image-1.png",
    name: "Paul Lees",
    designation: "CEO , Patronum",
    para: "Enigma Digital's mastery of web design and development is truly unparalleled. Their ability to craft a website that not only captured our essence but also transformed our digital presence is nothing short of miraculous. We are beyond thrilled with the results and can't thank the Enigma team enough for their tireless dedication and creativity. Our collaboration has been a game-changer for Wragby Business Solutions, and we wholeheartedly recommend Enigma Digital to anyone seeking a top-notch digital partner!",
  },
  {
    img: "/assets/images/homepage/testimonial/testimonial-image-2.png",
    name: "Alice Smith",
    designation: "CTO , TechCorp",
    para: "Enigma Digital's mastery of web design and development is truly unparalleled. Their ability to craft a website that not only captured our essence but also transformed our digital presence is nothing short of miraculous. We are beyond thrilled with the results and can't thank the Enigma team enough for their tireless dedication and creativity. Our collaboration has been a game-changer for Wragby Business Solutions, and we wholeheartedly recommend Enigma Digital to anyone seeking a top-notch digital partner!",
  },
  {
    img: "/assets/images/homepage/testimonial/testimonial-image-3.png",
    name: "John Doe",
    designation: "Marketing Lead, BigBiz",
    para: "Enigma Digital's mastery of web design and development is truly unparalleled. Their ability to craft a website that not only captured our essence but also transformed our digital presence is nothing short of miraculous. We are beyond thrilled with the results and can't thank the Enigma team enough for their tireless dedication and creativity. Our collaboration has been a game-changer for Wragby Business Solutions, and we wholeheartedly recommend Enigma Digital to anyone seeking a top-notch digital partner!",
  },
  {
    img: "/assets/images/homepage/testimonial/testimonial-image-4.png",
    name: "Alice Smith",
    designation: "CTO , TechCorp",
    para: "Enigma Digital's mastery of web design and development is truly unparalleled. Their ability to craft a website that not only captured our essence but also transformed our digital presence is nothing short of miraculous. We are beyond thrilled with the results and can't thank the Enigma team enough for their tireless dedication and creativity. Our collaboration has been a game-changer for Wragby Business Solutions, and we wholeheartedly recommend Enigma Digital to anyone seeking a top-notch digital partner!",
  },
  {
    img: "/assets/images/homepage/testimonial/testimonial-image-5.png",
    name: "John Doe",
    designation: "Marketing Lead, BigBiz",
    para: "Enigma Digital's mastery of web design and development is truly unparalleled. Their ability to craft a website that not only captured our essence but also transformed our digital presence is nothing short of miraculous. We are beyond thrilled with the results and can't thank the Enigma team enough for their tireless dedication and creativity. Our collaboration has been a game-changer for Wragby Business Solutions, and we wholeheartedly recommend Enigma Digital to anyone seeking a top-notch digital partner!.",
  },
];

const TestimonialSectionInterActive = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  const intervalRef = useRef(null);
  const imageRef = useRef(null);
  const paraContainerRef = useRef(null);
  const nameRef = useRef(null);
  const desigRef = useRef(null);

  const splitParaRef = useRef(null);
  const splitNameRef = useRef(null);
  const splitDesigRef = useRef(null);

  const counterCurRef = useRef(null);
  const counterNextRef = useRef(null);

  const spanRef = useRef(null);
  const spanRef1 = useRef(null);

  const fontsReadyRef = useRef(false);

  const fmt = (n) => (n < 9 ? `${n}` : `${n}`);

  const awaitFonts = async () => {
    try {
      if (document.fonts?.ready) await document.fonts.ready;
    } catch (_) {
    } finally {
      fontsReadyRef.current = true;
    }
  };

  const animateIn = () => {
    if (!fontsReadyRef.current) return;

    splitParaRef.current?.revert();
    splitNameRef.current?.revert();
    splitDesigRef.current?.revert();

    splitParaRef.current = new SplitText(paraContainerRef.current, {
      type: "lines",
      mask: "lines",
      linesClass: "testimonial-split-line overflow-hidden block",
    });

    splitNameRef.current = new SplitText(nameRef.current, {
      type: "lines",
      mask: "lines",
      linesClass: "testimonial-split-line overflow-hidden block",
    });

    splitDesigRef.current = new SplitText(desigRef.current, {
      type: "lines",
      mask: "lines",
      linesClass: "testimonial-split-line overflow-hidden block",
    });

    const allLines = [
      ...splitNameRef.current.lines,
      ...splitDesigRef.current.lines,
      ...splitParaRef.current.lines,
    ];

    gsap.set(allLines, { yPercent: 100 });

    gsap.to(allLines, {
      yPercent: 0,
      stagger: 0.06,
      ease: "power2.out",
      duration: 0.6,
    });

    gsap.fromTo(
      imageRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" },
    );
  };

  const animateOut = (onComplete) => {
    if (
      !splitParaRef.current ||
      !splitNameRef.current ||
      !splitDesigRef.current
    ) {
      onComplete?.();
      return;
    }

    const allLines = [
      ...splitNameRef.current.lines,
      ...splitDesigRef.current.lines,
      ...splitParaRef.current.lines,
    ];

    gsap.to(allLines, {
      yPercent: -100,
      stagger: 0.06,
      ease: "power2.in",
      duration: 0.5,
      onComplete,
    });

    gsap.to(imageRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.4,
      ease: "power2.in",
    });
  };

  const updateContent = (i) => {
    splitParaRef.current?.revert();
    splitNameRef.current?.revert();
    splitDesigRef.current?.revert();

    paraContainerRef.current.textContent = data[i].para;
    nameRef.current.textContent = data[i].name;
    desigRef.current.textContent = data[i].designation;
  };

  const goToIndex = (i) => {
    if (i === activeIndex) return;

    animateOut(() => {
      updateContent(i);
      setActiveIndex(i);
      animateIn();
    });
  };

  useLayoutEffect(() => {
    let killed = false;

    (async () => {
      await awaitFonts();
      if (killed) return;

      updateContent(activeIndex);
      animateIn();

      intervalRef.current = setInterval(() => {
        const nextIndex = (activeIndex + 1) % data.length;
        goToIndex(nextIndex);
      }, 8000);
    })();

    return () => {
      killed = true;
      clearInterval(intervalRef.current);
      splitParaRef.current?.revert();
      splitNameRef.current?.revert();
      splitDesigRef.current?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!fontsReadyRef.current) return;

    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const nextIndex = (activeIndex + 1) % data.length;
      goToIndex(nextIndex);
    }, 8000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  useEffect(() => {
    if (!counterCurRef.current) return;
    counterCurRef.current.textContent = fmt(activeIndex + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const cur = counterCurRef.current;
    const nxt = counterNextRef.current;
    gsap.fromTo(
      ".testimonial-internal",
      { opacity: 0 },
      {
        opacity: 1,
        scrollTrigger: {
          trigger: "#testimonial",
          start: "30% top",
          end: "60% top",
          scrub: true,
        },
      },
    );

    if (!cur || !nxt) return;

    const nextVal = fmt(activeIndex + 1);

    gsap.killTweensOf([cur, nxt]);
    nxt.textContent = nextVal;

    gsap.set(nxt, {
      yPercent: 100,
      position: "absolute",
      top: 0,
      left: "50%",
    });

    gsap.set(cur, { yPercent: 0 });

    

    gsap.to(cur, {
      yPercent: -100,
      duration: 0.45,
      ease: "power2.out",
      position: "absolute",
      top: 0,
      left: "50%",
    });

    gsap.to(nxt, {
      yPercent: 0,
      duration: 0.45,
      ease: "power2.out",
      onComplete: () => {
        cur.textContent = nextVal;
        gsap.set([cur, nxt], { yPercent: 0 });
      },
    });
  }, [activeIndex]);

  const handleMouseMove = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    if (spanRef.current) {
      spanRef.current.style.top = `${relY}px`;
      spanRef.current.style.left = `${relX}px`;
    }

    if (spanRef1.current) {
      spanRef1.current.style.top = `${relY}px`;
      spanRef1.current.style.left = `${relX}px`;
    }
  };

  const handleNavClick = (newIndex) => {
    if (isNavigating) return;

    setIsNavigating(true);
    goToIndex(newIndex);

    setTimeout(() => setIsNavigating(false), 2000);
  };

  return (
    <section
      className="w-screen h-screen px-[4vw] bg-linear-to-r text-white overflow-hidden z-[7] max-sm:px-[7vw]"
      id="testimonial-section"
      style={{ perspective: "1000px" }}
    >
     
      <div className="absolute inset-0 z-[1] h-screen w-screen overflow-hidden">
        <CubeCanvasBackground />
      </div>

      <div className="w-full h-full flex justify-between pl-[10vw] pt-[18vh] testimonial-content max-sm:flex-col max-sm:h-[75%] max-sm:pl-0 max-sm:pt-[20%] testimonial-internal relative z-[2]">
        <div className="flex flex-col max-sm:order-1 max-sm:flex-row max-sm:gap-[5vw] max-sm:items-center pt-[6%]">
          <Image
            src={data[activeIndex].img}
            ref={imageRef}
            alt="testimonial"
            width={100}
            height={100}
            className="size-[6.5vw] rounded-full max-sm:w-[22vw] max-sm:h-[22vw]"
          />

          <div className="flex flex-col gap-[0.5vw]">
            <p
              ref={nameRef}
              className="text-[3.5vw] font-aeonik font-display leading-[1] mt-[1.5vw] max-sm:text-[8vw] max-sm:mt-0"
            />
            <p ref={desigRef} className="text-[1.2vw] max-sm:text-[4.2vw]" />
          </div>
        </div>

        <div className="flex flex-col gap-[2vw] w-[68%] relative max-sm:w-[90%] max-sm:gap-[10vw]">
          <div className="w-[3vw] h-[3vw] max-sm:w-fit">
            <Image
              src="/assets/icons/quote-commas.png"
              alt="quote icon"
              className="max-sm:w-[9vw] max-sm:h-auto w-full h-full object-contain"
              width={50}
              height={50}
            />
          </div>

          <p
            ref={paraContainerRef}
            className="testimonial-para text-[1.5vw] font-medium leading-[1.6] pr-[4vw] max-sm:text-[4.2vw] max-sm:leading-[1.4] max-sm:pr-0"
          />
        </div>
      </div>

      <div className="absolute left-[5%] w-[2vw] top-[-8.2%] h-full flex flex-col items-center justify-center gap-[0.5vw] testimonial-content max-sm:top-auto max-sm:left-[20%] max-sm:bottom-[-35%] max-sm:-rotate-90 max-sm:gap-[1vw] testimonial-internal z-[5]">
        {data.map((_, i) => (
          <div
            key={i}
            className={`border p-[0.15vw] flex justify-center items-center max-sm:p-[0.5vw] ${
              i === activeIndex ? "border-white" : "border-transparent"
            }`}
          >
            <div
              onClick={() => handleNavClick(i)}
              className={`transition-all cursor-pointer bg-white ${
                i === activeIndex
                  ? "h-[0.8vw] w-[0.8vw] opacity-100 max-sm:h-[2.5vw] max-sm:w-[2.5vw]"
                  : "h-[0.4vw] w-[0.4vw] opacity-50 max-sm:h-[1.5vw] max-sm:w-[1.5vw] max-sm:opacity-25"
              }`}
            />
          </div>
        ))}
      </div>

      

      <div className="w-fit flex gap-[0.7vw] items-center z-[5] absolute bottom-[20%] left-[40%] max-sm:gap-[2vw] max-sm:bottom-[13%] max-sm:right-[7%] testimonial-internal">
        <div
          onClick={() =>
            handleNavClick((activeIndex - 1 + data.length) % data.length)
          }
          onMouseEnter={handleMouseMove}
          onMouseLeave={handleMouseMove}
          className={`size-[3.5vw] rounded-full border border-white p-[1.2vw] hover:bg-white flex justify-center items-center cursor-pointer group transition-all duration-300 ease-in-out overflow-hidden relative menusocials socials max-sm:w-[13vw] max-sm:h-[13vw] max-sm:p-[4vw] ${
            isNavigating ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <svg
            width="13"
            height="13"
            className="w-full h-full object-contain rotate-[-135deg] relative z-[5]"
            viewBox="0 0 13 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.8825 11.312H10.8825V4.12354L2.32388 12.6821L0.909821 11.2681L9.46841 2.70947H2.27994V0.709473H11.8825C12.4346 0.709627 12.8825 1.15728 12.8825 1.70947V11.312Z"
              fill="#ffffff"
              className="fill-current group-hover:fill-[#ff5f00] duration-300 ease-in-out"
            />
          </svg>
          <span ref={spanRef}></span>
        </div>

        <div
          onClick={() => handleNavClick((activeIndex + 1) % data.length)}
          onMouseEnter={handleMouseMove}
          onMouseLeave={handleMouseMove}
          className={`size-[3.5vw] rounded-full border border-white p-[1.2vw] hover:bg-white flex justify-center items-center cursor-pointer group transition-all duration-300 ease-in-out overflow-hidden relative menusocials socials max-sm:w-[13vw] max-sm:h-[13vw] max-sm:p-[4vw] ${
            isNavigating ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <svg
            width="13"
            height="13"
            className="w-full h-full object-contain rotate-[45deg] relative z-[5]"
            viewBox="0 0 13 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.8825 11.312H10.8825V4.12354L2.32388 12.6821L0.909821 11.2681L9.46841 2.70947H2.27994V0.709473H11.8825C12.4346 0.709627 12.8825 1.15728 12.8825 1.70947V11.312Z"
              fill="#ffffff"
              className="fill-current group-hover:fill-[#ff5f00] duration-300 ease-in-out"
            />
          </svg>
          <span ref={spanRef1}></span>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSectionInterActive;
