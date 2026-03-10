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
  // ============ ACT 0 — PRÓLOGO ============
  {
    id: 'prologue_1',
    act: 0,
    background: bgAttract,
    speaker: 'Sistema',
    dialogue: [
      'Alerta! O Módulo dos Sonhos está falhando.',
      'Se ele se apagar, a cidade esquecerá como sonhar.',
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
      'As ruas perderam sua luz. As crianças pararam de brincar.',
      'Mas alguém respondeu ao chamado. Esse alguém é você.',
    ],
    emotion: 'dormant',
    autoNext: 'city_arrival',
    particles: 'dust',
  },

  // ============ ACT 1 — DESCOBERTA ============
  {
    id: 'city_arrival',
    act: 1,
    background: bgDystopia,
    speaker: 'Narrador',
    dialogue: [
      'A Estação Herói surge entre as nuvens como um farol moribundo.',
      'Algo se agita no ar — uma presença antiga sente sua chegada.',
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
      'Finalmente! Eu senti sua luz se aproximando.',
      'Sou Lyra, guardiã desta estação.',
      'O Módulo dos Sonhos mantinha a cidade viva. Mas os Núcleos se apagaram.',
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
      'Cada um precisa de uma abordagem diferente. Suas ferramentas farão a diferença.',
    ],
    emotion: 'preparation',
    autoNext: 'branch_choice',
    particles: 'sparks',
  },

  // ============ ACT 2 — ESCOLHA ============
  {
    id: 'branch_choice',
    act: 2,
    background: bgRepairFantasy,
    npc: { name: 'Guardião', image: npcGuardian, position: 'center' },
    speaker: 'Guardião',
    dialogue: [
      'Sou o Guardião dos Sonhos. Diante de você estão os quatro Núcleos.',
      'Qual você quer restaurar primeiro?',
    ],
    emotion: 'preparation',
    choices: [
      { label: '🎧 Comunicação', nextScene: 'com_1', requiredTool: 'escuta-ativa', emotion: 'positive' },
      { label: '✨ Criatividade', nextScene: 'cria_1', requiredTool: 'imaginacao', emotion: 'positive' },
      { label: '💙 Coragem', nextScene: 'cor_1', requiredTool: 'empatia', emotion: 'positive' },
      { label: '🤝 Cooperação', nextScene: 'coop_1', requiredTool: 'cooperacao', emotion: 'positive' },
    ],
    particles: 'energy',
    miniGameSlot: 'puzzle_gateway',
  },

  // ============ ACT 3 — COMUNICAÇÃO ============
  {
    id: 'com_1',
    act: 3,
    background: bgIntro,
    npc: { name: 'Lyra', image: npcLyra, position: 'right' },
    speaker: 'Lyra',
    dialogue: [
      'O Núcleo da Comunicação está em silêncio profundo.',
      'As pessoas falam, mas as palavras se dissolvem antes de chegar ao outro.',
      'Precisamos usar a Escuta Ativa para reconectar essas vozes.',
    ],
    emotion: 'restoration',
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
      'O Núcleo responde à sua presença.',
      'Como você quer restaurar a comunicação?',
    ],
    emotion: 'restoration',
    choices: [
      { label: '🤫 Ouvir cada história não contada', nextScene: 'com_3a', emotion: 'positive', gainItem: 'selo-escuta' },
      { label: '📢 Criar canais para as vozes se encontrarem', nextScene: 'com_3b', emotion: 'positive', gainItem: 'selo-amplificacao' },
    ],
    particles: 'energy',
    miniGameSlot: 'challenge_comunicacao',
  },
  {
    id: 'com_3a',
    act: 3,
    background: bgIntro,
    speaker: 'Narrador',
    dialogue: [
      'Você ouviu em silêncio. As histórias fluíram — dolorosas, belas, verdadeiras.',
      'Ao serem ouvidas, as pessoas começaram a ouvir umas às outras.',
      'O Núcleo pulsa com luz dourada renovada!',
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
      'Você construiu pontes sonoras entre bairros isolados.',
      'Vozes que nunca se encontraram começaram a dialogar.',
      'O Núcleo resplandece com força!',
    ],
    emotion: 'restoration',
    autoNext: 'convergence',
    particles: 'bloom',
    gainItem: 'nucleo-comunicacao',
  },

  // ============ ACT 3 — CRIATIVIDADE ============
  {
    id: 'cria_1',
    act: 3,
    background: bgRepairFantasy,
    npc: { name: 'Lyra', image: npcLyra, position: 'right' },
    speaker: 'Lyra',
    dialogue: [
      'O Núcleo da Criatividade está cinzento e sem vida.',
      'Artistas e inventores viviam aqui. Agora, ninguém consegue imaginar nada novo.',
      'Precisamos reacender a Imaginação neste lugar.',
    ],
    emotion: 'restoration',
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
      { label: '🎨 Pintar sonhos nas paredes vazias', nextScene: 'cria_3a', emotion: 'positive', gainItem: 'selo-pintura' },
      { label: '🔮 Reimaginar o passado para um futuro melhor', nextScene: 'cria_3b', emotion: 'positive', gainItem: 'selo-visao' },
    ],
    particles: 'energy',
    miniGameSlot: 'challenge_criatividade',
  },
  {
    id: 'cria_3a',
    act: 3,
    background: bgRepairFantasy,
    speaker: 'Narrador',
    dialogue: [
      'Cada pincelada trouxe uma explosão de luz. Flores brotaram dos desenhos.',
      'As pessoas pararam, fascinadas. E começaram a pintar também.',
      'O Núcleo explode em um arco-íris de possibilidades!',
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
      'Você transformou cada memória em um projeto novo.',
      'Jardins onde havia concreto. Música onde havia silêncio.',
      'O Núcleo irradia uma luz quente e inventiva!',
    ],
    emotion: 'restoration',
    autoNext: 'convergence',
    particles: 'bloom',
    gainItem: 'nucleo-criatividade',
  },

  // ============ ACT 3 — CORAGEM ============
  {
    id: 'cor_1',
    act: 3,
    background: bgToolkit,
    npc: { name: 'Lyra', image: npcLyra, position: 'right' },
    speaker: 'Lyra',
    dialogue: [
      'O Núcleo da Coragem está frio. Sem ele, todos vivem paralisados pelo medo.',
      'Coragem não é ausência de medo — é agir apesar dele.',
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
      'A verdadeira coragem nasce quando decidimos agir.',
      'Como você escolhe enfrentar este desafio?',
    ],
    emotion: 'restoration',
    choices: [
      { label: '🛡️ Enfrentar o medo de frente', nextScene: 'cor_3a', emotion: 'warning', gainItem: 'selo-determinacao' },
      { label: '💜 Acolher a dor com empatia', nextScene: 'cor_3b', emotion: 'positive', gainItem: 'selo-empatia' },
    ],
    particles: 'energy',
    miniGameSlot: 'challenge_coragem',
  },
  {
    id: 'cor_3a',
    act: 3,
    background: bgToolkit,
    speaker: 'Narrador',
    dialogue: [
      'Você se plantou diante do medo com o coração firme.',
      'Mostrou às pessoas que o medo pode ser enfrentado — juntos.',
      'O Núcleo da Coragem arde como uma chama dourada!',
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
      'Você abraçou o medo. Sentiu a dor de cada pessoa.',
      'A dor se transformou em força.',
      'O Núcleo se aquece com um brilho suave mas inabalável!',
    ],
    emotion: 'restoration',
    autoNext: 'convergence',
    particles: 'bloom',
    gainItem: 'nucleo-coragem',
  },

  // ============ ACT 3 — COOPERAÇÃO ============
  {
    id: 'coop_1',
    act: 3,
    background: bgRepair,
    npc: { name: 'Lyra', image: npcLyra, position: 'right' },
    speaker: 'Lyra',
    dialogue: [
      'O Núcleo da Cooperação está fragmentado.',
      'As pessoas vivem isoladas. Muros invisíveis separam vizinho de vizinho.',
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
      'A Cooperação é o mais poderoso dos Núcleos — e o mais frágil.',
      'Como você vai inspirar ação coletiva?',
    ],
    emotion: 'restoration',
    choices: [
      { label: '🤲 Criar um círculo de confiança', nextScene: 'coop_3a', emotion: 'positive', gainItem: 'selo-confianca' },
      { label: '🌉 Construir pontes entre os grupos', nextScene: 'coop_3b', emotion: 'positive', gainItem: 'selo-pontes' },
    ],
    particles: 'energy',
    miniGameSlot: 'challenge_cooperacao',
  },
  {
    id: 'coop_3a',
    act: 3,
    background: bgRepair,
    speaker: 'Narrador',
    dialogue: [
      'Você estendeu a mão. Uma pessoa aceitou. Depois outra. E outra.',
      'O círculo cresceu até envolver toda a praça.',
      'O Núcleo brilha verde-esmeralda! Os laços renascem.',
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
      'Você criou espaços de encontro entre os grupos isolados.',
      'As diferenças se tornaram força. Os muros caíram.',
      'O Núcleo brilha como um mosaico vivo!',
    ],
    emotion: 'restoration',
    autoNext: 'convergence',
    particles: 'bloom',
    gainItem: 'nucleo-cooperacao',
  },

  // ============ ACT 4 — RENASCIMENTO ============
  {
    id: 'convergence',
    act: 4,
    background: bgRepairFantasy,
    npc: { name: 'Lyra', image: npcLyra, position: 'left' },
    speaker: 'Lyra',
    dialogue: [
      'Incrível! O Núcleo restaurado está irradiando energia para os outros!',
      'O Módulo dos Sonhos está quase completo. Falta um último impulso.',
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
      'Este é o momento decisivo, Herói.',
      'O futuro da cidade está em suas mãos!',
    ],
    emotion: 'triumph',
    choices: [
      { label: '⚡ Liberar toda a energia de uma vez!', nextScene: 'climax_a', emotion: 'warning' },
      { label: '🌊 Distribuir com sabedoria e cuidado', nextScene: 'climax_b', emotion: 'positive' },
    ],
    particles: 'energy',
    miniGameSlot: 'final_activation',
  },
  {
    id: 'climax_a',
    act: 4,
    background: bgReborn,
    speaker: 'Narrador',
    dialogue: [
      'Você liberou toda a força numa cascata de luz dourada!',
      'Cada rua se iluminou. A cidade pulsou como um coração que volta a bater!',
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
      'A luz se espalhou gentilmente, como o amanhecer depois da noite mais longa.',
      'Uma transformação profunda — não um relâmpago, mas um sol que nunca se põe.',
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
      'A cidade respira novamente. As pessoas sonham, criam, se conectam.',
      'O verdadeiro heroísmo vem da empatia, da escuta e da ação coletiva.',
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
      'A Estação Herói brilha no horizonte da cidade restaurada.',
      '"Aqui, um herói nos lembrou como sonhar."',
      'Obrigado, Herói do Futuro. O mundo precisa de você.',
    ],
    emotion: 'triumph',
    particles: 'bloom',
  },
];

export function getSceneById(id: string): StoryScene | undefined {
  return STORY_SCENES.find(s => s.id === id);
}