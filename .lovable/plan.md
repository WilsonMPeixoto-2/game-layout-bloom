

## Plano: Reconstruir como Visual Novel Completa com Narrativa Jogavel

### Diagnostico

O projeto atual e apenas uma **tela de configuracao de personagem** (escolher cores de pele, cabelo, ferramentas) sem nenhuma narrativa real. Nao ha historia, nao ha dialogos, nao ha escolhas narrativas, nao ha NPC, nao ha enredo. Isso nao e um jogo -- e um menu de setup.

O que voce quer e combinar:
- **Capsula do Tempo**: Visual Novel Engine data-driven com roteiro ramificado (4 enredos), avatares 4K pre-configurados, ambientacao cinematografica, storyData.json
- **Nexo 2050**: Layout arcade com HUD (progresso, bateria, turma), area de midia grande (background + NPC), caixa de dialogo com speaker name + texto + escolhas, mini-game runner integrado
- **Manifesto Estetico**: Fantasia luminosa, nao cyberpunk duro

### O que sera construido

**Fase 1 -- Jogo completo com Visual Novel + Customizacao**

#### 1. Sistema de dados narrativos (TypeScript)

Novo `src/game/data/storyData.ts` com tipagem forte:

```text
StoryScene {
  id: string
  act: number                    // Ato 0-5
  background: string             // URL da imagem 4K
  npc?: { name, image }          // NPC falando
  speaker: string                // Nome do falante
  dialogue: string[]             // Linhas de texto (typewriter)
  emotion: EmotionalState        // Para audio/particulas
  theme?: 'luminous'|'tension'|'restoration'|'triumph'
  choices?: StoryChoice[]        // Opcoes do jogador
  autoNext?: string              // Cena seguinte automatica
  gainItem?: string              // Item ganho
  requiredItem?: string          // Item necessario para ver opcao
  miniGameSlot?: string          // ID do mini-game (fase 2)
}
```

Roteiro com ~30-40 cenas cobrindo os 4 caminhos da SME (Comunicacao, Criatividade, Coragem, Cooperacao), usando os mesmos elementos pedagogicos (escuta ativa, empatia, foco, etc).

#### 2. Layout Visual Novel cinematografico

Substituir o layout atual por uma estrutura inspirada no Nexo 2050:

```text
+--------------------------------------------------+
|  HUD: Ato/Progresso  |  Avatar 4K  | Bateria/Imp |
+--------------------------------------------------+
|                                                    |
|         AREA DE MIDIA (16:9)                       |
|         Background 4K + NPC overlay                |
|         + Particulas + Efeitos atmosfericos        |
|                                                    |
+--------------------------------------------------+
|  SPEAKER NAME                                      |
|  "Dialogo com typewriter effect..."                |
+--------------------------------------------------+
|  [ Escolha A ]  [ Escolha B ]  [ Escolha C ]      |
+--------------------------------------------------+
```

- Backgrounds em tela cheia com gradiente inferior para legibilidade
- NPC sprites com animacao de breathing
- Caixa de dialogo com glassmorphism e typewriter
- Escolhas com tom emocional (warning, success, info)

#### 3. Sistema de Avatar por modelos pre-configurados

Eliminar o builder SVG de cores. Substituir por **modelos pre-configurados de alta qualidade** (como Capsula do Tempo):

- Selecao por Matriz (Masculino/Feminino)
- Selecao por Etnia (representatividade)
- Selecao por Estilo visual
- Cada combinacao gera uma imagem 4K unica do avatar
- Avatar aparece no HUD durante toda a narrativa

#### 4. Motor de Visual Novel (`VisualNovelEngine.tsx`)

Componentes separados (nao monolitico):
- `DialogueBox.tsx` -- typewriter + speaker name
- `ChoicePanel.tsx` -- botoes de escolha com condicional de inventario
- `SceneMedia.tsx` -- background + NPC + efeitos
- `GameHud.tsx` -- progresso, avatar, stats
- `useStoryEngine.ts` -- hook central (cena atual, inventario, historico)

#### 5. Fluxo do jogo completo

```text
ATTRACT (tela titulo) 
  -> AVATAR SETUP (escolha de modelo pre-configurado)
  -> TOOLKIT (escolha de 3 habilidades SME)
  -> VISUAL NOVEL (narrativa ramificada com ~30 cenas)
     -> Pontos de decisao mudam o enredo
     -> Habilidades escolhidas afetam opcoes disponiveis
     -> [Fase 2: mini-games em pontos especificos]
  -> RESULT (selo final + resumo)
```

#### 6. Audio e atmosfera

Manter o AudioEngine sintetizado existente, mas mapear estados emocionais aos atos narrativos (nao apenas as telas fixas). Adicionar SFX para typewriter, escolhas, transicoes de cena.

#### 7. Arquitetura para mini-games (fase 2)

Cada `StoryScene` pode ter `miniGameSlot: string`. Quando definido, o motor pausa a narrativa e carrega um componente de mini-game. Por enquanto, esses slots ficam marcados mas nao implementados -- a estrutura estara pronta para receber mini-games 2D em pontos especificos.

### Arquivos a criar/reescrever

| Arquivo | Acao |
|---------|------|
| `src/game/data/storyData.ts` | CRIAR -- roteiro completo tipado |
| `src/game/data/avatarModels.ts` | CRIAR -- modelos pre-configurados |
| `src/game/engine/VisualNovelEngine.tsx` | CRIAR -- motor principal |
| `src/game/engine/useStoryEngine.ts` | CRIAR -- hook de estado narrativo |
| `src/game/engine/DialogueBox.tsx` | CRIAR -- caixa de dialogo + typewriter |
| `src/game/engine/ChoicePanel.tsx` | CRIAR -- painel de escolhas |
| `src/game/engine/SceneMedia.tsx` | CRIAR -- area de midia cinematografica |
| `src/game/engine/GameHud.tsx` | CRIAR -- HUD com avatar + stats |
| `src/game/scenes/AvatarSetup.tsx` | REESCREVER -- modelos 4K, nao SVG |
| `src/game/scenes/ToolkitScene.tsx` | MANTER -- ajustar para novo fluxo |
| `src/game/HeroiKioskLayout.tsx` | REESCREVER -- orquestrar VN engine |
| `src/game/types.ts` | REESCREVER -- novos tipos para VN |
| `src/styles/heroi-kiosk.css` | REESCREVER -- layout VN cinematografico |

### Limitacao importante

Nao tenho acesso direto ao `storyData.json` do Capsula do Tempo (rate limit do GitHub). Vou criar um roteiro novo baseado nos elementos da SME (ferramentas, nucleos, missao de restauracao) com a mesma estrutura de ramificacao (4 caminhos). Se voce puder colar o conteudo do `storyData.json` aqui, posso usar o roteiro exato.

