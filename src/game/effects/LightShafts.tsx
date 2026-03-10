import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Props {
  variant?: 'title' | 'triumph';
  intensity?: number;
}

export default function LightShafts({ variant = 'title', intensity = 1 }: Props) {
  const shafts = useMemo(() => {
    const count = variant === 'triumph' ? 5 : 3;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: 15 + (i / count) * 70,
      width: 40 + i * 20,
      rotation: -10 + i * 8,
      duration: 8 + i * 3,
      delay: i * 1.5,
      opacity: variant === 'triumph' ? 0.06 : 0.04,
    }));
  }, [variant]);

  return (
    <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
      {shafts.map((s) => (
        <motion.div
          key={s.id}
          className="absolute top-0"
          style={{
            left: `${s.left}%`,
            width: s.width,
            height: '120%',
            background: `linear-gradient(180deg, rgba(255,215,0,${s.opacity * intensity}), transparent 80%)`,
            transformOrigin: 'top center',
            transform: `rotate(${s.rotation}deg)`,
            filter: 'blur(12px)',
          }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Top glow */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: '25%',
          background: `radial-gradient(ellipse 100% 50% at 50% 0%, rgba(255,215,0,${0.06 * intensity}), transparent)`,
        }}
      />
    </div>
  );
}
