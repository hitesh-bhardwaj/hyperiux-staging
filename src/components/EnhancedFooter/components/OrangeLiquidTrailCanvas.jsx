"use client";

import React, { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useFBO } from "@react-three/drei";
import * as THREE from "three";

const BG_COLOR = "#111111";

function hexToRawVector3(hex) {
  const clean = hex.replace("#", "");

  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;

  return new THREE.Vector3(r, g, b);
}

const simVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const simFragmentShader = `
  precision highp float;

  varying vec2 vUv;

  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform vec2 uPrevMouse;
  uniform vec2 uVelocity;
  uniform vec2 uResolution;

  uniform float uTime;
  uniform float uDelta;
  uniform float uMouseActive;

  uniform float uDissipation;
  uniform float uVelocityDissipation;
  uniform float uSpread;
  uniform float uSwirl;
  uniform float uViscosity;
  uniform float uTrailStrength;
  uniform float uTrailRadius;

  float circle(vec2 uv, vec2 pos, float radius) {
    float d = distance(uv, pos);
    return smoothstep(radius, 0.0, d);
  }

  vec2 rotate(vec2 v, float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c) * v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 texel = 1.0 / uResolution;

    vec4 center = texture2D(uTexture, uv);

    vec4 left  = texture2D(uTexture, uv - vec2(texel.x, 0.0));
    vec4 right = texture2D(uTexture, uv + vec2(texel.x, 0.0));
    vec4 down  = texture2D(uTexture, uv - vec2(0.0, texel.y));
    vec4 up    = texture2D(uTexture, uv + vec2(0.0, texel.y));

    vec2 flowVelocity = center.gb;

    float curl = right.r - left.r - up.r + down.r;

    vec2 curlForce = vec2(curl, -curl);
    curlForce = rotate(curlForce, sin(uTime * 0.6) * 0.35);

    vec2 advectVelocity = flowVelocity * uSpread;
    advectVelocity += curlForce * uSwirl * 0.012;

    vec2 backUv = uv - advectVelocity * uDelta;

    vec4 advected = texture2D(uTexture, backUv);

    vec4 blurred = (
      left +
      right +
      up +
      down +
      center * 4.0
    ) / 8.0;

    vec4 liquid = mix(advected, blurred, uViscosity);

    liquid.r *= uDissipation;
    liquid.gb *= uVelocityDissipation;
    liquid.a = 1.0;

    vec2 line = uMouse - uPrevMouse;
    float trail = 0.0;

    float lineLength = length(line);

    if (lineLength > 0.0001) {
      vec2 point = uv - uPrevMouse;
      float h = clamp(dot(point, line) / dot(line, line), 0.0, 1.0);
      vec2 closest = uPrevMouse + line * h;
      trail = circle(uv, closest, uTrailRadius);
    }

    float mouseBlob = circle(uv, uMouse, uTrailRadius * 1.2);
    trail = max(trail, mouseBlob * 0.85);
    trail *= uMouseActive;

    vec2 mouseDir = normalize(uVelocity + 0.00001);
    float mouseSpeed = clamp(length(uVelocity), 0.0, 3.0);

    vec2 injectedVelocity = mouseDir * mouseSpeed * 0.55;
    injectedVelocity += vec2(-mouseDir.y, mouseDir.x) * trail * uSwirl * 0.045;

    liquid.r += trail * uTrailStrength;
    liquid.gb += injectedVelocity * trail;

    liquid.r = clamp(liquid.r, 0.0, 1.0);
    liquid.gb = clamp(liquid.gb, -2.0, 2.0);

    gl_FragColor = liquid;
  }
`;

const displayVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const displayFragmentShader = `
  precision highp float;

  varying vec2 vUv;

  uniform sampler2D uTexture;
  uniform vec3 uColor;
  uniform vec3 uBackground;
  uniform float uIntensity;
  uniform float uGlow;
  uniform float uBgLift;

  void main() {
    vec4 liquid = texture2D(uTexture, vUv);

    float trail = liquid.r;

    float core = smoothstep(0.08, 0.7, trail);
    float glow = smoothstep(0.0, 0.55, trail) * uGlow;

    vec3 bg = uBackground + vec3(uBgLift);

    /*
      Hue-preserving orange.
      Removed the yellow highlight mix that was making the liquid look yellow.
    */
    float liquidStrength = clamp(core * uIntensity + glow * 0.45, 0.0, 1.0);

    vec3 color = mix(bg, uColor, liquidStrength);

    /*
      Soft orange glow using the same orange hue.
      Lower this if you want less blooming.
    */
    color += uColor * glow * 0.18;

    color = clamp(color, 0.0, 1.0);

    gl_FragColor = vec4(color, 1.0);
  }
`;

