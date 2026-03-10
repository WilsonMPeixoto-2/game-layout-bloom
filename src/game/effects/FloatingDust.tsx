import { useMemo, memo } from 'react';

interface Props {
  count?: number;
  color?: string;
  opacity?: number;
}

/**
 * FloatingDust — uses pure CSS animations instead of framer-motion
 * to prevent flickering on parent remounts.
 */
function FloatingDust({ count = 120, color = '#ffcc00', opacity = 0.4 }: Props) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = 1.5 + Math.random() * 4;
      const duration = 14 + Math.random() * 22;
      const delay = Math.random() * 12;
      const driftX = -25 + Math.random() * 50;
      const driftY = -35 + Math.random() * -25;
      const blur = Math.random() > 0.7 ? 1 + Math.random() * 2 : 0;

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
            boxShadow: `0 0 ${p.size * 4}px ${color}, 0 0 ${p.size * 8}px ${color}40`,
            filter: p.blur ? `blur(${p.blur}px)` : undefined,
            ['--dust-opacity' as string]: opacity,
            ['--dust-dx' as string]: `${p.driftX}px`,
            ['--dust-dy' as string]: `${p.driftY}px`,
            animation: `dust-float ${p.duration}s ${p.delay}s ease-in-out infinite`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export default memo(FloatingDust);
