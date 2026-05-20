"use client";
import InteractiveOrangeGradientCanvas from "@/components/Footer/InteractiveOrangeGradientCanvas";
import React, { useRef } from "react";

const page = () => {
  const bottomFooterRef = useRef(null);
  return (
    <section className="w-screen h-screen">
      <InteractiveOrangeGradientCanvas
        trailWidth={20}
  trailBlur={80}
  trailFade={0.038}
  trailLerp={0.2}
  pressureStrength={1.45}
  pressureWidthBoost={1.35}
  velocityForce={1.4}
  swirlStrength={1.8}
  swirlRadius={0.22}
  forceRevealBoost={0.75}
  fluidEdgeDistortion={0.42}
      />
    </section>
  );
};

export default page;
