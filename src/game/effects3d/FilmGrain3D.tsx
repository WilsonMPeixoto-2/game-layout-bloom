import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const grainVertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const grainFragment = `
  uniform float uTime;
  varying vec2 vUv;
  
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  void main() {
    vec2 st = vUv * 512.0;
    float noise = random(st + uTime * 100.0);
    float grain = (noise - 0.5) * 0.04;
    gl_FragColor = vec4(vec3(0.5 + grain), 0.02);
  }
`;

export default function FilmGrain3D() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={[0, 0, 0.5]} renderOrder={999}>
      <planeGeometry args={[8, 6]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={grainVertex}
        fragmentShader={grainFragment}
        uniforms={{
          uTime: { value: 0 },
        }}
        transparent
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
