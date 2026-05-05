"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import GlassHeroModel from "./GlassHeroModel";

export default function HyperiuxGlassHeroConcept({
  modelSrc = "/assets/models/hyperiexLogoNo2.glb",
  modelScale = 0.075,
  modelThickness = 1.45,
  modelPosition = [0, 0, 1.4],
  modelRotation = [0, 0, 0],
}) {
  const commonModelProps = {
    src: modelSrc,
    scale: modelScale,
    thickness: modelThickness,
    position: modelPosition,
    rotation: modelRotation,
  };

  return (
    <section className="relative h-screen w-full overflow-hidden ">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 35 }}
        gl={{
          antialias: true,
          alpha: true,
          premultipliedAlpha: false,
          powerPreference: "high-performance",
        }}
        dpr={[2, 2.5]}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <color attach="background" args={["#ffffff"]} />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[-1, 0, -0.5]}
          intensity={10.6}
          color="#ffffff"
        />
        <Suspense fallback={null}>
          <GlassHeroModel
            {...commonModelProps}
            transmission={2.5}
            glassThickness={0.5}
            roughness={0.0}
            cursorRotationYLeftStrength={0.18}
            cursorRotationYRightStrength={0.55}
            ior={1}
            chromaticAberration={1.5}
            distortion={1.5}
            temporalDistortion={0}
          />
        </Suspense>
      </Canvas>
    </section>
  );
}
