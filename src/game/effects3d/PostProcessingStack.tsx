import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Vector2 } from 'three';
import type { EmotionalState } from '../types';

interface Props {
  emotion?: EmotionalState;
  variant?: 'title' | 'story' | 'result';
}

const EMOTION_CONFIGS: Record<string, {
  bloomIntensity: number;
  bloomThreshold: number;
  bloomSmoothing: number;
  vignetteDarkness: number;
  chromaticOffset: number;
}> = {
  dormant: {
    bloomIntensity: 1.5,
    bloomThreshold: 0.3,
    bloomSmoothing: 0.8,
    vignetteDarkness: 0.85,
    chromaticOffset: 0.0006,
  },
  wonder: {
    bloomIntensity: 3.0,
    bloomThreshold: 0.15,
    bloomSmoothing: 0.9,
    vignetteDarkness: 0.65,
    chromaticOffset: 0.001,
  },
  preparation: {
    bloomIntensity: 2.0,
    bloomThreshold: 0.25,
    bloomSmoothing: 0.85,
    vignetteDarkness: 0.7,
    chromaticOffset: 0.0008,
  },
  restoration: {
    bloomIntensity: 3.5,
    bloomThreshold: 0.12,
    bloomSmoothing: 0.92,
    vignetteDarkness: 0.5,
    chromaticOffset: 0.0012,
  },
  triumph: {
    bloomIntensity: 5.0,
    bloomThreshold: 0.08,
    bloomSmoothing: 0.95,
    vignetteDarkness: 0.35,
    chromaticOffset: 0.0018,
  },
};

export default function PostProcessingStack({ emotion = 'dormant', variant = 'story' }: Props) {
  const config = EMOTION_CONFIGS[emotion] || EMOTION_CONFIGS.dormant;

  const bloomMultiplier = variant === 'title' ? 1.5 : variant === 'result' ? 1.4 : 1.0;

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={config.bloomIntensity * bloomMultiplier}
        luminanceThreshold={config.bloomThreshold}
        luminanceSmoothing={config.bloomSmoothing}
        mipmapBlur
      />
      <Vignette
        eskil={false}
        offset={0.05}
        darkness={config.vignetteDarkness}
        blendFunction={BlendFunction.NORMAL}
      />
      <ChromaticAberration
        offset={new Vector2(config.chromaticOffset, config.chromaticOffset)}
        blendFunction={BlendFunction.NORMAL}
        radialModulation={true}
        modulationOffset={0.4}
      />
    </EffectComposer>
  );
}
