import { useRef, useState, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
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

  // Attempt to convert to linear, apply adjustment, convert back
  vec3 srgbToLinear(vec3 c) {
    return pow(c, vec3(2.2));
  }
  vec3 linearToSrgb(vec3 c) {
    return pow(c, vec3(1.0 / 2.2));
  }
  
  // HSV helpers for saturation control
  vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
  }
  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Subtle parallax breathing
    float breathe = sin(uTime * 0.15) * 0.008;
    uv = (uv - 0.5) * (1.0 - breathe * 2.0) + 0.5;
    
    vec4 tex = texture2D(uTexture, uv);
    vec3 color = tex.rgb;
    
    // === Cinematic Color Grading ===
    
    // 1. Contrast enhancement (S-curve in linear space)
    vec3 linear = srgbToLinear(color);
    linear = linear * (linear * (linear * 0.4 + 0.55) + 0.05); // soft S-curve
    color = linearToSrgb(linear);
    
    // 2. Saturation boost (+18%)
    vec3 hsv = rgb2hsv(color);
    hsv.y = min(hsv.y * 1.18, 1.0);
    color = hsv2rgb(hsv);
    
    // 3. Subtle warm tint in shadows, cool tint in highlights (split-toning)
    float luma = dot(color, vec3(0.299, 0.587, 0.114));
    vec3 shadowTint = vec3(0.02, 0.01, 0.04);   // warm purple in shadows
    vec3 highlightTint = vec3(-0.01, 0.0, 0.02); // cool blue in highlights
    color += mix(shadowTint, highlightTint, smoothstep(0.3, 0.7, luma));
    
    // 4. Very subtle vignette baked into texture for depth
    float vig = 1.0 - smoothstep(0.4, 1.4, length((vUv - 0.5) * 1.6));
    color *= mix(0.88, 1.0, vig);
    
    gl_FragColor = vec4(color, uOpacity);
    
    #include <colorspace_fragment>
  }
`;

export default function BackgroundPlane({ src }: Props) {
  const { gl } = useThree();
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

  const configureTexture = useCallback((tex: THREE.Texture) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = gl.capabilities.getMaxAnisotropy();
    tex.generateMipmaps = true;
    return tex;
  }, [gl]);

  useEffect(() => {
    if (src === prevSrc.current && texA) return;

    loader.current.load(src, (tex) => {
      const configured = configureTexture(tex);

      if (!texA) {
        prevSrc.current = src;
        setTexA(configured);
        return;
      }

      prevSrc.current = src;
      if (activeLayer === 'A') {
        setTexB(configured);
        setActiveLayer('B');
      } else {
        setTexA(configured);
        setActiveLayer('A');
      }
    });
  }, [src, activeLayer, texA, configureTexture]);

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
