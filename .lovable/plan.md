

# Plano: Migração Visual para React Three Fiber (R3F)

## Objetivo

Substituir o sistema de efeitos visuais baseado em CSS (`div` animados) por um pipeline 3D GPU-accelerated usando React Three Fiber, mantendo toda a lógica de jogo, narrativa, arte e identidade visual intactas. Instalar também o motor de física Rapier para uso futuro em minigames 3D.

---

## Dependências a Instalar

| Pacote | Versão | Uso |
|--------|--------|-----|
| `three` | `^0.160.0` | Motor 3D base |
| `@react-three/fiber` | `^8.18.0` | Integração React ↔ Three.js |
| `@react-three/drei` | `^9.122.0` | Helpers (Stars, Float, Sparkles, Text, etc.) |
| `@react-three/postprocessing` | `^2.16.0` | Bloom, Vignette, ChromaticAberration, GodRays |
| `@react-three/rapier` | `^1.5.0` | Motor de física Jolt/Rapier (para minigames futuros) |

---

## Arquitetura da Migração

```text
┌─────────────────────────────────────────────┐
│              heroi-root (HTML)               │
│  ┌────────────────────────────────────────┐  │
│  │  SceneCanvas3D (R3F Canvas, fullscreen)│  │
│  │  ├── BackgroundPlane (textura 2D)      │  │
│  │  ├── GPUParticles (InstancedMesh)      │  │
│  │  ├── LightShafts3D (volumetric planes) │  │
│  │  ├── AmbientLighting                   │  │
│  │  └── EffectComposer                    │  │
│  │      ├── Bloom (threshold, intensity)  │  │
│  │      ├── Vignette                      │  │
│  │      └── ChromaticAberration           │  │
│  └────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │  UI 2D Overlay (HTML/CSS, z-index)     │  │
│  │  ├── DialogueBox                       │  │
│  │  ├── ChoicePanel                       │  │
│  │  ├── GameHud                           │  │
│  │  ├── Minigames                         │  │
│  │  └── TitleScreen / AvatarSetup / etc.  │  │
│  └────────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

A UI 2D (diálogos, HUD, choices, minigames) permanece em HTML/Tailwind sobreposta ao canvas 3D via `position: absolute`. Toda a beleza visual (partículas, luz, bloom, vignette) migra para o pipeline GPU.

---

## Componentes a Criar/Migrar

### 1. `SceneCanvas3D.tsx` (NOVO)
- Canvas R3F fullscreen com câmera ortográfica
- Recebe props: `background`, `particles`, `emotion`, `variant`
- Contém todos os elementos 3D e post-processing
- Substituirá os componentes `ParticleLayer`, `LightShafts`, `FloatingDust`, `MagicSparks`, `EnergyFlow`, `TriumphBurst` e `ReawakeningGlow`

### 2. `GPUParticles.tsx` (NOVO)
- Usa `InstancedMesh` com `BufferAttribute` para posição, cor, escala
- Shader customizado GLSL que anima posição/opacidade na GPU
- Suporta presets: `dust`, `sparks`, `energy`, `bloom`, `triumph`
- 5.000-10.000 partículas (vs. 200 divs atuais) sem impacto na CPU

### 3. `VolumetricLight.tsx` (NOVO)
- Planos 3D com material transparente e gradiente que simulam raios de luz
- Animação de rotação e opacidade via `useFrame`
- Substitui o `LightShafts.tsx` atual

### 4. `PostProcessingStack.tsx` (NOVO)
- `EffectComposer` com:
  - **Bloom**: threshold 0.3, intensity 1.5, luminanceSmoothing 0.9
  - **Vignette**: darkness 0.7 (substitui `.vn-vignette` CSS)
  - **ChromaticAberration**: offset sutil (substitui `::after` CSS)
- Parâmetros ajustáveis por `emotion` state

### 5. `BackgroundPlane.tsx` (NOVO)
- Plano 3D texturizado com a imagem de fundo
- Crossfade via transição de opacidade entre duas texturas (mesmo padrão A/B atual)
- Parallax sutil via `useFrame` (micro-movimento baseado no tempo)

### 6. Migração do `SceneMedia.tsx`
- Remover renderização de backgrounds via CSS `backgroundImage`
- Remover imports de `ParticleLayer`, `LightShafts`
- Integrar `SceneCanvas3D` como único componente de fundo
- Manter lógica de NPC sprites em HTML overlay (sobre o canvas)

---

## Componentes que NÃO mudam

- `DialogueBox.tsx` — permanece HTML
- `ChoicePanel.tsx` — permanece HTML
- `GameHud.tsx` — permanece HTML
- `VisualNovelEngine.tsx` — lógica intacta, apenas troca SceneMedia interno
- `HeroiKioskLayout.tsx` — sem alterações
- `AudioEngine.ts` — sem alterações
- Todos os 4 minigames — permanecem HTML (preparados para futura migração 3D com Rapier)
- `storyData.ts`, `types.ts`, `avatarModels.ts` — sem alterações
- `heroi-kiosk.css` — simplificado (remove `.vn-vignette`, `.vn-grain`, `.vn-background`, chromatic aberration CSS, pois migram para post-processing 3D)

---

## Efeitos Visuais 3D por Cena

| Cena | Partículas | Luz | Post-Processing |
|------|-----------|-----|-----------------|
| Title | bloom (sparks + dust, 8000) | God rays dourados | Bloom alto, Vignette forte |
| Avatar | sparks (3000) | Ambiental suave | Bloom médio |
| Toolkit | sparks (4000) | Raios laterais | Bloom médio |
| Story (dormant) | dust (5000) | Sombrio, feixes finos | Bloom baixo, Vignette forte |
| Story (wonder) | bloom (6000) | Raios dourados | Bloom alto |
| Story (restoration) | energy (5000, convergente) | Crescente, halo central | Bloom crescente |
| Story (triumph) | triumph burst (10000) | Explosão radial | Bloom máximo |
| Result | triumph (8000) | Halo glorioso | Bloom alto |

---

## Ordem de Implementação

1. Instalar dependências (three, R3F, drei, postprocessing, rapier)
2. Criar `SceneCanvas3D` com câmera, iluminação e EffectComposer básico
3. Criar `BackgroundPlane` com crossfade de texturas
4. Criar `GPUParticles` com InstancedMesh e presets
5. Criar `VolumetricLight` (raios de luz 3D)
6. Integrar `SceneCanvas3D` no `SceneMedia` substituindo os efeitos CSS
7. Limpar CSS obsoleto (vignette, grain, chromatic aberration)
8. Ajustar intensidades e calibrar para OLED HDR 600

---

## Detalhes Técnicos Relevantes

- O canvas R3F usa `style={{ position: 'absolute', inset: 0, zIndex: 0 }}` e a UI HTML fica com `zIndex > 10`
- `@react-three/rapier` será importado mas não usado ativamente — ficará disponível para quando os minigames evoluírem para 3D
- Film grain será recriado como um shader de post-processing customizado em vez do SVG noise atual
- O `useFrame` do R3F roda no requestAnimationFrame nativo, garantindo 60fps sem setInterval

