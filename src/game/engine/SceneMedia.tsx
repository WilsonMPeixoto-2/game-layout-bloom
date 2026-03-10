import { motion, AnimatePresence } from 'framer-motion';
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
      {/* Background with breathing animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={background}
          className="vn-background"
          style={{ backgroundImage: `url(${background})` }}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </AnimatePresence>

      {/* Particle effects */}
      <ParticleLayer preset={particles} intensity={0.6} />

      {/* NPC sprite */}
      <AnimatePresence>
        {npc && (
          <motion.div
            key={npc.name}
            className={`vn-npc vn-npc-${npc.position || 'right'}`}
            initial={{ opacity: 0, x: npc.position === 'left' ? -60 : 60, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: npc.position === 'left' ? -40 : 40, scale: 0.95 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={npc.image} alt={npc.name} className="vn-npc-image" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic overlays */}
      <div className="vn-vignette" />
      <div className="vn-grain" />
      <div className="vn-bottom-gradient" />
    </>
  );
}
