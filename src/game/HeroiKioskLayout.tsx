import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  SCREEN_ORDER,
  SKIN_COLORS,
  HAIR_COLORS,
  EYE_COLORS,
  OUTFIT_COLORS,
  ACCESSORIES,
  TOOLS,
  DREAM_SLOTS,
  type ScreenId,
} from './types';
import '../styles/heroi-kiosk.css';

import bgDystopia from '../assets/bg-dystopia.jpg';
import bgLab from '../assets/bg-lab.jpg';
import bgRepair from '../assets/bg-repair.jpg';
import bgReborn from '../assets/bg-reborn.jpg';

const SCENE_BG: Record<ScreenId, string> = {
  ATTRACT: bgDystopia,
  INTRO: bgDystopia,
  AVATAR: bgLab,
  TOOLKIT: bgLab,
  REPAIR: bgRepair,
  RESULT: bgReborn,
};

const sceneTransition = {
  initial: { opacity: 0, scale: 1.05 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.4, ease: 'easeIn' as const } },
};

function stepLabel(s: ScreenId) {
  const labels: Record<ScreenId, string> = {
    ATTRACT: 'Attract', INTRO: 'Contexto', AVATAR: 'Avatar',
    TOOLKIT: 'Ferramentas', REPAIR: 'Reparo', RESULT: 'Resultado',
  };
  return labels[s];
}

