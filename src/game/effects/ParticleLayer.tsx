import { memo } from 'react';
import type { ParticlePreset } from '../types';
import FloatingDust from './FloatingDust';
import MagicSparks from './MagicSparks';
import EnergyFlow from './EnergyFlow';
import TriumphBurst from './TriumphBurst';

interface Props {
  preset: ParticlePreset;
  intensity?: number;
}

function ParticleLayer({ preset, intensity = 0.7 }: Props) {
  switch (preset) {
    case 'dust':
      return <FloatingDust count={160} />;
    case 'sparks':
      return <MagicSparks count={120} />;
    case 'energy':
      return <EnergyFlow count={100} intensity={intensity} />;
    case 'bloom':
      return (
        <>
          <FloatingDust count={120} color="#ea80fc" opacity={0.45} />
          <MagicSparks count={80} />
        </>
      );
    case 'triumph':
      return (
        <>
          <TriumphBurst count={150} />
          <FloatingDust count={100} color="#ffcc00" opacity={0.7} />
          <MagicSparks count={60} colors={['#ffcc00', '#ffe566', '#00e5ff']} />
        </>
      );
    case 'none':
    default:
      return null;
  }
}

export default memo(ParticleLayer);
