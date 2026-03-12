import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ParticlePreset } from '../types';

const PRESET_CONFIGS: Record<string, {
  count: number;
  colors: THREE.Color[];
  sizeRange: [number, number];
  speedRange: [number, number];
  emissiveIntensity: number;
  driftStrength: number;
  riseSpeed: number;
  sparkle: boolean;
  convergent: boolean;
  burstRadius: number;
}> = {
  dust: {
    count: 2000,
    colors: [
      new THREE.Color('#ffd54f'), new THREE.Color('#ffe082'),
      new THREE.Color('#ffab40'), new THREE.Color('#fff176'),
      new THREE.Color('#e6a800'),
    ],
    sizeRange: [0.003, 0.012],
    speedRange: [0.01, 0.04],
    emissiveIntensity: 2.5,
    driftStrength: 0.18,
    riseSpeed: 0.008,
    sparkle: false,
    convergent: false,
    burstRadius: 0,
  },
  sparks: {
    count: 3000,
    colors: [
      new THREE.Color('#ffcc00'), new THREE.Color('#ea80fc'),
      new THREE.Color('#00e5ff'), new THREE.Color('#ff9e40'),
      new THREE.Color('#76ff03'), new THREE.Color('#d500f9'),
    ],
    sizeRange: [0.003, 0.015],
    speedRange: [0.03, 0.1],
    emissiveIntensity: 3.5,
    driftStrength: 0.3,
    riseSpeed: 0.03,
    sparkle: true,
    convergent: false,
    burstRadius: 0,
  },
  energy: {
    count: 2500,
    colors: [
      new THREE.Color('#00e5ff'), new THREE.Color('#ea80fc'),
      new THREE.Color('#ffcc00'), new THREE.Color('#18ffff'),
      new THREE.Color('#b388ff'),
    ],
    sizeRange: [0.004, 0.014],
    speedRange: [0.02, 0.07],
    emissiveIntensity: 3.0,
    driftStrength: 0.25,
    riseSpeed: 0.018,
    sparkle: true,
    convergent: true,
    burstRadius: 0,
  },
  bloom: {
    count: 3500,
    colors: [
      new THREE.Color('#ea80fc'), new THREE.Color('#ffcc00'),
      new THREE.Color('#d500f9'), new THREE.Color('#ffe566'),
      new THREE.Color('#18ffff'), new THREE.Color('#b388ff'),
    ],
    sizeRange: [0.003, 0.016],
    speedRange: [0.015, 0.06],
    emissiveIntensity: 3.0,
    driftStrength: 0.22,
    riseSpeed: 0.015,
    sparkle: true,
    convergent: false,
    burstRadius: 0,
  },
  triumph: {
    count: 4000,
    colors: [
      new THREE.Color('#ffd740'), new THREE.Color('#ffe57f'),
      new THREE.Color('#00e5ff'), new THREE.Color('#ea80fc'),
      new THREE.Color('#ff6e40'), new THREE.Color('#76ff03'),
      new THREE.Color('#d500f9'), new THREE.Color('#ffd54f'),
    ],
    sizeRange: [0.004, 0.02],
    speedRange: [0.03, 0.14],
    emissiveIntensity: 4.5,
    driftStrength: 0.4,
    riseSpeed: 0.06,
    sparkle: true,
    convergent: false,
    burstRadius: 0.8,
  },
};

