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

async function requestIOSMotionAndOrientationPermission() {
  let orientationGranted = true;
  let motionGranted = true;

  try {
    if (
      typeof window.DeviceOrientationEvent !== "undefined" &&
      typeof window.DeviceOrientationEvent.requestPermission === "function"
    ) {
      const result = await window.DeviceOrientationEvent.requestPermission();
      orientationGranted = result === "granted";
    }
  } catch (error) {
    orientationGranted = false;
  }

  try {
    if (
      typeof window.DeviceMotionEvent !== "undefined" &&
      typeof window.DeviceMotionEvent.requestPermission === "function"
    ) {
      const result = await window.DeviceMotionEvent.requestPermission();
      motionGranted = result === "granted";
    }
  } catch (error) {
    motionGranted = false;
  }

  return orientationGranted || motionGranted;
}

export default function useResponsiveParallaxInput({
  breakpoint = 1025,

  pointerLerp = 0.08,
  gyroLerp = 0.16,

  gyroMaxGamma = 25,
  gyroMaxBeta = 25,

  gyroStrengthX = 1.6,
  gyroStrengthY = 1.6,

  invertGyroX = false,

  // Your vertical axis was reversed, so this is true by default.
  invertGyroY = true,

  fallbackPointerOnMobile = true,
} = {}) {
  const { pointer } = useThree();

  const isMobileRef = useRef(false);
  const hasGyroRef = useRef(false);
  const permissionAskedRef = useRef(false);
  const orientationListenerAttachedRef = useRef(false);

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

    const handleOrientation = (event) => {
      if (!isMobileRef.current) return;

      const gamma = event.gamma ?? 0; // left / right
      const beta = event.beta ?? 0; // front / back

      hasGyroRef.current = true;
      outputRef.current.hasGyro = true;

      let normalizedX =
        clamp(gamma, -gyroMaxGamma, gyroMaxGamma) / gyroMaxGamma;

      let normalizedY =
        clamp(beta, -gyroMaxBeta, gyroMaxBeta) / gyroMaxBeta;

      if (invertGyroX) normalizedX *= -1;
      if (invertGyroY) normalizedY *= -1;

      gyroTargetRef.current.x = clamp(normalizedX * gyroStrengthX, -1, 1);
      gyroTargetRef.current.y = clamp(normalizedY * gyroStrengthY, -1, 1);
    };

    const attachOrientationListener = () => {
      if (orientationListenerAttachedRef.current) return;

      orientationListenerAttachedRef.current = true;

      window.addEventListener("deviceorientation", handleOrientation, true);
    };

    const requestGyroPermission = async () => {
      if (!isMobileRef.current) return;

      if (permissionAskedRef.current) {
        attachOrientationListener();
        return;
      }

      permissionAskedRef.current = true;

      const granted = await requestIOSMotionAndOrientationPermission();

      if (granted) {
        attachOrientationListener();
      } else {
        // Android / some browsers do not need permission.
        // Keep listener attached as fallback.
        attachOrientationListener();
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
      iOS needs requestPermission from a real user gesture.
    */
    attachOrientationListener();

    window.addEventListener("resize", updateMode);

    window.addEventListener("pointerdown", requestGyroPermission, {
      passive: true,
    });

    window.addEventListener("touchstart", requestGyroPermission, {
      passive: true,
    });

    window.addEventListener("click", requestGyroPermission, {
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
      window.removeEventListener("click", requestGyroPermission);

      window.removeEventListener("touchmove", handleTouchMove);

      orientationListenerAttachedRef.current = false;
    };
  }, [
    breakpoint,
    fallbackPointerOnMobile,
    gyroMaxBeta,
    gyroMaxGamma,
    gyroStrengthX,
    gyroStrengthY,
    invertGyroX,
    invertGyroY,
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