"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon,
    WhatsappShareButton,
    WhatsappIcon,
    LinkedinShareButton,
    LinkedinIcon,
} from "next-share";

gsap.registerPlugin(ScrollTrigger);

function slugify(text = "") {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/&/g, "and")
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

function truncateText(text = "", limit = 20) {
    if (text.length <= limit) return text;
    return `${text.slice(0, limit).trim()}....`;
}

export default function BlogLeftContent({
    category = "",
    publishedAt = "",
    readingTime = 1,
    title = "",
    author = null,
}) {
    const [pageUrl, setPageUrl] = useState("");
    const [tocItems, setTocItems] = useState([]);
    const tocButtonRefs = useRef([]);

    useEffect(() => {
        setPageUrl(window.location.href);
    }, []);

    useEffect(() => {
        const buildToc = () => {
            const headings = Array.from(document.querySelectorAll(".blog-article h2"));

            const items = headings.map((heading, index) => {
                const text = heading.textContent || `Section ${index + 1}`;
                const existingId = heading.getAttribute("id");
                const id = existingId || `${slugify(text) || "section"}-${index + 1}`;

                heading.setAttribute("id", id);

                return {
                    id,
                    title: text,
                };
            });

            setTocItems(items);
        };

        requestAnimationFrame(buildToc);

        const timer = window.setTimeout(() => {
            buildToc();
            ScrollTrigger.refresh();
        }, 350);

        return () => {
            window.clearTimeout(timer);
        };
    }, []);

    useEffect(() => {
        if (!tocItems.length) return;

        const setActiveTocItem = (activeIndex) => {
            tocButtonRefs.current.forEach((button, index) => {
                if (!button) return;

                gsap.to(button, {
                    color: index === activeIndex ? "#111111" : "#9ca3af",
                    //   x: index === activeIndex ? 8 : 0,
                    duration: 0.45,
                    ease: "power2.out",
                    overwrite: true,
                });
            });
        };

        const triggers = tocItems
            .map((item, index) => {
                const heading = document.getElementById(item.id);
                if (!heading) return null;

                return ScrollTrigger.create({
                    trigger: heading,
                    start: "top 18%",
                    end: "bottom 18%",
                    onEnter: () => setActiveTocItem(index),
                    onEnterBack: () => setActiveTocItem(index),
                    invalidateOnRefresh: true,
                    //   markers:true
                });
            })
            .filter(Boolean);

        setActiveTocItem(0);

        const refreshTimer = window.setTimeout(() => {
            ScrollTrigger.refresh();
        }, 300);

        return () => {
            window.clearTimeout(refreshTimer);
            triggers.forEach((trigger) => trigger.kill());
        };
    }, [tocItems]);

    const handleTocClick = (id) => {
        const heading = document.getElementById(id);
        if (!heading) return;

        const offset = window.innerWidth < 768 ? 90 : 120;
        const top = heading.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
            top,
            behavior: "smooth",
        });
    };

    return (
        <aside className="left-content sticky top-[10%] h-fit w-[25vw] self-start max-lg:static max-lg:w-full">
            <div className="flex w-full flex-col gap-[2vw] max-sm:gap-[7vw]">
                <div className="flex flex-col gap-[0.5vw] text-[1.05vw] leading-[1.4] text-[#111111] max-sm:gap-[2vw] max-sm:text-[3.5vw]">
                    {category && (
                        <span className="w-fit rounded-full bg-[#111111] px-[1vw] py-[0.45vw] font-aeonik text-[0.7vw] uppercase tracking-[0.08em] text-white max-sm:px-[4vw] max-sm:py-[2vw] max-sm:text-[3vw] mb-[1vw]">
                            {category}
                        </span>
                    )}

                    {publishedAt && <time>{publishedAt}</time>}

                    <span >{readingTime} min read</span>
                </div>

                {author && (
                    <div className="flex items-center gap-[1vw] border-t border-black/10 pt-[1.5vw] max-sm:gap-[3vw] max-sm:pt-[5vw]">
                        {author.photoUrl && (
                            <div className="relative size-[3.5vw] shrink-0 overflow-hidden rounded-full bg-black/10 max-sm:size-[12vw]">
                                <Image
                                    src={author.photoUrl}
                                    fill
                                    alt={author.name || "Author"}
                                    sizes="80px"
                                    className="object-cover"
                                />
                            </div>
                        )}

                        <div>
                            {author.name && (
                                <p className="mb-[0.2vw] font-aeonik text-[1.65vw] leading-[1.2] text-[#111111] max-sm:text-[3.8vw]">
                                    {author.name}
                                </p>
                            )}

                            {author.role && (
                                <p className="font-aeonik text-[1.15vw] leading-[1.3] text-[#777777] max-sm:text-[3.2vw]">
                                    {author.role}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <div className="next-share-socials flex gap-[1.5vw] max-sm:gap-[3vw]">
                    <FacebookShareButton url={pageUrl} quote={title}>
                        <svg
                            width="27"
                            height="25"
                            className="w-full h-full group"
                            viewBox="0 0 27 25"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M9.39509 24.4548H14.5152V14.2547H19.1285L19.6354 9.18645H14.5152V6.62687C14.5152 6.28914 14.6501 5.96524 14.8901 5.72643C15.1302 5.48761 15.4558 5.35345 15.7953 5.35345H19.6354V0.259766H15.7953C14.0978 0.259766 12.4699 0.930584 11.2697 2.12465C10.0694 3.31871 9.39509 4.93821 9.39509 6.62687V9.18645H6.83502L6.32812 14.2547H9.39509V24.4548Z"
                                fill="#1a1a1a"
                                className="group-hover:fill-[#ff5f00] duration-500"
                            />
                        </svg>
                    </FacebookShareButton>

                    <TwitterShareButton url={pageUrl} title={title}>
                        <svg
                            width="26"
                            height="25"
                            className="w-full h-full group"
                            viewBox="0 0 26 25"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M19.4996 2.07422H23.0124L15.3388 10.8669L24.3672 22.8338H17.299L11.7589 15.5774L5.42699 22.8338H1.91088L10.1179 13.4259L1.46094 2.07585H8.70912L13.7092 8.70721L19.4996 2.07422ZM18.2643 20.7264H20.2113L7.64562 4.07197H5.55788L18.2643 20.7264Z"
                                fill="#1a1a1a"
                                className="group-hover:fill-[#ff5f00] duration-500"
                            />
                        </svg>
                    </TwitterShareButton>

                    <WhatsappShareButton url={pageUrl} title={title} separator=" — ">
                        <svg
                            width="31"
                            className="w-full h-full group"
                            height="31"
                            viewBox="0 0 31 31"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M23.9609 6.19927C22.8148 5.04191 21.4497 4.12423 19.9453 3.49973C18.4409 2.87522 16.8273 2.55638 15.1984 2.56177C8.37344 2.56177 2.81094 8.12427 2.81094 14.9493C2.81094 17.1368 3.38594 19.2618 4.46094 21.1368L2.71094 27.5618L9.27344 25.8368C11.0859 26.8243 13.1234 27.3493 15.1984 27.3493C22.0234 27.3493 27.5859 21.7868 27.5859 14.9618C27.5859 11.6493 26.2984 8.53677 23.9609 6.19927ZM15.1984 25.2493C13.3484 25.2493 11.5359 24.7493 9.94844 23.8118L9.57344 23.5868L5.67344 24.6118L6.71094 20.8118L6.46094 20.4243C5.43287 18.7831 4.88709 16.8859 4.88594 14.9493C4.88594 9.27427 9.51094 4.64927 15.1859 4.64927C17.9359 4.64927 20.5234 5.72427 22.4609 7.67427C23.4205 8.6291 24.1808 9.76495 24.698 11.0159C25.2151 12.2669 25.4787 13.6081 25.4734 14.9618C25.4984 20.6368 20.8734 25.2493 15.1984 25.2493ZM20.8484 17.5493C20.5359 17.3993 19.0109 16.6493 18.7359 16.5368C18.4484 16.4368 18.2484 16.3868 18.0359 16.6868C17.8234 16.9993 17.2359 17.6993 17.0609 17.8993C16.8859 18.1118 16.6984 18.1368 16.3859 17.9743C16.0734 17.8243 15.0734 17.4868 13.8984 16.4368C12.9734 15.6118 12.3609 14.5993 12.1734 14.2868C11.9984 13.9743 12.1484 13.8118 12.3109 13.6493C12.4484 13.5118 12.6234 13.2868 12.7734 13.1118C12.9234 12.9368 12.9859 12.7993 13.0859 12.5993C13.1859 12.3868 13.1359 12.2118 13.0609 12.0618C12.9859 11.9118 12.3609 10.3868 12.1109 9.76177C11.8609 9.16177 11.5984 9.23677 11.4109 9.22427H10.8109C10.5984 9.22427 10.2734 9.29927 9.98594 9.61177C9.71094 9.92427 8.91094 10.6743 8.91094 12.1993C8.91094 13.7243 10.0234 15.1993 10.1734 15.3993C10.3234 15.6118 12.3609 18.7368 15.4609 20.0743C16.1984 20.3993 16.7734 20.5868 17.2234 20.7243C17.9609 20.9618 18.6359 20.9243 19.1734 20.8493C19.7734 20.7618 21.0109 20.0993 21.2609 19.3743C21.5234 18.6493 21.5234 18.0368 21.4359 17.8993C21.3484 17.7618 21.1609 17.6993 20.8484 17.5493Z"
                                fill="#1a1a1a"
                                className="group-hover:fill-[#ff5f00] duration-500"
                            />
                        </svg>
                    </WhatsappShareButton>

                    <LinkedinShareButton url={pageUrl} title={title}>
                        <svg
                            className="w-full h-full group"
                            width="27"
                            height="25"
                            viewBox="0 0 27 25"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M23.9005 14.683V22.64H19.2332V15.2157C19.2332 13.3502 18.5578 12.0778 16.8689 12.0778C15.5794 12.0778 14.8113 12.9362 14.4742 13.7654C14.3509 14.0619 14.3192 14.4749 14.3192 14.8901V22.64H9.64971C9.64971 22.64 9.71299 10.0667 9.64971 8.76305H14.3192V10.7299L14.2887 10.7752H14.3192V10.7299C14.9389 9.78638 16.0463 8.43739 18.5262 8.43739C21.5974 8.43739 23.9005 10.4215 23.9005 14.683ZM4.76634 2.07422C3.17019 2.07422 2.125 3.10941 2.125 4.47133C2.125 5.80305 3.13964 6.86951 4.70524 6.86951H4.73579C6.36467 6.86951 7.37604 5.80305 7.37604 4.47133C7.34767 3.10941 6.36467 2.07422 4.76634 2.07422ZM2.40212 22.64H7.06946V8.76305H2.40212V22.64Z"
                                fill="#1a1a1a"
                                className="group-hover:fill-[#ff5f00] duration-500"
                            />
                        </svg>
                    </LinkedinShareButton>
                </div>

                {tocItems.length > 0 && (
                    <nav data-lenis-prevent className="toc flex h-[20vw] overflow-y-auto overflow-hidden w-full flex-col gap-[1vw] border-t border-black/10 pt-[2vw] max-sm:gap-[3vw] max-sm:pt-[6vw]">
                        <p className="font-aeonik text-[0.85vw] uppercase tracking-[0.12em] text-[#111111] max-sm:text-[3.2vw]">
                            Table of contents
                        </p>

                        <ul className="m-0 flex list-none flex-col gap-[1vw] pl-[1vw] max-sm:gap-[2.5vw]">
                            {tocItems.map((item, index) => (
                                <li key={item.id} className="m-0 p-0">
                                    <button
                                        ref={(el) => {
                                            tocButtonRefs.current[index] = el;
                                        }}
                                        type="button"
                                        onClick={() => handleTocClick(item.id)}
                                        className="block w-full border-0 bg-transparent p-0 text-left font-aeonik text-[1vw] leading-[1.35] text-[#9ca3af] transition-all duration-300 hover:text-[#111111]! max-sm:text-[3.8vw]"
                                    >
                                        {truncateText(item.title, 20)}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
            </div>
        </aside>
    );
}
