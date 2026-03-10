import { motion } from 'framer-motion';

interface Props {
  progress: number; // 0-1
}

export default function ReawakeningGlow({ progress }: Props) {
  const p = Math.max(0, Math.min(1, progress));
  const warmth = p * 0.1;

  if (p < 0.1) return null;

  return (
    <div className="absolute inset-0 z-[4] pointer-events-none overflow-hidden">
      {/* Warm radial overlay — OLED optimized with deeper contrast */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 90% at 50% 60%, rgba(255,200,60,${warmth}), rgba(234,128,252,${warmth * 0.3}), transparent 75%)`,
          opacity: 0.85,
        }}
      />

      {/* Golden bloom ring */}
      {p > 0.3 && (
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 350 + p * 400,
            height: 350 + p * 400,
            background: `radial-gradient(circle, rgba(255,204,0,${p * 0.08}) 0%, rgba(234,128,252,${p * 0.03}) 40%, transparent 65%)`,
          }}
          animate={{ scale: [0.97, 1.03, 0.97] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Subtle outer aura at high progress */}
      {p > 0.7 && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 40%, rgba(0,229,255,${(p - 0.7) * 0.06}), transparent 50%)`,
          }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </div>
  );
}
