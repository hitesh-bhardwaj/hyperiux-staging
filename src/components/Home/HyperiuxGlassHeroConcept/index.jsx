"use client";

import React, { Suspense, useEffect, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import GlassHeroModel from "./GlassHeroModelShader";

function VideoEnvironment({
  src = "/assets/models/bg-video.mp4",
}) {
  const { scene } = useThree();

  const video = useMemo(() => {
    if (typeof window === "undefined") return null;

    const el = document.createElement("video");
    el.src = src;
    el.crossOrigin = "anonymous";
    el.loop = true;
    el.muted = true;
    el.playsInline = true;
    el.autoplay = true;
    el.preload = "auto";

    return el;
  }, [src]);

  useEffect(() => {
    if (!video) return;

    const texture = new THREE.VideoTexture(video);

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    scene.background = texture;

    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        console.warn("Video autoplay blocked:", error);
      }
    };

    playVideo();

    return () => {
      scene.background = null;

      texture.dispose();

      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [scene, video]);

  return null;
}

export default function GlassGradientScene({
  modelSrc = "/assets/models/hyperiexLogoNo2.glb",
  videoSrc = "/assets/models/bg-video.mp4",
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
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 35 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
      >
        <VideoEnvironment src={videoSrc} />

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
              cursorRotationYLeftStrength={0.55}
              cursorRotationYRightStrength={0.18}
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