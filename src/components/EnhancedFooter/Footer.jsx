"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HyperiuxMaskedTrail from "./components/HyperiuxMaskedTrail";
import CharRevealLink from "../Animations/CharRevealLink";
import { FooterUnderlineLink, MainButton } from "../Buttons";
import Image from "next/image";
import FlowFieldHero from "../3D/FlowFieldPlane";
import { CONTACT_LINKS, FOOTER_LINK_SECTIONS, SOCIAL_LINKS } from "./data";
import CircularButton from "../Buttons/CircularButton";

gsap.registerPlugin(ScrollTrigger);

export const Footer = () => {
    const container = useRef(null);
    const [progress, setProgress] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 542);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
        <div id="footer" className="relative bg-[#111111] ">
            <div
                ref={container}
                className="w-screen h-fit relative max-sm:h-[120vh]"
                id="footer-bottom"
            >
                <div className="relative overflow-hidden w-screen h-full text-white flex flex-col px-[5vw] pt-[5vw] max-sm:px-[7vw] pb-[2vw] max-sm:pb-0 max-sm:h-fit max-sm:pt-[18%]">
                    {!isMobile && (
                        <div className="absolute inset-0 top-0 z-1 pointer-events-auto">
                            <FlowFieldHero
                                texturePath="/assets/textures/orange.png"
                            />
                        </div>
                    )}

                    <div className="relative z-10 flex flex-1 flex-col gap-[12vw] justify-between">
                        {/* Title & Call-to-action */}
                        <div className="flex flex-col w-full gap-[2vw] max-sm:gap-[8vw] items-start justify-between">
                            <h2 className="font-aeonik text-[6.5vw] max-sm:text-[10vw] leading-[0.95] max-sm:leading-[1.2]! w-[60%] max-sm:w-[80%]">
                                Let&apos;s Bring Your Ideas
                                To Life!
                            </h2>
                            <div className="mt-7">
                                <MainButton href={"#"} btnText={"Say Hi"} className={"bg-white! text-[#111111]!"} />
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="w-full flex justify-between items-end">
                            <div className="w-full h-fit flex flex-col gap-[5vw] max-sm:gap-[12vw]">
                                <div className="w-full flex justify-between">
                                    <div className="flex gap-[12vw] w-full max-sm:flex-col max-sm:gap-[10vw]">

                                        {/* Contact / Address / Social */}
                                        <div className="flex flex-col gap-[1.4vw] w-[35vw] max-sm:w-full max-sm:order-3 max-sm:gap-[6vw]">
                                            <div className="flex flex-col pt-0 max-sm:pt-[4vw] gap-[1.5vw] leading-[1.2] font-aeonik max-sm:gap-[6vw]">
                                                {CONTACT_LINKS.map(link =>
                                                    <FooterUnderlineLink href={link.href} key={link.type}>
                                                        {link.label}
                                                    </FooterUnderlineLink>
                                                )}

                                                <p className="w-full text-16 [text-shadow:0_1px_0_#111111] max-sm:text-[5vw]">
                                                    Grandslam I-Thum, A-40, Sector- 62, Noida, Uttar
                                                    Pradesh (201309)
                                                </p>

                                                <div className="flex gap-[1vw] menu-socials mt-[1vw] max-sm:gap-[7vw] max-sm:mt-[4vw]">
                                                    {SOCIAL_LINKS.map(({ href, key }) => (
                                                        <CircularButton
                                                            variant={key}
                                                            key={key}
                                                            href={href}
                                                            className="group-hover:-invert"
                                                            fill="group-hover:fill-primary"
                                                        />
                                                    ))}
                                                </div>

                                                <p className="font-aeonik max-sm:hidden text-white pt-[2vw] text-[0.9vw] max-sm:text-[3.5vw] max-sm:pt-[8vw]">
                                                    © 2026 Hyperiux Immersion Labs. All rights reserved.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Links Section */}
                                        <div className="flex max-sm:gap-[8vw] gap-[12vw] max-sm:w-[75%]  max-sm:justify-between max-sm:order-2">
                                            {FOOTER_LINK_SECTIONS.map((section, idx) => (
                                                <div
                                                    key={section.title}
                                                    className={`flex flex-col gap-[1.2vw] max-sm:gap-[7vw] ${section.className}`}
                                                >
                                                    <h3 className="font-aeonik text-[1.6vw] font-medium max-sm:text-[4.5vw]">
                                                        {section.title}
                                                    </h3>
                                                    <div className={`flex flex-col font-aeonik ${section.title === "Company"
                                                        ? "gap-[0.75vw] text-16 max-sm:gap-[4vw]"
                                                        : "gap-[0.8vw] max-sm:gap-[4vw]"
                                                        }`}>
                                                        {section.links.map(link => (
                                                            <CharRevealLink href={link.href} key={link.text}>
                                                                {link.text}
                                                            </CharRevealLink>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Progress Bar Section */}
                                        <div className="pointer-events-none flex h-full items-end max-sm:justify-start">
                                            <div className="flex flex-col w-[18vw] max-sm:w-[80%]">
                                                <div className="flex flex-col gap-[1vw] max-sm:gap-[2vw]">
                                                    <p className="text-16">Keep Scrolling to know more</p>
                                                    <h3 className="text-[2.5vw] max-sm:text-[8vw] font-display">About Us</h3>
                                                    <div className="w-full h-0.75 bg-white/20 rounded-full flex">
                                                        <span
                                                            style={{
                                                                width: `${progress}%`,
                                                            }}
                                                            className="w-0 h-full inline-block bg-[#ff5f00] rounded-full progress-bar"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                {/* Mobile Logo & Copyright */}
                                <div className="hidden max-sm:block">
                                    <div className="w-full h-auto ">
                                        <Image src='/assets/icons/hyperiux-footer.png' alt='hyperiux' width={400} height={200} className=" h-full w-full objecct-cover" />
                                    </div>
                                    <p className="font-aeonik  text-white pt-[2vw] text-center mx-auto text-[0.9vw] max-sm:text-[3.2vw] max-sm:pt-[8vw]">
                                        © 2026 Hyperiux Immersion Labs. All rights reserved.
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="w-full h-[35vw] absolute bottom-0 z-2 pointer-events-none ml-[-5vw] bg-linear-to-t from-[#111111] to-[#11111100]" />
                </div>
            </div>

            {!isMobile && <HyperiuxMaskedTrail />}
        </div>
    );
};