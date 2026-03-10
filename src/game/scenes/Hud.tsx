interface Props {
  time: number;
  energy: number;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

export default function Hud({ time, energy }: Props) {
  return (
    <div className="hud-overlay">
      <span className="hud-title">Herói do Futuro</span>
      <div className="hud-stats">
        <div className="hud-stat">
          <span className="hud-stat-label">Tempo</span>
          <span className="hud-stat-value">{formatTime(time)}</span>
        </div>
        <div className="hud-stat">
          <span className="hud-stat-label">Energia</span>
          <span className="hud-stat-value">{energy}%</span>
          <div className="hud-energy-bar"><div className="hud-energy-fill" style={{ width: `${energy}%` }} /></div>
        </div>
      </div>
    </div>
  );
}
