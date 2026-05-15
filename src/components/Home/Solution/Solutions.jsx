"use client";

import Copy from "@/components/Animations/Copy";
import StickyContentWrapper from "./StickyContent/StickyContent";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import { LinkButton } from "@/components/Buttons";
import HeadAnim from "@/components/Animations/HeadAnim";

const stickyItems = [
    {
        heading: "Strategy",
        label: "Learn More",
        href: "#",
        paragraph:
            "<p >Strategic planning based on insight is the starting point of everything we do. As one of the leading UI UX and web design agencies, we combine strategic thinking, marketing expertise, insights, best practices, and sound judgment to craft effective strategies that turn insights into measurable results. </p><br/><br/><p> Driving growth and success for your brand needs a brilliant plan (roadmap) rooted in deep insights and aimed at delivering tangible results.</p>",
        solutions: [
            "UI design strategy",
            "Branding",
            "User Experience Development",
            "Integrated Digital Marketing Plan",
            "Customer Experience Strategy",
            "Consumer Research",
            // " Insights & Target Market Analysis",
            // "Digital Capabilities Development",
            // "Persona Design & Customer Segmentation",
            // "Digital Marketing",
            // "Website Performance Audit"
        ],
        image: "/assets/images/homepage/work/our-work-1.png",
        alt: "Development",
    },
    {
        heading: "UI/UX Design",
        label: "Learn More",
        href: "#",
        paragraph:
            "<p>Enigma Digital is a leading UI/UX design agency based in India. We help startups and enterprise companies create digital products, websites, mobile app UIs, and brand experiences.</p><br/><br/><p>We unravel complex design challenges through meticulous user research, expert analysis, prototyping, and collaborative design with users and stakeholders. Harnessing the power of cutting-edge tools and our proprietary approach, we craft delightful and intuitive digital experiences that seamlessly bridge the gap between the physical and digital worlds.</p>",
        solutions: [
            "User Interface Design",
            " User Experience Design",
            "Responsive Web Design",
            "Mobile App Design",
            "Digital Interface Design",
            "Design Systems Creation",
            // "Experience Mapping",
            // "User Flow Mapping",
            // "Wireframing & Prototyping",
            // "Illustrations & Animations",
            // "Visual Designs"
        ],
        image: "/assets/images/homepage/work/our-work-2.png",
        alt: "Design",
    },
    {
        heading: "Technology",
        label: "Learn More",
        href: "#",
        paragraph:
            "<p>Hyperiux is a professional website design agency specializing in creating effective user experiences for technology firms across various industries, including healthcare, e-commerce, legal services, finance, education, and fashion.</p><br/><br/><p>We follow a human-centered, design-led approach to product development-blending cutting-edge technologies with agile methodologies. Our mission is to help you thrive in today’s fast-evolving digital landscape.</p>",
        solutions: [
            "HTML",
            "CSS",
            "JavaScript",
            "Vue",
            "React",
            "Angular",
            // "GSAP",
            // "Wordpress",
            // "Ionic",
            // "Flutter",
            // "PHP",
            // "NodeJS",
            // "Python"
        ],
        image: "/assets/images/homepage/work/our-work-3.png",
        alt: "Strategy",
    },
    {
        heading: "Marketing",
        label: "Learn More",
        href: "#",
        paragraph:
            "<p>Our brand marketing strategies are crafted not just to create a lasting impression but to drive user engagement, build brand loyalty, and seamlessly adapt to the dynamic digital landscape with precision and creativity.</p><br/><br/><p>For us, 'DIGITAL' isn't just a buzzword—it's the foundation of future-forward growth! This philosophy guides our service suite, tailored to evolve with our clients’ needs and contribute directly to their success.</p>",
        solutions: [
            "Social Media Management",
            "Content Creation & Curation",
            "Search Engine Optimisation",
            " Influencer Management",
            "Online Reputation Management",
            "Marketing Automation",
            // "Email Marketing",
            // "Conversion Rate Optimisation",
            // "comprehensive Website",
            // "SEO Analysis"
        ],
        image: "/assets/images/homepage/work/our-work-4.png",
        alt: "Growth",
    },
];

