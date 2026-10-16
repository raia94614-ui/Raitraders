import React, { useRef, useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { Wall } from './Wall';
import { useVisualizerStore } from './store';
import type { RoomId } from './store';
import {
  getHardwoodFloorTexture,
  getAcousticWoodWallTexture,
  getDeckPlanksTexture,
  getLawnTexture,
} from './architecturalMaterials';

interface RoomConfig {
  id: RoomId;
  label: string;
  wallColor: string;
  floorColor: string;
  ceilingColor: string;
  accentColor: string;
}

const ROOM_CONFIGS: RoomConfig[] = [
  { id: 'living', label: 'Living Room', wallColor: '#F5F0EB', floorColor: '#3E2E20', ceilingColor: '#FAFAF8', accentColor: '#D4B896' },
  { id: 'bedroom', label: 'Bedroom', wallColor: '#EAE4F0', floorColor: '#382A1E', ceilingColor: '#F8F5FC', accentColor: '#C8A8D0' },
  { id: 'kitchen', label: 'Kitchen', wallColor: '#F0F5F0', floorColor: '#4A3E34', ceilingColor: '#FAFAFA', accentColor: '#90C090' },
  { id: 'kids', label: "Kids' Room", wallColor: '#FFF8EB', floorColor: '#5C442A', ceilingColor: '#FFFEF0', accentColor: '#FFC875' },
];

/** Designer Italian Sectional Sofa with cushions */
const LuxurySofa: React.FC<{ position: [number, number, number]; rotation?: number }> = ({
  position: [px, py, pz],
  rotation = 0,
}) => (
  <group position={[px, py, pz]} rotation={[0, rotation, 0]}>
    {/* Base Plinth (Dark Walnut) */}
    <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
      <boxGeometry args={[3.2, 0.12, 1.1]} />
      <meshStandardMaterial color="#221810" roughness={0.7} />
    </mesh>

    {/* Main Seat Cushion */}
    <mesh position={[-0.45, 0.28, 0]} castShadow receiveShadow>
      <boxGeometry args={[2.2, 0.32, 1.05]} />
      <meshStandardMaterial color="#323338" roughness={0.85} />
    </mesh>

    {/* Chaise Cushion (L-shape extension) */}
    <mesh position={[1.1, 0.28, 0.35]} castShadow receiveShadow>
      <boxGeometry args={[0.9, 0.32, 1.75]} />
      <meshStandardMaterial color="#323338" roughness={0.85} />
    </mesh>

    {/* Backrest */}
    <mesh position={[-0.45, 0.62, -0.42]} castShadow receiveShadow>
      <boxGeometry args={[2.2, 0.44, 0.22]} />
      <meshStandardMaterial color="#2B2C30" roughness={0.85} />
    </mesh>
    <mesh position={[1.1, 0.62, -0.42]} castShadow receiveShadow>
      <boxGeometry args={[0.9, 0.44, 0.22]} />
      <meshStandardMaterial color="#2B2C30" roughness={0.85} />
    </mesh>

    {/* Left Armrest */}
    <mesh position={[-1.5, 0.42, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.22, 0.36, 1.05]} />
      <meshStandardMaterial color="#28292D" roughness={0.85} />
    </mesh>

    {/* Decorative Accent Throw Pillows */}
    {[
      { pos: [-1.2, 0.52, -0.25] as [number, number, number], rot: 0.15, col: '#D4AF37' },
      { pos: [-0.6, 0.52, -0.28] as [number, number, number], rot: -0.1, col: '#8B7355' },
      { pos: [0.3, 0.52, -0.26] as [number, number, number], rot: 0.2, col: '#C49A45' },
    ].map((pl, i) => (
      <mesh key={i} position={pl.pos} rotation={[0, pl.rot, 0]} castShadow>
        <boxGeometry args={[0.38, 0.35, 0.12]} />
        <meshStandardMaterial color={pl.col} roughness={0.9} />
      </mesh>
    ))}
  </group>
);

/** Designer Dual Nesting Coffee Tables */
const NestingCoffeeTables: React.FC<{ position: [number, number, number] }> = ({
  position: [px, py, pz],
}) => (
  <group position={[px, py, pz]}>
    {/* Table 1: Circular White Marble Top */}
    <group position={[-0.35, 0, 0]}>
      <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.04, 32]} />
        <meshStandardMaterial color="#F8F8F6" roughness={0.25} metalness={0.05} />
      </mesh>
      {/* Brass Edge Rim */}
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.56, 0.56, 0.038, 32]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Black Tripod Legs */}
      {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((ang, i) => (
        <mesh
          key={i}
          position={[Math.cos(ang) * 0.42, 0.18, Math.sin(ang) * 0.42]}
          castShadow
        >
          <cylinderGeometry args={[0.02, 0.02, 0.36, 8]} />
          <meshStandardMaterial color="#1A1816" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
    </group>

    {/* Table 2: Smaller Dark Oak Table */}
    <group position={[0.45, 0, 0.25]}>
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.035, 24]} />
        <meshStandardMaterial color="#2B1D14" roughness={0.5} />
      </mesh>
      {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((ang, i) => (
        <mesh
          key={i}
          position={[Math.cos(ang) * 0.28, 0.13, Math.sin(ang) * 0.28]}
          castShadow
        >
          <cylinderGeometry args={[0.018, 0.018, 0.26, 8]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
    </group>
  </group>
);

/** Modern Floating Media Console & OLED Screen */
const LuxuryMediaWall: React.FC<{ position: [number, number, number] }> = ({
  position: [px, py, pz],
}) => (
  <group position={[px, py, pz]}>
    {/* Floating Walnut Credenza */}
    <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
      <boxGeometry args={[3.2, 0.38, 0.45]} />
      <meshStandardMaterial color="#261A12" roughness={0.6} />
    </mesh>

    {/* Ultra-Slim OLED TV */}
    <group position={[0, 1.5, 0.1]}>
      {/* TV Frame */}
      <mesh castShadow>
        <boxGeometry args={[2.5, 1.35, 0.04]} />
        <meshStandardMaterial color="#0A0B0D" roughness={0.15} metalness={0.8} />
      </mesh>
      {/* Display Screen with Ambient Art / Glow */}
      <mesh position={[0, 0, 0.022]}>
        <boxGeometry args={[2.42, 1.28, 0.005]} />
        <meshStandardMaterial
          color="#121D30"
          emissive="#0A1828"
          emissiveIntensity={0.6}
          roughness={0.05}
        />
      </mesh>
      {/* Ambient Backlight Glow onto Accent Wall */}
      <pointLight position={[0, 0, -0.1]} intensity={1.5} color="#D4AF37" distance={2.5} />
    </group>

    {/* Minimalist Soundbar */}
    <mesh position={[0, 0.72, 0.08]} castShadow>
      <boxGeometry args={[1.4, 0.08, 0.08]} />
      <meshStandardMaterial color="#111316" roughness={0.4} metalness={0.6} />
    </mesh>
  </group>
);

/** Modern Architectural Floor Lamp */
const ModernFloorLamp: React.FC<{ position: [number, number, number] }> = ({
  position: [px, py, pz],
}) => (
  <group position={[px, py, pz]}>
    {/* Heavy Marble Base */}
    <mesh position={[0, 0.03, 0]} castShadow>
      <cylinderGeometry args={[0.22, 0.22, 0.06, 16]} />
      <meshStandardMaterial color="#1A1816" roughness={0.3} />
    </mesh>
    {/* Slender Brass Stem */}
    <mesh position={[0, 1.05, 0]} castShadow>
      <cylinderGeometry args={[0.015, 0.015, 2.0, 12]} />
      <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
    </mesh>
    {/* Lamp Shade (Warm Linen) */}
    <mesh position={[0, 1.85, 0]}>
      <cylinderGeometry args={[0.2, 0.28, 0.32, 16, 1, true]} />
      <meshStandardMaterial
        color="#FFF2D6"
        emissive="#FFD98C"
        emissiveIntensity={1.2}
        roughness={0.9}
        side={2}
      />
    </mesh>
    {/* Warm Light Glow */}
    <pointLight position={[0, 1.85, 0]} intensity={2.8} color="#FFE6A8" distance={4.5} decay={2} />
  </group>
);

/** Designer King Platform Bed with Fluted Headboard */
const LuxuryBed: React.FC<{ position: [number, number, number] }> = ({
  position: [px, py, pz],
}) => (
  <group position={[px, py, pz]}>
    {/* Low-profile platform frame */}
    <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
      <boxGeometry args={[2.4, 0.22, 2.6]} />
      <meshStandardMaterial color="#2B1F16" roughness={0.6} />
    </mesh>
    {/* Plush Mattress */}
    <mesh position={[0, 0.38, 0.1]} castShadow receiveShadow>
      <boxGeometry args={[2.1, 0.32, 2.3]} />
      <meshStandardMaterial color="#F5F2EB" roughness={0.9} />
    </mesh>
    {/* Draped Designer Quilt / Throw */}
    <mesh position={[0, 0.44, 0.5]} castShadow receiveShadow>
      <boxGeometry args={[2.12, 0.24, 1.4]} />
      <meshStandardMaterial color="#3A4048" roughness={0.8} />
    </mesh>

    {/* Tall Fluted Wood Headboard with Integrated Backlight */}
    <group position={[0, 1.1, -1.18]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.6, 1.5, 0.1]} />
        <meshStandardMaterial color="#352418" roughness={0.7} />
      </mesh>
      {/* Warm LED Strip glowing behind headboard */}
      <pointLight position={[0, 0.8, 0.1]} intensity={2.0} color="#FFD285" distance={3.5} />
    </group>

    {/* 4 Plush Sleeping Pillows */}
    {[-0.55, 0.55].map((x, i) => (
      <group key={i} position={[x, 0.6, -0.75]}>
        <mesh position={[0, 0, 0]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.75, 0.16, 0.45]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.08, 0.18]} rotation={[0.3, 0, 0]} castShadow>
          <boxGeometry args={[0.65, 0.14, 0.4]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.9} />
        </mesh>
      </group>
    ))}

    {/* Cantilevered Nightstands (Left & Right) */}
    {[-1.55, 1.55].map((nx, ni) => (
      <group key={ni} position={[nx, 0.32, -0.95]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.55, 0.22, 0.45]} />
          <meshStandardMaterial color="#1E140C" roughness={0.6} />
        </mesh>
        {/* Designer bedside lamp */}
        <mesh position={[0, 0.24, 0]}>
          <cylinderGeometry args={[0.07, 0.09, 0.22, 12]} />
          <meshStandardMaterial
            color="#FFF4DC"
            emissive="#FFD78A"
            emissiveIntensity={1.4}
            roughness={0.7}
          />
        </mesh>
        <pointLight position={[0, 0.28, 0]} intensity={1.8} color="#FFD78A" distance={2.5} />
      </group>
    ))}
  </group>
);

