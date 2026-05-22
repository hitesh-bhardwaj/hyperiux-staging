"use client";

import React, { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  useGLTF,
  Center,
  useVideoTexture,
  MeshTransmissionMaterial,
  Clone,
} from "@react-three/drei";
import * as THREE from "three";

function DirectionalLight({
  position = [0.3, 5, 0.5],
  targetPosition = [0.3, 0.8, 0.5],
  intensity = 5,
  color = "#ffffff",
  castShadow = true,

  shadowMapSize = 4096,
  shadowCameraNear = 0.1,
  shadowCameraFar = 20,
  shadowCameraLeft = -3,
  shadowCameraRight = 3,
  shadowCameraTop = 3,
  shadowCameraBottom = -3,
  shadowBias = -0.000015,
  shadowNormalBias = 0.002,
  shadowRadius = 2,
}) {
  const lightRef = useRef(null);
  const targetRef = useRef(null);

  useEffect(() => {
    if (!lightRef.current || !targetRef.current) return;

    lightRef.current.target = targetRef.current;
    lightRef.current.target.updateMatrixWorld();
  }, [targetPosition]);

  return (
    <>
      <object3D ref={targetRef} position={targetPosition} />

      <directionalLight
        ref={lightRef}
        position={position}
        intensity={intensity}
        color={color}
        castShadow={castShadow}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-camera-near={shadowCameraNear}
        shadow-camera-far={shadowCameraFar}
        shadow-camera-left={shadowCameraLeft}
        shadow-camera-right={shadowCameraRight}
        shadow-camera-top={shadowCameraTop}
        shadow-camera-bottom={shadowCameraBottom}
        shadow-bias={shadowBias}
        shadow-normalBias={shadowNormalBias}
        shadow-radius={shadowRadius}
      />
    </>
  );
}

function FrostedGlassModel({
  src,
  position = [0, 0.22, 0],
  rotation = [0, 0, 0],
  scale = 1,

  color = "#ffffff",
  metalness = 0,
  roughness = 0,
  transmission = 1,
  thickness = 3,
  ior = 1.24,
  envMapIntensity = 1,
  opacity = 1,
  reflectivity = 0,

  chromaticAberration = 0.12,
  distortion = 0.45,
  distortionScale = 1,
  temporalDistortion = 0,

  backside = true,
  backsideThickness = 0.5,

  samples = 16,
  resolution = 512,

  castShadow = true,
  receiveShadow = true,
}) {
  const gltf = useGLTF(src);

  const preparedScene = useMemo(() => {
    const clone = gltf.scene.clone(true);

    clone.traverse((child) => {
      if (!child.isMesh) return;

      child.castShadow = castShadow;
      child.receiveShadow = receiveShadow;

      if (child.geometry) {
        child.geometry.computeVertexNormals();
      }
    });

    return clone;
  }, [gltf.scene, castShadow, receiveShadow]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Center>
        <Clone
          object={preparedScene}
          inject={
            <MeshTransmissionMaterial
              color={color}
              metalness={metalness}
              roughness={roughness}
              transmission={transmission}
              thickness={thickness}
              ior={ior}
              envMapIntensity={envMapIntensity}
              transparent
              opacity={opacity}
              reflectivity={reflectivity}
              chromaticAberration={chromaticAberration}
              distortion={distortion}
              distortionScale={distortionScale}
              temporalDistortion={temporalDistortion}
              backside={backside}
              backsideThickness={backsideThickness}
              samples={samples}
              resolution={resolution}
            />
          }
        />
      </Center>
    </group>
  );
}

