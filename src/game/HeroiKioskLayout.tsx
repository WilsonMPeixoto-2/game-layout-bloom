import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { GamePhase, ResultData } from './types';
import { getAudioEngine } from './audio/AudioEngine';
import { getAvatarById } from './data/avatarModels';
import TitleScreen from './scenes/TitleScreen';
import AvatarSetup from './scenes/AvatarSetup';
import ToolkitScene from './scenes/ToolkitScene';
import VisualNovelEngine from './engine/VisualNovelEngine';
import ResultScreen from './scenes/ResultScreen';
import '../styles/heroi-kiosk.css';

const phaseTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, transition: { duration: 0.5 } },
};

export default function HeroiKioskLayout() {
  const [phase, setPhase] = useState<GamePhase>('title');
  const [avatarId, setAvatarId] = useState<string | null>(null);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [result, setResult] = useState<ResultData | null>(null);

  const avatarModel = avatarId ? getAvatarById(avatarId) : null;

  const handleStart = useCallback(async () => {
    const engine = getAudioEngine();
    await engine.unlock();
    engine.transitionTo('wonder', 0.4);
    setPhase('avatar');
  }, []);

  const handleAvatarSelect = useCallback((id: string) => {
    setAvatarId(id);
    setPhase('toolkit');
    try { getAudioEngine().playSfx('confirm'); } catch {}
  }, []);

  const toggleTool = useCallback((id: string) => {
    setSelectedTools(prev => {
      if (prev.includes(id)) return prev.filter(t => t !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
    try { getAudioEngine().playSfx('select'); } catch {}
  }, []);

  const handleToolkitNext = useCallback(() => {
    setPhase('story');
    try {
      const engine = getAudioEngine();
      engine.playSfx('confirm');
      engine.transitionTo('dormant', 0.3);
    } catch {}
  }, []);

  const handleStoryComplete = useCallback((data: ResultData) => {
    setResult(data);
    setPhase('result');
    try {
      const engine = getAudioEngine();
      engine.transitionTo('triumph', 0.6);
      engine.playSfx('triumph');
    } catch {}
  }, []);

  const handleRestart = useCallback(() => {
    setPhase('title');
    setAvatarId(null);
    setSelectedTools([]);
    setResult(null);
    try { getAudioEngine().transitionTo('wonder', 0.4); } catch {}
  }, []);

  return (
    <div className="heroi-root">
      <AnimatePresence mode="wait">
        {phase === 'title' && (
          <motion.div key="title" {...phaseTransition} className="phase-container">
            <TitleScreen onStart={handleStart} />
          </motion.div>
        )}
        {phase === 'avatar' && (
          <motion.div key="avatar" {...phaseTransition} className="phase-container">
            <AvatarSetup
              onSelect={handleAvatarSelect}
              onBack={() => setPhase('title')}
            />
          </motion.div>
        )}
        {phase === 'toolkit' && (
          <motion.div key="toolkit" {...phaseTransition} className="phase-container">
            <ToolkitScene
              selected={selectedTools}
              toggleTool={toggleTool}
              onNext={handleToolkitNext}
              onBack={() => setPhase('avatar')}
            />
          </motion.div>
        )}
        {phase === 'story' && (
          <motion.div key="story" {...phaseTransition} className="phase-container">
            <VisualNovelEngine
              selectedTools={selectedTools}
              avatarImage={avatarModel?.image || null}
              onComplete={handleStoryComplete}
            />
          </motion.div>
        )}
        {phase === 'result' && result && (
          <motion.div key="result" {...phaseTransition} className="phase-container">
            <ResultScreen result={result} onRestart={handleRestart} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
