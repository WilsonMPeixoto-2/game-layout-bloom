import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAudioEngine } from '../audio/AudioEngine';

// Color puzzle: player must recreate a pattern by tapping colors in order
const COLORS = [
  { id: 'red', hex: '#ff6b8a', label: '🔴' },
  { id: 'gold', hex: '#ffd54f', label: '🟡' },
  { id: 'blue', hex: '#4dd9e8', label: '🔵' },
  { id: 'purple', hex: '#ce93d8', label: '🟣' },
  { id: 'green', hex: '#69f0ae', label: '🟢' },
];

function generatePattern(round: number): number[] {
  const len = Math.min(3 + round, 7);
  return Array.from({ length: len }, () => Math.floor(Math.random() * COLORS.length));
}

const TOTAL_ROUNDS = 4;

interface Props {
  onComplete: (score: number) => void;
}

export default function ColorPuzzleGame({ onComplete }: Props) {
  const [gameState, setGameState] = useState<'intro' | 'showing' | 'input' | 'feedback' | 'complete'>('intro');
  const [round, setRound] = useState(0);
  const [pattern, setPattern] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [showingIndex, setShowingIndex] = useState(-1);
  const [correctRounds, setCorrectRounds] = useState(0);
  const [lastCorrect, setLastCorrect] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const startRound = useCallback((r: number) => {
    const newPattern = generatePattern(r);
    setPattern(newPattern);
    setPlayerInput([]);
    setShowingIndex(0);
    setGameState('showing');

    // Show pattern sequentially
    let i = 0;
    const show = () => {
      setShowingIndex(i);
      try { getAudioEngine().playSfx('select'); } catch {}
      i++;
      if (i < newPattern.length) {
        timerRef.current = setTimeout(show, 600);
      } else {
        timerRef.current = setTimeout(() => {
          setShowingIndex(-1);
          setGameState('input');
        }, 700);
      }
    };
    timerRef.current = setTimeout(show, 500);
  }, []);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const startGame = useCallback(() => {
    try { getAudioEngine().playSfx('confirm'); } catch {}
    setRound(0);
    setCorrectRounds(0);
    startRound(0);
  }, [startRound]);

  const handleColorTap = useCallback((colorIdx: number) => {
    if (gameState !== 'input') return;

    const newInput = [...playerInput, colorIdx];
    setPlayerInput(newInput);

    const currentPos = newInput.length - 1;
    if (newInput[currentPos] !== pattern[currentPos]) {
      // Wrong!
      try { getAudioEngine().playSfx('error'); } catch {}
      setLastCorrect(false);
      setGameState('feedback');
      setTimeout(() => {
        if (round + 1 >= TOTAL_ROUNDS) {
          setGameState('complete');
        } else {
          setRound(r => r + 1);
          startRound(round + 1);
        }
      }, 1200);
      return;
    }

    try { getAudioEngine().playSfx('sparkle'); } catch {}

    if (newInput.length === pattern.length) {
      // Correct!
      try { getAudioEngine().playSfx('success'); } catch {}
      setLastCorrect(true);
      setCorrectRounds(c => c + 1);
      setGameState('feedback');
      setTimeout(() => {
        if (round + 1 >= TOTAL_ROUNDS) {
          setGameState('complete');
        } else {
          setRound(r => r + 1);
          startRound(round + 1);
        }
      }, 1200);
    }
  }, [gameState, playerInput, pattern, round, startRound]);

  const handleFinish = useCallback(() => {
    const finalCorrect = correctRounds + (lastCorrect && gameState === 'complete' ? 0 : 0);
    const score = Math.round((correctRounds / TOTAL_ROUNDS) * 100);
    try { getAudioEngine().playSfx('confirm'); } catch {}
    onComplete(score);
  }, [correctRounds, onComplete, lastCorrect, gameState]);

  if (gameState === 'intro') {
    return (
      <div className="minigame-overlay">
        <motion.div className="minigame-intro" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', duration: 0.6 }}>
          <div className="minigame-intro-icon">🎨</div>
          <h2 className="minigame-intro-title">Desafio: Cores Mágicas</h2>
          <p className="minigame-intro-desc">Memorize a sequência de cores e repita na ordem certa!</p>
          <motion.button className="btn-hero primary" onClick={startGame} whileTap={{ scale: 0.95 }}>Começar!</motion.button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'complete') {
    const score = Math.round((correctRounds / TOTAL_ROUNDS) * 100);
    return (
      <div className="minigame-overlay">
        <motion.div className="minigame-result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', duration: 0.6 }}>
          <div className="minigame-result-icon">{correctRounds >= 3 ? '🌟' : '⭐'}</div>
          <h2 className="minigame-intro-title">{correctRounds >= 3 ? 'Brilhante!' : 'Bom esforço!'}</h2>
          <p className="minigame-intro-desc">Você acertou {correctRounds} de {TOTAL_ROUNDS} rodadas!</p>
          <div className="minigame-score-display">
            <span className="minigame-score-label">Pontuação</span>
            <span className="minigame-score-value">{score}</span>
          </div>
          <motion.button className="btn-hero primary" onClick={handleFinish} whileTap={{ scale: 0.95 }}>Continuar Jornada →</motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="minigame-overlay">
      <div className="minigame-play-area">
        {/* Round indicator */}
        <div className="minigame-match-count">
          {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
            <div key={i} className="minigame-match-dot" style={{
              background: i < round ? (i < correctRounds ? 'var(--hk-success)' : 'var(--hk-danger)') : i === round ? 'var(--hk-gold)' : 'rgba(255,255,255,0.15)',
              boxShadow: i === round ? '0 0 12px rgba(255, 213, 79, 0.5)' : 'none',
            }} />
          ))}
        </div>

        {/* Status */}
        <p className="minigame-hint" style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)', color: 'var(--hk-gold)', fontWeight: 700 }}>
          {gameState === 'showing' ? '👀 Observe a sequência!' : gameState === 'input' ? `Toque: ${playerInput.length}/${pattern.length}` : lastCorrect ? '✅ Correto!' : '❌ Errado!'}
        </p>

        {/* Color display (showing phase) */}
        {gameState === 'showing' && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '16px 0', minHeight: 60 }}>
            <AnimatePresence>
              {showingIndex >= 0 && (
                <motion.div
                  key={showingIndex}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  style={{
                    width: 60, height: 60, borderRadius: 16,
                    background: COLORS[pattern[showingIndex]]?.hex,
                    boxShadow: `0 0 30px ${COLORS[pattern[showingIndex]]?.hex}60`,
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Feedback phase */}
        {gameState === 'feedback' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', fontSize: '2.5rem', margin: '16px 0' }}
          >
            {lastCorrect ? '✨' : '💫'}
          </motion.div>
        )}

        {/* Color buttons (input phase) */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', margin: '12px 0' }}>
          {COLORS.map((color, idx) => (
            <motion.button
              key={color.id}
              onClick={() => handleColorTap(idx)}
              disabled={gameState !== 'input'}
              whileTap={{ scale: 0.85 }}
              style={{
                width: 56, height: 56, borderRadius: 14,
                background: color.hex,
                border: '2px solid rgba(255,255,255,0.2)',
                cursor: gameState === 'input' ? 'pointer' : 'default',
                boxShadow: `0 4px 15px ${color.hex}40`,
                opacity: gameState === 'input' ? 1 : 0.4,
                transition: 'opacity 0.3s',
                fontSize: '1.2rem',
              }}
            >
              {color.label}
            </motion.button>
          ))}
        </div>

        {/* Player input display */}
        {gameState === 'input' && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, margin: '8px 0' }}>
            {pattern.map((_, i) => (
              <div key={i} style={{
                width: 20, height: 20, borderRadius: 6,
                background: i < playerInput.length ? COLORS[playerInput[i]]?.hex : 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                transition: 'all 0.2s',
              }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
