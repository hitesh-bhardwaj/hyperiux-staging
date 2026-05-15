"use client";

import React, { Suspense, memo, useCallback, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useTexture, Center } from "@react-three/drei";
import * as THREE from "three";

const SPIN_SPEED = Math.PI * 3; // 360° in 0.5s

const SpinningMesh = memo(function SpinningMesh({ geometry, material, position, rotation, spinTriggerRef }) {
  const meshRef = useRef();
  const spinning = useRef(false);
  const spinProgress = useRef(0);
  const lastTrigger = useRef(0);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Check for new trigger
    if (spinTriggerRef.current > lastTrigger.current && !spinning.current) {
      lastTrigger.current = spinTriggerRef.current;
      spinning.current = true;
      spinProgress.current = 0;
    }

    if (spinning.current) {
      const step = SPIN_SPEED * delta;
      spinProgress.current += step;
      meshRef.current.rotation.z += step;

      if (spinProgress.current >= Math.PI) {
        meshRef.current.rotation.z =
          Math.round(meshRef.current.rotation.z / (Math.PI * 2)) * (Math.PI * 2);
        spinProgress.current = 0;
        spinning.current = false;
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      castShadow
      receiveShadow
      geometry={geometry}
      material={material}
      position={position}
      rotation={rotation}
    />
  );
});

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
    });
  }

  useEffect(() => {
    const geometry = geometryRef.current;
    const material = materialRef.current;

    return () => {
      geometry?.dispose();
      material?.dispose();
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

const MESH_DEFS = [
  { key: "Cube_0", position: [0, 0, -200],         rotation: [0, 1.571, 0] },
  { key: "Cube_1", position: [156.366, 0, -124.698], rotation: [0, 0.673, 0] },
  { key: "Cube_2", position: [194.986, 0, 44.504],   rotation: [0, -0.224, 0] },
  { key: "Cube_3", position: [86.777, 0, 180.194],   rotation: [0, -1.122, 0] },
  { key: "Cube_4", position: [-86.777, 0, 180.194],  rotation: [Math.PI, -1.122, Math.PI] },
  { key: "Cube_5", position: [-194.986, 0, 44.504],  rotation: [Math.PI, -0.224, Math.PI] },
  { key: "Cube_6", position: [-156.366, 0, -124.698],rotation: [-Math.PI, 0.673, -Math.PI] },
];

function Model({ modelPath, texturePath, scale = 1, position = [0, 0, 0], rotation = [THREE.MathUtils.degToRad(90), 0, 0] }) {
  const { nodes } = useGLTF(modelPath);
  const texture = useTexture(texturePath);
  const groupRef = useRef();
  const { gl, pointer } = useThree();
  const spinTriggerRef = useRef(0);
  const anySpinning = useRef(false);

  const targetPointerRef = useRef(new THREE.Vector2(0, 0));
  const smoothPointerRef = useRef(new THREE.Vector2(0, 0));

  const handleTrigger = useCallback(() => {
    if (!anySpinning.current) {
      anySpinning.current = true;
      spinTriggerRef.current += 1;
      setTimeout(() => { anySpinning.current = false; }, 600);
    }
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
    const envMap = pmrem.fromEquirectangular(configuredTexture).texture;
    pmrem.dispose();
    configuredTexture.dispose();

    const material = new THREE.MeshPhysicalMaterial({
      metalness: 1.0,
      roughness: 0.01,
      transmission: 0.4,
      transparent: true,
      envMap,
      envMapIntensity: 2.5,
      color: new THREE.Color(0x8888ff),
      iridescence: 1.0,
      iridescenceIOR: 1.5,
      iridescenceThicknessRange: [100, 400],
      reflectivity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });

    return { envMap, material };
  }, [gl, texture]);

 useEffect(() => {
  return () => {
    envMap?.dispose();
    material?.dispose();
  };
}, []);

  useFrame(() => {
    if (!groupRef.current) return;

    targetPointerRef.current.set(pointer.x, pointer.y);
    smoothPointerRef.current.lerp(targetPointerRef.current, 0.055);

    groupRef.current.rotation.y = rotation[1] + smoothPointerRef.current.x * 0.25;
    groupRef.current.rotation.x = rotation[0] - smoothPointerRef.current.y * 0.1125;
    groupRef.current.rotation.z = rotation[2];
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={[scale, scale, scale]}
      dispose={null}
    >
      <ClickZone radius={250} onTrigger={handleTrigger} />
      <Center>
        {MESH_DEFS.map(({ key, position: pos, rotation: rot }) => {
  const meshNode = nodes[key];

  if (!meshNode?.geometry) return null;

  return (
    <SpinningMesh
      key={key}
      geometry={meshNode.geometry}
      material={material}
      position={pos}
      rotation={rot}
      spinTriggerRef={spinTriggerRef}
    />
  );
})}
      </Center>
    </group>
  );
}

export default function AboutModel({
  modelPosition = [-1.5, 0, 0],
  modelScale = 0.01,
  modelRotation = [0, 0, 0],
}) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-20">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 35 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); }}
        style={{ pointerEvents: "auto" }}
      >
        <ambientLight intensity={1.5} />
        <pointLight position={[5, 5, 5]} intensity={20} color="#ff00ff" />
        <pointLight position={[-5, 5, 5]} intensity={20} color="#00ffff" />
        <pointLight position={[0, -5, 5]} intensity={20} color="#ffffff" />
        <directionalLight position={[0, 5, 0]} intensity={5} />

        <Suspense fallback={null}>
          <Model
            modelPath="/assets/models/about-model.glb"
            texturePath="/assets/textures/about-texture.png"
            scale={modelScale}
            position={modelPosition}
            rotation={modelRotation}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
