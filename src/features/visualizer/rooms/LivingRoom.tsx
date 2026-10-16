import React, { useMemo } from 'react';
import { PBRWall } from '../scene/PBRWall';
import {
  getHardwoodFloorTexture,
  getAcousticWoodWallTexture,
  getDeckPlanksTexture,
  getLawnTexture,
} from '../../../visualizer/architecturalMaterials';
import { useVisualizerStore } from '../store/visualizerStore';

export const LivingRoom: React.FC = () => {
  const { lightingTime } = useVisualizerStore();
  const isNight = lightingTime === 'night';

  const hardwoodTex = useMemo(() => getHardwoodFloorTexture(isNight), [isNight]);
  const acousticSlats = useMemo(() => getAcousticWoodWallTexture(), []);
  const deckTex = useMemo(() => getDeckPlanksTexture(), []);
  const lawnTex = useMemo(() => getLawnTexture(isNight), [isNight]);

  return (
    <group position={[0, 0, 0]}>
      {/* ── 1. Floor ── */}
      <PBRWall
        partId="living/floor"
        label="Living Room Floor"
        labelHi="लिविंग रूम फर्श"
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        size={[8.2, 8.2, 0.12]}
        defaultColor="#5B3E2B"
        defaultTexture={hardwoodTex}
        receiveShadow
      />

      {/* ── 2. Ceiling with Recessed Cove LED ── */}
      <PBRWall
        partId="living/ceiling"
        label="Living Room Ceiling"
        labelHi="लिविंग रूम सीलिंग"
        position={[0, 3.3, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        size={[8.2, 8.2, 0.08]}
        defaultColor="#FAFAF7"
        receiveShadow
      />
      {/* Cove perimeter moulding */}
      <mesh position={[0, 3.22, 0]}>
        <boxGeometry args={[7.6, 0.08, 7.6]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
      </mesh>
      {/* Ambient warm cove light strip */}
      <pointLight position={[0, 3.16, 0]} intensity={isNight ? 2.5 : 1.4} color="#FFE6C2" distance={8} />

      {/* ── 3. Back Wall ── */}
      <PBRWall
        partId="living/back-wall"
        label="Living Back Wall"
        labelHi="बैक वॉल"
        position={[0, 1.65, -4]}
        size={[8.2, 3.3, 0.14]}
        defaultColor="#F5F0EB"
        castShadow
        receiveShadow
      />

      {/* ── 4. Accent Feature Wall ── */}
      <PBRWall
        partId="living/accent-wall"
        label="Accent Feature Wall"
        labelHi="एक्सेंट फीचर वॉल"
        position={[0, 1.65, -3.93]}
        size={[4.2, 3.3, 0.03]}
        defaultColor="#0B1530"
        receiveShadow
      />

      {/* Acoustic Wood Slats flanking accent wall */}
      <mesh position={[-2.95, 1.65, -3.92]} castShadow receiveShadow>
        <boxGeometry args={[1.7, 3.3, 0.04]} />
        <meshStandardMaterial color="#8C5E37" map={acousticSlats} roughness={0.65} />
      </mesh>
      <mesh position={[2.95, 1.65, -3.92]} castShadow receiveShadow>
        <boxGeometry args={[1.7, 3.3, 0.04]} />
        <meshStandardMaterial color="#8C5E37" map={acousticSlats} roughness={0.65} />
      </mesh>

      {/* Brass vertical inlay strips */}
      {[-2.1, 2.1].map((bx, bi) => (
        <mesh key={bi} position={[bx, 1.65, -3.91]}>
          <boxGeometry args={[0.03, 3.3, 0.02]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.15} />
        </mesh>
      ))}

      {/* ── 5. Left Wall ── */}
      <PBRWall
        partId="living/left-wall"
        label="Living Left Wall"
        labelHi="लेफ्ट वॉल"
        position={[-4.1, 1.65, 0]}
        rotation={[0, Math.PI / 2, 0]}
        size={[8.2, 3.3, 0.14]}
        defaultColor="#F5F0EB"
        castShadow
        receiveShadow
      />

      {/* ── 6. Right Wall ── */}
      <PBRWall
        partId="living/right-wall"
        label="Living Right Wall"
        labelHi="राइट वॉल"
        position={[4.1, 1.65, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        size={[8.2, 3.3, 0.14]}
        defaultColor="#F5F0EB"
        castShadow
        receiveShadow
      />

      {/* ── 7. Front Wall with Panoramic Sliding Glass Doors ── */}
      <group position={[0, 0, 4.1]}>
        <PBRWall
          partId="living/front-wall"
          label="Front Wall Left Pillar"
          labelHi="फ्रंट वॉल पिलर"
          position={[-3.3, 1.65, 0]}
          size={[1.6, 3.3, 0.14]}
          defaultColor="#F5F0EB"
          receiveShadow
        />
        <PBRWall
          partId="living/front-wall-right"
          label="Front Wall Right Pillar"
          labelHi="फ्रंट वॉल पिलर"
          position={[3.3, 1.65, 0]}
          size={[1.6, 3.3, 0.14]}
          defaultColor="#F5F0EB"
          receiveShadow
        />
        {/* Top Header */}
        <mesh position={[0, 3.15, 0]}>
          <boxGeometry args={[8.2, 0.3, 0.14]} />
          <meshStandardMaterial color="#F5F0EB" roughness={0.8} />
        </mesh>
        {/* Panoramic Glass Portal */}
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[5.0, 3.0, 0.02]} />
          <meshStandardMaterial color="#A8D8F0" transparent opacity={0.15} roughness={0.05} />
        </mesh>
        {[-1.25, 1.25].map((gx, gi) => (
          <mesh key={gi} position={[gx, 1.5, 0.02]}>
            <boxGeometry args={[0.06, 3.0, 0.04]} />
            <meshStandardMaterial color="#1A1816" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}

        {/* Outdoor Terrace View visible through glass */}
        <group position={[0, 0, 0.2]}>
          <mesh position={[0, -0.04, 1.8]} receiveShadow>
            <boxGeometry args={[8.2, 0.08, 3.6]} />
            <meshStandardMaterial color="#4A3425" map={deckTex} roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.09, 6.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[24, 8]} />
            <meshStandardMaterial color={isNight ? '#182C18' : '#3E6E34'} map={lawnTex} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.45, 3.6]}>
            <boxGeometry args={[8.0, 0.85, 0.04]} />
            <meshStandardMaterial color="#A0D0E8" transparent opacity={0.25} roughness={0.05} />
          </mesh>
        </group>
      </group>

      {/* ── 8. Luxury Living Furniture & Decor ── */}
      {/* Designer Area Rug */}
      <mesh position={[0, 0.065, -0.4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4.6, 3.6]} />
        <meshStandardMaterial color="#EAE5DC" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.066, -0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.9, 1.95, 4]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.8} />
      </mesh>

      {/* Italian Sectional Charcoal Sofa */}
      <group position={[0, 0, -1.2]}>
        <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.12, 1.1]} />
          <meshStandardMaterial color="#221810" roughness={0.7} />
        </mesh>
        <mesh position={[-0.45, 0.28, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.32, 1.05]} />
          <meshStandardMaterial color="#323338" roughness={0.85} />
        </mesh>
        <mesh position={[1.1, 0.28, 0.35]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.32, 1.75]} />
          <meshStandardMaterial color="#323338" roughness={0.85} />
        </mesh>
        <mesh position={[-0.45, 0.62, -0.42]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.44, 0.22]} />
          <meshStandardMaterial color="#2B2C30" roughness={0.85} />
        </mesh>
        <mesh position={[1.1, 0.62, -0.42]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.44, 0.22]} />
          <meshStandardMaterial color="#2B2C30" roughness={0.85} />
        </mesh>
        <mesh position={[-1.5, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.22, 0.36, 1.05]} />
          <meshStandardMaterial color="#28292D" roughness={0.85} />
        </mesh>
        {/* Throw Pillows */}
        {[
          { pos: [-1.2, 0.52, -0.25] as [number, number, number], col: '#D4AF37' },
          { pos: [-0.6, 0.52, -0.28] as [number, number, number], col: '#8B7355' },
          { pos: [0.3, 0.52, -0.26] as [number, number, number], col: '#D4AF37' },
        ].map((p, pi) => (
          <mesh key={pi} position={p.pos} castShadow>
            <boxGeometry args={[0.38, 0.35, 0.12]} />
            <meshStandardMaterial color={p.col} roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Marble & Brass Nesting Tables */}
      <group position={[0, 0, 0.4]}>
        <mesh position={[-0.35, 0.38, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.55, 0.55, 0.04, 32]} />
          <meshStandardMaterial color="#F8F8F6" roughness={0.25} metalness={0.05} />
        </mesh>
        <mesh position={[-0.35, 0.38, 0]}>
          <cylinderGeometry args={[0.56, 0.56, 0.038, 32]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0.45, 0.28, 0.25]} castShadow receiveShadow>
          <cylinderGeometry args={[0.38, 0.38, 0.035, 24]} />
          <meshStandardMaterial color="#2B1D14" roughness={0.5} />
        </mesh>
      </group>

      {/* Floating OLED Media Unit */}
      <group position={[0, 0, -3.75]}>
        <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.8, 0.45, 0.45]} />
          <meshStandardMaterial color="#1E1916" roughness={0.6} />
        </mesh>
        {/* OLED Screen */}
        <mesh position={[0, 1.85, 0.02]} castShadow>
          <boxGeometry args={[2.4, 1.35, 0.03]} />
          <meshStandardMaterial color="#0A0C10" roughness={0.15} metalness={0.8} />
        </mesh>
        {/* TV Backlight Glow */}
        <pointLight position={[0, 1.85, 0.08]} intensity={isNight ? 2.2 : 0.8} color="#D8E8FF" distance={3.5} />
      </group>

      {/* Arc Floor Lamp */}
      <group position={[-3.2, 0, -2.8]}>
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.05, 24]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.25, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 2.4, 12]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.45, 2.3, 0]}>
          <cylinderGeometry args={[0.22, 0.26, 0.25, 20]} />
          <meshStandardMaterial color="#1A1816" metalness={0.5} roughness={0.4} />
        </mesh>
        <pointLight position={[0.45, 2.15, 0]} intensity={isNight ? 3.0 : 0.9} color="#FFD899" distance={5} />
      </group>
    </group>
  );
};
