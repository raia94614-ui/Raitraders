import React, { useRef, useCallback, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls as DreiOrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useVisualizerStore, ROOMS_METADATA } from '../store/visualizerStore';

declare global {
  interface Window {
    __vizResetView?: () => void;
    __vizLookDirection?: (yawDeg: number, pitchDeg?: number) => void;
    __vizRequestGyro?: () => Promise<boolean>;
  }
}

export const Controls360: React.FC = () => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { activeRoom, cameraMode, isAutoRotating, gyroEnabled, setGyroEnabled } = useVisualizerStore();
  const { camera } = useThree();
  const is360 = cameraMode === 'inside_360';

  const roomMeta = ROOMS_METADATA.find((r) => r.id === activeRoom) ?? ROOMS_METADATA[0];

  // Reset View based on active room & camera mode
  const resetView = useCallback(() => {
    if (!controlsRef.current) return;

    if (is360) {
      const [cx, cy, cz] = roomMeta.centerPos;
      // In 360 mode, target is center of room eye-level, camera is slightly offset forward
      controlsRef.current.target.set(cx, cy, cz);
      camera.position.set(cx, cy, cz + 0.08);
      controlsRef.current.minDistance = 0.01;
      controlsRef.current.maxDistance = 0.5;
      controlsRef.current.maxPolarAngle = Math.PI - 0.05;
      controlsRef.current.minPolarAngle = 0.05;
      controlsRef.current.enableZoom = true;
      controlsRef.current.update();
    } else {
      // Dollhouse mode
      const [dx, dy, dz] = roomMeta.dollhousePos;
      controlsRef.current.target.set(0, 1.3, 0);
      camera.position.set(dx, dy, dz);
      controlsRef.current.minDistance = 2.0;
      controlsRef.current.maxDistance = 25.0;
      controlsRef.current.maxPolarAngle = Math.PI / 2 + 0.1;
      controlsRef.current.minPolarAngle = 0.1;
      controlsRef.current.enableZoom = true;
      controlsRef.current.update();
    }
  }, [camera, is360, roomMeta]);

  // Jump to specific cardinal orientation
  const lookDirection = useCallback(
    (yawDeg: number, pitchDeg = 0) => {
      if (!controlsRef.current) return;
      const yawRad = (yawDeg * Math.PI) / 180;
      const pitchRad = (pitchDeg * Math.PI) / 180;

      const [cx, cy, cz] = is360 ? roomMeta.centerPos : [0, 1.3, 0];
      const radius = is360 ? 0.08 : 6.5;

      controlsRef.current.target.set(cx, cy, cz);
      const horizR = radius * Math.cos(pitchRad);
      const x = cx + horizR * Math.sin(yawRad);
      const y = cy - radius * Math.sin(pitchRad);
      const z = cz + horizR * Math.cos(yawRad);

      camera.position.set(x, y, z);
      controlsRef.current.update();
    },
    [camera, is360, roomMeta]
  );

  // Expose global methods
  useEffect(() => {
    window.__vizResetView = resetView;
    window.__vizLookDirection = lookDirection;
  }, [resetView, lookDirection]);

  // Request gyroscope sensor permission for iOS
  const requestGyro = useCallback(async (): Promise<boolean> => {
    if (
      typeof window !== 'undefined' &&
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission ===
        'function'
    ) {
      try {
        const response = await (
          DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }
        ).requestPermission();
        if (response === 'granted') {
          setGyroEnabled(true);
          return true;
        }
      } catch (err) {
        console.warn('Gyro permission error:', err);
      }
      return false;
    } else if (typeof window !== 'undefined' && 'ondeviceorientation' in window) {
      setGyroEnabled(!gyroEnabled);
      return !gyroEnabled;
    }
    return false;
  }, [gyroEnabled, setGyroEnabled]);

  useEffect(() => {
    window.__vizRequestGyro = requestGyro;
  }, [requestGyro]);

  // Listen to Gyroscope Device Orientation if enabled
  useEffect(() => {
    if (!gyroEnabled || !is360) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha === null || e.beta === null || e.gamma === null || !controlsRef.current) return;
      // Smoothly orient camera with device orientation
      const alpha = THREE.MathUtils.degToRad(e.alpha);
      const beta = THREE.MathUtils.degToRad(e.beta - 90);
      const [cx, cy, cz] = roomMeta.centerPos;
      const r = 0.08;
      const x = cx + r * Math.sin(alpha) * Math.cos(beta);
      const y = cy + r * Math.sin(beta);
      const z = cz + r * Math.cos(alpha) * Math.cos(beta);
      camera.position.set(x, y, z);
      controlsRef.current.update();
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [gyroEnabled, is360, camera, roomMeta]);

  // When room or camera mode changes, reset view
  useEffect(() => {
    resetView();
  }, [activeRoom, cameraMode, resetView]);

  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotating;
      controlsRef.current.autoRotateSpeed = 1.0;
      controlsRef.current.update();

      if (is360) {
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
      dampingFactor={0.07}
      rotateSpeed={is360 ? -0.45 : 0.6} // Inverted inside 360 for intuitive panoramic drag
      autoRotate={isAutoRotating}
    />
  );
};
