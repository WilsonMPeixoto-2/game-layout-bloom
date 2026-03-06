# Manifesto Estético — Herói do Futuro (Herói Kiosk)

> "Uma experiência arcade cinematográfica, curta e altamente polida, que lê o universo da SME através de uma fantasia luminosa, poética e aventureira."

---

## 1. Visão Central

O Herói Kiosk é uma **fantasia cinematográfica luminosa** — uma experiência arcade premium de ~3 minutos que deve parecer feita por um pequeno estúdio excepcional, não por um protótipo de app.

### Princípios fundamentais
- **Fantasia luminosa**: o mundo é belo, encantado e vivo — não sombrio ou opressivo
- **Aventura mágica**: cada tela deve transmitir sensação de jornada e descoberta
- **Delicadeza emocional**: a experiência toca o jogador com calor, não com agressividade
- **Grandiosidade controlada**: momentos épicos existem, mas dentro de uma experiência curta e focada
- **Carisma visual**: tudo — personagem, cenários, UI — deve ter personalidade e encanto
- **Concept art jogável**: cada frame do jogo deve parecer uma ilustração premium interativa

### Leitura do universo SME
O roteiro, contextos e valores da SME são mantidos a 100%. A direção artística eleva a apresentação para o nível de uma fantasia premium, traduzindo conceitos pedagógicos (escuta ativa, empatia, cooperação, etc.) em artefatos mágicos e aventura poética.

### O que NÃO é o projeto
- Não é um dashboard gamificado
- Não é um "jogo de escola" infantilizado
- Não é cyberpunk duro/sombrio
- Não é mundo aberto ou sandbox
- Não é cópia de nenhum jogo específico

---

## 2. Paleta Emocional

A cor muda conforme a jornada emocional do jogador:

### Arco cromático por tela

| Tela | Emoção | Paleta |
|------|--------|--------|
| **ATTRACT** | Convite / Encantamento / Promessa | Azuis profundos + dourado quente + luzes etéreas — mundo adormecido mas belo |
| **INTRO** | Mistério / Expectativa / Poesia | Índigos + roxos suaves + partículas de luz — prólogo cinematográfico |
| **AVATAR** | Descoberta / Identidade / Calor | Teals quentes + âmbar + rosa-pêssego — encontro consigo |
| **TOOLKIT** | Preparação / Curiosidade / Energia | Verdes luminosos + turquesa + dourado — arsenal encantado |
| **REPAIR** | Clímax / Restauração / Brilho crescente | Violeta → cyan → dourado progressivo — o mundo reacende |
| **RESULT** | Renascimento / Vitória / Esperança | Dourado quente + verde vivo + luz volumétrica — florescimento |

### Cores-base do sistema
- **Primária**: Dourado quente luminoso `#F0C040` → `#FFD700`
- **Secundária**: Cyan encantado `#4DD9E8` → `#00BCD4`
- **Acento mágico**: Violeta luminoso `#B388FF` → `#9C5FFF`
- **Calor**: Pêssego/âmbar `#FFAB76` → `#FF8A50`
- **Sucesso**: Verde renascimento `#69F0AE` → `#00E676`
- **Texto**: Marfim quente `#FFF8F0` (não branco puro)
- **Fundo**: Azul noturno profundo `#0A1628` → `#0F1D32` (noite encantada, não industrial)

### Regras cromáticas
- Nunca usar cinza frio puro — sempre com um toque de azul ou âmbar
- Gradientes devem fluir organicamente, como luz natural
- A paleta deve transmitir calor mesmo em momentos de tensão

---

## 3. Luz e Atmosfera

### Bloom e Glow
- Bloom **orgânico** e suave — como luar ou sol nascente, não como neon industrial
- Glow em elementos interativos deve pulsar suavemente, como respiração
- Partículas de luz flutuantes (tipo poeira em raio de sol) em cenas contemplativas

### Vinheta
- Vinheta elegante e sutil nos cantos — tipo lente de cinema
- Mais pronunciada nas telas narrativas (ATTRACT, INTRO, RESULT)
- Mais leve nas telas interativas (AVATAR, TOOLKIT, REPAIR)

### Profundidade
- Usar camadas de parallax sutil para criar profundidade nos backgrounds
- Névoa/atmosfera leve para separar planos (foreground, midground, background)
- Granulação cinematográfica discreta (~2-4% opacity) para textura orgânica

### Iluminação emocional
- A luz conta a história: começa contida (ATTRACT), cresce (REPAIR), floresce (RESULT)
- Contraluzes e rim lights no avatar para dar presença e carisma
- Volumetric light shafts na cena de resultado

---

## 4. Personagem / Avatar

### Carisma
- O avatar deve ter **presença** — não ser apenas uma miniatura funcional
- Silhueta reconhecível e expressiva mesmo em tamanho pequeno
- Olhos expressivos com brilho (catchlight)

### Movimento idle
- Respiração suave (scale Y sutil)
- Flutuação leve (como levitando sobre plataforma)
- Cabelo/acessórios com micro-movimento (se possível via CSS/SVG)
- Piscar de olhos natural

### Pedestal / Apresentação
- O avatar deve aparecer em contexto (plataforma luminosa, círculo mágico, etc.)
- Não deve parecer "colado sobre fundo" — deve parecer habitando o mundo
- Na tela AVATAR, deve ter destaque de herói (iluminação especial, partículas ao redor)

