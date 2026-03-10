import { useState, useCallback, useRef, useEffect } from 'react';
import { SCREEN_ORDER, DREAM_SLOTS, INITIAL_GAME_STATE, type ScreenId, type GameState } from '../types';
import { getScene } from '../sceneData';
import { getAudioEngine } from '../audio/AudioEngine';

export function useGameState() {
  const [state, setState] = useState<GameState>({ ...INITIAL_GAME_STATE });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioUnlocked = useRef(false);

  const screen = state.screen;
  const scene = getScene(screen);
  const completedCores = DREAM_SLOTS.filter((s) => (state.slotProgress[s.id] ?? 0) >= 2).length;

  // Audio transitions
  useEffect(() => {
    if (!audioUnlocked.current) return;
    const engine = getAudioEngine();
    engine.transitionTo(scene.emotion, scene.audio.volume);
  }, [scene]);

  // Timer
  useEffect(() => {
    if (state.isTimerActive && state.timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setState((prev) => {
          const next = prev.timeRemaining - 1;
          if (next <= 0) {
            return { ...prev, timeRemaining: 0, isTimerActive: false };
          }
          return { ...prev, timeRemaining: next };
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state.isTimerActive, state.timeRemaining]);

  const unlockAudio = useCallback(async () => {
    if (audioUnlocked.current) return;
    const engine = getAudioEngine();
    await engine.unlock();
    audioUnlocked.current = true;
    engine.transitionTo(scene.emotion, scene.audio.volume);
  }, [scene]);

  const setScreen = useCallback((s: ScreenId) => {
    setState((prev) => {
      const isRepair = s === 'REPAIR';
      return {
        ...prev,
        screen: s,
        isTimerActive: isRepair ? true : prev.isTimerActive,
      };
    });
  }, []);

  const goNext = useCallback(() => {
    const i = SCREEN_ORDER.indexOf(state.screen);
    if (i < SCREEN_ORDER.length - 1) setScreen(SCREEN_ORDER[i + 1]);
  }, [state.screen, setScreen]);

  const goPrev = useCallback(() => {
    const i = SCREEN_ORDER.indexOf(state.screen);
    if (i > 0) setScreen(SCREEN_ORDER[i - 1]);
  }, [state.screen, setScreen]);

  const setAvatar = useCallback((updater: React.SetStateAction<GameState['avatar']>) => {
    setState((prev) => ({
      ...prev,
      avatar: typeof updater === 'function' ? updater(prev.avatar) : updater,
    }));
    const engine = getAudioEngine();
    engine.playSfx('select');
  }, []);

  const toggleTool = useCallback((id: string) => {
    setState((prev) => {
      const has = prev.selectedTools.includes(id);
      if (has) return { ...prev, selectedTools: prev.selectedTools.filter((t) => t !== id) };
      if (prev.selectedTools.length >= 3) return prev;
      return { ...prev, selectedTools: [...prev.selectedTools, id] };
    });
    const engine = getAudioEngine();
    engine.playSfx('select');
  }, []);

  const setArmedTool = useCallback((tool: string | null) => {
    setState((prev) => ({ ...prev, armedTool: tool }));
    const engine = getAudioEngine();
    engine.playSfx('confirm');
  }, []);

  const applyToolToSlot = useCallback((slotId: string) => {
    setState((prev) => {
      if (!prev.armedTool) return prev;
      const slot = DREAM_SLOTS.find((s) => s.id === slotId);
      if (!slot) return prev;
      
      const currentProgress = prev.slotProgress[slotId] ?? 0;
      if (currentProgress >= 2) return prev;

      const isAccepted = slot.acceptedTools.includes(prev.armedTool);
      const engine = getAudioEngine();

      if (!isAccepted) {
        engine.playSfx('error');
        return { ...prev, combo: 0, energy: Math.max(0, prev.energy - 5) };
      }

      const newCombo = prev.combo + 1;
      const newMaxCombo = Math.max(prev.maxCombo, newCombo);
      const comboBonus = Math.min(newCombo, 5);
      const newProgress = Math.min(currentProgress + 1, 2);

      engine.playSfx(newProgress >= 2 ? 'success' : 'apply');
      if (newCombo >= 3) engine.playSfx('combo');

      return {
        ...prev,
        slotProgress: { ...prev.slotProgress, [slotId]: newProgress },
        combo: newCombo,
        maxCombo: newMaxCombo,
        energy: Math.max(0, prev.energy - 3 + comboBonus),
      };
    });
  }, []);

  const restart = useCallback(() => {
    setState({ ...INITIAL_GAME_STATE });
    const engine = getAudioEngine();
    engine.transitionTo('wonder', 0.4);
  }, []);

  return {
    state,
    scene,
    completedCores,
    goNext,
    goPrev,
    setScreen,
    setAvatar,
    toggleTool,
    setArmedTool,
    applyToolToSlot,
    restart,
    unlockAudio,
  };
}
