"use client";

import gsap from "gsap";
import Flip from "gsap/dist/Flip";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { LinkButton } from "@/components/Buttons";

gsap.registerPlugin(Flip, ScrollTrigger, SplitText, useGSAP);

const services = [
  {
    slot: "1",
    title: "Design",
    className: "ser-design",
    active: true,
    slotClass: "col-span-1 col-start-1 row-span-3 row-start-1",
    linkColor: "text-white",
  },
  {
    slot: "2",
    title: "Development",
    className: "ser-development",
    slotClass: "col-span-1 col-start-2 row-span-1 row-start-1",
    linkColor: "text-[#111111]",
  },
  {
    slot: "3",
    title: "Strategy",
    className: "ser-strategy",
    slotClass: "col-span-1 col-start-2 row-span-1 row-start-2",
    linkColor: "text-white",
  },
  {
    slot: "4",
    title: "Marketing",
    className: "ser-marketing",
    slotClass: "col-span-1 col-start-2 row-span-1 row-start-3",
    linkColor: "text-[#111111]",
  },
];

const serviceLinks = Array.from({ length: 16 }, (_, index) => ({
  id: index + 1,
  label: "User Interface Design",
  href: "#",
}));

let gridItemClickListeners = [];
let solutionLinkListeners = [];
let solutionLinkSplits = [];
let headingSplit = null;
let isFlipping = false;

function getCardTextColor(item) {
  return item.classList.contains("ser-design") ||
    item.classList.contains("ser-strategy")
    ? "#fefefe"
    : "#1a1a1a";
}

function initSolutionLinkHovers() {
  const links = document.querySelectorAll(".solutions-link");

  links.forEach((link) => {
    const mainText = link.querySelector(".solutions-link-main");
    const shadowText = link.querySelector(".solutions-link-shadow");
    const line = link.querySelector(".solutions-link-line");

    if (!mainText || !shadowText || !line) return;

    const mainSplit = new SplitText(mainText, {
      type: "chars",
      charsClass: "solutions-char",
    });

    const shadowSplit = new SplitText(shadowText, {
      type: "chars",
      charsClass: "solutions-char",
    });

    solutionLinkSplits.push(mainSplit, shadowSplit);

    gsap.set([...mainSplit.chars, ...shadowSplit.chars], {
      yPercent: 0,
      display: "inline-block",
    });

    gsap.set(line, {
      scaleX: 1,
      transformOrigin: "right center",
    });

    const enter = () => {
      gsap.killTweensOf([mainSplit.chars, shadowSplit.chars, line]);

      gsap.to(mainSplit.chars, {
        yPercent: -100,
        duration: 0.5,
        stagger: 0.012,
        ease: "power2.out",
      });

      gsap.to(shadowSplit.chars, {
        yPercent: -100,
        duration: 0.5,
        stagger: 0.012,
        ease: "power2.out",
      });

      gsap
        .timeline()
        .to(line, {
          scaleX: 0,
          duration: 0.35,
          transformOrigin: "right center",
          ease: "power2.inOut",
        })
        .set(line, { transformOrigin: "left center" })
        .to(line, {
          scaleX: 1,
          duration: 0.4,
          ease: "power2.inOut",
        });
    };

    const leave = () => {
      gsap.killTweensOf([mainSplit.chars, shadowSplit.chars]);

      gsap.to(mainSplit.chars, {
        yPercent: 0,
        duration: 0.5,
        stagger: 0.01,
        ease: "power2.out",
      });

      gsap.to(shadowSplit.chars, {
        yPercent: 0,
        duration: 0.5,
        stagger: 0.01,
        ease: "power2.out",
      });
    };

    link.addEventListener("mouseenter", enter);
    link.addEventListener("mouseleave", leave);

    solutionLinkListeners.push({ link, enter, leave });
  });
}

function destroySolutionLinkHovers() {
  solutionLinkListeners.forEach(({ link, enter, leave }) => {
    link.removeEventListener("mouseenter", enter);
    link.removeEventListener("mouseleave", leave);
  });

  solutionLinkSplits.forEach((split) => split?.revert());

  solutionLinkListeners = [];
  solutionLinkSplits = [];
}