### Expressão
- Sorriso delicado, não caricato
- Postura confiante mas acolhedora
- Acessórios devem ter brilho e personalidade

---

## 5. Backgrounds

### Princípio central
> Cada background deve parecer um frame de concept art de um jogo premium — nunca um gradiente genérico.

### Características obrigatórias
- **Profundidade**: múltiplos planos visíveis (céu, montanhas/estruturas distantes, midground, foreground)
- **Poesia visual**: elementos que contam história (ruínas belas, árvores luminosas, energia fluindo)
- **Composição**: respeitando regra dos terços, com espaço para UI sem competir
- **Atmosfera**: luz volumétrica, névoa, partículas — o ar tem textura

### Por tela
- **ATTRACT**: Vista panorâmica de um mundo adormecido mas belo — cidade/estação vista de longe com luzes fracas e céu vasto
- **INTRO**: Interior próximo — corredor ou câmara com elementos narrativos, luz lateral
- **AVATAR**: Sala/câmara de preparação — plataforma luminosa, tecnologia orgânica, sensação de santuário
- **TOOLKIT**: Arsenal/biblioteca encantada — prateleiras/displays brilhantes, luz quente
- **REPAIR**: Coração da estação — núcleo energético visto de perto, energia fluindo entre condutos, intenso e belo
- **RESULT**: O mundo renascido — paisagem aberta, verde, luz dourada, horizonte esperançoso

---

## 6. Motion Design

### Cada tela é uma cena
- Transições entre telas devem ter **assinatura dramática própria**
- Não repetir o mesmo fade/slide em tudo
- O ritmo deve seguir a curva emocional: lento/contemplativo → rápido/energético → majestoso

### Vocabulário de motion
- **ATTRACT → INTRO**: Zoom-in suave (entrando no mundo)
- **INTRO → AVATAR**: Dissolve com partículas de luz (descoberta)
- **AVATAR → TOOLKIT**: Slide lateral + glow trail (preparação)
- **TOOLKIT → REPAIR**: Fade-to-bright → reveal (começando a missão)
- **REPAIR → RESULT**: Burst de energia → fade para luz dourada (restauração completa)

### Micro-interações
- Botões: glow sutil no hover, scale suave no tap, partículas no click de ações importantes
- Cards de ferramentas: elevação + brilho ao selecionar
- Slots do módulo: pulsação antes de restaurar, burst ao completar

### Performance
- Usar `will-change` com moderação
- Respeitar `prefers-reduced-motion`
- Animações CSS para loops, framer-motion para transições complexas

---

## 7. Som e Música

### Identidade sonora central
> "Fantasia luminosa com aventura, esperança, delicadeza e energia mágica."

### Texturas desejadas
- Cordas etéreas, piano suave, sintetizadores orgânicos
- Percussão leve e mágica (não batidas eletrônicas pesadas)
- Elementos de natureza sutis (vento, água, cristais)
- Harpa, flauta, celesta para momentos de encanto

### Arquitetura emocional por tela

| Tela | Estado Emocional | Descrição Musical |
|------|-----------------|-------------------|
| **ATTRACT** | Wonder | Textura etérea + pulsação leve + convite à aventura |
| **INTRO** | Dormant → Wonder | Atmosfera poética, mundo antigo, expectativa |
| **AVATAR** | Wonder | Tema caloroso e bonito, descoberta de identidade |
| **TOOLKIT** | Preparation | Pulso de preparação, curiosidade, energia leve |
| **REPAIR** | Restoration | Base rítmica mais viva, energia crescente, mágica |
| **RESULT** | Triumph | Stinger memorável + recompensa esperançosa |

### Sound design
- UI sounds: premium e delicados (cristal, sino suave, click macio)
- Confirmações: "punch" sem agressividade (tone up melódico)
- Acertos no Repair: sons mágicos/energéticos (chime + whoosh)
- Vitória: memorável e elegante (stinger orquestral curto)
- Silêncio é ferramenta: usar pausas dramáticas antes de momentos-chave

### O que evitar
- Trilha genérica de "app tecnológico"
- Música infantil alegre demais
- Loops repetitivos sem variação
- Sons de UI de sistema operacional

---

## 8. O que Evitar — Lista Definitiva

- ❌ Infantilização (visual ou sonora)
- ❌ Visual genérico de dashboard/painel corporativo
- ❌ Excesso de cyberpunk duro/industrial
- ❌ VFX sem propósito (efeitos por efeitos)
- ❌ UI sem poesia visual
- ❌ Gradientes genéricos como fundo
- ❌ Tipografia sem personalidade
- ❌ Fundo "colado" sem profundidade
- ❌ Personagem sem carisma ou presença
- ❌ Trilha de "minigame genérico"
- ❌ Copiar assets/mecânicas de jogos de referência
- ❌ Branco puro, cinza puro, preto puro
- ❌ Animações repetitivas e previsíveis

---

## Critério Final

> Toda decisão visual, sonora ou de motion deve passar por este filtro:
>
> **"Isso transmite beleza, emoção, legibilidade e impacto institucional?"**
>
> Se a resposta for "não" para qualquer um desses quatro critérios, a decisão deve ser revisada.

---

*Este manifesto é a bússola permanente do projeto. Todo PR de UI, VFX, backgrounds, áudio e motion deve estar alinhado com esta visão.*
