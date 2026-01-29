import React from "react";
import { Button } from "@/components/ui/button";
import { ParkingZone } from "@/types";
import PSIIndicator from "@/components/PSIIndicator";
import { MapPin, Navigation, Car } from "lucide-react";

interface Props {
  zones: (ParkingZone & { distance?: number })[];
  onSelectZone: (zone: ParkingZone) => void;
  onNavigate: (zone: ParkingZone) => void;
  selectedZoneId?: string;
}

const NearbyParkingList: React.FC<Props> = ({
  zones,
  onSelectZone,
  onNavigate,
  selectedZoneId,
}) => {
  return (
    <div className="space-y-3">
      {zones.length === 0 && (
        <p className="text-sm text-muted-foreground">No parking zones nearby.</p>
      )}

      {zones.map((zone) => (
        <div
          key={zone.id}
          className={`p-3 rounded-lg border ${
            selectedZoneId === zone.id ? "border-primary" : "border-border"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">{zone.name}</p>
              <p className="text-xs text-muted-foreground">{zone.wardName}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {zone.availableSlots}/{zone.totalSlots} slots — ₹{zone.pricePerHour}/hr
              </p>
              {zone.distance !== undefined && (
                <p className="text-xs text-primary mt-1">
                  {(zone.distance).toFixed(1)} km away
                </p>
              )}
            </div>

            <PSIIndicator value={zone.psi} size="sm" />
          </div>

          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              variant="default"
              className="flex-1"
              onClick={() => onSelectZone(zone)}
            >
              <Car className="w-4 h-4 mr-1" /> Book
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => onNavigate(zone)}
            >
              <Navigation className="w-4 h-4 mr-1" /> Navigate
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NearbyParkingList;