/** Waterfall Calacatta Marble Kitchen Island */
const LuxuryKitchenIsland: React.FC<{ position: [number, number, number] }> = ({
  position: [px, py, pz],
}) => (
  <group position={[px, py, pz]}>
    {/* Marble Waterfall Countertop */}
    <mesh position={[0, 0.88, 0]} castShadow receiveShadow>
      <boxGeometry args={[3.2, 0.08, 1.2]} />
      <meshStandardMaterial color="#F4F4F2" roughness={0.2} metalness={0.08} />
    </mesh>
    {/* Left Waterfall Leg */}
    <mesh position={[-1.56, 0.44, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.08, 0.88, 1.2]} />
      <meshStandardMaterial color="#F4F4F2" roughness={0.2} metalness={0.08} />
    </mesh>
    {/* Right Waterfall Leg */}
    <mesh position={[1.56, 0.44, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.08, 0.88, 1.2]} />
      <meshStandardMaterial color="#F4F4F2" roughness={0.2} metalness={0.08} />
    </mesh>
    {/* Dark Anthracite Inner Cabinets */}
    <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
      <boxGeometry args={[3.0, 0.82, 1.05]} />
      <meshStandardMaterial color="#1E2024" roughness={0.4} />
    </mesh>
    {/* Undermount Composite Sink */}
    <mesh position={[-0.6, 0.85, 0]}>
      <boxGeometry args={[0.7, 0.04, 0.5]} />
      <meshStandardMaterial color="#15171A" roughness={0.3} metalness={0.4} />
    </mesh>
    {/* Brushed Brass Gooseneck Faucet */}
    <group position={[-0.6, 1.05, -0.28]}>
      <mesh>
        <cylinderGeometry args={[0.02, 0.02, 0.35, 10]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>

    {/* 3 Modern Leather Barstools */}
    {[-0.8, 0, 0.8].map((bx, bi) => (
      <group key={bi} position={[bx, 0, 0.8]}>
        <mesh position={[0, 0.62, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.22, 0.08, 16]} />
          <meshStandardMaterial color="#7D5230" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.6, 8]} />
          <meshStandardMaterial color="#111316" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
    ))}
  </group>
);

