import { useState } from 'react';
import { motion } from 'framer-motion';
import { AVATAR_MODELS } from '../data/avatarModels';
import bgAvatar from '../../assets/bg-avatar.jpg';
import SceneCanvas3D from '../effects3d/SceneCanvas3D';
import { getAudioEngine } from '../audio/AudioEngine';

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

  const handleCardClick = (id: string) => {
    setSelectedId(id);
    try { getAudioEngine().playSfx('select'); } catch {}
  };

  const handleFilterClick = (f: 'all' | 'masculina' | 'feminina') => {
    setFilter(f);
    try { getAudioEngine().playSfx('tick'); } catch {}
  };

  return (
    <div className="vn-container">
      <SceneCanvas3D
        background={bgAvatar}
        particles="sparks"
        emotion="wonder"
        variant="story"
        lightVariant="title"
        lightIntensity={1.0}
      />

      <div className="avatar-setup-layout">
        <div className="avatar-preview-area">
          <div
            className="avatar-preview-frame"
            style={{
              opacity: selected ? 1 : 0,
              transform: selected ? 'scale(1)' : 'scale(0.88)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
            }}
          >
            {selected && (
              <>
                <img src={selected.image} alt={selected.label} className="avatar-preview-image" />
                <div className="avatar-preview-label">
                  <h3>{selected.label}</h3>
                  <span className="avatar-preview-repr">{selected.representacao}</span>
                </div>
              </>
            )}
          </div>
          {!selected && (
            <div className="avatar-preview-placeholder">
              <div className="avatar-placeholder-icon">◆</div>
              <p>Escolha seu herói</p>
            </div>
          )}
        </div>

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
                onClick={() => handleFilterClick(f)}
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
                onClick={() => handleCardClick(model.id)}
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
