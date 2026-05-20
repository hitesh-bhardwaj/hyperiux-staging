import gsap from "gsap";

export const sectionHeadings = [
  { id: "hero-section", text: "We are Hyperiux" },
  { id: "hero", text: "We are Hyperiux" },
  { id: "about", text: "Discover about us" },
  { id: "work", text: "Our magic masterpieces" },
  { id: "work-mobile", text: "Our magic masterpieces" },
  { id: "sectionBreak", text: "We are Hyperiux" },
  { id: "culture", text: "We will take care of you XD" },
  { id: "what-we", text: "How we define us" },
  { id: "team", text: "The wizardss ✨" },
  { id: "intro", text: "We claim it!" },
  { id: "approach", text: "How we do the Magic ✨" },
  { id: "design-process", text: "Small steps BIGGER impact." },
  { id: "tool-marquee", text: "Ingredients to craft Potions 🧪" },
  { id: "testimonial-cards", text: "They say what they believe" },
  { id: "career-listing", text: "Check if there is something for you" },
  { id: "contact-form", text: "Fill up the form or Book your call " },
  { id: "awards", text: "Proofs that we're Amaaazing" },
  { id: "solutions", text: "What we offer to you.. :)" },
  { id: "industries", text: "Industries we work with" },
  { id: "clients", text: "Logos are cool but clients are more" },
  { id: "testimonial", text: "Yayyy!! they believe us" },
  { id: "blog-horizontal", text: "We also geek out" },
  { id: "faqs", text: "Maybe you are concerned..." },
  { id: "footer", text: "Say 'Hi' to Know More About Magic  " },
  { id: "footer-bottom", text: "Scroll More For A New Journey" },
];

export const menuEase = "cubic-bezier(0.625, 0.05, 0, 1)";

export function getClosedMenuState() {
  if (typeof window !== "undefined" && window.innerWidth <= 640) {
    return {
      width: "88vw",
      height: "15vw",
      borderRadius: "18px",
      borderColor: "rgba(255,255,255,0.3)",
      backgroundColor: "rgba(0,0,0,0.5)",
      backdropFilter: "blur(12px)",
      webkitBackdropFilter: "blur(12px)",
    };
  }

  return {
    width: "37vw",
    height: "4vw",
    borderRadius: "18px",
    borderColor: "rgba(255,255,255,0.3)",
    backgroundColor: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(12px)",
    webkitBackdropFilter: "blur(12px)",
  };
}

export function resetMenuStyles({
  menuTimeline,
  menuWrapperRef,
  menuContentRef,
  bottomHeaderRef,
  seprationLineRef,
  backgroundOverlayRef,
  isMenuAnimatingRef,
}) {
  const tl = menuTimeline.current;

  if (tl) {
    tl.pause(0);
  }

  const wrapper = menuWrapperRef.current;
  const content = menuContentRef.current;
  const header = bottomHeaderRef.current;
  const line = seprationLineRef.current;
  const overlay = backgroundOverlayRef.current;

  gsap.killTweensOf([wrapper, content, header, line, overlay]);

  gsap.set(wrapper, {
    ...getClosedMenuState(),
    opacity: 1,
    pointerEvents: "auto",
  });

  gsap.set(content, {
    opacity: 0,
    pointerEvents: "none",
  });

  gsap.set(header, {
    opacity: 1,
    pointerEvents: "auto",
  });

  gsap.set(line, {
    opacity: 0,
  });

  gsap.set(overlay, {
    opacity: 0,
    pointerEvents: "none",
  });

  isMenuAnimatingRef.current = false;
}