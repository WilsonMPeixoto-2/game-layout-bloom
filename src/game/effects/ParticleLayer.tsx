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
      return <FloatingDust count={100} />;
    case 'sparks':
      return <MagicSparks count={60} />;
    case 'energy':
      return <EnergyFlow count={150} intensity={intensity} />;
    case 'bloom':
      return (
        <>
          <FloatingDust count={60} color="#b388ff" opacity={0.2} />
          <MagicSparks count={30} />
        </>
      );
    case 'triumph':
      return (
        <>
          <TriumphBurst count={200} />
          <FloatingDust count={80} color="#ffd700" opacity={0.4} />
        </>
      );
    case 'none':
    default:
      return null;
  }
}
