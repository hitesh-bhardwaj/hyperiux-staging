"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CubeVisual } from "./CubeVisual";
import useResponsiveParallaxInput from "./useResponsiveParallaxInput";

function deterministicNoise(x, y, z) {
  const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  return s - Math.floor(s);
}

function FloatingCube({
  data,
  texture,
  faceColor = "#1a1a1a",
  outlineColor = "#ffffff",
  speedFactorRef,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const d = data.current;
    const y = THREE.MathUtils.lerp(d.yStart, d.yEnd, d.progress);

    node.position.set(d.x, y, d.z);
    node.rotation.set(d.xRot, d.yRot, d.zRot);
    node.scale.setScalar(d.scale);
  }, [data]);

  useFrame((_, delta) => {
    if (!ref.current) return;

    const d = data.current;

    d.progress += delta * d.speed * speedFactorRef.current;

    if (d.progress > 1) d.progress -= 1;
    if (d.progress < 0) d.progress = 0;

    const y = THREE.MathUtils.lerp(d.yStart, d.yEnd, d.progress);

    ref.current.position.set(d.x, y, d.z);

    ref.current.rotation.x =
      d.xRot + d.xRotSpeed * d.progress * d.rotationTravel;

    ref.current.rotation.y =
      d.yRot + d.yRotSpeed * d.progress * d.rotationTravel;

    ref.current.rotation.z =
      d.zRot + d.zRotSpeed * d.progress * d.rotationTravel;

    ref.current.scale.setScalar(d.scale);
  });

  return (
    <group ref={ref}>
      <CubeVisual
        texture={texture}
        faceColor={faceColor}
        outlineColor={outlineColor}
      />
    </group>
  );
}

