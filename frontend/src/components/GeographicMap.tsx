import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Popup, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const THREAT_DATA = [
  { id: 1, lat: 21.0285, lng: 105.8542, name: 'Hanoi (SEA Cluster)', intensity: 'high', count: 4102 },
  { id: 2, lat: 35.6762, lng: 139.6503, name: 'Tokyo Node', intensity: 'medium', count: 1205 },
  { id: 3, lat: 51.5074, lng: -0.1278, name: 'London Proxy', intensity: 'low', count: 450 },
  { id: 4, lat: 40.7128, lng: -74.0060, name: 'NY Gateway', intensity: 'high', count: 3200 },
  { id: 5, lat: -33.8688, lng: 151.2093, name: 'Sydney Hub', intensity: 'medium', count: 850 },
  { id: 6, lat: 55.7558, lng: 37.6173, name: 'Moscow Relay', intensity: 'high', count: 5200 },
  { id: 7, lat: -23.5505, lng: -46.6333, name: 'São Paulo End', intensity: 'low', count: 300 },
];

export function GeographicMap({ data }: { data?: any[] }) {
  const [activePings, setActivePings] = useState<number[]>([]);
  const displayData = data && data.length > 0 ? data : THREAT_DATA;

  // Effect simulating real-time cyber attacks
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick 1-3 random locations to ping
      const numPings = Math.floor(Math.random() * 3) + 1;
      const newPings: number[] = [];
      for (let i = 0; i < numPings; i++) {
        const randomIdx = Math.floor(Math.random() * displayData.length);
        newPings.push(displayData[randomIdx].id);
      }
      setActivePings(newPings);
    }, 2500);

    return () => clearInterval(interval);
  }, [displayData]);

  const createCustomIcon = (intensity: string, isPinging: boolean) => {
    let colorClass = 'bg-blue-500';
    let shadowClass = 'shadow-[0_0_10px_#3b82f6]';
    
    if (intensity === 'high') {
      colorClass = 'bg-red-500';
      shadowClass = 'shadow-[0_0_15px_#ef4444]';
    } else if (intensity === 'medium') {
      colorClass = 'bg-yellow-500';
      shadowClass = 'shadow-[0_0_10px_#eab308]';
    }

    const htmlString = `
      <div class="relative w-4 h-4">
        <div class="absolute inset-0 rounded-full ${colorClass} ${shadowClass} opacity-80"></div>
        ${isPinging ? `<div class="absolute -inset-4 rounded-full border-2 border-${colorClass.replace('bg-', '')} animate-ping opacity-75"></div>` : ''}
      </div>
    `;

    return L.divIcon({
      className: 'custom-div-icon',
      html: htmlString,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
  };

  return (
    <div className="h-full w-full rounded-xl overflow-hidden relative">
      {/* Overlay to enforce dark theme tinting if needed */}
      <div className="absolute inset-0 pointer-events-none z-[400] shadow-[inset_0_0_50px_rgba(15,17,26,0.8)]"></div>
      
      {/* Overlay Status */}
      <div className="absolute bottom-4 left-4 z-[500] bg-dark-900/80 backdrop-blur-sm border border-dark-700 rounded p-3 flex flex-col gap-2 shadow-lg">
        <div className="flex items-center gap-2 text-[10px] text-slate-300 font-bold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse"></span> Critical Threats
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-300 font-bold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_#eab308]"></span> Medium Risk
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-300 font-bold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></span> Active Scans
        </div>
      </div>

      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        style={{ height: '100%', width: '100%', background: '#0f111a' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {displayData.map((threat) => (
          <Marker
            key={threat.id}
            position={[threat.lat, threat.lng]}
            icon={createCustomIcon(threat.intensity, activePings.includes(threat.id))}
          >
            <Popup className="dark-popup">
              <div className="bg-dark-800 text-slate-200 p-2 rounded shadow-lg border border-dark-600 min-w-[120px]">
                <p className="font-bold text-xs uppercase tracking-widest text-slate-300 mb-2 border-b border-dark-600 pb-1">{threat.name}</p>
                <div className="flex justify-between items-center text-[10px] mb-1">
                  <span className="text-slate-500">Status</span>
                  <span className={`${threat.intensity === 'high' ? 'text-red-400' : threat.intensity === 'medium' ? 'text-yellow-400' : 'text-blue-400'} uppercase font-bold`}>{threat.intensity}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] mb-1">
                  <span className="text-slate-500">Scans</span>
                  <span className="font-mono text-white">{threat.count.toLocaleString()}</span>
                </div>
                {threat.threats !== undefined && (
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500">Threats</span>
                    <span className="font-mono text-red-400">{threat.threats.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
