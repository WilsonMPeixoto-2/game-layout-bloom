import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAudioEngine } from '../audio/AudioEngine';

interface BubblePair {
  id: string;
  left: string;
  right: string;
  color: string;
}

const BUBBLE_PAIRS: BubblePair[] = [
  { id: 'a', left: '🎧 Ouvir', right: '❤️ Compreender', color: 'var(--hk-gold)' },
  { id: 'b', left: '🤝 Cooperar', right: '🌉 Conectar', color: 'var(--hk-cyan)' },
  { id: 'c', left: '✨ Imaginar', right: '🎨 Criar', color: 'var(--hk-magic)' },
  { id: 'd', left: '💙 Sentir', right: '🛡️ Proteger', color: 'var(--hk-warmth)' },
];

const TOTAL_TIME = 30; // seconds

interface Props {
  onComplete: (score: number) => void;
}

export default function BubbleConnectGame({ onComplete }: Props) {
  const [shuffledRight, setShuffledRight] = useState<BubblePair[]>([]);
  const [connections, setConnections] = useState<Map<string, string>>(new Map());
  const [activeBubble, setActiveBubble] = useState<string | null>(null);
  const [correctPairs, setCorrectPairs] = useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'complete'>('intro');
  const [score, setScore] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  // Shuffle right column on mount
  useEffect(() => {
    const shuffled = [...BUBBLE_PAIRS].sort(() => Math.random() - 0.5);
    setShuffledRight(shuffled);
  }, []);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setGameState('complete');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [gameState]);

  // Check win
  useEffect(() => {
    if (correctPairs.size === BUBBLE_PAIRS.length && gameState === 'playing') {
      clearInterval(timerRef.current);
      const finalScore = Math.round((timeLeft / TOTAL_TIME) * 100);
      setScore(finalScore);
      try { getAudioEngine().playSfx('triumph'); } catch {}
      setTimeout(() => setGameState('complete'), 600);
    }
  }, [correctPairs.size, gameState, timeLeft]);

  const handleLeftTap = useCallback((pairId: string) => {
    if (gameState !== 'playing' || correctPairs.has(pairId)) return;
    try { getAudioEngine().playSfx('select'); } catch {}
    setActiveBubble(prev => prev === pairId ? null : pairId);
  }, [gameState, correctPairs]);

  const handleRightTap = useCallback((pairId: string) => {
    if (gameState !== 'playing' || !activeBubble) return;
    
    if (activeBubble === pairId) {
      // Correct match!
      try { getAudioEngine().playSfx('success'); } catch {}
      setCorrectPairs(prev => new Set([...prev, pairId]));
      setConnections(prev => new Map([...prev, [activeBubble, pairId]]));
      setActiveBubble(null);
    } else {
      // Wrong match
      try { getAudioEngine().playSfx('error'); } catch {}
      setWrongPair(pairId);
      setTimeout(() => setWrongPair(null), 500);
      setActiveBubble(null);
    }
  }, [gameState, activeBubble]);

  const startGame = useCallback(() => {
    try { getAudioEngine().playSfx('confirm'); } catch {}
    setGameState('playing');
  }, []);

  const handleFinish = useCallback(() => {
    const finalScore = correctPairs.size === BUBBLE_PAIRS.length
      ? Math.round((timeLeft / TOTAL_TIME) * 100)
      : Math.round((correctPairs.size / BUBBLE_PAIRS.length) * 50);
    try { getAudioEngine().playSfx('confirm'); } catch {}
    onComplete(finalScore);
  }, [correctPairs.size, timeLeft, onComplete]);

  const timerPercent = (timeLeft / TOTAL_TIME) * 100;
  const timerColor = timeLeft > 15 ? 'var(--hk-success)' : timeLeft > 7 ? 'var(--hk-gold)' : 'var(--hk-danger)';

  if (gameState === 'intro') {
    return (
      <div className="minigame-overlay">
        <motion.div
          className="minigame-intro"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
        >
          <div className="minigame-intro-icon">🔮</div>
          <h2 className="minigame-intro-title">Desafio: Conectar Ideias</h2>
          <p className="minigame-intro-desc">
            Ligue cada ação ao seu resultado!
            <br />Toque na esquerda, depois na direita.
          </p>
          <motion.button
            className="btn-hero primary"
            onClick={startGame}
            whileTap={{ scale: 0.95 }}
          >
            Começar!
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'complete') {
    const allCorrect = correctPairs.size === BUBBLE_PAIRS.length;
    return (
      <div className="minigame-overlay">
        <motion.div
          className="minigame-result"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
        >
          <div className="minigame-result-icon">{allCorrect ? '🌟' : '⭐'}</div>
          <h2 className="minigame-intro-title">
            {allCorrect ? 'Perfeito!' : 'Bom trabalho!'}
          </h2>
          <p className="minigame-intro-desc">
            {allCorrect
              ? `Você conectou tudo em ${TOTAL_TIME - timeLeft}s!`
              : `Você conectou ${correctPairs.size} de ${BUBBLE_PAIRS.length} pares.`}
          </p>
          <div className="minigame-score-display">
            <span className="minigame-score-label">Pontuação</span>
            <span className="minigame-score-value">
              {allCorrect ? Math.round((timeLeft / TOTAL_TIME) * 100) : Math.round((correctPairs.size / BUBBLE_PAIRS.length) * 50)}
            </span>
          </div>
          <motion.button
            className="btn-hero primary"
            onClick={handleFinish}
            whileTap={{ scale: 0.95 }}
          >
            Continuar Jornada →
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="minigame-overlay" ref={containerRef}>
      <div className="minigame-play-area">
        {/* Timer bar */}
        <div className="minigame-timer-container">
          <div className="minigame-timer-bar">
            <motion.div
              className="minigame-timer-fill"
              style={{ backgroundColor: timerColor }}
              animate={{ width: `${timerPercent}%` }}
              transition={{ duration: 0.5, ease: 'linear' }}
            />
          </div>
          <span className="minigame-timer-text" style={{ color: timerColor }}>{timeLeft}s</span>
        </div>

        {/* Score indicator */}
        <div className="minigame-match-count">
          {Array.from({ length: BUBBLE_PAIRS.length }).map((_, i) => (
            <motion.div
              key={i}
              className="minigame-match-dot"
              style={{
                background: i < correctPairs.size ? 'var(--hk-success)' : 'rgba(255,255,255,0.15)',
                boxShadow: i < correctPairs.size ? '0 0 12px rgba(105, 240, 174, 0.5)' : 'none',
              }}
              animate={i < correctPairs.size ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {/* Bubble columns */}
        <div className="minigame-columns">
          {/* Left column */}
          <div className="minigame-column">
            {BUBBLE_PAIRS.map(pair => {
              const isCorrect = correctPairs.has(pair.id);
              const isActive = activeBubble === pair.id;
              return (
                <motion.button
                  key={pair.id}
                  className={`minigame-bubble minigame-bubble-left ${isActive ? 'active' : ''} ${isCorrect ? 'correct' : ''}`}
                  style={{
                    borderColor: isCorrect ? 'var(--hk-success)' : isActive ? pair.color : undefined,
                    boxShadow: isActive ? `0 0 20px ${pair.color}40` : isCorrect ? '0 0 15px rgba(105,240,174,0.3)' : undefined,
                  }}
                  onClick={() => handleLeftTap(pair.id)}
                  whileTap={{ scale: 0.95 }}
                  disabled={isCorrect}
                  layout
                >
                  <span className="minigame-bubble-text">{pair.left}</span>
                  {isCorrect && <span className="minigame-bubble-check">✓</span>}
                </motion.button>
              );
            })}
          </div>

          {/* Connection indicator */}
          <div className="minigame-connector">
            <AnimatePresence>
              {activeBubble && (
                <motion.div
                  className="minigame-connector-line"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  exit={{ opacity: 0, scaleY: 0 }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Right column */}
          <div className="minigame-column">
            {shuffledRight.map(pair => {
              const isCorrect = correctPairs.has(pair.id);
              const isWrong = wrongPair === pair.id;
              return (
                <motion.button
                  key={pair.id}
                  className={`minigame-bubble minigame-bubble-right ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
                  style={{
                    borderColor: isCorrect ? 'var(--hk-success)' : isWrong ? 'var(--hk-danger)' : undefined,
                    boxShadow: isCorrect ? '0 0 15px rgba(105,240,174,0.3)' : isWrong ? '0 0 15px rgba(255,107,138,0.4)' : undefined,
                  }}
                  onClick={() => handleRightTap(pair.id)}
                  whileTap={{ scale: 0.95 }}
                  disabled={isCorrect}
                  animate={isWrong ? { x: [0, -8, 8, -4, 4, 0] } : {}}
                  transition={isWrong ? { duration: 0.4 } : {}}
                  layout
                >
                  <span className="minigame-bubble-text">{pair.right}</span>
                  {isCorrect && <span className="minigame-bubble-check">✓</span>}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Hint */}
        <p className="minigame-hint">
          {activeBubble ? '👉 Agora toque no par correto!' : '👈 Toque numa ação para começar'}
        </p>
      </div>
    </div>
  );
}
