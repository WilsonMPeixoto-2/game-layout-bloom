# Direção Sonora — Herói do Futuro (Herói Kiosk)

> "A música e o som devem ser parte da dramaturgia do jogo, não apenas som de fundo."

---

## 1. Conceito Musical Central

**Fantasia luminosa com aventura, esperança, delicadeza e energia mágica.**

A trilha sonora deve parecer a de um curta-metragem de animação premium — não a de um app gamificado. Cada nota deve servir à narrativa emocional da jornada do jogador.

---

## 2. Linguagem Emocional por Tela

### ATTRACT — "O Convite"
- **Emoção**: Encantamento, promessa, mistério belo
- **Textura**: Pad etéreo + piano espaçado + partículas sonoras cristalinas
- **Dinâmica**: Pp → mp — cresce sutilmente ao longo dos segundos
- **Referência de sensação**: Abrir a porta de um mundo mágico

### INTRO — "O Prólogo"
- **Emoção**: Atmosfera narrativa, expectativa, seriedade poética
- **Textura**: Cordas sustentadas + voz sintetizada distante + textura de vento
- **Dinâmica**: Estável, contemplativo — como narração de um mito
- **Referência de sensação**: A voz de um sábio contando uma história antiga

### AVATAR — "O Encontro"
- **Emoção**: Calor, descoberta, identidade, carisma
- **Textura**: Tema melódico principal (piano + flauta ou celesta) + harpa delicada
- **Dinâmica**: Tema simples e memorável que o jogador pode reconhecer
- **Referência de sensação**: Olhar no espelho e se reconhecer como herói

### TOOLKIT — "A Preparação"
- **Emoção**: Curiosidade, energia leve, determinação crescente
- **Textura**: Percussão leve + arpejos + pulso rítmico suave
- **Dinâmica**: Mais rítmico que as anteriores, sensação de "montando o kit"
- **Referência de sensação**: Guardar itens na mochila antes da jornada

### REPAIR — "A Restauração"
- **Emoção**: Clímax, energia, brilho, progresso, restauração
- **Textura**: Base rítmica viva + camadas que entram conforme progresso + stingers nos acertos
- **Dinâmica**: Cresce em intensidade com cada núcleo restaurado
- **Referência de sensação**: Reacender as luzes de um mundo

### RESULT — "O Renascimento"
- **Emoção**: Vitória luminosa, esperança, orgulho, florescimento
- **Textura**: Stinger orquestral curto + tema de resolução + ambiente sereno
- **Dinâmica**: Forte → resolve para calma → final majestoso
- **Referência de sensação**: O nascer do sol após a noite mais longa

---

## 3. Instrumentos e Texturas Desejadas

### Usar
- Piano (suave, espaçado, emocional)
- Cordas (sustentadas para atmosfera, staccato para energia)
- Harpa, celesta, glockenspiel (encanto)
- Flauta, ocarinas (aventura, natureza)
- Sintetizadores orgânicos (pads, texturas)
- Percussão suave (frame drum, shaker, soft timpani)
- Elementos de natureza (vento, água, cristais)

### Evitar
- Batidas eletrônicas pesadas (EDM, dubstep)
- Guitarras distorcidas
- Sintetizadores agressivos/industriais
- Loops genéricos de "tech startup"
- Música infantil caricata (xilofone alegre demais)

---

## 4. Sound Design de UI

| Ação | Som | Qualidade |
|------|-----|-----------|
| Hover em botão | Toque cristalino suave | Curto, delicado |
| Click de confirmação | Tone up melódico + click macio | Satisfatório, premium |
| Seleção de ferramenta | Chime + shimmer | Mágico, colecionável |
| Armar ferramenta | Whoosh suave + lock | Preparação |
| Aplicar ferramenta no slot | Impact mágico + harmônico | Energético, belo |
| Slot restaurado (ONLINE) | Burst melódico + resolução | Recompensa emocional |
| Combo ativado | Camada extra de brilho | Crescente |
| Missão completa | Stinger orquestral | Memorável, majestoso |
| Erro / tempo baixo | Tom grave suave | Urgência sem pânico |

### Regras
- Nenhum som deve ser irritante em repetição
- Silêncio é uma ferramenta dramática — usar antes de momentos-chave
- Ducking automático quando narrativa ou grandes efeitos ocorrem
- Todos os sons devem ter fallback gracioso se áudio indisponível

---

## 5. Sistema Musical por Estado Emocional

### Estados
```
dormant   → mundo adormecido, antes de começar
wonder    → encantamento, descoberta
preparation → montando, escolhendo, se preparando
restoration → clímax, energia crescente, restauração ativa
triumph   → vitória, renascimento, esperança
```

### Mapeamento
```
ATTRACT  → wonder
INTRO    → dormant → wonder (crossfade)
AVATAR   → wonder
TOOLKIT  → preparation
REPAIR   → restoration (com camadas de intensidade)
RESULT   → triumph
```

### Transições
- Fade suave (2-3s) entre estados emocionais
- Stingers pontuais não interrompem o loop principal
- No REPAIR, camadas adicionais entram conforme progresso (0/4 → 1/4 → ...)

---

*Este documento orienta toda decisão de áudio e música. Cada som deve servir à fantasia luminosa e aventureira que o projeto propõe.*
