import FluidOrangeRevealShaderCanvas from "@/components/Footer/InteractiveOrangeGradientCanvas";
import React from "react";

const page = () => {
  return (
    <div className="w-screen h-[25vw] relative">
      <FluidOrangeRevealShaderCanvas
       speed={1}
  overlayOpacity={1}
  trailLerp={0.22}
  trailWidth={100}
  trailBlur={150}
  trailFade={0.035}
      />
    </div>
  );
};

export default page;
