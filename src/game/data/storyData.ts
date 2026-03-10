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
      'Os sensores da Estação Herói detectaram uma anomalia crítica no coração da cidade.',
      'O Módulo dos Sonhos — a fonte de toda imaginação e esperança — está falhando.',
      'Se ele se apagar completamente, a cidade esquecerá como sonhar.',
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
      'As ruas que antes brilhavam com luz dourada agora se cobrem de sombras.',
      'As crianças pararam de brincar. Os artistas esqueceram suas cores. Os vizinhos já não se cumprimentam.',
      'Mas no silêncio, um sinal foi enviado para os confins do mundo...',
      'E alguém respondeu. Esse alguém é você.',
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
      'A Estação Herói emerge entre as nuvens como um farol moribundo.',
      'Seus corredores, antes repletos de energia luminosa, agora ecoam apenas o vento.',
      'Mas algo se agita no ar — uma presença antiga que sente sua chegada.',
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
      'Ah, finalmente! Eu senti sua luz se aproximando.',
      'Meu nome é Lyra. Sou a guardiã dos registros desta estação.',
      'Há gerações, o Módulo dos Sonhos mantinha nossa cidade viva e vibrante.',
      'Mas quando as pessoas pararam de acreditar umas nas outras... os Núcleos se apagaram, um a um.',
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
      'O Módulo possui quatro Núcleos fundamentais que sustentam a cidade.',
      'O Núcleo da Comunicação — que conecta as vozes perdidas.',
      'O Núcleo da Criatividade — que pinta os sonhos em cores vivas.',
      'O Núcleo da Coragem — que aquece os corações frios.',
      'E o Núcleo da Cooperação — que tece os laços entre as pessoas.',
      'Com as ferramentas que você trouxe, podemos restaurá-los. Mas cada Núcleo exige uma abordagem única.',
    ],
    emotion: 'preparation',
    autoNext: 'branch_choice',
    particles: 'sparks',
  },

  // ============ ACT 2 — PREPARAÇÃO / BRANCH ============
  {
    id: 'branch_choice',
    act: 2,
    background: bgRepairFantasy,
    npc: { name: 'Guardião', image: npcGuardian, position: 'center' },
    speaker: 'Guardião dos Sonhos',
    dialogue: [
      'Eu sou o Guardião dos Sonhos. Há séculos espero por alguém com a coragem de restaurar o que foi perdido.',
      'Diante de você estão os quatro Núcleos adormecidos. Cada um guarda um aspecto essencial da humanidade.',
      'Escolha qual Núcleo restaurar primeiro. Sua escolha moldará o destino da cidade.',
    ],
    emotion: 'preparation',
    choices: [
      { label: '🎧 Restaurar o Núcleo da Comunicação', nextScene: 'com_1', requiredTool: 'escuta-ativa', emotion: 'positive' },
      { label: '✨ Restaurar o Núcleo da Criatividade', nextScene: 'cria_1', requiredTool: 'imaginacao', emotion: 'positive' },
      { label: '💙 Restaurar o Núcleo da Coragem', nextScene: 'cor_1', requiredTool: 'empatia', emotion: 'positive' },
      { label: '🤝 Restaurar o Núcleo da Cooperação', nextScene: 'coop_1', requiredTool: 'cooperacao', emotion: 'positive' },
    ],
    particles: 'energy',
    miniGameSlot: 'puzzle_gateway',
  },

  // ============ ACT 3 — RESTAURAÇÃO: COMUNICAÇÃO ============
  {
    id: 'com_1',
    act: 3,
    background: bgIntro,
    npc: { name: 'Lyra', image: npcLyra, position: 'right' },
    speaker: 'Lyra',
    dialogue: [
      'O Núcleo da Comunicação está envolvido em um silêncio profundo.',
      'As pessoas desta ala esqueceram como se ouvir. Falam, mas as palavras se dissolvem antes de chegar ao outro.',
      'Veja aquelas duas pessoas ali — tentam conversar, mas é como se falassem línguas diferentes.',
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
    speaker: 'Guardião dos Sonhos',
    dialogue: [
      'O Núcleo responde à sua presença. Ele sente sua intenção.',
      'Mas restaurá-lo exige mais que vontade — exige uma escolha verdadeira.',
      'Como você quer restaurar a comunicação nesta cidade?',
    ],
    emotion: 'restoration',
    choices: [
      { label: '🤫 Ouvir em silêncio, absorvendo cada história não contada', nextScene: 'com_3a', emotion: 'positive', gainItem: 'selo-escuta' },
      { label: '📢 Criar novos canais para que as vozes se encontrem', nextScene: 'com_3b', emotion: 'positive', gainItem: 'selo-amplificacao' },
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
      'Você escolheu o caminho da escuta profunda.',
      'Em silêncio, você se sentou entre as pessoas e simplesmente ouviu. Suas histórias fluíram como rios — dolorosas, belas, verdadeiras.',
      'Aos poucos, algo mágico aconteceu: ao serem ouvidas, as pessoas começaram a ouvir umas às outras.',
      'O Núcleo da Comunicação pulsa com luz dourada renovada! As palavras encontram seus destinos novamente.',
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
      'Você escolheu amplificar as vozes esquecidas.',
      'Com criatividade e determinação, você construiu pontes sonoras entre os bairros isolados.',
      'Vozes que nunca haviam se encontrado começaram a dialogar, descobrindo que compartilhavam os mesmos sonhos.',
      'O Núcleo da Comunicação resplandece com força! A cidade inteira pode ouvir e ser ouvida.',
    ],
    emotion: 'restoration',
    autoNext: 'convergence',
    particles: 'bloom',
    gainItem: 'nucleo-comunicacao',
  },

  // ============ ACT 3 — RESTAURAÇÃO: CRIATIVIDADE ============
  {
    id: 'cria_1',
    act: 3,
    background: bgRepairFantasy,
    npc: { name: 'Lyra', image: npcLyra, position: 'right' },
    speaker: 'Lyra',
    dialogue: [
      'O Núcleo da Criatividade está cinzento e opaco. Sem cor, sem forma, sem vida.',
      'Esta era a ala mais vibrante da cidade — artistas, inventores e sonhadores viviam aqui.',
      'Agora, telas em branco cobrem as paredes. Ninguém consegue imaginar nada novo.',
      'Precisamos reacender a Imaginação Aplicada neste lugar.',
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
    speaker: 'Guardião dos Sonhos',
    dialogue: [
      'A Criatividade não é apenas arte — é a capacidade de ver soluções onde outros veem problemas.',
      'Este Núcleo precisa de alguém que ouse imaginar o impossível.',
      'Como você quer despertar a criatividade nesta cidade?',
    ],
    emotion: 'restoration',
    choices: [
      { label: '🎨 Pintar novos sonhos nas paredes vazias da cidade', nextScene: 'cria_3a', emotion: 'positive', gainItem: 'selo-pintura' },
      { label: '🔮 Reimaginar o passado para construir um futuro melhor', nextScene: 'cria_3b', emotion: 'positive', gainItem: 'selo-visao' },
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
      'Você pegou as cores da imaginação e pintou diretamente nas paredes cinzentas.',
      'Cada pincelada trouxe uma explosão de luz. Flores brotaram dos desenhos. Pássaros de tinta ganharam vida.',
      'As pessoas pararam, fascinadas. E então, uma a uma, começaram a pintar também.',
      'O Núcleo da Criatividade explode em um arco-íris de possibilidades! A cidade volta a sonhar em cores.',
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
      'Você olhou para o passado da cidade e viu não ruínas, mas sementes de futuro.',
      'Com imaginação aplicada, transformou cada memória em um projeto novo — jardins onde havia concreto, música onde havia silêncio.',
      'As pessoas redescobriram que a verdadeira criatividade nasce de reconhecer a beleza no que já existe.',
      'O Núcleo da Criatividade irradia uma luz quente e inventiva! Novas ideias florescem em cada esquina.',
    ],
    emotion: 'restoration',
    autoNext: 'convergence',
    particles: 'bloom',
    gainItem: 'nucleo-criatividade',
  },

  // ============ ACT 3 — RESTAURAÇÃO: CORAGEM ============
  {
    id: 'cor_1',
    act: 3,
    background: bgToolkit,
    npc: { name: 'Lyra', image: npcLyra, position: 'right' },
    speaker: 'Lyra',
    dialogue: [
      'O Núcleo da Coragem está frio como pedra. Sem ele, as pessoas vivem paralisadas pelo medo.',
      'Não ousam mudar. Não ousam tentar. Não ousam sentir.',
      'A Coragem não é ausência de medo — é a decisão de agir apesar dele.',
      'Precisamos da Empatia e do Foco para aquecer este Núcleo.',
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
    speaker: 'Guardião dos Sonhos',
    dialogue: [
      'A verdadeira coragem nasce quando entendemos a dor do outro e decidimos agir.',
      'Muitos tentaram restaurar este Núcleo com força bruta. Todos falharam.',
      'O segredo é a vulnerabilidade. Como você escolhe enfrentar este desafio?',
    ],
    emotion: 'restoration',
    choices: [
      { label: '🛡️ Enfrentar o medo de frente, com determinação inabalável', nextScene: 'cor_3a', emotion: 'warning', gainItem: 'selo-determinacao' },
      { label: '💜 Acolher a dor da cidade com empatia profunda', nextScene: 'cor_3b', emotion: 'positive', gainItem: 'selo-empatia' },
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
      'Você se plantou diante do medo com os olhos abertos e o coração firme.',
      'As sombras que paralisavam a cidade tentaram recuar, mas você não cedeu.',
      'Com foco absoluto, você mostrou às pessoas que o medo pode ser enfrentado — juntos.',
      'O Núcleo da Coragem arde como uma chama dourada! O calor da bravura se espalha pela cidade.',
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
      'Você não lutou contra o medo. Você o abraçou.',
      'Com empatia profunda, sentiu a dor de cada pessoa, de cada rua, de cada janela escura.',
      'E nesse ato de acolhimento, algo inesperado aconteceu: a dor se transformou em força.',
      'O Núcleo da Coragem se aquece com um brilho suave mas inabalável! As pessoas redescobrem a bravura na compaixão.',
    ],
    emotion: 'restoration',
    autoNext: 'convergence',
    particles: 'bloom',
    gainItem: 'nucleo-coragem',
  },

  // ============ ACT 3 — RESTAURAÇÃO: COOPERAÇÃO ============
  {
    id: 'coop_1',
    act: 3,
    background: bgRepair,
    npc: { name: 'Lyra', image: npcLyra, position: 'right' },
    speaker: 'Lyra',
    dialogue: [
      'O Núcleo da Cooperação está fragmentado em mil pedaços.',
      'As pessoas desta ala vivem isoladas — cada uma em sua própria ilha de solidão.',
      'Antes, esta era a praça central, onde todos se reuniam. Agora, muros invisíveis separam vizinho de vizinho.',
      'Precisamos da Cooperação para religar esses laços.',
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
    speaker: 'Guardião dos Sonhos',
    dialogue: [
      'A Cooperação é o mais poderoso dos Núcleos — e o mais frágil.',
      'Basta uma pessoa desistir para que toda a rede se rompa.',
      'Para restaurá-lo, você precisa inspirar ação coletiva. Como fará isso?',
    ],
    emotion: 'restoration',
    choices: [
      { label: '🤲 Unir as mãos e criar um círculo de confiança', nextScene: 'coop_3a', emotion: 'positive', gainItem: 'selo-confianca' },
      { label: '🌉 Construir pontes entre os grupos isolados', nextScene: 'coop_3b', emotion: 'positive', gainItem: 'selo-pontes' },
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
      'Você começou com um gesto simples: estendeu a mão.',
      'Uma pessoa hesitou... mas aceitou. Depois outra. E outra. E mais uma.',
      'O círculo cresceu até envolver toda a praça. As mãos tremiam, mas seguravam firme.',
      'O Núcleo da Cooperação se recompõe num brilho verde-esmeralda! Os laços renascem mais fortes que antes.',
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
      'Você construiu pontes — não de pedra, mas de compreensão.',
      'Entre cada grupo isolado, você criou espaços de encontro. Lugares onde as diferenças se tornavam força.',
      'As primeiras conversas foram difíceis. Mas com perseverança, os muros caíram um a um.',
      'O Núcleo da Cooperação brilha como um mosaico vivo! Cada peça diferente, todas essenciais.',
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
      'Incrível! O Núcleo que você restaurou está irradiando energia para os outros!',
      'Quando um aspecto da humanidade desperta, ele inspira os demais.',
      'Olhe — os outros Núcleos começam a brilhar por conta própria, alimentados pela sua energia!',
      'O Módulo dos Sonhos está quase completo. Falta apenas um último impulso.',
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
    speaker: 'Guardião dos Sonhos',
    dialogue: [
      'Herói, este é o momento decisivo.',
      'O Módulo dos Sonhos precisa de um último impulso para despertar completamente.',
      'Concentre toda sua energia. Todo seu aprendizado. Toda sua coragem.',
      'O futuro da cidade está em suas mãos. Como você quer ativar o Módulo?',
    ],
    emotion: 'triumph',
    choices: [
      { label: '⚡ Canalizar toda a energia de uma vez, com força total!', nextScene: 'climax_a', emotion: 'warning' },
      { label: '🌊 Distribuir a energia gradualmente, com sabedoria e cuidado', nextScene: 'climax_b', emotion: 'positive' },
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
      'Você reuniu toda a força interior e a liberou num jato de luz pura!',
      'O Módulo dos Sonhos absorveu a energia e explodiu em uma cascata de luz dourada.',
      'Cada rua, cada praça, cada janela se iluminou instantaneamente.',
      'A cidade inteira pulsou como um coração que volta a bater — forte, vivo, radiante!',
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
      'Com paciência e sabedoria, você distribuiu a energia como um rio que encontra seu curso.',
      'O Módulo dos Sonhos despertou suavemente, como o amanhecer depois da noite mais longa.',
      'A luz se espalhou gentilmente, alcançando cada canto esquecido da cidade.',
      'Uma transformação profunda e duradoura — não um relâmpago, mas um sol que nunca se põe.',
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
      'A cidade respira novamente. As pessoas sonham, criam, se conectam, se fortalecem.',
      'O que você fez aqui hoje não será esquecido.',
      'Você provou que o verdadeiro heroísmo não vem de superpoderes — vem da empatia, da escuta, da criatividade e da ação coletiva.',
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
      'A Estação Herói brilha como um sol no horizonte da cidade restaurada.',
      'Nos corredores, agora vibrantes de luz e vida, uma nova placa foi colocada.',
      'Nela se lê: "Aqui, um herói nos lembrou como sonhar."',
      'Obrigado por sua missão, Herói do Futuro. O mundo precisa de mais pessoas como você.',
    ],
    emotion: 'triumph',
    particles: 'bloom',
    // No autoNext = story ends here
  },
];

export function getSceneById(id: string): StoryScene | undefined {
  return STORY_SCENES.find(s => s.id === id);
}
