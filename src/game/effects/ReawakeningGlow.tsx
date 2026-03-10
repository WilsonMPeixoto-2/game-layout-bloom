import { motion } from 'framer-motion';

interface Props {
  progress: number; // 0-1, how far through restoration
}

export default function ReawakeningGlow({ progress }: Props) {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const glowOpacity = 0.05 + clampedProgress * 0.2;
  const saturation = 0.6 + clampedProgress * 0.4;
  const warmth = clampedProgress * 0.15;

  return (
    <div className="absolute inset-0 z-[4] pointer-events-none overflow-hidden">
      {/* Progressive warm overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 60%, rgba(255,200,80,${warmth}), rgba(179,136,255,${warmth * 0.4}), transparent 70%)`,
        }}
        animate={{
          opacity: [0.7, 1, 0.8, 1, 0.7],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Bloom ring that grows with progress */}
      {clampedProgress > 0.3 && (
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 300 + clampedProgress * 400,
            height: 300 + clampedProgress * 400,
            background: `radial-gradient(circle, rgba(240,192,64,${glowOpacity}) 0%, rgba(105,240,174,${glowOpacity * 0.3}) 40%, transparent 70%)`,
          }}
          animate={{
            scale: [0.95, 1.05, 0.95],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Color saturation filter overlay */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: `saturate(${saturation * 100}%)`,
          WebkitBackdropFilter: `saturate(${saturation * 100}%)`,
        }}
      />
    </div>
  );
}