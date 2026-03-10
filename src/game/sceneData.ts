import type { SceneConfig } from './types';

import bgAttract from '../assets/bg-attract.jpg';
import bgIntro from '../assets/bg-intro.jpg';
import bgAvatar from '../assets/bg-avatar.jpg';
import bgToolkit from '../assets/bg-toolkit.jpg';
import bgRepair from '../assets/bg-repair-fantasy.jpg';
import bgResult from '../assets/bg-result.jpg';

export const SCENES: SceneConfig[] = [
  {
    id: 'ATTRACT',
    label: 'Attract',
    emotion: 'wonder',
    narrative: {
      tag: '⚡ Estação Herói — Missão Ativa',
      title: 'O Módulo dos Sonhos precisa de você.',
      body: 'A estação está em colapso. Você é a última esperança para restaurar os sistemas e salvar o futuro da cidade.',
    },
    bg: bgAttract,
    particles: 'dust',
    audio: { drone: 'wonder', volume: 0.4 },
  },
  {
    id: 'INTRO',
    label: 'Contexto',
    emotion: 'dormant',
    narrative: {
      title: 'Bem-vindo à Estação Herói',
      body: 'A cidade perdeu a capacidade de sonhar. O Módulo dos Sonhos, coração da estação, foi danificado. Sua missão: montar seu avatar, escolher ferramentas e restaurar os núcleos antes que o tempo acabe.',
    },
    bg: bgIntro,
    particles: 'dust',
    audio: { drone: 'dormant', volume: 0.3 },
  },
  {
    id: 'AVATAR',
    label: 'Avatar',
    emotion: 'wonder',
    bg: bgAvatar,
    particles: 'sparks',
    audio: { drone: 'wonder', volume: 0.5 },
  },
  {
    id: 'TOOLKIT',
    label: 'Ferramentas',
    emotion: 'preparation',
    bg: bgToolkit,
    particles: 'sparks',
    audio: { drone: 'preparation', volume: 0.5 },
  },
  {
    id: 'REPAIR',
    label: 'Reparo',
    emotion: 'restoration',
    bg: bgRepair,
    particles: 'energy',
    audio: { drone: 'restoration', volume: 0.6 },
  },
  {
    id: 'RESULT',
    label: 'Resultado',
    emotion: 'triumph',
    bg: bgResult,
    particles: 'triumph',
    audio: { drone: 'triumph', volume: 0.5 },
  },
];

export function getScene(id: string): SceneConfig {
  return SCENES.find((s) => s.id === id) ?? SCENES[0];
}
