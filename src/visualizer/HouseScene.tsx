import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, Sky, Stars } from '@react-three/drei';
import { Controls } from './Controls';
import { Room } from './Room';
import { Wall } from './Wall';
import { useVisualizerStore } from './store';
import {
  getSlattedWoodTexture,
  getDeckPlanksTexture,
  getSteppingStoneTexture,
  getLawnTexture,
} from './architecturalMaterials';

/** Sculptural modern architectural tree (as seen rising through the terrace in the reference villa) */
const ArchitecturalTree: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  return (
    <group position={[-1.2, 0, 1.8]}>
      {/* Main trunk */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.32, 4.4, 12]} />
        <meshStandardMaterial color={isDark ? '#4A423A' : '#7D736A'} roughness={0.9} />
      </mesh>
      {/* Angled secondary branch */}
      <mesh position={[0.4, 3.8, -0.2]} rotation={[0.3, 0.2, 0.45]} castShadow>
        <cylinderGeometry args={[0.13, 0.2, 3.2, 10]} />
        <meshStandardMaterial color={isDark ? '#4A423A' : '#7D736A'} roughness={0.9} />
      </mesh>
      {/* Left upper branch */}
      <mesh position={[-0.3, 4.2, 0.2]} rotation={[-0.2, 0, -0.4]} castShadow>
        <cylinderGeometry args={[0.1, 0.16, 2.8, 10]} />
        <meshStandardMaterial color={isDark ? '#4A423A' : '#7D736A'} roughness={0.9} />
      </mesh>

      {/* Canopy foliage clusters */}
      {[
        { pos: [0.6, 5.6, -0.3] as [number, number, number], r: 1.4 },
        { pos: [-0.6, 5.8, 0.4] as [number, number, number], r: 1.6 },
        { pos: [0.1, 6.4, 0.1] as [number, number, number], r: 1.5 },
        { pos: [1.2, 5.2, -0.5] as [number, number, number], r: 1.2 },
        { pos: [-1.2, 5.0, 0.3] as [number, number, number], r: 1.1 },
      ].map((cl, i) => (
        <mesh key={i} position={cl.pos} castShadow>
          <sphereGeometry args={[cl.r, 8, 8]} />
          <meshStandardMaterial
            color={isDark ? '#1C3320' : '#3E5C38'}
            roughness={0.95}
            transparent
            opacity={0.92}
          />
        </mesh>
      ))}
    </group>
  );
};

