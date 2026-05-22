import FloatingBlocks from "@/components/3D/FloatingBlocks";
import { MainButton } from "../../Buttons";

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

export default function About({ isMobile }) {
  return (
    <section id="about" className="second-section-portal relative inset-0 z-40 mt-[-3vw] h-[40vw] w-screen overflow-hidden bg-white opacity-0 max-sm:mt-0 max-sm:h-[85vh] max-sm:opacity-100">
      {!isMobile && (
        <FloatingBlocks
          modelPosition={[-2.2, 0.3, 0]}
          modelRotation={[Math.PI / 2, 0, 0]}
          modelScale={0.0035}
        />
      )}

      <div className="pointer-events-none absolute inset-0 z-30 flex h-full w-full items-start justify-end px-[5vw] max-sm:h-[80vh] max-sm:items-center max-sm:justify-center max-sm:px-[7vw]">
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
            What you just experienced is called bionic reading. Learn more about
            it here.
          </p>

          <div className="about-cta mt-[3vw] h-fit w-fit translate-y-[50%] opacity-0 max-sm:mt-[8vw]">
            <MainButton href={"#"} btnText={"Say Hi"} />
          </div>
        </div>
      </div>
    </section>
  );
}
