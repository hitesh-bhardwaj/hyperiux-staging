"use client";

import React, {
  Suspense,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Center, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

/* ---------------- CLICK FLIP ---------------- */

const FLIP_DURATION = 0.75;
const FLIP_STAGGER = 0.045;

const power3InOut = (t) => {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

/* ---------------- WHEEL SPIN ---------------- */

const BASE_WHEEL_ROTATION_SPEED = 0.1;
const MAX_SCROLL_BOOST_SPEED = 10.5;

/*
  Keep your passed value, but now it is used safely with px/ms velocity,
  not raw px/sec, so slow and fast scrolls feel different.
*/
const SCROLL_VELOCITY_MULTIPLIER = 7.22;

const SCROLL_SPEED_LERP = 0.18;
const SCROLL_VELOCITY_SMOOTHING = 0.35;
const SCROLL_BOOST_DECAY = 0.6;
const SCROLL_VELOCITY_CURVE = 0.15;

/*
  Fixed base tilt.
  This keeps the model on the leaning plane.
*/
const BASE_TILT_ROTATION = [-0.5, 0.5, -0.8];

/* ---------------- MODEL PARTS ---------------- */

const MESH_DEFS = [
  {
    key: "Cube_0",
    position: [0, 0, -200],
    rotation: [0, 1.571, 0],
  },
  {
    key: "Cube_1",
    position: [156.366, 0, -124.698],
    rotation: [0, 0.673, 0],
  },
  {
    key: "Cube_2",
    position: [194.986, 0, 44.504],
    rotation: [0, -0.224, 0],
  },
  {
    key: "Cube_3",
    position: [86.777, 0, 180.194],
    rotation: [0, -1.122, 0],
  },
  {
    key: "Cube_4",
    position: [-86.777, 0, 180.194],
    rotation: [Math.PI, -1.122, Math.PI],
  },
  {
    key: "Cube_5",
    position: [-194.986, 0, 44.504],
    rotation: [Math.PI, -0.224, Math.PI],
  },
  {
    key: "Cube_6",
    position: [-156.366, 0, -124.698],
    rotation: [-Math.PI, 0.673, -Math.PI],
  },
];

/* ---------------- INDIVIDUAL FLIP MESH ---------------- */

const SpinningMesh = memo(function SpinningMesh({
  geometry,
  material,
  position,
  rotation,
  spinTriggerRef,
  index = 0,
}) {
  const meshRef = useRef(null);

  const spinningRef = useRef(false);
  const spinElapsedRef = useRef(0);
  const lastTriggerRef = useRef(0);

  const baseRotationRef = useRef(new THREE.Euler(...rotation));

  useEffect(() => {
    baseRotationRef.current.set(rotation[0], rotation[1], rotation[2]);
  }, [rotation]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    if (
      spinTriggerRef.current > lastTriggerRef.current &&
      !spinningRef.current
    ) {
      lastTriggerRef.current = spinTriggerRef.current;
      spinningRef.current = true;

      /*
        Small stagger between every mesh.
      */
      spinElapsedRef.current = -index * FLIP_STAGGER;
    }

    if (!spinningRef.current) return;

    spinElapsedRef.current += delta;

    if (spinElapsedRef.current < 0) return;

    const rawProgress = THREE.MathUtils.clamp(
      spinElapsedRef.current / FLIP_DURATION,
      0,
      1
    );

    const easedProgress = power3InOut(rawProgress);

    /*
      Full 360 flip with power3.inOut-style easing.
    */
    mesh.rotation.set(
      baseRotationRef.current.x,
      baseRotationRef.current.y,
      baseRotationRef.current.z + Math.PI * 2 * easedProgress
    );

    if (rawProgress >= 1) {
      mesh.rotation.set(
        baseRotationRef.current.x,
        baseRotationRef.current.y,
        baseRotationRef.current.z
      );

      spinElapsedRef.current = 0;
      spinningRef.current = false;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
    />
  );
});

/* ---------------- CLICK HIT AREA ---------------- */

const ClickZone = memo(function ClickZone({ radius, onTrigger }) {
  const geometryRef = useRef(null);
  const materialRef = useRef(null);

  if (!geometryRef.current) {
    geometryRef.current = new THREE.SphereGeometry(radius, 8, 8);
  }

  if (!materialRef.current) {
    materialRef.current = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
      depthTest: false,
    });
  }

  useEffect(() => {
    const geometry = geometryRef.current;
    const material = materialRef.current;

    return () => {
      geometry?.dispose();
      material?.dispose();
      document.body.style.cursor = "default";
    };
  }, []);

  return (
    <mesh
      geometry={geometryRef.current}
      material={materialRef.current}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onTrigger();
      }}
    />
  );
});

/* ---------------- MODEL ---------------- */

