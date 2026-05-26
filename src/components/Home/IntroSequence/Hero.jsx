import HyperiuxGlassHeroScene from "@/components/3D/HyperiuxGlassHeroScene";
import Image from "next/image";

export default function Hero({
  isMobile,
  modelGroupRef,
  parentModelGroupRef,
  modelIntroRotationOffsetRef,
}) {
  return (
    <section className="first-section-portal pointer-events-none inset-0 z-2 h-screen w-screen overflow-hidden bg-black">
      <div className="relative h-screen w-full overflow-hidden">
        {isMobile && (
          <div className="hidden max-sm:block">
            <div className="h-screen w-full">
              <Image
                src="/assets/images/homepage/hero-bg.png"
                alt="hero-bg"
                className="absolute inset-0 h-full w-full object-cover"
                width={900}
                height={900}
                priority
              />
            </div>

            <div className="absolute inset-0 bg-black/20" />
          </div>
        )}

        {!isMobile && (
          <HyperiuxGlassHeroScene
            showControls={false}
            modelSrc="/assets/models/hyperiexLogoNo2.glb"
            videoSrc="/assets/models/bg-shader-noise-video.mp4"
            modelScale={0.06}
            modelThickness={1.25}
            modelPosition={[1.1, 0, 1.4]}
            modelRotation={[0, 0, 0]}
            modelGroupRef={modelGroupRef}
            parentModelGroupRef={parentModelGroupRef}
            modelIntroRotationOffsetRef={modelIntroRotationOffsetRef}
          />
        )}

        <div className="pointer-events-none absolute inset-0 z-20 flex h-full w-full flex-col justify-center gap-[4vw] px-[5vw] pb-[8%] pt-[10%] max-sm:justify-start max-sm:pt-[32%]">
          <h1 className="first-split font-aeonik! flex flex-col text-[7.5vw] leading-[1.1]! text-white opacity-0 max-sm:text-[12.5vw]">
            <span>Digital</span>
            <span>Experience</span>
            <span>Design Agency</span>
          </h1>

          <p className="first-para mt-[-1vw] w-[53%] text-[1.4vw] text-white opacity-0 max-sm:mt-[4.2vw] max-sm:w-full max-sm:text-[4.2vw] max-sm:leading-normal">
            As a leading UI UX and web design agency, we harness the power of{" "}
            <span className="font-medium">
              Emotion, Design, Technology, and Neuromarketing
            </span>{" "}
            to craft digital brand experiences that drive real results.
          </p>
        </div>
      </div>
    </section>
  );
}
