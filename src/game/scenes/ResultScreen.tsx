import { motion } from 'framer-motion';
import type { ResultData } from '../types';
import { TOOLS } from '../types';
import bgReborn from '../../assets/bg-reborn.jpg';
import ParticleLayer from '../effects/ParticleLayer';
import LightShafts from '../effects/LightShafts';

interface Props {
  result: ResultData;
  onRestart: () => void;
}

const PATH_LABELS: Record<string, string> = {
  comunicacao: 'Comunicação',
  criatividade: 'Criatividade',
  coragem: 'Coragem',
  cooperacao: 'Cooperação',
  desconhecido: 'Herói',
};

const PATH_SEALS: Record<string, string> = {
  comunicacao: '🎧',
  criatividade: '✨',
  coragem: '💙',
  cooperacao: '🤝',
  desconhecido: '⭐',
};

export default function ResultScreen({ result, onRestart }: Props) {
  const toolLabels = result.tools.map(id => TOOLS.find(t => t.id === id)?.label || id);

  return (
    <div className="vn-container">
      <div className="vn-background vn-bg-static" style={{ backgroundImage: `url(${bgReborn})` }} />
      <LightShafts variant="triumph" intensity={1.2} />
      <ParticleLayer preset="triumph" />
      <div className="vn-vignette" />

      <motion.div
        className="result-layout"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        {/* Seal */}
        <motion.div
          className="result-seal"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 1, type: 'spring', stiffness: 100 }}
        >
          <div className="result-seal-icon">
            {PATH_SEALS[result.path] || '⭐'}
          </div>
        </motion.div>

        <motion.h2
          className="result-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          Missão Completa!
        </motion.h2>

        <motion.p
          className="result-path-label"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Caminho: {PATH_LABELS[result.path] || 'Herói'}
        </motion.p>

        {/* Avatar */}
        {result.avatarImage && (
          <motion.img
            src={result.avatarImage}
            alt="Seu herói"
            className="result-avatar"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          />
        )}

        {/* Stats */}
        <motion.div
          className="result-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <div className="result-stat">
            <span className="stat-label">Impacto</span>
            <span className="stat-value">{result.impact}</span>
          </div>
          <div className="result-stat">
            <span className="stat-label">Cenas</span>
            <span className="stat-value">{result.scenesVisited}</span>
          </div>
          <div className="result-stat">
            <span className="stat-label">Ferramentas</span>
            <span className="stat-value stat-value-small">{toolLabels.join(' · ')}</span>
          </div>
        </motion.div>

        <motion.div
          className="action-row"
          style={{ marginTop: 24 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <button className="btn-hero primary" onClick={onRestart}>
            Jogar Novamente
          </button>
        </motion.div>

        <motion.div
          style={{ marginTop: 32, textAlign: 'center', opacity: 0.6 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 2.5, duration: 1 }}
        >
          <p style={{ fontSize: '0.75rem', color: 'hsl(var(--foreground))', lineHeight: 1.6, letterSpacing: '0.02em' }}>
            Produzido por Wilson Malafaia Peixoto
          </p>
          <p style={{ fontSize: '0.7rem', color: 'hsl(var(--foreground))', opacity: 0.8 }}>
            SME - RJ
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}