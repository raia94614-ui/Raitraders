import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { useVisualizerStore } from '../store/visualizerStore';
import { PhotorealPanoramaEngine } from '../engine/PhotorealPanoramaEngine';
import { RoomContainer } from '../rooms/RoomContainer';
import { Controls360 } from './Controls360';

export const VisualizerCanvas: React.FC = () => {
  const { lightingTime, cameraMode, setQualityLevel } = useVisualizerStore();
  const [dpr, setDpr] = useState<number>(1.5);

  const isNight = lightingTime === 'night';
  const is360 = cameraMode === 'inside_360';

  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        shadows={!is360}
        camera={{ position: [0, 0, 0.08], fov: 75, near: 0.1, far: 2500 }}
        dpr={dpr}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: isNight ? 1.2 : 1.05,
          preserveDrawingBuffer: true, // Needed for screenshot / PDF captures
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          if (typeof window !== 'undefined') {
            window.__vizCanvas = gl.domElement;
          }
        }}
      >
        {/* Adaptive Quality / Performance Monitor */}
        <PerformanceMonitor
          onIncline={() => {
            setDpr(2);
            setQualityLevel('high');
          }}
          onDecline={() => {
            setDpr(1);
            setQualityLevel('medium');
          }}
          onFallback={() => {
            setDpr(0.9);
            setQualityLevel('low');
          }}
        />

        {/* Ambient lighting to ensure scene is never pitch dark */}
        <ambientLight intensity={is360 ? 1.2 : isNight ? 0.4 : 1.0} />

        {is360 ? (
          /* Photoreal 360 Panorama Engine with custom luminance shader and inside-out sphere */
          <Suspense fallback={null}>
            <PhotorealPanoramaEngine />
          </Suspense>
        ) : (
          /* 3D Overview / Dollhouse Mode with procedural 3D model and OrbitControls */
          <Suspense fallback={null}>
            <group>
              <directionalLight
                position={[12, 22, 14]}
                intensity={isNight ? 0.35 : 1.8}
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-camera-near={0.5}
                shadow-camera-far={60}
                shadow-camera-left={-16}
                shadow-camera-right={16}
                shadow-camera-top={16}
                shadow-camera-bottom={-16}
              />
              <directionalLight
                position={[-12, 14, -10]}
                intensity={isNight ? 0.2 : 0.75}
                color="#A5C6E8"
              />
              <RoomContainer />
              <Controls360 />
            </group>
          </Suspense>
        )}
      </Canvas>
    </div>
  );
};


