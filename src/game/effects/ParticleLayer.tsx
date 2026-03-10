import type { ParticlePreset } from '../types';
import FloatingDust from './FloatingDust';
import MagicSparks from './MagicSparks';
import EnergyFlow from './EnergyFlow';
import TriumphBurst from './TriumphBurst';

interface Props {
  preset: ParticlePreset;
  intensity?: number;
}

export default function ParticleLayer({ preset, intensity = 0.5 }: Props) {
  switch (preset) {
    case 'dust':
      return <FloatingDust count={150} />;
    case 'sparks':
      return <MagicSparks count={90} />;
    case 'energy':
      return <EnergyFlow count={220} intensity={intensity} />;
    case 'bloom':
      return (
        <>
          <FloatingDust count={90} color="#ea80fc" opacity={0.25} />
          <MagicSparks count={50} />
        </>
      );
    case 'triumph':
      return (
        <>
          <TriumphBurst count={300} />
          <FloatingDust count={120} color="#ffcc00" opacity={0.5} />
        </>
      );
    case 'none':
    default:
      return null;
  }
}
