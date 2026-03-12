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
    bloomIntensity: 0.3,
    bloomThreshold: 0.85,
    bloomSmoothing: 0.4,
  },
  wonder: {
    bloomIntensity: 0.5,
    bloomThreshold: 0.78,
    bloomSmoothing: 0.5,
  },
  preparation: {
    bloomIntensity: 0.4,
    bloomThreshold: 0.82,
    bloomSmoothing: 0.45,
  },
  restoration: {
    bloomIntensity: 0.6,
    bloomThreshold: 0.75,
    bloomSmoothing: 0.5,
  },
  triumph: {
    bloomIntensity: 0.8,
    bloomThreshold: 0.7,
    bloomSmoothing: 0.55,
  },
};

export default function PostProcessingStack({ emotion = 'dormant', variant = 'story' }: Props) {
  const config = EMOTION_CONFIGS[emotion] || EMOTION_CONFIGS.dormant;

  const bloomMultiplier = variant === 'title' ? 1.3 : variant === 'result' ? 1.2 : 1.0;

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
