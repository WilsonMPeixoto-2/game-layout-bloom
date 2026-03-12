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
  
  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * vec3(443.897, 441.423, 437.195));
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
  }
  
  void main() {
    float grain1 = hash(vUv * 800.0 + uTime * 137.0);
    float grain2 = hash(vUv * 400.0 + uTime * 97.0 + 42.0);
    float grain = mix(grain1, grain2, 0.4);
    float intensity = (grain - 0.5) * 0.04;
    
    vec3 grainColor = vec3(0.5 + intensity);
    
    gl_FragColor = vec4(grainColor, 0.012);
    
    #include <colorspace_fragment>
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
      <planeGeometry args={[10, 8]} />
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
