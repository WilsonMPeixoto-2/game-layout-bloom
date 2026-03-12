import { motion } from 'framer-motion';
import bgAttract from '../../assets/bg-attract.jpg';
import SceneCanvas3D from '../effects3d/SceneCanvas3D';

interface Props {
  onStart: () => void;
}

export default function TitleScreen({ onStart }: Props) {
  return (
    <div className="vn-container">
      {/* R3F Canvas with bloom particles, volumetric light, full post-processing */}
      <SceneCanvas3D
        background={bgAttract}
        particles="bloom"
        emotion="wonder"
        variant="title"
        lightVariant="title"
        lightIntensity={1.2}
      />

      <motion.div
        className="vn-title-content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.span
          className="vn-title-tag"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          ⚡ Missão Ativa
        </motion.span>

        <h1 className="vn-title">Herói do Futuro</h1>

        <motion.p
          className="vn-title-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          A cidade precisa de você
        </motion.p>

        <motion.button
          className="btn-hero primary vn-start-btn"
          onClick={onStart}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Começar
        </motion.button>

        <motion.p
          className="vn-title-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0.3, 0.6] }}
          transition={{ delay: 2, duration: 3, repeat: Infinity }}
        >
          Toque para começar
        </motion.p>
      </motion.div>
    </div>
  );
}
