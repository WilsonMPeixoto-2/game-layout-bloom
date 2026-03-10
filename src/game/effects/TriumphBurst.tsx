import { useMemo, memo } from 'react';

interface Props {
  count?: number;
}

function TriumphBurst({ count = 80 }: Props) {
  const particles = useMemo(() => {
    const colors = ['#ffcc00', '#ffe566', '#ea80fc', '#00e676', '#00e5ff', '#ff9e40', '#d500f9'];
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
      const speed = 100 + Math.random() * 280;
      return {
        id: i,
        endX: Math.cos(angle) * speed,
        endY: Math.sin(angle) * speed - 50,
        size: 2 + Math.random() * 6,
        duration: 2.5 + Math.random() * 4,
        delay: Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 900,
      };
    });
  }, [count]);

  return (
    <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
      <style>{`
        @keyframes triumph-glow {
          0% { transform: translate(-50%,-50%) scale(0); opacity: 0; }
          40% { transform: translate(-50%,-50%) scale(2.5); opacity: 0.9; }
          100% { transform: translate(-50%,-50%) scale(1.8); opacity: 0.35; }
        }
        @keyframes triumph-burst {
          0% { opacity: 0; transform: translate(0,0) scale(0) rotate(0deg); }
          25% { opacity: 1; }
          75% { opacity: 0.85; }
          100% { opacity: 0; transform: translate(var(--tb-x), var(--tb-y)) scale(0) rotate(var(--tb-rot)); }
        }
      `}</style>

      <div
        className="absolute left-1/2 top-1/2 rounded-full"
        style={{
          width: 500, height: 500,
          transform: 'translate(-50%,-50%) scale(0)',
          background: 'radial-gradient(circle, rgba(255,204,0,0.2) 0%, rgba(234,128,252,0.08) 35%, transparent 70%)',
          animation: 'triumph-glow 2.5s ease-out forwards',
        }}
      />

      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute left-1/2 top-1/2"
          style={{
            width: p.size,
            height: p.size,
            borderRadius: p.size > 3.5 ? '2px' : '50%',
            background: p.color,
            boxShadow: `0 0 ${p.size * 5}px ${p.color}`,
            ['--tb-x' as string]: `${p.endX}px`,
            ['--tb-y' as string]: `${p.endY}px`,
            ['--tb-rot' as string]: `${p.rotation}deg`,
            animation: `triumph-burst ${p.duration}s ${p.delay}s ease-out forwards`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export default memo(TriumphBurst);
