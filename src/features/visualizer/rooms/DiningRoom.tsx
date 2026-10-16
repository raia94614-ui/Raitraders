import React, { useMemo } from 'react';
import { PBRWall } from '../scene/PBRWall';
import { getMarbleTexture, getHardwoodFloorTexture } from '../../../visualizer/architecturalMaterials';
import { useVisualizerStore } from '../store/visualizerStore';

export const DiningRoom: React.FC = () => {
  const { lightingTime } = useVisualizerStore();
  const isNight = lightingTime === 'night';

  const marbleTex = useMemo(() => getMarbleTexture(), []);
  const floorTex = useMemo(() => getHardwoodFloorTexture(isNight), [isNight]);

  return (
    <group position={[0, 0, 0]}>
      {/* ── Floor ── */}
      <PBRWall
        partId="dining/floor"
        label="Dining Floor"
        labelHi="डाइनिंग फर्श"
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        size={[8.2, 8.2, 0.12]}
        defaultColor="#5B3E2B"
        defaultTexture={floorTex}
        receiveShadow
      />

      {/* ── Ceiling with Cove Light ── */}
      <PBRWall
        partId="dining/ceiling"
        label="Dining Ceiling"
        labelHi="डाइनिंग सीलिंग"
        position={[0, 3.3, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        size={[8.2, 8.2, 0.08]}
        defaultColor="#FAFAF8"
        receiveShadow
      />

      {/* ── Back Wall ── */}
      <PBRWall
        partId="dining/back-wall"
        label="Dining Back Wall"
        labelHi="बैक वॉल"
        position={[0, 1.65, -4]}
        size={[8.2, 3.3, 0.14]}
        defaultColor="#F7F3EE"
        castShadow
        receiveShadow
      />

      {/* ── Accent Feature Wall (Crockery/Art wall) ── */}
      <PBRWall
        partId="dining/accent-wall"
        label="Dining Accent Wall"
        labelHi="डाइनिंग एक्सेंट वॉल"
        position={[0, 1.65, -3.93]}
        size={[4.8, 3.3, 0.03]}
        defaultColor="#1F2A44"
        receiveShadow
      />

      {/* ── Left Wall ── */}
      <PBRWall
        partId="dining/left-wall"
        label="Left Wall"
        labelHi="लेफ्ट वॉल"
        position={[-4.1, 1.65, 0]}
        rotation={[0, Math.PI / 2, 0]}
        size={[8.2, 3.3, 0.14]}
        defaultColor="#F7F3EE"
        castShadow
        receiveShadow
      />

      {/* ── Right Wall ── */}
      <PBRWall
        partId="dining/right-wall"
        label="Right Wall"
        labelHi="राइट वॉल"
        position={[4.1, 1.65, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        size={[8.2, 3.3, 0.14]}
        defaultColor="#F7F3EE"
        castShadow
        receiveShadow
      />

      {/* ── Front Wall (Panoramic portal) ── */}
      <group position={[0, 0, 4.1]}>
        <PBRWall
          partId="dining/front-wall"
          label="Front Wall Left"
          labelHi="फ्रंट वॉल"
          position={[-3.3, 1.65, 0]}
          size={[1.6, 3.3, 0.14]}
          defaultColor="#F7F3EE"
          receiveShadow
        />
        <PBRWall
          partId="dining/front-wall-right"
          label="Front Wall Right"
          labelHi="फ्रंट वॉल"
          position={[3.3, 1.65, 0]}
          size={[1.6, 3.3, 0.14]}
          defaultColor="#F7F3EE"
          receiveShadow
        />
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[5.0, 3.0, 0.02]} />
          <meshStandardMaterial color="#A8D8F0" transparent opacity={0.12} roughness={0.05} />
        </mesh>
      </group>

      {/* ── 6-Seater Marble Dining Table & Chairs ── */}
      <group position={[0, 0, -0.6]}>
        {/* White Calacatta Marble Top */}
        <mesh position={[0, 0.76, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.8, 0.05, 1.3]} />
          <meshStandardMaterial color="#F8F8F6" map={marbleTex} roughness={0.25} />
        </mesh>
        {/* Brass Beveled Table Edge */}
        <mesh position={[0, 0.755, 0]}>
          <boxGeometry args={[2.82, 0.04, 1.32]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Architectural Pedestal Base */}
        <mesh position={[0, 0.36, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.45, 0.72, 24]} />
          <meshStandardMaterial color="#1C1814" roughness={0.5} />
        </mesh>

        {/* 6 Velvet Dining Chairs */}
        {[
          [-0.9, -0.9],
          [0, -0.9],
          [0.9, -0.9],
          [-0.9, 0.9],
          [0, 0.9],
          [0.9, 0.9],
        ].map(([cx, cz], ci) => (
          <group key={ci} position={[cx, 0, cz]} rotation={[0, cz < 0 ? 0 : Math.PI, 0]}>
            {/* Seat */}
            <mesh position={[0, 0.46, 0]} castShadow>
              <boxGeometry args={[0.48, 0.08, 0.48]} />
              <meshStandardMaterial color="#2B3242" roughness={0.8} />
            </mesh>
            {/* Curved Backrest */}
            <mesh position={[0, 0.78, -0.22]} castShadow>
              <boxGeometry args={[0.48, 0.55, 0.08]} />
              <meshStandardMaterial color="#2B3242" roughness={0.8} />
            </mesh>
            {/* Brass Legs */}
            {[
              [-0.2, -0.2],
              [0.2, -0.2],
              [-0.2, 0.2],
              [0.2, 0.2],
            ].map(([lx, lz], li) => (
              <mesh key={li} position={[lx, 0.22, lz]}>
                <cylinderGeometry args={[0.015, 0.015, 0.44, 8]} />
                <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.25} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Modern Branching Chandelier */}
        <group position={[0, 2.3, 0]}>
          <mesh>
            <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} />
          </mesh>
          <mesh position={[0, -0.4, 0]}>
            <boxGeometry args={[1.8, 0.04, 0.04]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} />
          </mesh>
          {[-0.7, 0, 0.7].map((lx, li) => (
            <mesh key={li} position={[lx, -0.48, 0]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial color="#FFF4DE" emissive="#FFE5B4" emissiveIntensity={2} />
            </mesh>
          ))}
          <pointLight position={[0, -0.5, 0]} intensity={isNight ? 3.0 : 1.2} color="#FFE6B8" distance={5} />
        </group>
      </group>
    </group>
  );
};
