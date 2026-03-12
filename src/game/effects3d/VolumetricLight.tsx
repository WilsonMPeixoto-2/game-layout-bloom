import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  variant?: 'title' | 'triumph' | 'subtle';
  intensity?: number;
}

const shaftVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const shaftFragmentShader = `
  uniform float uTime;
  uniform float uIntensity;
  uniform float uIndex;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  
  varying vec2 vUv;
  
  void main() {
    // Vertical fade from top
    float vFade = 1.0 - smoothstep(0.0, 0.85, vUv.y);
    
    // Horizontal soft edges
    float hFade = 1.0 - pow(abs(vUv.x - 0.5) * 2.0, 2.0);
    
    // Pulsing animation
    float pulse = sin(uTime * (0.3 + uIndex * 0.1) + uIndex * 1.5) * 0.5 + 0.5;
    
    // Color blend
    vec3 color = mix(uColor1, uColor2, vUv.y * 0.6);
    
    float alpha = vFade * hFade * pulse * uIntensity * 0.15;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

export default function VolumetricLight({ variant = 'title', intensity = 1.0 }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const materialsRef = useRef<THREE.ShaderMaterial[]>([]);

  const shaftCount = variant === 'triumph' ? 10 : variant === 'title' ? 7 : 4;

  const shafts = useMemo(() => {
    return Array.from({ length: shaftCount }, (_, i) => {
      const spread = 5;
      const x = -spread / 2 + (i / (shaftCount - 1)) * spread;
      const width = 0.4 + i * 0.15;
      const rotation = (-12 + i * 5) * (Math.PI / 180);
      const color1 = variant === 'triumph'
        ? new THREE.Color('#ffcc00')
        : new THREE.Color('#ffcc00');
      const color2 = variant === 'triumph'
        ? new THREE.Color('#00e5ff')
        : new THREE.Color('#ea80fc');

      return { x, width, rotation, color1, color2, index: i };
    });
  }, [shaftCount, variant]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    materialsRef.current.forEach((mat) => {
      if (mat) mat.uniforms.uTime.value = t;
    });
  });

  return (
    <group ref={groupRef}>
      {shafts.map((s, i) => (
        <mesh
          key={i}
          position={[s.x, 1.0, -0.5]}
          rotation={[0, 0, s.rotation]}
        >
          <planeGeometry args={[s.width, 4]} />
          <shaderMaterial
            ref={(el) => { if (el) materialsRef.current[i] = el; }}
            vertexShader={shaftVertexShader}
            fragmentShader={shaftFragmentShader}
            uniforms={{
              uTime: { value: 0 },
              uIntensity: { value: intensity },
              uIndex: { value: s.index },
              uColor1: { value: s.color1 },
              uColor2: { value: s.color2 },
            }}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Ambient top glow */}
      <mesh position={[0, 1.5, -0.3]}>
        <planeGeometry args={[8, 2]} />
        <meshBasicMaterial
          color={variant === 'triumph' ? '#ffcc00' : '#ffcc00'}
          transparent
          opacity={0.06 * intensity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Bottom glow for triumph */}
      {variant === 'triumph' && (
        <mesh position={[0, -1.5, -0.3]}>
          <planeGeometry args={[6, 1.5]} />
          <meshBasicMaterial
            color="#00e5ff"
            transparent
            opacity={0.04 * intensity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}
