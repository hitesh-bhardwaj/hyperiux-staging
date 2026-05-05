"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import GlassHeroModel from "./GlassHeroModelShader";
import { WebGLBackground } from "@/components/Glass/WebGLBackground";

export default function GlassGradientScene({
  modelSrc = "/assets/models/hyperiexLogoNo2.glb",
  modelScale = 0.075,
  modelThickness = 1.45,
  modelPosition = [0, 0, 1.4],
  modelRotation = [0, 0, 0],
  modelGroupRef = null,
}) {
  const commonModelProps = {
    src: modelSrc,
    scale: modelScale,
    thickness: modelThickness,
    position: modelPosition,
    rotation: modelRotation,
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 35 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
      >
        <WebGLBackground
          pixelationEnabled={false}
          pixelSize={1.0 / 30.0}
          radius={0.38}
          intensity={8}
          velocityStrength={90}
          mouseLerp={0.08}
          velocityLerp={0.08}
          movingLerp={0.08}
          velocityDecay={0.92}
          fadeDelay={300}
        />

        <ambientLight intensity={0.35} />
        <pointLight position={[0, -2, 3]} intensity={3.8} color="#ff5a18" />
        <pointLight position={[2.5, 2, 3]} intensity={1.6} color="#ffffff" />
        <Suspense fallback={null}>
          <group ref={modelGroupRef}>
            <GlassHeroModel
              {...commonModelProps}
              transmission={1}
              glassThickness={2.5}
              roughness={0.0}
              ior={1}
              chromaticAberration={2.5}
              distortion={2.4}
              temporalDistortion={0}
            />
          </group>
        </Suspense>
      </Canvas>
    </section>
  );
}
