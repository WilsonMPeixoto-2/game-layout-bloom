import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AVATAR_MODELS } from '../data/avatarModels';
import bgAvatar from '../../assets/bg-avatar.jpg';
import ParticleLayer from '../effects/ParticleLayer';

interface Props {
  onSelect: (avatarId: string) => void;
  onBack: () => void;
}

export default function AvatarSetup({ onSelect, onBack }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'masculina' | 'feminina'>('all');

  const filtered = filter === 'all'
    ? AVATAR_MODELS
    : AVATAR_MODELS.filter(m => m.matriz === filter);

  const selected = AVATAR_MODELS.find(m => m.id === selectedId);

  return (
    <div className="vn-container">
      <div className="vn-background vn-bg-static" style={{ backgroundImage: `url(${bgAvatar})`, filter: 'blur(20px) brightness(0.3) saturate(0.5)' }} />
      <ParticleLayer preset="sparks" intensity={0.3} />
      <div className="vn-vignette" />

      <div className="avatar-setup-layout">
        {/* Preview area */}
        <div className="avatar-preview-area">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                className="avatar-preview-frame"
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.88 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <img src={selected.image} alt={selected.label} className="avatar-preview-image" />
                <div className="avatar-preview-label">
                  <h3>{selected.label}</h3>
                  <span className="avatar-preview-repr">{selected.representacao}</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                className="avatar-preview-placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="avatar-placeholder-icon">◆</div>
                <p>Escolha seu herói</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Selection panel */}
        <div className="avatar-selection-area">
          <div className="avatar-selection-header">
            <h2>Seu Herói</h2>
            <p>Quem vai salvar a cidade?</p>
          </div>

          <div className="avatar-filter-tabs">
            {(['all', 'masculina', 'feminina'] as const).map(f => (
              <button
                key={f}
                className={`avatar-filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'Todos' : f === 'masculina' ? 'Masculino' : 'Feminino'}
              </button>
            ))}
          </div>

          <div className="avatar-grid">
            {filtered.map((model, idx) => (
              <motion.button
                key={model.id}
                className={`avatar-card ${selectedId === model.id ? 'selected' : ''}`}
                onClick={() => setSelectedId(model.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <img src={model.image} alt={model.label} />
                <span className="avatar-card-label">{model.label}</span>
              </motion.button>
            ))}
          </div>

          <div className="action-row">
            <button className="btn-hero secondary" onClick={onBack}>← Voltar</button>
            <button
              className="btn-hero primary"
              onClick={() => selectedId && onSelect(selectedId)}
              disabled={!selectedId}
            >
              Confirmar →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}