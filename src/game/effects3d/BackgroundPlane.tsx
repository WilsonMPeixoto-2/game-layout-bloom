import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  src: string;
}

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

  // Load initial texture
  useEffect(() => {
    loader.current.load(src, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      setTexA(tex);
    });
  }, []);

  // Crossfade on src change
  useEffect(() => {
    if (src === prevSrc.current) return;
    prevSrc.current = src;

    loader.current.load(src, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;

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
    const speed = 0.8;
    const targetA = activeLayer === 'A' ? 1 : 0;
    const targetB = activeLayer === 'B' ? 1 : 0;

    opacityA.current += (targetA - opacityA.current) * speed * delta * 2;
    opacityB.current += (targetB - opacityB.current) * speed * delta * 2;

    if (meshARef.current) {
      const mat = meshARef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = opacityA.current;
    }
    if (meshBRef.current) {
      const mat = meshBRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = opacityB.current;
    }

    // Subtle parallax breathing
    timeRef.current += delta;
    const breathe = Math.sin(timeRef.current * 0.15) * 0.02;
    const scale = 1.05 + breathe;
    if (meshARef.current) {
      meshARef.current.scale.set(scale, scale, 1);
    }
    if (meshBRef.current) {
      meshBRef.current.scale.set(scale, scale, 1);
    }
  });

  return (
    <>
      {texA && (
        <mesh ref={meshARef} position={[0, 0, -2]}>
          <planeGeometry args={[6.5, 4.5]} />
          <meshBasicMaterial
            map={texA}
            transparent
            opacity={1}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      )}
      {texB && (
        <mesh ref={meshBRef} position={[0, 0, -1.99]}>
          <planeGeometry args={[6.5, 4.5]} />
          <meshBasicMaterial
            map={texB}
            transparent
            opacity={0}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      )}
    </>
  );
}
