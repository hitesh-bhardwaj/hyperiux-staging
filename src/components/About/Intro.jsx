"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FloatingBlocks from "../3D/FloatingBlocks";
import { MainButton } from "../Buttons";
gsap.registerPlugin(ScrollTrigger);

const content = [
  [
    ["W", "e"],
    ["un", "ravel"],
    ["com", "plex"],
    ["de", "sign"],
    ["chal", "lenges"],
    ["thro", "ugh"],
    ["me", "ticulous"],
    ["us", "er"],
    ["re", "search,"],
  ],
  [
    ["ex", "pert"],
    ["a", "nalysis,"],
    ["pro", "totyping,"],
    ["a", "nd"],
    ["col", "laborative"],
    ["de", "sign"],
    ["wi", "th"],
    ["us", "ers"],
    ["a", "nd"],
    ["stake", "holders."],
    ["Har", "nessing"],
    ["the", ""],
    ["pow", "er"],
    ["of", ""],
    ["cut", "ting-edge"],
    ["to", "ols"],
    ["a", "nd"],
    ["o", "ur"],
    ["pro", "prietary"],
  ],
  [
    ["ap", "proach"],
    ["w", "e"],
    ["cr", "aft"],
    ["de", "lightful"],
    ["a", "nd"],
    ["in", "tuitive"],
    ["ex", "periences."],
  ],
];

const Intro = () => {

  return (
     <section
            // ref={secondSectionRef}
            className="second-section-portal relative inset-0 z-2 h-[50vw] w-screen overflow-hidden bg-white  max-sm:mt-0 max-sm:h-[85vh] max-sm:opacity-100"
          >
            {/* {!isMobile && ( */}
              <FloatingBlocks
                modelPosition={[-1.8, 0, 0]}
                modelRotation={[Math.PI / 2, 0, 0]}
                modelScale={0.0028}
              />
            {/* )} */}
    
            <div className="pointer-events-none inset-0 z-30 flex h-full w-full items-center justify-end px-[5vw] max-sm:h-[80vh] max-sm:items-center max-sm:justify-center max-sm:px-[7vw]">
              <div className="pointer-events-auto w-[60%] text-[#111111] max-sm:w-full">
                <h2 className="second-split font-aeonik! text-[3.2vw] leading-none max-sm:pb-[5vw] max-sm:text-[10vw] max-sm:leading-[1.1]">
                  <div className="my-auto mr-[4vw] inline-block h-full translate-y-[-0.9vw] text-[1.2vw] text-black/50 max-sm:mr-[3vw] max-sm:block max-sm:translate-y-0 max-sm:pb-[6vw] max-sm:text-[3.5vw]">
                    About Us
                  </div>
                  From Concept to Conversion We&apos;re Changing the Face of Web.
                </h2>
    
                <p className="second-split mt-[4.5vw] text-[1.45vw] leading-normal text-black/65 max-sm:text-[4.5vw]">
                  {content.map((line, lineIndex) => (
                    <span key={lineIndex}>
                      {line.map(([highlight, rest], wordIndex) => (
                        <span key={wordIndex}>
                          <strong className="font-semibold text-black/65">
                            {highlight}
                          </strong>
                          {rest}{" "}
                        </span>
                      ))}
                      {lineIndex !== content.length - 1 && <br />}
                    </span>
    
                  ))}
                </p>
    
                <p className="second-split mt-8 w-[70%] text-[1.55vw] leading-[1.4] text-black/65 max-sm:mt-12 max-sm:w-full max-sm:text-[4.5vw]">
                  What you just experienced is called bionic reading. Learn more
                  about it here.
                </p>
    
                <div className="about-cta-btn mt-[3vw] h-fit w-fit max-sm:mt-[8vw]">
                  <MainButton href={"#"} btnText={"Say Hi"} />
                </div>
              </div>
            </div>
          </section>
  );
};

export default Intro;
