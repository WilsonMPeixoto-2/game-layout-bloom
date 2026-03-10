import { motion } from 'framer-motion';

interface Props {
  narrative: { title: string; body: string };
  onNext: () => void;
}

export default function IntroScene({ narrative, onNext }: Props) {
  return (
    <div className="scene-content">
      <div className="narrative-box">
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
          {narrative.title}
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          {narrative.body}
        </motion.p>
        <motion.div className="action-row" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
          <button className="btn-hero primary" onClick={onNext}>Continuar →</button>
        </motion.div>
      </div>
    </div>
  );
}
