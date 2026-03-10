import avatarMLight from '../../assets/avatar-m-light.png';
import avatarMMedium from '../../assets/avatar-m-medium.png';
import avatarMDark from '../../assets/avatar-m-dark.png';
import avatarFLight from '../../assets/avatar-f-light.png';
import avatarFMedium from '../../assets/avatar-f-medium.png';
import avatarFDark from '../../assets/avatar-f-dark.png';
import type { AvatarModel } from '../types';

export const AVATAR_MODELS: AvatarModel[] = [
  { id: 'm-light', label: 'Herói Solar', image: avatarMLight, matriz: 'masculina', representacao: 'Clara' },
  { id: 'm-medium', label: 'Herói Terrestre', image: avatarMMedium, matriz: 'masculina', representacao: 'Média' },
  { id: 'm-dark', label: 'Herói Estelar', image: avatarMDark, matriz: 'masculina', representacao: 'Escura' },
  { id: 'f-light', label: 'Heroína Solar', image: avatarFLight, matriz: 'feminina', representacao: 'Clara' },
  { id: 'f-medium', label: 'Heroína Terrestre', image: avatarFMedium, matriz: 'feminina', representacao: 'Média' },
  { id: 'f-dark', label: 'Heroína Estelar', image: avatarFDark, matriz: 'feminina', representacao: 'Escura' },
];

export function getAvatarById(id: string): AvatarModel | undefined {
  return AVATAR_MODELS.find(m => m.id === id);
}