function MobileSolutionsSwiper() {
    const [prevEl, setPrevEl] = useState(null);
    const [nextEl, setNextEl] = useState(null);

    return (
        <div className="mobile-solutions-swiper  max-sm:pt-[8%] max-sm:pb-[15%]">
            {/* Section heading */}
            <HeadAnim>

            <h2 className="text-[#111111] px-[7vw] text-[10vw] font-aeonik leading-[1.15] mb-14">
                Explore <br /> Our Solutions
            </h2>
            </HeadAnim>

            <Swiper
                modules={[Navigation]}
                slidesPerView={1}
                spaceBetween={20}
                navigation={{
                    prevEl: prevEl,
                    nextEl: nextEl,
                }}
                onBeforeInit={(swiper) => {
                    swiper.params.navigation.prevEl = prevEl;
                    swiper.params.navigation.nextEl = nextEl;
                }}
                className="w-full"
            >
                {stickyItems.map((item, index) => (
                    <SwiperSlide key={index}>
                        <div className="flex flex-col gap-6 px-[7vw]!">
                            {/* Image */}
                            <div
                                className="w-full h-[30vh] fadeup rounded-2xl overflow-hidden bg-[#111111]"
                             
                            >
                                <Image
                                    width={800}
                                    height={800}
                                    src={item.image}
                                    alt={item.alt}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex flex-col gap-4 pt-[5vw]">
                                {/* Heading */}
                                <Copy>

                                <h3
                                    className="font-aeonik text-[8.5vw] leading-tight"
                                    style={{ color: "#f05a28" }}
                                    >
                                    {item.heading}
                                </h3>
                                    </Copy>

                                    <Copy>


                                {/* Paragraph */}
                                <p className="text-[#111111] text-[4.5vw] pt-[2vw] leading-relaxed">
                                    {item.paragraph}
                                </p>
                                    </Copy>

                                {/* Solutions list */}
                                <ul className="flex flex-col gap-3 mt-[5vw]">
                                    <Copy>

                                    {item.solutions.map((sol, i) => (
                                        <li
                                        key={i}
                                        className=" text-[4.5vw] text-black tracking-wide  pb-3"
                                        >
                                            {sol}
                                        </li>
                                    ))}
                                    </Copy>
                                </ul>

                                {/* Learn More */}
                               <LinkButton
                                              text={"Learn More"}
                                              href={"#"}
                                              hover={"text-[#111111] group-hover:stroke-white"}
                                              invert={false}
                                              className="text-[1.35vw] text-black "
                                            />
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Navigation arrows */}
            <div className="flex items-center fadeup justify-center gap-4 mt-10">
                <button
                    ref={setPrevEl}
                    aria-label="Previous slide"
                    className="w-14 h-14 rounded-full border border-[#FF5F00] flex items-center justify-center transition-opacity disabled:opacity-50"
                    style={{ background: "transparent" }}
                >
                    <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.7032 6.87147L0.752807 6.87147M6.87158 12.9902L0.752807 6.87147L6.87158 0.752698" stroke="#FF5F00" stroke-width="1.50559" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                </button>

                <button
                    ref={setNextEl}
                    aria-label="Next slide"
                    className="w-14 h-14 rounded-full border border-[#FF5F00] flex items-center justify-center transition-opacity disabled:opacity-50"
                 
                >
                   <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.752798 6.8717L15.7032 6.8717M9.58445 0.752929L15.7032 6.8717L9.58445 12.9905" stroke="#FF5F00" stroke-width="1.50559" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                </button>
            </div>
        </div>
    );
}

export default function Solutions() {
    return (
        <section className="relative z-20 mt-[-100vh] max-sm:mt-0 bg-white pt-[7%] max-sm:pt-10">
            {/* Desktop heading — hidden on mobile */}
            <div className="text-[#111111] text-[5.2vw] px-[5vw] mb-[5vw] font-aeonik z-23 flex flex-col leading-[1.2] solutions-head max-sm:hidden">
                <Copy>
                    <h2 className="w-full solutions-heading">
                        Explore <br /> Our Solutions
                    </h2>
                </Copy>
            </div>

            {/* Desktop sticky scroll — hidden on mobile */}
            <div className="max-sm:hidden">
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
            </div>

            {/* Mobile swiper — hidden on desktop */}
            <div className="hidden max-sm:block">
                <MobileSolutionsSwiper />
            </div>
        </section>
    );
}