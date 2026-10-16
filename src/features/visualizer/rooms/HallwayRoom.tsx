import React, { useMemo } from 'react';
import { PBRWall } from '../scene/PBRWall';
import {
  getMarbleTexture,
  getAcousticWoodWallTexture,
} from '../../../visualizer/architecturalMaterials';
import { useVisualizerStore } from '../store/visualizerStore';

export const HallwayRoom: React.FC = () => {
  const { lightingTime } = useVisualizerStore();
  const isNight = lightingTime === 'night';

  const marbleFloor = useMemo(() => getMarbleTexture(), []);
  const flutedPanels = useMemo(() => getAcousticWoodWallTexture(), []);

  return (
    <group position={[0, 0, 0]}>
      {/* ── Polished Marble Floor ── */}
      <PBRWall
        partId="hallway/floor"
        label="Gallery Marble Floor"
        labelHi="गैलरी संगमरमर फर्श"
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        size={[5.2, 8.8, 0.1]}
        defaultColor="#F7F6F2"
        defaultTexture={marbleFloor}
        receiveShadow
      />

      {/* ── Ceiling with Architectural Cove Light ── */}
      <PBRWall
        partId="hallway/ceiling"
        label="Hallway Ceiling"
        labelHi="हॉलवे सीलिंग (छत)"
        position={[0, 3.4, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        size={[5.2, 8.8, 0.08]}
        defaultColor="#FFFFFF"
        receiveShadow
      />
      {/* Recessed Warm Downlights */}
      {[-2, 0, 2].map((z, idx) => (
        <group key={`cove-light-${idx}`} position={[0, 3.38, z]}>
          <mesh>
            <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
          <pointLight intensity={isNight ? 1.6 : 0.9} color="#FFE6C2" distance={5} />
        </group>
      ))}

      {/* ── Back Wall (Gallery Feature Wall) ── */}
      <PBRWall
        partId="hallway/back-wall"
        label="Gallery End Wall"
        labelHi="बैक गैलरी वॉल"
        position={[0, 1.7, -4.3]}
        size={[5.2, 3.4, 0.14]}
        defaultColor="#F8F6F0"
        castShadow
        receiveShadow
      />

      {/* ── Accent Wall (Fluted Panel / Signature Feature) ── */}
      <PBRWall
        partId="hallway/accent-wall"
        label="Accent Feature Wall"
        labelHi="एक्सेंट फीचर वॉल"
        position={[0, 1.7, -4.24]}
        size={[3.2, 3.4, 0.03]}
        defaultColor="#0C1B33"
        receiveShadow
      />

      {/* Fluted Slat Accents */}
      <mesh position={[-2.0, 1.7, -4.22]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 3.4, 0.04]} />
        <meshStandardMaterial color="#8C5E37" map={flutedPanels} roughness={0.6} />
      </mesh>
      <mesh position={[2.0, 1.7, -4.22]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 3.4, 0.04]} />
        <meshStandardMaterial color="#8C5E37" map={flutedPanels} roughness={0.6} />
      </mesh>

      {/* ── Left Wall (Console & Arched Mirror) ── */}
      <PBRWall
        partId="hallway/left-wall"
        label="Left Wall"
        labelHi="बायां दीवार"
        position={[-2.5, 1.7, 0]}
        rotation={[0, Math.PI / 2, 0]}
        size={[8.8, 3.4, 0.14]}
        defaultColor="#FAF8F5"
        castShadow
        receiveShadow
      />

      {/* ── Right Wall (Sculpture Niches) ── */}
      <PBRWall
        partId="hallway/right-wall"
        label="Right Wall"
        labelHi="दायां दीवार"
        position={[2.5, 1.7, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        size={[8.8, 3.4, 0.14]}
        defaultColor="#FAF8F5"
        castShadow
        receiveShadow
      />

      {/* ── Front Wall (Entryway Arch) ── */}
      <PBRWall
        partId="hallway/front-wall"
        label="Front Archway"
        labelHi="सामने का दरवाजा / मेहराब"
        position={[0, 1.7, 4.3]}
        rotation={[0, Math.PI, 0]}
        size={[5.2, 3.4, 0.14]}
        defaultColor="#FAF8F5"
        castShadow
        receiveShadow
      />

      {/* ── Console Table & Brass Mirror on Left Wall ── */}
      <group position={[-2.2, 0, 0]}>
        {/* Sleek Nero Marquina / Brass Console Table */}
        <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.42, 0.04, 1.8]} />
          <meshStandardMaterial color="#1E293B" roughness={0.1} metalness={0.2} />
        </mesh>
        {/* Slender Brass Legs */}
        {[-0.15, 0.15].map((lx) =>
          [-0.8, 0.8].map((lz) => (
            <mesh key={`c-leg-${lx}-${lz}`} position={[lx, 0.42, lz]} castShadow>
              <cylinderGeometry args={[0.016, 0.016, 0.85, 16]} />
              <meshStandardMaterial color="#E0A96D" metalness={0.9} roughness={0.25} />
            </mesh>
          ))
        )}

        {/* Large Statement Arched Brass Mirror */}
        <group position={[-0.2, 2.05, 0]} rotation={[0, Math.PI / 2, 0]}>
          {/* Mirror Frame */}
          <mesh castShadow>
            <boxGeometry args={[1.2, 1.8, 0.03]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.15} />
          </mesh>
          {/* Mirror Reflective Face */}
          <mesh position={[0, 0, 0.02]}>
            <planeGeometry args={[1.1, 1.7]} />
            <meshStandardMaterial color="#F8FAFC" metalness={0.98} roughness={0.05} />
          </mesh>
        </group>

        {/* Decor on Console: Brass Vase + Dried Pampas */}
        <group position={[0, 0.87, 0.5]}>
          <mesh position={[0, 0.18, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.09, 0.36, 16]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.48, 0]}>
            <coneGeometry args={[0.1, 0.35, 16]} />
            <meshStandardMaterial color="#D97706" roughness={0.9} />
          </mesh>
        </group>

        {/* Marble Sculptural Object */}
        <mesh position={[0, 0.96, -0.4]} castShadow>
          <dodecahedronGeometry args={[0.1]} />
          <meshStandardMaterial color="#F8FAFC" metalness={0.1} roughness={0.2} />
        </mesh>
      </group>

      {/* Recessed Art Niches with Uplights on Right Wall */}
      <group position={[2.4, 1.8, 0]}>
        {[-1.6, 1.6].map((zPos, idx) => (
          <group key={`niche-${idx}`} position={[0, 0, zPos]}>
            {/* Niche Frame */}
            <mesh position={[-0.05, 0, 0]}>
              <boxGeometry args={[0.15, 1.4, 0.9]} />
              <meshStandardMaterial color="#0B132B" roughness={0.8} />
            </mesh>
            {/* Pedestal with Bronze Sculpture */}
            <mesh position={[-0.04, -0.4, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.14, 0.3, 16]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
            </mesh>
            <mesh position={[-0.04, -0.1, 0]} castShadow>
              <torusKnotGeometry args={[0.1, 0.03, 64, 8]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.2} />
            </mesh>
            {/* Niche Warm Light */}
            <pointLight position={[-0.02, 0.5, 0]} intensity={isNight ? 1.2 : 0.6} color="#FFE8BA" distance={2.5} />
          </group>
        ))}
      </group>
    </group>
  );
};
