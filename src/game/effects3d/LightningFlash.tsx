import { useRef, useState, useCallback, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Dynamic lightning flash system.
 * Creates dramatic directional light flashes for tense moments.
 * Simulates real lightning with a quick bright flash followed by afterglow.
 */

interface Props {
  /** Enable automatic periodic flashes */
  active?: boolean;
  /** Average interval between flashes in seconds */
  interval?: number;
  /** Flash color */
  color?: string;
  /** Flash intensity multiplier */
  intensity?: number;
}

export default function LightningFlash({
  active = false,
  interval = 5,
  color = '#c0d0ff',
  intensity = 1.0,
}: Props) {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const flashState = useRef({ active: false, time: 0, phase: 0 });
  const nextFlash = useRef(Math.random() * interval + 2);

  const triggerFlash = useCallback(() => {
    flashState.current = { active: true, time: 0, phase: 0 };
  }, []);

  useFrame((_, delta) => {
    if (!active) {
      if (lightRef.current) lightRef.current.intensity = 0;
      if (ambientRef.current) ambientRef.current.intensity = 0;
      return;
    }

    // Auto-trigger
    nextFlash.current -= delta;
    if (nextFlash.current <= 0) {
      triggerFlash();
      nextFlash.current = interval * (0.5 + Math.random());
    }

    const flash = flashState.current;

    if (flash.active) {
      flash.time += delta;

      // Lightning pattern: quick flash -> dim -> secondary flash -> fade
      let brightness = 0;

      if (flash.time < 0.05) {
        // Initial bright flash
        brightness = (flash.time / 0.05) * 3.0;
      } else if (flash.time < 0.1) {
        // Quick dim
        brightness = 3.0 - ((flash.time - 0.05) / 0.05) * 2.5;
      } else if (flash.time < 0.15) {
        // Secondary flash (slightly weaker)
        brightness = 0.5 + ((flash.time - 0.1) / 0.05) * 1.5;
      } else if (flash.time < 0.6) {
        // Long afterglow fade
        const t = (flash.time - 0.15) / 0.45;
        brightness = 2.0 * Math.pow(1 - t, 2);
      } else {
        flash.active = false;
        brightness = 0;
      }

      brightness *= intensity;

      if (lightRef.current) {
        lightRef.current.intensity = brightness;
        // Slight position variation per flash
        lightRef.current.position.x = (Math.random() - 0.5) * 4;
      }
      if (ambientRef.current) {
        ambientRef.current.intensity = brightness * 0.15;
      }
    } else {
      if (lightRef.current) lightRef.current.intensity = 0;
      if (ambientRef.current) ambientRef.current.intensity = 0;
    }
  });

  if (!active) return null;

  return (
    <group>
      <directionalLight
        ref={lightRef}
        color={color}
        intensity={0}
        position={[0, 5, 2]}
        castShadow={false}
      />
      <ambientLight
        ref={ambientRef}
        color={color}
        intensity={0}
      />
    </group>
  );
}
