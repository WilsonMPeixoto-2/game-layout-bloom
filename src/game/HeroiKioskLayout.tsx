import { useState } from 'react';
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

function stepLabel(screenId: ScreenId): string {
  const labels: Record<ScreenId, string> = {
    ATTRACT: '1. Attract',
    INTRO: '2. Contexto',
    AVATAR: '3. Avatar',
    TOOLKIT: '4. Ferramentas',
    REPAIR: '5. Reparo',
    RESULT: '6. Resultado',
  };
  return labels[screenId];
}

export default function HeroiKioskLayout() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('ATTRACT');
  const [theme, setTheme] = useState<string>('neon');
  const [selectedTools, setSelectedTools] = useState<string[]>(['escuta-ativa', 'imaginacao', 'foco']);
  const [armedTool, setArmedTool] = useState<string | null>('escuta-ativa');
  const [avatar, setAvatar] = useState({ skin: 0, hair: 1, eyes: 0, outfit: 0, accessory: 2 });
  const [slotProgress] = useState<Record<string, number>>({
    comunicacao: 2, criatividade: 1, coragem: 0, cooperacao: 2,
  });

  const themeAttr = theme === 'neon' ? undefined : theme;

  return (
    <div className="heroi-root" data-theme={themeAttr}>
      {/* Theme & Screen Switcher */}
      <div className="theme-switcher">
        <button className={theme === 'neon' ? 'active' : ''} onClick={() => setTheme('neon')}>🌃 Neon</button>
        <button className={theme === 'clean' ? 'active' : ''} onClick={() => setTheme('clean')}>🧊 Clean</button>
        <button className={theme === 'comic' ? 'active' : ''} onClick={() => setTheme('comic')}>🎭 Comic</button>
        <span style={{ width: 1, background: 'var(--line)', margin: '0 4px' }} />
        {SCREEN_ORDER.map((s) => (
          <button key={s} className={currentScreen === s ? 'active' : ''} onClick={() => setCurrentScreen(s)}>
            {stepLabel(s)}
          </button>
        ))}
      </div>

      <div style={{ paddingTop: 50 }}>
        <div className="app-shell">
          {/* Topbar */}
          <header className="topbar panel">
            <div className="brand">
              <h1>HERÓI DO FUTURO</h1>
              <p>Experiência arcade para restaurar o Módulo dos Sonhos.</p>
            </div>
            <Hud />
          </header>

          {/* Main Grid */}
          <div className="main-grid" data-screen-id={currentScreen}>
            <BagPanel avatar={avatar} selectedTools={selectedTools} slotProgress={slotProgress} />
            <section className="panel stage">
              <nav className="steps">
                {SCREEN_ORDER.map((s) => (
                  <span
                    key={s}
                    className={`step ${currentScreen === s ? 'is-active' : ''}`}
                    onClick={() => setCurrentScreen(s)}
                  >
                    {stepLabel(s)}
                  </span>
                ))}
              </nav>
              <div>
                {currentScreen === 'ATTRACT' && <AttractScreen />}
                {currentScreen === 'INTRO' && <IntroScreen />}
                {currentScreen === 'AVATAR' && <AvatarScreen avatar={avatar} setAvatar={setAvatar} />}
                {currentScreen === 'TOOLKIT' && (
                  <ToolkitScreen selectedTools={selectedTools} setSelectedTools={setSelectedTools} />
                )}
                {currentScreen === 'REPAIR' && (
                  <RepairScreen
                    selectedTools={selectedTools}
                    armedTool={armedTool}
                    setArmedTool={setArmedTool}
                    slotProgress={slotProgress}
                  />
                )}
                {currentScreen === 'RESULT' && (
                  <ResultScreen selectedTools={selectedTools} slotProgress={slotProgress} />
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hud() {
  return (
    <div className="hud">
      <div className="timer badge">
        <small>TEMPO</small>
        <span>02:30</span>
      </div>
      <div className="energy badge">
        <small>ENERGIA <strong>100%</strong></small>
        <div className="track">
          <i style={{ width: '100%' }} />
        </div>
      </div>
      <div className="hud-buttons">
        <button type="button" className="mini-btn">Som: ON</button>
        <button type="button" className="mini-btn">Narração: Legendas</button>
        <button type="button" className="mini-btn">Abrir Tela do Público</button>
      </div>
    </div>
  );
}

function BagPanel({
  avatar,
  selectedTools,
  slotProgress,
}: {
  avatar: { skin: number; hair: number; eyes: number; outfit: number; accessory: number };
  selectedTools: string[];
  slotProgress: Record<string, number>;
}) {
  const toolkitNames = selectedTools
    .map((id) => TOOLS.find((t) => t.id === id)?.label ?? id)
    .join(', ');
  const slotCount = DREAM_SLOTS.filter((s) => (slotProgress[s.id] ?? 0) >= 2).length;

  return (
    <aside className="panel bag">
      <h3>🎒 Mala de Ferramentas</h3>
      <ul>
        <li><strong>Avatar:</strong> skin {avatar.skin + 1}, cabelo {avatar.hair + 1}, olhos {avatar.eyes + 1}</li>
        <li><strong>Acessório:</strong> {ACCESSORIES[avatar.accessory]}</li>
        <li><strong>Ferramentas:</strong> {toolkitNames}</li>
        <li><strong>Módulo:</strong> {slotCount}/4 núcleos online</li>
        <li><strong>Combo Máx:</strong> x3</li>
      </ul>
      <div className={`module-status ${slotCount >= 3 ? 'ok' : ''}`}>
        {slotCount >= 3 ? 'Módulo dos Sonhos estabilizado.' : 'Módulo em recuperação.'}
      </div>
    </aside>
  );
}

function AttractScreen() {
  return (
    <section className="screen screen-attract">
      <div className="screen-bg bg-distopia" />
      <div className="content">
        <p className="pill">ESTAÇÃO HERÓI — MISSÃO ATIVA</p>
        <h2>O Módulo dos Sonhos precisa de você.</h2>
        <p>A estação está em colapso. Você é a última esperança para restaurar os sistemas e salvar o futuro da cidade.</p>
        <div className="button-row">
          <button className="btn primary">▶ INICIAR MISSÃO</button>
          <button className="btn ghost">📺 Tela do Público</button>
        </div>
      </div>
    </section>
  );
}

function IntroScreen() {
  return (
    <section className="screen screen-intro">
      <div className="screen-bg bg-distopia" />
      <div className="content">
        <h2>Bem-vindo à Estação Herói</h2>
        <p>A cidade perdeu a capacidade de sonhar. O Módulo dos Sonhos, coração da estação, foi danificado.</p>
        <p style={{ marginTop: 8 }}>Sua missão: montar seu avatar, escolher ferramentas e restaurar os núcleos do módulo antes que o tempo acabe.</p>
        <div className="button-row">
          <button className="btn primary">Continuar →</button>
        </div>
      </div>
    </section>
  );
}

function AvatarScreen({
  avatar,
  setAvatar,
}: {
  avatar: { skin: number; hair: number; eyes: number; outfit: number; accessory: number };
  setAvatar: React.Dispatch<React.SetStateAction<typeof avatar>>;
}) {
  return (
    <section className="screen screen-avatar">
      <div className="screen-bg bg-lab" />
      <div className="content">
        <h2>Monte seu Avatar</h2>
        <p>Personalize seu herói antes da missão.</p>
        <div className="avatar-layout">
          <div className="avatar-preview">
            <svg className="avatar-svg" viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg">
              <g className="avatar-bob">
                {/* Body */}
                <rect x="60" y="140" width="80" height="100" rx="16" fill={OUTFIT_COLORS[avatar.outfit]} />
                {/* Head */}
                <circle cx="100" cy="100" r="50" fill={SKIN_COLORS[avatar.skin]} />
                {/* Hair */}
                <ellipse cx="100" cy="68" rx="48" ry="28" fill={HAIR_COLORS[avatar.hair]} />
                {/* Eyes */}
                <g className="avatar-eye-group" style={{ transformOrigin: '50% 50%', animation: 'avatar-blink 4.4s infinite' }}>
                  <circle cx="82" cy="102" r="6" fill={EYE_COLORS[avatar.eyes]} />
                  <circle cx="118" cy="102" r="6" fill={EYE_COLORS[avatar.eyes]} />
                  <circle cx="84" cy="100" r="2" fill="white" />
                  <circle cx="120" cy="100" r="2" fill="white" />
                </g>
                {/* Smile */}
                <path d="M88 118 Q100 130 112 118" stroke={SKIN_COLORS[avatar.skin]} strokeWidth="2" fill="none"
                  style={{ filter: 'brightness(0.8)' }} />
                {/* Accessory indicator */}
                {avatar.accessory > 0 && (
                  <text x="100" y="52" textAnchor="middle" fontSize="14" fill="var(--secondary)">
                    {['', '⟐', '◈', '◆', '◉', '☀'][avatar.accessory]}
                  </text>
                )}
              </g>
            </svg>
          </div>
          <div className="avatar-controls">
            <Swatches label="Tom de pele" colors={SKIN_COLORS} selectedIndex={avatar.skin}
              onSelect={(i) => setAvatar((a) => ({ ...a, skin: i }))} />
            <Swatches label="Cabelo" colors={HAIR_COLORS} selectedIndex={avatar.hair}
              onSelect={(i) => setAvatar((a) => ({ ...a, hair: i }))} />
            <Swatches label="Olhos" colors={EYE_COLORS} selectedIndex={avatar.eyes}
              onSelect={(i) => setAvatar((a) => ({ ...a, eyes: i }))} />
            <Swatches label="Traje" colors={OUTFIT_COLORS} selectedIndex={avatar.outfit}
              onSelect={(i) => setAvatar((a) => ({ ...a, outfit: i }))} />
            <div className="group">
              <small>Acessório</small>
              <div className="pill-options">
                {ACCESSORIES.map((acc, i) => (
                  <button
                    key={acc}
                    type="button"
                    className={`pill-option ${avatar.accessory === i ? 'is-selected' : ''}`}
                    onClick={() => setAvatar((a) => ({ ...a, accessory: i }))}
                  >
                    {acc}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="button-row">
          <button className="btn ghost">← Voltar</button>
          <button className="btn primary">Confirmar Avatar →</button>
        </div>
      </div>
    </section>
  );
}

function ToolkitScreen({
  selectedTools,
  setSelectedTools,
}: {
  selectedTools: string[];
  setSelectedTools: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const toggleTool = (toolId: string) => {
    setSelectedTools((prev) => {
      if (prev.includes(toolId)) return prev.filter((t) => t !== toolId);
      if (prev.length >= 3) return prev;
      return [...prev, toolId];
    });
  };

  return (
    <section className="screen screen-toolkit">
      <div className="screen-bg bg-lab" />
      <div className="content">
        <h2>Escolha suas Ferramentas</h2>
        <p>Selecione 3 ferramentas para sua missão de restauração.</p>
        <div className="tool-grid">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              type="button"
              className={`tool-card ${selectedTools.includes(tool.id) ? 'is-selected' : ''}`}
              onClick={() => toggleTool(tool.id)}
            >
              <span className="icon">{tool.icon}</span>
              <strong>{tool.label}</strong>
              <p>{tool.summary}</p>
            </button>
          ))}
        </div>
        <p className="hint">Selecionadas: <strong>{selectedTools.length}/3</strong></p>
        <div className="button-row">
          <button className="btn ghost">← Voltar</button>
          <button className="btn primary" disabled={selectedTools.length !== 3}>Iniciar Reparo →</button>
        </div>
      </div>
    </section>
  );
}

function RepairScreen({
  selectedTools,
  armedTool,
  setArmedTool,
  slotProgress,
}: {
  selectedTools: string[];
  armedTool: string | null;
  setArmedTool: (t: string | null) => void;
  slotProgress: Record<string, number>;
}) {
  const tools = selectedTools.map((id) => TOOLS.find((t) => t.id === id)!).filter(Boolean);
  const completed = DREAM_SLOTS.filter((s) => (slotProgress[s.id] ?? 0) >= 2).length;

  return (
    <section className="screen screen-repair">
      <div className="screen-bg bg-lab" />
      <div className="content">
        <h2>Restaurar o Módulo dos Sonhos</h2>
        <p>Arme uma ferramenta e aplique nos núcleos para restaurá-los.</p>
        <div className="repair-tools">
          {tools.map((tool) => (
            <button
              key={tool.id}
              className={`tool-chip ${armedTool === tool.id ? 'is-armed' : ''}`}
              onClick={() => setArmedTool(armedTool === tool.id ? null : tool.id)}
            >
              <span>{tool.icon}</span>
              {tool.label}
            </button>
          ))}
        </div>
        <div className="repair-grid">
          {DREAM_SLOTS.map((slot) => {
            const progress = slotProgress[slot.id] ?? 0;
            const done = progress >= 2;
            return (
              <button key={slot.id} className={`slot ${done ? 'is-done' : ''}`}>
                <strong>{slot.label}</strong>
                <small>{done ? 'ONLINE' : `${progress}/2`}</small>
              </button>
            );
          })}
        </div>
        <p className="hint">Selecione uma ferramenta e aplique em um núcleo.</p>
        <p className="hint">Progresso: <strong>{completed}/4</strong></p>
        <p className="hint">Combo: <strong>x2</strong> | Melhor combo: <strong>x3</strong></p>
        <div className="button-row">
          <button className="btn ghost">← Voltar</button>
          <button className="btn primary" disabled={completed < 3}>Finalizar Missão →</button>
        </div>
      </div>
    </section>
  );
}

function ResultScreen({
  selectedTools,
  slotProgress,
}: {
  selectedTools: string[];
  slotProgress: Record<string, number>;
}) {
  const completed = DREAM_SLOTS.filter((s) => (slotProgress[s.id] ?? 0) >= 2).length;
  const toolNames = selectedTools.map((id) => TOOLS.find((t) => t.id === id)?.label ?? id).join(', ');

  return (
    <section className="screen screen-result">
      <div className="screen-bg bg-reborn" />
      <div className="content">
        <h2>🏆 Missão Completa — Herói Restaurador!</h2>
        <p>Você restaurou o Módulo dos Sonhos e devolveu esperança à cidade.</p>
        <div className="summary-grid">
          <article>
            <small>Ferramentas usadas</small>
            <strong>{toolNames}</strong>
          </article>
          <article>
            <small>Núcleos restaurados</small>
            <strong>{completed} / 4</strong>
          </article>
          <article>
            <small>Energia restante</small>
            <strong>72%</strong>
          </article>
          <article>
            <small>Combo máximo</small>
            <strong>x3</strong>
          </article>
          <article>
            <small>Selo de Herói</small>
            <strong>Restaurador Visionário</strong>
          </article>
        </div>
        <div className="button-row">
          <button className="btn ghost">🔄 Jogar Novamente</button>
          <button className="btn primary">📷 Registrar Memória</button>
        </div>
      </div>
    </section>
  );
}

function Swatches({
  label,
  colors,
  selectedIndex,
  onSelect,
}: {
  label: string;
  colors: string[];
  selectedIndex: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="group">
      <small>{label}</small>
      <div className="swatches">
        {colors.map((color, i) => (
          <button
            key={color}
            type="button"
            className={`swatch ${selectedIndex === i ? 'is-selected' : ''}`}
            style={{ background: color }}
            onClick={() => onSelect(i)}
            aria-label={`${label} ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
