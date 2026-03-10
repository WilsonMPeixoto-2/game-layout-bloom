import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Props {
  count?: number;
  colors?: string[];
}

export default function MagicSparks({
  count = 50,
  colors = ['#f0c040', '#b388ff', '#4dd9e8', '#ffab76'],
}: Props) {
  const sparks = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 60 + Math.random() * 40,
      size: 2 + Math.random() * 4,
      duration: 3 + Math.random() * 6,
      delay: Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      riseHeight: -(80 + Math.random() * 120),
      sway: -30 + Math.random() * 60,
    })),
  [count, colors]);

  return (
    <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
      {sparks.map((s) => (
        <motion.div
          key={s.id}
          className="absolute"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: s.color,
            boxShadow: `0 0 ${s.size * 4}px ${s.color}, 0 0 ${s.size * 8}px ${s.color}40`,
            opacity: 0,
          }}
          animate={{
            opacity: [0, 0.9, 0.7, 0],
            y: [0, s.riseHeight * 0.3, s.riseHeight],
            x: [0, s.sway * 0.5, s.sway],
            scale: [0.5, 1.2, 0.3],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}
