import React, { useMemo } from 'react';
import { PBRWall } from '../scene/PBRWall';
import { getHardwoodFloorTexture } from '../../../visualizer/architecturalMaterials';
import { useVisualizerStore } from '../store/visualizerStore';

export const KidsRoom: React.FC = () => {
  const { lightingTime } = useVisualizerStore();
  const isNight = lightingTime === 'night';

  const birchFloor = useMemo(() => getHardwoodFloorTexture(isNight), [isNight]);

  return (
    <group position={[0, 0, 0]}>
      {/* ── Floor ── */}
      <PBRWall
        partId="kids/floor"
        label="Kids Room Floor"
        labelHi="कमरे का फर्श"
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        size={[7.6, 7.6, 0.1]}
        defaultColor="#E8DFD3"
        defaultTexture={birchFloor}
        receiveShadow
      />

      {/* ── Ceiling ── */}
      <PBRWall
        partId="kids/ceiling"
        label="Kids Room Ceiling"
        labelHi="सीलिंग (छत)"
        position={[0, 3.2, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        size={[7.6, 7.6, 0.08]}
        defaultColor="#FFFFFF"
        receiveShadow
      />
      <pointLight position={[0, 2.9, 0]} intensity={isNight ? 2.2 : 1.2} color="#FFF5EA" distance={7} />

      {/* ── Back Wall ── */}
      <PBRWall
        partId="kids/back-wall"
        label="Back Wall"
        labelHi="बैक वॉल"
        position={[0, 1.6, -3.7]}
        size={[7.6, 3.2, 0.12]}
        defaultColor="#F0F8FF"
        castShadow
        receiveShadow
      />

      {/* ── Accent Feature Wall (Theme/Wallpaper Wall) ── */}
      <PBRWall
        partId="kids/accent-wall"
        label="Play Feature Wall"
        labelHi="थीम / एक्सेंट वॉल"
        position={[0, 1.6, -3.64]}
        size={[4.2, 3.2, 0.02]}
        defaultColor="#E0F2FE"
        receiveShadow
      />

      {/* ── Left Wall ── */}
      <PBRWall
        partId="kids/left-wall"
        label="Left Wall (Shelves & Toys)"
        labelHi="बायां दीवार"
        position={[-3.7, 1.6, 0]}
        rotation={[0, Math.PI / 2, 0]}
        size={[7.6, 3.2, 0.12]}
        defaultColor="#F8FAFC"
        castShadow
        receiveShadow
      />

      {/* ── Right Wall ── */}
      <PBRWall
        partId="kids/right-wall"
        label="Right Wall (Study Desk)"
        labelHi="दायां दीवार"
        position={[3.7, 1.6, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        size={[7.6, 3.2, 0.12]}
        defaultColor="#F8FAFC"
        castShadow
        receiveShadow
      />

      {/* ── Front Wall (Entry / Wardrobe) ── */}
      <PBRWall
        partId="kids/front-wall"
        label="Front Wall (Wardrobe)"
        labelHi="सामने की दीवार"
        position={[0, 1.6, 3.7]}
        rotation={[0, Math.PI, 0]}
        size={[7.6, 3.2, 0.12]}
        defaultColor="#F1F5F9"
        castShadow
        receiveShadow
      />

      {/* ── 3D Furniture & Accents ── */}

      {/* Modern Low Bed with Oak Frame */}
      <group position={[-1.6, 0.35, -2.4]}>
        {/* Mattress */}
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.32, 2.3]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
        </mesh>
        {/* Bed Base / Frame */}
        <mesh position={[0, -0.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.9, 0.22, 2.4]} />
          <meshStandardMaterial color="#CBB39C" roughness={0.5} />
        </mesh>
        {/* Scandi Headboard */}
        <mesh position={[0, 0.55, -1.15]} castShadow receiveShadow>
          <boxGeometry args={[1.9, 0.85, 0.1]} />
          <meshStandardMaterial color="#FDBA74" roughness={0.6} />
        </mesh>
        {/* Duvet (Pastel Teal / Coral) */}
        <mesh position={[0, 0.2, 0.3]} castShadow>
          <boxGeometry args={[1.75, 0.28, 1.6]} />
          <meshStandardMaterial color="#38BDF8" roughness={0.85} />
        </mesh>
        {/* Pillows */}
        <mesh position={[-0.45, 0.38, -0.8]} castShadow>
          <boxGeometry args={[0.65, 0.18, 0.45]} />
          <meshStandardMaterial color="#FDE047" roughness={0.9} />
        </mesh>
        <mesh position={[0.45, 0.38, -0.8]} castShadow>
          <boxGeometry args={[0.65, 0.18, 0.45]} />
          <meshStandardMaterial color="#F472B6" roughness={0.9} />
        </mesh>
      </group>

      {/* Study Desk & Chair on Right Wall */}
      <group position={[2.6, 0, -1.2]}>
        {/* Desk Top */}
        <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.05, 0.75]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} metalness={0.05} />
        </mesh>
        {/* Wood Legs */}
        {[-0.6, 0.6].map((lx) =>
          [-0.3, 0.3].map((lz) => (
            <mesh key={`desk-leg-${lx}-${lz}`} position={[lx, 0.37, lz]} castShadow>
              <cylinderGeometry args={[0.025, 0.025, 0.74, 16]} />
              <meshStandardMaterial color="#CBB39C" roughness={0.6} />
            </mesh>
          ))
        )}
        {/* Desktop Laptop / Books */}
        <mesh position={[-0.1, 0.77, 0]} castShadow>
          <boxGeometry args={[0.36, 0.02, 0.26]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Desk Lamp */}
        <group position={[0.45, 0.76, -0.15]}>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.07, 0.08, 0.03, 16]} />
            <meshStandardMaterial color="#E2E8F0" />
          </mesh>
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.4, 8]} />
            <meshStandardMaterial color="#E2E8F0" />
          </mesh>
          <mesh position={[0, 0.4, 0.06]} rotation={[0.4, 0, 0]}>
            <coneGeometry args={[0.1, 0.14, 16]} />
            <meshStandardMaterial color="#F59E0B" />
          </mesh>
          <pointLight position={[0, 0.38, 0.08]} intensity={isNight ? 1.4 : 0.6} color="#FFF0D0" distance={3} />
        </group>

        {/* Ergonomic Study Chair */}
        <group position={[0, 0, 0.6]} rotation={[0, Math.PI, 0]}>
          <mesh position={[0, 0.46, 0]} castShadow>
            <boxGeometry args={[0.48, 0.06, 0.46]} />
            <meshStandardMaterial color="#38BDF8" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.8, -0.2]} castShadow>
            <boxGeometry args={[0.46, 0.5, 0.06]} />
            <meshStandardMaterial color="#38BDF8" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.23, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.46, 8]} />
            <meshStandardMaterial color="#64748B" metalness={0.7} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.26, 0.26, 0.04, 16]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        </group>
      </group>

      {/* Floating Bookshelves on Left Wall */}
      <group position={[-3.5, 1.6, -0.5]}>
        {[-0.6, 0, 0.6].map((sy, i) => (
          <group key={`shelf-${i}`} position={[0, sy, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.3, 0.04, 1.6]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
            </mesh>
            {/* Colorful Books */}
            <mesh position={[0, 0.12, -0.4]} castShadow>
              <boxGeometry args={[0.2, 0.22, 0.14]} />
              <meshStandardMaterial color="#EF4444" />
            </mesh>
            <mesh position={[0, 0.14, -0.2]} castShadow>
              <boxGeometry args={[0.2, 0.26, 0.18]} />
              <meshStandardMaterial color="#3B82F6" />
            </mesh>
            <mesh position={[0, 0.11, 0.1]} castShadow>
              <boxGeometry args={[0.2, 0.2, 0.2]} />
              <meshStandardMaterial color="#10B981" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Cozy Round Play Rug */}
      <mesh position={[0.4, 0.015, 0.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.5, 36]} />
        <meshStandardMaterial color="#FEF08A" roughness={0.95} />
      </mesh>

      {/* Scandinavian Teepee / Play Tent */}
      <group position={[2.4, 0, 1.8]} rotation={[0, -0.5, 0]}>
        <mesh position={[0, 1.0, 0]} castShadow>
          <coneGeometry args={[0.9, 2.0, 5, 1, true]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.9} side={2} />
        </mesh>
        {/* Wood Poles */}
        {[0, 1.25, 2.5, 3.75, 5.0].map((angle, idx) => (
          <mesh
            key={`pole-${idx}`}
            position={[Math.cos(angle) * 0.45, 1.05, Math.sin(angle) * 0.45]}
            rotation={[Math.sin(angle) * 0.22, 0, -Math.cos(angle) * 0.22]}
            castShadow
          >
            <cylinderGeometry args={[0.02, 0.02, 2.2, 8]} />
            <meshStandardMaterial color="#D97706" roughness={0.6} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
