"use client";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import Link from "next/link";
import React, { useEffect } from "react";

const SubSubMenu = ({ subSubMenu, activeSub }) => {
  const menuItems = ["Design", "Development", "Marketing", "Strategy"];
  const menuItems2 = ["Fintech", "HealthCare", "Education", "Electronics"];

  useEffect(() => {
    let ctx;

    const runSplitText = () => {
      ctx = gsap.context(() => {
        const subSubMenutags = document.querySelectorAll(".menu-sub-sub-tags");
        const subSubMenuEl = new SplitText(subSubMenutags, {
          type: "lines",
          mask: "lines",
        });

        if (subSubMenu && activeSub) {
          gsap.set(subSubMenuEl.lines, { yPercent: 102 });
          gsap.to(subSubMenuEl.lines, {
            yPercent: 0,
            duration: 0.8,
            ease: "power4.out",
          });
        } else {
          if (subSubMenuEl.lines) {
            // gsap.set(subSubMenuEl.lines, { yPercent: 0 });
            gsap.to(subSubMenuEl.lines, {
              yPercent: 102,
              duration: 0.8,
              ease: "power4.out",
            });
          }
        }
      });
    };

    // Ensure fonts are loaded before splitting text
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(runSplitText);
    } else {
      runSplitText();
    }

    return () => ctx && ctx.revert();
  }, [subSubMenu, activeSub]);

  return (
    <div className="w-full flex gap-[5vw]">
      <div className="w-fit flex flex-col gap-[0.5vw]">
        {activeSub == 1 &&
          menuItems.map((label, index) => (
            <Link key={index} href="#" className="font-display w-fit h-fit">
              <div className="w-fit flex items-center gap-[1vw]">
                <div className="relative w-fit h-fit menu-sub-sub-tags">
                  <span className="inline-block text-[1.6vw] menu-navs">
                    {[...label].map((ch, i) => (
                      <span
                        key={`top-${index}-${i}`}
                        style={{ "--d": `${i * 0.015}s` }}
                      >
                        {ch}
                      </span>
                    ))}
                  </span>
                  <span className="inline-block text-[1.6vw] menu-navs-shadow absolute left-0">
                    {[...label].map((ch, i) => (
                      <span
                        key={`shadow-${index}-${i}`}
                        style={{ "--d": `${i * 0.015}s` }}
                      >
                        {ch}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
            </Link>
          ))}

        {activeSub == 2 &&
          menuItems2.map((label, index) => (
            <Link key={index} href="#" className="font-display w-fit h-fit">
              <div className="w-fit flex items-center gap-[1vw]">
                <div className="relative w-fit h-fit menu-sub-sub-tags">
                  <span className="inline-block text-[1.6vw] menu-navs">
                    {[...label].map((ch, i) => (
                      <span
                        key={`top2-${index}-${i}`}
                        style={{ "--d": `${i * 0.015}s` }}
                      >
                        {ch}
                      </span>
                    ))}
                  </span>
                  <span className="inline-block text-[1.6vw] menu-navs-shadow absolute left-0">
                    {[...label].map((ch, i) => (
                      <span
                        key={`shadow2-${index}-${i}`}
                        style={{ "--d": `${i * 0.015}s` }}
                      >
                        {ch}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default SubSubMenu;
