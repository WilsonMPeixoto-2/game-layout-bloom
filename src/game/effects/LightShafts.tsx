import { useMemo, memo } from 'react';

interface Props {
  variant?: 'title' | 'triumph';
  intensity?: number;
}

function LightShafts({ variant = 'title', intensity = 1 }: Props) {
  const shafts = useMemo(() => {
    const count = variant === 'triumph' ? 7 : 4;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: 10 + (i / count) * 80,
      width: 50 + i * 25,
      rotation: -12 + i * 7,
      duration: 9 + i * 3,
      delay: i * 1.2,
      opacity: variant === 'triumph' ? 0.08 : 0.05,
    }));
  }, [variant]);

  return (
    <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
      <style>{`
        @keyframes light-shaft {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.85; }
        }
      `}</style>

      {shafts.map((s) => (
        <div
          key={s.id}
          className="absolute top-0"
          style={{
            left: `${s.left}%`,
            width: s.width,
            height: '130%',
            background: `linear-gradient(180deg, rgba(255,204,0,${s.opacity * intensity}), rgba(234,128,252,${s.opacity * intensity * 0.3}) 50%, transparent 85%)`,
            transformOrigin: 'top center',
            transform: `rotate(${s.rotation}deg)`,
            filter: 'blur(14px)',
            animation: `light-shaft ${s.duration}s ${s.delay}s ease-in-out infinite`,
          }}
        />
      ))}

      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: '30%',
          background: `radial-gradient(ellipse 120% 60% at 50% 0%, rgba(255,204,0,${0.08 * intensity}), rgba(234,128,252,${0.03 * intensity}) 50%, transparent)`,
        }}
      />
    </div>
  );
}

export default memo(LightShafts);
