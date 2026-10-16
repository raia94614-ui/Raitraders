import React, { useRef, useCallback, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls as DreiOrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useVisualizerStore } from './store';

/** Declare the global helper so TypeScript knows it exists */
declare global {
  interface Window {
    __vizResetView?: () => void;
    __vizLookDirection?: (yawDeg: number, pitchDeg?: number) => void;
    __vizCanvas?: HTMLCanvasElement | null;
  }
}

export const Controls: React.FC = () => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { isAutoRotating, cameraMode, viewMode, currentRoom } = useVisualizerStore();
  const { camera } = useThree();
  const isPano = cameraMode === 'panorama';

  const resetView = useCallback(() => {
    if (!controlsRef.current) return;
    if (cameraMode === 'panorama') {
      controlsRef.current.target.set(0, 1.55, 0);
      camera.position.set(0, 1.55, 0.08);
      controlsRef.current.update();
    } else if (viewMode === 'exterior') {
      controlsRef.current.target.set(0, 1.2, 0);
      camera.position.set(9, 5, 10);
      controlsRef.current.update();
    } else {
      controlsRef.current.target.set(0, 1.2, 0);
      camera.position.set(0, 3.4, 6.2);
      controlsRef.current.update();
    }
  }, [camera, cameraMode, viewMode]);

  // Jump smoothly to a specific look direction in 360 panoramic view
  const lookDirection = useCallback(
    (yawDeg: number, pitchDeg = 0) => {
      if (!controlsRef.current) return;
      const yawRad = (yawDeg * Math.PI) / 180;
      const pitchRad = (pitchDeg * Math.PI) / 180;
      const targetY = isPano ? 1.55 : 1.2;
      const radius = isPano ? 0.08 : 6.0;

      controlsRef.current.target.set(0, targetY, 0);
      const horizR = radius * Math.cos(pitchRad);
      const x = horizR * Math.sin(yawRad);
      const y = targetY - radius * Math.sin(pitchRad);
      const z = horizR * Math.cos(yawRad);

      camera.position.set(x, y, z);
      controlsRef.current.update();
    },
    [camera, isPano]
  );

  useEffect(() => {
    window.__vizResetView = resetView;
    window.__vizLookDirection = lookDirection;
  }, [resetView, lookDirection]);

  // Smoothly reposition camera when mode or room changes
  useEffect(() => {
    resetView();
  }, [cameraMode, viewMode, currentRoom, resetView]);

  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotating;
      controlsRef.current.update();

      if (isPano) {
        const az = controlsRef.current.getAzimuthalAngle();
        const deg = Math.round(((az * 180) / Math.PI + 360) % 360);
        window.dispatchEvent(
          new CustomEvent('viz-heading', { detail: { angle: deg } })
        );
      }
    }
  });

  return (
    <DreiOrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={isPano ? 0.01 : 2}
      maxDistance={isPano ? 0.35 : 24}
      maxPolarAngle={isPano ? Math.PI - 0.12 : Math.PI / 2 - 0.05}
      minPolarAngle={isPano ? 0.12 : 0.1}
      autoRotateSpeed={isPano ? 0.75 : 1.2}
      target={isPano ? [0, 1.55, 0] : [0, 1.2, 0]}
      makeDefault
    />
  );
};
