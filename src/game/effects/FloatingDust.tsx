import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Props {
  count?: number;
  color?: string;
  opacity?: number;
}

export default function FloatingDust({ count = 80, color = '#f0c040', opacity = 0.35 }: Props) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1.5 + Math.random() * 3,
      duration: 12 + Math.random() * 18,
      delay: Math.random() * 10,
      driftX: -20 + Math.random() * 40,
      driftY: -30 + Math.random() * -20,
    })),
  [count]);

  return (
    <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: color,
            boxShadow: `0 0 ${p.size * 3}px ${color}`,
            opacity: 0,
          }}
          animate={{
            opacity: [0, opacity, opacity * 0.6, 0],
            x: [0, p.driftX * 0.5, p.driftX],
            y: [0, p.driftY * 0.5, p.driftY],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
