"use client";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import SubSubMenu from "./SubSubMenu";

const SubMenu = ({ subMenu, setSubMenu, subevents, setsubEvents }) => {
  const menuItems = [
    { label: "Solution", href: "/solutions" },
    { label: "Industry", href: "/industries" },
    { label: "Services", href: "/services" }, // now char-split too
  ];

  const [activeSub, setActiveSub] = useState(null);
  const [subSubMenu, setSubSubMenu] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // all three rows are character rows with the .menu-tags wrapper
      const charRows = gsap.utils.toArray(".menu-tags");

      if (subMenu) {
        gsap.fromTo(
          charRows,
          { opacity: 0, yPercent: 20 },
          {
            opacity: 1,
            yPercent: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.06,
          }
        );

        gsap.from(".sub-menu-arrow", {
          yPercent: 120,
          opacity: 0,
          duration: 0.6,
        });
      } else {
        gsap.to(charRows, {
          opacity: 0,
          yPercent: 10,
          duration: 0.3,
          ease: "power2.in",
          stagger: 0.04,
        });

        gsap.to(".sub-menu-arrow", {
          yPercent: 50,
          opacity: 0,
          duration: 0.3,
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [subMenu]);

  const renderCharRow = (text) => {
    const chars = [...text];
    return (
      <div className="menu-tags relative w-fit h-fit">
        {/* main line */}
        <span className="menu-navs inline-flex text-[1.6vw]">
          {chars.map((ch, i) => (
            <span key={`main-${text}-${i}`} style={{ "--d": `${i * 0.02}s` }}>
              {ch}
            </span>
          ))}
        </span>
        {/* shadow line */}
        <span className="menu-navs-shadow absolute left-0 inline-flex text-[1.6vw]">
          {chars.map((ch, i) => (
            <span key={`shadow-${text}-${i}`} style={{ "--d": `${i * 0.02}s` }}>
              {ch}
            </span>
          ))}
        </span>
      </div>
    );
  };

  return (
    <div
      ref={rootRef}
      className={`w-[35vw] h-[30vw] absolute left-[100%] top-[30%] max-sm:hidden ${
        subevents ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        className="w-full pl-[7vw] flex gap-[5vw]"
        onMouseEnter={() => setSubMenu(true)}
        onMouseLeave={() => {
          setSubMenu(false);
          setSubSubMenu(false);
          setsubEvents(false);
        }}
      >
        <div className="w-fit flex flex-col gap-[0.5vw]">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="font-display w-fit h-fit group"
              onMouseEnter={() => {
                if (index < 2) {
                  setSubSubMenu(true);
                  setActiveSub(index + 1);
                } else {
                  setActiveSub(null);
                  setSubSubMenu(false);
                }
              }}
            >
              <div className="w-fit flex items-center gap-[1vw]">
                {/* All three items are character-split now */}
                {renderCharRow(item.label)}

                {/* Keep arrows only for first two */}
                {index < 2 && (
                  <div className="w-[1.2vw] h-[1.5vw] mt-[0.5vw] arrows overflow-hidden sub-menu-arrow">
                    <div className="w-fit flex flex-nowrap translate-x-[-108%] group-hover:translate-x-[5.5%] group-hover:duration-500 group-hover:ease-in-out gap-[0.5vw] ">
                      <Image
                        src={"/assets/icons/arrow-right.svg"}
                        alt="arrow-right"
                        className="w-full h-full object-contain !rotate-45 !brightness-[26] mt-[0.1vw]"
                        width={40}
                        height={40}
                      />
                      <Image
                        src={"/assets/icons/arrow-right.svg"}
                        alt="arrow-right"
                        className="w-full h-full object-contain !rotate-45 !brightness-[26] mt-[0.1vw]"
                        width={40}
                        height={40}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        <SubSubMenu subSubMenu={subSubMenu} activeSub={activeSub} />
      </div>
    </div>
  );
};

export default SubMenu;
