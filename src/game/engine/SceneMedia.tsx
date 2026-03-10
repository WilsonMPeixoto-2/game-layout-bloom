import { useRef, useEffect, useState } from 'react';
import type { NpcConfig, ParticlePreset } from '../types';
import ParticleLayer from '../effects/ParticleLayer';

interface Props {
  background: string;
  npc?: NpcConfig;
  particles?: ParticlePreset;
}

/**
 * SceneMedia — two persistent background divs that crossfade.
 * No dynamic keys, no array manipulation, no remounting.
 */
export default function SceneMedia({ background, npc, particles = 'dust' }: Props) {
  // Two persistent layers: A and B. We alternate which is "active".
  const [layerA, setLayerA] = useState(background);
  const [layerB, setLayerB] = useState('');
  const [activeLayer, setActiveLayer] = useState<'A' | 'B'>('A');
  const prevBg = useRef(background);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (background === prevBg.current) return;
    prevBg.current = background;

    // Load new image into inactive layer, then swap
    if (activeLayer === 'A') {
      setLayerB(background);
      // Wait for image to be set, then fade
      setTimeout(() => setActiveLayer('B'), 50);
    } else {
      setLayerA(background);
      setTimeout(() => setActiveLayer('A'), 50);
    }
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

    // Fade out, swap, fade in
    setNpcVisible(false);
    const timer = setTimeout(() => {
      setCurrentNpc(npc);
      setNpcVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [npc]);

  return (
    <>
      {/* Two persistent background layers — never remounted */}
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

      {/* Particles — stable */}
      <ParticleLayer preset={particles} intensity={0.6} />

      {/* NPC — single persistent element, CSS fade only */}
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

      {/* Cinematic overlays */}
      <div className="vn-vignette" />
      <div className="vn-grain" />
      <div className="vn-bottom-gradient" />
    </>
  );
}
