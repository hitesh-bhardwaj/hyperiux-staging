"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import ListingGrid from "./ListingGrid";
import ListingList from "./ListingList";

const listingItems = [
  {
    title: "Monielink",
    year: "2023",
    image: "/assets/images/portfolio/monielink.png",
    tags: ["Web Design", "Branding", "Marketing"],
    shutterColor: "#ff5f00",
    textColor: "#ffffff",
  },
  {
    title: "Montra",
    year: "2023",
    image: "/assets/images/portfolio/montra.png",
    tags: ["Web Design", "Branding", "Marketing"],
    shutterColor: "#215CFF",
    textColor: "#ffffff",
  },
  {
    title: "Yellow",
    year: "2023",
    image: "/assets/images/portfolio/yellow.png",
    tags: ["Branding", "Design"],
    shutterColor: "#facc15",
    textColor: "#111111",
  },
  {
    title: "Patronum",
    year: "2023",
    image: "/assets/images/portfolio/patronum.png",
    tags: ["Marketing", "Strategy"],
    shutterColor: "#215CFF",
    textColor: "#ffffff",
  },
  {
    title: "GCM",
    year: "2023",
    image: "/assets/images/portfolio/gcm.png",
    tags: ["Branding", "Design"],
    shutterColor: "#ef4444",
    textColor: "#ffffff",
  },
  {
    title: "DMTCA",
    year: "2023",
    image: "/assets/images/portfolio/dmtca.png",
    tags: ["Marketing", "Strategy"],
    shutterColor: "#E0D4C6",
    textColor: "#111111",
  },
  {
    title: "Hiveminds",
    year: "2023",
    image: "/assets/images/portfolio/hiveminds.png",
    tags: ["Branding", "Design"],
    shutterColor: "#124BD5",
    textColor: "#ffffff",
  },
  {
    title: "Kedarkala",
    year: "2023",
    image: "/assets/images/portfolio/kedarkala.png",
    tags: ["Marketing", "Strategy"],
    shutterColor: "#DED7CD",
    textColor: "#111111",
  },
  {
    title: "QuickX",
    year: "2023",
    image: "/assets/images/portfolio/quickx.png",
    tags: ["Branding", "Design"],
    shutterColor: "#841AFF",
    textColor: "#ffffff",
  },
];

const Listing = () => {
  const [view, setView] = useState("grid");
  const contentRef = useRef(null);
  const isAnimatingRef = useRef(false);

  const changeView = (nextView) => {
    if (nextView === view || isAnimatingRef.current) return;

    const content = contentRef.current;

    if (!content) {
      setView(nextView);
      return;
    }

    isAnimatingRef.current = true;

    gsap.killTweensOf(content);

    gsap.to(content, {
      autoAlpha: 0,
      duration: 0.35,
      ease: "power3.inOut",
      onComplete: () => {
        setView(nextView);

        requestAnimationFrame(() => {
          gsap.set(content, {
            autoAlpha: 0,
          });

          gsap.to(content, {
            autoAlpha: 1,
            duration: 0.55,
            ease: "power4.out",
            clearProps: "transform,visibility,opacity",
            onComplete: () => {
              isAnimatingRef.current = false;
            },
          });
        });
      },
    });
  };

  return (
    <div className="relative mt-[-18vh] h-full w-full bg-white pt-[15%]">
      <div className="absolute right-[5vw] top-[3vw] z-20 flex overflow-hidden rounded-full  bg-black p-[0.3vw] text-[0.9vw]">
        <div
          className={`absolute left-[0.3vw] top-[0.3vw] h-[calc(100%-0.6vw)] w-[calc(50%-0.3vw)] rounded-full bg-[#ff5f00] duration-300 ease-in-out ${
            view === "grid" ? "translate-x-0" : "translate-x-full"
          }`}
        />

        <button
          type="button"
          onClick={() => changeView("grid")}
          className={`relative z-2 rounded-full px-[1.2vw] py-[0.5vw] text-white`}
        >
          Grid
        </button>

        <button
          type="button"
          onClick={() => changeView("list")}
          className={`relative z-2 rounded-full px-[1.2vw] py-[0.5vw] text-white`}
        >
          List
        </button>
      </div>

      <div ref={contentRef} className="relative w-full">
        {view === "grid" ? (
          <ListingGrid listingItems={listingItems} />
        ) : (
          <ListingList listingItems={listingItems} />
        )}
      </div>
    </div>
  );
};

export default Listing;