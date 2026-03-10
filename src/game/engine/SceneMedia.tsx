import { motion } from 'framer-motion';
import type { NpcConfig, ParticlePreset } from '../types';
import ParticleLayer from '../effects/ParticleLayer';

interface Props {
  background: string;
  npc?: NpcConfig;
  particles?: ParticlePreset;
}

export default function SceneMedia({ background, npc, particles = 'dust' }: Props) {
  return (
    <>
      {/* Background — no AnimatePresence to prevent flashing */}
      <motion.div
        key={background}
        className="vn-background"
        style={{ backgroundImage: `url(${background})` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
      />

      {/* Particle effects */}
      <ParticleLayer preset={particles} intensity={0.6} />

      {/* NPC sprite — simple fade, no horizontal slide to prevent flicker */}
      {npc && (
        <motion.div
          key={npc.name}
          className={`vn-npc vn-npc-${npc.position || 'right'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <img src={npc.image} alt={npc.name} className="vn-npc-image" />
        </motion.div>
      )}

      {/* Cinematic overlays */}
      <div className="vn-vignette" />
      <div className="vn-grain" />
      <div className="vn-bottom-gradient" />
    </>
  );
}
