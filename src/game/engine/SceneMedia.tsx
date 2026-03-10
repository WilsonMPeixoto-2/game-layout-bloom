import { useRef, useEffect, useState } from 'react';
import type { NpcConfig, ParticlePreset } from '../types';
import ParticleLayer from '../effects/ParticleLayer';

interface Props {
  background: string;
  npc?: NpcConfig;
  particles?: ParticlePreset;
}

/**
 * SceneMedia — crossfade backgrounds and NPCs without remounting.
 * Uses dual-layer technique: prev layer fades out while new layer fades in.
 * No AnimatePresence or key-based remounting to prevent flickering.
 */
export default function SceneMedia({ background, npc, particles = 'dust' }: Props) {
  const [bgLayers, setBgLayers] = useState<{ src: string; opacity: number }[]>([
    { src: background, opacity: 1 },
  ]);
  const prevBg = useRef(background);

  // Crossfade background on change
  useEffect(() => {
    if (background === prevBg.current) return;
    prevBg.current = background;

    // Add new layer on top
    setBgLayers(prev => [...prev, { src: background, opacity: 0 }]);

    // Fade in new layer after a frame
    requestAnimationFrame(() => {
      setBgLayers(prev =>
        prev.map((l, i) =>
          i === prev.length - 1 ? { ...l, opacity: 1 } : { ...l, opacity: 0 }
        )
      );
    });

    // Remove old layers after transition
    const timer = setTimeout(() => {
      setBgLayers([{ src: background, opacity: 1 }]);
    }, 1200);

    return () => clearTimeout(timer);
  }, [background]);

  // NPC crossfade
  const [npcState, setNpcState] = useState<{ config: NpcConfig | undefined; opacity: number }>({
    config: npc,
    opacity: npc ? 1 : 0,
  });
  const prevNpc = useRef(npc?.name);

  useEffect(() => {
    const newName = npc?.name;
    if (newName === prevNpc.current) return;
    prevNpc.current = newName;

    if (!npc) {
      setNpcState(prev => ({ ...prev, opacity: 0 }));
      return;
    }

    // Fade out, swap, fade in
    setNpcState(prev => ({ ...prev, opacity: 0 }));
    const timer = setTimeout(() => {
      setNpcState({ config: npc, opacity: 1 });
    }, 400);

    return () => clearTimeout(timer);
  }, [npc]);

  return (
    <>
      {/* Background layers — pure CSS transitions, no remounting */}
      {bgLayers.map((layer, i) => (
        <div
          key={`bg-${i}-${layer.src}`}
          className="vn-background"
          style={{
            backgroundImage: `url(${layer.src})`,
            opacity: layer.opacity,
            transition: 'opacity 1s ease-out',
            zIndex: i,
          }}
        />
      ))}

      {/* Particle effects — stable, no key changes */}
      <ParticleLayer preset={particles} intensity={0.6} />

      {/* NPC sprite — CSS transition fade, no remounting */}
      {npcState.config && (
        <div
          className={`vn-npc vn-npc-${npcState.config.position || 'right'}`}
          style={{
            opacity: npcState.opacity,
            transition: 'opacity 0.5s ease-out',
          }}
        >
          <img src={npcState.config.image} alt={npcState.config.name} className="vn-npc-image" />
        </div>
      )}

      {/* Cinematic overlays */}
      <div className="vn-vignette" />
      <div className="vn-grain" />
      <div className="vn-bottom-gradient" />
    </>
  );
}
