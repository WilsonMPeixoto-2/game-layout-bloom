import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Props {
  count?: number;
}

export default function TriumphBurst({ count = 250 }: Props) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
      const speed = 100 + Math.random() * 280;
      const colors = ['#ffcc00', '#ffe566', '#ea80fc', '#00e676', '#00e5ff', '#ff9e40', '#d500f9'];
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
    }),
  [count]);

  return (
    <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
      {/* Central radial glow — intensified for OLED deep blacks */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,204,0,0.2) 0%, rgba(234,128,252,0.08) 35%, rgba(0,229,255,0.03) 55%, transparent 70%)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 2.5, 1.8], opacity: [0, 0.9, 0.35] }}
        transition={{ duration: 2.5, ease: 'easeOut' }}
      />
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute left-1/2 top-1/2"
          style={{
            width: p.size,
            height: p.size,
            borderRadius: p.size > 3.5 ? '2px' : '50%',
            background: p.color,
            boxShadow: `0 0 ${p.size * 5}px ${p.color}, 0 0 ${p.size * 12}px ${p.color}40`,
            willChange: 'transform, opacity',
          }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
          animate={{
            x: p.endX,
            y: p.endY,
            opacity: [0, 1, 0.85, 0],
            scale: [0, 1.6, 1, 0],
            rotate: p.rotation,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}
