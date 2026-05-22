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

const MODEL_SRC = "/assets/models/hyperiexLogoNo2.glb";
const MODEL_POSITION = [0, 0, 0];
const MODEL_ROTATION = [0, 0, 0];
const OPEN_DELAY = 0.8;

const MENU_PHASE = {
    IDLE: "idle",
    OPENING: "opening",
    OPEN: "open",
    CLOSING: "closing",
};

const easePower2InOut = (t) =>
    t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;

const easeBackOut = (t, overshoot = 1.70158) => {
    const c1 = overshoot + 1;
    return 1 + c1 * (t - 1) ** 3 + overshoot * (t - 1) ** 2;
};

const EASE = {
    "power2.inOut": easePower2InOut,
    "back.out": easeBackOut,
};

const getEase = (name) => EASE[name] ?? easePower2InOut;

const lerp = THREE.MathUtils.lerp;

function lerpEuler(rotation, from, to, t) {
    rotation.x = lerp(from.x, to.x, t);
    rotation.y = lerp(from.y, to.y, t);
    rotation.z = lerp(from.z, to.z, t);
}

function lerpVec3(vec, from, to, t) {
    vec.x = lerp(from.x, to.x, t);
    vec.y = lerp(from.y, to.y, t);
    vec.z = lerp(from.z, to.z, t);
}

function dampInteraction(group, baseRotation, mx, my, strengths, factor) {
    const {
        mouseRotationStrengthX,
        mouseRotationStrengthY,
        mouseRotationStrengthZ,
        mousePositionStrength,
    } = strengths;

    group.rotation.x = lerp(
        group.rotation.x,
        baseRotation.x - my * mouseRotationStrengthX,
        factor,
    );
    group.rotation.y = lerp(
        group.rotation.y,
        baseRotation.y + mx * mouseRotationStrengthY,
        factor,
    );
    group.rotation.z = lerp(
        group.rotation.z,
        baseRotation.z + (mx - my) * mouseRotationStrengthZ,
        factor,
    );
    group.position.x = lerp(group.position.x, mx * mousePositionStrength, factor);
    group.position.y = lerp(
        group.position.y,
        my * mousePositionStrength * 0.45,
        factor,
    );
    group.position.z = lerp(group.position.z, 0, factor);
}

function dampInteractionToRest(group, baseRotation, factor) {
    group.rotation.x = lerp(group.rotation.x, baseRotation.x, factor);
    group.rotation.y = lerp(group.rotation.y, baseRotation.y, factor);
    group.rotation.z = lerp(group.rotation.z, baseRotation.z, factor);
    group.position.x = lerp(group.position.x, 0, factor);
    group.position.y = lerp(group.position.y, 0, factor);
    group.position.z = lerp(group.position.z, 0, factor);
}

function GlassMaterial({
    color = "#ffffff",
    transmission = 1,
    thickness = 1.15,
    roughness = 0.5,
    ior = 1.12,
    chromaticAberration = 0.42,
    anisotropy = 0.45,
    distortion = 0.32,
    distortionScale = 0.55,
    temporalDistortion = 0,
    backside = true,
}) {
    return (
        <MeshTransmissionMaterial
            color={color}
            transmission={transmission}
            thickness={thickness}
            roughness={roughness}
            ior={ior}
            chromaticAberration={chromaticAberration}
            anisotropy={anisotropy}
            distortion={distortion}
            distortionScale={distortionScale}
            temporalDistortion={temporalDistortion}
            backside={backside}
            samples={6}
            resolution={256}
            transparent
            opacity={1}
            depthWrite={false}
            depthTest
            attenuationDistance={2.5}
            attenuationColor="#ffffff"
            clearcoat={1}
            clearcoatRoughness={0}
        />
    );
}

