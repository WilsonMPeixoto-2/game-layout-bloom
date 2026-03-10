import { useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStoryEngine } from './useStoryEngine';
import SceneMedia from './SceneMedia';
import DialogueBox from './DialogueBox';
import ChoicePanel from './ChoicePanel';
import GameHud from './GameHud';
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

  // Audio state transitions
  useEffect(() => {
    try {
      const engine = getAudioEngine();
      engine.transitionTo(currentScene.emotion, 0.5);
    } catch {}
  }, [currentScene.emotion, currentScene.id]);

  const handleComplete = useCallback(() => {
    onComplete({
      avatarImage: avatarImage || '',
      tools: selectedTools,
      path: chosenPath || 'desconhecido',
      impact,
      scenesVisited,
    });
  }, [onComplete, avatarImage, selectedTools, chosenPath, impact, scenesVisited]);

  const currentText = currentScene.dialogue[dialogueIndex] || '';

  return (
    <div className="vn-container">
      {/* Scene background + NPC + effects */}
      <SceneMedia
        background={currentScene.background}
        npc={currentScene.npc}
        particles={currentScene.particles || 'dust'}
      />

      {/* HUD */}
      <GameHud
        act={currentScene.act}
        avatarImage={avatarImage}
        progress={progress}
        impact={impact}
      />

      {/* Bottom panel: dialogue + choices */}
      <div className="vn-bottom-panel">
        <DialogueBox
          speaker={currentScene.speaker}
          text={currentText}
          onAdvance={advanceDialogue}
          isComplete={isDialogueComplete}
        />

        <AnimatePresence>
          {showChoices && currentScene.choices && (
            <ChoicePanel
              choices={currentScene.choices}
              selectedTools={selectedTools}
              onSelect={selectChoice}
            />
          )}
        </AnimatePresence>

        {showAdvance && (
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
              ★ Concluir Missão
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
