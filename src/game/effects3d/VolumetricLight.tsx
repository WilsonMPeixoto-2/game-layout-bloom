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
  uniform vec3 uColor3;
  
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
    float vFade = pow(1.0 - smoothstep(0.0, 0.9, vUv.y), 1.5);
    float center = abs(vUv.x - 0.5) * 2.0;
    float hFade = exp(-center * center * 4.0);
    
    float n = noise(vUv * 3.0 + vec2(uTime * 0.1, uTime * 0.05 + uIndex));
    float noiseModulation = 0.7 + n * 0.4;
    
    float pulse1 = sin(uTime * (0.25 + uIndex * 0.08) + uIndex * 1.5) * 0.5 + 0.5;
    float pulse2 = sin(uTime * (0.6 + uIndex * 0.12) + uIndex * 2.7) * 0.3 + 0.7;
    float pulse = pulse1 * pulse2;
    
    vec3 color = mix(uColor1, uColor2, vUv.y * 0.5);
    color = mix(color, uColor3, pow(vUv.y, 2.0) * 0.4);
    
    float alpha = vFade * hFade * pulse * noiseModulation * uIntensity * 0.07;
    
    gl_FragColor = vec4(color, alpha);
    
    #include <colorspace_fragment>
  }
`;

const godRayFragment = `
  uniform float uTime;
  uniform float uIntensity;
  
  varying vec2 vUv;
  
  void main() {
    vec2 center = vec2(0.5, 0.0);
    float dist = length(vUv - center);
    
    float radial = exp(-dist * dist * 3.0);
    float pulse = sin(uTime * 0.3) * 0.15 + 0.85;
    
    vec3 color = mix(
      vec3(1.0, 0.82, 0.2),
      vec3(1.0, 0.95, 0.7),
      radial
    );
    
    float alpha = radial * uIntensity * pulse * 0.025;
    
    gl_FragColor = vec4(color, alpha);
    
    #include <colorspace_fragment>
  }
`;

export default function VolumetricLight({ variant = 'title', intensity = 1.0 }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const materialsRef = useRef<THREE.ShaderMaterial[]>([]);
  const godRayMatRef = useRef<THREE.ShaderMaterial>(null);

  const shaftCount = variant === 'triumph' ? 7 : variant === 'title' ? 5 : 3;

  const shafts = useMemo(() => {
    const configs = {
      title: {
        color1: new THREE.Color('#ffd740'),
        color2: new THREE.Color('#ea80fc'),
        color3: new THREE.Color('#ff6e40'),
      },
      triumph: {
        color1: new THREE.Color('#ffd740'),
        color2: new THREE.Color('#18ffff'),
        color3: new THREE.Color('#ea80fc'),
      },
      subtle: {
        color1: new THREE.Color('#ffd740'),
        color2: new THREE.Color('#b388ff'),
        color3: new THREE.Color('#e6a800'),
      },
    };

    const c = configs[variant];

    return Array.from({ length: shaftCount }, (_, i) => {
      const spread = 7;
      const x = -spread / 2 + (i / Math.max(shaftCount - 1, 1)) * spread;
      const width = 0.3 + Math.random() * 0.5;
      const rotation = (-15 + i * (30 / shaftCount) + (Math.random() - 0.5) * 5) * (Math.PI / 180);
      const height = 4 + Math.random() * 1.5;

      return { x, width, height, rotation, ...c, index: i };
    });
  }, [shaftCount, variant]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    materialsRef.current.forEach((mat) => {
      if (mat) mat.uniforms.uTime.value = t;
    });
    if (godRayMatRef.current) {
      godRayMatRef.current.uniforms.uTime.value = t;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Individual light shafts */}
      {shafts.map((s, i) => (
        <mesh
          key={i}
          position={[s.x, 1.2, -0.8]}
          rotation={[0, 0, s.rotation]}
        >
          <planeGeometry args={[s.width, s.height]} />
          <shaderMaterial
            ref={(el) => { if (el) materialsRef.current[i] = el; }}
            vertexShader={shaftVertexShader}
            fragmentShader={shaftFragmentShader}
            uniforms={{
              uTime: { value: 0 },
              uIntensity: { value: intensity * 0.85 },
              uIndex: { value: s.index },
              uColor1: { value: s.color1 },
              uColor2: { value: s.color2 },
              uColor3: { value: s.color3 },
            }}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Central god ray / halo */}
      <mesh position={[0, 1.8, -0.6]}>
        <planeGeometry args={[10, 5]} />
        <shaderMaterial
          ref={godRayMatRef}
          vertexShader={shaftVertexShader}
          fragmentShader={godRayFragment}
          uniforms={{
            uTime: { value: 0 },
            uIntensity: { value: intensity * 0.9 },
          }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {/* Ambient upper glow — reduced opacity */}
      <mesh position={[0, 1.8, -0.4]}>
        <planeGeometry args={[10, 3]} />
        <meshBasicMaterial
          color={variant === 'triumph' ? '#ffd740' : '#ffcc00'}
          transparent
          opacity={0.018 * intensity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
