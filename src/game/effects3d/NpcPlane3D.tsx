import { useRef, useState, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { NpcConfig } from '../types';

/**
 * Renders an NPC sprite as a textured plane inside the R3F canvas.
 * The sprite participates in bloom (toneMapped=false), depth, and parallax.
 * Uses alpha-tested transparency for clean PNG edges.
 */

interface Props {
  npc?: NpcConfig;
}

const npcVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const npcFragmentShader = `
  uniform sampler2D uTexture;
  uniform float uOpacity;
  uniform float uRimIntensity;
  uniform vec3 uRimColor;
  uniform float uTime;
  
  varying vec2 vUv;
  
  void main() {
    vec4 tex = texture2D(uTexture, vUv);
    
    // Discard fully transparent pixels
    if (tex.a < 0.05) discard;
    
    vec3 color = tex.rgb;
    
    // Subtle rim/edge glow for magical integration
    // Detect edges via alpha gradient approximation
    float edgeFactor = smoothstep(0.05, 0.35, tex.a) * (1.0 - smoothstep(0.65, 0.95, tex.a));
    float rimPulse = sin(uTime * 1.2) * 0.15 + 0.85;
    color += uRimColor * edgeFactor * uRimIntensity * rimPulse * 0.4;
    
    // Slight warmth boost to integrate with scene lighting
    color *= vec3(1.02, 1.0, 0.98);
    
    gl_FragColor = vec4(color, tex.a * uOpacity);
    
    #include <colorspace_fragment>
  }
`;

// Position mapping: where the NPC sits in 3D space
const POSITION_MAP: Record<string, { x: number; y: number; z: number }> = {
  left:   { x: -0.8, y: -0.35, z: -0.5 },
  right:  { x:  0.8, y: -0.35, z: -0.5 },
  center: { x:  0.0, y: -0.35, z: -0.4 },
};

// Rim glow colors per emotion context
const RIM_COLORS: Record<string, THREE.Color> = {
  lyra:     new THREE.Color('#b388ff'),
  guardian: new THREE.Color('#ffd740'),
  default:  new THREE.Color('#80cbc4'),
};

function getRimColor(name: string): THREE.Color {
  const lower = name.toLowerCase();
  if (lower.includes('lyra')) return RIM_COLORS.lyra;
  if (lower.includes('guard')) return RIM_COLORS.guardian;
  return RIM_COLORS.default;
}

export default function NpcPlane3D({ npc }: Props) {
  const { gl } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const loader = useRef(new THREE.TextureLoader());
  
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [aspectRatio, setAspectRatio] = useState(0.6); // width/height
  const opacityRef = useRef(0);
  const targetOpacity = useRef(0);
  const currentNpcName = useRef<string | undefined>(undefined);

  const configureTexture = useCallback((tex: THREE.Texture) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), 8);
    tex.generateMipmaps = true;
    tex.premultiplyAlpha = false;
    return tex;
  }, [gl]);

  // Load texture when NPC changes
  useEffect(() => {
    if (!npc) {
      targetOpacity.current = 0;
      currentNpcName.current = undefined;
      return;
    }

    if (npc.name === currentNpcName.current) {
      targetOpacity.current = 1;
      return;
    }

    // Fade out first, then swap
    targetOpacity.current = 0;
    
    const swapTimer = setTimeout(() => {
      currentNpcName.current = npc.name;
      
      loader.current.load(npc.image, (tex) => {
        const configured = configureTexture(tex);
        
        // Calculate aspect ratio from image
        if (configured.image) {
          const img = configured.image as HTMLImageElement;
          if (img.width && img.height) {
            setAspectRatio(img.width / img.height);
          }
        }
        
        setTexture(configured);
        targetOpacity.current = 1;
      });
    }, 400); // Wait for fade-out

    return () => clearTimeout(swapTimer);
  }, [npc, configureTexture]);

  // Animate opacity + update time
  useFrame((state, delta) => {
    if (!matRef.current) return;
    
    // Smooth opacity transition
    const speed = 2.5;
    opacityRef.current += (targetOpacity.current - opacityRef.current) * speed * delta;
    
    matRef.current.uniforms.uOpacity.value = opacityRef.current;
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime;

    // Subtle idle bob animation
    if (meshRef.current && opacityRef.current > 0.01) {
      const bob = Math.sin(state.clock.elapsedTime * 0.8) * 0.015;
      const pos = POSITION_MAP[npc?.position || 'right'];
      meshRef.current.position.y = (pos?.y ?? -0.35) + bob;
    }
  });

  if (!texture) return null;

  const pos = POSITION_MAP[npc?.position || 'right'] || POSITION_MAP.right;
  const rimColor = getRimColor(npc?.name || '');
  
  // NPC plane size: height ~2.2 units, width from aspect ratio
  const planeHeight = 2.2;
  const planeWidth = planeHeight * aspectRatio;

  return (
    <mesh
      ref={meshRef}
      position={[pos.x, pos.y, pos.z]}
    >
      <planeGeometry args={[planeWidth, planeHeight]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={npcVertexShader}
        fragmentShader={npcFragmentShader}
        uniforms={{
          uTexture: { value: texture },
          uOpacity: { value: 0 },
          uRimIntensity: { value: 0.6 },
          uRimColor: { value: rimColor },
          uTime: { value: 0 },
        }}
        transparent
        depthWrite={false}
        toneMapped={false}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}
