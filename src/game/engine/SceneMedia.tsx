import { useRef, useEffect, useState, memo } from 'react';
import type { NpcConfig, ParticlePreset, EmotionalState } from '../types';
import SceneCanvas3D from '../effects3d/SceneCanvas3D';

// Preload all background images on app start
const preloadedImages = new Set<string>();
function preloadImage(src: string) {
  if (!src || preloadedImages.has(src)) return;
  preloadedImages.add(src);
  const img = new Image();
  img.src = src;
}

// Eagerly preload all known backgrounds
const bgModules = import.meta.glob('/src/assets/bg-*.jpg', { eager: true, as: 'url' });
Object.values(bgModules).forEach((url) => preloadImage(url as string));

interface Props {
  background: string;
  npc?: NpcConfig;
  particles?: ParticlePreset;
  emotion?: EmotionalState;
  lightVariant?: 'title' | 'triumph' | 'subtle';
  lightIntensity?: number;
  restorationProgress?: number;
}

function SceneMedia({
  background,
  npc,
  particles = 'dust',
  emotion = 'dormant',
  lightVariant,
  lightIntensity = 1.0,
  restorationProgress = 0,
}: Props) {
  // NPC fade logic
  const [currentNpc, setCurrentNpc] = useState(npc);
  const [npcVisible, setNpcVisible] = useState(!!npc);
  const prevNpcName = useRef(npc?.name);

  useEffect(() => {
    const newName = npc?.name;
    if (newName === prevNpcName.current) return;
    prevNpcName.current = newName;

    if (!npc) {
      setNpcVisible(false);
      return;
    }

    setNpcVisible(false);
    const timer = setTimeout(() => {
      setCurrentNpc(npc);
      setNpcVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [npc]);

  return (
    <>
      {/* R3F Canvas: background, particles, volumetric light, post-processing */}
      <SceneCanvas3D
        background={background}
        particles={particles}
        emotion={emotion}
        variant="story"
        lightVariant={lightVariant}
        lightIntensity={lightIntensity}
        restorationProgress={restorationProgress}
      />

      {/* NPC sprites remain as HTML overlay */}
      {currentNpc && (
        <div
          className={`vn-npc vn-npc-${currentNpc.position || 'right'}`}
          style={{
            opacity: npcVisible ? 1 : 0,
            transition: 'opacity 0.6s ease-out',
          }}
        >
          <img src={currentNpc.image} alt={currentNpc.name} className="vn-npc-image" />
        </div>
      )}

      {/* Bottom gradient for dialogue readability */}
      <div className="vn-bottom-gradient" />
    </>
  );
}

export default memo(SceneMedia);
