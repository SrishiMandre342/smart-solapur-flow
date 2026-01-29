import React, { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  Tooltip,
  useMap,
  Polyline,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  ParkingZone,
  TrafficZone,
  SOLAPUR_CENTER,
} from "@/data/mockData";
import PSIIndicator from "@/components/PSIIndicator";
import TrafficBadge from "@/components/TrafficBadge";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

// FIX STANDARD MARKERS
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// CUSTOM PARKING ICON (SIMPLE + SAFE)
const createParkingIcon = (psi: number, isSelected: boolean = false) => {
  const color = psi < 40 ? "#22c55e" : psi < 70 ? "#f59e0b" : "#ef4444";
  const size = isSelected ? 36 : 28;
  const borderWidth = isSelected ? 3 : 2;
  return L.divIcon({
    className: "parking-icon",
    html: `<div style="
      background:${color};
      width:${size}px;height:${size}px;border-radius:50%;
      border:${borderWidth}px solid ${isSelected ? '#0d9488' : 'white'};
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 6px rgba(0,0,0,0.3)${isSelected ? ', 0 0 10px rgba(13,148,136,0.5)' : ''};
      color:white;font-size:${isSelected ? 14 : 12}px;font-weight:700;
      transition: all 0.2s ease;
    ">P</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// USER LOCATION ICON (Animated pulsing)
const createUserLocationIcon = () => {
  return L.divIcon({
    className: "user-location-icon",
    html: `
      <div style="position:relative;width:24px;height:24px;">
        <div style="
          position:absolute;
          top:50%;left:50%;
          transform:translate(-50%,-50%);
          background:rgba(13,148,136,0.3);
          width:40px;height:40px;border-radius:50%;
          animation:pulse 2s ease-out infinite;
        "></div>
        <div style="
          position:absolute;
          top:50%;left:50%;
          transform:translate(-50%,-50%);
          background:#0d9488;
          width:16px;height:16px;border-radius:50%;
          border:3px solid white;
          box-shadow:0 0 8px rgba(0,0,0,0.3);
        "></div>
      </div>
      <style>
        @keyframes pulse {
          0% { transform: translate(-50%,-50%) scale(0.5); opacity: 1; }
          100% { transform: translate(-50%,-50%) scale(1.5); opacity: 0; }
        }
      </style>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const getTrafficColor = (level: TrafficZone["congestionLevel"]) => {
  return level === "low"
    ? "#22c55e"
    : level === "moderate"
    ? "#f59e0b"
    : "#ef4444";
};

const getRouteColor = (congestion: 'low' | 'moderate' | 'high') => {
  switch (congestion) {
    case 'low':
      return '#22c55e';
    case 'moderate':
      return '#f59e0b';
    case 'high':
      return '#ef4444';
    default:
      return '#0d9488';
  }
};

// Map recenter with animation
const MapRecenter = ({ center, zoom }: { center: [number, number]; zoom?: number }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom || 14, {
      duration: 1,
      easeLinearity: 0.25,
    });
  }, [center, zoom, map]);
  return null;
};

interface RouteInfo {
  path: [number, number][];
  congestion: 'low' | 'moderate' | 'high';
}

interface CityMapProps {
  parkingZones: ParkingZone[];
  trafficZones: TrafficZone[];
  userLocation: { lat: number; lng: number } | null;
  onSelectParkingZone: (zone: ParkingZone) => void;
  selectedZoneId?: string;
  routeInfo?: RouteInfo | null;
  radiusKm?: number;
  showRadius?: boolean;
}

const CityMap: React.FC<CityMapProps> = ({
  parkingZones,
  trafficZones,
  userLocation,
  onSelectParkingZone,
  selectedZoneId,
  routeInfo,
  radiusKm = 2.5,
  showRadius = true,
}) => {
  const center: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [SOLAPUR_CENTER.lat, SOLAPUR_CENTER.lng];

  const userLocationIcon = useMemo(() => createUserLocationIcon(), []);

  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[500px] rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%", zIndex: 1 }}
        className="z-0"
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {userLocation && <MapRecenter center={center} />}

        {/* User location radius indicator */}
        {userLocation && showRadius && (
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={radiusKm * 1000} // Convert km to meters
            pathOptions={{
              color: '#0d9488',
              fillColor: '#0d9488',
              fillOpacity: 0.05,
              weight: 1,
              dashArray: '5, 10',
            }}
          />
        )}

        {/* TRAFFIC HOTSPOTS */}
        {trafficZones.map((zone) => (
          <CircleMarker
            key={zone.id}
            center={[zone.lat, zone.lng]}
            radius={40}
            pathOptions={{
              color: getTrafficColor(zone.congestionLevel),
              fillColor: getTrafficColor(zone.congestionLevel),
              fillOpacity: 0.35,
              weight: 2,
            }}
          >
            <Tooltip direction="top">
              <div className="text-sm">
                <strong>{zone.name}</strong>
                <br />
                <TrafficBadge level={zone.congestionLevel} size="sm" />
                <br />
                <span className="text-xs text-muted-foreground">
                  Avg Speed: {zone.avgSpeed} km/h
                </span>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}

        {/* ROUTE POLYLINE */}
        {routeInfo && routeInfo.path.length > 1 && (
          <Polyline
            positions={routeInfo.path}
            pathOptions={{
              color: getRouteColor(routeInfo.congestion),
              weight: 4,
              opacity: 0.8,
              dashArray: routeInfo.congestion === 'high' ? '10, 10' : undefined,
            }}
          />
        )}

        {/* PARKING ZONES */}
        {parkingZones.map((zone) => (
          <Marker
            key={zone.id}
            position={[zone.lat, zone.lng]}
            icon={createParkingIcon(zone.psi, selectedZoneId === zone.id)}
          >
            <Popup>
              <div className="space-y-2 min-w-[180px]">
                <strong className="text-sm">{zone.name}</strong>
                <div className="text-xs text-muted-foreground">{zone.wardName}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">
                    {zone.availableSlots}/{zone.totalSlots} slots
                  </span>
                  <PSIIndicator value={zone.psi} size="sm" />
                </div>
                <div className="text-xs font-medium text-primary">
                  ₹{zone.pricePerHour}/hour
                </div>
                <Button
                  size="sm"
                  onClick={() => onSelectParkingZone(zone)}
                  className="w-full"
                  disabled={zone.availableSlots === 0}
                >
                  <Car className="w-4 h-4 mr-1" /> 
                  {zone.availableSlots === 0 ? 'Full' : 'Book Parking'}
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* USER LOCATION */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userLocationIcon}
          >
            <Tooltip direction="top" permanent={false}>
              <span className="font-medium">You are here</span>
            </Tooltip>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default CityMap;