function Model({
  modelPath,
  texturePath,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) {
  const { nodes } = useGLTF(modelPath);
  const texture = useTexture(texturePath);

  const groupRef = useRef(null);
  const tiltGroupRef = useRef(null);
  const wheelGroupRef = useRef(null);

  const { gl, scene } = useThree();

  const spinTriggerRef = useRef(0);
  const anySpinningRef = useRef(false);

  /*
    Window pointer tracking.
    This works even when cursor is outside canvas.
  */
  const windowPointerRef = useRef(new THREE.Vector2(0, 0));
  const smoothPointerRef = useRef(new THREE.Vector2(0, 0));

  /*
    Realistic scroll velocity tracking.
  */
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
      windowPointerRef.current.y =
        -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      const currentY = window.scrollY || window.pageYOffset || 0;
      const now = performance.now();

      const deltaY = currentY - lastScrollYRef.current;
      const deltaTimeMs = Math.max(now - lastScrollTimeRef.current, 16);

      /*
        px/ms is more stable than px/sec here.
        This stops every scroll from instantly hitting max speed.
      */
      const instantVelocityPxMs = deltaY / deltaTimeMs;

      if (Math.abs(deltaY) > 0.25) {
        /*
          Down = clockwise.
          Up = anticlockwise.
        */
        wheelSpinDirectionRef.current = deltaY > 0 ? 1 : -1;
      }

      scrollVelocityPxMsRef.current = THREE.MathUtils.lerp(
        scrollVelocityPxMsRef.current,
        instantVelocityPxMs,
        SCROLL_VELOCITY_SMOOTHING
      );

      const velocityAbs = Math.abs(scrollVelocityPxMsRef.current);

      /*
        Non-linear boost:
        slow scroll = small boost
        medium scroll = visible boost
        fast scroll = stronger boost
      */
      const normalizedIntensity =
        1 -
        Math.exp(
          -velocityAbs * SCROLL_VELOCITY_MULTIPLIER * SCROLL_VELOCITY_CURVE
        );

      targetScrollBoostRef.current =
        MAX_SCROLL_BOOST_SPEED *
        THREE.MathUtils.clamp(normalizedIntensity, 0, 1);

      lastScrollYRef.current = currentY;
      lastScrollTimeRef.current = now;
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

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
    }, (FLIP_DURATION + MESH_DEFS.length * FLIP_STAGGER) * 1000);
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

      /*
        Texture is used as environment reflection.
        It is not pasted as a flat map.
      */
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

    return {
      envMap: generatedEnvMap,
      material: sharedMaterial,
    };
  }, [gl, texture]);

  useEffect(() => {
    const previousEnvironment = scene.environment;
    scene.environment = envMap;

    return () => {
      scene.environment = previousEnvironment;

      envMap?.dispose();
      material?.dispose();
    };
  }, [scene, envMap, material]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    const tiltGroup = tiltGroupRef.current;
    const wheelGroup = wheelGroupRef.current;

    if (!group || !tiltGroup || !wheelGroup) return;

    /*
      Window pointer parallax.
    */
    smoothPointerRef.current.lerp(windowPointerRef.current, 0.055);

    const inputX = smoothPointerRef.current.x;
    const inputY = smoothPointerRef.current.y;

    group.rotation.x = rotation[0] - inputY * 0.1125;
    group.rotation.y = rotation[1] + inputX * 0.25;
    group.rotation.z = rotation[2];

    /*
      Fixed tilted base.
      This is never animated continuously.
    */
    tiltGroup.rotation.set(
      BASE_TILT_ROTATION[0],
      BASE_TILT_ROTATION[1],
      BASE_TILT_ROTATION[2]
    );

    /*
      Smoothly chase scroll boost.
    */
    currentScrollBoostRef.current = THREE.MathUtils.lerp(
      currentScrollBoostRef.current,
      targetScrollBoostRef.current,
      SCROLL_SPEED_LERP
    );

    /*
      Decay after scroll stops.
    */
    targetScrollBoostRef.current = THREE.MathUtils.lerp(
      targetScrollBoostRef.current,
      0,
      SCROLL_BOOST_DECAY
    );

    scrollVelocityPxMsRef.current = THREE.MathUtils.lerp(
      scrollVelocityPxMsRef.current,
      0,
      SCROLL_BOOST_DECAY
    );

    const targetWheelSpeed =
      BASE_WHEEL_ROTATION_SPEED + currentScrollBoostRef.current;

    currentWheelSpeedRef.current = THREE.MathUtils.lerp(
      currentWheelSpeedRef.current,
      targetWheelSpeed,
      SCROLL_SPEED_LERP
    );

    /*
      Correct axis is Y because the pieces are arranged around X/Z.
      Down scroll = clockwise.
      Up scroll = anticlockwise.
      When scroll stops, it continues in the last direction at base speed.
    */
    wheelGroup.rotation.y +=
      delta * currentWheelSpeedRef.current * wheelSpinDirectionRef.current;
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={[scale, scale, scale]}
      dispose={null}
    >
      <group ref={tiltGroupRef} rotation={BASE_TILT_ROTATION}>
        <group ref={wheelGroupRef} rotation={[0, 0, 0]}>
          <ClickZone radius={250} onTrigger={handleTrigger} />

          <Center>
            {MESH_DEFS.map(
              (
                { key, position: meshPosition, rotation: meshRotation },
                index
              ) => {
                const meshNode = nodes[key];

                if (!meshNode?.geometry) return null;

                return (
                  <SpinningMesh
                    key={key}
                    index={index}
                    geometry={meshNode.geometry}
                    material={material}
                    position={meshPosition}
                    rotation={meshRotation}
                    spinTriggerRef={spinTriggerRef}
                  />
                );
              }
            )}
          </Center>
        </group>
      </group>
    </group>
  );
}

/* ---------------- EXPORT COMPONENT ---------------- */

export default function AboutModel({
  modelPath = "/assets/models/about-model.glb",
  texturePath = "/assets/textures/orange-texture-grainy.png",
  modelPosition = [-1.5, 0, 0],
  modelScale = 0.01,
  modelRotation = [0, 0, 0],
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 h-full w-full">
      <Canvas
        dpr={[1, 1.5]}
        camera={{
          position: [0, 0, 5],
          fov: 35,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
        style={{
          pointerEvents: "auto",
        }}
      >
        <ambientLight intensity={0.45} />
        <directionalLight position={[0, 5, 0]} intensity={1.5} />

        <Suspense fallback={null}>
          <Model
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