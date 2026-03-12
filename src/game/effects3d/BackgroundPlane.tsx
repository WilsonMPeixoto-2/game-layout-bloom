import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  src: string;
}

// Custom shader for cinematic background with color grading
const bgVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const bgFragmentShader = `
  uniform sampler2D uTexture;
  uniform float uOpacity;
  uniform float uTime;
  
  varying vec2 vUv;
  
  // Cinematic color grading
  vec3 filmicToneMap(vec3 x) {
    float a = 2.51;
    float b = 0.03;
    float c = 2.43;
    float d = 0.59;
    float e = 0.14;
    return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Subtle parallax breathing
    float breathe = sin(uTime * 0.15) * 0.008;
    uv = (uv - 0.5) * (1.0 - breathe * 2.0) + 0.5;
    
    vec4 tex = texture2D(uTexture, uv);
    vec3 color = tex.rgb;
    
    // Subtle saturation for OLED vibrancy
    float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
    color = mix(vec3(luma), color, 1.1);
    
    // Gentle warm lift in shadows
    color += vec3(0.01, 0.005, 0.0) * (1.0 - luma);
    
    // Filmic tone mapping (gentle)
    color = filmicToneMap(color * 1.05);
    
    // Subtle blue shadows for cinema look
    color.b += (1.0 - luma) * 0.008;
    
    gl_FragColor = vec4(color, uOpacity);
  }
`;

export default function BackgroundPlane({ src }: Props) {
  const meshARef = useRef<THREE.Mesh>(null);
  const meshBRef = useRef<THREE.Mesh>(null);
  const [activeLayer, setActiveLayer] = useState<'A' | 'B'>('A');
  const [texA, setTexA] = useState<THREE.Texture | null>(null);
  const [texB, setTexB] = useState<THREE.Texture | null>(null);
  const opacityA = useRef(1);
  const opacityB = useRef(0);
  const prevSrc = useRef(src);
  const loader = useRef(new THREE.TextureLoader());
  const timeRef = useRef(0);

  useEffect(() => {
    loader.current.load(src, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearMipMapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.anisotropy = 16;
      tex.generateMipmaps = true;
      setTexA(tex);
    });
  }, []);

  useEffect(() => {
    if (src === prevSrc.current) return;
    prevSrc.current = src;

    loader.current.load(src, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearMipMapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.anisotropy = 16;
      tex.generateMipmaps = true;

      if (activeLayer === 'A') {
        setTexB(tex);
        setActiveLayer('B');
      } else {
        setTexA(tex);
        setActiveLayer('A');
      }
    });
  }, [src, activeLayer]);

  useFrame((_, delta) => {
    timeRef.current += delta;

    const speed = 1.2;
    const targetA = activeLayer === 'A' ? 1 : 0;
    const targetB = activeLayer === 'B' ? 1 : 0;

    opacityA.current += (targetA - opacityA.current) * speed * delta * 2;
    opacityB.current += (targetB - opacityB.current) * speed * delta * 2;

    if (meshARef.current) {
      const mat = meshARef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms) {
        mat.uniforms.uOpacity.value = opacityA.current;
        mat.uniforms.uTime.value = timeRef.current;
      }
    }
    if (meshBRef.current) {
      const mat = meshBRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms) {
        mat.uniforms.uOpacity.value = opacityB.current;
        mat.uniforms.uTime.value = timeRef.current;
      }
    }
  });

  return (
    <>
      {texA && (
        <mesh ref={meshARef} position={[0, 0, -2]}>
          <planeGeometry args={[7, 5]} />
          <shaderMaterial
            vertexShader={bgVertexShader}
            fragmentShader={bgFragmentShader}
            uniforms={{
              uTexture: { value: texA },
              uOpacity: { value: 1 },
              uTime: { value: 0 },
            }}
            transparent
            depthWrite={false}
          />
        </mesh>
      )}
      {texB && (
        <mesh ref={meshBRef} position={[0, 0, -1.99]}>
          <planeGeometry args={[7, 5]} />
          <shaderMaterial
            vertexShader={bgVertexShader}
            fragmentShader={bgFragmentShader}
            uniforms={{
              uTexture: { value: texB },
              uOpacity: { value: 0 },
              uTime: { value: 0 },
            }}
            transparent
            depthWrite={false}
          />
        </mesh>
      )}
    </>
  );
}