function repositionItems(clickedItem) {
  if (isFlipping) return;

  const slot1 = document.querySelector('[ser-slot="1"]');
  const slot2 = document.querySelector('[ser-slot="2"]');
  const slot3 = document.querySelector('[ser-slot="3"]');
  const slot4 = document.querySelector('[ser-slot="4"]');

  if (!slot1 || !slot2 || !slot3 || !slot4) return;

  const currSlot1Item = slot1.querySelector(".ser-grid-item");
  const currSlot2Item = slot2.querySelector(".ser-grid-item");
  const currSlot3Item = slot3.querySelector(".ser-grid-item");
  const currSlot4Item = slot4.querySelector(".ser-grid-item");

  if (clickedItem === currSlot1Item) return;

  isFlipping = true;

  const currentState = Flip.getState(".ser-grid-item");

  gsap.set(".ser-grid", {
    height: "46vw",
    gap: "2vw",
    gridTemplateRows: "repeat(3, 14vw)",
  });

  gsap.set(".ser-grid-slot", {
    height: "100%",
    minHeight: 0,
    maxHeight: "none",
  });

  slot1.appendChild(clickedItem);

  if (currSlot1Item) slot4.appendChild(currSlot1Item);

  if (currSlot4Item && clickedItem !== currSlot4Item) {
    slot3.appendChild(currSlot4Item);
  } else if (currSlot3Item && clickedItem !== currSlot3Item) {
    slot3.appendChild(currSlot3Item);
  }

  if (
    currSlot3Item &&
    clickedItem !== currSlot3Item &&
    clickedItem !== currSlot4Item
  ) {
    slot2.appendChild(currSlot3Item);
  } else if (currSlot2Item && clickedItem !== currSlot2Item) {
    slot2.appendChild(currSlot2Item);
  }

  document.querySelectorAll(".ser-grid-item").forEach((item) => {
    const active = item === slot1.querySelector(".ser-grid-item");
    const textColor = active ? getCardTextColor(item) : "#1a1a1a";

    item.classList.toggle("is--active", active);

    gsap.set(item.querySelector(".is-ser-title"), {
      color: textColor,
    });

    gsap.to(item.querySelector(".ser-cross-w"), {
      opacity: active ? 0 : 1,
      rotate: active ? 90 : 0,
      duration: active ? 0.5 : 0.55,
      delay:active?0:0.3,
      ease: "power2.out",
      overwrite: true,
    });

    gsap.set(item.querySelector(".ser-info-w"), {
      color: textColor,
    });

    gsap.to(item.querySelector(".ser-info-w"), {
      opacity: active ? 1 : 0,
      y: active ? 0 : 0,
      duration: active ? 0.45 : 0.38,
      delay: active ? 0.3 : 0,
      ease: "power2.out",
      overwrite: true,
    });

    gsap.to(item.querySelector(".ser-grid-item-bg"), {
      opacity: active ? 1 : 0,
      duration: active ? 0.18 : 0.12,
      ease: "none",
      overwrite: true,
    });

    gsap.to(item.querySelector(".ser-links"), {
      opacity: active ? 1 : 0,
      duration: active ? 0.25 : 0.08,
      ease: "power2.out",
      overwrite: true,
    });
  });

  Flip.from(currentState, {
    duration: 0.7,
    ease: "power3.inOut",
    absolute: true,
    nested: true,
    prune: true,
    zIndex: 100,
    onComplete: () => {
      isFlipping = false;

      gsap.set(".ser-grid", {
        height: "46vw",
        gap: "2vw",
        gridTemplateRows: "repeat(3, 14vw)",
      });

      gsap.set(".ser-grid-slot", {
        height: "100%",
        minHeight: 0,
        maxHeight: "none",
      });
    },
  });
}

function initServGrid() {
  const activeItem = document.querySelector(".ser-grid-item.is--active");

  if (activeItem) {
    const color = getCardTextColor(activeItem);

    gsap.set(activeItem.querySelector(".is-ser-title"), {
      scale: 1,
      color,
    });

    gsap.set(activeItem.querySelector(".ser-cross-w"), {
      opacity: 0,
      rotate: 90,
    });

    gsap.set(activeItem.querySelector(".ser-info-w"), {
      opacity: 1,
      y: 0,
      color,
    });

    gsap.set(activeItem.querySelector(".ser-grid-item-bg"), { opacity: 1 });
    gsap.set(activeItem.querySelector(".ser-links"), { opacity: 1 });
  }

  gsap.set(".ser-grid-item:not(.is--active) .ser-info-w", {
    opacity: 0,
    y: 10,
    color: "#1a1a1a",
  });

  gsap.set(".ser-grid-item:not(.is--active) .ser-grid-item-bg", {
    opacity: 0,
  });

  gsap.set(".ser-grid-item:not(.is--active) .ser-links", { opacity: 0 });

  gsap.set(".ser-grid-item:not(.is--active) .is-ser-title", {
    scale: 1,
    color: "#1a1a1a",
  });

  gsap.set(".ser-grid-item:not(.is--active) .ser-cross-w", {
    opacity: 1,
    rotate: 0,
  });

  // gsap.set(".ser-grid-slot", {
  //   height: "100%",
  //   minHeight: 0,
  //   maxHeight: "none",
  // });

  document.querySelectorAll(".ser-grid-item").forEach((item) => {
    const clickListener = () => repositionItems(item);
    item.addEventListener("click", clickListener);
    gridItemClickListeners.push({ item, clickListener });
  });
}

