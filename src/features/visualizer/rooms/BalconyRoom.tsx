import React, { useMemo } from 'react';
import { PBRWall } from '../scene/PBRWall';
import { getDeckPlanksTexture, getLawnTexture } from '../../../visualizer/architecturalMaterials';
import { useVisualizerStore } from '../store/visualizerStore';

export const BalconyRoom: React.FC = () => {
  const { lightingTime } = useVisualizerStore();
  const isNight = lightingTime === 'night';

  const deckTex = useMemo(() => getDeckPlanksTexture(), []);
  const lawnTex = useMemo(() => getLawnTexture(isNight), [isNight]);

  return (
    <group position={[0, 0, 0]}>
      {/* ── Floor (Teak Deck Planks) ── */}
      <PBRWall
        partId="balcony/floor"
        label="Balcony Deck Floor"
        labelHi="बालकनी डेक फर्श"
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        size={[8.2, 8.2, 0.12]}
        defaultColor="#4A3425"
        defaultTexture={deckTex}
        receiveShadow
      />

      {/* ── Ceiling (Overhang Soffit) ── */}
      <PBRWall
        partId="balcony/ceiling"
        label="Balcony Overhang Ceiling"
        labelHi="बालकनी सीलिंग"
        position={[0, 3.3, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        size={[8.2, 8.2, 0.08]}
        defaultColor="#2B2E36"
        receiveShadow
      />
      {/* Warm exterior soffit downlights */}
      <pointLight position={[0, 3.1, -1.0]} intensity={isNight ? 3.0 : 0.8} color="#FFD899" distance={6} />

      {/* ── Back Wall (House Exterior Slatted Facade) ── */}
      <PBRWall
        partId="balcony/back-wall"
        label="Balcony Back Wall"
        labelHi="हाउस एक्सटीरियर दीवार"
        position={[0, 1.65, -4]}
        size={[8.2, 3.3, 0.14]}
        defaultColor="#1F242E"
        castShadow
        receiveShadow
      />

      {/* ── Accent Wall: Feature Planter & Timber Slat Wall ── */}
      <PBRWall
        partId="balcony/accent-wall"
        label="Balcony Accent Slat Wall"
        labelHi="बालकनी एक्सेंट वॉल"
        position={[0, 1.65, -3.93]}
        size={[4.8, 3.3, 0.03]}
        defaultColor="#6B4423"
        receiveShadow
      />

      {/* ── Left Return Wall ── */}
      <PBRWall
        partId="balcony/left-wall"
        label="Left Privacy Screen"
        labelHi="लेफ्ट वॉल"
        position={[-4.1, 1.65, 0]}
        rotation={[0, Math.PI / 2, 0]}
        size={[8.2, 3.3, 0.14]}
        defaultColor="#2B2E36"
        castShadow
        receiveShadow
      />

      {/* ── Right Return Wall ── */}
      <PBRWall
        partId="balcony/right-wall"
        label="Right Wall"
        labelHi="राइट वॉल"
        position={[4.1, 1.65, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        size={[8.2, 3.3, 0.14]}
        defaultColor="#2B2E36"
        castShadow
        receiveShadow
      />

      {/* ── Front Wall: Clear Glass Balustrade looking to Garden ── */}
      <group position={[0, 0, 3.9]}>
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[8.0, 1.1, 0.04]} />
          <meshStandardMaterial color="#A0D0E8" transparent opacity={0.3} roughness={0.05} />
        </mesh>
        {/* Metal handrail */}
        <mesh position={[0, 1.12, 0]}>
          <boxGeometry args={[8.04, 0.05, 0.08]} />
          <meshStandardMaterial color="#1C1B1A" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Garden lawn below */}
        <mesh position={[0, -0.15, 6.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[26, 12]} />
          <meshStandardMaterial color={isNight ? '#182C18' : '#3E6E34'} map={lawnTex} roughness={0.9} />
        </mesh>
      </group>

      {/* ── Outdoor Furniture: Bistro Table & Chairs ── */}
      <group position={[0, 0, -0.6]}>
        <mesh position={[0, 0.74, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.03, 32]} />
          <meshStandardMaterial color="#1C1916" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.36, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.72, 12]} />
          <meshStandardMaterial color="#1C1916" metalness={0.8} />
        </mesh>

        {/* 2 Modern Bistro Chairs */}
        {[-0.85, 0.85].map((cx, ci) => (
          <group key={ci} position={[cx, 0, 0]}>
            <mesh position={[0, 0.44, 0]} castShadow>
              <cylinderGeometry args={[0.22, 0.22, 0.04, 16]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.22, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.42, 8]} />
              <meshStandardMaterial color="#1A1816" metalness={0.8} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Planter boxes with greenery */}
      <group position={[2.8, 0, 2.5]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.6, 0.6, 2.2]} />
          <meshStandardMaterial color="#22252A" roughness={0.8} />
        </mesh>
        {[-0.6, 0, 0.6].map((pz, pi) => (
          <mesh key={pi} position={[0, 0.7, pz]} castShadow>
            <sphereGeometry args={[0.32, 8, 8]} />
            <meshStandardMaterial color={isNight ? '#1A331E' : '#30632C'} roughness={0.95} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
