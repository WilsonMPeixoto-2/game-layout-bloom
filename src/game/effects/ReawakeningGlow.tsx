import { motion } from 'framer-motion';

interface Props {
  progress: number; // 0-1
}

export default function ReawakeningGlow({ progress }: Props) {
  const p = Math.max(0, Math.min(1, progress));
  const warmth = p * 0.08;

  if (p < 0.1) return null;

  return (
    <div className="absolute inset-0 z-[4] pointer-events-none overflow-hidden">
      {/* Subtle warm overlay — no animation to prevent flicker */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 60%, rgba(255,200,80,${warmth}), transparent 70%)`,
          opacity: 0.8,
        }}
      />

      {/* Gentle bloom ring */}
      {p > 0.4 && (
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 300 + p * 300,
            height: 300 + p * 300,
            background: `radial-gradient(circle, rgba(240,192,64,${p * 0.06}) 0%, transparent 60%)`,
          }}
          animate={{ scale: [0.98, 1.02, 0.98] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </div>
  );
}
