import { useEffect, useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStoryEngine } from './useStoryEngine';
import SceneMedia from './SceneMedia';
import DialogueBox from './DialogueBox';
import ChoicePanel from './ChoicePanel';
import GameHud from './GameHud';
import ReawakeningGlow from '../effects/ReawakeningGlow';
import LightShafts from '../effects/LightShafts';
import BubbleConnectGame from '../minigames/BubbleConnectGame';
import { getAudioEngine } from '../audio/AudioEngine';
import type { ResultData } from '../types';

interface Props {
  selectedTools: string[];
  avatarImage: string | null;
  onComplete: (result: ResultData) => void;
}

export default function VisualNovelEngine({ selectedTools, avatarImage, onComplete }: Props) {
  const {
    currentScene,
    dialogueIndex,
    isDialogueComplete,
    showChoices,
    showAdvance,
    isStoryEnd,
    impact,
    progress,
    chosenPath,
    scenesVisited,
    advanceDialogue,
    selectChoice,
  } = useStoryEngine(selectedTools);

  const [miniGameActive, setMiniGameActive] = useState(false);

  // Audio state transitions
  useEffect(() => {
    try {
      const engine = getAudioEngine();
      engine.transitionTo(currentScene.emotion, 0.5);
    } catch {}
  }, [currentScene.emotion, currentScene.id]);

  // Trigger mini-game when dialogue completes on a miniGameSlot scene
  useEffect(() => {
    if (isDialogueComplete && currentScene.miniGameSlot && !miniGameActive) {
      setMiniGameActive(true);
    }
  }, [isDialogueComplete, currentScene.miniGameSlot, miniGameActive]);

  // Reset mini-game state on scene change
  useEffect(() => {
    setMiniGameActive(false);
  }, [currentScene.id]);

  const handleMiniGameComplete = useCallback((_score: number) => {
    setMiniGameActive(false);
    advanceDialogue();
  }, [advanceDialogue]);

  const handleComplete = useCallback(() => {
    onComplete({
      avatarImage: avatarImage || '',
      tools: selectedTools,
      path: chosenPath || 'desconhecido',
      impact,
      scenesVisited,
    });
  }, [onComplete, avatarImage, selectedTools, chosenPath, impact, scenesVisited]);

  const restorationProgress = useMemo(() => {
    if (currentScene.act < 3) return 0;
    if (currentScene.act > 3) return 1;
    return Math.min(1, progress / 80);
  }, [currentScene.act, progress]);

  const isTriumph = currentScene.act === 4;
  const isRestoration = currentScene.act === 3;
  const currentText = currentScene.dialogue[dialogueIndex] || '';
  const shouldShowAdvance = showAdvance && !currentScene.miniGameSlot;
  const shouldShowChoices = showChoices && !miniGameActive;

  return (
    <div className="vn-container">
      <SceneMedia
        background={currentScene.background}
        npc={currentScene.npc}
        particles={currentScene.particles || 'dust'}
      />

      {isRestoration && <ReawakeningGlow progress={restorationProgress} />}
      {isTriumph && <LightShafts variant="triumph" intensity={1} />}

      <GameHud
        act={currentScene.act}
        avatarImage={avatarImage}
        progress={progress}
        impact={impact}
      />

      <AnimatePresence>
        {miniGameActive && currentScene.miniGameSlot === 'bubble-connect' && (
          <motion.div
            key="minigame"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ position: 'absolute', inset: 0, zIndex: 40 }}
          >
            <BubbleConnectGame onComplete={handleMiniGameComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      {!miniGameActive && (
        <div className="vn-bottom-panel">
          <DialogueBox
            speaker={currentScene.speaker}
            text={currentText}
            onAdvance={advanceDialogue}
            isComplete={isDialogueComplete}
          />

          <AnimatePresence>
            {shouldShowChoices && currentScene.choices && (
              <ChoicePanel
                choices={currentScene.choices}
                selectedTools={selectedTools}
                onSelect={selectChoice}
              />
            )}
          </AnimatePresence>

          {shouldShowAdvance && (
            <div className="vn-continue-area">
              <motion.button
                className="vn-continue-btn"
                onClick={advanceDialogue}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Continuar →
              </motion.button>
            </div>
          )}

          {isStoryEnd && (
            <div className="vn-continue-area">
              <motion.button
                className="vn-conclude-btn"
                onClick={handleComplete}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
              >
                ★ Ver Resultado
              </motion.button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
