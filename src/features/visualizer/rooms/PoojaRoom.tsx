import React, { useMemo } from 'react';
import { PBRWall } from '../scene/PBRWall';
import { getMarbleTexture } from '../../../visualizer/architecturalMaterials';
import { useVisualizerStore } from '../store/visualizerStore';

export const PoojaRoom: React.FC = () => {
  const { lightingTime } = useVisualizerStore();
  const isNight = lightingTime === 'night';
  const marbleTex = useMemo(() => getMarbleTexture(), []);

  return (
    <group position={[0, 0, 0]}>
      {/* ── Floor (White Statuario Marble) ── */}
      <PBRWall
        partId="pooja/floor"
        label="Pooja Room Floor"
        labelHi="पूजा घर फर्श"
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        size={[8.2, 8.2, 0.12]}
        defaultColor="#F5F5F3"
        defaultTexture={marbleTex}
        receiveShadow
      />

      {/* ── Ceiling ── */}
      <PBRWall
        partId="pooja/ceiling"
        label="Pooja Room Ceiling"
        labelHi="सीलिंग"
        position={[0, 3.3, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        size={[8.2, 8.2, 0.08]}
        defaultColor="#FFFDF5"
        receiveShadow
      />
      {/* Warm Golden Mandir Glow */}
      <pointLight position={[0, 2.8, -1.8]} intensity={isNight ? 3.2 : 1.6} color="#FFD070" distance={6} />

      {/* ── Back Wall (Behind Mandir) ── */}
      <PBRWall
        partId="pooja/back-wall"
        label="Mandir Back Wall"
        labelHi="बैक वॉल"
        position={[0, 1.65, -4]}
        size={[8.2, 3.3, 0.14]}
        defaultColor="#FDFBF7"
        castShadow
        receiveShadow
      />

      {/* ── Accent Wall: Carved CNC Jali Feature Wall ── */}
      <PBRWall
        partId="pooja/accent-wall"
        label="Pooja Jali Accent Wall"
        labelHi="पूजा जाली एक्सेंट वॉल"
        position={[0, 1.65, -3.93]}
        size={[4.0, 3.3, 0.03]}
        defaultColor="#C9A048"
        receiveShadow
      />

      {/* ── Left Wall ── */}
      <PBRWall
        partId="pooja/left-wall"
        label="Left Wall"
        labelHi="लेफ्ट वॉल"
        position={[-4.1, 1.65, 0]}
        rotation={[0, Math.PI / 2, 0]}
        size={[8.2, 3.3, 0.14]}
        defaultColor="#FDFBF7"
        castShadow
        receiveShadow
      />

      {/* ── Right Wall ── */}
      <PBRWall
        partId="pooja/right-wall"
        label="Right Wall"
        labelHi="राइट वॉल"
        position={[4.1, 1.65, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        size={[8.2, 3.3, 0.14]}
        defaultColor="#FDFBF7"
        castShadow
        receiveShadow
      />

      {/* ── Front Wall (Entry portal) ── */}
      <group position={[0, 0, 4.1]}>
        <PBRWall
          partId="pooja/front-wall"
          label="Front Wall Left"
          labelHi="फ्रंट वॉल"
          position={[-3.3, 1.65, 0]}
          size={[1.6, 3.3, 0.14]}
          defaultColor="#FDFBF7"
          receiveShadow
        />
        <PBRWall
          partId="pooja/front-wall-right"
          label="Front Wall Right"
          labelHi="फ्रंट वॉल"
          position={[3.3, 1.65, 0]}
          size={[1.6, 3.3, 0.14]}
          defaultColor="#FDFBF7"
          receiveShadow
        />
      </group>

      {/* ── Sacred Mandir Structure ── */}
      <group position={[0, 0, -3.2]}>
        {/* Marble Raised Pedestal / Platform */}
        <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.56, 1.2]} />
          <meshStandardMaterial color="#FAF9F6" map={marbleTex} roughness={0.25} />
        </mesh>
        {/* Teak Wood Mandir Canopy */}
        <mesh position={[0, 1.85, 0]} castShadow>
          <boxGeometry args={[2.8, 1.9, 0.85]} />
          <meshStandardMaterial color="#4A2F1B" roughness={0.6} />
        </mesh>
        {/* Inner sanctum cutaway */}
        <mesh position={[0, 1.75, 0.05]}>
          <boxGeometry args={[2.4, 1.5, 0.8]} />
          <meshStandardMaterial color="#FFF9ED" emissive="#FFE5A0" emissiveIntensity={0.6} />
        </mesh>
        {/* Brass Shikhar Dome on top */}
        <mesh position={[0, 2.95, 0]} castShadow>
          <coneGeometry args={[0.35, 0.65, 16]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.15} />
        </mesh>
        {/* Hanging Brass Bells */}
        {[-0.8, 0.8].map((bx, bi) => (
          <group key={bi} position={[bx, 2.3, 0.3]}>
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.005, 0.005, 0.3, 8]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.9} />
            </mesh>
            <mesh position={[0, 0, 0]} castShadow>
              <coneGeometry args={[0.08, 0.14, 12]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.15} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};
