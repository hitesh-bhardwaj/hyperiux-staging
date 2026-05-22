"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Center, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

const FLIP_DURATION = 0.75;
const FLIP_STAGGER = 0.045;

const BASE_WHEEL_ROTATION_SPEED = 0.1;
const MAX_SCROLL_BOOST_SPEED = 10.5;
const SCROLL_VELOCITY_MULTIPLIER = 7.22;
const SCROLL_SPEED_LERP = 0.18;
const SCROLL_VELOCITY_SMOOTHING = 0.35;
const SCROLL_BOOST_DECAY = 0.6;
const SCROLL_VELOCITY_CURVE = 0.15;

const BASE_TILT_ROTATION = [-0.5, 0.5, -0.8];

const INSTANCE_COUNT = 7;

const MESH_DEFS = [
  { position: [0, 0, -200], rotation: [0, 1.571, 0] },
  { position: [156.366, 0, -124.698], rotation: [0, 0.673, 0] },
  { position: [194.986, 0, 44.504], rotation: [0, -0.224, 0] },
  { position: [86.777, 0, 180.194], rotation: [0, -1.122, 0] },
  { position: [-86.777, 0, 180.194], rotation: [Math.PI, -1.122, Math.PI] },
  { position: [-194.986, 0, 44.504], rotation: [Math.PI, -0.224, Math.PI] },
  { position: [-156.366, 0, -124.698], rotation: [-Math.PI, 0.673, -Math.PI] },
];

const power3InOut = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const _obj = new THREE.Object3D();
const _euler = new THREE.Euler();