const vertexShader = `
  attribute float aSize;
  attribute float aSpeed;
  attribute float aPhase;
  attribute vec3 aColor;
  attribute float aDrift;
  attribute float aLayer;
  
  uniform float uTime;
  uniform float uRiseSpeed;
  uniform float uDriftStrength;
  uniform float uIntensity;
  uniform float uConvergent;
  uniform float uBurstRadius;
  
  varying vec3 vColor;
  varying float vOpacity;
  varying float vCore;
  
  void main() {
    float t = mod(uTime * aSpeed * 1.5 + aPhase, 6.2831853);
    
    vec3 pos = position;
    
    // Multi-layer organic drift with turbulence
    float turbulence = sin(uTime * 0.3 + aPhase * 3.0) * cos(uTime * 0.17 + aPhase * 2.1);
    pos.x += sin(uTime * aDrift * 0.7 + aPhase) * uDriftStrength * 0.6;
    pos.x += turbulence * uDriftStrength * 0.2;
    pos.y += mod(uTime * uRiseSpeed * aSpeed + aPhase * 2.0, 5.0) - 2.5;
    pos.z += cos(uTime * aDrift * 0.5 + aPhase * 1.3) * uDriftStrength * 0.4;
    
    // Convergent motion (energy preset - spiral inward)
    if (uConvergent > 0.5) {
      float angle = uTime * 0.5 + aPhase * 6.28;
      float radius = length(pos.xy) * (0.7 + sin(uTime * 0.2) * 0.3);
      pos.x = cos(angle) * radius * 0.8 + pos.x * 0.3;
      pos.y = sin(angle) * radius * 0.6 + pos.y * 0.5;
    }
    
    // Burst outward (triumph preset)
    if (uBurstRadius > 0.0) {
      float burst = sin(uTime * 0.8 + aPhase * 3.0) * 0.5 + 0.5;
      vec3 dir = normalize(position + vec3(0.001));
      pos += dir * burst * uBurstRadius * 0.3;
    }
    
    // Wrap Y
    pos.y = mod(pos.y + 2.5, 5.0) - 2.5;
    
    // Rich pulsing opacity with sparkle
    float pulse = sin(t) * 0.5 + 0.5;
    float sparkle = pow(sin(uTime * 8.0 * aSpeed + aPhase * 12.0) * 0.5 + 0.5, 8.0);
    float layerDepth = 0.6 + aLayer * 0.4;
    vOpacity = (pulse * 0.7 + sparkle * 0.5) * uIntensity * layerDepth * (0.5 + aSpeed * 0.5);
    vCore = sparkle;
    
    vColor = aColor * (1.0 + sparkle * 1.5);
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    float sizeBoost = 1.0 + pulse * 0.6 + sparkle * 1.2;
    gl_PointSize = aSize * 400.0 * uIntensity * sizeBoost * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vOpacity;
  varying float vCore;
  
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    
    // Multi-layer glow: soft outer + bright inner + hot core
    float outerGlow = 1.0 - smoothstep(0.0, 0.5, d);
    outerGlow = pow(outerGlow, 1.2);
    
    float innerGlow = 1.0 - smoothstep(0.0, 0.25, d);
    innerGlow = pow(innerGlow, 2.0);
    
    float hotCore = 1.0 - smoothstep(0.0, 0.08, d);
    
    // Color: outer is tinted, core is white-hot
    vec3 coreColor = mix(vColor * 2.0, vec3(1.0, 0.95, 0.85), hotCore * 0.7);
    vec3 finalColor = mix(vColor, coreColor, innerGlow);
    finalColor += vec3(1.0, 0.98, 0.9) * hotCore * 3.0 * vCore;
    
    float alpha = (outerGlow * 0.6 + innerGlow * 0.3 + hotCore * 0.8) * vOpacity;
    
    gl_FragColor = vec4(finalColor, alpha);
    
    #include <colorspace_fragment>
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
    const layers = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Multi-layered depth distribution
      const layer = Math.random();
      const depthSpread = 1.0 + layer * 3.0;
      positions[i * 3] = (Math.random() - 0.5) * 7;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * depthSpread;

      sizes[i] = config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]);
      speeds[i] = config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]);
      phases[i] = Math.random() * Math.PI * 2;
      drifts[i] = 0.3 + Math.random() * 2.0;
      layers[i] = layer;

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
    geo.setAttribute('aLayer', new THREE.BufferAttribute(layers, 1));

    const unis = {
      uTime: { value: 0 },
      uRiseSpeed: { value: config.riseSpeed },
      uDriftStrength: { value: config.driftStrength },
      uIntensity: { value: intensity * config.emissiveIntensity / 3.0 },
      uConvergent: { value: config.convergent ? 1.0 : 0.0 },
      uBurstRadius: { value: config.burstRadius },
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
        toneMapped={false}
      />
    </points>
  );
}
