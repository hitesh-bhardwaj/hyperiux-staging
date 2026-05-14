"use client";

import Copy from "@/components/Animations/Copy";
import StickyContentWrapper from "./StickyContent/StickyContent";

const stickyItems = [
    {
        heading: "Development",
        label: "Learn More",
        href: "#",
        paragraph:
            "A human-centred, design-led approach to product development that leverages cutting-edge technologies & agile methodology, committed to putting you on a path to success in the ever-changing technological landscape. We craft digital solutions that are not just functional, but also intuitive and engaging.",
        solutions: [
            "USER EXPERIENCE (UX) DESIGN",
            "USER EXPERIENCE (UX) DESIGN",
            "USER EXPERIENCE (UX) DESIGN",
            "USER EXPERIENCE (UX) DESIGN",
        ],
        image: "/assets/images/homepage/work/our-work-1.png",
        alt: "Development",
    },
    {
        heading: "Design",
        label: "Learn More",
        href: "#",
        paragraph:
            "Thoughtfully crafted digital experiences that seamlessly blend clarity, usability, and visual systems — creating interfaces where design improves every decision. Thoughtfully crafted digital experiences that seamlessly blend clarity, usability, and visual systems — creating interfaces where design improves every decision.",
        solutions: [
            "PRODUCT DESIGN",
            "INTERFACE DESIGN",
            "DESIGN SYSTEMS",
            "PROTOTYPING",
        ],
        image: "/assets/images/homepage/work/our-work-2.png",
        alt: "Design",
    },
    {
        heading: "Strategy",
        label: "Learn More",
        href: "#",
        paragraph:
            "We align business goals, user expectations, and product direction into a practical roadmap for digital growth, conversion, and long-term experience value. We align business goals, user expectations, and product direction into a practical roadmap for digital growth, conversion, and long-term experience value.",
        solutions: [
            "UX STRATEGY",
            "EXPERIENCE AUDIT",
            "CRO ROADMAP",
            "DIGITAL PRODUCT STRATEGY",
        ],
        image: "/assets/images/homepage/work/our-work-3.png",
        alt: "Strategy",
    },
    {
        heading: "Growth",
        label: "Learn More",
        href: "#",
        paragraph:
            "From conversion journeys to refined content systems, every detail is designed to help brands turn attention into trust, action, and measurable commercial outcomes. From conversion journeys to refined content systems, every detail is designed to help brands turn attention into trust, action, and measurable commercial outcomes.",
        solutions: [
            "CONVERSION OPTIMIZATION",
            "SEO CONTENT ARCHITECTURE",
            "LANDING PAGE SYSTEMS",
            "PERFORMANCE UX",
        ],
        image: "/assets/images/homepage/work/our-work-4.png",
        alt: "Growth",
    },
];

export default function Solutions() {
    return (
        <section className="relative z-[20] mt-[-100vh] bg-white pt-[7%] ">
            <div className="text-[#111111] text-[5.2vw] px-[5vw] mb-[5vw]  font-aeonik z-[23] flex flex-col leading-[1.2] solutions-head max-sm:hidden">
                <Copy>
                    <h2 className="w-full solutions-heading">
                        Explore <br /> Our Solutions
                    </h2>

                </Copy>
            </div>
            <StickyContentWrapper
                items={stickyItems}
                className=""
                stepGap={1.1}
                contentTransitionDuration={0.9}
                contentDelay={0.35}
                initialImageScale={1.5}
                activeImageScale={1.2}
                exitImageScale={1}
            />
        </section>
    );
}