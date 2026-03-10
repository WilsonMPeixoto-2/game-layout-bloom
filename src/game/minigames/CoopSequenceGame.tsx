import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getAudioEngine } from '../audio/AudioEngine';

// Cooperation: Simon-says style — a growing sequence of actions the player must repeat
const COOP_SYMBOLS = [
  { id: 0, emoji: '🤝', label: 'Unir', color: 'var(--hk-gold)' },
  { id: 1, emoji: '💬', label: 'Falar', color: 'var(--hk-cyan)' },
  { id: 2, emoji: '👂', label: 'Ouvir', color: 'var(--hk-magic)' },
  { id: 3, emoji: '❤️', label: 'Amar', color: 'var(--hk-warmth)' },
];

const MAX_ROUNDS = 5;

interface Props {
  onComplete: (score: number) => void;
}

export default function CoopSequenceGame({ onComplete }: Props) {
  const [gameState, setGameState] = useState<'intro' | 'showing' | 'input' | 'feedback' | 'complete'>('intro');
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [round, setRound] = useState(0);
  const [showingIndex, setShowingIndex] = useState(-1);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [lastCorrect, setLastCorrect] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const showSequence = useCallback((seq: number[]) => {
    setGameState('showing');
    setShowingIndex(-1);
    let i = 0;
    const show = () => {
      setShowingIndex(i);
      setActiveButton(seq[i]);
      try { getAudioEngine().playSfx('select'); } catch {}
      timerRef.current = setTimeout(() => {
        setActiveButton(null);
        i++;
        if (i < seq.length) {
          timerRef.current = setTimeout(show, 300);
        } else {
          setShowingIndex(-1);
          setPlayerInput([]);
          setGameState('input');
        }
      }, 500);
    };
    timerRef.current = setTimeout(show, 600);
  }, []);

  const startGame = useCallback(() => {
    try { getAudioEngine().playSfx('confirm'); } catch {}
    const first = [Math.floor(Math.random() * COOP_SYMBOLS.length)];
    setSequence(first);
    setRound(1);
    setLastCorrect(true);
    showSequence(first);
  }, [showSequence]);

  const nextRound = useCallback(() => {
    const newSeq = [...sequence, Math.floor(Math.random() * COOP_SYMBOLS.length)];
    setSequence(newSeq);
    setRound(r => r + 1);
    showSequence(newSeq);
  }, [sequence, showSequence]);

  const handleTap = useCallback((symbolId: number) => {
    if (gameState !== 'input') return;

    setActiveButton(symbolId);
    setTimeout(() => setActiveButton(null), 150);

    const newInput = [...playerInput, symbolId];
    setPlayerInput(newInput);
    const pos = newInput.length - 1;

    if (newInput[pos] !== sequence[pos]) {
      // Wrong
      try { getAudioEngine().playSfx('error'); } catch {}
      setLastCorrect(false);
      setGameState('feedback');
      setTimeout(() => setGameState('complete'), 1200);
      return;
    }

    try { getAudioEngine().playSfx('sparkle'); } catch {}

    if (newInput.length === sequence.length) {
      // Round complete!
      try { getAudioEngine().playSfx('success'); } catch {}
      setLastCorrect(true);
      setGameState('feedback');
      if (round >= MAX_ROUNDS) {
        setTimeout(() => {
          try { getAudioEngine().playSfx('triumph'); } catch {}
          setGameState('complete');
        }, 1000);
      } else {
        setTimeout(() => nextRound(), 1000);
      }
    }
  }, [gameState, playerInput, sequence, round, nextRound]);

  const handleFinish = useCallback(() => {
    const completedRounds = lastCorrect ? round : round - 1;
    const score = Math.round((completedRounds / MAX_ROUNDS) * 100);
    try { getAudioEngine().playSfx('confirm'); } catch {}
    onComplete(score);
  }, [round, lastCorrect, onComplete]);

  if (gameState === 'intro') {
    return (
      <div className="minigame-overlay">
        <motion.div className="minigame-intro" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', duration: 0.6 }}>
          <div className="minigame-intro-icon">🤝</div>
          <h2 className="minigame-intro-title">Desafio: Cooperação!</h2>
          <p className="minigame-intro-desc">Repita a sequência! A cada rodada, um novo passo é adicionado. Trabalhe junto!</p>
          <motion.button className="btn-hero primary" onClick={startGame} whileTap={{ scale: 0.95 }}>Começar!</motion.button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'complete') {
    const completedRounds = lastCorrect ? round : round - 1;
    const score = Math.round((completedRounds / MAX_ROUNDS) * 100);
    return (
      <div className="minigame-overlay">
        <motion.div className="minigame-result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', duration: 0.6 }}>
          <div className="minigame-result-icon">{completedRounds >= 4 ? '🌟' : '⭐'}</div>
          <h2 className="minigame-intro-title">{completedRounds >= 4 ? 'Cooperação Perfeita!' : 'Boa tentativa!'}</h2>
          <p className="minigame-intro-desc">Você completou {completedRounds} de {MAX_ROUNDS} rodadas!</p>
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
        {/* Round dots */}
        <div className="minigame-match-count">
          {Array.from({ length: MAX_ROUNDS }).map((_, i) => (
            <div key={i} className="minigame-match-dot" style={{
              background: i < round - 1 ? 'var(--hk-success)' : i === round - 1 ? 'var(--hk-gold)' : 'rgba(255,255,255,0.15)',
              boxShadow: i === round - 1 ? '0 0 12px rgba(255,213,79,0.5)' : 'none',
            }} />
          ))}
        </div>

        {/* Status */}
        <p className="minigame-hint" style={{ fontSize: 'clamp(0.88rem, 2vw, 1rem)', color: 'var(--hk-gold)', fontWeight: 700 }}>
          {gameState === 'showing' ? '👀 Observe a sequência!' : gameState === 'input' ? `Sua vez! ${playerInput.length}/${sequence.length}` : lastCorrect ? '✅ Perfeito!' : '❌ Sequência errada!'}
        </p>

        {/* Symbol buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, margin: '20px auto', maxWidth: 280 }}>
          {COOP_SYMBOLS.map(symbol => {
            const isActive = activeButton === symbol.id;
            return (
              <motion.button
                key={symbol.id}
                onClick={() => handleTap(symbol.id)}
                disabled={gameState !== 'input'}
                whileTap={{ scale: 0.9 }}
                className="minigame-bubble"
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '18px 12px',
                  borderColor: isActive ? symbol.color : undefined,
                  background: isActive ? `${symbol.color}18` : undefined,
                  boxShadow: isActive ? `0 0 25px ${symbol.color}50` : undefined,
                  transition: 'all 0.15s',
                  display: 'flex',
                }}
              >
                <span style={{ fontSize: '1.8rem' }}>{symbol.emoji}</span>
                <span className="minigame-bubble-text" style={{ fontSize: '0.75rem', marginTop: 4 }}>{symbol.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Input progress */}
        {gameState === 'input' && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
            {sequence.map((_, i) => (
              <div key={i} style={{
                width: 16, height: 16, borderRadius: 4,
                background: i < playerInput.length ? 'var(--hk-success)' : 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                transition: 'all 0.2s',
              }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
