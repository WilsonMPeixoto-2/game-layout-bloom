import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { EmotionalState } from '../types';

/**
 * Floating mystical rune/symbol planes rotating slowly in 3D space.
 * Very subtle — felt more than seen.
 */

interface Props {
  emotion?: EmotionalState;
  count?: number;
}

const runeVertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Simplified, softer rune shader — more glow, less geometry
const runeFragment = `
  uniform float uTime;
  uniform float uSeed;
  uniform vec3 uColor;
  uniform float uBrightness;
  
  varying vec2 vUv;
  
  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float d = length(uv);
    
    // Simple soft ring
    float ring = exp(-pow(d - 0.6, 2.0) * 30.0);
    
    // Inner dot
    float core = exp(-d * d * 8.0);
    
    // Combine
    float pattern = ring * 0.4 + core * 0.6;
    
    // Soft outer glow
    float glow = exp(-d * d * 1.5) * 0.2;
    
    // Gentle pulse
    float pulse = sin(uTime * 0.4 + uSeed * 5.0) * 0.2 + 0.8;
    
    float alpha = (pattern + glow) * pulse * uBrightness;
    
    // Fade edges
    float edgeFade = smoothstep(1.0, 0.6, d);
    alpha *= edgeFade;
    
    gl_FragColor = vec4(uColor, alpha);
    
    #include <colorspace_fragment>
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

export default function FloatingRunes({ emotion = 'dormant', count = 5 }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const matsRef = useRef<THREE.ShaderMaterial[]>([]);

  const runes = useMemo<RuneData[]>(() => {
    const colors = EMOTION_RUNE_COLORS[emotion] || EMOTION_RUNE_COLORS.dormant;
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 3,
        -1.5 + Math.random() * -0.8,
      ] as [number, number, number],
      scale: 0.12 + Math.random() * 0.18,
      rotSpeed: [
        (Math.random() - 0.5) * 0.15,
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.08,
      ] as [number, number, number],
      seed: Math.random(),
      color: colors[Math.floor(Math.random() * colors.length)],
      brightness: 0.04 + Math.random() * 0.06, // Very subtle
    }));
  }, [emotion, count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    matsRef.current.forEach((mat) => {
      if (mat) mat.uniforms.uTime.value = t;
    });
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        if (i < runes.length) {
          const r = runes[i];
          child.rotation.x = t * r.rotSpeed[0];
          child.rotation.y = t * r.rotSpeed[1];
          child.rotation.z = t * r.rotSpeed[2];
          child.position.y = r.position[1] + Math.sin(t * 0.3 + r.seed * 6) * 0.06;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {runes.map((rune, i) => (
        <mesh key={i} position={rune.position} scale={rune.scale}>
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
