import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Props {
  count?: number;
}

export default function TriumphBurst({ count = 150 }: Props) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
      const speed = 80 + Math.random() * 200;
      const colors = ['#ffd700', '#f0c040', '#b388ff', '#69f0ae', '#4dd9e8', '#ffab76'];
      return {
        id: i,
        endX: Math.cos(angle) * speed,
        endY: Math.sin(angle) * speed - 40,
        size: 2 + Math.random() * 5,
        duration: 2.5 + Math.random() * 3,
        delay: Math.random() * 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 720,
      };
    }),
  [count]);

  return (
    <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
      {/* Central radial glow */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,215,0,0.15) 0%, rgba(179,136,255,0.05) 40%, transparent 70%)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 2, 1.5], opacity: [0, 0.8, 0.3] }}
        transition={{ duration: 2, ease: 'easeOut' }}
      />
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute left-1/2 top-1/2"
          style={{
            width: p.size,
            height: p.size,
            borderRadius: p.size > 3 ? '2px' : '50%',
            background: p.color,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
          }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
          animate={{
            x: p.endX,
            y: p.endY,
            opacity: [0, 1, 0.8, 0],
            scale: [0, 1.5, 1, 0],
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