export function FloatingCubes({
  texture,
  count = 40,
  faceColor = "#1a1a1a",
  outlineColor = "#ffffff",
  yStartOffset = 2,
  yEndOffset = 2,
  zMin = -6,
  zMax = 2.5,
  scaleMin = 0.08,
  scaleMax = 0.28,
  speedMin = 0.08,
  speedMax = 0.22,
  easePower = 2.2,
  rotationSpeedMax = 1.2,
  xSpreadMultiplier = 1.15,
  pauseTarget = 1,

  parallaxPositionStrength = 0.18,
  parallaxRotationStrength = 0.08,

  /*
    Desktop uses cursor.
    Below this width, gyroscope drives the parallax.
  */
  gyroBreakpoint = 1025,

  /*
    Gyro can feel too strong compared to cursor,
    so keep separate multipliers.
  */
  gyroPositionStrength = 0.16,
  gyroRotationStrength = 0.075,

  parallaxLerp = 0.06,
}) {
  const { viewport, size } = useThree();

  const speedFactorRef = useRef(1);
  const layerRef = useRef(null);

  const parallaxInputRef = useResponsiveParallaxInput({
    breakpoint: gyroBreakpoint,
    pointerLerp: 0.08,
    gyroLerp: 0.08,
    gyroMaxGamma: 35,
    gyroMaxBeta: 35,
    gyroStrengthX: 1,
    gyroStrengthY: 0.75,
    fallbackPointerOnMobile: true,
  });

  const frozenBoundsRef = useRef(null);

  if (!frozenBoundsRef.current) {
    frozenBoundsRef.current = {
      width: viewport.width,
      height: viewport.height,
      screenWidth: size.width,
      screenHeight: size.height,
    };
  }

  useEffect(() => {
    const current = frozenBoundsRef.current;
    if (!current) return;

    if (
      current.screenWidth !== size.width ||
      current.screenHeight !== size.height
    ) {
      frozenBoundsRef.current = {
        width: viewport.width,
        height: viewport.height,
        screenWidth: size.width,
        screenHeight: size.height,
      };
    }
  }, [size.width, size.height, viewport.width, viewport.height]);

  const cubes = useMemo(() => {
    const frozen = frozenBoundsRef.current;
    const fieldWidth = frozen?.width ?? viewport.width;
    const fieldHeight = frozen?.height ?? viewport.height;

    const xMin = -fieldWidth * xSpreadMultiplier * 0.5;
    const xMax = fieldWidth * xSpreadMultiplier * 0.5;
    const yStart = -fieldHeight - yStartOffset;
    const yEnd = fieldHeight + yEndOffset;

    return Array.from({ length: count }, (_, i) => {
      const t = i + 1;

      const n1 = deterministicNoise(t * 0.73, 1.17, 2.31);
      const n2 = deterministicNoise(t * 1.19, 2.07, 0.91);
      const n3 = deterministicNoise(t * 1.83, 0.63, 2.77);
      const n4 = deterministicNoise(t * 2.41, 1.37, 1.93);
      const n5 = deterministicNoise(t * 0.51, 2.91, 1.41);
      const n6 = deterministicNoise(t * 1.61, 1.11, 2.21);
      const n7 = deterministicNoise(t * 2.91, 0.71, 1.27);
      const n8 = deterministicNoise(t * 1.07, 2.47, 0.57);
      const n9 = deterministicNoise(t * 2.03, 1.53, 1.83);

      return {
        current: {
          progress: n1,
          x: THREE.MathUtils.lerp(xMin, xMax, n2),
          yStart,
          yEnd,
          z: THREE.MathUtils.lerp(zMin, zMax, n3),
          scale: THREE.MathUtils.lerp(scaleMin, scaleMax, n4),
          speed: THREE.MathUtils.lerp(speedMin, speedMax, n5),

          xRot: THREE.MathUtils.lerp(-Math.PI, Math.PI, n6),
          yRot: THREE.MathUtils.lerp(-Math.PI, Math.PI, n7),
          zRot: THREE.MathUtils.lerp(-Math.PI, Math.PI, n8),

          xRotSpeed: THREE.MathUtils.lerp(
            -rotationSpeedMax,
            rotationSpeedMax,
            deterministicNoise(t * 1.7, 0.4, 2.2)
          ),

          yRotSpeed: THREE.MathUtils.lerp(
            -rotationSpeedMax,
            rotationSpeedMax,
            deterministicNoise(t * 0.8, 1.9, 2.9)
          ),

          zRotSpeed: THREE.MathUtils.lerp(
            -rotationSpeedMax,
            rotationSpeedMax,
            deterministicNoise(t * 2.3, 1.2, 0.6)
          ),

          rotationTravel: THREE.MathUtils.lerp(1.2, 3.4, n9),
          easePower,
        },
      };
    });
  }, [
    count,
    xSpreadMultiplier,
    yStartOffset,
    yEndOffset,
    zMin,
    zMax,
    scaleMin,
    scaleMax,
    speedMin,
    speedMax,
    easePower,
    rotationSpeedMax,
    viewport.width,
    viewport.height,
  ]);

  useEffect(() => {
    if (!layerRef.current) return;

    layerRef.current.position.set(0, 0, 0);
    layerRef.current.rotation.set(0, 0, 0);
  }, []);

  useFrame(() => {
    speedFactorRef.current = THREE.MathUtils.lerp(
      speedFactorRef.current,
      pauseTarget,
      0.045
    );

    if (!layerRef.current) return;

    const input = parallaxInputRef.current;

    const positionStrength = input.isMobile
      ? gyroPositionStrength
      : parallaxPositionStrength;

    const rotationStrength = input.isMobile
      ? gyroRotationStrength
      : parallaxRotationStrength;

    const targetX = input.x * positionStrength;
    const targetY = input.y * positionStrength;

    const targetRotY = input.x * rotationStrength;
    const targetRotX = -input.y * rotationStrength * 0.6;

    layerRef.current.position.x = THREE.MathUtils.lerp(
      layerRef.current.position.x,
      targetX,
      parallaxLerp
    );

    layerRef.current.position.y = THREE.MathUtils.lerp(
      layerRef.current.position.y,
      targetY,
      parallaxLerp
    );

    layerRef.current.rotation.x = THREE.MathUtils.lerp(
      layerRef.current.rotation.x,
      targetRotX,
      parallaxLerp
    );

    layerRef.current.rotation.y = THREE.MathUtils.lerp(
      layerRef.current.rotation.y,
      targetRotY,
      parallaxLerp
    );
  });

  return (
    <group ref={layerRef}>
      {cubes.map((cube, i) => (
        <FloatingCube
          key={i}
          data={cube}
          texture={texture}
          faceColor={faceColor}
          outlineColor={outlineColor}
          speedFactorRef={speedFactorRef}
        />
      ))}
    </group>
  );
}