function InstancedModel({
  modelPath,
  texturePath,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) {
  const { nodes } = useGLTF(modelPath);
  const texture = useTexture(texturePath);
  const { gl, scene } = useThree();

  const groupRef = useRef(null);
  const tiltGroupRef = useRef(null);
  const wheelGroupRef = useRef(null);
  const instancedRef = useRef(null);

  const spinTriggerRef = useRef(0);
  const anySpinningRef = useRef(false);

  const flipStatesRef = useRef(
    Array.from({ length: INSTANCE_COUNT }, () => ({
      spinning: false,
      elapsed: 0,
      lastTrigger: 0,
    })),
  );

  const windowPointerRef = useRef(new THREE.Vector2(0, 0));
  const smoothPointerRef = useRef(new THREE.Vector2(0, 0));

  const lastScrollYRef = useRef(0);
  const lastScrollTimeRef = useRef(0);
  const scrollVelocityPxMsRef = useRef(0);
  const targetScrollBoostRef = useRef(0);
  const currentScrollBoostRef = useRef(0);
  const wheelSpinDirectionRef = useRef(1);
  const currentWheelSpeedRef = useRef(BASE_WHEEL_ROTATION_SPEED);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY || window.pageYOffset || 0;
    lastScrollTimeRef.current = performance.now();

    const handlePointerMove = (event) => {
      windowPointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      windowPointerRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      const currentY = window.scrollY || window.pageYOffset || 0;
      const now = performance.now();

      const deltaY = currentY - lastScrollYRef.current;
      const deltaTimeMs = Math.max(now - lastScrollTimeRef.current, 16);
      const instantVelocityPxMs = deltaY / deltaTimeMs;

      if (Math.abs(deltaY) > 0.25) {
        wheelSpinDirectionRef.current = deltaY > 0 ? 1 : -1;
      }

      scrollVelocityPxMsRef.current = THREE.MathUtils.lerp(
        scrollVelocityPxMsRef.current,
        instantVelocityPxMs,
        SCROLL_VELOCITY_SMOOTHING,
      );

      const velocityAbs = Math.abs(scrollVelocityPxMsRef.current);
      const normalizedIntensity =
        1 - Math.exp(-velocityAbs * SCROLL_VELOCITY_MULTIPLIER * SCROLL_VELOCITY_CURVE);

      targetScrollBoostRef.current =
        MAX_SCROLL_BOOST_SPEED * THREE.MathUtils.clamp(normalizedIntensity, 0, 1);

      lastScrollYRef.current = currentY;
      lastScrollTimeRef.current = now;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleTrigger = useCallback(() => {
    if (anySpinningRef.current) return;

    anySpinningRef.current = true;
    spinTriggerRef.current += 1;

    window.setTimeout(() => {
      anySpinningRef.current = false;
    }, (FLIP_DURATION + INSTANCE_COUNT * FLIP_STAGGER) * 1000);
  }, []);

  const { envMap, material } = useMemo(() => {
    const configuredTexture = texture.clone();
    configuredTexture.flipY = false;
    configuredTexture.colorSpace = THREE.SRGBColorSpace;
    configuredTexture.mapping = THREE.EquirectangularReflectionMapping;
    configuredTexture.wrapS = THREE.RepeatWrapping;
    configuredTexture.wrapT = THREE.RepeatWrapping;
    configuredTexture.repeat.set(3, 3);
    configuredTexture.needsUpdate = true;

    const pmrem = new THREE.PMREMGenerator(gl);
    pmrem.compileEquirectangularShader();
    const generatedEnvMap = pmrem.fromEquirectangular(configuredTexture).texture;
    pmrem.dispose();
    configuredTexture.dispose();

    const sharedMaterial = new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      envMap: generatedEnvMap,
      envMapIntensity: 2.8,
      metalness: 1,
      roughness: 0.018,
      clearcoat: 1,
      clearcoatRoughness: 0.025,
      reflectivity: 1,
      iridescence: 0.9,
      iridescenceIOR: 1.5,
      iridescenceThicknessRange: [100, 420],
      transmission: 0,
      transparent: false,
      opacity: 1,
      side: THREE.FrontSide,
      toneMapped: true,
    });

    return { envMap: generatedEnvMap, material: sharedMaterial };
  }, [gl, texture]);

  useEffect(() => {
    const previousEnvironment = scene.environment;
    return () => {
      scene.environment = previousEnvironment;
      envMap?.dispose();
      material?.dispose();
    };
  }, [scene, envMap, material]);

  const geometry = useMemo(() => {
    const firstNode = nodes["Cube_0"];
    return firstNode?.geometry ?? null;
  }, [nodes]);

  useEffect(() => {
    if (!instancedRef.current || !geometry) return;

    for (let i = 0; i < INSTANCE_COUNT; i++) {
      const def = MESH_DEFS[i];
      _obj.position.set(...def.position);
      _obj.rotation.set(...def.rotation);
      _obj.updateMatrix();
      instancedRef.current.setMatrixAt(i, _obj.matrix);
    }

    instancedRef.current.instanceMatrix.needsUpdate = true;
  }, [geometry]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    const tiltGroup = tiltGroupRef.current;
    const wheelGroup = wheelGroupRef.current;
    const instanced = instancedRef.current;

    if (!group || !tiltGroup || !wheelGroup || !instanced) return;

    smoothPointerRef.current.lerp(windowPointerRef.current, 0.055);

    const inputX = smoothPointerRef.current.x;
    const inputY = smoothPointerRef.current.y;

    group.rotation.x = rotation[0] - inputY * 0.1125;
    group.rotation.y = rotation[1] + inputX * 0.25;
    group.rotation.z = rotation[2];

    tiltGroup.rotation.set(
      BASE_TILT_ROTATION[0],
      BASE_TILT_ROTATION[1],
      BASE_TILT_ROTATION[2],
    );

    currentScrollBoostRef.current = THREE.MathUtils.lerp(
      currentScrollBoostRef.current,
      targetScrollBoostRef.current,
      SCROLL_SPEED_LERP,
    );

    targetScrollBoostRef.current = THREE.MathUtils.lerp(
      targetScrollBoostRef.current,
      0,
      SCROLL_BOOST_DECAY,
    );

    scrollVelocityPxMsRef.current = THREE.MathUtils.lerp(
      scrollVelocityPxMsRef.current,
      0,
      SCROLL_BOOST_DECAY,
    );

    const targetWheelSpeed =
      BASE_WHEEL_ROTATION_SPEED + currentScrollBoostRef.current;

    currentWheelSpeedRef.current = THREE.MathUtils.lerp(
      currentWheelSpeedRef.current,
      targetWheelSpeed,
      SCROLL_SPEED_LERP,
    );

    wheelGroup.rotation.y +=
      delta * currentWheelSpeedRef.current * wheelSpinDirectionRef.current;

    const flipStates = flipStatesRef.current;
    const trigger = spinTriggerRef.current;
    let matrixDirty = false;

    for (let i = 0; i < INSTANCE_COUNT; i++) {
      const state = flipStates[i];
      const def = MESH_DEFS[i];

      if (trigger > state.lastTrigger && !state.spinning) {
        state.lastTrigger = trigger;
        state.spinning = true;
        state.elapsed = -i * FLIP_STAGGER;
      }

      if (!state.spinning) continue;

      state.elapsed += delta;

      if (state.elapsed < 0) continue;

      const rawProgress = THREE.MathUtils.clamp(state.elapsed / FLIP_DURATION, 0, 1);
      const easedProgress = power3InOut(rawProgress);

      _euler.set(def.rotation[0], def.rotation[1], def.rotation[2]);
      _obj.position.set(...def.position);
      _obj.rotation.set(_euler.x, _euler.y, _euler.z + Math.PI * 2 * easedProgress);
      _obj.updateMatrix();
      instanced.setMatrixAt(i, _obj.matrix);
      matrixDirty = true;

      if (rawProgress >= 1) {
        _obj.rotation.set(_euler.x, _euler.y, _euler.z);
        _obj.updateMatrix();
        instanced.setMatrixAt(i, _obj.matrix);
        state.elapsed = 0;
        state.spinning = false;
      }
    }

    if (matrixDirty) {
      instanced.instanceMatrix.needsUpdate = true;
    }
  });

  if (!geometry) return null;

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={[scale, scale, scale]}
      dispose={null}
    >
      <group ref={tiltGroupRef} rotation={BASE_TILT_ROTATION}>
        <group ref={wheelGroupRef}>
          <mesh
            onClick={(e) => {
              e.stopPropagation();
              handleTrigger();
            }}
            onPointerOver={() => { document.body.style.cursor = "pointer"; }}
            onPointerOut={() => { document.body.style.cursor = "default"; }}
          >
            <sphereGeometry args={[250, 8, 8]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} depthTest={false} />
          </mesh>

          <Center>
            <instancedMesh
              ref={instancedRef}
              args={[geometry, material, INSTANCE_COUNT]}
              frustumCulled={false}
            />
          </Center>
        </group>
      </group>
    </group>
  );
}

export default function FloatingBlocks({
  modelPath = "/assets/models/about-model.glb",
  texturePath = "/assets/textures/orange-texture-grainy.png",
  modelPosition = [-1.5, 0, 0],
  modelScale = 0.01,
  modelRotation = [0, 0, 0],
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 h-full w-full">
      <Canvas
        dpr={[1]}
        camera={{ position: [0, 0, 5], fov: 35 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
  
        }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        style={{ pointerEvents: "auto" }}
      >
        <Suspense fallback={null}>
          <InstancedModel
            modelPath={modelPath}
            texturePath={texturePath}
            scale={modelScale}
            position={modelPosition}
            rotation={modelRotation}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/assets/models/about-model.glb");
