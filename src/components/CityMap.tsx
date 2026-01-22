import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  Tooltip,
  useMap,
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
const createParkingIcon = (psi: number) => {
  const color = psi < 40 ? "#22c55e" : psi < 70 ? "#f59e0b" : "#ef4444";
  return L.divIcon({
    className: "parking-icon",
    html: `<div style="
      background:${color};
      width:28px;height:28px;border-radius:50%;
      border:2px solid white;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 6px rgba(0,0,0,0.3);
      color:white;font-size:12px;font-weight:700;
    ">P</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

// USER LOCATION ICON (NO ANIMATION)
const userLocationIcon = L.divIcon({
  html: `<div style="
    background:#0d9488;
    width:16px;height:16px;border-radius:50%;
    border:3px solid white;
    box-shadow:0 0 6px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const getTrafficColor = (level: TrafficZone["congestionLevel"]) => {
  return level === "low"
    ? "#22c55e"
    : level === "moderate"
    ? "#f59e0b"
    : "#ef4444";
};

const MapRecenter = ({ center }: { center: [number, number] }) => {
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
    <div className="w-full h-full min-h-[500px]">
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {userLocation && <MapRecenter center={center} />}

        {/* TRAFFIC HOTSPOTS (safe with v4) */}
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
              </div>
            </Tooltip>
          </CircleMarker>
        ))}

        {/* PARKING ZONES */}
        {parkingZones.map((zone) => (
          <Marker
            key={zone.id}
            position={[zone.lat, zone.lng]}
            icon={createParkingIcon(zone.psi)}
          >
            <Popup>
              <div className="space-y-2">
                <strong>{zone.name}</strong>
                <div>
                  <PSIIndicator value={zone.psi} size="sm" />
                </div>
                <Button
                  size="sm"
                  onClick={() => onSelectParkingZone(zone)}
                  className="w-full"
                >
                  <Car className="w-4 h-4 mr-1" /> Book Parking
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
            <Tooltip direction="top">You are here</Tooltip>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default CityMap;
