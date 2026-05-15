"use client";

import gsap from "gsap";
import Image from "next/image";
import React, { useEffect } from "react";

export const Loader = () => {
    useEffect(() => {
        gsap.set(".inner-logo", {
            z: 0,
            scale: 1,
            transformPerspective: 900,
            transformStyle: "preserve-3d",
            force3D: true,
            transformOrigin: "center center",
        });
        const cl = gsap.timeline()
        cl.to(".third-col", {
            translateY: "-20%",
            ease: "power3.inOut",
            duration: 0.8,
            delay: 0.6
        })
            .to(".second-col", {
                translateY: "-30%",
                ease: "power3.inOut",
                delay: -0.9,
                duration: 1,
            })
        cl.to(".third-col", {
            translateY: "-90%",
            ease: "power3.inOut",
            duration: 1.5,
        })
            .to(".second-col", {
                translateY: "-90%",
                ease: "power3.inOut",
                delay: -1.4,
                duration: 1.5,
            })
            .to(".loader-num", {
                translateY: "-100%",
                stagger: 0.08,
                ease: "power3.in",
                delay: -0.1,
                duration: 0.5
            })

        const tl = gsap.timeline();
        tl.to(".strip-overlay", {
            clipPath: "inset(0% 0% 0% 20%)",
            delay: 0.5,
            ease: "power3.inOut",
            duration: 0.8,
        }, "<")
        tl.to(".strip-overlay", {
            clipPath: "inset(0% 0% 0% 100%)",
            // delay: 0.5,
            ease: "power3.inOut",
            duration: 1.2,
        })
            .to(".clip-overlay-top", {
                clipPath: "inset(100% 0% 0% 0%)",
                ease: "power3.inOut",
                duration: 1,
                delay: 0.5,
            })
            .to(
                ".clip-overlay-bottom",
                {
                    clipPath: "inset(0% 0% 100% 0%)",
                    ease: "power3.inOut",
                    duration: 1,
                },
                "<"
            )
            .to(
                ".strip-overlay",
                {
                    background: "#ffffff",
                    duration: 0.7,
                    delay: -0.8,
                    ease: "power3.inOut",
                },

            )
            .to(
                ".loader",
                {
                    // background:"#ffffff",
                    opacity: 0,
                    duration: 0.7,
                    delay: -0.4,
                    ease: "power3.inOut",
                },

            )
    }, []);

    return (
        <section className="fixed inset-0 z-[9999] h-screen w-screen overflow-hidden loader">


            <div className="overlay absolute inset-0 z-[2] flex h-screen w-screen items-center justify-center">
                <div
                    className="clip-overlay-top absolute inset-0 z-[3] flex h-screen w-screen items-center justify-center overflow-hidden bg-white"
                    style={{ clipPath: "inset(53% 0% 0% 0%)" }}
                >
                    <div className="size-[15vw] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
                        <svg width="500" height="501" viewBox="0 0 500 501" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full masked-svg">
                            <path d="M40 13H106.261V222.826H40V13Z" fill="#111111" />
                            <path d="M459.654 487.869H393.394V278.043H459.654V487.869Z" fill="#111111" />
                            <path d="M40.1406 278.043V487.869H106.401V322.217L198.062 287.983V223.931L40.1406 278.043Z" fill="#111111" />
                            <path d="M393.527 178.653V13.0007H460.892V222.826L291.927 290.889V222.826L393.527 178.653Z" fill="#111111" />
                            <path d="M246.651 306.756L295.242 285.774C295.242 263.779 295.242 249.995 295.242 228L257.334 210.358C254.732 209.147 251.761 208.996 249.051 209.938L201.373 226.5V285.774L246.651 306.756ZM201.373 226.5L246.651 249.33M295.242 228L246.651 249.33M246.651 249.33V306.756" stroke="#111111" stroke-width="7" />
                        </svg>

                    </div>
                    <div className="size-[15vw] image-clip">
                        <Image src={"/hyperiux-icon-black.svg"} alt="logo" className="w-full h-full" width={100} height={100} />
                    </div>
                </div>

                <div
                    className="clip-overlay-bottom absolute bottom-0 left-0 z-[3] flex h-screen w-screen items-center justify-center overflow-hidden bg-white"
                    style={{ clipPath: "inset(0% 0% 53% 0%)" }}

                >
                     <div className="size-[15vw] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
                        <svg width="500" height="501" viewBox="0 0 500 501" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full masked-svg">
                            <path d="M40 13H106.261V222.826H40V13Z" fill="#111111" />
                            <path d="M459.654 487.869H393.394V278.043H459.654V487.869Z" fill="#111111" />
                            <path d="M40.1406 278.043V487.869H106.401V322.217L198.062 287.983V223.931L40.1406 278.043Z" fill="#111111" />
                            <path d="M393.527 178.653V13.0007H460.892V222.826L291.927 290.889V222.826L393.527 178.653Z" fill="#111111" />
                            <path d="M246.651 306.756L295.242 285.774C295.242 263.779 295.242 249.995 295.242 228L257.334 210.358C254.732 209.147 251.761 208.996 249.051 209.938L201.373 226.5V285.774L246.651 306.756ZM201.373 226.5L246.651 249.33M295.242 228L246.651 249.33M246.651 249.33V306.756" stroke="#111111" stroke-width="7" />
                        </svg>

                    </div>
                    <div className="size-[15vw]  image-clip">
                        <Image src={"/hyperiux-icon-black.svg"} alt="logo" className="w-full h-full" width={100} height={100} />
                    </div>
                </div>

                <div
                    className="strip-overlay absolute left-0 top-[46.5%] z-[4] flex h-[7vh] w-screen items-center justify-center bg-white overflow-hidden [perspective:900px]"
                    style={{ clipPath: "inset(0% 0% 0% 0%)" }}
                >

                    <div className="inner-logo size-[15vw] [transform-style:preserve-3d]">
                        <Image src={"/hyperiux-icon-black.svg"} alt="logo" className="w-full h-full" width={100} height={100} />
                    </div>
                </div>
                <div className="absolute top-[46%] left-[2%] text-[3vw] font-medium text-white z-[6] flex h-[3.5vw] overflow-hidden">

                    <div className="w-[2vw] h-fit flex flex-col second-col loader-num ">
                        <span>0</span>
                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                        <span>4</span>
                        <span>5</span>
                        <span>6</span>
                        <span>7</span>
                        <span>8</span>
                        <span>9</span>
                    </div>
                    <div className="w-[2vw] h-fit flex flex-col third-col loader-num">
                        <span>0</span>
                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                        <span>4</span>
                        <span>5</span>
                        <span>6</span>
                        <span>7</span>
                        <span>8</span>
                        <span>9</span>
                    </div>
                    <span className="loader-num" >
                        %

                    </span>


                </div>
            </div>
        </section>
    );
};