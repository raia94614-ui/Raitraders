import React, { useState } from 'react';
import { useVisualizerStore, ROOMS_METADATA, type RoomId } from '../store/visualizerStore';

interface FloorplanMinimapProps {
  className?: string;
}

interface RoomHotspot {
  id: RoomId;
  x: number;
  y: number;
  w: number;
  h: number;
  nameEn: string;
  nameHi: string;
}

const FLOORPLAN_ROOMS: RoomHotspot[] = [
  { id: 'balcony', x: 10, y: 10, w: 90, h: 40, nameEn: 'Balcony', nameHi: 'बालकनी' },
  { id: 'master_bedroom', x: 105, y: 10, w: 85, h: 75, nameEn: 'Master Bed', nameHi: 'मास्टर बेडरूम' },
  { id: 'bathroom', x: 195, y: 10, w: 55, h: 50, nameEn: 'Bath', nameHi: 'बाथरूम' },
  { id: 'kids', x: 10, y: 55, w: 90, h: 65, nameEn: "Kids' Bed", nameHi: 'बच्चों का कमरा' },
  { id: 'hallway', x: 105, y: 90, w: 85, h: 40, nameEn: 'Hallway', nameHi: 'हॉलवे' },
  { id: 'pooja', x: 195, y: 65, w: 55, h: 45, nameEn: 'Pooja', nameHi: 'पूजा घर' },
  { id: 'living', x: 10, y: 125, w: 120, h: 70, nameEn: 'Living', nameHi: 'लिविंग रूम' },
  { id: 'dining', x: 135, y: 135, w: 60, h: 60, nameEn: 'Dining', nameHi: 'डाइनिंग' },
  { id: 'kitchen', x: 200, y: 115, w: 50, h: 80, nameEn: 'Kitchen', nameHi: 'किचन' },
  { id: 'exterior', x: 10, y: 200, w: 240, h: 35, nameEn: 'Exterior Villa', nameHi: 'विला एक्सटीरियर' },
];

export const FloorplanMinimap: React.FC<FloorplanMinimapProps> = ({ className = '' }) => {
  const { activeRoom, setActiveRoom, language } = useVisualizerStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredRoom, setHoveredRoom] = useState<RoomId | null>(null);

  const activeHotspot = FLOORPLAN_ROOMS.find((r) => r.id === activeRoom);

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className={`bg-navy-950/90 hover:bg-navy-900 border border-gold-500/40 text-gold-400 backdrop-blur-md rounded-xl p-2.5 shadow-xl transition-all flex items-center gap-2 text-xs font-medium ${className}`}
        title="Open Floorplan Minimap"
      >
        <svg className="w-4 h-4 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        <span>{language === 'hi' ? 'नक्शा (2D)' : 'Floorplan'}</span>
      </button>
    );
  }

  return (
    <div
      className={`bg-navy-950/95 border border-gold-500/30 rounded-2xl p-3 shadow-2xl backdrop-blur-lg w-72 select-none transition-all ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-navy-800/80">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-gold-400">
            {language === 'hi' ? 'फ्लोर प्लान 2D' : '2D Floorplan'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-gray-400 bg-navy-900 px-1.5 py-0.5 rounded border border-navy-800">
            {language === 'hi'
              ? ROOMS_METADATA.find((r) => r.id === activeRoom)?.labelHi
              : ROOMS_METADATA.find((r) => r.id === activeRoom)?.label}
          </span>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 text-gray-400 hover:text-white rounded hover:bg-navy-900 transition-colors"
            title="Minimize"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* SVG Floorplan Diagram */}
      <div className="relative bg-navy-900/60 rounded-xl p-1 border border-navy-800/60 overflow-hidden">
        <svg viewBox="0 0 260 245" className="w-full h-auto cursor-pointer">
          {/* Blueprint Grid Lines */}
          <defs>
            <pattern id="blueprint-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(212, 175, 55, 0.06)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="260" height="245" fill="url(#blueprint-grid)" rx="6" />

          {/* Rooms */}
          {FLOORPLAN_ROOMS.map((room) => {
            const isActive = room.id === activeRoom;
            const isHovered = room.id === hoveredRoom;

            return (
              <g
                key={room.id}
                onClick={() => setActiveRoom(room.id)}
                onMouseEnter={() => setHoveredRoom(room.id)}
                onMouseLeave={() => setHoveredRoom(null)}
                className="transition-all duration-200"
              >
                <rect
                  x={room.x}
                  y={room.y}
                  width={room.w}
                  height={room.h}
                  rx="4"
                  fill={
                    isActive
                      ? 'rgba(212, 175, 55, 0.35)'
                      : isHovered
                      ? 'rgba(212, 175, 55, 0.18)'
                      : 'rgba(30, 41, 59, 0.65)'
                  }
                  stroke={
                    isActive
                      ? '#D4AF37'
                      : isHovered
                      ? 'rgba(212, 175, 55, 0.6)'
                      : 'rgba(100, 116, 139, 0.4)'
                  }
                  strokeWidth={isActive ? '1.8' : '1'}
                />

                {/* Room Label */}
                <text
                  x={room.x + room.w / 2}
                  y={room.y + room.h / 2 + 3}
                  textAnchor="middle"
                  fill={isActive ? '#FDE047' : isHovered ? '#FFFFFF' : '#94A3B8'}
                  fontSize={room.w < 60 ? '7.5' : '8.5'}
                  fontWeight={isActive ? '700' : '500'}
                  pointerEvents="none"
                >
                  {language === 'hi' ? room.nameHi : room.nameEn}
                </text>
              </g>
            );
          })}

          {/* Active Player Pin / Pulse Icon */}
          {activeHotspot && (
            <g transform={`translate(${activeHotspot.x + activeHotspot.w / 2}, ${activeHotspot.y + activeHotspot.h / 2})`}>
              <circle r="7" fill="none" stroke="#D4AF37" strokeWidth="1" className="animate-ping opacity-60" />
              <circle r="4" fill="#EAB308" />
              <circle r="2" fill="#FFFFFF" />
            </g>
          )}
        </svg>
      </div>

      {/* Quick Jump Room Pills */}
      <div className="mt-2 flex flex-wrap gap-1 max-h-24 overflow-y-auto no-scrollbar">
        {ROOMS_METADATA.map((r) => (
          <button
            key={r.id}
            onClick={() => setActiveRoom(r.id)}
            className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
              r.id === activeRoom
                ? 'bg-gold-500/20 border-gold-400 text-gold-300 font-semibold shadow-sm'
                : 'bg-navy-900/60 border-navy-800 text-gray-400 hover:text-white hover:border-gold-500/40'
            }`}
          >
            <span>{r.emoji} </span>
            <span>{language === 'hi' ? r.labelHi : r.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
