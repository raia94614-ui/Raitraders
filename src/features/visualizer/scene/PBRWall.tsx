import React, { useRef, useState, useCallback, useEffect } from 'react';
import * as THREE from 'three';
import { resolvePBRProps } from '../materials/PBRMaterialResolver';
import { useVisualizerStore } from '../store/visualizerStore';

export interface PBRWallProps {
  partId: string;
  label: string;
  labelHi?: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  size: [number, number, number];
  defaultColor?: string;
  defaultTexture?: THREE.Texture | null;
  castShadow?: boolean;
  receiveShadow?: boolean;
}

export const PBRWall: React.FC<PBRWallProps> = ({
  partId,
  label,
  labelHi,
  position,
  rotation = [0, 0, 0],
  size,
  defaultColor = '#EDE3D5',
  defaultTexture = null,
  castShadow = false,
  receiveShadow = true,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { selectPart, selectedPartId, designs, beforeAfterProgress } = useVisualizerStore();

  const isSelected = selectedPartId === partId;
  const design = beforeAfterProgress < 50 ? undefined : designs[partId];

  const pbr = resolvePBRProps(design, defaultColor, defaultTexture);
  const [hovered, setHovered] = useState(false);

  const handleClick = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      selectPart(partId, label, labelHi);
    },
    [selectPart, partId, label, labelHi]
  );

  const handlePointerOver = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      setHovered(true);
      document.body.style.cursor = 'pointer';
      window.dispatchEvent(
        new CustomEvent('viz-hover', {
          detail: { label, labelHi, partId },
        })
      );
    },
    [label, labelHi, partId]
  );

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = 'default';
    window.dispatchEvent(
      new CustomEvent('viz-hover', {
        detail: { label: null, labelHi: null, partId: null },
      })
    );
  }, []);

  // Cleanup textures on unmount
  useEffect(() => {
    return () => {
      if (pbr.map && pbr.map !== defaultTexture) {
        pbr.map.dispose();
      }
    };
  }, [pbr.map, defaultTexture]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <boxGeometry args={size} />
      <meshPhysicalMaterial
        color={pbr.color}
        roughness={isSelected ? 0.35 : hovered ? 0.5 : pbr.roughness}
        metalness={isSelected ? 0.25 : pbr.metalness}
        clearcoat={pbr.clearcoat ?? 0}
        clearcoatRoughness={pbr.clearcoatRoughness ?? 0.1}
        map={pbr.map ?? undefined}
        normalMap={pbr.normalMap ?? undefined}
        normalScale={pbr.normalScale ? new THREE.Vector2(...pbr.normalScale) : undefined}
        envMapIntensity={pbr.envMapIntensity ?? 0.7}
        emissive={isSelected ? '#D4AF37' : hovered ? '#9A7D2C' : '#000000'}
        emissiveIntensity={isSelected ? 0.18 : hovered ? 0.08 : 0}
      />
    </mesh>
  );
};
