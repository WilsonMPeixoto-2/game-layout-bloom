import { motion } from 'framer-motion';
import { SKIN_COLORS, HAIR_COLORS, EYE_COLORS, OUTFIT_COLORS, ACCESSORIES, type AvatarState } from '../types';

interface Props {
  avatar: AvatarState;
  setAvatar: React.Dispatch<React.SetStateAction<AvatarState>>;
  onNext: () => void;
  onBack: () => void;
}

function ColorGroup({ label, colors, active, onSelect }: { label: string; colors: string[]; active: number; onSelect: (i: number) => void }) {
  return (
    <div className="option-group">
      <label>{label}</label>
      <div className="color-swatches">
        {colors.map((c, i) => (
          <button key={c} className={`color-swatch ${active === i ? 'active' : ''}`}
            style={{ background: c }} onClick={() => onSelect(i)} aria-label={`${label} ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

export default function AvatarScene({ avatar, setAvatar, onNext, onBack }: Props) {
  return (
    <>
      <div className="hud-placeholder" />
      <div className="interaction-panel">
        <div className="interaction-header">
          <h2>Monte seu Avatar</h2>
          <p>Personalize seu herói antes da missão.</p>
        </div>
        <div className="avatar-builder">
          <motion.div
            className="avatar-stage"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <svg className="avatar-svg" viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="rimLight" cx="0.3" cy="0.3" r="0.7">
                  <stop offset="0%" stopColor="rgba(240,192,64,0.15)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
              <g className="avatar-bob">
                {/* Pedestal glow */}
                <ellipse cx="100" cy="248" rx="50" ry="8" fill="rgba(240,192,64,0.12)" />
                {/* Body */}
                <rect x="60" y="140" width="80" height="100" rx="16" fill={OUTFIT_COLORS[avatar.outfit]} />
                {/* Rim light on body */}
                <rect x="60" y="140" width="80" height="100" rx="16" fill="url(#rimLight)" />
                {/* Head */}
                <circle cx="100" cy="100" r="50" fill={SKIN_COLORS[avatar.skin]} />
                {/* Hair */}
                <ellipse cx="100" cy="68" rx="48" ry="28" fill={HAIR_COLORS[avatar.hair]} />
                {/* Eyes with glow */}
                <g style={{ transformOrigin: '50% 50%', animation: 'avatar-blink 4.4s infinite' }}>
                  <circle cx="82" cy="102" r="7" fill={EYE_COLORS[avatar.eyes]} />
                  <circle cx="118" cy="102" r="7" fill={EYE_COLORS[avatar.eyes]} />
                  <circle cx="84" cy="99" r="2.5" fill="white" />
                  <circle cx="120" cy="99" r="2.5" fill="white" />
                  {/* Eye glow */}
                  <circle cx="82" cy="102" r="10" fill="none" stroke={EYE_COLORS[avatar.eyes]} strokeWidth="0.5" opacity="0.3" />
                  <circle cx="118" cy="102" r="10" fill="none" stroke={EYE_COLORS[avatar.eyes]} strokeWidth="0.5" opacity="0.3" />
                </g>
                {/* Mouth */}
                <path d="M88 118 Q100 130 112 118" stroke={SKIN_COLORS[avatar.skin]} strokeWidth="2" fill="none" style={{ filter: 'brightness(0.8)' }} />
                {/* Accessory */}
                {avatar.accessory > 0 && (
                  <text x="100" y="52" textAnchor="middle" fontSize="16" fill="var(--hk-gold-bright)">
                    {['', '⟐', '◈', '◆', '◉', '☀'][avatar.accessory]}
                  </text>
                )}
              </g>
            </svg>
          </motion.div>
          <div className="avatar-options">
            <ColorGroup label="Tom de pele" colors={SKIN_COLORS} active={avatar.skin} onSelect={(i) => setAvatar((a) => ({ ...a, skin: i }))} />
            <ColorGroup label="Cabelo" colors={HAIR_COLORS} active={avatar.hair} onSelect={(i) => setAvatar((a) => ({ ...a, hair: i }))} />
            <ColorGroup label="Olhos" colors={EYE_COLORS} active={avatar.eyes} onSelect={(i) => setAvatar((a) => ({ ...a, eyes: i }))} />
            <ColorGroup label="Traje" colors={OUTFIT_COLORS} active={avatar.outfit} onSelect={(i) => setAvatar((a) => ({ ...a, outfit: i }))} />
            <div className="option-group">
              <label>Acessório</label>
              <div className="accessory-pills">
                {ACCESSORIES.map((acc, i) => (
                  <button key={acc} className={`accessory-pill ${avatar.accessory === i ? 'active' : ''}`}
                    onClick={() => setAvatar((a) => ({ ...a, accessory: i }))}>
                    {acc}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="action-row" style={{ marginTop: 20 }}>
          <button className="btn-hero secondary" onClick={onBack}>← Voltar</button>
          <button className="btn-hero primary" onClick={onNext}>Confirmar Avatar →</button>
        </div>
      </div>
    </>
  );
}