/** Terrace outdoor dining table & chairs */
const OutdoorDiningSet: React.FC = () => {
  return (
    <group position={[2.6, 0.42, 0.5]}>
      {/* Dining Table Top */}
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.06, 1.0]} />
        <meshStandardMaterial color="#2B2825" roughness={0.5} metalness={0.15} />
      </mesh>
      {/* Table Legs */}
      {[
        [-0.95, -0.4],
        [0.95, -0.4],
        [-0.95, 0.4],
        [0.95, 0.4],
      ].map(([lx, lz], i) => (
        <mesh key={i} position={[lx, 0.32, lz]} castShadow>
          <boxGeometry args={[0.06, 0.64, 0.06]} />
          <meshStandardMaterial color="#1A1816" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}

      {/* 6 Outdoor Chairs */}
      {[
        { pos: [-0.7, 0, -0.7] as [number, number, number], rot: 0 },
        { pos: [0, 0, -0.7] as [number, number, number], rot: 0 },
        { pos: [0.7, 0, -0.7] as [number, number, number], rot: 0 },
        { pos: [-0.7, 0, 0.7] as [number, number, number], rot: Math.PI },
        { pos: [0, 0, 0.7] as [number, number, number], rot: Math.PI },
        { pos: [0.7, 0, 0.7] as [number, number, number], rot: Math.PI },
      ].map((ch, i) => (
        <group key={i} position={ch.pos} rotation={[0, ch.rot, 0]}>
          {/* Seat */}
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[0.42, 0.04, 0.4]} />
            <meshStandardMaterial color="#3A332C" roughness={0.7} />
          </mesh>
          {/* Backrest */}
          <mesh position={[0, 0.62, -0.18]} castShadow>
            <boxGeometry args={[0.42, 0.4, 0.04]} />
            <meshStandardMaterial color="#3A332C" roughness={0.7} />
          </mesh>
          {/* Legs */}
          {[-0.17, 0.17].map((cx, ci) => (
            <mesh key={ci} position={[cx, 0.2, 0]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.4, 6]} />
              <meshStandardMaterial color="#1A1816" metalness={0.5} roughness={0.4} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};

/** High-end luxury architectural villa exterior matching the user's uploaded reference */
const LuxuryVillaExterior: React.FC = () => {
  const { dayNight } = useVisualizerStore();
  const isDark = dayNight === 'night';

  const slattedWoodTex = useMemo(() => getSlattedWoodTexture('#654326', '#140E08', 14), []);
  const upperFinTex = useMemo(() => getSlattedWoodTexture('#1C1E22', '#0A0C0E', 22), []);
  const deckTex = useMemo(() => getDeckPlanksTexture(), []);
  const lawnTex = useMemo(() => getLawnTexture(isDark), [isDark]);
  const stoneTex = useMemo(() => getSteppingStoneTexture(), []);

  return (
    <group position={[0, 0, 0]}>
      {/* ── 1. Manicured Lawn Ground ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 1]} receiveShadow>
        <planeGeometry args={[36, 36]} />
        <meshStandardMaterial
          color={isDark ? '#182C18' : '#3E6E34'}
          map={lawnTex}
          roughness={0.92}
        />
      </mesh>

      {/* ── 2. Raised Terrace Deck (Right side) ── */}
      <group position={[2.5, 0, 0.4]}>
        {/* Deck Surface (Clickable to customize) */}
        <Wall
          partId="exterior/timber-deck"
          label="Terrace Timber Deck"
          position={[0, 0.2, 0]}
          size={[6.8, 0.4, 5.8]}
          defaultColor="#3D291A"
          defaultTexture={deckTex}
          receiveShadow
        />
        {/* Deck edge fascia border */}
        <mesh position={[0, 0.2, 2.92]} castShadow receiveShadow>
          <boxGeometry args={[6.84, 0.42, 0.06]} />
          <meshStandardMaterial color="#1C1510" roughness={0.8} />
        </mesh>
        <mesh position={[3.42, 0.2, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[5.84, 0.42, 0.06]} />
          <meshStandardMaterial color="#1C1510" roughness={0.8} />
        </mesh>

        {/* Clear Glass Balustrade with Dark Top Cap */}
        <group position={[0, 0.72, 2.85]}>
          {/* Glass pane */}
          <mesh>
            <boxGeometry args={[6.6, 0.65, 0.03]} />
            <meshStandardMaterial
              color="#A0D0E8"
              transparent
              opacity={0.3}
              roughness={0.05}
              metalness={0.1}
            />
          </mesh>
          {/* Metal Top Handrail */}
          <mesh position={[0, 0.34, 0]}>
            <boxGeometry args={[6.64, 0.04, 0.06]} />
            <meshStandardMaterial color="#1C1B1A" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Slim support posts */}
          {[-3.2, -1.6, 0, 1.6, 3.2].map((px, pi) => (
            <mesh key={pi} position={[px, 0, 0]}>
              <boxGeometry args={[0.04, 0.65, 0.05]} />
              <meshStandardMaterial color="#1C1B1A" metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
        </group>

        {/* Outdoor Dining Set */}
        <OutdoorDiningSet />

        {/* Outdoor Kitchen / Grill unit on terrace back right */}
        <mesh position={[2.6, 0.82, -2.0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.85, 0.6]} />
          <meshStandardMaterial color="#22252A" metalness={0.5} roughness={0.3} />
        </mesh>
      </group>

      {/* ── 3. Ground Left Volume: Vertical Wood Slatted Block ── */}
      <group position={[-3.6, 0, -0.6]}>
        {/* Main Wood Slatted Wall (Clickable to customize) */}
        <Wall
          partId="exterior/wood-slat-facade"
          label="Ground Wood Slatted Facade"
          position={[0, 1.5, 1.5]}
          size={[4.8, 3.0, 0.2]}
          defaultColor="#6B4423"
          defaultTexture={slattedWoodTex}
          castShadow
          receiveShadow
        />

        {/* Left Return Wall */}
        <Wall
          partId="exterior/wood-slat-left"
          label="Left Slat Wall"
          position={[-2.4, 1.5, -0.4]}
          rotation={[0, Math.PI / 2, 0]}
          size={[4.0, 3.0, 0.2]}
          defaultColor="#5B381C"
          defaultTexture={slattedWoodTex}
          castShadow
          receiveShadow
        />

        {/* Modern Horizontal Slot Window (Warm interior glow) */}
        <group position={[0.2, 1.35, 1.62]}>
          {/* Black Frame */}
          <mesh>
            <boxGeometry args={[2.8, 0.72, 0.08]} />
            <meshStandardMaterial color="#111316" roughness={0.4} metalness={0.7} />
          </mesh>
          {/* Glowing Glass */}
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[2.64, 0.58, 0.02]} />
            <meshStandardMaterial
              color="#FFE4B5"
              emissive="#FFAA44"
              emissiveIntensity={isDark ? 1.6 : 0.4}
              transparent
              opacity={0.85}
              roughness={0.1}
            />
          </mesh>
        </group>

        {/* Modern Entry Door */}
        <group position={[-1.7, 1.25, 1.62]}>
          <mesh>
            <boxGeometry args={[0.95, 2.3, 0.08]} />
            <meshStandardMaterial color="#14161A" roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Glass window in door */}
          <mesh position={[0, 0.3, 0.02]}>
            <boxGeometry args={[0.65, 1.4, 0.02]} />
            <meshStandardMaterial
              color="#FFE4B5"
              emissive="#FFAA44"
              emissiveIntensity={isDark ? 1.2 : 0.3}
              transparent
              opacity={0.8}
            />
          </mesh>
          {/* Tall vertical architectural handle */}
          <mesh position={[0.35, 0, 0.06]}>
            <cylinderGeometry args={[0.018, 0.018, 1.1, 8]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.15} />
          </mesh>
        </group>

        {/* Subtle decorative wall light near entry door */}
        <mesh position={[-2.2, 2.1, 1.63]}>
          <boxGeometry args={[0.08, 0.2, 0.06]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <pointLight
          position={[-2.2, 2.05, 1.8]}
          intensity={isDark ? 2.5 : 0.6}
          color="#FFD080"
          distance={4}
          decay={2}
        />
      </group>

      {/* ── 4. Upper Cantilever Floor (Black Fascia & Vertical Louvers) ── */}
      <group position={[-1.8, 4.3, -1.0]}>
        {/* Cantilever Outer Shell / Wall (Clickable to customize) */}
        <Wall
          partId="exterior/cantilever-upper"
          label="Upper Cantilevered Block"
          position={[0, 0, 0]}
          size={[7.6, 2.6, 5.0]}
          defaultColor="#1A1C20"
          defaultTexture={upperFinTex}
          castShadow
          receiveShadow
        />

        {/* Bold Black Architectural Frame / Fascia on the front */}
        <mesh position={[0, 0, 2.52]} castShadow>
          <boxGeometry args={[7.64, 2.64, 0.12]} />
          <meshStandardMaterial color="#101215" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Floor-to-ceiling panoramic glass facade */}
        <mesh position={[0, 0, 2.58]}>
          <boxGeometry args={[7.2, 2.2, 0.04]} />
          <meshStandardMaterial
            color="#FFF2D6"
            emissive="#FFBB55"
            emissiveIntensity={isDark ? 1.5 : 0.35}
            transparent
            opacity={0.85}
            roughness={0.05}
          />
        </mesh>

        {/* Modern Vertical Black Architectural Fins / Louvers */}
        {[-3.2, -2.6, -2.0, -1.4, -0.8, -0.2, 0.4, 1.0, 1.6, 2.2, 2.8, 3.2].map((fx, fi) => (
          <mesh key={fi} position={[fx, 0, 2.68]} castShadow>
            <boxGeometry args={[0.09, 2.26, 0.18]} />
            <meshStandardMaterial color="#0D0E11" roughness={0.3} metalness={0.7} />
          </mesh>
        ))}

        {/* Recessed Interior Ceiling lights inside upper floor */}
        <pointLight position={[-1.5, 0.4, 1.8]} intensity={isDark ? 3.5 : 1} color="#FFDA9E" distance={6} />
        <pointLight position={[1.5, 0.4, 1.8]} intensity={isDark ? 3.5 : 1} color="#FFDA9E" distance={6} />
      </group>

      {/* ── 5. Ground Floor Covered Pavilion / Terrace Architecture ── */}
      <group position={[2.5, 0, -0.6]}>
        {/* Flat Terrace Modern Roof Overhang */}
        <mesh position={[0, 3.02, 0.4]} castShadow receiveShadow>
          <boxGeometry args={[7.0, 0.28, 6.0]} />
          <meshStandardMaterial color="#1C1E23" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Terrace Ceiling (Clickable to customize) */}
        <Wall
          partId="exterior/patio-ceiling"
          label="Terrace Ceiling"
          position={[0, 2.86, 0.4]}
          rotation={[Math.PI / 2, 0, 0]}
          size={[6.9, 5.9, 0.04]}
          defaultColor="#EDE3D5"
          receiveShadow
        />

        {/* Back Feature Wall of Terrace (Clickable to customize) */}
        <Wall
          partId="exterior/terrace-accent-wall"
          label="Terrace Feature Wall"
          position={[0, 1.5, -2.4]}
          size={[6.8, 2.8, 0.2]}
          defaultColor="#E8DFD0"
          castShadow
          receiveShadow
        />

        {/* Right Side Fluted Wood Wall */}
        <Wall
          partId="exterior/terrace-side-wall"
          label="Terrace Side Slat Wall"
          position={[3.4, 1.5, 0.4]}
          rotation={[0, Math.PI / 2, 0]}
          size={[5.8, 2.8, 0.2]}
          defaultColor="#6B4423"
          defaultTexture={slattedWoodTex}
          castShadow
          receiveShadow
        />

        {/* Slim Black Steel Columns supporting pavilion roof */}
        {[
          [-3.3, 2.8],
          [3.3, 2.8],
          [3.3, -2.3],
        ].map(([cx, cz], i) => (
          <mesh key={i} position={[cx, 1.5, cz]} castShadow>
            <boxGeometry args={[0.12, 2.9, 0.12]} />
            <meshStandardMaterial color="#111316" metalness={0.8} roughness={0.25} />
          </mesh>
        ))}

        {/* Massive Glass Sliding Door into Living Room */}
        <group position={[0, 1.45, -0.6]}>
          <mesh>
            <boxGeometry args={[6.2, 2.7, 0.06]} />
            <meshStandardMaterial
              color="#FFF0D0"
              emissive="#FFAE42"
              emissiveIntensity={isDark ? 1.6 : 0.45}
              transparent
              opacity={0.8}
              roughness={0.05}
            />
          </mesh>
          {/* Black Door Frames */}
          {[-2.0, 0, 2.0].map((dx, di) => (
            <mesh key={di} position={[dx, 0, 0.04]}>
              <boxGeometry args={[0.08, 2.72, 0.06]} />
              <meshStandardMaterial color="#121316" metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
          {/* Horizontal transom bar */}
          <mesh position={[0, 1.25, 0.04]}>
            <boxGeometry args={[6.2, 0.08, 0.06]} />
            <meshStandardMaterial color="#121316" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* Warm Recessed Ceiling Downlights (Atmospheric glow) */}
        {[
          [-1.8, 1.0],
          [0, 1.0],
          [1.8, 1.0],
          [-1.8, -1.0],
          [0, -1.0],
          [1.8, -1.0],
        ].map(([lx, lz], i) => (
          <group key={i} position={[lx, 2.84, lz]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.02, 12]} />
              <meshStandardMaterial color="#FFF5DD" emissive="#FFD280" emissiveIntensity={3} />
            </mesh>
            <pointLight
              position={[0, -0.1, 0]}
              intensity={isDark ? 2.8 : 0.8}
              color="#FFDF9E"
              distance={4.5}
              decay={2}
            />
          </group>
        ))}
      </group>

      {/* ── 6. Iconic Center Architectural Tree ── */}
      <ArchitecturalTree isDark={isDark} />

      {/* ── 7. Stepping Stones on Lawn (Right side walkway) ── */}
      <group position={[6.4, 0.02, 1.2]}>
        {[0, 0.9, 1.8, 2.7, 3.6, 4.5].map((sz, si) => (
          <mesh key={si} position={[0, 0, sz - 2.0]} receiveShadow>
            <boxGeometry args={[0.7, 0.03, 0.45]} />
            <meshStandardMaterial color="#787C82" map={stoneTex} roughness={0.85} />
          </mesh>
        ))}
      </group>

      {/* ── 8. Modern Planter Boxes with Lush Shrubs ── */}
      <group position={[6.5, 0.25, -2.5]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.0, 0.5, 3.2]} />
          <meshStandardMaterial color="#22252A" roughness={0.8} />
        </mesh>
        {/* Shrub foliage */}
        {[-1.0, -0.3, 0.4, 1.1].map((pz, pi) => (
          <mesh key={pi} position={[0, 0.35, pz]} castShadow>
            <sphereGeometry args={[0.35, 8, 8]} />
            <meshStandardMaterial color={isDark ? '#1C3820' : '#336630'} roughness={0.95} />
          </mesh>
        ))}
      </group>

      {/* ── 9. Perimeter Modern Boundary Wall (Clickable to customize) ── */}
      <Wall
        partId="exterior/boundary-wall"
        label="Garden Landscape Wall"
        position={[-6.8, 0.9, 0.5]}
        rotation={[0, Math.PI / 2, 0]}
        size={[11.0, 1.8, 0.25]}
        defaultColor="#26282E"
        castShadow
        receiveShadow
      />
    </group>
  );
};

/** Main Three.js scene wrapper */
export const HouseScene: React.FC<{ onReady?: () => void }> = ({ onReady }) => {
  const { viewMode, dayNight } = useVisualizerStore();
  const isDark = dayNight === 'night';
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Expose canvas for screenshot (window.__vizCanvas typed in Controls.tsx global declaration)
  React.useEffect(() => {
    window.__vizCanvas = canvasRef.current;
  });

  return (
    <Canvas
      ref={canvasRef}
      onCreated={() => onReady?.()}
      shadows
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      camera={{ position: [9, 5, 10], fov: 48 }}
      style={{ background: isDark ? '#070C18' : '#CCE2F2' }}
    >
      {/* Ambient & Hemisphere Lighting */}
      <ambientLight
        intensity={isDark ? 0.25 : 0.45}
        color={isDark ? '#2E4C7A' : '#FFFFFF'}
      />
      <hemisphereLight
        args={[
          isDark ? '#1C2F52' : '#CBE3F5',
          isDark ? '#141820' : '#4A3420',
          isDark ? 0.5 : 0.85,
        ]}
      />

      {/* Main Directional Sun / Moon Light */}
      <directionalLight
        position={isDark ? [-8, 14, -6] : [14, 18, 12]}
        intensity={isDark ? 1.0 : 2.6}
        color={isDark ? '#A6C4F0' : '#FFF5E4'}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Warm Fill / Architectural Bounce Light */}
      <directionalLight
        position={[-6, 4, 8]}
        intensity={isDark ? 0.35 : 0.65}
        color={isDark ? '#FFB255' : '#FFE2B8'}
      />

      {/* Sky & Stars (100% Procedural Offline) */}
      <Suspense fallback={null}>
        {isDark ? (
          <Stars radius={80} depth={50} count={3500} factor={4} fade />
        ) : (
          <Sky sunPosition={[120, 45, 90]} turbidity={4} rayleigh={0.5} />
        )}
      </Suspense>

      {/* Scene content */}
      <Suspense fallback={null}>
        {viewMode === 'exterior' ? <LuxuryVillaExterior /> : <Room />}
      </Suspense>

      <Controls />
      <Preload all />
    </Canvas>
  );
};
