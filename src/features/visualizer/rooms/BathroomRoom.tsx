import React, { useMemo } from 'react';
import { PBRWall } from '../scene/PBRWall';
import { getMarbleTexture } from '../../../visualizer/architecturalMaterials';
import { useVisualizerStore } from '../store/visualizerStore';

export const BathroomRoom: React.FC = () => {
  const { lightingTime } = useVisualizerStore();
  const isNight = lightingTime === 'night';
  const marbleTex = useMemo(() => getMarbleTexture(), []);

  return (
    <group position={[0, 0, 0]}>
      {/* ── Floor (Honed Marble Tile) ── */}
      <PBRWall
        partId="bathroom/floor"
        label="Spa Bathroom Floor"
        labelHi="बाथरूम फर्श"
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        size={[8.2, 8.2, 0.12]}
        defaultColor="#E8E8E6"
        defaultTexture={marbleTex}
        receiveShadow
      />

      {/* ── Ceiling ── */}
      <PBRWall
        partId="bathroom/ceiling"
        label="Bathroom Ceiling"
        labelHi="सीलिंग"
        position={[0, 3.3, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        size={[8.2, 8.2, 0.08]}
        defaultColor="#FAFAF8"
        receiveShadow
      />

      {/* ── Back Wall (Vanity & Mirror Wall) ── */}
      <PBRWall
        partId="bathroom/back-wall"
        label="Vanity Back Wall"
        labelHi="वैनिटी बैक वॉल"
        position={[0, 1.65, -4]}
        size={[8.2, 3.3, 0.14]}
        defaultColor="#F0ECE4"
        castShadow
        receiveShadow
      />

      {/* ── Accent Wall: Shower / Vanity Feature Wall ── */}
      <PBRWall
        partId="bathroom/accent-wall"
        label="Bathroom Tile Accent Wall"
        labelHi="बाथरूम एक्सेंट वॉल"
        position={[0, 1.65, -3.93]}
        size={[4.5, 3.3, 0.03]}
        defaultColor="#2E3C4D"
        defaultTexture={marbleTex}
        receiveShadow
      />

      {/* ── Left Wall (Shower Area) ── */}
      <PBRWall
        partId="bathroom/left-wall"
        label="Shower Left Wall"
        labelHi="लेफ्ट वॉल"
        position={[-4.1, 1.65, 0]}
        rotation={[0, Math.PI / 2, 0]}
        size={[8.2, 3.3, 0.14]}
        defaultColor="#F0ECE4"
        castShadow
        receiveShadow
      />

      {/* ── Right Wall ── */}
      <PBRWall
        partId="bathroom/right-wall"
        label="Right Wall"
        labelHi="राइट वॉल"
        position={[4.1, 1.65, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        size={[8.2, 3.3, 0.14]}
        defaultColor="#F0ECE4"
        castShadow
        receiveShadow
      />

      {/* ── Front Wall (Entry portal) ── */}
      <group position={[0, 0, 4.1]}>
        <PBRWall
          partId="bathroom/front-wall"
          label="Front Wall Left"
          labelHi="फ्रंट वॉल"
          position={[-3.3, 1.65, 0]}
          size={[1.6, 3.3, 0.14]}
          defaultColor="#F0ECE4"
          receiveShadow
        />
        <PBRWall
          partId="bathroom/front-wall-right"
          label="Front Wall Right"
          labelHi="फ्रंट वॉल"
          position={[3.3, 1.65, 0]}
          size={[1.6, 3.3, 0.14]}
          defaultColor="#F0ECE4"
          receiveShadow
        />
      </group>

      {/* ── Floating Double Vanity with LED Backlit Mirror ── */}
      <group position={[0, 0, -3.45]}>
        {/* Floating Oak / Walnut Cabinet */}
        <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.52, 0.65]} />
          <meshStandardMaterial color="#2B2118" roughness={0.6} />
        </mesh>
        {/* White Seamless Countertop */}
        <mesh position={[0, 0.99, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.24, 0.04, 0.68]} />
          <meshStandardMaterial color="#FAF9F6" map={marbleTex} roughness={0.2} />
        </mesh>
        {/* 2 White Ceramic Vessel Sinks */}
        {[-0.8, 0.8].map((sx, si) => (
          <group key={si} position={[sx, 1.08, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.26, 0.22, 0.14, 24]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.1} />
            </mesh>
            {/* Matte Black Faucet */}
            <mesh position={[0, 0.16, -0.22]}>
              <cylinderGeometry args={[0.015, 0.015, 0.26, 8]} />
              <meshStandardMaterial color="#1A1816" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        ))}

        {/* Massive Oval Backlit LED Mirror */}
        <mesh position={[0, 2.05, -0.45]}>
          <boxGeometry args={[2.8, 1.3, 0.03]} />
          <meshStandardMaterial color="#E0F0F8" roughness={0.05} metalness={0.9} />
        </mesh>
        {/* Ambient Mirror Backglow */}
        <pointLight position={[0, 2.05, -0.38]} intensity={isNight ? 2.8 : 1.2} color="#FFF2DA" distance={4} />
      </group>

      {/* Walk-in Shower Glass Screen (Left side) */}
      <mesh position={[-2.4, 1.5, -2.0]}>
        <boxGeometry args={[0.02, 2.9, 2.4]} />
        <meshStandardMaterial color="#B0E0F5" transparent opacity={0.25} roughness={0.05} />
      </mesh>
    </group>
  );
};
