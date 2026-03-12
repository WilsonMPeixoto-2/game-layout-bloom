import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  src: string;
}

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
  
  void main() {
    vec2 uv = vUv;
    
    // Subtle parallax breathing
    float breathe = sin(uTime * 0.15) * 0.008;
    uv = (uv - 0.5) * (1.0 - breathe * 2.0) + 0.5;
    
    vec4 tex = texture2D(uTexture, uv);
    vec3 color = tex.rgb;
    
    gl_FragColor = vec4(color, uOpacity);
    
    #include <colorspace_fragment>
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
