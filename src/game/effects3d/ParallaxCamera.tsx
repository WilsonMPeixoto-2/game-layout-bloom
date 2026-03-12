import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Parallax camera controller.
 * Reacts to mouse position (desktop) or device orientation (mobile).
 * Moves the camera subtly to create depth in the 2.5D diorama.
 */

interface Props {
  /** Max offset in world units */
  strength?: number;
  /** Smoothing factor (lower = smoother) */
  smoothing?: number;
  /** Enable subtle idle breathing when no input */
  breathe?: boolean;
}

export default function ParallaxCamera({
  strength = 0.15,
  smoothing = 2.0,
  breathe = true,
}: Props) {
  const { camera } = useThree();
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const hasGyro = useRef(false);

  useEffect(() => {
    const baseX = 0;
    const baseY = 0;

    // Mouse tracking
    const handleMouse = (e: MouseEvent) => {
      // Normalize -1 to 1
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      targetX.current = nx * strength;
      targetY.current = ny * strength * 0.6; // Less vertical movement
    };

    // Touch tracking
    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const nx = (touch.clientX / window.innerWidth) * 2 - 1;
      const ny = -(touch.clientY / window.innerHeight) * 2 + 1;
      targetX.current = nx * strength;
      targetY.current = ny * strength * 0.6;
    };

    // Device orientation (gyroscope)
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      hasGyro.current = true;
      // gamma: left-right tilt (-90 to 90), beta: front-back tilt (-180 to 180)
      const nx = THREE.MathUtils.clamp(e.gamma / 30, -1, 1);
      const ny = THREE.MathUtils.clamp((e.beta - 45) / 30, -1, 1);
      targetX.current = nx * strength;
      targetY.current = -ny * strength * 0.6;
    };

    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('touchmove', handleTouch, { passive: true });
    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [strength]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Add idle breathing if no significant input
    let tx = targetX.current;
    let ty = targetY.current;

    if (breathe) {
      const breatheX = Math.sin(t * 0.3) * 0.02;
      const breatheY = Math.cos(t * 0.2) * 0.015;
      tx += breatheX;
      ty += breatheY;
    }

    // Smooth interpolation
    currentX.current += (tx - currentX.current) * smoothing * delta;
    currentY.current += (ty - currentY.current) * smoothing * delta;

    // Move camera position
    camera.position.x = currentX.current;
    camera.position.y = currentY.current;

    // Slight look-ahead (camera looks slightly ahead of movement)
    camera.lookAt(
      currentX.current * 0.3,
      currentY.current * 0.3,
      0
    );
  });

  return null;
}
