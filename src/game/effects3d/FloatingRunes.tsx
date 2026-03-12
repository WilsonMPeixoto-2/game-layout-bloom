import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { EmotionalState } from '../types';

/**
 * Floating mystical rune/symbol planes rotating slowly in 3D space.
 * Creates the "magic in constant motion" feel of a living diorama.
 */

interface Props {
  emotion?: EmotionalState;
  count?: number;
}

// Rune glyph vertex shader
const runeVertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Procedural rune shader - draws geometric magical symbols
const runeFragment = `
  uniform float uTime;
  uniform float uSeed;
  uniform vec3 uColor;
  uniform float uBrightness;
  
  varying vec2 vUv;
  
  float circle(vec2 uv, vec2 center, float radius, float thickness) {
    float d = length(uv - center);
    return smoothstep(radius + thickness, radius, d) * smoothstep(radius - thickness, radius, d);
  }
  
  float line(vec2 uv, vec2 a, vec2 b, float thickness) {
    vec2 pa = uv - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    float d = length(pa - ba * h);
    return smoothstep(thickness, thickness * 0.3, d);
  }
  
  void main() {
    vec2 uv = vUv * 2.0 - 1.0; // Center UV
    float d = length(uv);
    
    // Base circle
    float pattern = circle(uv, vec2(0.0), 0.8, 0.04);
    
    // Inner circle
    pattern += circle(uv, vec2(0.0), 0.5, 0.03);
    
    // Cross lines based on seed
    float angle = uSeed * 6.28;
    for (float i = 0.0; i < 3.0; i++) {
      float a = angle + i * 2.094; // 120 degrees
      vec2 dir = vec2(cos(a), sin(a));
      pattern += line(uv, dir * 0.2, dir * 0.75, 0.025);
    }
    
    // Center dot
    pattern += smoothstep(0.12, 0.0, d);
    
    // Rotating inner detail
    float rotAngle = uTime * 0.3 + uSeed * 3.14;
    vec2 ruv = vec2(
      uv.x * cos(rotAngle) - uv.y * sin(rotAngle),
      uv.x * sin(rotAngle) + uv.y * cos(rotAngle)
    );
    pattern += circle(ruv, vec2(0.35, 0.0), 0.08, 0.02);
    pattern += circle(ruv, vec2(-0.35, 0.0), 0.08, 0.02);
    
    pattern = clamp(pattern, 0.0, 1.0);
    
    // Soft outer glow
    float glow = exp(-d * d * 2.5) * 0.3;
    
    // Pulsing
    float pulse = sin(uTime * 0.5 + uSeed * 5.0) * 0.15 + 0.85;
    
    float alpha = (pattern * 0.6 + glow) * pulse * uBrightness;
    
    // Fade edges of quad
    float edgeFade = smoothstep(1.0, 0.7, d);
    alpha *= edgeFade;
    
    vec3 color = uColor * (1.0 + glow * 2.0);
    
    gl_FragColor = vec4(color, alpha);
  }
`;

const EMOTION_RUNE_COLORS: Record<string, THREE.Color[]> = {
  dormant: [new THREE.Color('#4a6fa5'), new THREE.Color('#6b88b0')],
  wonder: [new THREE.Color('#b388ff'), new THREE.Color('#ea80fc')],
  preparation: [new THREE.Color('#69f0ae'), new THREE.Color('#4dd9e8')],
  restoration: [new THREE.Color('#b388ff'), new THREE.Color('#00e5ff')],
  triumph: [new THREE.Color('#ffd740'), new THREE.Color('#ea80fc')],
};

interface RuneData {
  position: [number, number, number];
  scale: number;
  rotSpeed: [number, number, number];
  seed: number;
  color: THREE.Color;
  brightness: number;
}

export default function FloatingRunes({ emotion = 'dormant', count = 6 }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const matsRef = useRef<THREE.ShaderMaterial[]>([]);

  const runes = useMemo<RuneData[]>(() => {
    const colors = EMOTION_RUNE_COLORS[emotion] || EMOTION_RUNE_COLORS.dormant;
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 3.5,
        -1.5 + Math.random() * -1.0, // Behind particles, in front of bg
      ] as [number, number, number],
      scale: 0.15 + Math.random() * 0.25,
      rotSpeed: [
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.15,
      ] as [number, number, number],
      seed: Math.random(),
      color: colors[Math.floor(Math.random() * colors.length)],
      brightness: 0.08 + Math.random() * 0.12, // Very subtle
    }));
  }, [emotion, count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Update shader time
    matsRef.current.forEach((mat) => {
      if (mat) mat.uniforms.uTime.value = t;
    });

    // Rotate each rune mesh
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        if (i < runes.length) {
          const r = runes[i];
          child.rotation.x = t * r.rotSpeed[0];
          child.rotation.y = t * r.rotSpeed[1];
          child.rotation.z = t * r.rotSpeed[2];
          // Gentle float
          child.position.y = r.position[1] + Math.sin(t * 0.4 + r.seed * 6) * 0.08;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {runes.map((rune, i) => (
        <mesh
          key={i}
          position={rune.position}
          scale={rune.scale}
        >
          <planeGeometry args={[1, 1]} />
          <shaderMaterial
            ref={(el) => { if (el) matsRef.current[i] = el; }}
            vertexShader={runeVertex}
            fragmentShader={runeFragment}
            uniforms={{
              uTime: { value: 0 },
              uSeed: { value: rune.seed },
              uColor: { value: rune.color },
              uBrightness: { value: rune.brightness },
            }}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
