import { Suspense, memo } from 'react';
import { Canvas } from '@react-three/fiber';
import BackgroundPlane from './BackgroundPlane';
import GPUParticles from './GPUParticles';
import VolumetricLight from './VolumetricLight';
import ReawakeningGlow3D from './ReawakeningGlow3D';
import PostProcessingStack from './PostProcessingStack';

import ParallaxCamera from './ParallaxCamera';
import AtmosphericLayers from './AtmosphericLayers';
import FloatingRunes from './FloatingRunes';
import LightningFlash from './LightningFlash';
import type { ParticlePreset, EmotionalState } from '../types';

interface Props {
  background: string;
  particles?: ParticlePreset;
  emotion?: EmotionalState;
  variant?: 'title' | 'story' | 'result';
  lightVariant?: 'title' | 'triumph' | 'subtle';
  lightIntensity?: number;
  restorationProgress?: number;
  /** Enable lightning flashes (guardian/storm scenes) */
  lightning?: boolean;
}

function SceneCanvas3D({
  background,
  particles = 'dust',
  emotion = 'dormant',
  variant = 'story',
  lightVariant,
  lightIntensity = 1.0,
  restorationProgress = 0,
  lightning = false,
}: Props) {
  // Parallax strength varies by scene type
  const parallaxStrength = variant === 'title' ? 0.18 : variant === 'result' ? 0.12 : 0.15;

  // Rune count varies by emotional intensity
  const runeCount = emotion === 'triumph' ? 8 : emotion === 'restoration' ? 7 : emotion === 'wonder' ? 6 : 4;

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
        toneMappingExposure: 1.0,
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

      {/* Parallax camera reacts to mouse/gyro */}
      <ParallaxCamera strength={parallaxStrength} smoothing={2.5} breathe />

      <Suspense fallback={null}>
        <BackgroundPlane src={background} />
      </Suspense>

      {/* Atmospheric fog layers for depth separation */}
      <AtmosphericLayers emotion={emotion} />

      {/* Floating mystical runes at mid-depth */}
      <FloatingRunes emotion={emotion} count={runeCount} />

      <GPUParticles preset={particles} intensity={1.0} />

      {/* Volumetric light shafts */}
      <VolumetricLight
        variant={lightVariant || 'subtle'}
        intensity={lightIntensity}
      />

      {/* Lightning for dramatic scenes */}
      <LightningFlash active={lightning} interval={6} intensity={1.2} />

      {restorationProgress > 0 && (
        <ReawakeningGlow3D progress={restorationProgress} />
      )}

      <FilmGrain3D />

      <PostProcessingStack emotion={emotion} variant={variant} />
    </Canvas>
  );
}

export default memo(SceneCanvas3D);
