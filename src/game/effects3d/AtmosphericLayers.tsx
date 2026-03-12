import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { EmotionalState } from '../types';

/**
 * Atmospheric fog/mist layers at different z-depths.
 * Creates the diorama "depth separation" between foreground and background.
 */

interface Props {
  emotion?: EmotionalState;
}

const fogVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fogFragmentShader = `
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColor;
  uniform float uSpeed;
  uniform float uDensity;
  
  varying vec2 vUv;
  
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Flowing fog using fractal brownian motion
    float fog = fbm(uv * uDensity + vec2(uTime * uSpeed, uTime * uSpeed * 0.3));
    
    // Second layer for complexity
    float fog2 = fbm(uv * uDensity * 1.5 + vec2(-uTime * uSpeed * 0.7, uTime * uSpeed * 0.5) + 50.0);
    
    fog = mix(fog, fog2, 0.4);
    
    // Vertical fade: stronger at bottom, fading at top
    float vertFade = smoothstep(0.0, 0.6, 1.0 - uv.y);
    
    // Horizontal soft edges
    float hFade = 1.0 - pow(abs(uv.x - 0.5) * 2.0, 3.0);
    
    float alpha = fog * vertFade * hFade * uOpacity;
    
    gl_FragColor = vec4(uColor, alpha);
  }
`;

const EMOTION_FOG: Record<string, {
  color: THREE.Color;
  opacity: number;
  speed: number;
}> = {
  dormant: { color: new THREE.Color('#0a1628'), opacity: 0.25, speed: 0.02 },
  wonder: { color: new THREE.Color('#1a0a30'), opacity: 0.2, speed: 0.03 },
  preparation: { color: new THREE.Color('#0a2018'), opacity: 0.18, speed: 0.025 },
  restoration: { color: new THREE.Color('#120a28'), opacity: 0.22, speed: 0.035 },
  triumph: { color: new THREE.Color('#1a1200'), opacity: 0.15, speed: 0.04 },
};

export default function AtmosphericLayers({ emotion = 'dormant' }: Props) {
  const nearFogRef = useRef<THREE.ShaderMaterial>(null);
  const midFogRef = useRef<THREE.ShaderMaterial>(null);

  const fogConfig = EMOTION_FOG[emotion] || EMOTION_FOG.dormant;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (nearFogRef.current) nearFogRef.current.uniforms.uTime.value = t;
    if (midFogRef.current) midFogRef.current.uniforms.uTime.value = t;
  });

  return (
    <group>
      {/* Mid-ground atmospheric haze - between bg and particles */}
      <mesh position={[0, -0.5, -1.2]}>
        <planeGeometry args={[8, 4]} />
        <shaderMaterial
          ref={midFogRef}
          vertexShader={fogVertexShader}
          fragmentShader={fogFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uOpacity: { value: fogConfig.opacity * 0.5 },
            uColor: { value: fogConfig.color },
            uSpeed: { value: fogConfig.speed * 0.6 },
            uDensity: { value: 2.5 },
          }}
          transparent
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* Near-ground low mist - closest to viewer */}
      <mesh position={[0, -1.5, -0.3]}>
        <planeGeometry args={[9, 3]} />
        <shaderMaterial
          ref={nearFogRef}
          vertexShader={fogVertexShader}
          fragmentShader={fogFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uOpacity: { value: fogConfig.opacity },
            uColor: { value: fogConfig.color },
            uSpeed: { value: fogConfig.speed },
            uDensity: { value: 3.5 },
          }}
          transparent
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </mesh>
    </group>
  );
}
