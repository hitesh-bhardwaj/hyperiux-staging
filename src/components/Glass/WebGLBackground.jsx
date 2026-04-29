import React, { useEffect, useMemo, useRef, Suspense } from "react";
import { useThree } from "@react-three/fiber";
import { Image, Text } from "@react-three/drei";
import * as THREE from "three";
function VideoPlane({
  src = "/assets/models/bg-video.mp4",
  position = [0, 0, -0.2],
  scale = [4.9, 2.7, 1],
  opacity = 1,
}) {
  const video = useMemo(() => {
    if (typeof window === "undefined") return null;
    const el = document.createElement("video");
    el.src = src;
    el.crossOrigin = "anonymous";
    el.loop = true;
    el.muted = true;
    el.defaultMuted = true;
    el.playsInline = true;
    el.autoplay = true;
    el.preload = "auto";
    el.setAttribute("playsinline", "true");
    el.setAttribute("webkit-playsinline", "true");
    return el;
  }, [src]);
  const texture = useMemo(() => {
    if (!video) return null;
    const tex = new THREE.VideoTexture(video);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    return tex;
  }, [video]);
  useEffect(() => {
    if (!video) return;
    video.load();
    video.play().catch(() => {});
    return () => {
      video.pause();
    };
  }, [video]);
  if (!texture) return null;
  return (
    <mesh position={position} scale={scale} renderOrder={-2}>
      {" "}
      <planeGeometry args={[1, 1]} />{" "}
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        toneMapped={false}
        depthWrite={false}
        depthTest={false}
        side={THREE.DoubleSide}
      />{" "}
    </mesh>
  );
}
export function WebGLBackground() {
  const bg = useRef();
  const textRef = useRef();
  const viewport = useThree((s) => s.viewport);
  return (
    <Suspense fallback={null}>
      {" "}
      <VideoPlane
        src="/assets/models/bg-video.mp4"
        position={[0, 0, 0]}
        scale={[viewport.width, viewport.height, 1]}
        opacity={1}
      />{" "}
      
    </Suspense>
  );
}
