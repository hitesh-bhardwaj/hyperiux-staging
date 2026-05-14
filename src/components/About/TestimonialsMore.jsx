"use client";
import gsap from "gsap";
import Image from "next/image";
import React, { useEffect } from "react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const data = [
  {
    content:
      "Enigma Digital's mastery of web design and development is truly unparalleled. Their ability to craft a website that not only captured our essence but also transformed our digital presence is nothing short of miraculous. We are beyond thrilled with the results and can't thank the Enigma team enough for their tireless dedication and creativity. We wholeheartedly recommend Enigma Digital to anyone seeking a top-notch digital partner!",
    name: "Paul Lees",
    translate: "",
    invert: false,
    designation: "CEO, Patronum",
    img: "/assets/images/aboutpage/paul.png",
    color: "bg-[#215CFF]",
  },
  {
    content:
      "Enigma Digital's mastery of web design and development is truly unparalleled. Their ability to craft a website that not only captured our essence but also transformed our digital presence is nothing short of miraculous. We are beyond thrilled with the results and can't thank the Enigma team enough for their tireless dedication and creativity.",
    name: "Paul Lees",
    invert: true,
    translate: "translate-x-[2%]",
    designation: "CEO, Patronum",
    img: "/assets/images/aboutpage/paul.png",
    color: "bg-[#FFEA47]",
  },
  {
    content:
      "Enigma Digital's mastery of web design and development is truly unparalleled. Their ability to craft a website that not only captured our essence but also transformed our digital presence is nothing short of miraculous.",
    name: "Paul Lees",
    invert: false,
    translate: "translate-x-[4%]",
    designation: "CEO, Patronum",
    img: "/assets/images/aboutpage/paul.png",
    color: "bg-[#FF3861]",
  },
  {
    content:
      "Enigma Digital's mastery of web design and development is truly unparalleled. Their ability to craft a website that not only captured our essence but also transformed our digital presence is nothing short of miraculous.",
    name: "Paul Lees",
    invert: false,
    translate: "translate-x-[7%]",
    designation: "CEO, Patronum",
    img: "/assets/images/aboutpage/paul.png",
    color: "bg-[#734EFF]",
  },
  {
    content:
      "Enigma Digital's mastery of web design and development is truly unparalleled. Their ability to craft a website that not only captured our essence but also transformed our digital presence is nothing short of miraculous.",
    name: "Paul Lees",
    invert: false,
    translate: "translate-x-[10%]",
    designation: "CEO, Patronum",
    img: "/assets/images/aboutpage/paul.png",
    color: "bg-[#ff6b00]",
  },
];

