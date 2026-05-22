"use client";

import React, { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Center,
  Clone,
  Environment,
  Float,
  MeshTransmissionMaterial,
  useGLTF,
  useVideoTexture,
} from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_VIDEO_SRC = "/assets/models/bg-shader-noise-video.mp4";
const DEFAULT_MODEL_SRC = "/assets/models/hyperiexLogoNo2.glb";

const CAMERA = { position: [0, 0, 5], fov: 35 };
const GL_CONFIG = {
  antialias: true,
  alpha: false,
  powerPreference: "high-performance",
};

const PARENT_GROUP_PROPS = {
  scale: [0, 0, 0],
  position: [1.35, -0.12, 0],
  rotation: [0, 0, 0],
};

const VIDEO_TEXTURE_OPTS = {
  muted: true,
  loop: true,
  playsInline: true,
  crossOrigin: "anonymous",
  start: true,
};

function applyVideoTextureSettings(texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
}

function HyperiuxGlassHeroVideoBackground({ src = DEFAULT_VIDEO_SRC }) {
  const { scene } = useThree();
  const texture = useVideoTexture(src, VIDEO_TEXTURE_OPTS);

  useEffect(() => {
    applyVideoTextureSettings(texture);

    const previousBackground = scene.background;
    // eslint-disable-next-line react-hooks/immutability -- scene.background is set imperatively for video backdrop
    scene.background = texture;

    const video = texture.image;
    if (!video) {
      return () => {
        scene.background = previousBackground;
      };
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      scene.background = previousBackground;
    };
  }, [scene, texture]);

  return null;
}

function HyperiuxGlassHeroModel({
  src = DEFAULT_MODEL_SRC,
  position = [0, 0, 1.4],
  rotation = [0, 0, 0],
  scale = 0.075,
  thickness = 1.45,
  reflectivity = 0,
  cursorFollow = true,
  cursorRotationStrength = 0.22,
  cursorRotationYLeftStrength = null,
  cursorRotationYRightStrength = null,
  cursorRotationXStrength = 0.5,
  cursorPositionStrength = 0.08,
  cursorLerp = 0.055,
  scrollTriggerSelector = ".container",
  scrollMoveY = 0.5,
  enableScrollMove = true,
  scrollRotateY = -3,
  glassColor = "#ffffff",
  transmission = 1,
  glassThickness = 1.35,
  roughness = 0.24,
  ior = 1.5,
  chromaticAberration = 0.12,
  anisotropy = 0.2,
  distortion = 0.1,
  distortionScale = 0.35,
  temporalDistortion = 0.06,
  backside = true,
  transmissionBuffer = null,
  externalGroupRef = null,
  introRotationOffsetRef = null,
  introRotationOffsetY = 0,
}) {
  const groupRef = useRef(null);
  const scrollOffsetRef = useRef(0);
  const scrollRotationYRef = useRef(0);
  const targetPointerRef = useRef(new THREE.Vector2(0, 0));
  const smoothPointerRef = useRef(new THREE.Vector2(0, 0));
  const localIntroRotationOffsetRef = useRef({ y: introRotationOffsetY });

  const { scene } = useGLTF(src);

  /* eslint-disable react-hooks/immutability -- Intro owns these refs for GSAP intro animation */
  useEffect(() => {
    if (introRotationOffsetRef) {
      introRotationOffsetRef.current = localIntroRotationOffsetRef.current;
    }
  }, [introRotationOffsetRef]);

  useEffect(() => {
    if (!externalGroupRef) return;

    externalGroupRef.current = groupRef.current;

    return () => {
      externalGroupRef.current = null;
    };
  }, [externalGroupRef]);
  /* eslint-enable react-hooks/immutability */

  useEffect(() => {
    scene.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
      child.geometry?.computeVertexNormals();
    });
  }, [scene]);

  useEffect(() => {
    const handlePointerMove = (event) => {
      targetPointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      targetPointerRef.current.y =
        -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useEffect(() => {
    if (!enableScrollMove) {
      scrollOffsetRef.current = 0;
      scrollRotationYRef.current = 0;
      return;
    }

    let raf1;
    let raf2;
    let trigger;

    const applyProgress = (progress) => {
      scrollOffsetRef.current = progress * scrollMoveY;
      scrollRotationYRef.current = progress * scrollRotateY;
    };

    const initScrollTrigger = () => {
      const triggerEl = document.querySelector(scrollTriggerSelector);
      if (!triggerEl) return;

      trigger = ScrollTrigger.create({
        trigger: triggerEl,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => applyProgress(self.progress),
        onRefresh: (self) => applyProgress(self.progress),
      });

      ScrollTrigger.refresh();
      applyProgress(trigger.progress);
    };

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        initScrollTrigger();
        ScrollTrigger.refresh();
      });
    });

    const handlePageShow = () => {
      ScrollTrigger.refresh();
      if (trigger) applyProgress(trigger.progress);
    };

    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("load", handlePageShow);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("load", handlePageShow);
      trigger?.kill();
    };
  }, [enableScrollMove, scrollMoveY, scrollRotateY, scrollTriggerSelector]);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    if (cursorFollow) {
      smoothPointerRef.current.lerp(targetPointerRef.current, cursorLerp);
    }

    const pointerX = smoothPointerRef.current.x;
    const pointerY = smoothPointerRef.current.y;

    const leftStrength =
      cursorRotationYLeftStrength ?? cursorRotationStrength * 1.5;
    const rightStrength =
      cursorRotationYRightStrength ?? cursorRotationStrength * 1.5;

    const yRotationFromMouse =
      pointerX < 0 ? pointerX * leftStrength : pointerX * rightStrength;

    const introRotationOffsetYValue =
      localIntroRotationOffsetRef.current?.y ?? 0;

    group.rotation.y =
      rotation[1] +
      scrollRotationYRef.current +
      yRotationFromMouse +
      introRotationOffsetYValue;

    group.rotation.x =
      rotation[0] - pointerY * cursorRotationStrength * cursorRotationXStrength;
    group.rotation.z = rotation[2];

    group.position.x = position[0] + pointerX * cursorPositionStrength;
    group.position.y =
      position[1] +
      scrollOffsetRef.current +
      pointerY * cursorPositionStrength * 0.35;
    group.position.z = position[2];
  });

  return (
    <>
      <Environment preset="city" />

      <Float speed={1} floatIntensity={0.12} rotationIntensity={0.08}>
        <group
          ref={groupRef}
          position={position}
          rotation={rotation}
          scale={[scale, scale, scale * thickness]}
        >
          <Center>
            <Clone
              object={scene}
              inject={
                <MeshTransmissionMaterial
                  buffer={transmissionBuffer || undefined}
                  color={glassColor}
                  reflectivity={reflectivity}
                  transmission={transmission}
                  thickness={glassThickness}
                  roughness={roughness}
                  ior={ior}
                  chromaticAberration={chromaticAberration}
                  anisotropy={anisotropy}
                  distortion={distortion}
                  distortionScale={distortionScale}
                  temporalDistortion={temporalDistortion}
                  backside={backside}
                  samples={8}
                  resolution={512}
                  transparent
                  depthWrite={false}
                />
              }
            />
          </Center>
        </group>
      </Float>
    </>
  );
}