function VideoGroundPlane({
  videoSrc = "/assets/videos/plane-video.mp4",

  planeWidth = 14,
  planeHeight = 8,
  planePosition = [0, 0, 0],
  planeRotation = [-Math.PI / 2, 0, 0],

  videoMuted = true,
  videoLoop = true,
  videoStart = true,
  videoPlaybackRate = 1,
  videoOpacity = 1,
  videoRepeat = [1, 1],
  videoOffset = [0, 0],

  receiveShadow = false,
}) {
  const videoTexture = useVideoTexture(videoSrc, {
    muted: videoMuted,
    loop: videoLoop,
    start: videoStart,
    playsInline: true,
    crossOrigin: "anonymous",
  });

  useEffect(() => {
    if (!videoTexture) return;

    videoTexture.colorSpace = THREE.SRGBColorSpace;

    videoTexture.wrapS = THREE.RepeatWrapping;
    videoTexture.wrapT = THREE.RepeatWrapping;

    videoTexture.repeat.set(videoRepeat[0], videoRepeat[1]);
    videoTexture.offset.set(videoOffset[0], videoOffset[1]);

    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.generateMipmaps = false;

    const video = videoTexture.image;

    if (video) {
      video.playbackRate = videoPlaybackRate;
    }

    videoTexture.needsUpdate = true;
  }, [videoTexture, videoPlaybackRate, videoRepeat, videoOffset]);

  return (
    <mesh
      position={planePosition}
      rotation={planeRotation}
      receiveShadow={receiveShadow}
    >
      <planeGeometry args={[planeWidth, planeHeight, 1, 1]} />

      <meshBasicMaterial
        map={videoTexture}
        transparent={videoOpacity < 1}
        opacity={videoOpacity}
        toneMapped={false}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}

export default function ModelOnPlane({
  className = "h-screen w-screen",

  modelSrc = "/assets/models/model.glb",

  modelPosition = [0, 0.35, 0],
  modelRotation = [0, Math.PI * 0.14, 0],
  modelScale = 1,

  // frosted glass model props
  modelColor = "#ffffff",
  modelMetalness = 0,
  modelRoughness = 0,
  modelTransmission = 1,
  modelThickness = 3,
  modelIor = 1.24,
  modelEnvMapIntensity = 1,
  modelOpacity = 1,
  modelReflectivity = 0,

  modelChromaticAberration = 0.12,
  modelDistortion = 0.45,
  modelDistortionScale = 1,
  modelTemporalDistortion = 0,

  modelBackside = true,
  modelBacksideThickness = 0.5,

  modelSamples = 16,
  modelResolution = 512,

  // video plane props
  videoSrc = "/assets/videos/plane-video.mp4",
  videoMuted = true,
  videoLoop = true,
  videoStart = true,
  videoPlaybackRate = 1,
  videoOpacity = 1,
  videoRepeat = [1, 1],
  videoOffset = [0, 0],

  planeWidth = 16,
  planeHeight = 9,
  planePosition = [0, 0, 0],
  planeRotation = [-Math.PI / 2, 0, 0],
  planeReceiveShadow = false,

  cameraPosition = [4.5, 3.2, 6],
  cameraFov = 35,

  enableControls = true,
  background = "#d8d8d4",

  ambientLightIntensity = 1.2,

  directionalLightPosition = [0.3, 5, 0.5],
  directionalLightTarget = [0.3, 0.8, 0.5],
  directionalLightIntensity = 6,
  directionalLightColor = "#ffffff",

  shadowMapSize = 4096,
  shadowCameraNear = 0.1,
  shadowCameraFar = 20,
  shadowCameraLeft = -3,
  shadowCameraRight = 3,
  shadowCameraTop = 3,
  shadowCameraBottom = -3,
  shadowBias = -0.000015,
  shadowNormalBias = 0.002,
  shadowRadius = 2,

  fillLightPosition = [-5, 3, -4],
  fillLightIntensity = 0.15,

  environmentPreset = "city",
  environmentIntensity = 0.85,

  toneMappingExposure = 0.95,
}) {
  return (
    <div className={className}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{
          position: cameraPosition,
          fov: cameraFov,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = toneMappingExposure;
        }}
      >
        <color attach="background" args={[background]} />

        <ambientLight intensity={ambientLightIntensity} />

        <DirectionalLight
          position={directionalLightPosition}
          targetPosition={directionalLightTarget}
          intensity={directionalLightIntensity}
          color={directionalLightColor}
          castShadow={true}
          shadowMapSize={shadowMapSize}
          shadowCameraNear={shadowCameraNear}
          shadowCameraFar={shadowCameraFar}
          shadowCameraLeft={shadowCameraLeft}
          shadowCameraRight={shadowCameraRight}
          shadowCameraTop={shadowCameraTop}
          shadowCameraBottom={shadowCameraBottom}
          shadowBias={shadowBias}
          shadowNormalBias={shadowNormalBias}
          shadowRadius={shadowRadius}
        />

        <directionalLight
          position={fillLightPosition}
          intensity={fillLightIntensity}
        />

        <Suspense fallback={null}>
          <VideoGroundPlane
            videoSrc={videoSrc}
            videoMuted={videoMuted}
            videoLoop={videoLoop}
            videoStart={videoStart}
            videoPlaybackRate={videoPlaybackRate}
            videoOpacity={videoOpacity}
            videoRepeat={videoRepeat}
            videoOffset={videoOffset}
            planeWidth={planeWidth}
            planeHeight={planeHeight}
            planePosition={planePosition}
            planeRotation={planeRotation}
            receiveShadow={planeReceiveShadow}
          />

          <FrostedGlassModel
            src={modelSrc}
            position={modelPosition}
            rotation={modelRotation}
            scale={modelScale}
            color={modelColor}
            metalness={modelMetalness}
            roughness={modelRoughness}
            transmission={modelTransmission}
            thickness={modelThickness}
            ior={modelIor}
            envMapIntensity={modelEnvMapIntensity}
            opacity={modelOpacity}
            reflectivity={modelReflectivity}
            chromaticAberration={modelChromaticAberration}
            distortion={modelDistortion}
            distortionScale={modelDistortionScale}
            temporalDistortion={modelTemporalDistortion}
            backside={modelBackside}
            backsideThickness={modelBacksideThickness}
            samples={modelSamples}
            resolution={modelResolution}
          />

          <Environment
            preset={environmentPreset}
            environmentIntensity={environmentIntensity}
          />
        </Suspense>

        {enableControls && (
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={3}
            maxDistance={12}
            target={[0, 0.25, 0]}
          />
        )}
      </Canvas>
    </div>
  );
}