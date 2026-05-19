"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
    Center,
    Clone,
    Environment,
    Float,
    MeshTransmissionMaterial,
    useGLTF,
} from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

function RGBMiniLights() {
    return (
        <>
            <ambientLight intensity={0.3} />

            <directionalLight
                color="#ff2a2a"
                intensity={0.45}
                position={[-2.4, 1.4, -2.6]}
            />

            <directionalLight
                color="#2dff72"
                intensity={0.28}
                position={[2.2, 1.1, -2.2]}
            />

            <directionalLight
                color="#2a6cff"
                intensity={0.38}
                position={[0, -2.1, -2.8]}
            />

            <directionalLight
                color="#ffffff"
                intensity={5.6}
                position={[0, 2.5, -3.5]}
            />
        </>
    );
}

function GlassModel({
    src = "/assets/models/hyperiexLogoNo2.glb",

    isMenuOpen = false,

    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 0.08,
    thickness = 2,

    mouseRotationStrengthX = 0.32,
    mouseRotationStrengthY = 0.38,
    mouseRotationStrengthZ = 0.12,
    mousePositionStrength = 0.04,

    mouseLerp = 0.075,

    openDuration = 1.05,
    openEase = "power3.inOut",

    closeResetDuration = 0.55,
    closeResetEase = "power2.inOut",

    glassColor = "#ffffff",
    transmission = 1,
    glassThickness = 1.15,
    roughness = 0.5,
    ior = 1.12,
    chromaticAberration = 0.42,
    anisotropy = 0.45,
    distortion = 0.32,
    distortionScale = 0.55,
    temporalDistortion = 0.0,
    backside = true,
}) {
    const parentGroupRef = useRef(null);
    const introGroupRef = useRef(null);
    const modelInteractionGroupRef = useRef(null);

    const mouseTargetRef = useRef(new THREE.Vector2(0, 0));
    const mouseSmoothRef = useRef(new THREE.Vector2(0, 0));

    const canMouseMoveRef = useRef(false);
    const isMenuOpenRef = useRef(false);
    const introTimelineRef = useRef(null);
    const previousMenuOpenRef = useRef(isMenuOpen);

    const baseRotationRef = useRef(new THREE.Euler(rotation[0], rotation[1], rotation[2]));

    const { scene } = useGLTF(src);

    useEffect(() => {
        baseRotationRef.current.set(rotation[0], rotation[1], rotation[2]);
    }, [rotation[0], rotation[1], rotation[2]]);

    useEffect(() => {
        scene.traverse((child) => {
            if (!child.isMesh) return;

            child.renderOrder = 20;
            child.frustumCulled = false;

            if (child.geometry) {
                child.geometry.computeVertexNormals();
            }
        });
    }, [scene]);

    useEffect(() => {
        const handlePointerMove = (event) => {
            if (!canMouseMoveRef.current || !isMenuOpenRef.current) return;

            const x = (event.clientX / window.innerWidth) * 2 - 1;
            const y = -((event.clientY / window.innerHeight) * 2 - 1);

            mouseTargetRef.current.set(x, y);
        };

        const resetPointer = () => {
            mouseTargetRef.current.set(0, 0);
        };

        window.addEventListener("pointermove", handlePointerMove, {
            passive: true,
        });

        window.addEventListener("blur", resetPointer);
        document.addEventListener("mouseleave", resetPointer);

        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("blur", resetPointer);
            document.removeEventListener("mouseleave", resetPointer);
        };
    }, []);

    const resetMouseValues = () => {
        mouseTargetRef.current.set(0, 0);
        mouseSmoothRef.current.set(0, 0);
    };

    const resetInteractionRotationSmoothly = () => {
        const interactionGroup = modelInteractionGroupRef.current;
        if (!interactionGroup) return;

        const baseRotation = baseRotationRef.current;

        gsap.killTweensOf([interactionGroup.rotation, interactionGroup.position]);

        gsap.to(interactionGroup.rotation, {
            x: baseRotation.x,
            y: baseRotation.y,
            z: baseRotation.z,
            duration: closeResetDuration,
            ease: closeResetEase,
            overwrite: true,
        });

        gsap.to(interactionGroup.position, {
            x: 0,
            y: 0,
            z: 0,
            duration: closeResetDuration,
            ease: closeResetEase,
            overwrite: true,
        });
    };

    useEffect(() => {
        const introGroup = introGroupRef.current;
        const interactionGroup = modelInteractionGroupRef.current;

        if (!introGroup || !interactionGroup) return;

        const menuStateActuallyChanged = previousMenuOpenRef.current !== isMenuOpen;
        previousMenuOpenRef.current = isMenuOpen;

        if (!menuStateActuallyChanged) return;

        isMenuOpenRef.current = isMenuOpen;

        const baseRotation = baseRotationRef.current;

        if (introTimelineRef.current) {
            introTimelineRef.current.kill();
            introTimelineRef.current = null;
        }

        canMouseMoveRef.current = false;
        resetMouseValues();

        if (isMenuOpen) {
            gsap.killTweensOf([
                introGroup.rotation,
                introGroup.scale,
                interactionGroup.rotation,
                interactionGroup.position,
            ]);

            interactionGroup.position.set(0, 0, 0);
            interactionGroup.rotation.set(
                baseRotation.x,
                baseRotation.y,
                baseRotation.z
            );

            introGroup.rotation.set(0, Math.PI * 2, 0);
            introGroup.scale.set(0, 0, 0);

            const tl = gsap.timeline({
                defaults: {
                    duration: openDuration,
                    ease: openEase,
                    overwrite: true,
                },
                onComplete: () => {
                    introGroup.rotation.set(0, 0, 0);
                    introGroup.scale.set(1, 1, 1);

                    interactionGroup.position.set(0, 0, 0);
                    interactionGroup.rotation.set(
                        baseRotation.x,
                        baseRotation.y,
                        baseRotation.z
                    );

                    resetMouseValues();

                    canMouseMoveRef.current = true;
                },
            });

            tl.to(
                introGroup.rotation,
                {
                    delay:0.8,
                    x: 0,
                    y: 0,
                    z: 0,
                },
                0
            );

            tl.to(
                introGroup.scale,
                {delay:0.8,
                    x: 1,
                    y: 1,
                    z: 1,
                },
                0
            );

            introTimelineRef.current = tl;
        } else {
            canMouseMoveRef.current = false;
            resetMouseValues();

            resetInteractionRotationSmoothly();

            gsap.to(introGroup.rotation, {
                x: 0,
                y: 0,
                z: 0,
                duration: closeResetDuration,
                ease: closeResetEase,
                overwrite: true,
            });

            gsap.to(introGroup.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: closeResetDuration,
                ease: closeResetEase,
                overwrite: true,
            });
        }

        return () => {
            if (introTimelineRef.current) {
                introTimelineRef.current.kill();
                introTimelineRef.current = null;
            }
        };
    }, [isMenuOpen, openDuration, openEase, closeResetDuration, closeResetEase]);

    useFrame(() => {
        const modelInteractionGroup = modelInteractionGroupRef.current;
        if (!modelInteractionGroup) return;

        const baseRotation = baseRotationRef.current;

        if (!isMenuOpenRef.current || !canMouseMoveRef.current) {
            mouseTargetRef.current.set(0, 0);
            mouseSmoothRef.current.lerp(mouseTargetRef.current, 0.12);

            modelInteractionGroup.rotation.x = THREE.MathUtils.lerp(
                modelInteractionGroup.rotation.x,
                baseRotation.x,
                0.12
            );

            modelInteractionGroup.rotation.y = THREE.MathUtils.lerp(
                modelInteractionGroup.rotation.y,
                baseRotation.y,
                0.12
            );

            modelInteractionGroup.rotation.z = THREE.MathUtils.lerp(
                modelInteractionGroup.rotation.z,
                baseRotation.z,
                0.12
            );

            modelInteractionGroup.position.x = THREE.MathUtils.lerp(
                modelInteractionGroup.position.x,
                0,
                0.12
            );

            modelInteractionGroup.position.y = THREE.MathUtils.lerp(
                modelInteractionGroup.position.y,
                0,
                0.12
            );

            modelInteractionGroup.position.z = THREE.MathUtils.lerp(
                modelInteractionGroup.position.z,
                0,
                0.12
            );

            return;
        }

        mouseSmoothRef.current.lerp(mouseTargetRef.current, mouseLerp);

        const mx = mouseSmoothRef.current.x;
        const my = mouseSmoothRef.current.y;

        modelInteractionGroup.rotation.x = THREE.MathUtils.lerp(
            modelInteractionGroup.rotation.x,
            baseRotation.x - my * mouseRotationStrengthX,
            mouseLerp
        );

        modelInteractionGroup.rotation.y = THREE.MathUtils.lerp(
            modelInteractionGroup.rotation.y,
            baseRotation.y + mx * mouseRotationStrengthY,
            mouseLerp
        );

        modelInteractionGroup.rotation.z = THREE.MathUtils.lerp(
            modelInteractionGroup.rotation.z,
            baseRotation.z + (mx - my) * mouseRotationStrengthZ,
            mouseLerp
        );

        modelInteractionGroup.position.x = THREE.MathUtils.lerp(
            modelInteractionGroup.position.x,
            mx * mousePositionStrength,
            mouseLerp
        );

        modelInteractionGroup.position.y = THREE.MathUtils.lerp(
            modelInteractionGroup.position.y,
            my * mousePositionStrength * 0.45,
            mouseLerp
        );

        modelInteractionGroup.position.z = THREE.MathUtils.lerp(
            modelInteractionGroup.position.z,
            0,
            mouseLerp
        );
    });

    return (
        <>
            <Environment
                preset="studio"
                background={false}
                blur={0.9}
                environmentIntensity={1.2}
                environmentRotation={[0, Math.PI, 0]}
            />

            <Float speed={1} floatIntensity={0.08} rotationIntensity={0}>
                <group
                    ref={parentGroupRef}
                    position={position}
                    scale={[scale, scale, scale * thickness]}
                >
                    <group ref={introGroupRef}>
                        <group ref={modelInteractionGroupRef} rotation={rotation}>
                            <Center>
                                <Clone
                                    object={scene}
                                    inject={
                                        <MeshTransmissionMaterial
                                            color={glassColor}
                                            transmission={transmission}
                                            thickness={glassThickness}
                                            roughness={roughness}
                                            ior={ior}
                                            chromaticAberration={chromaticAberration}
                                            anisotropy={anisotropy}
                                            distortion={distortion}
                                            distortionScale={distortionScale}
                                            temporalDistortion={temporalDistortion}
                                            backside={backside}
                                            samples={24}
                                            resolution={1024}
                                            transparent
                                            opacity={1}
                                            depthWrite={false}
                                            depthTest={true}
                                            attenuationDistance={2.5}
                                            attenuationColor="#ffffff"
                                            clearcoat={1}
                                            clearcoatRoughness={0}
                                        />
                                    }
                                />
                            </Center>
                        </group>
                    </group>
                </group>
            </Float>
        </>
    );
}
const MODEL_POSITION = [0, 0, 0];
const MODEL_ROTATION = [0, 0, 0];
export default function MiniCanvas({
    className = "",
    modelSrc = "/assets/models/hyperiexLogoNo2.glb",
    isMenuOpen = false,
}) {
    return (
        <div
            className={`relative size-[20vw] overflow-hidden bg-[#111111] ${className}`}
        >
            
            <Canvas
                camera={{
// isOrthographicCamera:{}
   
                    position: [0, 0, 6],
                    fov: 20,
                }}
                gl={{
                    antialias: true,
                    alpha: false,
                    powerPreference: "high-performance",
                }}
                dpr={[1, 2]}
            >
                {/* <orthographicCamera make /> */}
                <color attach="background" args={["#111111"]} />

                <RGBMiniLights />

                <Suspense fallback={null}>
                    <GlassModel
                        src={modelSrc}
                        isMenuOpen={isMenuOpen}
                        position={MODEL_POSITION}
                        rotation={MODEL_ROTATION}
                        scale={0.08}
                        thickness={2}
                        mouseRotationStrengthX={0.0}
                        mouseRotationStrengthY={5.38}
                        mouseRotationStrengthZ={0.0}
                        mousePositionStrength={0.04}
                        mouseLerp={0.075}
                        openDuration={2}
                        openEase="back.out"
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}

useGLTF.preload("/assets/models/hyperiexLogoNo2.glb");