export default function HyperiuxGlassHeroScene({
  modelSrc = DEFAULT_MODEL_SRC,
  videoSrc = DEFAULT_VIDEO_SRC,
  modelScale = 0.075,
  modelThickness = 1.45,
  modelPosition = [0, 0, 1.4],
  modelRotation = [0, 0, 0],
  modelGroupRef = null,
  parentModelGroupRef = null,
  modelIntroRotationOffsetRef = null,
}) {
  const modelProps = useMemo(
    () => ({
      src: modelSrc,
      scale: modelScale,
      thickness: modelThickness,
      position: modelPosition,
      rotation: modelRotation,
      transmission: 1,
      glassThickness: 2.5,
      roughness: 0,
      ior: 1,
      cursorRotationYLeftStrength: 0.55,
      cursorRotationYRightStrength: 0.18,
      chromaticAberration: 2.5,
      distortion: 2.4,
      temporalDistortion: 0,
      externalGroupRef: modelGroupRef,
      introRotationOffsetRef: modelIntroRotationOffsetRef,
      introRotationOffsetY: -4,
    }),
    [
      modelSrc,
      modelScale,
      modelThickness,
      modelPosition,
      modelRotation,
      modelGroupRef,
      modelIntroRotationOffsetRef,
    ],
  );

  return (
    <section className="absolute h-screen w-full overflow-hidden bg-black">
      <Canvas camera={CAMERA} gl={GL_CONFIG} dpr={[1, 1]}>
        <Suspense fallback={null}>
          <HyperiuxGlassHeroVideoBackground src={videoSrc} />
        </Suspense>

        <Suspense fallback={null}>
          <group ref={parentModelGroupRef} {...PARENT_GROUP_PROPS}>
            <HyperiuxGlassHeroModel {...modelProps} />
          </group>
        </Suspense>
      </Canvas>
    </section>
  );
}

useGLTF.preload(DEFAULT_MODEL_SRC);
