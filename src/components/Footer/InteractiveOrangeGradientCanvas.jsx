"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  precision highp float;

  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;

  varying vec2 vUv;

  float sat(float x) {
    return clamp(x, 0.0, 1.0);
  }

  void main() {
    float time = uTime;

    float actualAspect = uResolution.x / max(uResolution.y, 1.0);
    float virtualAspect = min(actualAspect, 3.6);

    vec2 p = (vUv - 0.5) * 2.0;
    p.x *= virtualAspect;
    p.x = sign(p.x) * pow(abs(p.x), 0.82);

    float edgeFade = 1.0 - smoothstep(0.52, 1.0, abs(vUv.x - 0.5) * 2.0);

    vec2 warp = vec2(0.0);
    warp.x += sin(p.y * 1.35 + time * 0.18) * mix(0.015, 0.055, edgeFade);
    warp.y += cos(p.x * 0.95 - time * 0.14) * mix(0.012, 0.04, edgeFade);
    warp.x += cos((p.y + p.x) * 0.6 - time * 0.09) * 0.02;
    warp.y += sin((p.x - p.y) * 0.5 + time * 0.07) * 0.015;

    vec2 q = p + warp;

    float d = -time * 0.36;
    float a = 0.0;

    for (float i = 0.0; i < 6.0; i += 1.0) {
      a += cos(i - d - a * q.x);
      d += sin(q.y * (i + 1.0) + a);
    }

    d += time * 0.36;

    vec3 rawA = vec3(
      cos(q.x * d) * 0.6 + 0.4,
      cos(q.y * a) * 0.6 + 0.4,
      cos(a + d) * 0.5 + 0.5
    );

    rawA = cos(rawA * cos(vec3(d, a, 2.5)) * 0.5 + 0.5);

    vec2 qs = p;
    qs.x += sin(qs.y * 0.85 + time * 0.10) * 0.018;
    qs.y += cos(qs.x * 0.70 - time * 0.08) * 0.014;

    float ds = -time * 0.22;
    float as = 0.0;

    for (float i = 0.0; i < 6.0; i += 1.0) {
      as += cos(i - ds - as * qs.x);
      ds += sin(qs.y * (i + 1.0) + as);
    }

    ds += time * 0.22;

    vec3 rawB = vec3(
      cos(qs.x * ds) * 0.6 + 0.4,
      cos(qs.y * as) * 0.6 + 0.4,
      cos(as + ds) * 0.5 + 0.5
    );

    rawB = cos(rawB * cos(vec3(ds, as, 2.5)) * 0.5 + 0.5);

    vec3 raw = mix(rawB, rawA, edgeFade);

    float field = dot(raw, vec3(0.333333));
    field += mix(0.010, 0.040, edgeFade) * sin((q.x + q.y) * 1.3 + time * 0.12);
    field += mix(0.008, 0.032, edgeFade) * cos((q.x - q.y) * 1.8 - time * 0.09);
    field = sat(field);

    float body   = smoothstep(0.24, 0.86, field);
    float bulge  = smoothstep(0.56, 0.87, field);
    float core   = smoothstep(0.74, 0.96, field);
    float cavity = 1.0 - smoothstep(0.18, 0.44, field);

    float ridgeA = abs(sin(raw.r * mix(2.6, 4.2, edgeFade) + d * 0.35));
    float ridgeB = abs(cos(raw.g * mix(2.4, 3.8, edgeFade) + a * 0.32));
    float ridge = ridgeA * 0.52 + ridgeB * 0.48;

    vec3 blackBase   = vec3(0.08, 0.08, 0.08);
    vec3 deepBlack   = vec3(0.028, 0.020, 0.014);
    vec3 darkBurn    = vec3(0.22, 0.09, 0.016);

    vec3 orangeMain  = vec3(1.0, 0.2725, 0.0);
    vec3 orangeHot   = vec3(1.0, 0.25, 0.05);
    vec3 amber       = vec3(1.0, 0.53, 0.10);
    vec3 yellowAmber = vec3(1.0, 0.68, 0.18);

    vec3 col = blackBase;

    col = mix(col, darkBurn, body * 0.34);
    col = mix(col, orangeMain, bulge * 0.90);
    col = mix(col, orangeHot, core * 0.22);
    col = mix(col, amber, core * 0.10);
    col = mix(col, yellowAmber, core * 0.04);

    col = mix(col, deepBlack, cavity * 0.50);

    float shading = 0.5 + 0.5 * sin(field * 4.2 + d * 0.22 + a * 0.08);
    col *= mix(0.82, 1.12, shading);

    float groove = smoothstep(0.76, 0.96, ridge) * (1.0 - bulge * 0.38);
    groove *= mix(0.25, 1.0, edgeFade);
    col = mix(col, deepBlack, groove * 0.06);

    col += orangeMain * ridge * bulge * 0.06;
    col += orangeHot * ridge * core * 0.022;
    col += amber * core * 0.012;

    float distFromCenter = length((vUv - 0.5) * vec2(1.0, 1.1));
    float vignette = smoothstep(1.02, 0.20, distFromCenter);
    col *= mix(0.70, 1.0, vignette);

    col = pow(col, vec3(0.99));

    gl_FragColor = vec4(col, 1.0);
  }
