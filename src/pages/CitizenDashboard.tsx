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
import { useToast } from "@/hooks/use-toast";
import { MapPin, Car, Clock, Activity } from "lucide-react";

const CitizenDashboard: React.FC = () => {
  const { toast } = useToast();

  // Location state
  const [selectedLocation, setSelectedLocation] = useState<SolapurLocation | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Booking state
  const [selectedZone, setSelectedZone] = useState<ParkingZone | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{
    path: [number, number][];
    congestion: 'low' | 'moderate' | 'high';
    distance: number;
    eta: number;
    destinationName: string;
  } | null>(null);

  const RADIUS_KM = 2.5;

  // Detect user location
  const detectLocation = () => {
    setIsLocating(true);
    setSelectedLocation(null);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Simulating Solapur area coordinates
          setUserLocation({
            lat: 17.6599 + (Math.random() - 0.5) * 0.01,
            lng: 75.9064 + (Math.random() - 0.5) * 0.01,
          });
          setIsLocating(false);
          toast({ title: "Location detected", description: "Showing nearby parking zones" });
        },
        () => {
          // Fallback to city center
          setUserLocation({ lat: 17.6599, lng: 75.9064 });
          setIsLocating(false);
          toast({ title: "Using default location", description: "Centered on Solapur" });
        }
      );
    } else {
      setUserLocation({ lat: 17.6599, lng: 75.9064 });
      setIsLocating(false);
    }
  };

  // Handle location selection from dropdown
  const handleSelectLocation = (location: SolapurLocation | null) => {
    setSelectedLocation(location);
    if (location) {
      setUserLocation({ lat: location.lat, lng: location.lng });
      setRouteInfo(null);
    }
  };

  // Get current center point
  const currentCenter = useMemo(() => {
    if (selectedLocation) {
      return { lat: selectedLocation.lat, lng: selectedLocation.lng };
    }
    return userLocation;
  }, [selectedLocation, userLocation]);

  // Filter nearby parking zones
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

  // Filter nearby traffic zones
  const nearbyTraffic = useMemo(() => {
    if (!currentCenter) return trafficZones;
    return trafficZones.filter((zone) => {
      const dist = getDistance(currentCenter.lat, currentCenter.lng, zone.lat, zone.lng);
      return dist <= RADIUS_KM * 1.5;
    });
  }, [currentCenter]);

  // Navigate to zone
  const handleNavigate = (zone: ParkingZone) => {
    if (!currentCenter) return;

    const distance = getDistance(currentCenter.lat, currentCenter.lng, zone.lat, zone.lng);
    const congestion = zone.psi > 70 ? 'high' : zone.psi > 40 ? 'moderate' : 'low';
    const speed = congestion === 'high' ? 15 : congestion === 'moderate' ? 25 : 40;
    const eta = Math.ceil((distance / speed) * 60);

    setRouteInfo({
      path: [
        [currentCenter.lat, currentCenter.lng],
        [zone.lat, zone.lng],
      ],
      congestion,
      distance,
      eta,
      destinationName: zone.name,
    });
  };

  // Open booking modal
  const handleSelectParking = (zone: ParkingZone) => {
    setSelectedZone(zone);
    setShowBookingModal(true);
  };

  // Handle successful booking
  const handleBookingSuccess = () => {
    toast({
      title: "Booking Confirmed!",
      description: "Your parking slot has been reserved.",
    });
  };

  // Stats
  const stats = getTotalStats();

  return (
    <DashboardLayout title="Citizen Dashboard">
      <motion.div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard
            title="Available Slots"
            value={stats.availableSlots}
            icon={Car}
            variant="success"
          />
          <SummaryCard
            title="Parking Zones"
            value={stats.totalZones}
            icon={MapPin}
            variant="primary"
          />
          <SummaryCard
            title="Avg. Occupancy"
            value={`${stats.occupancy}%`}
            icon={Clock}
            variant="warning"
          />
          <SummaryCard
            title="Avg. PSI"
            value={stats.avgPsi}
            icon={Activity}
            variant={stats.avgPsi > 60 ? 'destructive' : 'default'}
          />
        </div>

        {/* Location Selector */}
        <LocationSelector
          selectedLocation={selectedLocation}
          userLocation={userLocation}
          isLocating={isLocating}
          onSelectLocation={handleSelectLocation}
          onDetectLocation={detectLocation}
        />

        {/* Route Display */}
        {routeInfo && <RouteDisplay routeInfo={routeInfo} />}

        {/* Map and Parking List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CityMap
              parkingZones={nearbyParking}
              trafficZones={nearbyTraffic}
              userLocation={currentCenter}
              routeInfo={routeInfo}
              onSelectParkingZone={handleSelectParking}
              selectedZoneId={selectedZone?.id}
              showRadius
              radiusKm={RADIUS_KM}
            />
          </div>

          <div>
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
          onSuccess={handleBookingSuccess}
          routeInfo={routeInfo ? {
            distance: routeInfo.distance,
            eta: routeInfo.eta,
            congestion: routeInfo.congestion,
          } : null}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default CitizenDashboard;
