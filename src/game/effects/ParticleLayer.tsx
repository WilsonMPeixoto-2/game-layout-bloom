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

function ParticleLayer({ preset, intensity = 0.5 }: Props) {
  switch (preset) {
    case 'dust':
      return <FloatingDust count={40} />;
    case 'sparks':
      return <MagicSparks count={30} />;
    case 'energy':
      return <EnergyFlow count={40} intensity={intensity} />;
    case 'bloom':
      return (
        <>
          <FloatingDust count={25} color="#ea80fc" opacity={0.25} />
          <MagicSparks count={20} />
        </>
      );
    case 'triumph':
      return (
        <>
          <TriumphBurst count={60} />
          <FloatingDust count={30} color="#ffcc00" opacity={0.5} />
        </>
      );
    case 'none':
    default:
      return null;
  }
}

export default memo(ParticleLayer);
