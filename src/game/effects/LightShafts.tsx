import { useMemo, memo } from 'react';

interface Props {
  variant?: 'title' | 'triumph';
  intensity?: number;
}

function LightShafts({ variant = 'title', intensity = 1 }: Props) {
  const shafts = useMemo(() => {
    const count = variant === 'triumph' ? 10 : 6;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: 5 + (i / count) * 90,
      width: 60 + i * 30,
      rotation: -15 + i * 6,
      duration: 7 + i * 2.5,
      delay: i * 0.8,
      opacity: variant === 'triumph' ? 0.14 : 0.09,
    }));
  }, [variant]);

  return (
    <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
      <style>{`
        @keyframes light-shaft {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>

      {shafts.map((s) => (
        <div
          key={s.id}
          className="absolute top-0"
          style={{
            left: `${s.left}%`,
            width: s.width,
            height: '140%',
            background: `linear-gradient(180deg, rgba(255,204,0,${s.opacity * intensity}), rgba(234,128,252,${s.opacity * intensity * 0.4}) 45%, transparent 85%)`,
            transformOrigin: 'top center',
            transform: `rotate(${s.rotation}deg)`,
            filter: 'blur(12px)',
            animation: `light-shaft ${s.duration}s ${s.delay}s ease-in-out infinite`,
            willChange: 'opacity',
          }}
        />
      ))}

      {/* Ambient top glow */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: '35%',
          background: `radial-gradient(ellipse 130% 70% at 50% 0%, rgba(255,204,0,${0.14 * intensity}), rgba(234,128,252,${0.06 * intensity}) 50%, transparent)`,
        }}
      />

      {/* Secondary bottom glow for triumph */}
      {variant === 'triumph' && (
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: '25%',
            background: `radial-gradient(ellipse 100% 80% at 50% 100%, rgba(0,229,255,${0.06 * intensity}), transparent)`,
          }}
        />
      )}
    </div>
  );
}

export default memo(LightShafts);
