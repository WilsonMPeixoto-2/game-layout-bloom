import { motion } from 'framer-motion';

interface Props {
  act: number;
  avatarImage: string | null;
  progress: number;
  impact: number;
}

const ACT_LABELS: Record<number, string> = {
  0: 'Prólogo',
  1: 'Descoberta',
  2: 'Preparação',
  3: 'Restauração',
  4: 'Renascimento',
};

export default function GameHud({ act, avatarImage, progress, impact }: Props) {
  return (
    <div className="vn-hud">
      <div className="vn-hud-left">
        <span className="vn-hud-act">
          Ato {act} | {ACT_LABELS[act] || 'Jornada'}
        </span>
        <div className="vn-progress-bar">
          <motion.div
            className="vn-progress-fill"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="vn-hud-right">
        <div className="vn-hud-stat">
          <span className="vn-hud-stat-label">Impacto</span>
          <span className="vn-hud-stat-value">{impact}</span>
        </div>
        {avatarImage && (
          <div className="vn-hud-avatar">
            <img src={avatarImage} alt="Seu avatar" />
          </div>
        )}
      </div>
    </div>
  );
}
