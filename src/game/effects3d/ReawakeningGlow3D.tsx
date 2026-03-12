import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  progress: number; // 0-1
}

const glowVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glowFragmentShader = `
  uniform float uProgress;
  uniform float uTime;
  
  varying vec2 vUv;
  
  void main() {
    float p = clamp(uProgress, 0.0, 1.0);
    if (p < 0.1) discard;
    
    vec2 center = vec2(0.5, 0.6);
    float dist = length(vUv - center);
    
    // Warm radial glow
    float warmth = p * 0.12;
    vec3 gold = vec3(1.0, 0.78, 0.24);
    vec3 magic = vec3(0.92, 0.5, 1.0);
    vec3 cyan = vec3(0.0, 0.9, 1.0);
    
    float radial = 1.0 - smoothstep(0.0, 0.75, dist);
    vec3 color = mix(gold, magic, dist * 0.8);
    float alpha = radial * warmth;
    
    // Golden bloom ring at higher progress
    if (p > 0.3) {
      float ring = 1.0 - smoothstep(0.2 * p, 0.5 * p, dist);
      float pulse = sin(uTime * 0.9) * 0.03 + 0.97;
      alpha += ring * p * 0.08 * pulse;
    }
    
    // Cyan outer aura at high progress
    if (p > 0.7) {
      float outerGlow = 1.0 - smoothstep(0.0, 0.5, dist);
      float pulse2 = sin(uTime * 1.2) * 0.15 + 0.85;
      color = mix(color, cyan, outerGlow * (p - 0.7) * 0.5);
      alpha += outerGlow * (p - 0.7) * 0.06 * pulse2;
    }
    
    gl_FragColor = vec4(color, alpha);
  }
`;

export default function ReawakeningGlow3D({ progress }: Props) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      matRef.current.uniforms.uProgress.value = progress;
    }
  });

  if (progress < 0.1) return null;

  return (
    <mesh position={[0, 0, -0.5]}>
      <planeGeometry args={[7, 5]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={glowVertexShader}
        fragmentShader={glowFragmentShader}
        uniforms={{
          uProgress: { value: progress },
          uTime: { value: 0 },
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