function destroyServGrid() {
  gridItemClickListeners.forEach(({ item, clickListener }) => {
    item.removeEventListener("click", clickListener);
  });

  gridItemClickListeners = [];
  isFlipping = false;
}

function initSolutionsIntro() {
  const heading = document.querySelector(".solutions-heading");
  const grid = document.querySelector(".ser-grid");

  if (heading) {
    headingSplit = new SplitText(heading, {
      type: "chars",
      mask: "chars",
      charsClass: "solutions-heading-char",
    });

    gsap.set(headingSplit.chars, {
      yPercent: 110,
      display: "inline-block",
    });

    gsap.to(headingSplit.chars, {
      yPercent: 0,
      duration: 0.9,
      stagger: 0.018,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#solutions",
        start: "top 70%",
      },
    });

    gsap.from(".solutions-card",{
      yPercent:40,
      opacity:0,
      stagger:0.02
    })
  }

  if (grid) {
    gsap.fromTo(
      grid,
      {
        opacity: 0,
        y: 80,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#solutions",
          start: "top 70%",
        },
      }
    );
  }
}

function destroySolutionsIntro() {
  headingSplit?.revert();
  headingSplit = null;
}

function ServiceCard({ service }) {
  const isActive = service.active;

  return (
    <div
      ser-slot={service.slot}
      className={`relative pointer-events-auto z-[99] ser-grid-slot" ${
        isActive ? "is--active" : ""
      } ${service.slotClass}`}
    >
      <div
        className={`ser-grid-item ${service.className} ${
          isActive ? "is--active" : ""
        }`}
      >
        <div className="absolute ser-grid-item-bg inset-0 opacity-0" />

        <div className="ser-content-w">
          <div className="ser-titles-w">
            <div className="ser-titles">
              <h3 className="text-[2.5vw] is-ser-title">{service.title}</h3>
            </div>

            <div className="ser-cross-w relative">
              <div className="ser-cross rotate-45">
                <svg
                  width="31"
                  height="30"
                  className="w-full h-full object-cover"
                  viewBox="0 0 31 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.06152 1.58789L29.0527 28.5791"
                    stroke="#1A1A1A"
                    strokeWidth="2.38571"
                    strokeLinecap="round"
                  />
                  <path
                    d="M2.06152 28.5796L29.0527 1.58841"
                    stroke="#1A1A1A"
                    strokeWidth="2.38571"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            <div className="absolute top-[3%] right-0 w-[8vw]">
              <LinkButton
                text="Learn More"
                href="#"
                hover={true}
                className={`${service.linkColor} ser-links`}
              />
            </div>
          </div>

          <div className="ser-info-100 px-[2%]">
            <div className="ser-info-w">
              <div className="ser-info-abs">
                <div className="ser-info-group">
                  <p className="font-medium mb-[2vw]">
                    A human-centred, design-led approach to product development
                    that leverages cutting-edge technologies & agile
                    methodology, committed to putting you on a path to success
                    in the ever-changing technological landscape.
                  </p>
                </div>

                <div className="flex flex-wrap gap-x-[5vw] gap-y-[1.7vw]">
                  {serviceLinks.map((link) => (
                    <Link
                      key={link.id}
                      href={link.href}
                      className="w-[40%] h-[1.5vw] relative solutions-link"
                    >
                      <div className="overflow-hidden h-[1.1vw] relative">
                        <p className="solutions-link-main text-[0.9vw] uppercase leading-[1.1]">
                          {link.label}
                        </p>
                        <p className="solutions-link-shadow absolute left-0 top-full text-[0.9vw] uppercase leading-[1.1]">
                          {link.label}
                        </p>
                      </div>

                      <span className="solutions-link-line w-full h-[1px] bg-current mt-[0.3vw] block" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SolutionDesktop = () => {
  useGSAP(() => {
    if (globalThis.innerWidth < 541) return;

    initSolutionsIntro();
    initServGrid();
    initSolutionLinkHovers();

    return () => {
      destroyServGrid();
      destroySolutionLinkHovers();
      destroySolutionsIntro();
    };
  }, []);

  return (
    <section
      className="bg-[#fefefe] pb-[2%] py-[5%] h-fit w-full px-[5vw] relative z-[22] space-y-[5vw] max-sm:hidden"
      id="solutions"
    >
      <div className="text-[#111111] text-[5.2vw] font-display z-[23] flex flex-col leading-[1.2] solutions-head max-sm:hidden">
        <h2 className="w-full solutions-heading">
          Explore <br /> Our Solutions
        </h2>
      </div>

      <div className="ser-grid solutions-card">
        {services.map((service) => (
          <ServiceCard key={service.slot} service={service} />
        ))}
      </div>
    </section>
  );
};

export default SolutionDesktop;