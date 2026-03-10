import { useState, useCallback, useRef } from 'react';
import type { GamePhase, ResultData } from './types';
import { getAudioEngine } from './audio/AudioEngine';
import { getAvatarById } from './data/avatarModels';
import TitleScreen from './scenes/TitleScreen';
import AvatarSetup from './scenes/AvatarSetup';
import ToolkitScene from './scenes/ToolkitScene';
import VisualNovelEngine from './engine/VisualNovelEngine';
import ResultScreen from './scenes/ResultScreen';
import '../styles/heroi-kiosk.css';

export default function HeroiKioskLayout() {
  const [phase, setPhase] = useState<GamePhase>('title');
  const [avatarId, setAvatarId] = useState<string | null>(null);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [result, setResult] = useState<ResultData | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const transitionRef = useRef<number | null>(null);

  const avatarModel = avatarId ? getAvatarById(avatarId) : null;

  const changePhase = useCallback((next: GamePhase) => {
    if (transitionRef.current) clearTimeout(transitionRef.current);
    setTransitioning(true);
    transitionRef.current = window.setTimeout(() => {
      setPhase(next);
      // Wait for React to render new phase before fading in
      transitionRef.current = window.setTimeout(() => {
        setTransitioning(false);
      }, 100);
    }, 600);
  }, []);

  const handleStart = useCallback(async () => {
    const engine = getAudioEngine();
    await engine.unlock();
    engine.transitionTo('wonder', 0.4);
    changePhase('avatar');
  }, [changePhase]);

  const handleAvatarSelect = useCallback((id: string) => {
    setAvatarId(id);
    changePhase('toolkit');
    try { getAudioEngine().playSfx('confirm'); } catch {}
  }, [changePhase]);

  const toggleTool = useCallback((id: string) => {
    setSelectedTools(prev => {
      if (prev.includes(id)) return prev.filter(t => t !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
    try { getAudioEngine().playSfx('select'); } catch {}
  }, []);

  const handleToolkitNext = useCallback(() => {
    changePhase('story');
    try {
      const engine = getAudioEngine();
      engine.playSfx('confirm');
      engine.transitionTo('dormant', 0.3);
    } catch {}
  }, [changePhase]);

  const handleStoryComplete = useCallback((data: ResultData) => {
    setResult(data);
    changePhase('result');
    try {
      const engine = getAudioEngine();
      engine.transitionTo('triumph', 0.6);
      engine.playSfx('triumph');
    } catch {}
  }, [changePhase]);

  const handleRestart = useCallback(() => {
    changePhase('title');
    setTimeout(() => {
      setAvatarId(null);
      setSelectedTools([]);
      setResult(null);
    }, 700);
    try { getAudioEngine().transitionTo('wonder', 0.4); } catch {}
  }, [changePhase]);

  return (
    <div className="heroi-root">
      <div
        className="phase-container"
        style={{
          opacity: transitioning ? 0 : 1,
          transition: 'opacity 0.6s ease-in-out',
        }}
      >
        {phase === 'title' && <TitleScreen onStart={handleStart} />}
        {phase === 'avatar' && (
          <AvatarSetup
            onSelect={handleAvatarSelect}
            onBack={() => changePhase('title')}
          />
        )}
        {phase === 'toolkit' && (
          <ToolkitScene
            selected={selectedTools}
            toggleTool={toggleTool}
            onNext={handleToolkitNext}
            onBack={() => changePhase('avatar')}
          />
        )}
        {phase === 'story' && (
          <VisualNovelEngine
            selectedTools={selectedTools}
            avatarImage={avatarModel?.image || null}
            onComplete={handleStoryComplete}
          />
        )}
        {phase === 'result' && result && (
          <ResultScreen result={result} onRestart={handleRestart} />
        )}
      </div>
    </div>
  );
}
