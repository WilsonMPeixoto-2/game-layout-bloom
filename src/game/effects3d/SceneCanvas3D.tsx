import { Suspense, memo } from 'react';
import { Canvas } from '@react-three/fiber';
import BackgroundPlane from './BackgroundPlane';
import GPUParticles from './GPUParticles';
import VolumetricLight from './VolumetricLight';
import ReawakeningGlow3D from './ReawakeningGlow3D';
import PostProcessingStack from './PostProcessingStack';
import FilmGrain3D from './FilmGrain3D';
import type { ParticlePreset, EmotionalState } from '../types';

interface Props {
  background: string;
  particles?: ParticlePreset;
  emotion?: EmotionalState;
  variant?: 'title' | 'story' | 'result';
  lightVariant?: 'title' | 'triumph' | 'subtle';
  lightIntensity?: number;
  restorationProgress?: number;
}

function SceneCanvas3D({
  background,
  particles = 'dust',
  emotion = 'dormant',
  variant = 'story',
  lightVariant,
  lightIntensity = 1.0,
  restorationProgress = 0,
}: Props) {
  return (
    <Canvas
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
      }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        toneMapping: 3, // ACESFilmicToneMapping
        toneMappingExposure: 1.2,
      }}
      camera={{
        position: [0, 0, 2],
        fov: 60,
        near: 0.1,
        far: 10,
      }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#020810']} />

      <Suspense fallback={null}>
        <BackgroundPlane src={background} />
      </Suspense>

      <GPUParticles preset={particles} intensity={1.0} />

      {/* Always render volumetric light with at least subtle variant */}
      <VolumetricLight
        variant={lightVariant || 'subtle'}
        intensity={lightIntensity}
      />

      {restorationProgress > 0 && (
        <ReawakeningGlow3D progress={restorationProgress} />
      )}

      <FilmGrain3D />

      <PostProcessingStack emotion={emotion} variant={variant} />
    </Canvas>
  );
}

export default memo(SceneCanvas3D);