function GlassModel({
    src = MODEL_SRC,
    isMenuOpen = false,
    position = MODEL_POSITION,
    rotation = MODEL_ROTATION,
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
    temporalDistortion = 0,
    backside = true,
}) {
    const introGroupRef = useRef(null);
    const interactionGroupRef = useRef(null);

    const mouseTargetRef = useRef(new THREE.Vector2(0, 0));
    const mouseSmoothRef = useRef(new THREE.Vector2(0, 0));
    const baseRotationRef = useRef(new THREE.Euler(...rotation));

    const isMenuOpenRef = useRef(isMenuOpen);
    const prevMenuOpenRef = useRef(isMenuOpen);
    const menuAnimRef = useRef({ phase: MENU_PHASE.IDLE, elapsed: 0 });

    const closeFromRotationRef = useRef(new THREE.Euler());
    const closeFromPositionRef = useRef(new THREE.Vector3());
    const closeFromIntroRotationRef = useRef(new THREE.Euler());
    const closeFromIntroScaleRef = useRef(new THREE.Vector3());

    const mouseStrengths = {
        mouseRotationStrengthX,
        mouseRotationStrengthY,
        mouseRotationStrengthZ,
        mousePositionStrength,
    };

    const { scene } = useGLTF(src);
    const easeOpen = getEase(openEase);
    const easeClose = getEase(closeResetEase);

    useEffect(() => {
        baseRotationRef.current.set(rotation[0], rotation[1], rotation[2]);
    }, [rotation]);

    useEffect(() => {
        scene.traverse((child) => {
            if (!child.isMesh) return;
            child.renderOrder = 20;
            child.frustumCulled = false;
            child.geometry?.computeVertexNormals();
        });
    }, [scene]);

    useEffect(() => {
        const onPointerMove = (event) => {
            if (menuAnimRef.current.phase !== MENU_PHASE.OPEN) return;

            mouseTargetRef.current.set(
                (event.clientX / window.innerWidth) * 2 - 1,
                -((event.clientY / window.innerHeight) * 2 - 1),
            );
        };

        const resetPointer = () => mouseTargetRef.current.set(0, 0);

        window.addEventListener("pointermove", onPointerMove, { passive: true });
        window.addEventListener("blur", resetPointer);
        document.addEventListener("mouseleave", resetPointer);

        return () => {
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("blur", resetPointer);
            document.removeEventListener("mouseleave", resetPointer);
        };
    }, []);

    useEffect(() => {
        if (prevMenuOpenRef.current === isMenuOpen) return;
        prevMenuOpenRef.current = isMenuOpen;
        isMenuOpenRef.current = isMenuOpen;

        const intro = introGroupRef.current;
        const interaction = interactionGroupRef.current;
        if (!intro || !interaction) return;

        const base = baseRotationRef.current;

        mouseTargetRef.current.set(0, 0);
        mouseSmoothRef.current.set(0, 0);

        if (isMenuOpen) {
            menuAnimRef.current = { phase: MENU_PHASE.OPENING, elapsed: 0 };

            interaction.position.set(0, 0, 0);
            interaction.rotation.set(base.x, base.y, base.z);
            intro.rotation.set(0, Math.PI * 2, 0);
            intro.scale.set(0, 0, 0);
            return;
        }

        closeFromRotationRef.current.copy(interaction.rotation);
        closeFromPositionRef.current.copy(interaction.position);
        closeFromIntroRotationRef.current.copy(intro.rotation);
        closeFromIntroScaleRef.current.copy(intro.scale);

        menuAnimRef.current = { phase: MENU_PHASE.CLOSING, elapsed: 0 };
    }, [isMenuOpen]);

    useFrame((_, delta) => {
        const intro = introGroupRef.current;
        const interaction = interactionGroupRef.current;
        if (!intro || !interaction) return;

        const base = baseRotationRef.current;
        const anim = menuAnimRef.current;

        if (anim.phase === MENU_PHASE.OPENING) {
            anim.elapsed += delta;

            if (anim.elapsed < OPEN_DELAY) {
                intro.rotation.set(0, Math.PI * 2, 0);
                intro.scale.set(0, 0, 0);
                return;
            }

            const t = Math.min(1, (anim.elapsed - OPEN_DELAY) / openDuration);
            const eased = easeOpen(t);

            intro.rotation.set(0, lerp(Math.PI * 2, 0, eased), 0);
            intro.scale.setScalar(eased);

            if (t >= 1) {
                intro.rotation.set(0, 0, 0);
                intro.scale.set(1, 1, 1);
                interaction.position.set(0, 0, 0);
                interaction.rotation.set(base.x, base.y, base.z);
                mouseTargetRef.current.set(0, 0);
                mouseSmoothRef.current.set(0, 0);
                anim.phase = MENU_PHASE.OPEN;
            }

            return;
        }

        if (anim.phase === MENU_PHASE.CLOSING) {
            anim.elapsed += delta;

            const t = Math.min(1, anim.elapsed / closeResetDuration);
            const eased = easeClose(t);

            lerpEuler(
                intro.rotation,
                closeFromIntroRotationRef.current,
                { x: 0, y: 0, z: 0 },
                eased,
            );
            lerpVec3(
                intro.scale,
                closeFromIntroScaleRef.current,
                { x: 1, y: 1, z: 1 },
                eased,
            );

            lerpEuler(
                interaction.rotation,
                closeFromRotationRef.current,
                base,
                eased,
            );
            lerpVec3(
                interaction.position,
                closeFromPositionRef.current,
                { x: 0, y: 0, z: 0 },
                eased,
            );

            mouseTargetRef.current.set(0, 0);
            mouseSmoothRef.current.lerp(mouseTargetRef.current, 0.12);

            if (t >= 1) {
                intro.rotation.set(0, 0, 0);
                intro.scale.set(1, 1, 1);
                interaction.rotation.set(base.x, base.y, base.z);
                interaction.position.set(0, 0, 0);
                anim.phase = MENU_PHASE.IDLE;
            }

            return;
        }

        const pointerActive =
            anim.phase === MENU_PHASE.OPEN && isMenuOpenRef.current;

        if (!pointerActive) {
            mouseTargetRef.current.set(0, 0);
            mouseSmoothRef.current.lerp(mouseTargetRef.current, 0.12);
            dampInteractionToRest(interaction, base, 0.12);
            return;
        }

        mouseSmoothRef.current.lerp(mouseTargetRef.current, mouseLerp);

        dampInteraction(
            interaction,
            base,
            mouseSmoothRef.current.x,
            mouseSmoothRef.current.y,
            mouseStrengths,
            mouseLerp,
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
                <group position={position} scale={[scale, scale, scale * thickness]}>
                    <group ref={introGroupRef}>
                        <group ref={interactionGroupRef} rotation={rotation}>
                            <Center>
                                <Clone
                                    object={scene}
                                    inject={
                                        <GlassMaterial
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

export default function MiniCanvas({
    className = "",
    modelSrc = MODEL_SRC,
    isMenuOpen = false,
}) {
    return (
        <div
            className={`relative size-[20vw] overflow-hidden bg-[#111111] ${className}`}
        >
            <Canvas
                camera={{ position: [0, 0, 6], fov: 20 }}
                gl={{
                    antialias: true,
                    alpha: false,
                    powerPreference: "high-performance",
                }}
                dpr={[1, 1.5]}
            >
                <color attach="background" args={["#111111"]} />
                <Suspense fallback={null}>
                    <GlassModel
                        src={modelSrc}
                        isMenuOpen={isMenuOpen}
                        mouseRotationStrengthX={0}
                        mouseRotationStrengthY={5.38}
                        mouseRotationStrengthZ={0}
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

useGLTF.preload(MODEL_SRC);
