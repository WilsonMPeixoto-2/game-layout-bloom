import { useMemo, memo } from 'react';

interface Props {
  count?: number;
  color?: string;
  opacity?: number;
}

function FloatingDust({ count = 200, color = '#ffcc00', opacity = 0.6 }: Props) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = 2 + Math.random() * 6;
      const duration = 10 + Math.random() * 18;
      const delay = Math.random() * 10;
      const driftX = -35 + Math.random() * 70;
      const driftY = -45 + Math.random() * -20;
      const blur = Math.random() > 0.5 ? 1 + Math.random() * 3 : 0;

      return { id: i, x, y, size, duration, delay, driftX, driftY, blur };
    }),
  [count]);

  return (
    <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
      <style>{`
        @keyframes dust-float {
          0% { opacity: 0; transform: translate(0, 0); }
          25% { opacity: var(--dust-opacity); }
          75% { opacity: calc(var(--dust-opacity) * 0.7); }
          100% { opacity: 0; transform: translate(var(--dust-dx), var(--dust-dy)); }
        }
      `}</style>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: color,
            boxShadow: `0 0 ${p.size * 6}px ${color}, 0 0 ${p.size * 14}px ${color}60`,
            filter: p.blur ? `blur(${p.blur}px)` : undefined,
            ['--dust-opacity' as string]: opacity,
            ['--dust-dx' as string]: `${p.driftX}px`,
            ['--dust-dy' as string]: `${p.driftY}px`,
            animation: `dust-float ${p.duration}s ${p.delay}s ease-in-out infinite`,
            willChange: 'transform, opacity',
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export default memo(FloatingDust);
