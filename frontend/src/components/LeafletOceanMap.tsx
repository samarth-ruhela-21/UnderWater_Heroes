import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { BuoyData } from '@/lib/buoyData';
import { Navigation, Anchor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

// --- Custom Marker Icons (CSS-based) ---
// We use L.divIcon to render Tailwind classes as markers
const createBuoyIcon = (status: string) => {
  let colorClass = 'bg-slate-500';
  let glowClass = 'shadow-slate-500/50';

  if (status === 'Excellent') { colorClass = 'bg-green-500'; glowClass = 'shadow-green-500/50'; }
  if (status === 'Good') { colorClass = 'bg-sky-500'; glowClass = 'shadow-sky-500/50'; }
  if (status === 'Poor') { colorClass = 'bg-orange-500'; glowClass = 'shadow-orange-500/50'; }
  if (status === 'Critical') { colorClass = 'bg-red-500'; glowClass = 'shadow-red-500/50'; }

  return L.divIcon({
    className: 'custom-icon',
    html: `
      <div class="relative flex items-center justify-center w-6 h-6">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${colorClass} opacity-75"></span>
        <span class="relative inline-flex rounded-full h-4 w-4 ${colorClass} border-2 border-white shadow-lg ${glowClass}"></span>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12], // Center the icon
    popupAnchor: [0, -12] // Popup appears above the icon
  });
};

interface LeafletOceanMapProps {
  buoyData: BuoyData[];
  onBuoySelect: (buoy: BuoyData) => void;
}

// Helper to center map when data changes (optional)
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export function LeafletOceanMap({ buoyData, onBuoySelect }: LeafletOceanMapProps) {
  // Center of India
  const defaultCenter: [number, number] = [20.5937, 78.9629];

  return (
    <div className="h-full w-full z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={5} 
        scrollWheelZoom={true} 
        className="h-full w-full rounded-lg"
        attributionControl={false} // Cleaner look
      >
        {/* Dark Mode Tiles (Free via CartoDB) */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {buoyData.map((buoy) => (
          <Marker
            key={buoy.id}
            position={[buoy.lat, buoy.lng]}
            icon={createBuoyIcon(buoy.status)}
            eventHandlers={{
              click: () => onBuoySelect(buoy),
            }}
          >
            <Popup className="glass-popup">
              <div className="min-w-[180px] p-1">
                <div className="flex items-center gap-2 border-b border-border/10 pb-2 mb-2">
                  <Anchor className="w-4 h-4 text-primary" />
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{buoy.name || `Buoy ${buoy.id}`}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Navigation className="w-3 h-3" /> 
                      {buoy.name || "Coastal Region"}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded">
                    <span className="block text-muted-foreground">pH</span>
                    <span className="font-semibold">{buoy.ph.toFixed(1)}</span>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded">
                    <span className="block text-muted-foreground">Turbidity</span>
                    <span className="font-semibold">{buoy.turbidity.toFixed(1)}</span>
                  </div>
                </div>

                <Button 
                  size="sm" 
                  className="w-full h-7 text-xs" 
                  onClick={() => onBuoySelect(buoy)}
                >
                  Analyze
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
        
        <MapUpdater center={defaultCenter} />
      </MapContainer>
    </div>
  );
}