import { useState, useCallback, useMemo } from 'react';
import { STORY_SCENES } from '../data/storyData';
import type { StoryScene, StoryChoice } from '../types';
import { getAudioEngine } from '../audio/AudioEngine';

interface StoryEngineState {
  currentSceneId: string;
  dialogueIndex: number;
  isDialogueComplete: boolean;
  inventory: string[];
  history: string[];
  impact: number;
  chosenPath: string | null;
}

const INITIAL_STATE: StoryEngineState = {
  currentSceneId: 'prologue_1',
  dialogueIndex: 0,
  isDialogueComplete: false,
  inventory: [],
  history: [],
  impact: 0,
  chosenPath: null,
};

export function useStoryEngine(_selectedTools: string[]) {
  const [state, setState] = useState<StoryEngineState>({ ...INITIAL_STATE });

  const currentScene: StoryScene = useMemo(
    () => STORY_SCENES.find(s => s.id === state.currentSceneId) ?? STORY_SCENES[0],
    [state.currentSceneId],
  );

  const hasChoices = !!(currentScene.choices && currentScene.choices.length > 0);
  const showChoices = state.isDialogueComplete && hasChoices;
  const showAdvance = state.isDialogueComplete && !hasChoices && !!currentScene.autoNext;
  const isStoryEnd = state.isDialogueComplete && !hasChoices && !currentScene.autoNext;

  const goToScene = useCallback((sceneId: string, prevState: StoryEngineState): StoryEngineState => {
    return {
      ...prevState,
      currentSceneId: sceneId,
      dialogueIndex: 0,
      isDialogueComplete: false,
      history: [...prevState.history, prevState.currentSceneId],
      impact: prevState.impact + 5,
    };
  }, []);

  const advanceDialogue = useCallback(() => {
    setState(prev => {
      const scene = STORY_SCENES.find(s => s.id === prev.currentSceneId);
      if (!scene) return prev;

      // Already finished dialogue
      if (prev.isDialogueComplete) {
        // If autoNext, transition to next scene
        if (scene.autoNext) {
          try { getAudioEngine().playSfx('confirm'); } catch {}
          const next = goToScene(scene.autoNext, prev);
          return {
            ...next,
            inventory: scene.gainItem ? [...prev.inventory, scene.gainItem] : prev.inventory,
          };
        }
        return prev;
      }

      // If on last line, mark complete
      if (prev.dialogueIndex >= scene.dialogue.length - 1) {
        return { ...prev, isDialogueComplete: true };
      }

      // Advance to next line
      return { ...prev, dialogueIndex: prev.dialogueIndex + 1 };
    });
  }, [goToScene]);

  const selectChoice = useCallback((choice: StoryChoice) => {
    setState(prev => {
      try { getAudioEngine().playSfx('confirm'); } catch {}

      let chosenPath = prev.chosenPath;
      if (choice.nextScene.startsWith('com_')) chosenPath = 'comunicacao';
      else if (choice.nextScene.startsWith('cria_')) chosenPath = 'criatividade';
      else if (choice.nextScene.startsWith('cor_')) chosenPath = 'coragem';
      else if (choice.nextScene.startsWith('coop_')) chosenPath = 'cooperacao';

      const scene = STORY_SCENES.find(s => s.id === prev.currentSceneId);
      const next = goToScene(choice.nextScene, prev);

      return {
        ...next,
        inventory: [
          ...next.inventory,
          ...(scene?.gainItem ? [scene.gainItem] : []),
          ...(choice.gainItem ? [choice.gainItem] : []),
        ],
        impact: next.impact + 5, // Bonus for making a choice
        chosenPath: chosenPath ?? prev.chosenPath,
      };
    });
  }, [goToScene]);

  const reset = useCallback(() => {
    setState({ ...INITIAL_STATE });
  }, []);

  const totalScenes = STORY_SCENES.length;
  const progress = Math.min(100, Math.round((state.history.length / totalScenes) * 100));

  return {
    currentScene,
    dialogueIndex: state.dialogueIndex,
    isDialogueComplete: state.isDialogueComplete,
    showChoices,
    showAdvance,
    isStoryEnd,
    inventory: state.inventory,
    impact: state.impact,
    progress,
    chosenPath: state.chosenPath,
    scenesVisited: state.history.length,
    advanceDialogue,
    selectChoice,
    reset,
  };
}
