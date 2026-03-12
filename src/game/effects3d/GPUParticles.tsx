import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ParticlePreset } from '../types';

// Preset configurations
const PRESET_CONFIGS: Record<string, {
  count: number;
  colors: THREE.Color[];
  sizeRange: [number, number];
  speedRange: [number, number];
  emissiveIntensity: number;
  driftStrength: number;
  riseSpeed: number;
  sparkle: boolean;
}> = {
  dust: {
    count: 5000,
    colors: [new THREE.Color('#ffcc00'), new THREE.Color('#ffe566'), new THREE.Color('#e6a800')],
    sizeRange: [0.003, 0.012],
    speedRange: [0.02, 0.08],
    emissiveIntensity: 2.0,
    driftStrength: 0.15,
    riseSpeed: 0.015,
    sparkle: false,
  },
  sparks: {
    count: 6000,
    colors: [
      new THREE.Color('#ffcc00'), new THREE.Color('#ea80fc'),
      new THREE.Color('#00e5ff'), new THREE.Color('#ff9e40'),
      new THREE.Color('#00e676'), new THREE.Color('#d500f9'),
    ],
    sizeRange: [0.004, 0.018],
    speedRange: [0.05, 0.15],
    emissiveIntensity: 4.0,
    driftStrength: 0.3,
    riseSpeed: 0.06,
    sparkle: true,
  },
  energy: {
    count: 5000,
    colors: [new THREE.Color('#00e5ff'), new THREE.Color('#ea80fc'), new THREE.Color('#ffcc00')],
    sizeRange: [0.005, 0.015],
    speedRange: [0.04, 0.12],
    emissiveIntensity: 3.5,
    driftStrength: 0.4,
    riseSpeed: 0.03,
    sparkle: true,
  },
  bloom: {
    count: 8000,
    colors: [
      new THREE.Color('#ea80fc'), new THREE.Color('#ffcc00'),
      new THREE.Color('#d500f9'), new THREE.Color('#ffe566'),
    ],
    sizeRange: [0.003, 0.016],
    speedRange: [0.03, 0.1],
    emissiveIntensity: 3.0,
    driftStrength: 0.2,
    riseSpeed: 0.025,
    sparkle: true,
  },
  triumph: {
    count: 10000,
    colors: [
      new THREE.Color('#ffcc00'), new THREE.Color('#ffe566'),
      new THREE.Color('#00e5ff'), new THREE.Color('#ea80fc'),
      new THREE.Color('#ff9e40'), new THREE.Color('#00e676'),
    ],
    sizeRange: [0.004, 0.022],
    speedRange: [0.06, 0.2],
    emissiveIntensity: 5.0,
    driftStrength: 0.5,
    riseSpeed: 0.08,
    sparkle: true,
  },
};

// Custom shader material for GPU-animated particles
const vertexShader = `
  attribute float aSize;
  attribute float aSpeed;
  attribute float aPhase;
  attribute vec3 aColor;
  attribute float aDrift;
  
  uniform float uTime;
  uniform float uRiseSpeed;
  uniform float uDriftStrength;
  uniform float uIntensity;
  
  varying vec3 vColor;
  varying float vOpacity;
  
  void main() {
    float t = mod(uTime * aSpeed + aPhase, 6.2831853);
    
    vec3 pos = position;
    // Organic drift
    pos.x += sin(uTime * aDrift * 0.7 + aPhase) * uDriftStrength * 0.5;
    pos.y += mod(uTime * uRiseSpeed * aSpeed + aPhase * 2.0, 4.0) - 2.0;
    pos.z += cos(uTime * aDrift * 0.5 + aPhase * 1.3) * uDriftStrength * 0.3;
    
    // Wrap Y
    pos.y = mod(pos.y + 2.0, 4.0) - 2.0;
    
    // Pulsing opacity
    float pulse = sin(t) * 0.5 + 0.5;
    vOpacity = pulse * uIntensity * (0.4 + aSpeed * 0.6);
    
    vColor = aColor;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * 300.0 * uIntensity * (1.0 + pulse * 0.5) * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vOpacity;
  
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    
    // Soft glow falloff
    float glow = 1.0 - smoothstep(0.0, 0.5, d);
    glow = pow(glow, 1.5);
    
    // Core brightness
    float core = 1.0 - smoothstep(0.0, 0.15, d);
    
    vec3 finalColor = vColor * (1.0 + core * 2.0);
    float alpha = glow * vOpacity;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

interface Props {
  preset: ParticlePreset;
  intensity?: number;
}

export default function GPUParticles({ preset, intensity = 1.0 }: Props) {
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const config = PRESET_CONFIGS[preset] || PRESET_CONFIGS.dust;

  const { geometry, uniforms } = useMemo(() => {
    const count = config.count;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const drifts = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Spread across viewport
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;

      sizes[i] = config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]);
      speeds[i] = config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]);
      phases[i] = Math.random() * Math.PI * 2;
      drifts[i] = 0.5 + Math.random() * 1.5;

      const color = config.colors[Math.floor(Math.random() * config.colors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('aDrift', new THREE.BufferAttribute(drifts, 1));

    const unis = {
      uTime: { value: 0 },
      uRiseSpeed: { value: config.riseSpeed },
      uDriftStrength: { value: config.driftStrength },
      uIntensity: { value: intensity },
    };

    return { geometry: geo, uniforms: unis };
  }, [config, intensity]);

  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
    }
  });

  if (preset === 'none') return null;

  return (
    <points ref={meshRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
