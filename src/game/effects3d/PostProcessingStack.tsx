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
    bloomIntensity: 0.6,
    bloomThreshold: 0.45,
    bloomSmoothing: 0.7,
    vignetteDarkness: 0.55,
    chromaticOffset: 0.0003,
  },
  wonder: {
    bloomIntensity: 1.0,
    bloomThreshold: 0.3,
    bloomSmoothing: 0.8,
    vignetteDarkness: 0.45,
    chromaticOffset: 0.0005,
  },
  preparation: {
    bloomIntensity: 0.8,
    bloomThreshold: 0.35,
    bloomSmoothing: 0.75,
    vignetteDarkness: 0.5,
    chromaticOffset: 0.0004,
  },
  restoration: {
    bloomIntensity: 1.2,
    bloomThreshold: 0.25,
    bloomSmoothing: 0.82,
    vignetteDarkness: 0.4,
    chromaticOffset: 0.0006,
  },
  triumph: {
    bloomIntensity: 1.8,
    bloomThreshold: 0.2,
    bloomSmoothing: 0.85,
    vignetteDarkness: 0.3,
    chromaticOffset: 0.0008,
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
