import { useRef, useEffect, useState, memo } from 'react';
import type { NpcConfig, ParticlePreset } from '../types';
import ParticleLayer from '../effects/ParticleLayer';

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
}

function SceneMedia({ background, npc, particles = 'dust' }: Props) {
  const [layerA, setLayerA] = useState(background);
  const [layerB, setLayerB] = useState('');
  const [activeLayer, setActiveLayer] = useState<'A' | 'B'>('A');
  const prevBg = useRef(background);
  const isFirstRender = useRef(true);

  // Preload new background before showing
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (background === prevBg.current) return;
    prevBg.current = background;

    // Ensure image is loaded before crossfading
    const img = new Image();
    img.onload = () => {
      if (activeLayer === 'A') {
        setLayerB(background);
        requestAnimationFrame(() => setActiveLayer('B'));
      } else {
        setLayerA(background);
        requestAnimationFrame(() => setActiveLayer('A'));
      }
    };
    img.src = background;
  }, [background, activeLayer]);

  // NPC fade
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
      <div
        className="vn-background"
        style={{
          backgroundImage: layerA ? `url(${layerA})` : 'none',
          opacity: activeLayer === 'A' ? 1 : 0,
          transition: 'opacity 1.2s ease-in-out',
          zIndex: 0,
        }}
      />
      <div
        className="vn-background"
        style={{
          backgroundImage: layerB ? `url(${layerB})` : 'none',
          opacity: activeLayer === 'B' ? 1 : 0,
          transition: 'opacity 1.2s ease-in-out',
          zIndex: 1,
        }}
      />

      <ParticleLayer preset={particles} intensity={0.6} />

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

      <div className="vn-vignette" />
      <div className="vn-grain" />
      <div className="vn-bottom-gradient" />
    </>
  );
}

export default memo(SceneMedia);
