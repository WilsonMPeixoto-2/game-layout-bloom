import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Props {
  count?: number;
  intensity?: number;
}

export default function EnergyFlow({ count = 180, intensity = 0.5 }: Props) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 18 + Math.random() * 35;
      return {
        id: i,
        startX: 50 + Math.cos(angle) * radius,
        startY: 50 + Math.sin(angle) * radius,
        endX: 50 + Math.cos(angle + 0.6) * (radius * 0.25),
        endY: 50 + Math.sin(angle + 0.6) * (radius * 0.25),
        size: 1.5 + Math.random() * 4,
        duration: 2 + Math.random() * 5,
        delay: Math.random() * 6,
        hue: 40 + Math.random() * 280,
      };
    }),
  [count]);

  const activeCount = Math.floor(count * intensity);

  return (
    <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
      {/* Central glow — bigger and brighter for OLED */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 300,
          height: 300,
          background: `radial-gradient(circle, rgba(255,204,0,${0.1 * intensity}) 0%, rgba(234,128,252,${0.04 * intensity}) 40%, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.5, 0.9, 0.5],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      {particles.slice(0, activeCount).map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.startX}%`,
            top: `${p.startY}%`,
            width: p.size,
            height: p.size,
            background: `hsl(${p.hue}, 85%, 72%)`,
            boxShadow: `0 0 ${p.size * 7}px hsl(${p.hue}, 85%, 62%), 0 0 ${p.size * 14}px hsl(${p.hue}, 85%, 62%)30`,
            opacity: 0,
            willChange: 'transform, opacity',
          }}
          animate={{
            opacity: [0, 0.85 * intensity, 0],
            left: [`${p.startX}%`, `${p.endX}%`],
            top: [`${p.startY}%`, `${p.endY}%`],
            scale: [0.4, 1.6, 0],
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