`;

const overlayFragmentShader = `
  precision highp float;

  uniform sampler2D uTrailMask;
  uniform float uOverlayOpacity;

  varying vec2 vUv;

  void main() {
    float mask = texture2D(uTrailMask, vec2(vUv.x, 1.0 - vUv.y)).r;

    float reveal = smoothstep(0.03, 0.9, mask);
    float alpha = uOverlayOpacity * (1.0 - reveal);

    gl_FragColor = vec4(vec3(0.0667), alpha);
  }
`;

const TRAIL_IDLE_CLEAR_FRAMES = 90;

function FluidOrangeShaderPlane({ speed = 1.0 }) {
  const materialRef = useRef(null);
  const { size, gl, invalidate } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    [],
  );

  useEffect(() => {
    if (!materialRef.current) return;

    const dpr = gl.getPixelRatio();
    materialRef.current.uniforms.uResolution.value.set(
      size.width * dpr,
      size.height * dpr,
    );
  }, [size.width, size.height, gl]);

  useFrame(({ clock }) => {
    if (!materialRef.current) return;

    materialRef.current.uniforms.uTime.value = clock.elapsedTime * speed;
    invalidate();
  });

  return (
    <mesh renderOrder={0}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

function TrailOverlayPlane({
  mouseTargetRef,
  pointerInsideRef,
  overlayOpacity = 0.96,
  trailLerp = 0.22,
  trailWidth = 95,
  trailBlur = 45,
  trailFade = 0.045,
  maskResolution = 512,
  trailHeightMultiplier = 2.25,
  idleFadeMultiplier = 2.8,
  idleVelocityThreshold = 0.0008,
}) {
  const materialRef = useRef(null);
  const { size, invalidate } = useThree();

  const smoothMouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const lastMouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const previousTargetRef = useRef(new THREE.Vector2(0.5, 0.5));
  const hasStartedRef = useRef(false);
  const trailPersistRef = useRef(false);
  const idleFramesRef = useRef(0);

  const maskData = useMemo(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.flipY = false;

    return { canvas, ctx, texture };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTrailMask: { value: maskData.texture },
      uOverlayOpacity: { value: overlayOpacity },
    }),
    [maskData.texture, overlayOpacity],
  );

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uOverlayOpacity.value = overlayOpacity;
    }
  }, [overlayOpacity]);

  /* eslint-disable react-hooks/immutability -- 2D trail mask canvas is updated imperatively */
  useEffect(() => {
    const { canvas, ctx, texture } = maskData;

    const aspect = size.width / Math.max(size.height, 1);
    const nextWidth = maskResolution;
    const nextHeight = Math.max(1, Math.round(maskResolution / aspect));

    if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
      canvas.width = nextWidth;
      canvas.height = nextHeight;

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      hasStartedRef.current = false;
      trailPersistRef.current = false;
      idleFramesRef.current = 0;
      texture.needsUpdate = true;
    }
  }, [size.width, size.height, maskResolution, maskData]);

  useFrame(() => {
    if (!materialRef.current) return;

    const { canvas, ctx, texture } = maskData;
    const w = canvas.width;
    const h = canvas.height;

    if (w === 0 || h === 0) return;

    const targetDistance = mouseTargetRef.current.distanceTo(
      previousTargetRef.current,
    );
    previousTargetRef.current.copy(mouseTargetRef.current);

    const isIdle = targetDistance < idleVelocityThreshold;
    const isDrawing = pointerInsideRef.current && !isIdle;

    if (isDrawing) {
      trailPersistRef.current = true;
      idleFramesRef.current = 0;
    } else if (trailPersistRef.current) {
      idleFramesRef.current += 1;
      if (idleFramesRef.current > TRAIL_IDLE_CLEAR_FRAMES) {
        trailPersistRef.current = false;
      }
    }

    if (!trailPersistRef.current) return;

    const activeFade = isIdle ? trailFade * idleFadeMultiplier : trailFade;

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = `rgba(0, 0, 0, ${activeFade})`;
    ctx.fillRect(0, 0, w, h);

    if (isDrawing) {
      smoothMouseRef.current.lerp(mouseTargetRef.current, trailLerp);

      const x = smoothMouseRef.current.x * w;
      const y = smoothMouseRef.current.y * h;

      if (!hasStartedRef.current) {
        lastMouseRef.current.set(x, y);
        hasStartedRef.current = true;
      }

      const lastX = lastMouseRef.current.x;
      const lastY = lastMouseRef.current.y;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.translate(0, y);
      ctx.scale(1, trailHeightMultiplier);
      ctx.translate(0, -y);

      ctx.shadowBlur = trailBlur;
      ctx.shadowColor = "rgba(255,255,255,0.95)";
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.lineWidth = trailWidth;

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();

      ctx.shadowBlur = trailBlur * 0.75;
      ctx.fillStyle = "rgba(255,255,255,0.76)";
      ctx.beginPath();
      ctx.arc(x, y, trailWidth * 0.24, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      lastMouseRef.current.set(x, y);
    }

    if (!trailPersistRef.current) {
      hasStartedRef.current = false;
    }

    texture.needsUpdate = true;
    invalidate();
  });
  /* eslint-enable react-hooks/immutability */

  useEffect(() => {
    return () => {
      maskData.texture.dispose();
    };
  }, [maskData.texture]);

  return (
    <mesh renderOrder={1} position={[0, 0, 0.001]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={overlayFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}

function ShaderScene({
  speed,
  mouseTargetRef,
  pointerInsideRef,
  overlayOpacity,
  trailLerp,
  trailWidth,
  trailBlur,
  trailFade,
  maskResolution,
}) {
  return (
    <>
      <FluidOrangeShaderPlane speed={speed} />

      <TrailOverlayPlane
        mouseTargetRef={mouseTargetRef}
        pointerInsideRef={pointerInsideRef}
        overlayOpacity={overlayOpacity}
        trailLerp={trailLerp}
        trailWidth={trailWidth}
        trailBlur={trailBlur}
        trailFade={trailFade}
        maskResolution={maskResolution}
        trailHeightMultiplier={1.25}
        idleFadeMultiplier={0.8}
      />
    </>
  );
}

export default function InteractiveOrangeGradientCanvas({
  className = "",
  speed = 1.0,
  overlayOpacity = 0.96,
  trailLerp = 0.22,
  trailWidth = 95,
  trailBlur = 45,
  trailFade = 0.045,
  maskResolution = 512,
  interactionRef = null,
  interactionSelector = null,
}) {
  const wrapperRef = useRef(null);
  const mouseTargetRef = useRef(new THREE.Vector2(0.5, 0.5));
  const pointerInsideRef = useRef(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const getInteractionElement = () => {
      if (interactionRef?.current) return interactionRef.current;

      if (interactionSelector && typeof document !== "undefined") {
        return document.querySelector(interactionSelector);
      }

      return wrapper;
    };

    const interactionEl = getInteractionElement();
    if (!interactionEl) return;

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    const handlePointerEnter = () => {
      pointerInsideRef.current = true;
    };

    const handlePointerMove = (event) => {
      const interactionRect = interactionEl.getBoundingClientRect();

      const x = clamp(
        (event.clientX - interactionRect.left) / interactionRect.width,
        0,
        1,
      );

      const y = clamp(
        (event.clientY - interactionRect.top) / interactionRect.height,
        0,
        1,
      );

      mouseTargetRef.current.set(x, y);
      pointerInsideRef.current = true;
    };

    const handlePointerLeave = () => {
      pointerInsideRef.current = false;
    };

    interactionEl.addEventListener("pointerenter", handlePointerEnter);
    interactionEl.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    interactionEl.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      interactionEl.removeEventListener("pointerenter", handlePointerEnter);
      interactionEl.removeEventListener("pointermove", handlePointerMove);
      interactionEl.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [interactionRef, interactionSelector]);

  return (
    <div
      ref={wrapperRef}
      className={`relative h-full w-full overflow-hidden bg-[#111111] ${className}`}
    >
      <Canvas
        orthographic
        frameloop="demand"
        camera={{ position: [0, 0, 1], zoom: 1 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={1}
      >
        <ShaderScene
          speed={speed}
          mouseTargetRef={mouseTargetRef}
          pointerInsideRef={pointerInsideRef}
          overlayOpacity={overlayOpacity}
          trailLerp={trailLerp}
          trailWidth={trailWidth}
          trailBlur={trailBlur}
          trailFade={trailFade}
          maskResolution={maskResolution}
        />
      </Canvas>
    </div>
  );
}
