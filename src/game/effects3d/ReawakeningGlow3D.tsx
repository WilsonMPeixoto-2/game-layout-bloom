import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  progress: number;
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
  
  void main() {
    float p = clamp(uProgress, 0.0, 1.0);
    if (p < 0.05) discard;
    
    vec2 center = vec2(0.5, 0.55);
    float dist = length(vUv - center);
    
    float warmth = p * 0.2;
    vec3 gold = vec3(1.0, 0.82, 0.24);
    vec3 magic = vec3(0.92, 0.5, 1.0);
    vec3 cyan = vec3(0.0, 0.9, 1.0);
    vec3 white = vec3(1.0, 0.98, 0.92);
    
    float n = noise(vUv * 4.0 + uTime * 0.3);
    
    float radial = 1.0 - smoothstep(0.0, 0.6 + p * 0.2, dist);
    radial *= 0.8 + n * 0.3;
    
    vec3 color = mix(gold, magic, dist * 0.6 + n * 0.2);
    float alpha = radial * warmth;
    
    if (p > 0.2) {
      float ringRadius = 0.15 + p * 0.3;
      float ringWidth = 0.05 + p * 0.03;
      float ring = 1.0 - smoothstep(ringRadius - ringWidth, ringRadius, dist);
      ring *= 1.0 - smoothstep(ringRadius, ringRadius + ringWidth, dist);
      float pulse = sin(uTime * 1.2) * 0.1 + 0.9;
      alpha += ring * p * 0.15 * pulse;
      color = mix(color, white, ring * 0.3);
    }
    
    if (p > 0.5) {
      float outerGlow = exp(-dist * dist * 2.0);
      float pulse2 = sin(uTime * 0.8 + 1.0) * 0.15 + 0.85;
      float cyanMix = (p - 0.5) * 2.0;
      color = mix(color, cyan, outerGlow * cyanMix * 0.3);
      alpha += outerGlow * cyanMix * 0.08 * pulse2;
    }
    
    if (p > 0.8) {
      float core = exp(-dist * dist * 12.0);
      float corePulse = sin(uTime * 2.0) * 0.1 + 0.9;
      color = mix(color, white, core * (p - 0.8) * 5.0);
      alpha += core * (p - 0.8) * 0.4 * corePulse;
    }
    
    gl_FragColor = vec4(color, alpha);
    
    #include <colorspace_fragment>
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

  if (progress < 0.05) return null;

  return (
    <mesh position={[0, 0, -0.5]}>
      <planeGeometry args={[8, 6]} />
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
