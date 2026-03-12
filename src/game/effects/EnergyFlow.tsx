import { useMemo, memo } from 'react';

interface Props {
  count?: number;
  intensity?: number;
}

function EnergyFlow({ count = 100, intensity = 0.7 }: Props) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 15 + Math.random() * 40;
      const startX = 50 + Math.cos(angle) * radius;
      const startY = 50 + Math.sin(angle) * radius;
      const endX = 50 + Math.cos(angle + 0.6) * (radius * 0.2);
      const endY = 50 + Math.sin(angle + 0.6) * (radius * 0.2);
      const size = 2 + Math.random() * 6;
      const hue = 30 + Math.random() * 300;
      return {
        id: i, startX, startY, endX, endY, size, hue,
        duration: 1.8 + Math.random() * 4.5,
        delay: Math.random() * 5,
      };
    }),
  [count]);

  const activeCount = Math.floor(count * intensity);

  return (
    <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
      <style>{`
        @keyframes energy-pulse {
          0%, 100% { transform: translate(-50%,-50%) scale(1); opacity: 0.6; }
          50% { transform: translate(-50%,-50%) scale(1.4); opacity: 1; }
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
          width: 400, height: 400,
          transform: 'translate(-50%,-50%)',
          background: `radial-gradient(circle, rgba(255,204,0,${0.15 * intensity}) 0%, rgba(234,128,252,${0.07 * intensity}) 40%, transparent 70%)`,
          animation: 'energy-pulse 3.5s ease-in-out infinite',
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
            background: `hsl(${p.hue}, 90%, 70%)`,
            boxShadow: `0 0 ${p.size * 8}px hsl(${p.hue}, 90%, 60%), 0 0 ${p.size * 16}px hsl(${p.hue}, 80%, 50%, 0.3)`,
            ['--ef-dx' as string]: `${p.endX - p.startX}vw`,
            ['--ef-dy' as string]: `${p.endY - p.startY}vh`,
            ['--ef-peak' as string]: 0.95 * intensity,
            animation: `energy-flow ${p.duration}s ${p.delay}s ease-in-out infinite`,
            willChange: 'transform, opacity',
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export default memo(EnergyFlow);
