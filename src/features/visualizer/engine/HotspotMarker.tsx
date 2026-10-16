import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useVisualizerStore } from '../store/visualizerStore';
import { ChevronRight } from 'lucide-react';

interface HotspotMarkerProps {
  toRoomId: string;
  yaw: number;
  pitch: number;
  label: string;
  labelHi: string;
  onNavigate: (roomId: string) => void;
}

export const HotspotMarker: React.FC<HotspotMarkerProps> = ({
  toRoomId,
  yaw,
  pitch,
  label,
  labelHi,
  onNavigate,
}) => {
  const { language } = useVisualizerStore();
  const isHi = language === 'hi';

  const position = useMemo(() => {
    const yawRad = THREE.MathUtils.degToRad(yaw);
    const pitchRad = THREE.MathUtils.degToRad(pitch);
    const r = 380; // inside 500 sphere radius
    const x = -r * Math.sin(yawRad) * Math.cos(pitchRad);
    const y = r * Math.sin(pitchRad);
    const z = -r * Math.cos(yawRad) * Math.cos(pitchRad);
    return [x, y, z] as [number, number, number];
  }, [yaw, pitch]);

  return (
    <group position={position}>
      <Html center distanceFactor={180}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(toRoomId);
          }}
          className="group relative flex items-center gap-2 px-3 py-2 rounded-full bg-navy-950/85 hover:bg-navy-900 border border-gold-400/50 hover:border-gold-300 backdrop-blur-md shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer text-white"
          title={`Go to ${label}`}
        >
          {/* Animated Gold Radar Pulse */}
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-gradient-to-r from-gold-400 to-amber-300 shadow-md" />
          </span>

          <span className="text-xs font-bold text-gold-300 group-hover:text-gold-200 tracking-wide whitespace-nowrap">
            {isHi ? labelHi : label}
          </span>

          <ChevronRight className="w-3.5 h-3.5 text-gold-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </Html>
    </group>
  );
};
