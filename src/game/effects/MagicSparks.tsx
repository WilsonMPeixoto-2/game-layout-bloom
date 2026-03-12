import { useMemo, memo } from 'react';

interface Props {
  count?: number;
  colors?: string[];
}

function MagicSparks({
  count = 140,
  colors = ['#ffcc00', '#ea80fc', '#00e5ff', '#ff9e40', '#00e676', '#d500f9'],
}: Props) {
  const sparks = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 40 + Math.random() * 60,
      size: 2.5 + Math.random() * 7,
      duration: 2.5 + Math.random() * 6,
      delay: Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      riseHeight: -(120 + Math.random() * 220),
      sway: -60 + Math.random() * 120,
    })),
  [count, colors]);

  return (
    <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
      <style>{`
        @keyframes spark-rise {
          0% { opacity: 0; transform: translate(0, 0) scale(0.4); }
          20% { opacity: 1; transform: translate(calc(var(--spark-sway) * 0.3), calc(var(--spark-rise) * 0.3)) scale(1.5); }
          80% { opacity: 0.8; }
          100% { opacity: 0; transform: translate(var(--spark-sway), var(--spark-rise)) scale(0.2); }
        }
      `}</style>
      {sparks.map((s) => (
        <div
          key={s.id}
          className="absolute"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: s.color,
            boxShadow: `0 0 ${s.size * 6}px ${s.color}, 0 0 ${s.size * 16}px ${s.color}70`,
            ['--spark-rise' as string]: `${s.riseHeight}px`,
            ['--spark-sway' as string]: `${s.sway}px`,
            animation: `spark-rise ${s.duration}s ${s.delay}s ease-out infinite`,
            willChange: 'transform, opacity',
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export default memo(MagicSparks);
