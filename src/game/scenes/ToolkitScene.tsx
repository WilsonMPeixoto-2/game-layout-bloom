import { motion } from 'framer-motion';
import { TOOLS } from '../types';

interface Props {
  selected: string[];
  toggleTool: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ToolkitScene({ selected, toggleTool, onNext, onBack }: Props) {
  return (
    <>
      <div className="hud-placeholder" />
      <div className="interaction-panel">
        <div className="interaction-header">
          <h2>Escolha suas Ferramentas</h2>
          <p>Selecione 3 ferramentas para sua missão de restauração.</p>
        </div>
        <div className="tool-selection">
          {TOOLS.map((tool, idx) => (
            <motion.button
              key={tool.id}
              className={`tool-card ${selected.includes(tool.id) ? 'selected' : ''}`}
              onClick={() => toggleTool(tool.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="tool-icon">{tool.icon}</div>
              <div className="tool-info">
                <h4>{tool.label}</h4>
                <p>{tool.summary}</p>
              </div>
            </motion.button>
          ))}
        </div>
        <p className="tool-counter">Selecionadas: {selected.length} / 3</p>
        <div className="action-row">
          <button className="btn-hero secondary" onClick={onBack}>← Voltar</button>
          <button className="btn-hero primary" onClick={onNext} disabled={selected.length !== 3}>Iniciar Reparo →</button>
        </div>
      </div>
    </>
  );
}
