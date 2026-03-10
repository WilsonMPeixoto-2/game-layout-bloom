import { motion } from 'framer-motion';
import { TOOLS, DREAM_SLOTS } from '../types';

interface Props {
  tools: string[];
  progress: Record<string, number>;
  energy: number;
  maxCombo: number;
  onRestart: () => void;
}

export default function ResultScene({ tools, progress, energy, maxCombo, onRestart }: Props) {
  const completed = DREAM_SLOTS.filter((s) => (progress[s.id] ?? 0) >= 2).length;
  const toolNames = tools.map((id) => TOOLS.find((t) => t.id === id)?.label ?? id).join(', ');

  const seal = completed >= 4 ? 'Restaurador Lendário' :
    completed >= 3 ? 'Restaurador Visionário' : 'Aprendiz de Herói';

  return (
    <div className="scene-content">
      <div className="narrative-box">
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
          🏆 Missão Completa
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          Você restaurou o Módulo dos Sonhos e devolveu esperança à cidade.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
          <div className="result-stats">
            <div className="result-stat"><div className="stat-label">Ferramentas</div><div className="stat-value">{toolNames}</div></div>
            <div className="result-stat"><div className="stat-label">Núcleos</div><div className="stat-value">{completed}/4</div></div>
            <div className="result-stat"><div className="stat-label">Energia</div><div className="stat-value">{energy}%</div></div>
            <div className="result-stat"><div className="stat-label">Combo Máx</div><div className="stat-value">x{maxCombo}</div></div>
            <div className="result-stat"><div className="stat-label">Selo</div><div className="stat-value">{seal}</div></div>
          </div>
        </motion.div>
        <motion.div className="action-row" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
          <button className="btn-hero secondary" onClick={onRestart}>🔄 Jogar Novamente</button>
          <button className="btn-hero primary">📷 Registrar Memória</button>
        </motion.div>
      </div>
    </div>
  );
}