/** Scandinavian Contemporary Kids Room Setup */
const KidsModernSetup: React.FC<{ position: [number, number, number] }> = ({
  position: [px, py, pz],
}) => (
  <group position={[px, py, pz]}>
    {/* Modern Pastel Platform Bed */}
    <mesh position={[-1.2, 0.22, -1.6]} castShadow receiveShadow>
      <boxGeometry args={[1.8, 0.38, 2.2]} />
      <meshStandardMaterial color="#F4E8D8" roughness={0.7} />
    </mesh>
    <mesh position={[-1.2, 0.44, -1.4]} castShadow receiveShadow>
      <boxGeometry args={[1.65, 0.2, 1.8]} />
      <meshStandardMaterial color="#7CB5C2" roughness={0.85} />
    </mesh>
    {/* Colorful pillows */}
    <mesh position={[-1.2, 0.56, -2.2]} castShadow>
      <boxGeometry args={[0.7, 0.16, 0.35]} />
      <meshStandardMaterial color="#F8B195" roughness={0.9} />
    </mesh>

    {/* Geometric Modular Wall Shelves */}
    <group position={[1.8, 1.5, -3.8]}>
      {[-0.7, 0, 0.7].map((sx, si) => (
        <mesh key={si} position={[sx, (si % 2) * 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.55, 0.55, 0.25]} />
          <meshStandardMaterial color={si === 1 ? '#F67280' : '#355C7D'} roughness={0.6} />
        </mesh>
      ))}
    </group>

    {/* Study Desk & Chair */}
    <group position={[1.4, 0, 0.8]}>
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.05, 0.75]} />
        <meshStandardMaterial color="#E8D9C8" roughness={0.5} />
      </mesh>
      {[-0.7, 0.7].map((lx, li) => (
        <mesh key={li} position={[lx, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.7, 8]} />
          <meshStandardMaterial color="#2B2D32" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
    </group>
  </group>
);

/** The interior room scene with walls, ceiling, floor, accent wall, and designer furniture */
export const Room: React.FC = () => {
  const { currentRoom, dayNight } = useVisualizerStore();
  const isDark = dayNight === 'night';
  const { camera } = useThree();
  const prevRoom = useRef<RoomId | null>(null);

  const hardwoodTex = useMemo(() => getHardwoodFloorTexture(isDark), [isDark]);
  const acousticWoodTex = useMemo(() => getAcousticWoodWallTexture(), []);
  const deckTex = useMemo(() => getDeckPlanksTexture(), []);
  const lawnTex = useMemo(() => getLawnTexture(isDark), [isDark]);

  const config = ROOM_CONFIGS.find((r) => r.id === currentRoom) ?? ROOM_CONFIGS[0];
  const prefix = currentRoom;

  // Smooth camera transition to room view
  useEffect(() => {
    if (prevRoom.current !== currentRoom) {
      prevRoom.current = currentRoom;
      camera.position.set(0, 3.2, 6.2);
    }
  }, [currentRoom, camera]);

  return (
    <group>
      {/* ── Floor (Clickable to customize) ── */}
      <Wall
        partId={`${prefix}/floor`}
        label="Floor"
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        size={[8.2, 8.2, 0.12]}
        defaultColor={config.floorColor}
        defaultTexture={hardwoodTex}
        receiveShadow
      />

      {/* ── Ceiling with Cove Lighting (Clickable to customize) ── */}
      <Wall
        partId={`${prefix}/ceiling`}
        label="Ceiling"
        position={[0, 3.3, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        size={[8.2, 8.2, 0.08]}
        defaultColor={config.ceilingColor}
        receiveShadow
      />

      {/* Ceiling Perimeter Cove Moulding */}
      <mesh position={[0, 3.22, 0]}>
        <boxGeometry args={[7.6, 0.08, 7.6]} />
        <meshStandardMaterial color="#FAFAF8" roughness={0.8} />
      </mesh>
      {/* Ambient Cove LED Strip Glow */}
      <pointLight position={[0, 3.15, 0]} intensity={1.8} color="#FFF2DA" distance={8} />

      {/* ── Back Wall (Clickable to customize) ── */}
      <Wall
        partId={`${prefix}/back-wall`}
        label="Back Wall"
        position={[0, 1.65, -4]}
        size={[8.2, 3.3, 0.14]}
        defaultColor={config.wallColor}
        castShadow
        receiveShadow
      />

      {/* ── Accent Feature Wall (Centered on Back Wall) ── */}
      <Wall
        partId={`${prefix}/accent-wall`}
        label="Accent Feature Wall"
        position={[0, 1.65, -3.93]}
        size={[4.2, 3.3, 0.03]}
        defaultColor={config.accentColor}
        receiveShadow
      />

      {/* Acoustic Wood Slats flanking accent wall */}
      <mesh position={[-2.95, 1.65, -3.92]}>
        <boxGeometry args={[1.7, 3.3, 0.04]} />
        <meshStandardMaterial color="#8C5E37" map={acousticWoodTex} roughness={0.65} />
      </mesh>
      <mesh position={[2.95, 1.65, -3.92]}>
        <boxGeometry args={[1.7, 3.3, 0.04]} />
        <meshStandardMaterial color="#8C5E37" map={acousticWoodTex} roughness={0.65} />
      </mesh>

      {/* Brass Vertical Inlay Accent Strips */}
      {[-2.1, 2.1].map((bx, bi) => (
        <mesh key={bi} position={[bx, 1.65, -3.91]}>
          <boxGeometry args={[0.03, 3.3, 0.02]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.15} />
        </mesh>
      ))}

      {/* ── Left Wall (Clickable to customize) ── */}
      <Wall
        partId={`${prefix}/left-wall`}
        label="Left Wall"
        position={[-4.1, 1.65, 0]}
        rotation={[0, Math.PI / 2, 0]}
        size={[8.2, 3.3, 0.14]}
        defaultColor={config.wallColor}
        castShadow
        receiveShadow
      />

      {/* ── Right Wall (Clickable to customize) ── */}
      <Wall
        partId={`${prefix}/right-wall`}
        label="Right Wall"
        position={[4.1, 1.65, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        size={[8.2, 3.3, 0.14]}
        defaultColor={config.wallColor}
        castShadow
        receiveShadow
      />

      {/* ── Front Wall (Panoramic Open Cutaway with Frame) ── */}
      <group position={[0, 0, 4.1]}>
        {/* Left Pillar (Clickable to customize) */}
        <Wall
          partId={`${prefix}/front-wall`}
          label="Front Wall"
          position={[-3.3, 1.65, 0]}
          size={[1.6, 3.3, 0.14]}
          defaultColor={config.wallColor}
          receiveShadow
        />
        {/* Right Pillar */}
        <Wall
          partId={`${prefix}/front-wall-right`}
          label="Front Wall"
          position={[3.3, 1.65, 0]}
          size={[1.6, 3.3, 0.14]}
          defaultColor={config.wallColor}
          receiveShadow
        />
        {/* Top Header Beam */}
        <mesh position={[0, 3.15, 0]}>
          <boxGeometry args={[8.2, 0.3, 0.14]} />
          <meshStandardMaterial color={config.wallColor} roughness={0.8} />
        </mesh>
        {/* Floor-to-ceiling panoramic sliding glass portal */}
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[5.0, 3.0, 0.02]} />
          <meshStandardMaterial
            color="#A8D8F0"
            transparent
            opacity={0.15}
            roughness={0.05}
          />
        </mesh>
        {/* Slim black glass door mullions */}
        {[-1.25, 1.25].map((gx, gi) => (
          <mesh key={gi} position={[gx, 1.5, 0.02]}>
            <boxGeometry args={[0.06, 3.0, 0.04]} />
            <meshStandardMaterial color="#1A1816" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}

        {/* ── Outdoor Garden Terrace visible through the Panoramic Glass ── */}
        <group position={[0, 0, 0.2]}>
          {/* Terrace wood deck floor */}
          <mesh position={[0, -0.04, 1.8]} receiveShadow>
            <boxGeometry args={[8.2, 0.08, 3.6]} />
            <meshStandardMaterial color="#4A3425" map={deckTex} roughness={0.7} />
          </mesh>
          {/* Green lawn in background */}
          <mesh position={[0, -0.09, 6.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[24, 8]} />
            <meshStandardMaterial color={isDark ? '#182C18' : '#3E6E34'} map={lawnTex} roughness={0.9} />
          </mesh>
          {/* Glass terrace balustrade */}
          <mesh position={[0, 0.45, 3.6]}>
            <boxGeometry args={[8.0, 0.85, 0.04]} />
            <meshStandardMaterial color="#A0D0E8" transparent opacity={0.25} roughness={0.05} />
          </mesh>
          {/* Terrace planter box with lush green shrubs */}
          <mesh position={[0, 0.2, 3.5]}>
            <boxGeometry args={[6.4, 0.4, 0.4]} />
            <meshStandardMaterial color="#1C1E22" roughness={0.8} />
          </mesh>
          {[-2.4, -1.2, 0, 1.2, 2.4].map((px, pi) => (
            <mesh key={pi} position={[px, 0.45, 3.5]}>
              <sphereGeometry args={[0.26, 8, 8]} />
              <meshStandardMaterial color={isDark ? '#1C3820' : '#2D5A27'} roughness={0.95} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ── Furniture by Room Type ── */}
      {currentRoom === 'living' && (
        <>
          {/* Designer Area Rug */}
          <mesh position={[0, 0.065, -0.4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[4.6, 3.6]} />
            <meshStandardMaterial color="#EAE5DC" roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.066, -0.4]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.9, 1.95, 4]} />
            <meshStandardMaterial color="#D4AF37" roughness={0.8} />
          </mesh>

          <LuxurySofa position={[0, 0, -1.2]} />
          <NestingCoffeeTables position={[0, 0, 0.4]} />
          <LuxuryMediaWall position={[0, 0, -3.75]} />
          <ModernFloorLamp position={[-3.2, 0, -2.8]} />
        </>
      )}

      {currentRoom === 'bedroom' && (
        <>
          <LuxuryBed position={[0, 0, -2.4]} />
          <ModernFloorLamp position={[-3.2, 0, 0]} />
        </>
      )}

      {currentRoom === 'kitchen' && (
        <>
          <LuxuryKitchenIsland position={[0, 0, -1.2]} />
          <ModernFloorLamp position={[-3.2, 0, -2.8]} />
        </>
      )}

      {currentRoom === 'kids' && (
        <KidsModernSetup position={[0, 0, 0]} />
      )}
    </group>
  );
};
