import { motion } from 'framer-motion';

interface Props {
  narrative: { tag?: string; title: string; body: string };
  onStart: () => void;
}

export default function AttractScene({ narrative, onStart }: Props) {
  return (
    <div className="scene-content rounded-sm shadow-sm border-0 opacity-90">
      <div className="narrative-box">
        {narrative.tag && (
          <motion.span className="narrative-tag" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            {narrative.tag}
          </motion.span>
        )}
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
          {narrative.title}
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.6 }}>
          {narrative.body}
        </motion.p>
        <motion.div className="action-row" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
          <button className="btn-hero primary" onClick={onStart}>▶ Iniciar Missão</button>
        </motion.div>
      </div>
    </div>
  );
}