export default function HeroiKioskLayout() {
  const [screen, setScreen] = useState<ScreenId>('ATTRACT');
  const [avatar, setAvatar] = useState({ skin: 0, hair: 1, eyes: 0, outfit: 0, accessory: 2 });
  const [selectedTools, setSelectedTools] = useState<string[]>(['escuta-ativa', 'imaginacao', 'foco']);
  const [armedTool, setArmedTool] = useState<string | null>('escuta-ativa');
  const [slotProgress] = useState<Record<string, number>>({
    comunicacao: 2, criatividade: 1, coragem: 0, cooperacao: 2,
  });

  const goNext = () => {
    const i = SCREEN_ORDER.indexOf(screen);
    if (i < SCREEN_ORDER.length - 1) setScreen(SCREEN_ORDER[i + 1]);
  };
  const goPrev = () => {
    const i = SCREEN_ORDER.indexOf(screen);
    if (i > 0) setScreen(SCREEN_ORDER[i - 1]);
  };

  return (
    <div className="heroi-root">
      {/* Dev switcher */}
      <div className="theme-switcher">
        {SCREEN_ORDER.map((s) => (
          <button key={s} className={screen === s ? 'active' : ''} onClick={() => setScreen(s)}>
            {stepLabel(s)}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={screen} {...sceneTransition} style={{ position: 'absolute', inset: 0 }}>
          {screen === 'ATTRACT' && <AttractScene onStart={goNext} />}
          {screen === 'INTRO' && <IntroScene onNext={goNext} />}
          {screen === 'AVATAR' && <AvatarScene avatar={avatar} setAvatar={setAvatar} onNext={goNext} onBack={goPrev} />}
          {screen === 'TOOLKIT' && <ToolkitScene selected={selectedTools} setSelected={setSelectedTools} onNext={goNext} onBack={goPrev} />}
          {screen === 'REPAIR' && <RepairScene tools={selectedTools} armed={armedTool} setArmed={setArmedTool} progress={slotProgress} onNext={goNext} onBack={goPrev} />}
          {screen === 'RESULT' && <ResultScene tools={selectedTools} progress={slotProgress} onRestart={() => setScreen('ATTRACT')} />}
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="progress-dots">
        {SCREEN_ORDER.map((s, i) => (
          <button
            key={s}
            className={`progress-dot ${screen === s ? 'active' : SCREEN_ORDER.indexOf(screen) > i ? 'completed' : ''}`}
            onClick={() => setScreen(s)}
            aria-label={stepLabel(s)}
          />
        ))}
      </div>
    </div>
  );
}

/* ===== HUD ===== */
function Hud() {
  return (
    <div className="hud-overlay">
      <span className="hud-title">Herói do Futuro</span>
      <div className="hud-stats">
        <div className="hud-stat">
          <span className="hud-stat-label">Tempo</span>
          <span className="hud-stat-value">02:30</span>
        </div>
        <div className="hud-stat">
          <span className="hud-stat-label">Energia</span>
          <span className="hud-stat-value">100%</span>
          <div className="hud-energy-bar"><div className="hud-energy-fill" style={{ width: '100%' }} /></div>
        </div>
      </div>
    </div>
  );
}

/* ===== ATTRACT ===== */
function AttractScene({ onStart }: { onStart: () => void }) {
  return (
    <div className="scene">
      <div className="scene-bg" style={{ backgroundImage: `url(${SCENE_BG.ATTRACT})` }} />
      <div className="scene-content">
        <div className="narrative-box">
          <motion.span className="narrative-tag" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            ⚡ Estação Herói — Missão Ativa
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
            O Módulo dos Sonhos precisa de você.
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.6 }}>
            A estação está em colapso. Você é a última esperança para restaurar os sistemas e salvar o futuro da cidade.
          </motion.p>
          <motion.div className="action-row" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
            <button className="btn-hero primary" onClick={onStart}>▶ Iniciar Missão</button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ===== INTRO ===== */
function IntroScene({ onNext }: { onNext: () => void }) {
  return (
    <div className="scene">
      <div className="scene-bg" style={{ backgroundImage: `url(${SCENE_BG.INTRO})` }} />
      <div className="scene-content">
        <div className="narrative-box">
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
            Bem-vindo à Estação Herói
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            A cidade perdeu a capacidade de sonhar. O Módulo dos Sonhos, coração da estação, foi danificado.
            Sua missão: montar seu avatar, escolher ferramentas e restaurar os núcleos antes que o tempo acabe.
          </motion.p>
          <motion.div className="action-row" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
            <button className="btn-hero primary" onClick={onNext}>Continuar →</button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ===== AVATAR ===== */
function AvatarScene({ avatar, setAvatar, onNext, onBack }: {
  avatar: { skin: number; hair: number; eyes: number; outfit: number; accessory: number };
  setAvatar: React.Dispatch<React.SetStateAction<typeof avatar>>;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="scene">
      <div className="scene-bg" style={{ backgroundImage: `url(${SCENE_BG.AVATAR})` }} />
      <Hud />
      <div className="interaction-panel">
        <div className="interaction-header">
          <h2>Monte seu Avatar</h2>
          <p>Personalize seu herói antes da missão.</p>
        </div>
        <div className="avatar-builder">
          <div className="avatar-stage">
            <svg className="avatar-svg" viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg">
              <g className="avatar-bob">
                <rect x="60" y="140" width="80" height="100" rx="16" fill={OUTFIT_COLORS[avatar.outfit]} />
                <circle cx="100" cy="100" r="50" fill={SKIN_COLORS[avatar.skin]} />
                <ellipse cx="100" cy="68" rx="48" ry="28" fill={HAIR_COLORS[avatar.hair]} />
                <g style={{ transformOrigin: '50% 50%', animation: 'avatar-blink 4.4s infinite' }}>
                  <circle cx="82" cy="102" r="6" fill={EYE_COLORS[avatar.eyes]} />
                  <circle cx="118" cy="102" r="6" fill={EYE_COLORS[avatar.eyes]} />
                  <circle cx="84" cy="100" r="2" fill="white" />
                  <circle cx="120" cy="100" r="2" fill="white" />
                </g>
                <path d="M88 118 Q100 130 112 118" stroke={SKIN_COLORS[avatar.skin]} strokeWidth="2" fill="none" style={{ filter: 'brightness(0.8)' }} />
                {avatar.accessory > 0 && (
                  <text x="100" y="52" textAnchor="middle" fontSize="14" fill="var(--hk-accent-warm)">
                    {['', '⟐', '◈', '◆', '◉', '☀'][avatar.accessory]}
                  </text>
                )}
              </g>
            </svg>
          </div>
          <div className="avatar-options">
            <ColorGroup label="Tom de pele" colors={SKIN_COLORS} active={avatar.skin} onSelect={(i) => setAvatar(a => ({ ...a, skin: i }))} />
            <ColorGroup label="Cabelo" colors={HAIR_COLORS} active={avatar.hair} onSelect={(i) => setAvatar(a => ({ ...a, hair: i }))} />
            <ColorGroup label="Olhos" colors={EYE_COLORS} active={avatar.eyes} onSelect={(i) => setAvatar(a => ({ ...a, eyes: i }))} />
            <ColorGroup label="Traje" colors={OUTFIT_COLORS} active={avatar.outfit} onSelect={(i) => setAvatar(a => ({ ...a, outfit: i }))} />
            <div className="option-group">
              <label>Acessório</label>
              <div className="accessory-pills">
                {ACCESSORIES.map((acc, i) => (
                  <button key={acc} className={`accessory-pill ${avatar.accessory === i ? 'active' : ''}`}
                    onClick={() => setAvatar(a => ({ ...a, accessory: i }))}>
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
    </div>
  );
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

/* ===== TOOLKIT ===== */
function ToolkitScene({ selected, setSelected, onNext, onBack }: {
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  onNext: () => void;
  onBack: () => void;
}) {
  const toggle = (id: string) => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(t => t !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  return (
    <div className="scene">
      <div className="scene-bg" style={{ backgroundImage: `url(${SCENE_BG.TOOLKIT})` }} />
      <Hud />
      <div className="interaction-panel">
        <div className="interaction-header">
          <h2>Escolha suas Ferramentas</h2>
          <p>Selecione 3 ferramentas para sua missão de restauração.</p>
        </div>
        <div className="tool-selection">
          {TOOLS.map(tool => (
            <motion.button key={tool.id}
              className={`tool-card ${selected.includes(tool.id) ? 'selected' : ''}`}
              onClick={() => toggle(tool.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
    </div>
  );
}

/* ===== REPAIR ===== */
function RepairScene({ tools, armed, setArmed, progress, onNext, onBack }: {
  tools: string[];
  armed: string | null;
  setArmed: (t: string | null) => void;
  progress: Record<string, number>;
  onNext: () => void;
  onBack: () => void;
}) {
  const toolItems = tools.map(id => TOOLS.find(t => t.id === id)!).filter(Boolean);
  const completed = DREAM_SLOTS.filter(s => (progress[s.id] ?? 0) >= 2).length;

  return (
    <div className="scene">
      <div className="scene-bg" style={{ backgroundImage: `url(${SCENE_BG.REPAIR})` }} />
      <Hud />
      <div className="interaction-panel">
        <div className="interaction-header">
          <h2>Restaurar o Módulo dos Sonhos</h2>
          <p>Arme uma ferramenta e aplique nos núcleos para restaurá-los.</p>
        </div>
        <div className="repair-layout">
          <div className="armed-tools">
            {toolItems.map(tool => (
              <button key={tool.id}
                className={`armed-chip ${armed === tool.id ? 'active' : ''}`}
                onClick={() => setArmed(armed === tool.id ? null : tool.id)}
              >
                <span>{tool.icon}</span> {tool.label}
              </button>
            ))}
          </div>
          <div className="dream-cores">
            {DREAM_SLOTS.map(slot => {
              const p = progress[slot.id] ?? 0;
              const done = p >= 2;
              return (
                <motion.button key={slot.id}
                  className={`dream-core ${done ? 'online' : ''}`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <h4>{slot.label}</h4>
                  <span className="core-status">{done ? '● Online' : `${p}/2`}</span>
                </motion.button>
              );
            })}
          </div>
          <p className="combo-display">Progresso: {completed}/4 · Combo: x2 · Melhor: x3</p>
        </div>
        <div className="action-row">
          <button className="btn-hero secondary" onClick={onBack}>← Voltar</button>
          <button className="btn-hero primary" onClick={onNext} disabled={completed < 3}>Finalizar Missão →</button>
        </div>
      </div>
    </div>
  );
}

/* ===== RESULT ===== */
function ResultScene({ tools, progress, onRestart }: {
  tools: string[];
  progress: Record<string, number>;
  onRestart: () => void;
}) {
  const completed = DREAM_SLOTS.filter(s => (progress[s.id] ?? 0) >= 2).length;
  const toolNames = tools.map(id => TOOLS.find(t => t.id === id)?.label ?? id).join(', ');

  return (
    <div className="scene">
      <div className="scene-bg" style={{ backgroundImage: `url(${SCENE_BG.RESULT})` }} />
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
              <div className="result-stat"><div className="stat-label">Energia</div><div className="stat-value">72%</div></div>
              <div className="result-stat"><div className="stat-label">Combo Máx</div><div className="stat-value">x3</div></div>
              <div className="result-stat"><div className="stat-label">Selo</div><div className="stat-value">Restaurador Visionário</div></div>
            </div>
          </motion.div>
          <motion.div className="action-row" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
            <button className="btn-hero secondary" onClick={onRestart}>🔄 Jogar Novamente</button>
            <button className="btn-hero primary">📷 Registrar Memória</button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
