"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

const listingItems = [
  {
    title: "Montra",

    image: "/assets/images/portfolio/montra.png",
    tags: ["Marketing", "Strategy"],
  },
  {
    title: "Yellow",
    image: "/assets/images/portfolio/yellow.png",
    tags: ["Branding", "Design"],
  },
  {
    title: "Patronum",
    image: "/assets/images/portfolio/patronum.png",
    tags: ["Marketing", "Strategy"],
  },
  {
    title: "GCM",
    image: "/assets/images/portfolio/gcm.png",
    tags: ["Branding", "Design"],
  },
  {
    title: "DMTCA",
    image: "/assets/images/portfolio/dmtca.png",
    tags: ["Marketing", "Strategy"],
  },
  {
    title: "Hiveminds",
    image: "/assets/images/portfolio/hiveminds.png",
    tags: ["Branding", "Design"],
  },
  {
    title: "Kedarkala",
    image: "/assets/images/portfolio/kedarkala.png",
    tags: ["Marketing", "Strategy"],
  },
  {
    title: "QuickX",
    image: "/assets/images/portfolio/quickx.png",
    tags: ["Branding", "Design"],
  },
];

function ListingCard({ item }) {
  const titleRef = useRef(null);
  const viewRef = useRef(null);
  const titleSplitRef = useRef(null);
  const viewSplitRef = useRef(null);
  const tweenRef = useRef(null);

  useEffect(() => {
    if (!titleRef.current || !viewRef.current) return;

    titleSplitRef.current = new SplitText(titleRef.current, {
      type: "chars",
      charsClass: "title-char",
    });

    viewSplitRef.current = new SplitText(viewRef.current, {
      type: "chars",
      charsClass: "view-char",
    });

    gsap.set(titleSplitRef.current.chars, {
      yPercent: 0,
    });

    gsap.set(viewSplitRef.current.chars, {
      yPercent: 100,
    });

    return () => {
      tweenRef.current?.kill();

      if (titleSplitRef.current) {
        titleSplitRef.current.revert();
        titleSplitRef.current = null;
      }

      if (viewSplitRef.current) {
        viewSplitRef.current.revert();
        viewSplitRef.current = null;
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (!titleSplitRef.current || !viewSplitRef.current) return;

    tweenRef.current?.kill();

    tweenRef.current = gsap.timeline({
      defaults: {
        ease: "power2.inOut",
      },
    });

    tweenRef.current.to(
      titleSplitRef.current.chars,
      {
        yPercent: -100,
        duration: 0.4,
        stagger: 0.018,
      },
      0
    );

    tweenRef.current.to(
      viewSplitRef.current.chars,
      {
        yPercent: 0,
        duration: 0.4,
        stagger: 0.018,
      },
      0.03
    );
  };

  const handleMouseLeave = () => {
    if (!titleSplitRef.current || !viewSplitRef.current) return;

    tweenRef.current?.kill();

    tweenRef.current = gsap.timeline({
      defaults: {
        ease: "power2.inOut",
      },
    });

    tweenRef.current.to(
      titleSplitRef.current.chars,
      {
        yPercent: 0,
        duration: 0.4,
        stagger: 0.018,
      },
      0
    );

    tweenRef.current.to(
      viewSplitRef.current.chars,
      {
        yPercent: 100,
        duration: 0.4,
        stagger: 0.018,
      },
      0.03
    );
  };

  return (
    <div className="col-span-1 flex flex-col gap-[2vw]">
      <Link
        href="#"
        className="group relative h-[30vw] w-full overflow-hidden rounded-[2vw]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Image
          src={item.image}
          alt={item.title}
          className="h-full w-full scale-[1.05] object-cover brightness-75 duration-500 ease-in-out group-hover:scale-[1] group-hover:brightness-100"
          width={500}
          height={400}
        />

        <div className="absolute inset-0 flex h-full w-full justify-between p-[1.5vw] text-[0.9vw]">
          <div className="flex w-[70%] gap-[0.5vw] text-white">
            {item.tags.map((tag, tagIndex) => (
              <p
                key={tagIndex}
                className="h-fit rounded-full bg-[#1a1a1a] px-[1.2vw] py-[0.5vw]"
              >
                {tag}
              </p>
            ))}
          </div>

          <div className="flex size-[2.5vw] items-center justify-center rounded-full bg-white">
            <div className="relative flex size-[2.5vw] items-center justify-center max-sm:size-[10vw]">
              <div className="relative z-[2] flex size-[0.9vw] flex-col flex-nowrap overflow-hidden text-black max-sm:size-[3vw] max-sm:group-hover:text-white">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute h-full w-full scale-100 transition-all duration-400 group-hover:-translate-y-full group-hover:translate-x-full group-hover:scale-[0.2]"
                >
                  <path
                    d="M1.0167 14.838L14.8385 1.01623M3.52479 1.01623H14.8385V12.3299"
                    stroke="currentColor"
                    strokeWidth="2.03206"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="duration-300 stroke-[#ff5f00]"
                  />
                </svg>

                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute h-full w-full -translate-x-full translate-y-full scale-[0.2] transition-all duration-400 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:scale-100"
                >
                  <path
                    d="M1.0167 14.838L14.8385 1.01623M3.52479 1.01623H14.8385V12.3299"
                    stroke="currentColor"
                    strokeWidth="2.03206"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="duration-300 stroke-[#ff5f00]"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Link>

      <div className="relative h-[3.5vw] overflow-hidden pl-[0.5vw]">
        <h3
          ref={titleRef}
          className="absolute left-[0.5vw] top-0 text-[3vw] leading-none "
        >
          {item.title}
        </h3>

        <h3
          ref={viewRef}
          className="absolute left-[0.5vw] top-0 text-[3vw] leading-none "
          
        >
          View Project
        </h3>
      </div>
    </div>
  );
}

const ListingGrid = () => {
  return (
    <section
      className="relative z-4 mt-[-18vh] w-full bg-white px-[5vw] py-[7%] pb-[10%]"
      id="listing"
    >
      <div className="grid grid-cols-2 gap-[2vw] gap-y-[5vw]">
        {listingItems.map((item, index) => (
          <ListingCard key={index} item={item} />
        ))}
      </div>
    </section>
  );
};

export default ListingGrid;