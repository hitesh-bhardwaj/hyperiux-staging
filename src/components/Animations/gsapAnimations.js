/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import gsap from "gsap";
import { useEffect } from "react";



export function fadeUp() {
  // const router = useRouter();
  useEffect(() => {
      const ctx = gsap.context(() => {
        const content = document.querySelectorAll(".fadeup");
        content.forEach((content) => {
          gsap.set(content, { opacity: 0, y: 50 });
          gsap.to(content, {
            scrollTrigger: {
              trigger: content,
              start: "top 90%",
              // markers:true
            },
            opacity: 1,
            y: 0,
            ease: "power3.out",
            duration: 2,
          });
        });
      });
      return () => ctx.revert();
  }, []);
}

export function lineAnim() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const lineDraws = document.querySelectorAll(".lineDraw");
      lineDraws.forEach((lineDraw) => {
        gsap.from(lineDraw, {
          scrollTrigger: {
            trigger: lineDraw,
            start: "top 80%",
          },
          scaleX: 0,
          transformOrigin: "left",
          duration: 1,
          yPercent: 100,
          stagger: 0.07,
          ease: "power3.out",
        });
      });
    });
    return () => ctx.revert();
  }, []);
}
