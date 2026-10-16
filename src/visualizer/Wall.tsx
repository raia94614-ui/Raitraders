import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useVisualizerStore } from './store';
import type { PartDesign } from './store';
import type { WallpaperPattern } from './data/patterns';
import { WALLPAPER_PATTERNS } from './data/patterns';
import { FINISH_OPTIONS } from './data/colors';

interface WallProps {
  partId: string;
  label: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  size: [number, number, number];
  defaultColor?: string;
  defaultTexture?: THREE.Texture | null;
  castShadow?: boolean;
  receiveShadow?: boolean;
}

/** Generate a CanvasTexture from a WallpaperPattern */
function generatePatternTexture(
  pattern: WallpaperPattern,
  tint: string,
  scale: number,
  rotation: number
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  if (rotation !== 0) {
    ctx.translate(256, 256);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-256, -256);
  }

  pattern.draw(ctx, tint, scale, rotation);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

/** Resolve the Three.js material props from a PartDesign */
function useMaterialProps(
  design: PartDesign | undefined,
  defaultColor: string,
  defaultTexture?: THREE.Texture | null
) {
  return useMemo(() => {
    if (!design || design.type === 'none' || !design.type) {
      return {
        color: defaultTexture ? '#ffffff' : defaultColor,
        roughness: defaultTexture ? 0.45 : 0.82,
        metalness: 0,
        map: (defaultTexture as THREE.CanvasTexture | null) ?? null,
      };
    }

    const finish = FINISH_OPTIONS.find((f) => f.id === (design.finish ?? 'matt')) ?? FINISH_OPTIONS[0];

    if (design.type === 'color') {
      return {
        color: design.colorHex ?? defaultColor,
        roughness: finish.roughness,
        metalness: finish.metalness,
        map: null as THREE.CanvasTexture | null,
      };
    }

    if (design.type === 'wallpaper' && design.patternId) {
      const pattern = WALLPAPER_PATTERNS.find((p) => p.id === design.patternId);
      if (pattern) {
        const tex = generatePatternTexture(
          pattern,
          design.tintHex ?? '#D4AF37',
          design.patternScale ?? 1,
          design.patternRotation ?? 0
        );
        return { color: '#ffffff', roughness: 0.75, metalness: 0, map: tex };
      }
    }

    if (design.type === 'texture') {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx2 = canvas.getContext('2d')!;
      const effectColors: Record<string, string> = {
        stucco: '#C8B99A',
        brick: '#8B4513',
        concrete: '#808080',
        wood: '#8B6914',
      };
      ctx2.fillStyle = effectColors[design.textureId ?? 'stucco'] ?? '#aaa';
      ctx2.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 6000; i++) {
        ctx2.fillStyle = `rgba(${Math.random() > 0.5 ? 255 : 0},${Math.random() > 0.5 ? 255 : 0},${Math.random() > 0.5 ? 255 : 0},${Math.random() * 0.06})`;
        ctx2.fillRect(Math.random() * 512, Math.random() * 512, Math.random() * 4, Math.random() * 4);
      }
      const tex2 = new THREE.CanvasTexture(canvas);
      tex2.wrapS = THREE.RepeatWrapping;
      tex2.wrapT = THREE.RepeatWrapping;
      tex2.repeat.set(3, 3);
      return { color: '#ffffff', roughness: 0.9, metalness: 0, map: tex2 };
    }

    return {
      color: defaultTexture ? '#ffffff' : defaultColor,
      roughness: defaultTexture ? 0.45 : 0.82,
      metalness: 0,
      map: (defaultTexture as THREE.CanvasTexture | null) ?? null,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [design?.type, design?.colorHex, design?.finish, design?.patternId, design?.tintHex, design?.patternScale, design?.patternRotation, design?.textureId, defaultColor, defaultTexture]);
}

export const Wall: React.FC<WallProps> = ({
  partId,
  label,
  position,
  rotation = [0, 0, 0],
  size,
  defaultColor = '#E8E0D0',
  defaultTexture = null,
  castShadow = false,
  receiveShadow = true,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { selectPart, selectedPartId, designs, beforeAfterProgress } = useVisualizerStore();
  const design = beforeAfterProgress < 50 ? undefined : designs[partId];
  const isSelected = selectedPartId === partId;

  const matProps = useMaterialProps(design, defaultColor, defaultTexture);
  const [hovered, setHovered] = useState(false);

  const handleClick = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      selectPart(partId);
    },
    [selectPart, partId]
  );

  const handlePointerOver = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      setHovered(true);
      document.body.style.cursor = 'pointer';
      window.dispatchEvent(new CustomEvent('viz-hover', { detail: { label, partId } }));
    },
    [label, partId]
  );

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = 'default';
    window.dispatchEvent(new CustomEvent('viz-hover', { detail: { label: null, partId: null } }));
  }, []);

  // Cleanup texture on unmount / when texture changes
  useEffect(() => {
    return () => {
      if (matProps.map) matProps.map.dispose();
    };
  }, [matProps.map]);

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
      <meshStandardMaterial
        color={matProps.color}
        roughness={isSelected ? 0.3 : hovered ? 0.5 : matProps.roughness}
        metalness={isSelected ? 0.3 : matProps.metalness}
        map={matProps.map ?? undefined}
        emissive={isSelected ? '#D4AF37' : hovered ? '#8B7530' : '#000000'}
        emissiveIntensity={isSelected ? 0.15 : hovered ? 0.08 : 0}
      />
    </mesh>
  );
};
