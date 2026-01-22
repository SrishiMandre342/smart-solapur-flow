import React from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { solapurLocations, SolapurLocation } from '@/data/locations';

interface LocationSelectorProps {
  selectedLocation: SolapurLocation | null;
  userLocation: { lat: number; lng: number } | null;
  isLocating: boolean;
  onSelectLocation: (location: SolapurLocation | null) => void;
  onDetectLocation: () => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedLocation,
  userLocation,
  isLocating,
  onSelectLocation,
  onDetectLocation,
}) => {
  const handleLocationChange = (locationId: string) => {
    if (locationId === 'current') {
      onDetectLocation();
      onSelectLocation(null);
    } else {
      const location = solapurLocations.find((l) => l.id === locationId);
      if (location) {
        onSelectLocation(location);
      }
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Choose Location</h3>
              <p className="text-sm text-muted-foreground">
                {selectedLocation
                  ? selectedLocation.description
                  : userLocation
                  ? 'Using your current location'
                  : 'Select a location or use GPS'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Select
              value={selectedLocation?.id || (userLocation ? 'current' : '')}
              onValueChange={handleLocationChange}
            >
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4" />
                    <span>Use Current Location</span>
                  </div>
                </SelectItem>
                {solapurLocations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={onDetectLocation}
              disabled={isLocating}
              variant={userLocation && !selectedLocation ? 'default' : 'outline'}
              size="icon"
              className="shrink-0"
            >
              {isLocating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {(selectedLocation || userLocation) && (
          <div className="mt-3 flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {selectedLocation ? (
                <>
                  <MapPin className="w-3 h-3 mr-1" />
                  {selectedLocation.name}
                </>
              ) : (
                <>
                  <Navigation className="w-3 h-3 mr-1" />
                  Current Location Detected
                </>
              )}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationSelector;
