"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export default function TextFillAnimation({
  text = "",
  textColor = "#111111",
  primaryColor = "#ff6b00",
  dimColor = "#dddddd",
  backgroundColor = "#FBFBFB",
  className = "",
  id = "section-break",
  textSize = "5vw",
  textWidth = "80%",
  containerClassName = "",
  mobileTextSize = "8vw",
  mobileTextWidth = "95%",

  /*
    Use this only if you really want another section to trigger the reveal.
    Otherwise it will reveal when this section itself starts entering.
  */
  revealTrigger = null,
  showMarkers = false,
}) {
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const textEl = textRef.current;

    if (!section || !textEl) return;

    const styleId = `tfa-style-${id}`;

    const existingStyle = document.getElementById(styleId);
    if (existingStyle) existingStyle.remove();

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      @keyframes color-transition-${id} {
        0% { color: ${dimColor}; }
        30% { color: ${primaryColor}; }
        100% { color: ${textColor}; }
      }

      #${id} .split__wrapper .split-chars {
        display: inline-block;
        transition: color 0.4s;
        color: ${dimColor};
        will-change: transform, color;
      }

      #${id} .split__wrapper .split-chars.show {
        animation: color-transition-${id} 0.5s;
        color: ${textColor};
      }

      #${id} .split__wrapper .split-word {
        display: inline-block;
        overflow: hidden;
        vertical-align: top;
      }

      #${id} .tfa-text-wrapper {
        width: ${textWidth};
      }

      #${id} .tfa-heading {
        font-size: ${textSize};
      }

      @media (max-width: 640px) {
        #${id} .tfa-text-wrapper {
          width: ${mobileTextWidth};
        }

        #${id} .tfa-heading {
          font-size: ${mobileTextSize};
        }
      }
    `;

    document.head.appendChild(style);

    let split;
    let revealTween;
    let fillTween;

    const ctx = gsap.context(() => {
      split = new SplitText(textEl, {
        type: "words,chars",
        aria: false,
        tag: "span",
        wordsClass: "split-word",
        charsClass: "split-chars",
      });

      const chars = split.chars;

      gsap.set(chars, {
        yPercent: 110,
        force3D: true,
      });

      /*
        Reveal animation.
        Earlier you used trigger:"#hero".
        That can fail if #hero is not present / mounted / measured correctly.
        This fallback uses this component section itself.
      */
      revealTween = gsap.to(chars, {
        yPercent: 0,
        stagger: 0.025,
        ease: "power1.inOut",
        duration: 1,
        scrollTrigger: {
          trigger:sectionRef.current,
          start:  "top 70%",
          end:  "40% 70%",
          scrub: true,
          // markers: true,
          invalidateOnRefresh: true,
        },
      });

      /*
        Color fill animation.
      */
      fillTween = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.25,
          invalidateOnRefresh: true,
        },
      });

      fillTween.to(
        chars,
        {
          className: "split-chars show",
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.inOut",
        },
        0
      );

      ScrollTrigger.refresh();
    }, section);

    return () => {
      revealTween?.kill();
      fillTween?.kill();

      split?.revert();
      ctx.revert();

      document.getElementById(styleId)?.remove();
    };
  }, [
    id,
    text,
    textColor,
    primaryColor,
    dimColor,
    textSize,
    textWidth,
    mobileTextSize,
    mobileTextWidth,
    revealTrigger,
    showMarkers,
  ]);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`relative h-[200vh] w-full bg-white px-[4vw] max-sm:px-2 ${containerClassName}`}
      style={{ backgroundColor }}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center">
        <div className="split__wrapper tfa-text-wrapper mx-auto h-fit text-center">
          <h2 ref={textRef} className={`tfa-heading ${className}`}>
            {text}
          </h2>
        </div>
      </div>
    </section>
  );
}