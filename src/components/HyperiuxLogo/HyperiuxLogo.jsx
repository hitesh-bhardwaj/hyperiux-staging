"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { CubeParticlesModel } from "./CubeParticlesModel";
import { CameraShakeOnHold } from "./CameraShakeOnHold";
import { HoldCursorIndicator } from "./HoldCursorIndicator";

const PHASE_IDLE = "idle";
const PHASE_HOLDING = "holding";
const PHASE_EXPLOADING = "exploding";
const PHASE_REFORMING = "reforming";


const HOLD_TRIGGER_DURATION = 3;

function getDeviceProfile() {
  if (typeof window === "undefined") {
    return {
      modelScale: 0.25,
      particleCount: 850,
      floatingCubeCount: 42,
      floatingScaleMin: 0.08,
      floatingScaleMax: 0.28,
    };
  }

  const width = window.innerWidth;

  const isMobile = width <= 640;
  const isTablet = width > 640 && width <= 1024;

  if (isMobile) {
    return {
      modelScale: 0.155,
      particleCount: 680,
      floatingCubeCount: 28,
      floatingScaleMin: 0.055,
      floatingScaleMax: 0.18,
    };
  }

  if (isTablet) {
    return {
      modelScale: 0.19,
      particleCount: 760,
      floatingCubeCount: 34,
      floatingScaleMin: 0.065,
      floatingScaleMax: 0.22,
    };
  }

  return {
    modelScale: 0.25,
    particleCount: 850,
    floatingCubeCount: 42,
    floatingScaleMin: 0.08,
    floatingScaleMax: 0.28,
  };
}

