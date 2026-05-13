"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

gsap.registerPlugin(MorphSVGPlugin);

/*
  BEFORE shapes are intentionally collapsed/compact versions.
  AFTER shapes are your final SVG paths.
*/

const BEFORE_PATHS = [
  {
    d: "M4.51489 0H4.51489V28.5943H4.51489V0Z",
    type: "fill",
  },
  {
    d: "M52.6746 64.7134H52.6746V36.1192H52.6746V64.7134Z",
    type: "fill",
  },
  {
    d: "M0.0195312 50.4163V50.4163H9.0493V50.4163L21.5405 50.4163V50.4163L0.0195312 50.4163Z",
    type: "fill",
  },
  {
    d: "M57.3579 14.2972V14.2972H57.3579V14.2972L34.332 14.2972V14.2972L57.3579 14.2972Z",
    type: "fill",
  },
  {
    d: "M28.1616 32.2063L28.1616 32.2063M28.1616 32.2063L28.1616 32.2063M28.1616 32.2063V32.2063",
    type: "stroke",
  },
];

const AFTER_PATHS = [
  {
    d: "M0 0H9.02977V28.5943H0V0Z",
    className: "logo-part logo-part-1",
    type: "fill",
    origin: "top center",
    reveal: "scaleY",
  },
  {
    d: "M57.1895 64.7134H48.1597V36.1192H57.1895V64.7134Z",
    className: "logo-part logo-part-2",
    type: "fill",
    origin: "bottom center",
    reveal: "scaleY",
  },
  {
    d: "M0.0195312 36.1192V64.7135H9.0493V42.139L21.5405 37.4737V28.7449L0.0195312 36.1192Z",
    className: "logo-part logo-part-3",
    type: "fill",
    origin: "left center",
    reveal: "scaleX",
  },
  {
    d: "M48.1777 22.5746V0.00012207H57.3579V28.5944L34.332 37.8697V28.5944L48.1777 22.5746Z",
    className: "logo-part logo-part-4",
    type: "fill",
    origin: "right center",
    reveal: "scaleX",
  },
  {
    d: "M21.9912 29.0459L28.4868 26.8346C28.8573 26.7085 29.2624 26.7316 29.6161 26.8992L34.7834 29.3469M21.9912 29.0459L28.1616 32.2063M21.9912 29.0459V37.1727L28.1616 40.0321M34.7834 29.3469L28.1616 32.2063M34.7834 29.3469C34.7834 32.3443 34.7834 34.1753 34.7834 37.1727L28.1616 40.0321M28.1616 32.2063V40.0321",
    className: "logo-part logo-part-5",
    type: "stroke",
    origin: "center center",
    reveal: "stroke",
  },
];

export default function LogoMorph({
  open,
  fill = "",
  color = "#FF5F00",
  className = "",
}) {
  const pathsRef = useRef([]);
  const timelineRef = useRef(null);

  useEffect(() => {
    const paths = pathsRef.current.filter(Boolean);
    if (!paths.length) return;

    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    const ctx = gsap.context(() => {
      const fillPaths = paths.filter((path, index) => {
        return AFTER_PATHS[index]?.type === "fill";
      });

      const strokePath = paths[4];

      if (open) {
        paths.forEach((path, index) => {
          const after = AFTER_PATHS[index];
          const before = BEFORE_PATHS[index];

          gsap.set(path, {
            attr: { d: before.d },
            opacity: 1,
            transformOrigin: after.origin,
          });

          if (after.type === "fill") {
            gsap.set(path, {
              scaleX: after.reveal === "scaleX" ? 0 : 1,
              scaleY: after.reveal === "scaleY" ? 0 : 1,
            });
          }
        });

        if (strokePath) {
          const length = strokePath.getTotalLength();

          gsap.set(strokePath, {
            opacity: 0,
            strokeDasharray: length,
            strokeDashoffset: length,
          });
        }

        const tl = gsap.timeline();

        tl.to(fillPaths, {
          scaleX: 1,
          scaleY: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.inOut",
        });

        tl.to(
          fillPaths,
          {
            duration: 0.85,
            stagger: 0.06,
            ease: "power4.inOut",
            morphSVG: (index) => AFTER_PATHS[index].d,
          },
          0.15
        );

        if (strokePath) {
          tl.to(
            strokePath,
            {
              opacity: 1,
              duration: 0.2,
              ease: "power2.out",
            },
            0.45
          );

          tl.to(
            strokePath,
            {
              duration: 0.9,
              ease: "power4.inOut",
              morphSVG: AFTER_PATHS[4].d,
              strokeDashoffset: 0,
            },
            0.55
          );
        }

        timelineRef.current = tl;
      } else {
        const tl = gsap.timeline();

        if (strokePath) {
          const length = strokePath.getTotalLength();

          tl.to(strokePath, {
            strokeDashoffset: length,
            opacity: 0,
            duration: 0.45,
            ease: "power3.inOut",
          });
        }

        tl.to(
          fillPaths,
          {
            duration: 0.55,
            stagger: 0.04,
            ease: "power3.inOut",
            morphSVG: (index) => BEFORE_PATHS[index].d,
          },
          0
        );

        tl.to(
          fillPaths,
          {
            scaleX: (index) =>
              AFTER_PATHS[index].reveal === "scaleX" ? 0 : 1,
            scaleY: (index) =>
              AFTER_PATHS[index].reveal === "scaleY" ? 0 : 1,
            duration: 0.45,
            stagger: 0.04,
            ease: "power3.inOut",
          },
          0.2
        );

        timelineRef.current = tl;
      }
    });

    return () => {
      ctx.revert();

      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, [open]);

  return (
    <section className={`w-full h-[50%] flex items-center justify-center ${className}`}>
      <div className="w-[5vw] h-auto relative max-sm:w-[18vw]">
        <svg
          width="58"
          height="65"
          viewBox="0 0 58 65"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="after-logo w-full h-full"
        >
          {AFTER_PATHS.map((path, index) => {
            const isStroke = path.type === "stroke";

            return (
              <path
                key={index}
                ref={(el) => {
                  pathsRef.current[index] = el;
                }}
                d={path.d}
                className={`${path.className} ${fill}`}
                fill={isStroke ? "none" : color}
                stroke={isStroke ? color : "none"}
                strokeWidth={isStroke ? "0.902977" : undefined}
                strokeLinecap={isStroke ? "round" : undefined}
                strokeLinejoin={isStroke ? "round" : undefined}
              />
            );
          })}
        </svg>
      </div>
    </section>
  );
}