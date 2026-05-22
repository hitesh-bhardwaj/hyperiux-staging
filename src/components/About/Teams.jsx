import React from "react";
import Image from "next/image";
import { Linkedin } from "../Buttons";
import HeadAnim from "../Animations/HeadAnim";
import Copy from "../Animations/Copy";

const teamImages = [
  "/assets/images/aboutpage/bhaskar-portrait.png",
  "/assets/images/aboutpage/bhaskar-portrait.png",
  "/assets/images/aboutpage/bhaskar-portrait.png",
  "/assets/images/aboutpage/bhaskar-portrait.png",
  "/assets/images/aboutpage/bhaskar-portrait.png",
  "/assets/images/aboutpage/bhaskar-portrait.png",
  "/assets/images/aboutpage/bhaskar-portrait.png",
 
];

const TeamImage = ({ src, alt = "Team member" }) => {
  return (
    <div className="team-img-container group relative h-full w-full overflow-hidden rounded-[1.5vw] bg-[#d9d9d9]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 30vw"
        className="h-full w-full object-cover grayscale transition-all duration-700 ease-in-out group-hover:scale-[1.04] group-hover:grayscale-0"
      />
      <div className="p-[2vw] absolute inset-0 h-full w-full flex items-end justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out">
        <p className="relative z-2">
        Lorem ipsum dolor sit amet, consectetur
        
        </p>
        <div className=" absolute top-[5%] right-[5%]">
          <Linkedin/>

        </div>

      <div className="w-full h-[5vw] bg-linear-to-t from-black to-black/0 absolute bottom-0 left-0" />
      </div>
    </div>
  );
};

const Teams = () => {
  return (
    <section className="relative w-screen overflow-hidden bg-white px-[5vw] pb-[12vw] pt-[8vw] text-[#111111] max-sm:px-[6vw] max-sm:py-[18vw]">
      <div className="pointer-events-none absolute inset-0 z-0 flex px-[2.7vw] max-sm:hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-full flex-1 border-l border-black/5"
          />
        ))}
        <div className="h-full border-l border-black/5" />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between max-sm:block">
          <div className="w-[50%] max-sm:w-full">
            {/* <h2 className="font-aeonik text-[5.4vw] max-sm:text-[13vw] max-sm:leading-[1]">
            <HeadAnim>
              The minds behind the magic!
            </HeadAnim>
            </h2> */}
          </div>

          <div className="w-[40%] pt-[10.8vw] max-sm:w-full max-sm:pt-[10vw]">
            <Copy>

            <p className="font-aeonik text-[#111111] max-md:text-[1.7vw] max-sm:w-full max-sm:text-[3.8vw]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ut
              turpis massa. Maecenas vulputate leo eu enim tempus, pulvinar
              imperdiet ante mattis. Sed porttitor est augue, quis pellentesque
              lorem rutruma. Lorem ipsum dolor sit amet, consectetur adipiscing
              elit. Nulla ut turpis massa. Maecenas vulputate leo eu enim
              tempus, pulvinar imperdiet ante mattis.
            </p>
            </Copy>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex gap-[1.5vw] max-sm:mt-[14vw] max-sm:flex-col max-sm:gap-[10vw]">
        <div className="flex flex-col gap-[15vw] max-sm:gap-[10vw]">
          <div className="flex w-full gap-[1.5vw] max-sm:flex-col max-sm:gap-[10vw]">
            <div className="h-fit w-[28vw] space-y-[1vw] max-sm:w-full">
              <div className="space-y-[0.5vw]">
                <p className="font-medium">Bhaskar Varshney</p>
                <p>CEO</p>
              </div>

              <div className="h-[32vw] w-full overflow-hidden rounded-[1.5vw] max-sm:h-[90vw]">
                <TeamImage src={teamImages[0]} alt="Bhaskar Varshney" />
              </div>
            </div>

            <div className="h-fit w-[14vw] space-y-[1vw] max-sm:w-full">
              <div className="space-y-[0.5vw]">
                <p className="font-medium">Bhaskar Varshney</p>
                <p>CEO</p>
              </div>

              <div className="h-[17vw] w-full overflow-hidden rounded-[1.5vw] max-sm:h-[70vw]">
                <TeamImage src={teamImages[1]} alt="Bhaskar Varshney" />
              </div>
            </div>
          </div>

          <div className="flex w-full gap-[1.5vw] max-sm:flex-col max-sm:gap-[10vw]">
            <div className="h-fit w-[28vw] space-y-[1vw] max-sm:w-full">
              <div className="space-y-[0.5vw]">
                <p className="font-medium">Bhaskar Varshney</p>
                <p>CEO</p>
              </div>

              <div className="h-[32vw] w-full overflow-hidden rounded-[1.5vw] max-sm:h-[90vw]">
                <TeamImage src={teamImages[2]} alt="Bhaskar Varshney" />
              </div>
            </div>

            <div className="h-fit w-[14vw] space-y-[1vw] max-sm:w-full">
              <div className="space-y-[0.5vw]">
                <p className="font-medium">Bhaskar Varshney</p>
                <p>CEO</p>
              </div>

              <div className="h-[17vw] w-full overflow-hidden rounded-[1.5vw] max-sm:h-[70vw]">
                <TeamImage src={teamImages[3]} alt="Bhaskar Varshney" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-[20vw] flex w-full gap-[1.5vw] max-sm:mt-0 max-sm:flex-col max-sm:gap-[10vw]">
          <div className="h-fit w-[28vw] space-y-[1vw] max-sm:w-full">
            <div className="space-y-[0.5vw]">
              <p className="font-medium">Bhaskar Varshney</p>
              <p>CEO</p>
            </div>

            <div className="h-[32vw] w-full overflow-hidden rounded-[1.5vw] max-sm:h-[90vw]">
              <TeamImage src={teamImages[4]} alt="Bhaskar Varshney" />
            </div>
          </div>

          <div className="flex flex-col gap-[10vw] max-sm:gap-[10vw]">
            <div className="h-fit w-[14vw] space-y-[1vw] max-sm:w-full">
              <div className="space-y-[0.5vw]">
                <p className="font-medium">Bhaskar Varshney</p>
                <p>CEO</p>
              </div>

              <div className="h-[17vw] w-full overflow-hidden rounded-[1.5vw] max-sm:h-[70vw]">
                <TeamImage src={teamImages[5]} alt="Bhaskar Varshney" />
              </div>
            </div>

            <div className="h-fit w-[14vw] space-y-[1vw] max-sm:w-full">
              <div className="space-y-[0.5vw]">
                <p className="font-medium">Bhaskar Varshney</p>
                <p>CEO</p>
              </div>

              <div className="h-[17vw] w-full overflow-hidden rounded-[1.5vw] max-sm:h-[70vw]">
                <TeamImage src={teamImages[6]} alt="Bhaskar Varshney" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Teams;