import React, { useMemo } from 'react';
import * as THREE from 'three';
import { PBRWall } from '../scene/PBRWall';
import { getLawnTexture } from '../../../visualizer/architecturalMaterials';
import { useVisualizerStore } from '../store/visualizerStore';

/** Foxtail Tropical Palm Tree matching the photo */
const FloridaPalmTree: React.FC<{ position: [number, number, number]; scale?: number }> = ({
  position,
  scale = 1.0,
}) => {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Textured curved trunk */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.24, 3.6, 12]} />
        <meshStandardMaterial color="#6B5949" roughness={0.9} />
      </mesh>
      {/* Upper green crown shaft */}
      <mesh position={[0, 3.75, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.16, 0.7, 10]} />
        <meshStandardMaterial color="#4A6B34" roughness={0.7} />
      </mesh>
      {/* Cascading Palm Fronds (12 radiating leaves) */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const droop = 0.45 + (i % 3) * 0.15;
        return (
          <group key={i} position={[0, 4.0, 0]} rotation={[droop, rad, 0]}>
            <mesh position={[0, 0, 1.2]} rotation={[0.1, 0, 0]} castShadow>
              <boxGeometry args={[0.42, 0.02, 2.4]} />
              <meshStandardMaterial
                color="#3D6B2A"
                roughness={0.65}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

export const ExteriorVilla: React.FC = () => {
  const { lightingTime } = useVisualizerStore();
  const isNight = lightingTime === 'night';
  const lawnTex = useMemo(() => getLawnTexture(isNight), [isNight]);

  return (
    <group position={[0, 0, 0]}>
      {/* ── 1. Manicured Lawn Ground ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 1]} receiveShadow>
        <planeGeometry args={[36, 36]} />
        <meshStandardMaterial
          color={isNight ? '#182C18' : '#4E7D3A'}
          map={lawnTex}
          roughness={0.9}
        />
      </mesh>

      {/* ── 2. Concrete Driveway & Street ── */}
      {/* Asphalt Street in Foreground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 7.5]} receiveShadow>
        <planeGeometry args={[36, 4.5]} />
        <meshStandardMaterial color="#303236" roughness={0.85} />
      </mesh>

      {/* Concrete Driveway */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.4, 0.005, 3.2]} receiveShadow>
        <planeGeometry args={[5.4, 7.5]} />
        <meshStandardMaterial color="#DEDAD2" roughness={0.65} />
      </mesh>

      {/* Driveway Expansion Seams */}
      {[-0.5, 2.0, 4.5].map((sz, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[1.4, 0.008, sz]}>
          <planeGeometry args={[5.38, 0.03]} />
          <meshStandardMaterial color="#8C8880" roughness={0.9} />
        </mesh>
      ))}

      {/* Walkway leading to front entrance */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.7, 0.01, 2.4]} receiveShadow>
        <planeGeometry args={[1.4, 4.2]} />
        <meshStandardMaterial color="#DEDAD2" roughness={0.65} />
      </mesh>

      {/* ── 3. Ground Level - Right Section: White Brick Garage ── */}
      <group position={[1.4, 0, -0.5]}>
        {/* Main White Brick Garage Volume */}
        <PBRWall
          partId="exterior/brick-facade"
          label="White Brick Garage Facade"
          labelHi="व्हाइट ब्रिक गैराज वॉल"
          position={[0, 1.6, 0.6]}
          size={[5.4, 3.2, 0.3]}
          defaultColor="#EDE8DF"
          castShadow
          receiveShadow
        />

        {/* Garage Door */}
        <group position={[0, 1.25, 0.76]}>
          <PBRWall
            partId="exterior/garage-door"
            label="Modern Dark Garage Door"
            labelHi="मॉडर्न गैराज डोर"
            position={[0, 0, 0]}
            size={[4.5, 2.4, 0.08]}
            defaultColor="#25282E"
            castShadow
            receiveShadow
          />
          {/* Horizontal door slat reveals */}
          {[-0.8, -0.3, 0.2, 0.7].map((gy, i) => (
            <mesh key={i} position={[0, gy, 0.05]}>
              <boxGeometry args={[4.48, 0.02, 0.02]} />
              <meshStandardMaterial color="#141618" roughness={0.5} />
            </mesh>
          ))}
          {/* Frosted vertical window inserts on the right side */}
          {[-0.7, -0.2, 0.3, 0.8].map((wy, i) => (
            <mesh key={`win-${i}`} position={[1.7, wy, 0.05]}>
              <boxGeometry args={[0.62, 0.32, 0.03]} />
              <meshStandardMaterial
                color="#D6E2E8"
                roughness={0.15}
                metalness={0.2}
                transparent
                opacity={0.88}
              />
            </mesh>
          ))}
        </group>

        {/* Modern Vertical Sconce Light beside garage */}
        <mesh position={[-2.4, 1.7, 0.78]}>
          <boxGeometry args={[0.08, 0.32, 0.06]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <pointLight
          position={[-2.4, 1.7, 0.9]}
          intensity={isNight ? 2.2 : 0.4}
          color="#FFE090"
          distance={4}
        />
      </group>

      {/* ── 4. Ground Level - Recessed Front Entrance ── */}
      <group position={[-1.7, 0, -1.2]}>
        {/* Recessed Porch Steps */}
        {[0.12, 0.24, 0.36].map((stepH, idx) => (
          <mesh key={idx} position={[0, stepH / 2, 0.8 - idx * 0.3]} receiveShadow>
            <boxGeometry args={[1.5, stepH, 0.32]} />
            <meshStandardMaterial color="#DEDAD2" roughness={0.7} />
          </mesh>
        ))}

        {/* Modern Black Front Door */}
        <mesh position={[0, 1.5, -0.1]} castShadow>
          <boxGeometry args={[1.1, 2.3, 0.08]} />
          <meshStandardMaterial color="#16181B" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Long Architectural Gold Handle */}
        <mesh position={[0.42, 1.3, 0.02]}>
          <cylinderGeometry args={[0.015, 0.015, 1.1, 8]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* Modern Black Handrail */}
        <mesh position={[-0.7, 0.65, 0.5]}>
          <boxGeometry args={[0.04, 0.85, 1.2]} />
          <meshStandardMaterial color="#16181B" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* ── 5. Ground Level - Left Section: Stucco & Big Picture Window ── */}
      <group position={[-4.0, 0, -0.5]}>
        <PBRWall
          partId="exterior/ground-stucco-left"
          label="Ground Stucco Left Wall"
          labelHi="ग्राउंड लेफ्ट स्टको वॉल"
          position={[0, 1.6, 0.4]}
          size={[3.8, 3.2, 0.3]}
          defaultColor="#F7F4EE"
          castShadow
          receiveShadow
        />

        {/* Large Floor-to-Ceiling Picture Window */}
        <group position={[0.2, 1.45, 0.56]}>
          {/* Black Aluminium Frame */}
          <mesh>
            <boxGeometry args={[2.8, 2.1, 0.08]} />
            <meshStandardMaterial color="#141618" roughness={0.4} metalness={0.8} />
          </mesh>
          {/* Glass Pane */}
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[2.64, 1.94, 0.02]} />
            <meshStandardMaterial
              color="#DCEBF4"
              emissive="#FFAA44"
              emissiveIntensity={isNight ? 1.4 : 0.25}
              transparent
              opacity={0.85}
              roughness={0.08}
              metalness={0.15}
            />
          </mesh>
        </group>
      </group>

      {/* ── 6. White Brick Planter Box with Tropical Plants (Left) ── */}
      <group position={[-4.2, 0, 2.2]}>
        {/* White Brick Planter Box Wall */}
        <PBRWall
          partId="exterior/planter-wall"
          label="White Brick Planter Wall"
          labelHi="व्हाइट ब्रिक प्लांटर"
          position={[0, 0.4, 0]}
          size={[3.6, 0.8, 1.2]}
          defaultColor="#EDE8DF"
          castShadow
          receiveShadow
        />
        {/* Soil Base */}
        <mesh position={[0, 0.72, 0]}>
          <boxGeometry args={[3.4, 0.08, 1.0]} />
          <meshStandardMaterial color="#3D3225" roughness={0.95} />
        </mesh>
        {/* Tropical Shrubs & Plants in Planter */}
        {[-1.2, -0.6, 0, 0.6, 1.2].map((px, i) => (
          <group key={i} position={[px, 0.85, (i % 2 === 0 ? 0.1 : -0.1)]}>
            <mesh castShadow>
              <sphereGeometry args={[0.35 + (i % 3) * 0.08, 8, 8]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#4A7835' : '#395E28'} roughness={0.85} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── 7. Upper Floor - Cantilever Balcony & Stucco Facade ── */}
      <group position={[0, 3.2, -0.5]}>
        {/* Upper Story Stucco Main Wall */}
        <PBRWall
          partId="exterior/stucco-facade"
          label="Upper Stucco Facade"
          labelHi="अपर स्टको वॉल"
          position={[-0.8, 1.5, 0.2]}
          size={[10.6, 3.0, 0.3]}
          defaultColor="#F7F4EE"
          castShadow
          receiveShadow
        />

        {/* Cantilever Balcony Slab */}
        <group position={[-0.6, 0.15, 1.5]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[7.2, 0.32, 2.4]} />
            <meshStandardMaterial color="#F7F4EE" roughness={0.7} />
          </mesh>

          {/* Warm Cedar Wood Soffit Under Balcony */}
          <PBRWall
            partId="exterior/wood-soffits"
            label="Balcony Wood Soffit"
            labelHi="बालकनी वुड सीलिंग"
            position={[0, -0.17, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            size={[7.15, 2.35, 0.04]}
            defaultColor="#8C5A2C"
            receiveShadow
          />

          {/* Tinted Glass Balustrade with Black Frame & Posts */}
          <group position={[0, 0.62, 1.15]}>
            {/* Front Glass Panel */}
            <mesh>
              <boxGeometry args={[7.1, 0.88, 0.04]} />
              <meshStandardMaterial
                color="#1C2028"
                transparent
                opacity={0.65}
                roughness={0.08}
                metalness={0.2}
              />
            </mesh>
            {/* Black Top Handrail */}
            <mesh position={[0, 0.46, 0]}>
              <boxGeometry args={[7.15, 0.05, 0.08]} />
              <meshStandardMaterial color="#111316" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Black Vertical Posts */}
            {[-3.5, -2.1, -0.7, 0.7, 2.1, 3.5].map((bx, bi) => (
              <mesh key={bi} position={[bx, 0, 0]}>
                <boxGeometry args={[0.04, 0.88, 0.06]} />
                <meshStandardMaterial color="#111316" metalness={0.8} roughness={0.2} />
              </mesh>
            ))}
          </group>

          {/* Side Glass Panels */}
          {[-3.55, 3.55].map((sx, si) => (
            <mesh key={si} position={[sx, 0.62, 0]} rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[2.3, 0.88, 0.04]} />
              <meshStandardMaterial
                color="#1C2028"
                transparent
                opacity={0.65}
                roughness={0.08}
                metalness={0.2}
              />
            </mesh>
          ))}
        </group>

        {/* Large 3-Panel Sliding Glass Door behind Balcony */}
        <group position={[-0.2, 1.5, 0.38]}>
          <mesh>
            <boxGeometry args={[4.2, 2.3, 0.08]} />
            <meshStandardMaterial color="#141618" roughness={0.4} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[4.04, 2.14, 0.02]} />
            <meshStandardMaterial
              color="#DCEBF4"
              emissive="#FFAA44"
              emissiveIntensity={isNight ? 1.5 : 0.3}
              transparent
              opacity={0.85}
              roughness={0.08}
            />
          </mesh>
        </group>

        {/* Upper Left Corner Picture Window */}
        <group position={[-4.5, 1.5, 0.38]}>
          <mesh>
            <boxGeometry args={[2.0, 2.3, 0.08]} />
            <meshStandardMaterial color="#141618" roughness={0.4} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[1.84, 2.14, 0.02]} />
            <meshStandardMaterial
              color="#DCEBF4"
              emissive="#FFAA44"
              emissiveIntensity={isNight ? 1.5 : 0.3}
              transparent
              opacity={0.85}
              roughness={0.08}
            />
          </mesh>
        </group>

        {/* Upper Right Vertical Accent Window */}
        <group position={[2.8, 1.6, 0.38]}>
          <mesh>
            <boxGeometry args={[0.85, 2.1, 0.08]} />
            <meshStandardMaterial color="#141618" roughness={0.4} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[0.72, 1.94, 0.02]} />
            <meshStandardMaterial
              color="#DCEBF4"
              emissive="#FFAA44"
              emissiveIntensity={isNight ? 1.5 : 0.3}
              transparent
              opacity={0.85}
              roughness={0.08}
            />
          </mesh>
        </group>
      </group>

      {/* ── 8. Slanted Standing Seam Metal Roof with Wood Soffits ── */}
      <group position={[-0.8, 6.2, -0.5]}>
        {/* Main Roof Pitch Base Plate */}
        <mesh rotation={[-0.22, 0, 0]} position={[0, 0.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[12.2, 0.18, 6.8]} />
          <meshStandardMaterial color="#2B2E33" roughness={0.4} metalness={0.7} />
        </mesh>

        {/* Cedar Wood Under-Eave Soffit Trim */}
        <mesh rotation={[-0.22, 0, 0]} position={[0, 0.48, 0]}>
          <boxGeometry args={[12.0, 0.06, 6.6]} />
          <meshStandardMaterial color="#8C5A2C" roughness={0.7} />
        </mesh>

        {/* Standing Seam Metal Ribs (Spaced every 0.4m) */}
        {[-5.6, -5.0, -4.4, -3.8, -3.2, -2.6, -2.0, -1.4, -0.8, -0.2, 0.4, 1.0, 1.6, 2.2, 2.8, 3.4, 4.0, 4.6, 5.2].map((rx, ri) => (
          <mesh key={ri} rotation={[-0.22, 0, 0]} position={[rx, 0.72, 0]} castShadow>
            <boxGeometry args={[0.04, 0.06, 6.78]} />
            <meshStandardMaterial color="#1E2024" roughness={0.3} metalness={0.8} />
          </mesh>
        ))}

        {/* Black Metal Fascia & Gutter */}
        <mesh position={[0, 0.4, 3.3]}>
          <boxGeometry args={[12.24, 0.22, 0.08]} />
          <meshStandardMaterial color="#181A1D" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* ── 9. Palm Trees Flanking Villa ── */}
      {/* Right palm tree beside the driveway */}
      <FloridaPalmTree position={[4.6, 0, 2.2]} scale={1.15} />

      {/* Left palm tree near boundary */}
      <FloridaPalmTree position={[-6.2, 0, 1.8]} scale={0.95} />

      {/* Background palm tree */}
      <FloridaPalmTree position={[6.0, 0, -3.5]} scale={1.3} />
    </group>
  );
};
