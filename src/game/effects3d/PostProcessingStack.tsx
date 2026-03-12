import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Vector2 } from 'three';
import type { EmotionalState } from '../types';

interface Props {
  emotion?: EmotionalState;
  variant?: 'title' | 'story' | 'result';
}

// Post-processing intensities per emotional state
const EMOTION_CONFIGS: Record<string, {
  bloomIntensity: number;
  bloomThreshold: number;
  vignetteDarkness: number;
  chromaticOffset: number;
}> = {
  dormant: {
    bloomIntensity: 0.8,
    bloomThreshold: 0.4,
    vignetteDarkness: 0.75,
    chromaticOffset: 0.0004,
  },
  wonder: {
    bloomIntensity: 1.5,
    bloomThreshold: 0.25,
    vignetteDarkness: 0.6,
    chromaticOffset: 0.0006,
  },
  preparation: {
    bloomIntensity: 1.0,
    bloomThreshold: 0.35,
    vignetteDarkness: 0.65,
    chromaticOffset: 0.0005,
  },
  restoration: {
    bloomIntensity: 1.8,
    bloomThreshold: 0.2,
    vignetteDarkness: 0.5,
    chromaticOffset: 0.0007,
  },
  triumph: {
    bloomIntensity: 2.5,
    bloomThreshold: 0.15,
    vignetteDarkness: 0.4,
    chromaticOffset: 0.001,
  },
};

export default function PostProcessingStack({ emotion = 'dormant', variant = 'story' }: Props) {
  const config = EMOTION_CONFIGS[emotion] || EMOTION_CONFIGS.dormant;

  // Title screen gets extra bloom
  const bloomMultiplier = variant === 'title' ? 1.3 : variant === 'result' ? 1.2 : 1.0;

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={config.bloomIntensity * bloomMultiplier}
        luminanceThreshold={config.bloomThreshold}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <Vignette
        eskil={false}
        offset={0.1}
        darkness={config.vignetteDarkness}
        blendFunction={BlendFunction.NORMAL}
      />
      <ChromaticAberration
        offset={new Vector2(config.chromaticOffset, config.chromaticOffset)}
        blendFunction={BlendFunction.NORMAL}
        radialModulation={true}
        modulationOffset={0.5}
      />
    </EffectComposer>
  );
}
