"use client";
import Copy from "../Animations/Copy";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
gsap.registerPlugin(ScrollTrigger);

const Intro = () => {
  return (
    <section
      className="w-screen h-fit px-[4vw] pt-[7%] pb-[7%] mt-[100vh] overflow-hidden dark bg-[#fefefe] z-[10] relative max-sm:px-[7vw] max-sm:pt-[15%]"
      id="about"
    >
      <div className="w-full flex justify-between text-[#1a1a1a] max-sm:flex-col ">
        <div className="flex gap-[1vw] items-center h-fit max-sm:gap-[2.5vw]">
          <span className="w-[5px] h-[5px] rounded-full bg-[#111111]" />
          <Copy>
            <p className="text-[1.1vw] uppercase max-sm:text-[3.5vw]">About us</p>
          </Copy>
        </div>
         <div className="w-[58%] text-[#111111]">

            <h2 className="second-split font-aeonik! text-[3.2vw] leading-[1]">
              From Concept to Conversion We&apos;re Changing the Face of Web.
            </h2>

            <p className="second-split mt-8 text-[1.45vw] leading-[1.5] text-black/65">
              We unravel complex design challenges through meticulous user
              research, expert analysis, prototyping, and collaborative design
              with users and stakeholders. Harnessing the power of cutting-edge
              tools and our proprietary approach we craft delightful and
              intuitive experiences.
            </p>

            <p className="second-split mt-8 w-[85%] text-[1.55vw] leading-[1.4] text-black/65">
              <strong>Wh</strong>at you <strong>ju</strong>st{" "}
              <strong>ex</strong>perienced is <strong>cal</strong>led{" "}
              <strong>bio</strong>nic <strong>rea</strong>ding.
              <br /> <strong>Le</strong>arn <strong>mo</strong>re{" "}
              <strong>ab</strong>out it <strong>he</strong>re.
            </p>
            <Link
              key="#"
              href="#"
              className="px-[2vw] w-fit py-[0.7vw] mt-[3vw] bg-[#111111] flex justify-center group items-center overflow-hidden gap-[1vw] text-white font-aeonik text-[1.45vw] fadeup "
              scroll={false}
            >
              <span className="w-[0.5vw] h-[0.5vw] bg-[#ff5f00] group-hover:scale-[20] group-hover:bg-[#ff5f00] group-hover:duration-[0.3s] duration-[0.3s] ease-out group-hover:translate-x-[2.5vw]" />
              <span className="relative inline-block z-[2] group-hover:text-white group-hover:translate-x-[-25%] duration-400 ease-out">
                Say Hi
              </span>
            </Link>


          </div>
      </div>
    </section>
  );
};

export default Intro;
