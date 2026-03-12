import { Suspense, memo, useState, useEffect, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import BackgroundPlane from './BackgroundPlane';
import GPUParticles from './GPUParticles';
import VolumetricLight from './VolumetricLight';
import ReawakeningGlow3D from './ReawakeningGlow3D';
import PostProcessingStack from './PostProcessingStack';
import NpcPlane3D from './NpcPlane3D';

import ParallaxCamera from './ParallaxCamera';
import AtmosphericLayers from './AtmosphericLayers';
import FloatingRunes from './FloatingRunes';
import LightningFlash from './LightningFlash';
import type { ParticlePreset, EmotionalState, NpcConfig } from '../types';

interface Props {
  background: string;
  particles?: ParticlePreset;
  emotion?: EmotionalState;
  variant?: 'title' | 'story' | 'result';
  lightVariant?: 'title' | 'triumph' | 'subtle';
  lightIntensity?: number;
  restorationProgress?: number;
  lightning?: boolean;
  npc?: NpcConfig;
}

interface DebugFlags {
  bloom: boolean;
  atmosphere: boolean;
  volumetric: boolean;
  particles: boolean;
  runes: boolean;
  npc: boolean;
}

const DEFAULT_FLAGS: DebugFlags = {
  bloom: true,
  atmosphere: true,
  volumetric: true,
  particles: true,
  runes: true,
  npc: true,
};

function SceneCanvas3D({
  background,
  particles = 'dust',
  emotion = 'dormant',
  variant = 'story',
  lightVariant,
  lightIntensity = 1.0,
  restorationProgress = 0,
  lightning = false,
  npc,
}: Props) {
  const [showDebug, setShowDebug] = useState(false);
  const [flags, setFlags] = useState<DebugFlags>(DEFAULT_FLAGS);

  // Triple-tap top-left corner to toggle debug panel
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDebugTap = useCallback(() => {
    tapCountRef.current++;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => { tapCountRef.current = 0; }, 600);
    if (tapCountRef.current >= 3) {
      setShowDebug(prev => !prev);
      tapCountRef.current = 0;
    }
  }, []);

  // Keyboard shortcut: Ctrl+Shift+D
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setShowDebug(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const toggleFlag = (key: keyof DebugFlags) => {
    setFlags(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const parallaxStrength = variant === 'title' ? 0.18 : variant === 'result' ? 0.12 : 0.15;
  const runeCount = emotion === 'triumph' ? 8 : emotion === 'restoration' ? 7 : emotion === 'wonder' ? 6 : 4;

  return (
    <>
      <Canvas
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.95,
        }}
        camera={{
          position: [0, 0, 2],
          fov: 60,
          near: 0.1,
          far: 10,
        }}
        dpr={[1, 1.25]}
        performance={{ min: 0.6 }}
      >
        <color attach="background" args={['#020810']} />

        <ParallaxCamera strength={parallaxStrength} smoothing={2.5} breathe />

        <Suspense fallback={null}>
          <BackgroundPlane src={background} />
        </Suspense>

        {flags.atmosphere && <AtmosphericLayers emotion={emotion} />}

        {flags.runes && <FloatingRunes emotion={emotion} count={runeCount} />}

        {flags.particles && <GPUParticles preset={particles} intensity={1.0} />}

        {flags.npc && <NpcPlane3D npc={npc} />}

        {flags.volumetric && (
          <VolumetricLight
            variant={lightVariant || 'subtle'}
            intensity={lightIntensity}
          />
        )}

        <LightningFlash active={lightning} interval={6} intensity={1.2} />

        {restorationProgress > 0 && (
          <ReawakeningGlow3D progress={restorationProgress} />
        )}

        {flags.bloom && <PostProcessingStack emotion={emotion} variant={variant} />}
      </Canvas>

      {/* Debug A/B toggle panel */}
      {showDebug && (
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.85)',
            borderRadius: 8,
            padding: '8px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            fontFamily: 'monospace',
            fontSize: 11,
            color: '#fff',
            pointerEvents: 'auto',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 10, color: '#ffd740', marginBottom: 2 }}>
            🔧 DEBUG A/B
          </div>
          {(Object.keys(flags) as (keyof DebugFlags)[]).map(key => (
            <label
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
                opacity: flags[key] ? 1 : 0.5,
              }}
            >
              <input
                type="checkbox"
                checked={flags[key]}
                onChange={() => toggleFlag(key)}
                style={{ accentColor: '#ffd740', width: 14, height: 14 }}
              />
              {key}
            </label>
          ))}
          <button
            onClick={() => setFlags(DEFAULT_FLAGS)}
            style={{
              marginTop: 4,
              padding: '3px 6px',
              fontSize: 10,
              background: 'rgba(255,215,64,0.2)',
              color: '#ffd740',
              border: '1px solid rgba(255,215,64,0.3)',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Reset All
          </button>
        </div>
      )}

      {/* Invisible tap zone for mobile debug activation */}
      <div
        onClick={handleDebugTap}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 60,
          height: 60,
          zIndex: 9998,
          pointerEvents: 'auto',
        }}
      />
    </>
  );
}

export default memo(SceneCanvas3D);
