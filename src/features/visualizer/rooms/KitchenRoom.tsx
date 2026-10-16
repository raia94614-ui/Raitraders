import React, { useMemo } from 'react';
import { PBRWall } from '../scene/PBRWall';
import { getMarbleTexture, getHardwoodFloorTexture } from '../../../visualizer/architecturalMaterials';
import { useVisualizerStore } from '../store/visualizerStore';

export const KitchenRoom: React.FC = () => {
  const { lightingTime } = useVisualizerStore();
  const isNight = lightingTime === 'night';

  const marbleTex = useMemo(() => getMarbleTexture(), []);
  const floorTex = useMemo(() => getHardwoodFloorTexture(isNight), [isNight]);

  return (
    <group position={[0, 0, 0]}>
      {/* ── Floor ── */}
      <PBRWall
        partId="kitchen/floor"
        label="Kitchen Floor"
        labelHi="किचन फर्श"
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        size={[8.2, 8.2, 0.12]}
        defaultColor="#4A3E34"
        defaultTexture={floorTex}
        receiveShadow
      />

      {/* ── Ceiling ── */}
      <PBRWall
        partId="kitchen/ceiling"
        label="Kitchen Ceiling"
        labelHi="किचन सीलिंग"
        position={[0, 3.3, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        size={[8.2, 8.2, 0.08]}
        defaultColor="#FAFAF8"
        receiveShadow
      />
      <pointLight position={[0, 3.16, 0]} intensity={isNight ? 2.2 : 1.4} color="#FFF8ED" distance={8} />

      {/* ── Back Wall (Cooktop & Backsplash) ── */}
      <PBRWall
        partId="kitchen/back-wall"
        label="Kitchen Back Wall"
        labelHi="बैक वॉल"
        position={[0, 1.65, -4]}
        size={[8.2, 3.3, 0.14]}
        defaultColor="#F0F5F0"
        castShadow
        receiveShadow
      />

      {/* ── Accent Wall: Kitchen Backsplash Tile Wall (Clickable to customize) ── */}
      <PBRWall
        partId="kitchen/accent-wall"
        label="Backsplash Feature Wall"
        labelHi="किचन बैकस्प्लैश दीवार"
        position={[0, 1.45, -3.93]}
        size={[5.4, 1.15, 0.03]}
        defaultColor="#E8DFD0"
        defaultTexture={marbleTex}
        receiveShadow
      />

      {/* ── Left Wall (Tall Pantry & Fridge Cabinets) ── */}
      <PBRWall
        partId="kitchen/left-wall"
        label="Left Wall"
        labelHi="लेफ्ट वॉल"
        position={[-4.1, 1.65, 0]}
        rotation={[0, Math.PI / 2, 0]}
        size={[8.2, 3.3, 0.14]}
        defaultColor="#F0F5F0"
        castShadow
        receiveShadow
      />

      {/* ── Right Wall (Window Wall) ── */}
      <PBRWall
        partId="kitchen/right-wall"
        label="Right Wall"
        labelHi="राइट वॉल"
        position={[4.1, 1.65, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        size={[8.2, 3.3, 0.14]}
        defaultColor="#F0F5F0"
        castShadow
        receiveShadow
      />

      {/* ── Front Wall (Open Frame) ── */}
      <group position={[0, 0, 4.1]}>
        <PBRWall
          partId="kitchen/front-wall"
          label="Front Wall Left"
          labelHi="फ्रंट वॉल"
          position={[-3.3, 1.65, 0]}
          size={[1.6, 3.3, 0.14]}
          defaultColor="#F0F5F0"
          receiveShadow
        />
        <PBRWall
          partId="kitchen/front-wall-right"
          label="Front Wall Right"
          labelHi="फ्रंट वॉल"
          position={[3.3, 1.65, 0]}
          size={[1.6, 3.3, 0.14]}
          defaultColor="#F0F5F0"
          receiveShadow
        />
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[5.0, 3.0, 0.02]} />
          <meshStandardMaterial color="#A8D8F0" transparent opacity={0.12} roughness={0.05} />
        </mesh>
      </group>

      {/* ── Modular Kitchen Cabinet Units ── */}
      {/* 1. Main Cooking Counter Base (Against back wall) */}
      <group position={[0, 0, -3.45]}>
        {/* Base cabinets */}
        <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
          <boxGeometry args={[5.8, 0.88, 0.75]} />
          <meshStandardMaterial color="#1E232A" roughness={0.5} />
        </mesh>
        {/* Countertop: White Quartz Marble */}
        <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[5.9, 0.05, 0.8]} />
          <meshStandardMaterial color="#F6F6F4" map={marbleTex} roughness={0.25} />
        </mesh>
        {/* Cooktop Hob */}
        <mesh position={[0, 0.93, 0]}>
          <boxGeometry args={[0.9, 0.02, 0.52]} />
          <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Stainless Steel Chimney Hood */}
        <mesh position={[0, 2.3, 0]} castShadow>
          <boxGeometry args={[0.95, 0.55, 0.55]} />
          <meshStandardMaterial color="#C5C7CC" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[0, 2.9, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.7, 16]} />
          <meshStandardMaterial color="#A5A8B0" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Under-cabinet task strip light */}
        <pointLight position={[0, 2.05, 0.2]} intensity={1.8} color="#FFF2DA" distance={3.5} />
      </group>

      {/* 2. Luxury Calacatta Marble Waterfall Island */}
      <group position={[0, 0, -0.6]}>
        <mesh position={[0, 0.46, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.92, 1.2]} />
          <meshStandardMaterial color="#F8F8F6" map={marbleTex} roughness={0.25} metalness={0.05} />
        </mesh>
        {/* Recessed Island Base Accent */}
        <mesh position={[0, 0.46, 0.61]}>
          <boxGeometry args={[3.0, 0.85, 0.02]} />
          <meshStandardMaterial color="#1E232A" roughness={0.6} />
        </mesh>

        {/* 3 Modern Bar Stools */}
        {[-0.9, 0, 0.9].map((sx, si) => (
          <group key={si} position={[sx, 0, 0.95]}>
            <mesh position={[0, 0.32, 0]} castShadow>
              <cylinderGeometry args={[0.015, 0.015, 0.64, 8]} />
              <meshStandardMaterial color="#1A1816" metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.65, 0]} castShadow>
              <cylinderGeometry args={[0.22, 0.22, 0.06, 24]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
        ))}

        {/* 3 Designer Glass Island Pendants */}
        {[-0.8, 0, 0.8].map((px, pi) => (
          <group key={pi} position={[px, 2.4, 0]}>
            <mesh>
              <cylinderGeometry args={[0.08, 0.14, 0.22, 16]} />
              <meshStandardMaterial color="#FFE8B8" transparent opacity={0.65} roughness={0.1} />
            </mesh>
            <pointLight position={[0, -0.1, 0]} intensity={isNight ? 2.5 : 1.0} color="#FFDCA8" distance={3.5} />
          </group>
        ))}
      </group>
    </group>
  );
};