function useDeviceProfile() {
  const [profile, setProfile] = useState(() => getDeviceProfile());

  useEffect(() => {
    const update = () => {
      setProfile(getDeviceProfile());
    };

    update();

    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return profile;
}

const HyperiuxLogo = () => {
  const [actionPhase, setActionPhase] = useState(PHASE_IDLE);
  const [burstKey, setBurstKey] = useState(0);

  const isLightMode = true;
  const deviceProfile = useDeviceProfile();

  const actionPhaseRef = useRef(PHASE_IDLE);
  const lockRef = useRef(false);
  const activePointerIdRef = useRef(null);
  const timersRef = useRef([]);
  const removeWindowReleaseRef = useRef(null);
  const holdStartTimeRef = useRef(0);
  const autoExplosionTimeoutRef = useRef(null);

  const explosionDuration = 3;
  const explodedHoldDuration = 1;
  const reformDuration = 3.5;
  const reformSettleBuffer = 0.12;

  useEffect(() => {
    actionPhaseRef.current = actionPhase;
  }, [actionPhase]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const clearAutoExplosionTimeout = () => {
    if (autoExplosionTimeoutRef.current) {
      clearTimeout(autoExplosionTimeoutRef.current);
      autoExplosionTimeoutRef.current = null;
    }
  };

  const clearWindowRelease = () => {
    if (removeWindowReleaseRef.current) {
      removeWindowReleaseRef.current();
      removeWindowReleaseRef.current = null;
    }
  };

  const resetCycle = () => {
    clearTimers();
    clearAutoExplosionTimeout();
    clearWindowRelease();

    lockRef.current = false;
    activePointerIdRef.current = null;
    holdStartTimeRef.current = 0;

    actionPhaseRef.current = PHASE_IDLE;
    setActionPhase(PHASE_IDLE);
  };

  const startExplosionSequence = () => {
    if (actionPhaseRef.current !== PHASE_HOLDING) return;

    clearWindowRelease();
    clearAutoExplosionTimeout();

    setBurstKey((v) => v + 1);

    actionPhaseRef.current = PHASE_EXPLOADING;
    setActionPhase(PHASE_EXPLOADING);

    timersRef.current.push(
      setTimeout(() => {
        actionPhaseRef.current = PHASE_REFORMING;
        setActionPhase(PHASE_REFORMING);
      }, (explosionDuration + explodedHoldDuration) * 1000)
    );

    timersRef.current.push(
      setTimeout(() => {
        resetCycle();
      }, (explosionDuration +
        explodedHoldDuration +
        reformDuration +
        reformSettleBuffer) *
      1000)
    );
  };

  const startHold = (e) => {
    if (lockRef.current) return;
    if (actionPhaseRef.current !== PHASE_IDLE) return;

    clearTimers();
    clearAutoExplosionTimeout();
    clearWindowRelease();

    lockRef.current = true;
    activePointerIdRef.current = e.pointerId ?? null;
    holdStartTimeRef.current = performance.now();

    actionPhaseRef.current = PHASE_HOLDING;
    setActionPhase(PHASE_HOLDING);

    autoExplosionTimeoutRef.current = setTimeout(() => {
      startExplosionSequence();
    }, HOLD_TRIGGER_DURATION * 1000);

    const handleWindowPointerUp = (ev) => {
      if (actionPhaseRef.current !== PHASE_HOLDING) return;

      if (
        activePointerIdRef.current !== null &&
        ev.pointerId !== undefined &&
        ev.pointerId !== activePointerIdRef.current
      ) {
        return;
      }

      resetCycle();
    };

    const handleWindowPointerCancel = (ev) => {
      if (actionPhaseRef.current !== PHASE_HOLDING) return;

      if (
        activePointerIdRef.current !== null &&
        ev.pointerId !== undefined &&
        ev.pointerId !== activePointerIdRef.current
      ) {
        return;
      }

      resetCycle();
    };

    window.addEventListener("pointerup", handleWindowPointerUp, {
      passive: true,
    });

    window.addEventListener("pointercancel", handleWindowPointerCancel, {
      passive: true,
    });

    removeWindowReleaseRef.current = () => {
      window.removeEventListener("pointerup", handleWindowPointerUp);
      window.removeEventListener("pointercancel", handleWindowPointerCancel);
    };
  };

  useEffect(() => {
    return () => {
      clearTimers();
      clearAutoExplosionTimeout();
      clearWindowRelease();
    };
  }, []);

  const backgroundColor = isLightMode ? "#ffffff" : "#111111";
  const outlineColor = "#ffffff";
  const faceColor = isLightMode ? "#ffffff" : "#1a1a1a";


  return (
    <div
      className="relative h-screen w-full overflow-hidden touch-none"
      style={{ backgroundColor }}
      onPointerDown={startHold}
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <video
          playsInline
          muted
          autoPlay
          loop
          preload="auto"
          className="h-full w-full object-cover"
          src="/assets/models/bg-video.mp4"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[30]">
        <HoldCursorIndicator
          isHolding={actionPhase === PHASE_HOLDING}
          actionPhase={actionPhase}
          holdStartTime={holdStartTimeRef.current}
        />
      </div>

      <Canvas
        className="absolute inset-0 z-[20]"
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.NoToneMapping;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.setClearColor(0x000000, 0);
        }}
      >
        <CameraShakeOnHold
          actionPhase={actionPhase}
          intensity={0.04}
          rotationIntensity={0.008}
          frequency={18}
          smooth={0.08}
        />

        <Suspense fallback={null}>
          <CubeParticlesModel
            modelPath="/assets/models/hyperiexLogoNo2.glb"
            texturePath={"/assets/models/new-logo-texture-white.png"}
            invertTexture={true}
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={deviceProfile.modelScale}
            particleCount={1100}
            cubeSize={0.45}
            cubeScaleVariation={0}
            frontVector={[0, 0, 1]}
            backFill={0.68}
            edgeBoost={0.25}
            gridSnapFactor={0.74}
            modelOpacity={0}
            outlineColor={outlineColor}
            faceColor={faceColor}
            interactionRadius={2.5}
            maxShrink={1.5}
            minScaleMultiplier={4.0}
            scaleLerp={0.14}
            parallaxPositionStrength={0.06}
            parallaxRotationStrength={0.2}
            floatingCubeCount={deviceProfile.floatingCubeCount}
            floatingYStartOffset={2}
            floatingYEndOffset={2}
            floatingZMin={-6}
            floatingZMax={2.5}
            floatingScaleMin={deviceProfile.floatingScaleMin}
            floatingScaleMax={deviceProfile.floatingScaleMax}
            floatingSpeedMin={0.08}
            floatingSpeedMax={0.2}
            floatingRotationSpeedMax={1.1}
            floatingXSpreadMultiplier={1.25}
            actionPhase={actionPhase}
            holdStartTime={holdStartTimeRef.current}
            holdTriggerDuration={HOLD_TRIGGER_DURATION}
            burstKey={burstKey}
            explosionDuration={explosionDuration}
            explodedHoldDuration={explodedHoldDuration}
            reformDuration={reformDuration}
            holdShakeAmount={0.12}
            holdShakeSpeed={30}
            explosionSpreadX={20}
            explosionSpreadY={20}
            explosionForwardMin={-30.5}
            explosionForwardMax={30.2}
            explosionBackwardMin={-50.2}
            explosionBackwardMax={44.8}
            explosionRotateMax={1.4}
            gyroBreakpoint={1025}
            gyroStrengthX={2.45}
            gyroStrengthY={2.15}
            gyroMaxGamma={18}
            gyroMaxBeta={20}
            gyroLerp={0.24}
            pointerLerp={0.1}
            gyroPositionStrength={0.18}
            gyroRotationStrength={0.34}
            parallaxLerp={0.18}
          />

          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HyperiuxLogo;