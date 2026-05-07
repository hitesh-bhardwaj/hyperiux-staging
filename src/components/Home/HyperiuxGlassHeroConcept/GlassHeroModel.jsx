"use client";

import React, { useEffect, useRef } from "react";
import {
  Center,
  Clone,
  Float,
  MeshTransmissionMaterial,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function ReflectionSphere({
  src = "/assets/models/env-bg.jpg",
  radius = 7,
  segments = 64,
  repeat = [1, 1],
  offset = [0, 0],
  rotation = 0,
  opacity = 1,
  visible = false,
}) {
  const texture = useTexture(src);

  useEffect(() => {
    if (!texture) return;

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.mapping = THREE.EquirectangularReflectionMapping;

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    texture.repeat.set(repeat[0], repeat[1]);
    texture.offset.set(offset[0], offset[1]);
    texture.rotation = rotation;
    texture.center.set(0.5, 0.5);

    texture.needsUpdate = true;
  }, [texture, repeat, offset, rotation]);

  return (
    <mesh visible={visible} scale={[-1, 1, 1]}>
      <sphereGeometry args={[radius, segments, segments]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.BackSide}
        toneMapped={false}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}

export default function GlassHeroModel({
  src = "/assets/models/hyperiux-new-model.glb",
  position = [0, 0, 1.4],
  rotation = [0.1, 0.2, 0],
  scale = 0.075,
  thickness = 1.45,

  reflectivity = 0.25,
  envMapIntensity = 5,

  cursorFollow = true,
  cursorRotationStrength = 0.22,
  cursorPositionStrength = 0.08,
  cursorLerp = 0.055,

  scrollTriggerSelector = ".container",
  scrollMoveY = 0.5,
  enableScrollMove = true,
  scrollRotateY = -3,

  glassColor = "#ffffff",
  transmission = 1.45,
  glassThickness = 1.1,
  roughness = 0.04,
  ior = 1.12,
  chromaticAberration = 2.2,
  anisotropy = 0.25,
  distortion = 1.4,
  distortionScale = 0.35,
  temporalDistortion = 0,
  backside = true,

  transmissionBuffer = null,

  environmentImageSrc = "/assets/models/env-bg.jpg",
  enableEnvironmentImage = true,

  // sphere env controls
  environmentSphereRadius = 7,
  environmentSphereSegments = 64,
  environmentRepeat = [1, 1],
  environmentOffset = [0, 0],
  environmentTextureRotation = 0,
  environmentSphereVisible = false,
  environmentSphereOpacity = 1,
}) {
  const groupRef = useRef(null);
  const scrollOffsetRef = useRef(0);
  const scrollRotationYRef = useRef(0);

  const targetPointerRef = useRef(new THREE.Vector2(0, 0));
  const smoothPointerRef = useRef(new THREE.Vector2(0, 0));

  const { scene } = useGLTF(src);

  useEffect(() => {
    scene.traverse((child) => {
      if (!child.isMesh) return;

      child.castShadow = true;
      child.receiveShadow = true;

      if (child.geometry) {
        child.geometry.computeVertexNormals();
      }
    });
  }, [scene]);

  useEffect(() => {
    const handlePointerMove = (event) => {
      targetPointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      targetPointerRef.current.y =
        -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  useEffect(() => {
    if (!enableScrollMove) {
      scrollOffsetRef.current = 0;
      scrollRotationYRef.current = 0;
      return;
    }

    let trigger;
    let raf1;
    let raf2;

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
        end: "bottom 70%",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          applyProgress(self.progress);
        },
        onRefresh: (self) => {
          applyProgress(self.progress);
        },
      });

      ScrollTrigger.refresh();
      applyProgress(trigger.progress);
    };

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        initScrollTrigger();
      });
    });

    const handleRefresh = () => {
      ScrollTrigger.refresh();

      if (trigger) {
        applyProgress(trigger.progress);
      }
    };

    window.addEventListener("load", handleRefresh);
    window.addEventListener("pageshow", handleRefresh);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);

      window.removeEventListener("load", handleRefresh);
      window.removeEventListener("pageshow", handleRefresh);

      if (trigger) trigger.kill();
    };
  }, [enableScrollMove, scrollMoveY, scrollRotateY, scrollTriggerSelector]);

  useFrame(() => {
    if (!groupRef.current) return;

    if (cursorFollow) {
      smoothPointerRef.current.lerp(targetPointerRef.current, cursorLerp);
    }

    groupRef.current.rotation.y =
      rotation[1] +
      scrollRotationYRef.current +
      smoothPointerRef.current.x * cursorRotationStrength;

    groupRef.current.rotation.x =
      rotation[0] - smoothPointerRef.current.y * cursorRotationStrength * 0.5;

    groupRef.current.rotation.z = rotation[2];

    groupRef.current.position.x =
      position[0] + smoothPointerRef.current.x * cursorPositionStrength;

    groupRef.current.position.y =
      position[1] +
      scrollOffsetRef.current +
      smoothPointerRef.current.y * cursorPositionStrength * 0.35;

    groupRef.current.position.z = position[2];
  });

  return (
    <>
      {enableEnvironmentImage && environmentImageSrc && (
        <ReflectionSphere
          src={environmentImageSrc}
          radius={environmentSphereRadius}
          segments={environmentSphereSegments}
          repeat={environmentRepeat}
          offset={environmentOffset}
          rotation={environmentTextureRotation}
          visible={environmentSphereVisible}
          opacity={environmentSphereOpacity}
        />
      )}

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
                  envMapIntensity={envMapIntensity}
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
                  samples={12}
                  resolution={768}
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