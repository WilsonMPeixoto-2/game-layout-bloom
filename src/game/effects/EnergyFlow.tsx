import { useMemo, memo } from 'react';

interface Props {
  count?: number;
  intensity?: number;
}

function EnergyFlow({ count = 60, intensity = 0.5 }: Props) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 18 + Math.random() * 35;
      const startX = 50 + Math.cos(angle) * radius;
      const startY = 50 + Math.sin(angle) * radius;
      const endX = 50 + Math.cos(angle + 0.6) * (radius * 0.25);
      const endY = 50 + Math.sin(angle + 0.6) * (radius * 0.25);
      const size = 1.5 + Math.random() * 4;
      const hue = 40 + Math.random() * 280;
      return {
        id: i, startX, startY, endX, endY, size, hue,
        duration: 2 + Math.random() * 5,
        delay: Math.random() * 6,
      };
    }),
  [count]);

  const activeCount = Math.floor(count * intensity);

  return (
    <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
      <style>{`
        @keyframes energy-pulse {
          0%, 100% { transform: translate(-50%,-50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%,-50%) scale(1.25); opacity: 0.9; }
        }
        @keyframes energy-flow {
          0% { opacity: 0; transform: translate(0,0) scale(0.4); }
          30% { opacity: var(--ef-peak); }
          100% { opacity: 0; transform: translate(var(--ef-dx), var(--ef-dy)) scale(0); }
        }
      `}</style>

      <div
        className="absolute left-1/2 top-1/2 rounded-full"
        style={{
          width: 300, height: 300,
          transform: 'translate(-50%,-50%)',
          background: `radial-gradient(circle, rgba(255,204,0,${0.1 * intensity}) 0%, rgba(234,128,252,${0.04 * intensity}) 40%, transparent 70%)`,
          animation: 'energy-pulse 4s ease-in-out infinite',
        }}
      />

      {particles.slice(0, activeCount).map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.startX}%`,
            top: `${p.startY}%`,
            width: p.size,
            height: p.size,
            background: `hsl(${p.hue}, 85%, 72%)`,
            boxShadow: `0 0 ${p.size * 7}px hsl(${p.hue}, 85%, 62%)`,
            ['--ef-dx' as string]: `${p.endX - p.startX}vw`,
            ['--ef-dy' as string]: `${p.endY - p.startY}vh`,
            ['--ef-peak' as string]: 0.85 * intensity,
            animation: `energy-flow ${p.duration}s ${p.delay}s ease-in-out infinite`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export default memo(EnergyFlow);
