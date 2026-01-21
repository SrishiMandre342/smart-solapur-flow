import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ParkingZone, TrafficZone, SOLAPUR_CENTER } from '@/data/mockData';
import PSIIndicator from '@/components/PSIIndicator';
import TrafficBadge from '@/components/TrafficBadge';
import { Button } from '@/components/ui/button';
import { Car, Navigation } from 'lucide-react';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom parking icon
const createParkingIcon = (psi: number) => {
  const color = psi < 40 ? '#22c55e' : psi < 70 ? '#f59e0b' : '#ef4444';
  return L.divIcon({
    className: 'custom-parking-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// User location icon
const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div style="
      background-color: #0d9488;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 4px solid white;
      box-shadow: 0 0 0 4px rgba(13, 148, 136, 0.3), 0 2px 8px rgba(0,0,0,0.3);
      animation: pulse 2s infinite;
    "></div>
    <style>
      @keyframes pulse {
        0% { box-shadow: 0 0 0 4px rgba(13, 148, 136, 0.3), 0 2px 8px rgba(0,0,0,0.3); }
        50% { box-shadow: 0 0 0 8px rgba(13, 148, 136, 0.1), 0 2px 8px rgba(0,0,0,0.3); }
        100% { box-shadow: 0 0 0 4px rgba(13, 148, 136, 0.3), 0 2px 8px rgba(0,0,0,0.3); }
      }
    </style>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Traffic zone colors
const getTrafficCircleColor = (level: 'low' | 'moderate' | 'high') => {
  switch (level) {
    case 'low':
      return { color: '#22c55e', fillColor: '#22c55e' };
    case 'moderate':
      return { color: '#f59e0b', fillColor: '#f59e0b' };
    case 'high':
      return { color: '#ef4444', fillColor: '#ef4444' };
  }
};

interface MapRecenterProps {
  center: [number, number];
}

const MapRecenter: React.FC<MapRecenterProps> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14);
  }, [center, map]);
  return null;
};

interface CityMapProps {
  parkingZones: ParkingZone[];
  trafficZones: TrafficZone[];
  userLocation: { lat: number; lng: number } | null;
  onSelectParkingZone: (zone: ParkingZone) => void;
}

const CityMap: React.FC<CityMapProps> = ({
  parkingZones,
  trafficZones,
  userLocation,
  onSelectParkingZone,
}) => {
  const center: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [SOLAPUR_CENTER.lat, SOLAPUR_CENTER.lng];

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg border border-border">
      <MapContainer
        center={center}
        zoom={14}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {userLocation && <MapRecenter center={[userLocation.lat, userLocation.lng]} />}

        {/* Traffic zones as circles */}
        {trafficZones.map((zone) => {
          const colors = getTrafficCircleColor(zone.congestionLevel);
          return (
            <Circle
              key={zone.id}
              center={[zone.lat, zone.lng]}
              radius={200}
              pathOptions={{
                color: colors.color,
                fillColor: colors.fillColor,
                fillOpacity: 0.3,
                weight: 2,
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-foreground mb-2">{zone.name}</h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">Ward: {zone.wardName}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Traffic:</span>
                      <TrafficBadge level={zone.congestionLevel} size="sm" />
                    </div>
                    <p className="text-muted-foreground">Avg Speed: {zone.avgSpeed} km/h</p>
                    <p className="text-muted-foreground">Vehicles: {zone.vehicleCount}</p>
                  </div>
                </div>
              </Popup>
            </Circle>
          );
        })}

        {/* Parking zones as markers */}
        {parkingZones.map((zone) => (
          <Marker
            key={zone.id}
            position={[zone.lat, zone.lng]}
            icon={createParkingIcon(zone.psi)}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-foreground mb-2">{zone.name}</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">Ward: {zone.wardName}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Available:</span>
                    <span className="font-semibold text-foreground">
                      {zone.availableSlots}/{zone.totalSlots} slots
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">PSI:</span>
                    <PSIIndicator value={zone.psi} size="sm" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-semibold text-foreground">₹{zone.pricePerHour}/hr</span>
                  </div>
                  <Button
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => onSelectParkingZone(zone)}
                  >
                    <Car className="w-4 h-4 mr-1" />
                    Book Parking
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* User location marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
            <Popup>
              <div className="p-2 text-center">
                <p className="font-semibold text-foreground">Your Location</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default CityMap;
