import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls as DreiOrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useVisualizerStore } from '../store/visualizerStore';
import { createPhotorealMaterial, type PhotorealUniforms } from './photorealShader';
import { RecolorTextureManager } from './RecolorTextureManager';
import { HotspotMarker } from './HotspotMarker';

export interface RoomSurfaceMeta {
  id: string;
  label: string;
  labelHi: string;
  defaultColor: string;
  maskFile: string;
  avgLuminance: number;
}

export interface RoomHotspotMeta {
  toRoomId: string;
  yaw: number;
  pitch: number;
  label: string;
  labelHi: string;
}

export interface LoadedRoomJson {
  id: string;
  name: string;
  nameHi: string;
  initialView: { yaw: number; pitch: number; fov: number };
  surfaces: RoomSurfaceMeta[];
  hotspots: RoomHotspotMeta[];
}

export const PhotorealPanoramaEngine: React.FC = () => {
  const {
    activeRoom,
    setActiveRoom,
    selectedPartId,
    selectPart,
    designs,
    beforeAfterProgress,
    isAutoRotating,
    gyroEnabled,
  } = useVisualizerStore();

  const { camera, gl } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const [roomData, setRoomData] = useState<LoadedRoomJson | null>(null);

  // Recolor & Mask Manager
  const recolorManager = useMemo(() => new RecolorTextureManager(2048, 1024), []);

  const defaultPlaceholderTex = useMemo(() => {
    const data = new Uint8Array([
      235, 230, 220, 255, 230, 225, 215, 255,
      240, 235, 225, 255, 235, 230, 220, 255,
    ]);
    const tex = new THREE.DataTexture(data, 2, 2, THREE.RGBAFormat);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Material Uniforms
  const uniforms = useMemo<PhotorealUniforms>(() => {
    return {
      u_baseMap: { value: defaultPlaceholderTex },
      u_recolorMap: { value: recolorManager.recolorTexture },
      u_selectionMask: { value: recolorManager.selectionTexture },
      u_avgLuminance: { value: 0.5 },
      u_finish: { value: 0.0 }, // 0: Matte
      u_crossfade: { value: 1.0 },
      u_splitProgress: { value: 1.0 },
      u_detailBoost: { value: 1.0 },
    };
  }, [recolorManager, defaultPlaceholderTex]);

  const material = useMemo(() => createPhotorealMaterial(uniforms), [uniforms]);

  // Load Room Metadata, Panorama Texture, and Surface Masks
  useEffect(() => {
    let isCancelled = false;

    async function loadRoom() {
      try {
        // 1. Fetch room.json
        const res = await fetch(`/rooms/${activeRoom}/room.json`);
        if (!res.ok) throw new Error(`Could not load /rooms/${activeRoom}/room.json`);
        const json: LoadedRoomJson = await res.json();
        if (isCancelled) return;
        setRoomData(json);

        // 2. Load Base Panorama Texture
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
          `/rooms/${activeRoom}/base.jpg`,
          (tex) => {
            if (isCancelled) return;
            tex.generateMipmaps = true;
            tex.minFilter = THREE.LinearMipmapLinearFilter;
            tex.magFilter = THREE.LinearFilter;
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.ClampToEdgeWrapping;
            uniforms.u_baseMap.value = tex;
            material.needsUpdate = true;
          },
          undefined,
          (err) => {
            console.error(`Failed to load base.jpg for room ${activeRoom}:`, err);
          }
        );

        // 3. Clear and Load all surface masks into Recolor Manager
        recolorManager.clear();
        await Promise.all(
          json.surfaces.map((s) =>
            recolorManager.loadSurfaceMask(
              s.id,
              `/rooms/${activeRoom}/${s.maskFile}`,
              s.avgLuminance
            )
          )
        );
        if (isCancelled) return;

        // Re-apply any existing custom designs for this room
        recolorManager.updateDesigns(designs);
      } catch (err) {
        console.warn('Error loading photoreal room assets:', err);
      }
    }

    loadRoom();

    return () => {
      isCancelled = true;
    };
  }, [activeRoom, recolorManager, uniforms, material, designs]);

  // Update composite designs whenever `designs` changes
  useEffect(() => {
    recolorManager.updateDesigns(designs);

    // Cross-fade animation
    let startTime = performance.now();
    const duration = 400; // 400ms crossfade
    const animateFade = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1.0, elapsed / duration);
      uniforms.u_crossfade.value = progress;
      if (progress < 1.0) {
        requestAnimationFrame(animateFade);
      }
    };
    uniforms.u_crossfade.value = 0.0;
    requestAnimationFrame(animateFade);
  }, [designs, recolorManager, uniforms]);

  // Update Selection Highlight Outline
  useEffect(() => {
    recolorManager.updateSelection(selectedPartId);
    if (selectedPartId) {
      const avgLum = recolorManager.getSurfaceAvgLuminance(selectedPartId);
      uniforms.u_avgLuminance.value = avgLum;
    }
  }, [selectedPartId, recolorManager, uniforms]);

  // Update Before/After Compare Slider Split
  useEffect(() => {
    uniforms.u_splitProgress.value = beforeAfterProgress / 100;
  }, [beforeAfterProgress, uniforms]);

  // Raycast Hit Detection: click wall -> detect surface via mask lookup
  const handlePointerDown = useCallback(
    (e: any) => {
      if (!e.uv) return;
      const u = e.uv.x;
      const v = e.uv.y;

      const detectedId = recolorManager.detectSurfaceAtUV(u, v);
      if (detectedId && roomData) {
        const surf = roomData.surfaces.find((s) => s.id === detectedId);
        if (surf) {
          selectPart(surf.id, surf.label, surf.labelHi);
        }
      }
    },
    [recolorManager, roomData, selectPart]
  );

  // Smoothly orient camera to initial room view or hotspot direction
  const lookAtYawPitch = useCallback(
    (yawDeg: number, pitchDeg = 0) => {
      if (!controlsRef.current) return;
      const yawRad = THREE.MathUtils.degToRad(yawDeg);
      const pitchRad = THREE.MathUtils.degToRad(pitchDeg);

      controlsRef.current.target.set(0, 0, 0);
      const r = 0.1;
      const x = r * Math.sin(yawRad) * Math.cos(pitchRad);
      const y = -r * Math.sin(pitchRad);
      const z = r * Math.cos(yawRad) * Math.cos(pitchRad);

      camera.position.set(x, y, z);
      controlsRef.current.update();
    },
    [camera]
  );

  useEffect(() => {
    if (roomData?.initialView) {
      lookAtYawPitch(roomData.initialView.yaw, roomData.initialView.pitch);
      if (roomData.initialView.fov && 'fov' in camera) {
        (camera as THREE.PerspectiveCamera).fov = roomData.initialView.fov;
        (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
      }
    }
  }, [roomData, lookAtYawPitch, camera]);

  // Smooth mouse wheel zoom (FOV 45 to 95)
  useEffect(() => {
    const dom = gl.domElement;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if ('fov' in camera) {
        const pCam = camera as THREE.PerspectiveCamera;
        const delta = e.deltaY * 0.05;
        pCam.fov = Math.max(45, Math.min(95, pCam.fov + delta));
        pCam.updateProjectionMatrix();
      }
    };
    dom.addEventListener('wheel', handleWheel, { passive: false });
    return () => dom.removeEventListener('wheel', handleWheel);
  }, [camera, gl]);

  // Expose global look helper for UI compass buttons
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const win = window as any;
      win.__vizCamera = camera;
      win.__vizLookDirection = (yaw: number, pitch = 0) => lookAtYawPitch(yaw, pitch);
      win.__vizResetView = () => {
        if (roomData?.initialView) {
          lookAtYawPitch(roomData.initialView.yaw, roomData.initialView.pitch);
          if (roomData.initialView.fov && 'fov' in camera) {
            (camera as THREE.PerspectiveCamera).fov = roomData.initialView.fov;
            (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
          }
        } else {
          lookAtYawPitch(0, 0);
        }
      };
      win.__vizCanvas = gl.domElement;
    }
  }, [lookAtYawPitch, roomData, gl, camera]);

  // Device Orientation (Gyroscope) support
  useEffect(() => {
    if (!gyroEnabled) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha === null || e.beta === null || !controlsRef.current) return;
      const alpha = THREE.MathUtils.degToRad(e.alpha);
      const beta = THREE.MathUtils.degToRad(e.beta - 90);
      const r = 0.1;
      camera.position.set(-r * Math.sin(alpha) * Math.cos(beta), r * Math.sin(beta), -r * Math.cos(alpha) * Math.cos(beta));
      controlsRef.current.update();
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [gyroEnabled, camera]);

  // Update Compass Heading
  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotating;
      controlsRef.current.autoRotateSpeed = 1.0;
      controlsRef.current.update();

      const az = controlsRef.current.getAzimuthalAngle();
      const deg = Math.round(((az * 180) / Math.PI + 360) % 360);
      window.dispatchEvent(new CustomEvent('viz-heading', { detail: { angle: deg } }));
    }
  });

  // Hotspot Doorway Navigation
  const handleHotspotNavigate = (toRoomId: string) => {
    setActiveRoom(toRoomId as any);
  };

  return (
    <group>
      {/* Inside-Out Inverted Sphere for 360 Photoreal Panorama */}
      <mesh
        ref={meshRef}
        material={material}
        onPointerDown={handlePointerDown}
        scale={[-1, 1, 1]} // Invert normals for inside-out 360 projection
      >
        <sphereGeometry args={[500, 64, 64]} />
      </mesh>

      {/* 3D In-Scene Hotspot Doorway Markers */}
      {roomData?.hotspots.map((h, idx) => (
        <HotspotMarker
          key={`hotspot-${idx}-${h.toRoomId}`}
          toRoomId={h.toRoomId}
          yaw={h.yaw}
          pitch={h.pitch}
          label={h.label}
          labelHi={h.labelHi}
          onNavigate={handleHotspotNavigate}
        />
      ))}

      {/* Smooth Panoramic Orbit Controls */}
      <DreiOrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={-0.45} // Intuitive panoramic drag
        minDistance={0.01}
        maxDistance={0.5}
        maxPolarAngle={Math.PI - 0.05}
        minPolarAngle={0.05}
        autoRotate={isAutoRotating}
      />
    </group>
  );
};
