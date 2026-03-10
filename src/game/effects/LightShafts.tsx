import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Props {
  variant?: 'title' | 'triumph';
  intensity?: number;
}

export default function LightShafts({ variant = 'title', intensity = 1 }: Props) {
  const shafts = useMemo(() => {
    const count = variant === 'triumph' ? 8 : 5;
    return Array.from({ length: count }, (_, i) => {
      const isTriumph = variant === 'triumph';
      return {
        id: i,
        left: 10 + (i / count) * 80 + (Math.random() - 0.5) * 15,
        width: isTriumph ? 40 + Math.random() * 80 : 30 + Math.random() * 60,
        rotation: -15 + Math.random() * 30,
        duration: 6 + Math.random() * 8,
        delay: i * 0.8 + Math.random() * 2,
        opacity: isTriumph ? 0.12 + Math.random() * 0.1 : 0.06 + Math.random() * 0.08,
      };
    });
  }, [variant]);

  const goldColor = variant === 'triumph'
    ? 'rgba(255, 215, 0, VAR)'
    : 'rgba(240, 192, 64, VAR)';

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
            background: `linear-gradient(180deg, ${goldColor.replace('VAR', String(s.opacity * intensity))}, ${goldColor.replace('VAR', String(s.opacity * 0.3 * intensity))}, transparent 85%)`,
            transformOrigin: 'top center',
            transform: `rotate(${s.rotation}deg)`,
            filter: 'blur(8px)',
          }}
          animate={{
            opacity: [0.3, 1, 0.5, 1, 0.3],
            scaleX: [0.8, 1.2, 0.9, 1.1, 0.8],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Bloom glow at the top */}
      <motion.div
        className="absolute top-0 left-0 right-0"
        style={{
          height: '30%',
          background: variant === 'triumph'
            ? 'radial-gradient(ellipse 120% 60% at 50% 0%, rgba(255,215,0,0.15), rgba(179,136,255,0.05), transparent)'
            : 'radial-gradient(ellipse 100% 50% at 50% 0%, rgba(240,192,64,0.1), transparent)',
        }}
        animate={{ opacity: [0.5, 1, 0.7, 1, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}