import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Props {
  count?: number;
  colors?: string[];
}

export default function MagicSparks({
  count = 80,
  colors = ['#ffcc00', '#ea80fc', '#00e5ff', '#ff9e40', '#00e676'],
}: Props) {
  const sparks = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 55 + Math.random() * 45,
      size: 2 + Math.random() * 5,
      duration: 3 + Math.random() * 7,
      delay: Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      riseHeight: -(100 + Math.random() * 160),
      sway: -40 + Math.random() * 80,
      blur: Math.random() > 0.6 ? 1 : 0,
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
            boxShadow: `0 0 ${s.size * 5}px ${s.color}, 0 0 ${s.size * 12}px ${s.color}50`,
            filter: s.blur ? `blur(${s.blur}px)` : undefined,
            opacity: 0,
            willChange: 'transform, opacity',
          }}
          animate={{
            opacity: [0, 0.95, 0.75, 0],
            y: [0, s.riseHeight * 0.3, s.riseHeight],
            x: [0, s.sway * 0.5, s.sway],
            scale: [0.4, 1.3, 0.2],
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
