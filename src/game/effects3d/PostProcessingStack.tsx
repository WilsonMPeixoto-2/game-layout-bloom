import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import type { EmotionalState } from '../types';

interface Props {
  emotion?: EmotionalState;
  variant?: 'title' | 'story' | 'result';
}

const EMOTION_CONFIGS: Record<string, {
  bloomIntensity: number;
}> = {
  dormant: { bloomIntensity: 0.5 },
  wonder: { bloomIntensity: 0.56 },
  preparation: { bloomIntensity: 0.54 },
  restoration: { bloomIntensity: 0.6 },
  triumph: { bloomIntensity: 0.66 },
};

export default function PostProcessingStack({ emotion = 'dormant', variant = 'story' }: Props) {
  const config = EMOTION_CONFIGS[emotion] || EMOTION_CONFIGS.dormant;
  const bloomMultiplier = variant === 'title' ? 1.04 : variant === 'result' ? 1.02 : 1.0;

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={config.bloomIntensity * bloomMultiplier}
        luminanceThreshold={1}
        luminanceSmoothing={0.05}
        mipmapBlur={false}
      />
      <Vignette
        eskil={false}
        offset={0.22}
        darkness={variant === 'story' ? 0.24 : 0.28}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
