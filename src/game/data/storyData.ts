import type { StoryScene } from '../types';

import bgAttract from '../../assets/bg-attract.jpg';
import bgDystopia from '../../assets/bg-dystopia.jpg';
import bgLab from '../../assets/bg-lab.jpg';
import bgIntro from '../../assets/bg-intro.jpg';
import bgToolkit from '../../assets/bg-toolkit.jpg';
import bgRepairFantasy from '../../assets/bg-repair-fantasy.jpg';
import bgRepair from '../../assets/bg-repair.jpg';
import bgReborn from '../../assets/bg-reborn.jpg';
import bgResult from '../../assets/bg-result.jpg';

import npcLyra from '../../assets/npc-lyra.png';
import npcGuardian from '../../assets/npc-guardian.png';

export const STORY_SCENES: StoryScene[] = [
  // ============ ATO 0 — PRÓLOGO ============
  {
    id: 'prologue_1',
    act: 0,
    background: bgAttract,
    speaker: 'Sistema',
    dialogue: [
      'Alerta! O Módulo dos Sonhos está falhando!',
      'Se ele apagar, a cidade vai esquecer como sonhar.',
    ],
    emotion: 'dormant',
    autoNext: 'prologue_2',
    particles: 'dust',
  },
  {
    id: 'prologue_2',
    act: 0,
    background: bgDystopia,
    speaker: 'Narrador',
    dialogue: [
      'As ruas perderam a luz. As crianças pararam de brincar.',
      'Mas alguém ouviu o chamado. Esse alguém é você!',
    ],
    emotion: 'dormant',
    autoNext: 'city_arrival',
    particles: 'dust',
  },

  // ============ ATO 1 — DESCOBERTA ============
  {
    id: 'city_arrival',
    act: 1,
    background: bgDystopia,
    speaker: 'Narrador',
    dialogue: [
      'A Estação Herói aparece entre as nuvens.',
      'Algo no ar sente a sua chegada!',
    ],
    emotion: 'wonder',
    autoNext: 'mentor_meet',
    particles: 'sparks',
  },
  {
    id: 'mentor_meet',
    act: 1,
    background: bgLab,
    npc: { name: 'Lyra', image: npcLyra, position: 'right' },
    speaker: 'Lyra',
    dialogue: [
      'Até que enfim! Eu senti sua luz chegando!',
      'Sou Lyra, guardiã desta estação.',
      'O Módulo dos Sonhos mantinha a cidade viva, mas os Núcleos se apagaram.',
    ],
    emotion: 'wonder',
    autoNext: 'mentor_lesson',
    particles: 'sparks',
  },
  {
    id: 'mentor_lesson',
    act: 1,
    background: bgLab,
    npc: { name: 'Lyra', image: npcLyra, position: 'right' },
    speaker: 'Lyra',
    dialogue: [
      'São quatro Núcleos: Comunicação, Criatividade, Coragem e Cooperação.',
      'Suas ferramentas vão fazer toda a diferença!',
    ],
    emotion: 'preparation',
    autoNext: 'branch_choice',
    particles: 'sparks',
  },

  // ============ ATO 2 — ESCOLHA ============
  {
    id: 'branch_choice',
    act: 2,
    background: bgRepairFantasy,
    npc: { name: 'Guardião', image: npcGuardian, position: 'center' },
    speaker: 'Guardião',
    dialogue: [
      'Sou o Guardião dos Sonhos.',
      'Qual Núcleo você quer restaurar primeiro?',
    ],
    emotion: 'preparation',
    choices: [
      { label: '🎧 Comunicação', nextScene: 'com_1', requiredTool: 'escuta-ativa', emotion: 'positive' },
      { label: '✨ Criatividade', nextScene: 'cria_1', requiredTool: 'imaginacao', emotion: 'positive' },
      { label: '💙 Coragem', nextScene: 'cor_1', requiredTool: 'empatia', emotion: 'positive' },
      { label: '🤝 Cooperação', nextScene: 'coop_1', requiredTool: 'cooperacao', emotion: 'positive' },
    ],
    particles: 'energy',
  },

  // ============ ATO 3 — COMUNICAÇÃO ============
  {
    id: 'com_1',
    act: 3,
    background: bgIntro,
    npc: { name: 'Lyra', image: npcLyra, position: 'right' },
    speaker: 'Lyra',
    dialogue: [
      'O Núcleo da Comunicação está em silêncio.',
      'As pessoas falam, mas ninguém se ouve.',
      'Vamos usar a Escuta Ativa!',
    ],
    emotion: 'restoration',
    autoNext: 'com_challenge',
    particles: 'energy',
  },
  {
    id: 'com_challenge',
    act: 3,
    background: bgIntro,
    speaker: 'Sistema',
    dialogue: ['Hora do desafio! Conecte as ideias certas!'],
    emotion: 'restoration',
    miniGameSlot: 'bubble-connect',
    autoNext: 'com_2',
    particles: 'energy',
  },
  {
    id: 'com_2',
    act: 3,
    background: bgIntro,
    npc: { name: 'Guardião', image: npcGuardian, position: 'right' },
    speaker: 'Guardião',
    dialogue: [
      'O Núcleo sente sua presença!',
      'Como você quer restaurar a comunicação?',
    ],
    emotion: 'restoration',
    choices: [
      { label: '🤫 Ouvir cada história', nextScene: 'com_3a', emotion: 'positive', gainItem: 'selo-escuta' },
      { label: '📢 Criar canais para as vozes', nextScene: 'com_3b', emotion: 'positive', gainItem: 'selo-amplificacao' },
    ],
    particles: 'energy',
  },
  {
    id: 'com_3a',
    act: 3,
    background: bgIntro,
    speaker: 'Narrador',
    dialogue: [
      'Você ouviu em silêncio. As histórias fluíram.',
      'As pessoas começaram a ouvir umas às outras!',
      'O Núcleo brilha com luz dourada!',
    ],
    emotion: 'restoration',
    autoNext: 'convergence',
    particles: 'bloom',
    gainItem: 'nucleo-comunicacao',
  },
  {
    id: 'com_3b',
    act: 3,
    background: bgIntro,
    speaker: 'Narrador',
    dialogue: [
      'Você criou pontes entre vozes que nunca se encontraram.',
      'Agora elas dialogam juntas!',
      'O Núcleo brilha com força!',
    ],
    emotion: 'restoration',
    autoNext: 'convergence',
    particles: 'bloom',
    gainItem: 'nucleo-comunicacao',
  },

  // ============ ATO 3 — CRIATIVIDADE ============
  {
    id: 'cria_1',
    act: 3,
    background: bgRepairFantasy,
    npc: { name: 'Lyra', image: npcLyra, position: 'right' },
    speaker: 'Lyra',
    dialogue: [
      'O Núcleo da Criatividade está cinzento.',
      'Ninguém consegue imaginar nada novo.',
      'Vamos reacender a imaginação!',
    ],
    emotion: 'restoration',
    autoNext: 'cria_challenge',
    particles: 'energy',
  },
  {
    id: 'cria_challenge',
    act: 3,
    background: bgRepairFantasy,
    speaker: 'Sistema',
    dialogue: ['Hora do desafio! Memorize as cores mágicas!'],
    emotion: 'restoration',
    miniGameSlot: 'color-puzzle',
    autoNext: 'cria_2',
    particles: 'energy',
  },
  {
    id: 'cria_2',
    act: 3,
    background: bgRepairFantasy,
    npc: { name: 'Guardião', image: npcGuardian, position: 'right' },
    speaker: 'Guardião',
    dialogue: [
      'Criatividade é ver soluções onde outros veem problemas.',
      'Como você quer despertar a criatividade?',
    ],
    emotion: 'restoration',
    choices: [
      { label: '🎨 Pintar sonhos nas paredes', nextScene: 'cria_3a', emotion: 'positive', gainItem: 'selo-pintura' },
      { label: '🔮 Imaginar um futuro melhor', nextScene: 'cria_3b', emotion: 'positive', gainItem: 'selo-visao' },
    ],
    particles: 'energy',
  },
  {
    id: 'cria_3a',
    act: 3,
    background: bgRepairFantasy,
    speaker: 'Narrador',
    dialogue: [
      'Cada pincelada trouxe uma explosão de luz!',
      'As pessoas começaram a pintar também!',
      'O Núcleo explode em cores!',
    ],
    emotion: 'restoration',
    autoNext: 'convergence',
    particles: 'bloom',
    gainItem: 'nucleo-criatividade',
  },
  {
    id: 'cria_3b',
    act: 3,
    background: bgRepairFantasy,
    speaker: 'Narrador',
    dialogue: [
      'Você transformou memórias em projetos novos!',
      'Jardins onde havia concreto. Música onde havia silêncio.',
      'O Núcleo brilha com luz quente!',
    ],
    emotion: 'restoration',
    autoNext: 'convergence',
    particles: 'bloom',
    gainItem: 'nucleo-criatividade',
  },

  // ============ ATO 3 — CORAGEM ============
  {
    id: 'cor_1',
    act: 3,
    background: bgToolkit,
    npc: { name: 'Lyra', image: npcLyra, position: 'right' },
    speaker: 'Lyra',
    dialogue: [
      'O Núcleo da Coragem está frio.',
      'Todos vivem com medo.',
      'Coragem não é não ter medo — é agir mesmo com ele!',
    ],
    emotion: 'restoration',
    autoNext: 'cor_2',
    particles: 'energy',
  },
  {
    id: 'cor_2',
    act: 3,
    background: bgToolkit,
    npc: { name: 'Guardião', image: npcGuardian, position: 'right' },
    speaker: 'Guardião',
    dialogue: [
      'A coragem nasce quando decidimos agir.',
      'Como você escolhe enfrentar este desafio?',
    ],
    emotion: 'restoration',
    choices: [
      { label: '🛡️ Enfrentar o medo de frente', nextScene: 'cor_3a', emotion: 'warning', gainItem: 'selo-determinacao' },
      { label: '💜 Acolher a dor com carinho', nextScene: 'cor_3b', emotion: 'positive', gainItem: 'selo-empatia' },
    ],
    particles: 'energy',
  },
  {
    id: 'cor_3a',
    act: 3,
    background: bgToolkit,
    speaker: 'Narrador',
    dialogue: [
      'Você enfrentou o medo com o coração firme!',
      'As pessoas viram que juntos, nada é impossível!',
      'O Núcleo arde como uma chama dourada!',
    ],
    emotion: 'restoration',
    autoNext: 'convergence',
    particles: 'bloom',
    gainItem: 'nucleo-coragem',
  },
  {
    id: 'cor_3b',
    act: 3,
    background: bgToolkit,
    speaker: 'Narrador',
    dialogue: [
      'Você abraçou o medo e sentiu a dor.',
      'A dor se transformou em força!',
      'O Núcleo brilha suave mas forte!',
    ],
    emotion: 'restoration',
    autoNext: 'convergence',
    particles: 'bloom',
    gainItem: 'nucleo-coragem',
  },

  // ============ ATO 3 — COOPERAÇÃO ============
  {
    id: 'coop_1',
    act: 3,
    background: bgRepair,
    npc: { name: 'Lyra', image: npcLyra, position: 'right' },
    speaker: 'Lyra',
    dialogue: [
      'O Núcleo da Cooperação está quebrado.',
      'As pessoas vivem sozinhas, separadas.',
    ],
    emotion: 'restoration',
    autoNext: 'coop_2',
    particles: 'energy',
  },
  {
    id: 'coop_2',
    act: 3,
    background: bgRepair,
    npc: { name: 'Guardião', image: npcGuardian, position: 'right' },
    speaker: 'Guardião',
    dialogue: [
      'A Cooperação é o Núcleo mais poderoso — e o mais frágil.',
      'Como você vai juntar as pessoas?',
    ],
    emotion: 'restoration',
    choices: [
      { label: '🤲 Criar um círculo de confiança', nextScene: 'coop_3a', emotion: 'positive', gainItem: 'selo-confianca' },
      { label: '🌉 Construir pontes entre grupos', nextScene: 'coop_3b', emotion: 'positive', gainItem: 'selo-pontes' },
    ],
    particles: 'energy',
  },
  {
    id: 'coop_3a',
    act: 3,
    background: bgRepair,
    speaker: 'Narrador',
    dialogue: [
      'Você estendeu a mão. Uma pessoa aceitou. Depois outra.',
      'O círculo cresceu até envolver toda a praça!',
      'O Núcleo brilha verde-esmeralda!',
    ],
    emotion: 'restoration',
    autoNext: 'convergence',
    particles: 'bloom',
    gainItem: 'nucleo-cooperacao',
  },
  {
    id: 'coop_3b',
    act: 3,
    background: bgRepair,
    speaker: 'Narrador',
    dialogue: [
      'Você criou espaços para os grupos se encontrarem.',
      'As diferenças viraram força. Os muros caíram!',
      'O Núcleo brilha como um mosaico vivo!',
    ],
    emotion: 'restoration',
    autoNext: 'convergence',
    particles: 'bloom',
    gainItem: 'nucleo-cooperacao',
  },

  // ============ ATO 4 — RENASCIMENTO ============
  {
    id: 'convergence',
    act: 4,
    background: bgRepairFantasy,
    npc: { name: 'Lyra', image: npcLyra, position: 'left' },
    speaker: 'Lyra',
    dialogue: [
      'Incrível! O Núcleo está irradiando energia!',
      'O Módulo dos Sonhos está quase pronto!',
    ],
    emotion: 'triumph',
    autoNext: 'climax',
    particles: 'energy',
  },
  {
    id: 'climax',
    act: 4,
    background: bgResult,
    npc: { name: 'Guardião', image: npcGuardian, position: 'center' },
    speaker: 'Guardião',
    dialogue: [
      'Este é o momento decisivo, Herói!',
      'O futuro da cidade está em suas mãos!',
    ],
    emotion: 'triumph',
    choices: [
      { label: '⚡ Liberar toda a energia!', nextScene: 'climax_a', emotion: 'warning' },
      { label: '🌊 Distribuir com sabedoria', nextScene: 'climax_b', emotion: 'positive' },
    ],
    particles: 'energy',
  },
  {
    id: 'climax_a',
    act: 4,
    background: bgReborn,
    speaker: 'Narrador',
    dialogue: [
      'Você liberou toda a força numa cascata de luz!',
      'A cidade pulsou como um coração voltando a bater!',
    ],
    emotion: 'triumph',
    autoNext: 'triumph',
    particles: 'triumph',
  },
  {
    id: 'climax_b',
    act: 4,
    background: bgReborn,
    speaker: 'Narrador',
    dialogue: [
      'A luz se espalhou como o amanhecer.',
      'Uma mudança profunda — um sol que nunca se põe.',
    ],
    emotion: 'triumph',
    autoNext: 'triumph',
    particles: 'triumph',
  },
  {
    id: 'triumph',
    act: 4,
    background: bgReborn,
    npc: { name: 'Lyra', image: npcLyra, position: 'right' },
    speaker: 'Lyra',
    dialogue: [
      'Você conseguiu, Herói!',
      'A cidade respira de novo!',
      'O verdadeiro heroísmo vem da empatia e da ação!',
    ],
    emotion: 'triumph',
    autoNext: 'epilogue',
    particles: 'triumph',
  },
  {
    id: 'epilogue',
    act: 4,
    background: bgReborn,
    speaker: 'Narrador',
    dialogue: [
      'A Estação Herói brilha no horizonte.',
      'Obrigado, Herói do Futuro!',
    ],
    emotion: 'triumph',
    particles: 'bloom',
  },
];

export function getSceneById(id: string): StoryScene | undefined {
  return STORY_SCENES.find(s => s.id === id);
}
