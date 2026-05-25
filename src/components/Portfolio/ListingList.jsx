"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";

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

const getMouseDirection = (event, element) => {
  const rect = element.getBoundingClientRect();
  const mouseY = event.clientY - rect.top;

  return mouseY < rect.height / 2 ? "top" : "bottom";
};

const ListingList = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const imageRefs = useRef([]);
  const contentRefs = useRef([]);

  const showActiveImage = (index) => {
    const activeImage = imageRefs.current[index];

    if (!activeImage) return;

    imageRefs.current.forEach((image, imageIndex) => {
      if (!image) return;

      gsap.killTweensOf(image);

      gsap.set(image, {
        zIndex: imageIndex === index ? 5 : 1,
        visibility: imageIndex === index ? "visible" : "hidden",
      });
    });

    gsap.fromTo(
      activeImage,
      {
        scale: 1.1,
      },
      {
        scale: 1.05,
        duration: 0.85,
        ease: "power4.out",
        overwrite: true,
      }
    );
  };

  const hideAllImages = () => {
    imageRefs.current.forEach((image) => {
      if (!image) return;

      gsap.killTweensOf(image);

      gsap.set(image, {
        zIndex: 1,
        visibility: "hidden",
        scale: 1.05,
      });
    });

    setActiveIndex(null);
  };

  const updateProjectTextColors = (hoveredIndex, activeTextColor) => {
    contentRefs.current.forEach((content, index) => {
      if (!content) return;

      gsap.killTweensOf(content);

      gsap.to(content, {
        color: index === hoveredIndex ? activeTextColor : "#ffffff",
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
      });
    });
  };

  const resetProjectTextColors = () => {
    contentRefs.current.forEach((content) => {
      if (!content) return;

      gsap.killTweensOf(content);

      gsap.to(content, {
        color: "#111111",
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
      });
    });
  };

  const handleProjectEnter = (event, item, index) => {
    const block = event.currentTarget;
    const shutter = block.querySelector(".bg-fill-shutter");

    const direction = getMouseDirection(event, block);
    const origin = direction === "top" ? "top center" : "bottom center";

    setActiveIndex(index);

    gsap.killTweensOf(shutter);

    gsap.set(shutter, {
      scaleY: 0,
      transformOrigin: origin,
      backgroundColor: item.shutterColor,
    });

    gsap.to(shutter, {
      scaleY: 1,
      duration: 0.65,
      ease: "power4.out",
      overwrite: true,
    });

    updateProjectTextColors(index, item.textColor);
    showActiveImage(index);
  };

  const handleProjectLeave = (event) => {
    const block = event.currentTarget;
    const shutter = block.querySelector(".bg-fill-shutter");

    const direction = getMouseDirection(event, block);
    const origin = direction === "top" ? "top center" : "bottom center";

    gsap.killTweensOf(shutter);

    gsap.set(shutter, {
      transformOrigin: origin,
    });

    gsap.to(shutter, {
      scaleY: 0,
      duration:  0.65,
      ease: "power4.out",
      overwrite: true,
    });

    hideAllImages();
    resetProjectTextColors();
  };

  return (
    <section
      className="relative z-4 mt-[-18vh] w-full overflow-hidden bg-white py-[7%] pb-[10%]"
      id="listing"
    >
      <div className="relative z-2 flex h-full w-full flex-col">
        {listingItems.map((item, index) => (
          <Link
          href={"#"}
            key={index}
            className="project-block relative h-fit w-full cursor-pointer overflow-hidden"
            onMouseEnter={(event) => handleProjectEnter(event, item, index)}
            onMouseLeave={handleProjectLeave}
          >
            <div
              ref={(el) => {
                contentRefs.current[index] = el;
              }}
              className="project-content relative z-2 flex h-[8vw] w-full items-center justify-between px-[5vw] text-[#111111]"
            >
              <div className="flex w-[30%] items-center justify-start">
                <h3 className="text-[2.5vw] leading-none">{item.title}</h3>
              </div>

              <div className="flex w-[30%] items-center justify-center text-[1vw]">
                {item.year}
              </div>

              <div className="flex w-[30%] items-center justify-center gap-[2vw] text-[1vw]">
                {item.tags.map((tag, tagIndex) => (
                  <p key={tagIndex}>{tag}</p>
                ))}
              </div>
            </div>

            <div
              className="bg-fill-shutter absolute inset-0 h-full w-full scale-y-0"
              style={{
                backgroundColor: item.shutterColor,
                transformOrigin: "top center",
              }}
            />
          </Link>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 z-1 h-full w-full overflow-hidden">
        {listingItems.map((item, index) => (
          <Image
            key={`${item.title}-${index}`}
            ref={(el) => {
              imageRefs.current[index] = el;
            }}
            src={item.image}
            alt={item.title}
            width={1920}
            height={1080}
            className="fixed inset-0 h-full w-full object-cover brightness-75"
            style={{
              zIndex: 1,
              visibility: "hidden",
              transform: "scale(1.1)",
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default ListingList;