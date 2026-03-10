export type ScreenId = 'ATTRACT' | 'INTRO' | 'AVATAR' | 'TOOLKIT' | 'REPAIR' | 'RESULT';

export type EmotionalState = 'dormant' | 'wonder' | 'preparation' | 'restoration' | 'triumph';

export interface AvatarState {
  skin: number;
  hair: number;
  eyes: number;
  outfit: number;
  accessory: number;
}

export interface ToolItem {
  id: string;
  icon: string;
  label: string;
  summary: string;
}

export interface DreamSlot {
  id: string;
  label: string;
  acceptedTools: string[];
}

export interface SceneConfig {
  id: ScreenId;
  label: string;
  emotion: EmotionalState;
  narrative?: {
    tag?: string;
    title: string;
    body: string;
  };
  bg: string;
  particles: ParticlePreset;
  audio: {
    drone: EmotionalState;
    volume: number;
  };
}

export type ParticlePreset = 'dust' | 'sparks' | 'energy' | 'bloom' | 'triumph' | 'none';

export interface GameState {
  screen: ScreenId;
  avatar: AvatarState;
  selectedTools: string[];
  armedTool: string | null;
  slotProgress: Record<string, number>;
  energy: number;
  combo: number;
  maxCombo: number;
  timeRemaining: number;
  isTimerActive: boolean;
}

export const SKIN_COLORS = ['#f4c7a1', '#c48f68', '#925c3f', '#5e3523'];
export const HAIR_COLORS = ['#281c16', '#8c6239', '#1a1a1a', '#d4a45f'];
export const EYE_COLORS = ['#263238', '#0d47a1', '#1b5e20', '#4e342e'];
export const OUTFIT_COLORS = ['#25c9ff', '#7d6bff', '#26c281', '#ff7a59'];
export const ACCESSORIES = ['Sem Acessório', 'Viseira', 'Pulseira Tech', 'Capa de Missão', 'Óculos Neon', 'Pin Solar'];

export const TOOLS: ToolItem[] = [
  { id: 'escuta-ativa', icon: '🎧', label: 'Escuta Ativa', summary: 'Conectar pessoas e reconstruir comunicação.' },
  { id: 'imaginacao', icon: '✨', label: 'Imaginação Aplicada', summary: 'Transformar ideias em soluções para a cidade.' },
  { id: 'empatia', icon: '💙', label: 'Empatia', summary: 'Entender necessidades reais antes de agir.' },
  { id: 'foco', icon: '🎯', label: 'Foco', summary: 'Manter atenção no que importa.' },
  { id: 'cooperacao', icon: '🤝', label: 'Cooperação', summary: 'Trabalhar junto para ir mais longe.' },
  { id: 'criatividade', icon: '🎨', label: 'Criatividade', summary: 'Inventar caminhos novos para velhos desafios.' },
];

export const DREAM_SLOTS: DreamSlot[] = [
  { id: 'comunicacao', label: 'Comunicação', acceptedTools: ['escuta-ativa', 'cooperacao'] },
  { id: 'criatividade', label: 'Criatividade', acceptedTools: ['imaginacao', 'criatividade'] },
  { id: 'coragem', label: 'Coragem', acceptedTools: ['foco', 'empatia'] },
  { id: 'cooperacao', label: 'Cooperação', acceptedTools: ['cooperacao', 'escuta-ativa'] },
];

export const SCREEN_ORDER: ScreenId[] = ['ATTRACT', 'INTRO', 'AVATAR', 'TOOLKIT', 'REPAIR', 'RESULT'];

export const INITIAL_GAME_STATE: GameState = {
  screen: 'ATTRACT',
  avatar: { skin: 0, hair: 1, eyes: 0, outfit: 0, accessory: 2 },
  selectedTools: [],
  armedTool: null,
  slotProgress: { comunicacao: 0, criatividade: 0, coragem: 0, cooperacao: 0 },
  energy: 100,
  combo: 0,
  maxCombo: 0,
  timeRemaining: 150,
  isTimerActive: false,
};
