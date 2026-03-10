import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Props {
  count?: number;
  color?: string;
  opacity?: number;
}

export default function FloatingDust({ count = 120, color = '#ffcc00', opacity = 0.4 }: Props) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1.5 + Math.random() * 4,
      duration: 14 + Math.random() * 22,
      delay: Math.random() * 12,
      driftX: -25 + Math.random() * 50,
      driftY: -35 + Math.random() * -25,
      blur: Math.random() > 0.7 ? 1 + Math.random() * 2 : 0,
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
            boxShadow: `0 0 ${p.size * 4}px ${color}, 0 0 ${p.size * 8}px ${color}40`,
            filter: p.blur ? `blur(${p.blur}px)` : undefined,
            opacity: 0,
            willChange: 'transform, opacity',
          }}
          animate={{
            opacity: [0, opacity, opacity * 0.7, 0],
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
