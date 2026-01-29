import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import CityMap from "@/components/CityMap";
import SummaryCard from "@/components/SummaryCard";
import LocationSelector from "@/components/LocationSelector";
import BookingModal from "@/components/BookingModal";
import NearbyParkingList from "@/components/NearbyParkingList";
import RouteDisplay from "@/components/RouteDisplay";
import { parkingZones, trafficZones, getTotalStats } from "@/data/mockData";
import { solapurLocations, SolapurLocation, getDistance } from "@/data/locations";
import { ParkingZone } from "@/types";
import { openGoogleMapsNavigation } from "@/services/navigationService";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Car, Clock, Activity } from "lucide-react";

const CitizenDashboard: React.FC = () => {
  const { toast } = useToast();

  const [selectedLocation, setSelectedLocation] = useState<SolapurLocation | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const [selectedZone, setSelectedZone] = useState<ParkingZone | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{
    distance: number;
    eta: number;
    congestion: "low" | "moderate" | "high";
    destinationName: string;
  } | null>(null);

  const RADIUS_KM = 2.5;

  const detectLocation = () => {
    setIsLocating(true);
    setSelectedLocation(null);
    setRouteInfo(null);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setUserLocation({
            lat: 17.6599 + (Math.random() - 0.5) * 0.01,
            lng: 75.9064 + (Math.random() - 0.5) * 0.01,
          });
          setIsLocating(false);
          toast({ title: "Location detected", description: "Nearby parking zones unlocked" });
        },
        () => {
          setUserLocation({ lat: 17.6599, lng: 75.9064 });
          setIsLocating(false);
        }
      );
    } else {
      setUserLocation({ lat: 17.6599, lng: 75.9064 });
      setIsLocating(false);
    }
  };

  const handleSelectLocation = (location: SolapurLocation | null) => {
    setSelectedLocation(location);
    setRouteInfo(null);
    if (location) {
      setUserLocation({ lat: location.lat, lng: location.lng });
    }
  };

  const currentCenter = useMemo(() => {
    if (selectedLocation) return { lat: selectedLocation.lat, lng: selectedLocation.lng };
    return userLocation;
  }, [selectedLocation, userLocation]);

  const nearbyParking = useMemo(() => {
    if (!currentCenter) return [];
    return parkingZones
      .map((zone) => ({
        ...zone,
        distance: getDistance(currentCenter.lat, currentCenter.lng, zone.lat, zone.lng),
      }))
      .filter((zone) => zone.distance <= RADIUS_KM)
      .sort((a, b) => a.distance - b.distance);
  }, [currentCenter]);

  const nearbyTraffic = useMemo(() => {
    if (!currentCenter) return trafficZones;
    return trafficZones.filter((zone) => {
      const dist = getDistance(currentCenter.lat, currentCenter.lng, zone.lat, zone.lng);
      return dist <= RADIUS_KM * 1.5;
    });
  }, [currentCenter]);

  const handleNavigate = (zone: ParkingZone) => {
    if (!currentCenter) {
      toast({ title: "Location not detected", description: "Tap detect location first." });
      return;
    }

    // Calculate mock route info
    const distance = getDistance(currentCenter.lat, currentCenter.lng, zone.lat, zone.lng);
    const congestionLevels: ("low" | "moderate" | "high")[] = ["low", "moderate", "high"];
    const congestion = congestionLevels[Math.floor(Math.random() * 3)];
    const speedMap = { low: 40, moderate: 25, high: 15 };
    const eta = Math.round((distance / speedMap[congestion]) * 60);

    setRouteInfo({
      distance,
      eta,
      congestion,
      destinationName: zone.name,
    });

    setSelectedZone(zone);

    // Open Google Maps navigation
    openGoogleMapsNavigation(currentCenter, zone);
  };

  const handleSelectParking = (zone: ParkingZone) => {
    setSelectedZone(zone);
    if (zone.availableSlots > 0) {
      setShowBookingModal(true);
    }
  };

  const stats = getTotalStats();

  return (
    <DashboardLayout title="Citizen Dashboard">
      <motion.div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <SummaryCard title="Available Slots" value={stats.availableSlots} icon={Car} variant="success" />
          <SummaryCard title="Parking Zones" value={stats.totalZones} icon={MapPin} variant="primary" />
          <SummaryCard title="Avg. Occupancy" value={`${stats.occupancy}%`} icon={Clock} variant="warning" />
          <SummaryCard title="Avg. PSI" value={stats.avgPsi} icon={Activity} variant="default" />
        </div>

        {/* Location Selector */}
        <LocationSelector
          selectedLocation={selectedLocation}
          userLocation={userLocation}
          isLocating={isLocating}
          onSelectLocation={handleSelectLocation}
          onDetectLocation={detectLocation}
        />

        {/* Route Display (when navigating) */}
        {routeInfo && <RouteDisplay routeInfo={routeInfo} />}

        {/* Map + Parking List - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-3 gap-4 lg:gap-6">
          {/* Map Section - Order changes on mobile */}
          <div className="lg:col-span-3 xl:col-span-2 order-2 lg:order-1">
            <div className="h-[350px] sm:h-[400px] md:h-[450px] lg:h-[550px]">
              <CityMap
                parkingZones={nearbyParking}
                trafficZones={nearbyTraffic}
                userLocation={currentCenter}
                onSelectParkingZone={handleSelectParking}
                selectedZoneId={selectedZone?.id}
                showRadius
                radiusKm={RADIUS_KM}
              />
            </div>
          </div>

          {/* Parking List - Shows first on mobile */}
          <div className="lg:col-span-2 xl:col-span-1 order-1 lg:order-2">
            <NearbyParkingList
              zones={nearbyParking}
              onSelectZone={handleSelectParking}
              onNavigate={handleNavigate}
              selectedZoneId={selectedZone?.id}
            />
          </div>
        </div>

        {/* Booking Modal */}
        <BookingModal
          zone={selectedZone}
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default CitizenDashboard;
