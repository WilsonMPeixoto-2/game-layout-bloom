

## Hardware de Alta Performance: O que isso muda no projeto

Anotado. O target sendo **notebooks gamer + Samsung Odyssey 3D de ultima geracao** elimina todas as preocupacoes de performance que levantei na analise do Capsula do Tempo e abre possibilidades significativas.

---

### O que deixa de ser preocupacao

- Quantidade de particulas (pode usar centenas, nao dezenas)
- Framer-motion para animacoes de particulas (JS-driven e aceitavel)
- Imagens 4K de background (sem necessidade de lazy loading agressivo)
- Backdrop-filter blur em multiplas camadas simultaneas
- Web Audio API com multiplos osciladores e efeitos
- Animacoes CSS complexas rodando em paralelo

### O que isso desbloqueia para o Heroi Kiosk

1. **Particulas abundantes e ricas** -- poeira luminosa, faiscas magicas, energia liquida fluindo entre condutos, tudo com physics suave via framer-motion
2. **Backgrounds em resolucao maxima** -- concept art em 4K nativo para o Odyssey 3D, sem compressao agressiva
3. **Camadas de efeitos sobrepostos** -- film grain + vinheta + bloom + particulas + glassmorphism simultaneos sem preocupacao com FPS
4. **Audio sintetizado rico** -- multiplos drones com filtros, reverb e delay via Web Audio API, crossfades suaves entre estados emocionais
5. **Transicoes cinematograficas elaboradas** -- cada cena pode ter sua propria coreografia de entrada/saida com multiplos elementos animados simultaneamente
6. **SVG avatar com animacoes complexas** -- breathing, hair physics, glow pulsante, rim light animado, tudo rodando junto

### Proximos passos recomendados

Quando quiser avancar para implementacao, a ordem logica seria:

1. **Reescrever o layout como Visual Novel Engine** -- inspirado na arquitetura data-driven do Capsula do Tempo, mas com TypeScript e a estetica de fantasia luminosa
2. **Sistema de particulas cinematografico** -- componentes dedicados (FloatingDust, MagicSparks, EnergyFlow) sem restricoes de quantidade
3. **Audio Engine sintetizado** -- Web Audio API com estados emocionais (wonder, preparation, restoration, triumph) e crossfade suave
4. **Backgrounds em alta resolucao** -- gerar concept art 4K para cada cena
5. **Logica de gameplay real** -- timer, energia, combos, progressao