const TestimonialsMore = () => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([".card-1", ".card-2", ".card-3", ".card-4", ".card-5"], {
        rotateY: 80,
        // filter: "blur(10px)",
        opacity: 0,
        scale: 0.6,
      });

      gsap.set(".card-1", { rotateX: 4 });
      gsap.set(".card-2", { rotateZ: -2 });
      gsap.set(".card-3", { rotateX: 3 });
      gsap.set(".card-4", { rotateX: -1 });
      gsap.set(".card-5", { rotateX: 2 });

      if (globalThis.innerWidth > 1024) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "#testimonial-cards",
            start: "top top",
            end: "105% bottom",
            scrub: true,
          },
        });

        gsap.to(".card-1, .card-2, .card-3,.card-4,.card-5", {
          opacity: 1,
          // filter: "blur(0px)",
          scale: 0.8,
          scrollTrigger: {
            trigger: "#testimonial-cards",
            start: "top top",
            end: "10% top",
            scrub: true,
          },
        });
        tl.to(".card-1, .card-2, .card-3,.card-4,.card-5", {
          rotateY: 0,
          duration: 1.5,
          delay: -0.5,
        })
          .to(".card-1", {
            scale: 1,
            rotateZ: -3,
            rotateX: 0,
            // left: "7%",
            translateX:"10%",
            duration: 1.5,
            delay: -0.8,
          })
          .to(
            ".card-2",
            {
              scale: 1,
              yPercent: 4,
              translateX:"120%",
              duration: 1.5,
              //   delay: -1.5,
            },
            "<"
          )
          .to(
            ".card-3",
            {
              scale: 1,
              rotateZ: 3,
              rotateX: 0,
              translateX: "230%",
              duration: 1.5,
              //   delay: -1.5,
            },
            "<"
          )
          .to(
            ".card-4",
            {
              scale: 1,
              yPercent: 4,
              // rotateZ:2,
              rotateX:0,
              translateX: "340%",
              duration: 1.5,
              //   delay: -1.5,
            },
            "<"
          )
          .to(
            ".card-5",
            {
              scale: 1,
              rotateZ: 3,
              rotateX: 0,
              translateX: "450%",
              duration: 1.5,
              //   delay: -1.5,
            },
            "<"
          )
          .to(".testimonial-card-container", {
            translateX: "-90%",
            duration: 1,
            delay: -0.5,
            ease: "power1.inOut",
          });

        const cl = gsap.timeline({
          scrollTrigger: {
            trigger: "#testimonial-cards",
            start: "top 2%",
            end: "45% top",
            scrub: true,
          },
        });

        cl.to(".left-text", { xPercent: -70 })
          .to(".right-text", { xPercent: 70, delay: -0.5 })
          .to(".left-text, .right-text", { opacity: 0, delay: -0.45 });
      } else {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "#testimonial-cards",
            start: "5% top",
            end: "105% bottom",
            scrub: true,
            // markers:true,
          },
        });

        gsap.to(".card-1, .card-2, .card-3,.card-4,.card-5", {
          opacity: 1,
          filter: "blur(0px)",
          scale: 0.8,
          scrollTrigger: {
            trigger: "#testimonial-cards",
            start: "5% top",
            end: "20% top",
            scrub: true,
          },
        });
        tl.to(".card-1, .card-2, .card-3,.card-4,.card-5", {
          rotateY: 0,
          duration: 1.5,
          delay: -0.5,
        })
          .to(".card-1", {
            scale: 1,
            rotateZ: -3,
            rotateX: 0,
            // left: "7%",
            translateX:"0%",
            duration: 1.5,
            delay: -0.8,
          })
          .to(
            ".card-2",
            {
              scale: 1,
              yPercent: 4,
              // left: "96%",
              translateX:"115%",
              duration: 1.5,
              //   delay: -1.5,
            },
            "<"
          )
          .to(
            ".card-3",
            {
              scale: 1,
              rotateZ: 3,
              rotateX: 0,
               translateX:"230%",
              duration: 1.5,
              //   delay: -1.5,
            },
            "<"
          )
          .to(
            ".card-4",
            {
              scale: 1,
              yPercent: 4,
               translateX:"345%",
              duration: 1.5,
              //   delay: -1.5,
            },
            "<"
          )
          .to(
            ".card-5",
            {
              scale: 1,
              rotateZ: 3,
              rotateX: 0,
              translateX:"460%",
              duration: 1.5,
              //   delay: -1.5,
            },
            "<"
          )
          .to(".testimonial-card-container", {
            translateX: "-360%",
            duration: 1,
            delay: -0.5,
            ease: "power1.inOut",
          });

        const cl = gsap.timeline({
          scrollTrigger: {
            trigger: "#testimonial-cards",
            start: "3% 2%",
            end: "45% top",
            scrub: true,
          },
        });

        cl.to(".left-text", { translateX:"-70%" })
          .to(".right-text", { translateX: "70%", delay: -0.5 })
          .to(".left-text, .right-text", { opacity: 0, delay: -0.45 });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="h-[350vh] w-screen pt-[7%] bg-[#fefefe] relative z-2 mt-[-30vh]  max-sm:mt-0 max-sm:pt-[10vh] max-sm:h-[400vh]"
      id="testimonial-cards"
    >
      <div className="h-screen w-screen sticky top-0 z-30 overflow-hidden max-sm:h-screen">
      <div
        className="h-screen w-screen px-[4vw] flex flex-col justify-center items-center testimonial-card-container"
        style={{ perspective: "600px" }}
      >
        <h2 className="capitalize flex gap-[1.2vw] text-[8vw] max-sm:gap-[2.5vw] text-[#111111]">
          <div className="left-text">Words from </div>
          <div className="right-text">our clients!</div>
        </h2>

        {data.map((item, index) => (
          <div
            key={index}
            className={`h-[34vw] w-[26.5vw] rounded-[1.5vw] ${item.color} p-[3vw] px-[2vw] flex flex-col justify-between absolute opacity-0 scale-[0.6] z-25 max-sm:w-[80vw] max-sm:h-[50vh] max-sm:rounded-[4vw] max-sm:p-[7vw] card-${index + 1} ${item.translate} ${item.invert ? "text-[#111111]" : "text-white"}`}
          >
            <div className="space-y-[2vw] max-sm:space-y-[6vw]">
              <div className="h-[2.5vw] w-[2.5vw] overflow-hidden max-sm:w-[8vw] max-sm:h-[8vw]">
                <Image
                  src="/assets/icons/quote-icon.svg"
                  height={41}
                  width={56}
                  alt="quote-icon"
                  className={`h-full w-full ${item.invert ? "invert" : ""}`}
                />
              </div>
              <p className="text-[1.05vw] max-sm:text-[3.5vw]">
                {item.content}
              </p>
            </div>

            <div className="flex items-end justify-start w-full gap-[2vw] pt-[2vw] max-sm:items-center max-sm:gap-[4vw]">
              <div className="h-[6.5vw] w-[6.5vw] overflow-hidden rounded-full max-sm:w-[20vw] max-sm:h-[20vw]">
                <Image
                  src={item.img}
                  height={130}
                  width={130}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-[1.565vw] font-medium max-sm:text-[5vw]">
                  {item.name}
                </p>
                <p className="max-sm:text-[3vw]">{item.designation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      </div>
    </section>
  );
};

export default TestimonialsMore;
