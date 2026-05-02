import { MapContainer, TileLayer, Popup, CircleMarker } from 'react-leaflet';
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
];

export function GeographicMap() {
  return (
    <div className="h-full w-full rounded-xl overflow-hidden relative">
      {/* Overlay to enforce dark theme tinting if needed */}
      <div className="absolute inset-0 pointer-events-none z-[400] shadow-[inset_0_0_50px_rgba(15,17,26,0.8)]"></div>
      
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
        
        {THREAT_DATA.map((threat) => (
          <CircleMarker
            key={threat.id}
            center={[threat.lat, threat.lng]}
            radius={threat.intensity === 'high' ? 12 : threat.intensity === 'medium' ? 8 : 5}
            pathOptions={{
              color: threat.intensity === 'high' ? '#ef4444' : threat.intensity === 'medium' ? '#f59e0b' : '#3b82f6',
              fillColor: threat.intensity === 'high' ? '#ef4444' : threat.intensity === 'medium' ? '#f59e0b' : '#3b82f6',
              fillOpacity: 0.6,
              weight: 2
            }}
          >
            <Popup className="dark-popup">
              <div className="bg-dark-800 text-slate-200 p-2 rounded shadow-lg border border-dark-600">
                <p className="font-semibold text-brand-500 mb-1">{threat.name}</p>
                <p className="text-xs">Incidents: {threat.count.toLocaleString()}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
