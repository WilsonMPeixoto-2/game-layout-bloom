import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getAudioEngine } from '../audio/AudioEngine';

// Courage: Quick reaction — symbols appear and player must tap the brave choice before time runs out
interface Scenario {
  emoji: string;
  text: string;
  brave: string;
  fear: string;
}

const SCENARIOS: Scenario[] = [
  { emoji: '🌊', text: 'Uma onda de medo se aproxima!', brave: '🛡️ Enfrentar', fear: '🏃 Fugir' },
  { emoji: '🕳️', text: 'Um abismo escuro aparece!', brave: '🔦 Iluminar', fear: '😰 Recuar' },
  { emoji: '🐉', text: 'Uma sombra enorme surge!', brave: '💪 Resistir', fear: '😱 Esconder' },
  { emoji: '⛈️', text: 'Tempestade de dúvidas!', brave: '⭐ Acreditar', fear: '😢 Desistir' },
  { emoji: '🌑', text: 'Escuridão total!', brave: '🔥 Brilhar', fear: '😶 Silenciar' },
];

const TIME_PER_SCENARIO = 4; // seconds

interface Props {
  onComplete: (score: number) => void;
}

export default function CourageChallengeGame({ onComplete }: Props) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'complete'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_SCENARIO);
  const [braveCount, setBraveCount] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [lastChoice, setLastChoice] = useState<'brave' | 'fear' | 'timeout' | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const scenario = SCENARIOS[currentIdx];

  // Timer
  useEffect(() => {
    if (gameState !== 'playing' || answered) return;
    setTimeLeft(TIME_PER_SCENARIO);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.1) {
          clearInterval(timerRef.current);
          setAnswered(true);
          setLastChoice('timeout');
          try { getAudioEngine().playSfx('error'); } catch {}
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);
    return () => clearInterval(timerRef.current);
  }, [gameState, currentIdx, answered]);

  // Auto-advance after answer
  useEffect(() => {
    if (!answered || gameState !== 'playing') return;
    const t = setTimeout(() => {
      if (currentIdx + 1 >= SCENARIOS.length) {
        setGameState('complete');
        try { getAudioEngine().playSfx('triumph'); } catch {}
      } else {
        setCurrentIdx(i => i + 1);
        setAnswered(false);
        setLastChoice(null);
      }
    }, 1200);
    return () => clearTimeout(t);
  }, [answered, currentIdx, gameState]);

  const handleChoice = useCallback((choice: 'brave' | 'fear') => {
    if (answered) return;
    clearInterval(timerRef.current);
    setAnswered(true);
    setLastChoice(choice);
    if (choice === 'brave') {
      setBraveCount(c => c + 1);
      try { getAudioEngine().playSfx('success'); } catch {}
    } else {
      try { getAudioEngine().playSfx('select'); } catch {}
    }
  }, [answered]);

  const startGame = useCallback(() => {
    try { getAudioEngine().playSfx('confirm'); } catch {}
    setCurrentIdx(0);
    setBraveCount(0);
    setAnswered(false);
    setLastChoice(null);
    setGameState('playing');
  }, []);

  const handleFinish = useCallback(() => {
    const score = Math.round((braveCount / SCENARIOS.length) * 100);
    try { getAudioEngine().playSfx('confirm'); } catch {}
    onComplete(score);
  }, [braveCount, onComplete]);

  if (gameState === 'intro') {
    return (
      <div className="minigame-overlay">
        <motion.div className="minigame-intro" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', duration: 0.6 }}>
          <div className="minigame-intro-icon">🛡️</div>
          <h2 className="minigame-intro-title">Desafio: Coragem!</h2>
          <p className="minigame-intro-desc">Medos vão aparecer! Escolha rápido: enfrentar ou fugir? Seja corajoso!</p>
          <motion.button className="btn-hero primary" onClick={startGame} whileTap={{ scale: 0.95 }}>Começar!</motion.button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'complete') {
    const score = Math.round((braveCount / SCENARIOS.length) * 100);
    return (
      <div className="minigame-overlay">
        <motion.div className="minigame-result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', duration: 0.6 }}>
          <div className="minigame-result-icon">{braveCount >= 4 ? '🦁' : '⭐'}</div>
          <h2 className="minigame-intro-title">{braveCount >= 4 ? 'Herói Corajoso!' : 'Boa tentativa!'}</h2>
          <p className="minigame-intro-desc">Você foi corajoso {braveCount} de {SCENARIOS.length} vezes!</p>
          <div className="minigame-score-display">
            <span className="minigame-score-label">Pontuação</span>
            <span className="minigame-score-value">{score}</span>
          </div>
          <motion.button className="btn-hero primary" onClick={handleFinish} whileTap={{ scale: 0.95 }}>Continuar Jornada →</motion.button>
        </motion.div>
      </div>
    );
  }

  const timerPercent = (timeLeft / TIME_PER_SCENARIO) * 100;
  const timerColor = timeLeft > 2 ? 'var(--hk-success)' : timeLeft > 1 ? 'var(--hk-gold)' : 'var(--hk-danger)';

  return (
    <div className="minigame-overlay">
      <div className="minigame-play-area">
        {/* Progress dots */}
        <div className="minigame-match-count">
          {SCENARIOS.map((_, i) => (
            <div key={i} className="minigame-match-dot" style={{
              background: i < currentIdx ? (i < braveCount ? 'var(--hk-success)' : 'var(--hk-danger)') : i === currentIdx ? 'var(--hk-gold)' : 'rgba(255,255,255,0.15)',
            }} />
          ))}
        </div>

        {/* Timer */}
        <div className="minigame-timer-container">
          <div className="minigame-timer-bar">
            <motion.div
              className="minigame-timer-fill"
              style={{ backgroundColor: timerColor, width: `${timerPercent}%` }}
            />
          </div>
          <span className="minigame-timer-text" style={{ color: timerColor }}>{Math.ceil(timeLeft)}s</span>
        </div>

        {/* Scenario */}
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', margin: '20px 0' }}
        >
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>{scenario.emoji}</div>
          <p className="minigame-hint" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: 'var(--hk-text-bright)', fontWeight: 700, marginBottom: 20 }}>
            {scenario.text}
          </p>
        </motion.div>

        {/* Feedback */}
        {answered && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="minigame-hint"
            style={{ color: lastChoice === 'brave' ? 'var(--hk-success)' : 'var(--hk-danger)', fontSize: '1rem', fontWeight: 700, marginBottom: 12 }}
          >
            {lastChoice === 'brave' ? '💪 Corajoso!' : lastChoice === 'fear' ? '😰 Recuou...' : '⏰ Tempo esgotado!'}
          </motion.p>
        )}

        {/* Choice buttons */}
        {!answered && (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <motion.button
              className="minigame-bubble"
              onClick={() => handleChoice('brave')}
              whileTap={{ scale: 0.9 }}
              style={{ flex: 1, maxWidth: 180, justifyContent: 'center', borderColor: 'var(--hk-success)', background: 'rgba(105,240,174,0.08)' }}
            >
              <span className="minigame-bubble-text">{scenario.brave}</span>
            </motion.button>
            <motion.button
              className="minigame-bubble"
              onClick={() => handleChoice('fear')}
              whileTap={{ scale: 0.9 }}
              style={{ flex: 1, maxWidth: 180, justifyContent: 'center', borderColor: 'var(--hk-danger)', background: 'rgba(255,107,138,0.08)' }}
            >
              <span className="minigame-bubble-text">{scenario.fear}</span>
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