function OrangeLiquidTrail({
  color = "#ff4a00",
  background = BG_COLOR,

  bgLift = 0.0,

  dissipation = 0.94,
  velocityDissipation = 0.82,
  spread = 1.2,
  swirl = 0.4,
  viscosity = 0.42,

  trailStrength = 0.38,
  trailRadius = 0.08,

  intensity = 1.25,
  glow = 0.75,
}) {
  const { gl, size } = useThree();

  const simScene = useMemo(() => new THREE.Scene(), []);

  const simCamera = useMemo(
    () => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1),
    []
  );

  const targetA = useFBO(size.width, size.height, {
    type: THREE.HalfFloatType,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    depthBuffer: false,
    stencilBuffer: false,
  });

  const targetB = useFBO(size.width, size.height, {
    type: THREE.HalfFloatType,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    depthBuffer: false,
    stencilBuffer: false,
  });

  const readTarget = useRef(targetA);
  const writeTarget = useRef(targetB);

  const windowMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const rawMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const prevMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const smoothMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const velocity = useRef(new THREE.Vector2(0, 0));
  const activeStrength = useRef(0);
  const hasMouseMoved = useRef(false);

  const rawBackground = useMemo(() => {
    return hexToRawVector3(background);
  }, [background]);

  const rawOrange = useMemo(() => {
    return hexToRawVector3(color);
  }, [color]);

  const simMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: simVertexShader,
      fragmentShader: simFragmentShader,
      uniforms: {
        uTexture: { value: null },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uPrevMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uVelocity: { value: new THREE.Vector2(0, 0) },
        uResolution: { value: new THREE.Vector2(size.width, size.height) },
        uTime: { value: 0 },
        uDelta: { value: 0 },
        uMouseActive: { value: 0 },

        uDissipation: { value: dissipation },
        uVelocityDissipation: { value: velocityDissipation },
        uSpread: { value: spread },
        uSwirl: { value: swirl },
        uViscosity: { value: viscosity },
        uTrailStrength: { value: trailStrength },
        uTrailRadius: { value: trailRadius },
      },
    });
  }, []);

  const displayMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: displayVertexShader,
      fragmentShader: displayFragmentShader,
      toneMapped: false,
      uniforms: {
        uTexture: { value: null },
        uColor: { value: rawOrange.clone() },
        uBackground: { value: rawBackground.clone() },
        uIntensity: { value: intensity },
        uGlow: { value: glow },
        uBgLift: { value: bgLift },
      },
    });
  }, []);

  useEffect(() => {
    gl.setClearColor(BG_COLOR, 1);
  }, [gl]);

  useEffect(() => {
    const handlePointerMove = (event) => {
      const x = event.clientX / window.innerWidth;
      const y = 1.0 - event.clientY / window.innerHeight;

      windowMouse.current.set(x, y);
      hasMouseMoved.current = true;
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  useEffect(() => {
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, simMaterial);

    simScene.add(mesh);

    return () => {
      simScene.remove(mesh);
      geometry.dispose();
      simMaterial.dispose();
      displayMaterial.dispose();
    };
  }, [simScene, simMaterial, displayMaterial]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    const targetMouse = windowMouse.current;

    const rawMovement = targetMouse.distanceTo(rawMouse.current);
    rawMouse.current.copy(targetMouse);

    const isMoving = hasMouseMoved.current && rawMovement > 0.00035;

    activeStrength.current = THREE.MathUtils.damp(
      activeStrength.current,
      isMoving ? 1 : 0,
      isMoving ? 16 : 18,
      delta
    );

    prevMouse.current.copy(smoothMouse.current);
    smoothMouse.current.lerp(targetMouse, 0.18);

    velocity.current
      .copy(smoothMouse.current)
      .sub(prevMouse.current)
      .multiplyScalar(1.0 / Math.max(delta, 0.016));

    const active = activeStrength.current < 0.01 ? 0 : activeStrength.current;

    simMaterial.uniforms.uTexture.value = readTarget.current.texture;
    simMaterial.uniforms.uMouse.value.copy(smoothMouse.current);
    simMaterial.uniforms.uPrevMouse.value.copy(prevMouse.current);
    simMaterial.uniforms.uVelocity.value.copy(velocity.current);
    simMaterial.uniforms.uResolution.value.set(size.width, size.height);
    simMaterial.uniforms.uTime.value = time;
    simMaterial.uniforms.uDelta.value = Math.min(delta, 0.033);
    simMaterial.uniforms.uMouseActive.value = active;

    simMaterial.uniforms.uDissipation.value = dissipation;
    simMaterial.uniforms.uVelocityDissipation.value = velocityDissipation;
    simMaterial.uniforms.uSpread.value = spread;
    simMaterial.uniforms.uSwirl.value = swirl;
    simMaterial.uniforms.uViscosity.value = viscosity;
    simMaterial.uniforms.uTrailStrength.value = trailStrength;
    simMaterial.uniforms.uTrailRadius.value = trailRadius;

    rawOrange.copy(hexToRawVector3(color));
    rawBackground.copy(hexToRawVector3(background));

    displayMaterial.uniforms.uColor.value.copy(rawOrange);
    displayMaterial.uniforms.uBackground.value.copy(rawBackground);
    displayMaterial.uniforms.uIntensity.value = intensity;
    displayMaterial.uniforms.uGlow.value = glow;
    displayMaterial.uniforms.uBgLift.value = bgLift;

    gl.setRenderTarget(writeTarget.current);
    gl.render(simScene, simCamera);
    gl.setRenderTarget(null);

    const temp = readTarget.current;
    readTarget.current = writeTarget.current;
    writeTarget.current = temp;

    displayMaterial.uniforms.uTexture.value = readTarget.current.texture;
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <primitive object={displayMaterial} attach="material" />
    </mesh>
  );
}

export default function OrangeLiquidTrailCanvas() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ backgroundColor: BG_COLOR }}
    >
      <Canvas
        flat
        camera={{ position: [0, 0, 1], fov: 75 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
      >
        <color attach="background" args={[BG_COLOR]} />

        <OrangeLiquidTrail
          color="#ff2d00"
          background={BG_COLOR}
          bgLift={0.0}
          dissipation={0.94}
          velocityDissipation={0.82}
          spread={1.2}
          swirl={0.4}
          viscosity={0.42}
          trailStrength={0.38}
          trailRadius={0.08}
          intensity={1.25}
          glow={3}
        />
      </Canvas>
    </div>
  );
}