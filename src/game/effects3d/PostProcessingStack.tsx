import { EffectComposer, Bloom } from '@react-three/postprocessing';
import type { EmotionalState } from '../types';

interface Props {
  emotion?: EmotionalState;
  variant?: 'title' | 'story' | 'result';
}

const EMOTION_CONFIGS: Record<string, {
  bloomIntensity: number;
  bloomThreshold: number;
  bloomSmoothing: number;
}> = {
  dormant: {
    bloomIntensity: 0.22,
    bloomThreshold: 0.92,
    bloomSmoothing: 0.35,
  },
  wonder: {
    bloomIntensity: 0.3,
    bloomThreshold: 0.9,
    bloomSmoothing: 0.4,
  },
  preparation: {
    bloomIntensity: 0.26,
    bloomThreshold: 0.91,
    bloomSmoothing: 0.38,
  },
  restoration: {
    bloomIntensity: 0.35,
    bloomThreshold: 0.88,
    bloomSmoothing: 0.42,
  },
  triumph: {
    bloomIntensity: 0.5,
    bloomThreshold: 0.84,
    bloomSmoothing: 0.48,
  },
};

export default function PostProcessingStack({ emotion = 'dormant', variant = 'story' }: Props) {
  const config = EMOTION_CONFIGS[emotion] || EMOTION_CONFIGS.dormant;

  const bloomMultiplier = variant === 'title' ? 1.1 : variant === 'result' ? 1.08 : 1.0;

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={config.bloomIntensity * bloomMultiplier}
        luminanceThreshold={config.bloomThreshold}
        luminanceSmoothing={config.bloomSmoothing}
        mipmapBlur
      />
    </EffectComposer>
  );
}
