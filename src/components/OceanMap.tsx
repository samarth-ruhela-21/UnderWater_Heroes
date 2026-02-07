import { motion } from 'framer-motion';
// import type { BuoyData } from '@/lib/buoyData';
import type { BuoyData } from '@/lib/buoyData';
import { Anchor } from 'lucide-react';

interface OceanMapProps {
  buoyData: BuoyData[];
  onBuoySelect: (buoy: BuoyData) => void;
}

function getMarkerColor(status: string) {
  switch (status) {
    case 'Excellent': return '#22c55e';
    case 'Good': return '#0ea5e9';
    case 'Poor': return '#f97316';
    case 'Critical': return '#ef4444';
    default: return '#0ea5e9';
  }
}

// Convert lat/lng to SVG coordinates for India map (approximate)
function latLngToSvg(lat: number, lng: number) {
  // India bounding box approximately: lat 6-37, lng 68-98
  const minLat = 6, maxLat = 37;
  const minLng = 68, maxLng = 98;
  
  const x = ((lng - minLng) / (maxLng - minLng)) * 100;
  const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;
  
  return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
}

export function OceanMap({ buoyData, onBuoySelect }: OceanMapProps) {
  return (
    <div className="relative h-full w-full bg-gradient-to-b from-muted/30 to-muted/50 rounded-lg overflow-hidden">
      {/* Grid pattern background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* India outline representation */}
      <svg 
        viewBox="0 0 100 100" 
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Simplified India coastline path */}
        <path
          d="M 30 15 Q 35 10, 45 12 L 55 15 Q 70 18, 75 25 L 78 35 Q 80 45, 75 55 L 70 65 Q 65 75, 55 80 L 45 85 Q 35 88, 28 82 L 22 70 Q 18 60, 20 50 L 22 40 Q 25 30, 28 20 Z"
          fill="hsl(var(--muted) / 0.3)"
          stroke="hsl(var(--primary) / 0.5)"
          strokeWidth="0.5"
        />
        
        {/* Buoy markers */}
        {buoyData.map((buoy, index) => {
          const { x, y } = latLngToSvg(buoy.lat, buoy.lng);
          return (
            <motion.g
              key={buoy.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.02 }}
              onClick={() => onBuoySelect(buoy)}
              className="cursor-pointer"
            >
              {/* Pulse effect for critical stations */}
              {buoy.status === 'Critical' && (
                <motion.circle
                  cx={x}
                  cy={y}
                  r={buoy.type === 'Major' ? 4 : 2.5}
                  fill="none"
                  stroke={getMarkerColor(buoy.status)}
                  strokeWidth="0.5"
                  initial={{ r: buoy.type === 'Major' ? 2 : 1.5, opacity: 1 }}
                  animate={{ r: buoy.type === 'Major' ? 6 : 4, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              
              {/* Main marker */}
              <circle
                cx={x}
                cy={y}
                r={buoy.type === 'Major' ? 2 : 1.2}
                fill={getMarkerColor(buoy.status)}
                stroke="hsl(var(--background))"
                strokeWidth="0.3"
                style={{ filter: `drop-shadow(0 0 3px ${getMarkerColor(buoy.status)})` }}
              />
            </motion.g>
          );
        })}
      </svg>
      
      {/* Selected buoy info overlay */}
      <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
        <span className="font-mono">{buoyData.length} stations active</span>
      </div>
    </div>
  );
}

// Map Legend Component
export function MapLegend() {
  return (
    <div className="absolute bottom-4 left-4 z-10 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border/50">
      <div className="text-xs font-medium mb-2">Water Quality</div>
      <div className="space-y-1.5">
        {[
          { color: 'bg-green-500', label: 'Excellent (76-100)' },
          { color: 'bg-sky-500', label: 'Good (51-75)' },
          { color: 'bg-orange-500', label: 'Poor (26-50)' },
          { color: 'bg-red-500', label: 'Critical (0-25)' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${item.color}`} />
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Buoy Detail Panel
export function BuoyDetail({ buoy, onClose }: { buoy: BuoyData | null; onClose: () => void }) {
  if (!buoy) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute top-4 right-4 z-20 bg-card/95 backdrop-blur-md rounded-lg p-4 border border-border/50 min-w-[220px]"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <Anchor className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">{buoy.name}</span>
          </div>
          <span className="text-xs text-muted-foreground">{buoy.id}</span>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground text-xs"
        >
          ✕
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-muted-foreground block">pH</span>
          <span className="font-medium">{buoy.ph}</span>
        </div>
        <div>
          <span className="text-muted-foreground block">Turbidity</span>
          <span className="font-medium">{buoy.turbidity} NTU</span>
        </div>
        <div>
          <span className="text-muted-foreground block">Temperature</span>
          <span className="font-medium">{buoy.temperature}°C</span>
        </div>
        <div>
          <span className="text-muted-foreground block">OHI Score</span>
          <span 
            className="font-bold"
            style={{ color: getMarkerColor(buoy.status) }}
          >
            {buoy.ohiScore}
          </span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-border/50">
        <span 
          className="text-xs font-medium px-2 py-1 rounded"
          style={{ 
            backgroundColor: `${getMarkerColor(buoy.status)}20`,
            color: getMarkerColor(buoy.status)
          }}
        >
          {buoy.status}
        </span>
      </div>
    </motion.div>
  );
}
