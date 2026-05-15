"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Center, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { InteractiveParticles } from "./InteractiveParticles";
import { FloatingCubes } from "./FloatingCubes";

export function CubeParticlesModel({
  modelPath = "/assets/models/modelv3.glb",
  texturePath = "/assets/models/new-logo-texture.png",
  invertTexture = true,

  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,

  particleCount = 900,
  cubeSize = 0.4,
  cubeScaleVariation = 0,

  modelOpacity = 0,
  outlineColor = "#ffffff",
  faceColor = "#1a1a1a",

  frontVector = [0, 0, 1],
  backFill = 0.68,
  edgeBoost = 0.25,
  gridSnapFactor = 0.74,

  interactionRadius = 0.9,
  maxShrink = 0.72,
  minScaleMultiplier = 0.2,
  scaleLerp = 0.12,

  parallaxPositionStrength = 0.08,
  parallaxRotationStrength = 0.12,

  floatingCubeCount = 42,
  floatingYStartOffset = 2,
  floatingYEndOffset = 2,
  floatingZMin = -6,
  floatingZMax = 2.5,
  floatingScaleMin = 0.08,
  floatingScaleMax = 0.28,
  floatingSpeedMin = 0.08,
  floatingSpeedMax = 0.2,
  floatingEasePower = 2.4,
  floatingRotationSpeedMax = 1.1,
  floatingXSpreadMultiplier = 1.25,

  actionPhase = "idle",
  holdStartTime = 0,
  holdTriggerDuration = 3,
  holdProgress = 0,
  burstKey = 0,

  explosionDuration = 0.7,
  explodedHoldDuration = 0.5,
  reformDuration = 0.8,

  holdShakeAmount = 0.12,
  holdShakeSpeed = 30,

  explosionSpreadX = 18,
  explosionSpreadY = 12,
  explosionForwardMin = 2.5,
  explosionForwardMax = 7,
  explosionBackwardMin = 2,
  explosionBackwardMax = 5,
  explosionRotateMax = 3.2,

  gyroBreakpoint = 1025,
  gyroStrengthX = 2.2,
  gyroStrengthY = 2,
  gyroMaxGamma = 18,
  gyroMaxBeta = 20,
  gyroLerp = 0.22,
  pointerLerp = 0.1,
  gyroPositionStrength = 0.16,
  gyroRotationStrength = 0.3,
  parallaxLerp = 0.16,
}) {
  const gltf = useGLTF(modelPath);
  const faceTexture = useTexture(texturePath);

  const [processedTexture, setProcessedTexture] = useState(null);

  const baseGroupRef = useRef(null);
  const interactionGroupRef = useRef(null);

  useEffect(() => {
    if (!faceTexture?.image) return;

    faceTexture.colorSpace = THREE.SRGBColorSpace;
    faceTexture.wrapS = THREE.ClampToEdgeWrapping;
    faceTexture.wrapT = THREE.ClampToEdgeWrapping;
    faceTexture.minFilter = THREE.NearestFilter;
    faceTexture.magFilter = THREE.NearestFilter;
    faceTexture.generateMipmaps = false;
    faceTexture.needsUpdate = true;

    if (!invertTexture) {
      setProcessedTexture(faceTexture);
      return;
    }

    const img = faceTexture.image;

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    if (!ctx) return;

    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }

    ctx.putImageData(imageData, 0, 0);

    const invertedTexture = new THREE.CanvasTexture(canvas);
    invertedTexture.colorSpace = THREE.SRGBColorSpace;
    invertedTexture.wrapS = THREE.ClampToEdgeWrapping;
    invertedTexture.wrapT = THREE.ClampToEdgeWrapping;
    invertedTexture.minFilter = THREE.NearestFilter;
    invertedTexture.magFilter = THREE.NearestFilter;
    invertedTexture.generateMipmaps = false;
    invertedTexture.needsUpdate = true;

    setProcessedTexture(invertedTexture);

    return () => {
      invertedTexture.dispose();
    };
  }, [faceTexture, invertTexture]);

  const visibleTexture = processedTexture || faceTexture;

  const prepared = useMemo(() => {
    const sceneClone = gltf.scene.clone(true);
    const meshes = [];
    const bbox = new THREE.Box3();

    sceneClone.updateMatrixWorld(true);

    sceneClone.traverse((child) => {
      if (child.isMesh && child.geometry) {
        const mesh = child.clone();

        mesh.geometry = child.geometry.clone();
        mesh.material =
          child.material?.clone?.() || new THREE.MeshBasicMaterial();

        mesh.updateMatrixWorld(true);

        meshes.push(mesh);
        bbox.expandByObject(mesh);
      }
    });

    return {
      sceneClone,
      meshes,
      bbox,
    };
  }, [gltf]);

  const particleData = useMemo(() => {
    const particles = [];
    const occupied = new Set();

    if (!prepared.meshes.length) return particles;

    const frontDir = new THREE.Vector3(...frontVector).normalize();

    /**
     * IMPORTANT:
     * grid must be slightly smaller than cubeSize so cubes visually touch.
     * This fixes the broken arm gaps.
     */
    const grid = cubeSize * gridSnapFactor;

    const bbox = prepared.bbox.clone();
    const bboxCenter = new THREE.Vector3();
    const bboxSize = new THREE.Vector3();

    bbox.getCenter(bboxCenter);
    bbox.getSize(bboxSize);

    const upCandidate =
      Math.abs(frontDir.y) > 0.95
        ? new THREE.Vector3(1, 0, 0)
        : new THREE.Vector3(0, 1, 0);

    const planeX = new THREE.Vector3()
      .crossVectors(upCandidate, frontDir)
      .normalize();

    const planeY = new THREE.Vector3()
      .crossVectors(frontDir, planeX)
      .normalize();

    const halfExtentAlongFront =
      (Math.abs(frontDir.x) * bboxSize.x +
        Math.abs(frontDir.y) * bboxSize.y +
        Math.abs(frontDir.z) * bboxSize.z) *
      0.5;

    const computeFrontness = (point) => {
      const centered = point.clone().sub(bboxCenter);
      const projected = centered.dot(frontDir);

      const normalized =
        halfExtentAlongFront > 0
          ? (projected + halfExtentAlongFront) / (2 * halfExtentAlongFront)
          : 0.5;

      return THREE.MathUtils.clamp(normalized, 0, 1);
    };

    const project2D = (point) => {
      const local = point.clone().sub(bboxCenter);

      return {
        x: local.dot(planeX),
        y: local.dot(planeY),
        z: local.dot(frontDir),
      };
    };

    const rebuildFrom2D = (x, y, z) => {
      return new THREE.Vector3()
        .copy(bboxCenter)
        .addScaledVector(planeX, x)
        .addScaledVector(planeY, y)
        .addScaledVector(frontDir, z);
    };

    const raycastGroup = new THREE.Group();

    prepared.meshes.forEach((mesh) => {
      raycastGroup.add(mesh.clone());
    });

    raycastGroup.updateMatrixWorld(true);

    const corners = [];

    for (const x of [bbox.min.x, bbox.max.x]) {
      for (const y of [bbox.min.y, bbox.max.y]) {
        for (const z of [bbox.min.z, bbox.max.z]) {
          corners.push(project2D(new THREE.Vector3(x, y, z)));
        }
      }
    }

    const min2DX = Math.min(...corners.map((c) => c.x)) - grid;
    const max2DX = Math.max(...corners.map((c) => c.x)) + grid;
    const min2DY = Math.min(...corners.map((c) => c.y)) - grid;
    const max2DY = Math.max(...corners.map((c) => c.y)) + grid;

    const raycaster = new THREE.Raycaster();
    const frontStartDistance = halfExtentAlongFront + Math.max(cubeSize * 10, 4);

    const start = new THREE.Vector3();
    const rayOrigin = new THREE.Vector3();

    const candidates = [];

    const addCellCandidate = (ix, iy, type = "face", priority = 0) => {
      const px = min2DX + ix * grid;
      const py = min2DY + iy * grid;

      start.copy(bboxCenter).addScaledVector(planeX, px).addScaledVector(planeY, py);
      rayOrigin.copy(start).addScaledVector(frontDir, frontStartDistance);

      raycaster.set(rayOrigin, frontDir.clone().multiplyScalar(-1));

      const hits = raycaster.intersectObject(raycastGroup, true);
      if (!hits.length) return;

      const hitPoint = hits[0].point.clone();
      const frontness = computeFrontness(hitPoint);

      if (frontness < backFill) return;

      const projected = project2D(hitPoint);

      candidates.push({
        ix,
        iy,
        projectedX: px,
        projectedY: py,
        projectedZ: projected.z,
        frontness,
        type,
        priority,
      });
    };

    const cols = Math.ceil((max2DX - min2DX) / grid);
    const rows = Math.ceil((max2DY - min2DY) / grid);

    /**
     * TRUE FRONT-FACE GRID PASS
     * No random skipping.
     * No forced column squeezing.
     * No artificial arm normalization.
     */
    for (let iy = 0; iy <= rows; iy++) {
      for (let ix = 0; ix <= cols; ix++) {
        addCellCandidate(ix, iy, "face", 0);
      }
    }

    /**
     * SMALL OFFSET PASS
     * This only fills missed connector cells, but final placement is still snapped
     * to the same grid. It will not split the arms into strips.
     */
    const offsetCandidates = [];

    const addOffsetCandidate = (ix, iy, offsetX, offsetY) => {
      const px = min2DX + (ix + offsetX) * grid;
      const py = min2DY + (iy + offsetY) * grid;

      start.copy(bboxCenter).addScaledVector(planeX, px).addScaledVector(planeY, py);
      rayOrigin.copy(start).addScaledVector(frontDir, frontStartDistance);

      raycaster.set(rayOrigin, frontDir.clone().multiplyScalar(-1));

      const hits = raycaster.intersectObject(raycastGroup, true);
      if (!hits.length) return;

      const hitPoint = hits[0].point.clone();
      const frontness = computeFrontness(hitPoint);

      if (frontness < backFill) return;

      const projected = project2D(hitPoint);

      offsetCandidates.push({
        ix: Math.round(ix + offsetX),
        iy: Math.round(iy + offsetY),
        projectedX: min2DX + Math.round(ix + offsetX) * grid,
        projectedY: min2DY + Math.round(iy + offsetY) * grid,
        projectedZ: projected.z,
        frontness,
        type: "connector",
        priority: 0.04,
      });
    };

    for (let iy = 0; iy <= rows; iy++) {
      for (let ix = 0; ix <= cols; ix++) {
        addOffsetCandidate(ix, iy, 0.5, 0.5);
      }
    }

    /**
     * Add offset candidates only where a real grid cell is missing.
     */
    const baseCells = new Set(candidates.map((c) => `${c.ix}|${c.iy}`));

    for (const c of offsetCandidates) {
      const key = `${c.ix}|${c.iy}`;
      if (!baseCells.has(key)) {
        candidates.push(c);
        baseCells.add(key);
      }
    }

    /**
     * LIGHT EDGE SUPPORT
     * Edge cubes are snapped to the same 2D grid.
     */
    prepared.meshes.forEach((mesh) => {
      const geometry = mesh.geometry.clone();
      const edges = new THREE.EdgesGeometry(geometry);
      const edgeAttr = edges.attributes.position;

      if (!edgeAttr) {
        geometry.dispose();
        edges.dispose();
        return;
      }

      const a = new THREE.Vector3();
      const b = new THREE.Vector3();
      const p = new THREE.Vector3();

      for (let i = 0; i < edgeAttr.count; i += 2) {
        a.fromBufferAttribute(edgeAttr, i).applyMatrix4(mesh.matrixWorld);
        b.fromBufferAttribute(edgeAttr, i + 1).applyMatrix4(mesh.matrixWorld);

        const length = a.distanceTo(b);
        const steps = Math.max(1, Math.ceil(length / grid));

        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          p.lerpVectors(a, b, t);

          const frontness = computeFrontness(p);
          if (frontness < backFill) continue;

          const projected = project2D(p);

          const ix = Math.round((projected.x - min2DX) / grid);
          const iy = Math.round((projected.y - min2DY) / grid);

          const key = `${ix}|${iy}`;
          if (baseCells.has(key)) continue;

          candidates.push({
            ix,
            iy,
            projectedX: min2DX + ix * grid,
            projectedY: min2DY + iy * grid,
            projectedZ: projected.z,
            frontness,
            type: "edge",
            priority: edgeBoost * 0.05,
          });

          baseCells.add(key);
        }
      }

      geometry.dispose();
      edges.dispose();
    });

    candidates.sort((a, b) => {
      const scoreA =
        a.frontness +
        a.priority +
        (a.type === "edge" ? edgeBoost * 0.04 : 0);

      const scoreB =
        b.frontness +
        b.priority +
        (b.type === "edge" ? edgeBoost * 0.04 : 0);

      return scoreB - scoreA;
    });

    const addCube = (candidate) => {
      const key = `${candidate.ix}|${candidate.iy}`;

      if (occupied.has(key)) return false;

      occupied.add(key);

      const cubePosition = rebuildFrom2D(
        candidate.projectedX,
        candidate.projectedY,
        candidate.projectedZ
      );

      const size = cubeSize * (1 + cubeScaleVariation);

      particles.push({
        position: cubePosition,
        quaternion: new THREE.Quaternion(),
        scale: new THREE.Vector3(size, size, size),
      });

      return true;
    };

    for (let i = 0; i < candidates.length; i++) {
      if (particles.length >= particleCount) break;
      addCube(candidates[i]);
    }

    return particles;
  }, [
    prepared.meshes,
    prepared.bbox,
    particleCount,
    cubeSize,
    cubeScaleVariation,
    frontVector,
    backFill,
    edgeBoost,
    gridSnapFactor,
  ]);

  useEffect(() => {
    prepared.sceneClone.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.transparent = true;
        child.material.opacity = modelOpacity;
        child.material.depthWrite = false;
        child.material.toneMapped = false;
        child.material.needsUpdate = true;
      }
    });
  }, [prepared.sceneClone, modelOpacity]);

  const floatingPauseTarget =
    actionPhase === "holding"
      ? 0.22
      : actionPhase === "exploding"
      ? 0
      : actionPhase === "reforming"
      ? 1
      : 1;

  return (
    <>
      <FloatingCubes
        texture={visibleTexture}
        count={floatingCubeCount}
        faceColor={faceColor}
        outlineColor={outlineColor}
        yStartOffset={floatingYStartOffset}
        yEndOffset={floatingYEndOffset}
        zMin={floatingZMin}
        zMax={floatingZMax}
        scaleMin={floatingScaleMin}
        scaleMax={floatingScaleMax}
        speedMin={floatingSpeedMin}
        speedMax={floatingSpeedMax}
        easePower={floatingEasePower}
        rotationSpeedMax={floatingRotationSpeedMax}
        xSpreadMultiplier={floatingXSpreadMultiplier}
        pauseTarget={floatingPauseTarget}
        parallaxPositionStrength={0.28}
        parallaxRotationStrength={0.12}
        gyroBreakpoint={gyroBreakpoint}
        gyroStrengthX={gyroStrengthX}
        gyroStrengthY={gyroStrengthY}
        gyroMaxGamma={gyroMaxGamma}
        gyroMaxBeta={gyroMaxBeta}
        gyroLerp={gyroLerp}
        gyroPositionStrength={gyroPositionStrength}
        gyroRotationStrength={gyroRotationStrength}
        parallaxLerp={parallaxLerp}
      />

      <Center>
        <group
          ref={baseGroupRef}
          position={position}
          rotation={rotation}
          scale={scale}
        >
          <group ref={interactionGroupRef}>
            <primitive object={prepared.sceneClone} dispose={null} />

            <InteractiveParticles
              particles={particleData}
              texture={visibleTexture}
              interactionGroupRef={interactionGroupRef}
              interactionRadius={interactionRadius}
              maxShrink={maxShrink}
              minScaleMultiplier={minScaleMultiplier}
              scaleLerp={scaleLerp}
              parallaxPositionStrength={parallaxPositionStrength}
              parallaxRotationStrength={parallaxRotationStrength}
              outlineColor={outlineColor}
              faceColor={faceColor}
              actionPhase={actionPhase}
              holdStartTime={holdStartTime}
              holdTriggerDuration={holdTriggerDuration}
              holdProgress={holdProgress}
              burstKey={burstKey}
              explosionDuration={explosionDuration}
              explodedHoldDuration={explodedHoldDuration}
              reformDuration={reformDuration}
              holdShakeAmount={holdShakeAmount}
              holdShakeSpeed={holdShakeSpeed}
              explosionSpreadX={explosionSpreadX}
              explosionSpreadY={explosionSpreadY}
              explosionForwardMin={explosionForwardMin}
              explosionForwardMax={explosionForwardMax}
              explosionBackwardMin={explosionBackwardMin}
              explosionBackwardMax={explosionBackwardMax}
              explosionRotateMax={explosionRotateMax}
              gyroBreakpoint={gyroBreakpoint}
              gyroStrengthX={gyroStrengthX}
              gyroStrengthY={gyroStrengthY}
              gyroMaxGamma={gyroMaxGamma}
              gyroMaxBeta={gyroMaxBeta}
              gyroLerp={gyroLerp}
              pointerLerp={pointerLerp}
              gyroPositionStrength={gyroPositionStrength}
              gyroRotationStrength={gyroRotationStrength}
              parallaxLerp={parallaxLerp}
            />
          </group>
        </group>
      </Center>
    </>
  );
}

useGLTF.preload("/assets/models/modelv3.glb");
useGLTF.preload("/assets/models/hyperiexLogoNo2.glb");