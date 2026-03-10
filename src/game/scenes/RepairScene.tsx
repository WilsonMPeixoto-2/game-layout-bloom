import { motion } from 'framer-motion';
import { TOOLS, DREAM_SLOTS } from '../types';

interface Props {
  tools: string[];
  armed: string | null;
  setArmed: (t: string | null) => void;
  progress: Record<string, number>;
  applyToolToSlot: (slotId: string) => void;
  combo: number;
  maxCombo: number;
  energy: number;
  timeRemaining: number;
  onNext: () => void;
  onBack: () => void;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

export default function RepairScene({
  tools, armed, setArmed, progress, applyToolToSlot,
  combo, maxCombo, energy, timeRemaining, onNext, onBack,
}: Props) {
  const toolItems = tools.map((id) => TOOLS.find((t) => t.id === id)!).filter(Boolean);
  const completed = DREAM_SLOTS.filter((s) => (progress[s.id] ?? 0) >= 2).length;

  return (
    <>
      <div className="hud-overlay">
        <span className="hud-title">Herói do Futuro</span>
        <div className="hud-stats">
          <div className="hud-stat">
            <span className="hud-stat-label">Tempo</span>
            <span className="hud-stat-value">{formatTime(timeRemaining)}</span>
          </div>
          <div className="hud-stat">
            <span className="hud-stat-label">Energia</span>
            <span className="hud-stat-value">{energy}%</span>
            <div className="hud-energy-bar">
              <div className="hud-energy-fill" style={{ width: `${energy}%` }} />
            </div>
          </div>
          <div className="hud-stat">
            <span className="hud-stat-label">Combo</span>
            <span className="hud-stat-value">x{combo}</span>
          </div>
        </div>
      </div>
      <div className="interaction-panel">
        <div className="interaction-header">
          <h2>Restaurar o Módulo dos Sonhos</h2>
          <p>Arme uma ferramenta e aplique nos núcleos para restaurá-los.</p>
        </div>
        <div className="repair-layout">
          <div className="armed-tools">
            {toolItems.map((tool) => (
              <button key={tool.id}
                className={`armed-chip ${armed === tool.id ? 'active' : ''}`}
                onClick={() => setArmed(armed === tool.id ? null : tool.id)}>
                <span>{tool.icon}</span> {tool.label}
              </button>
            ))}
          </div>
          <div className="dream-cores">
            {DREAM_SLOTS.map((slot) => {
              const p = progress[slot.id] ?? 0;
              const done = p >= 2;
              return (
                <motion.button key={slot.id}
                  className={`dream-core ${done ? 'online' : ''}`}
                  onClick={() => applyToolToSlot(slot.id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}>
                  <h4>{slot.label}</h4>
                  <span className="core-status">{done ? '● Online' : `${p}/2`}</span>
                </motion.button>
              );
            })}
          </div>
          <p className="combo-display">
            Progresso: {completed}/4 · Combo: x{combo} · Melhor: x{maxCombo}
          </p>
        </div>
        <div className="action-row">
          <button className="btn-hero secondary" onClick={onBack}>← Voltar</button>
          <button className="btn-hero primary" onClick={onNext} disabled={completed < 3}>Finalizar Missão →</button>
        </div>
      </div>
    </>
  );
}
