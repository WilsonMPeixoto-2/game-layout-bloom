import { motion } from 'framer-motion';
import { TOOLS } from '../types';
import bgToolkit from '../../assets/bg-toolkit.jpg';
import ParticleLayer from '../effects/ParticleLayer';

interface Props {
  selected: string[];
  toggleTool: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ToolkitScene({ selected, toggleTool, onNext, onBack }: Props) {
  return (
    <div className="vn-container">
      <div className="vn-background vn-bg-static" style={{ backgroundImage: `url(${bgToolkit})` }} />
      <ParticleLayer preset="sparks" intensity={0.4} />
      <div className="vn-vignette" />
      <div className="vn-bottom-gradient" />

      <div className="toolkit-layout">
        <motion.div
          className="toolkit-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2>Suas Habilidades</h2>
          <p>Escolha 3 poderes para a missão</p>
        </motion.div>

        <div className="tool-selection">
          {TOOLS.map((tool, idx) => (
            <motion.button
              key={tool.id}
              className={`tool-card ${selected.includes(tool.id) ? 'selected' : ''}`}
              onClick={() => toggleTool(tool.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="tool-icon">{tool.icon}</div>
              <div className="tool-info">
                <h4>{tool.label}</h4>
                <p>{tool.summary}</p>
              </div>
              {selected.includes(tool.id) && (
                <motion.div
                  className="tool-check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  ✓
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        <p className="tool-counter">{selected.length} / 3</p>

        <div className="action-row">
          <button className="btn-hero secondary" onClick={onBack}>← Voltar</button>
          <button className="btn-hero primary" onClick={onNext} disabled={selected.length !== 3}>
            Começar Jornada →
          </button>
        </div>
      </div>
    </div>
  );
}