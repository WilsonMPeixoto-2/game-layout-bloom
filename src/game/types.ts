export type GamePhase = 'title' | 'avatar' | 'toolkit' | 'story' | 'result';

export type EmotionalState = 'dormant' | 'wonder' | 'preparation' | 'restoration' | 'triumph';

export type ParticlePreset = 'dust' | 'sparks' | 'energy' | 'bloom' | 'triumph' | 'none';

export interface AvatarModel {
  id: string;
  label: string;
  image: string;
  matriz: 'masculina' | 'feminina';
  representacao: string;
}

export interface ToolItem {
  id: string;
  icon: string;
  label: string;
  summary: string;
}

export interface StoryChoice {
  label: string;
  nextScene: string;
  requiredTool?: string;
  gainItem?: string;
  emotion?: 'positive' | 'neutral' | 'warning';
}

export interface NpcConfig {
  name: string;
  image: string;
  position?: 'left' | 'right' | 'center';
}

export interface StoryScene {
  id: string;
  act: number;
  background: string;
  npc?: NpcConfig;
  speaker: string;
  dialogue: string[];
  emotion: EmotionalState;
  choices?: StoryChoice[];
  autoNext?: string;
  gainItem?: string;
  miniGameSlot?: string;
  particles?: ParticlePreset;
}

export interface ResultData {
  avatarImage: string;
  tools: string[];
  path: string;
  impact: number;
  scenesVisited: number;
}

export const TOOLS: ToolItem[] = [
  { id: 'escuta-ativa', icon: '🎧', label: 'Escuta Ativa', summary: 'Conectar pessoas e reconstruir comunicação.' },
  { id: 'imaginacao', icon: '✨', label: 'Imaginação Aplicada', summary: 'Transformar ideias em soluções para a cidade.' },
  { id: 'empatia', icon: '💙', label: 'Empatia', summary: 'Entender necessidades reais antes de agir.' },
  { id: 'foco', icon: '🎯', label: 'Foco', summary: 'Manter atenção no que importa.' },
  { id: 'cooperacao', icon: '🤝', label: 'Cooperação', summary: 'Trabalhar junto para ir mais longe.' },
  { id: 'criatividade', icon: '🎨', label: 'Criatividade', summary: 'Inventar caminhos novos para velhos desafios.' },
];
