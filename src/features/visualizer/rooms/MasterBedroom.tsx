import React, { useMemo } from 'react';
import { PBRWall } from '../scene/PBRWall';
import { getHardwoodFloorTexture } from '../../../visualizer/architecturalMaterials';
import { useVisualizerStore } from '../store/visualizerStore';

export const MasterBedroom: React.FC = () => {
  const { lightingTime } = useVisualizerStore();
  const isNight = lightingTime === 'night';
  const hardwoodTex = useMemo(() => getHardwoodFloorTexture(isNight), [isNight]);

  return (
    <group position={[0, 0, 0]}>
      {/* ── Floor ── */}
      <PBRWall
        partId="master_bedroom/floor"
        label="Master Bedroom Floor"
        labelHi="मास्टर बेडरूम फर्श"
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        size={[8.2, 8.2, 0.12]}
        defaultColor="#5B3E2B"
        defaultTexture={hardwoodTex}
        receiveShadow
      />

      {/* ── Ceiling ── */}
      <PBRWall
        partId="master_bedroom/ceiling"
        label="Master Bedroom Ceiling"
        labelHi="सीलिंग"
        position={[0, 3.3, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        size={[8.2, 8.2, 0.08]}
        defaultColor="#FAF8F5"
        receiveShadow
      />
      {/* Cove glow */}
      <pointLight position={[0, 3.16, 0]} intensity={isNight ? 2.0 : 1.2} color="#FFF0DC" distance={7.5} />

      {/* ── Back Wall ── */}
      <PBRWall
        partId="master_bedroom/back-wall"
        label="Bed Headboard Wall"
        labelHi="हेडबोर्ड दीवार"
        position={[0, 1.65, -4]}
        size={[8.2, 3.3, 0.14]}
        defaultColor="#EAE4F0"
        castShadow
        receiveShadow
      />

      {/* ── Accent Feature Wall (Centered) ── */}
      <PBRWall
        partId="master_bedroom/accent-wall"
        label="Master Bed Accent Wall"
        labelHi="मास्टर बेडरूम एक्सेंट वॉल"
        position={[0, 1.65, -3.93]}
        size={[4.8, 3.3, 0.03]}
        defaultColor="#8C9A8E"
        receiveShadow
      />

      {/* ── Left Wall ── */}
      <PBRWall
        partId="master_bedroom/left-wall"
        label="Left Wall"
        labelHi="लेफ्ट वॉल"
        position={[-4.1, 1.65, 0]}
        rotation={[0, Math.PI / 2, 0]}
        size={[8.2, 3.3, 0.14]}
        defaultColor="#EAE4F0"
        castShadow
        receiveShadow
      />

      {/* ── Right Wall (Wardrobe Side) ── */}
      <PBRWall
        partId="master_bedroom/right-wall"
        label="Right Wall"
        labelHi="राइट वॉल"
        position={[4.1, 1.65, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        size={[8.2, 3.3, 0.14]}
        defaultColor="#EAE4F0"
        castShadow
        receiveShadow
      />

      {/* ── Front Wall (Panoramic Open Frame with Window) ── */}
      <group position={[0, 0, 4.1]}>
        <PBRWall
          partId="master_bedroom/front-wall"
          label="Front Wall"
          labelHi="फ्रंट वॉल"
          position={[-3.3, 1.65, 0]}
          size={[1.6, 3.3, 0.14]}
          defaultColor="#EAE4F0"
          receiveShadow
        />
        <PBRWall
          partId="master_bedroom/front-wall-right"
          label="Front Wall Right"
          labelHi="फ्रंट वॉल"
          position={[3.3, 1.65, 0]}
          size={[1.6, 3.3, 0.14]}
          defaultColor="#EAE4F0"
          receiveShadow
        />
        {/* Balcony window glass */}
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[5.0, 3.0, 0.02]} />
          <meshStandardMaterial color="#A8D8F0" transparent opacity={0.15} roughness={0.05} />
        </mesh>
      </group>

      {/* ── Furniture: King Size Platform Bed ── */}
      <group position={[0, 0, -2.4]}>
        {/* Mattress Base */}
        <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 0.42, 2.7]} />
          <meshStandardMaterial color="#F8F8F6" roughness={0.9} />
        </mesh>
        {/* Bed Linen Duvet */}
        <mesh position={[0, 0.32, 0.35]} castShadow receiveShadow>
          <boxGeometry args={[2.42, 0.36, 1.9]} />
          <meshStandardMaterial color="#E0DCD6" roughness={0.8} />
        </mesh>
        {/* Fluted Headboard */}
        <mesh position={[0, 1.05, -1.36]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 1.55, 0.18]} />
          <meshStandardMaterial color="#2B303A" roughness={0.8} />
        </mesh>
        {/* Pillows */}
        {[-0.65, 0.65].map((px, i) => (
          <mesh key={i} position={[px, 0.58, -0.9]} rotation={[0.25, 0, 0]} castShadow>
            <boxGeometry args={[0.7, 0.35, 0.45]} />
            <meshStandardMaterial color="#FAFAFA" roughness={0.9} />
          </mesh>
        ))}
        {/* Accent Cushion */}
        <mesh position={[0, 0.56, -0.75]} castShadow>
          <boxGeometry args={[0.45, 0.3, 0.15]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.9} />
        </mesh>
      </group>

      {/* Nightstands & Hanging Brass Pendants */}
      {[-1.9, 1.9].map((nx, ni) => (
        <group key={ni} position={[nx, 0, -3.4]}>
          <mesh position={[0, 0.26, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.6, 0.52, 0.5]} />
            <meshStandardMaterial color="#2A221C" roughness={0.6} />
          </mesh>
          {/* Drop Brass Pendant */}
          <mesh position={[0, 1.9, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 0.28, 16]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
          </mesh>
          <pointLight position={[0, 1.7, 0]} intensity={isNight ? 2.4 : 0.8} color="#FFDCA8" distance={4} />
        </group>
      ))}

      {/* Modern Floor Rug under bed */}
      <mesh position={[0, 0.065, -1.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4.2, 4.4]} />
        <meshStandardMaterial color="#DDD8CE" roughness={0.95} />
      </mesh>
    </group>
  );
};
