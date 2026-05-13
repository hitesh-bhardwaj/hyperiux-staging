"use client";

import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function isSmallDisplay(breakpoint = 1025) {
  if (typeof window === "undefined") return false;
  return window.innerWidth < breakpoint;
}

export default function useResponsiveParallaxInput({
  breakpoint = 1025,

  pointerLerp = 0.08,
  gyroLerp = 0.08,

  gyroMaxGamma = 35,
  gyroMaxBeta = 35,

  gyroStrengthX = 1,
  gyroStrengthY = 1,

  fallbackPointerOnMobile = true,
} = {}) {
  const { pointer } = useThree();

  const isMobileRef = useRef(false);
  const hasGyroRef = useRef(false);
  const permissionAskedRef = useRef(false);

  const gyroTargetRef = useRef({ x: 0, y: 0 });
  const touchTargetRef = useRef({ x: 0, y: 0 });

  const outputRef = useRef({
    x: 0,
    y: 0,
    isMobile: false,
    hasGyro: false,
  });

  useEffect(() => {
    const updateMode = () => {
      isMobileRef.current = isSmallDisplay(breakpoint);
      outputRef.current.isMobile = isMobileRef.current;
    };

    updateMode();

    window.addEventListener("resize", updateMode);

    const handleOrientation = (event) => {
      if (!isMobileRef.current) return;

      const gamma = event.gamma ?? 0; // left/right tilt
      const beta = event.beta ?? 0; // front/back tilt

      hasGyroRef.current = true;
      outputRef.current.hasGyro = true;

      const normalizedX =
        clamp(gamma, -gyroMaxGamma, gyroMaxGamma) / gyroMaxGamma;

      const normalizedY =
        clamp(beta, -gyroMaxBeta, gyroMaxBeta) / gyroMaxBeta;

      gyroTargetRef.current.x = clamp(normalizedX * gyroStrengthX, -1, 1);
      gyroTargetRef.current.y = clamp(normalizedY * gyroStrengthY, -1, 1);
    };

    const requestGyroPermission = async () => {
      if (permissionAskedRef.current) return;
      permissionAskedRef.current = true;

      try {
        if (
          typeof window.DeviceOrientationEvent !== "undefined" &&
          typeof window.DeviceOrientationEvent.requestPermission === "function"
        ) {
          const result = await window.DeviceOrientationEvent.requestPermission();

          if (result === "granted") {
            window.addEventListener("deviceorientation", handleOrientation, true);
          }
        }
      } catch (error) {
        // Permission can fail silently on unsupported browsers.
      }
    };

    const handleTouchMove = (event) => {
      if (!fallbackPointerOnMobile || !isMobileRef.current) return;

      const touch = event.touches?.[0];
      if (!touch) return;

      const x = (touch.clientX / window.innerWidth) * 2 - 1;
      const y = -((touch.clientY / window.innerHeight) * 2 - 1);

      touchTargetRef.current.x = clamp(x, -1, 1);
      touchTargetRef.current.y = clamp(y, -1, 1);
    };

    /*
      Android usually works directly.
      iOS requires permission from a user gesture.
    */
    window.addEventListener("deviceorientation", handleOrientation, true);

    window.addEventListener("pointerdown", requestGyroPermission, {
      passive: true,
    });

    window.addEventListener("touchstart", requestGyroPermission, {
      passive: true,
    });

    window.addEventListener("touchmove", handleTouchMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("resize", updateMode);
      window.removeEventListener("deviceorientation", handleOrientation, true);
      window.removeEventListener("pointerdown", requestGyroPermission);
      window.removeEventListener("touchstart", requestGyroPermission);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [
    breakpoint,
    fallbackPointerOnMobile,
    gyroMaxBeta,
    gyroMaxGamma,
    gyroStrengthX,
    gyroStrengthY,
  ]);

  useFrame(() => {
    const output = outputRef.current;

    if (isMobileRef.current) {
      const target = hasGyroRef.current
        ? gyroTargetRef.current
        : touchTargetRef.current;

      output.x = THREE.MathUtils.lerp(output.x, target.x, gyroLerp);
      output.y = THREE.MathUtils.lerp(output.y, target.y, gyroLerp);
      output.isMobile = true;
      output.hasGyro = hasGyroRef.current;

      return;
    }

    output.x = THREE.MathUtils.lerp(output.x, pointer.x, pointerLerp);
    output.y = THREE.MathUtils.lerp(output.y, pointer.y, pointerLerp);
    output.isMobile = false;
    output.hasGyro = false;
  });

  return outputRef;
}