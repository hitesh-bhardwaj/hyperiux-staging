"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";

export default function SharedR3FCanvas() {
  return (
    <Canvas
      className="fixed inset-0 z-[1] h-screen w-screen pointer-events-none"
      camera={{ position: [0, 0, 5], fov: 35 }}
      gl={{
        antialias: true,
        alpha: true,
        premultipliedAlpha: false,
        powerPreference: "high-performance",
      }}
      dpr={[1, 1.5]}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <View.Port />
    </Canvas>
  );
}