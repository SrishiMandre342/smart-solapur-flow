// Mock data for SmartFlow Solapur - Traffic and Parking Management

export interface ParkingZone {
  id: string;
  name: string;
  wardName: string;
  wardId: string;
  lat: number;
  lng: number;
  totalSlots: number;
  availableSlots: number;
  psi: number; // Parking Stress Index (0-100)
  pricePerHour: number;
}

export interface TrafficZone {
  id: string;
  name: string;
  wardId: string;
  wardName: string;
  lat: number;
  lng: number;
  congestionLevel: 'low' | 'moderate' | 'high';
  vehicleCount: number;
  avgSpeed: number; // km/h
}

export interface Ward {
  id: string;
  name: string;
  totalParkingZones: number;
  totalParkingSlots: number;
  availableSlots: number;
  avgPsi: number;
  congestionLevel: 'low' | 'moderate' | 'high';
  avgSpeed: number;
  dailyRevenue: number;
}

// Solapur coordinates: 17.6599° N, 75.9064° E
export const SOLAPUR_CENTER = {
  lat: 17.6599,
  lng: 75.9064,
};

export const wards: Ward[] = [
  {
    id: 'ward-1',
    name: 'Sadar Bazaar',
    totalParkingZones: 4,
    totalParkingSlots: 120,
    availableSlots: 35,
    avgPsi: 71,
    congestionLevel: 'high',
    avgSpeed: 15,
    dailyRevenue: 15600,
  },
  {
    id: 'ward-2',
    name: 'Railway Station',
    totalParkingZones: 3,
    totalParkingSlots: 150,
    availableSlots: 45,
    avgPsi: 70,
    congestionLevel: 'high',
    avgSpeed: 18,
    dailyRevenue: 18200,
  },
  {
    id: 'ward-3',
    name: 'Siddheshwar Peth',
    totalParkingZones: 3,
    totalParkingSlots: 80,
    availableSlots: 40,
    avgPsi: 50,
    congestionLevel: 'moderate',
    avgSpeed: 25,
    dailyRevenue: 9800,
  },
  {
    id: 'ward-4',
    name: 'Akkalkot Road',
    totalParkingZones: 2,
    totalParkingSlots: 60,
    availableSlots: 45,
    avgPsi: 25,
    congestionLevel: 'low',
    avgSpeed: 40,
    dailyRevenue: 5400,
  },
  {
    id: 'ward-5',
    name: 'Murarji Peth',
    totalParkingZones: 3,
    totalParkingSlots: 90,
    availableSlots: 30,
    avgPsi: 67,
    congestionLevel: 'moderate',
    avgSpeed: 22,
    dailyRevenue: 11200,
  },
  {
    id: 'ward-6',
    name: 'Hotgi Road',
    totalParkingZones: 2,
    totalParkingSlots: 50,
    availableSlots: 35,
    avgPsi: 30,
    congestionLevel: 'low',
    avgSpeed: 45,
    dailyRevenue: 4200,
  },
];

export const parkingZones: ParkingZone[] = [
  // Sadar Bazaar
  {
    id: 'pz-1',
    name: 'Sadar Main Parking',
    wardName: 'Sadar Bazaar',
    wardId: 'ward-1',
    lat: 17.6620,
    lng: 75.9080,
    totalSlots: 40,
    availableSlots: 8,
    psi: 80,
    pricePerHour: 30,
  },
  {
    id: 'pz-2',
    name: 'Market Complex Parking',
    wardName: 'Sadar Bazaar',
    wardId: 'ward-1',
    lat: 17.6615,
    lng: 75.9095,
    totalSlots: 30,
    availableSlots: 12,
    psi: 60,
    pricePerHour: 25,
  },
  {
    id: 'pz-3',
    name: 'Chowk Parking',
    wardName: 'Sadar Bazaar',
    wardId: 'ward-1',
    lat: 17.6632,
    lng: 75.9070,
    totalSlots: 25,
    availableSlots: 5,
    psi: 80,
    pricePerHour: 35,
  },
  {
    id: 'pz-4',
    name: 'Lane 4 Parking',
    wardName: 'Sadar Bazaar',
    wardId: 'ward-1',
    lat: 17.6608,
    lng: 75.9060,
    totalSlots: 25,
    availableSlots: 10,
    psi: 60,
    pricePerHour: 20,
  },
  // Railway Station
  {
    id: 'pz-5',
    name: 'Station Front Parking',
    wardName: 'Railway Station',
    wardId: 'ward-2',
    lat: 17.6555,
    lng: 75.9020,
    totalSlots: 60,
    availableSlots: 15,
    psi: 75,
    pricePerHour: 40,
  },
  {
    id: 'pz-6',
    name: 'Platform Side Parking',
    wardName: 'Railway Station',
    wardId: 'ward-2',
    lat: 17.6548,
    lng: 75.9035,
    totalSlots: 50,
    availableSlots: 20,
    psi: 60,
    pricePerHour: 35,
  },
  {
    id: 'pz-7',
    name: 'East Gate Parking',
    wardName: 'Railway Station',
    wardId: 'ward-2',
    lat: 17.6562,
    lng: 75.9050,
    totalSlots: 40,
    availableSlots: 10,
    psi: 75,
    pricePerHour: 30,
  },
  // Siddheshwar Peth
  {
    id: 'pz-8',
    name: 'Temple Parking',
    wardName: 'Siddheshwar Peth',
    wardId: 'ward-3',
    lat: 17.6680,
    lng: 75.9120,
    totalSlots: 30,
    availableSlots: 15,
    psi: 50,
    pricePerHour: 20,
  },
  {
    id: 'pz-9',
    name: 'Garden Road Parking',
    wardName: 'Siddheshwar Peth',
    wardId: 'ward-3',
    lat: 17.6695,
    lng: 75.9135,
    totalSlots: 25,
    availableSlots: 12,
    psi: 52,
    pricePerHour: 15,
  },
  {
    id: 'pz-10',
    name: 'Peth Main Parking',
    wardName: 'Siddheshwar Peth',
    wardId: 'ward-3',
    lat: 17.6672,
    lng: 75.9145,
    totalSlots: 25,
    availableSlots: 13,
    psi: 48,
    pricePerHour: 15,
  },
  // Akkalkot Road
  {
    id: 'pz-11',
    name: 'Highway Parking A',
    wardName: 'Akkalkot Road',
    wardId: 'ward-4',
    lat: 17.6520,
    lng: 75.9200,
    totalSlots: 35,
    availableSlots: 28,
    psi: 20,
    pricePerHour: 10,
  },
  {
    id: 'pz-12',
    name: 'Highway Parking B',
    wardName: 'Akkalkot Road',
    wardId: 'ward-4',
    lat: 17.6500,
    lng: 75.9220,
    totalSlots: 25,
    availableSlots: 17,
    psi: 32,
    pricePerHour: 10,
  },
  // Murarji Peth
  {
    id: 'pz-13',
    name: 'Commercial Hub Parking',
    wardName: 'Murarji Peth',
    wardId: 'ward-5',
    lat: 17.6640,
    lng: 75.8980,
    totalSlots: 35,
    availableSlots: 10,
    psi: 71,
    pricePerHour: 25,
  },
  {
    id: 'pz-14',
    name: 'Office Complex Parking',
    wardName: 'Murarji Peth',
    wardId: 'ward-5',
    lat: 17.6655,
    lng: 75.8965,
    totalSlots: 30,
    availableSlots: 12,
    psi: 60,
    pricePerHour: 20,
  },
  {
    id: 'pz-15',
    name: 'School Lane Parking',
    wardName: 'Murarji Peth',
    wardId: 'ward-5',
    lat: 17.6625,
    lng: 75.8990,
    totalSlots: 25,
    availableSlots: 8,
    psi: 68,
    pricePerHour: 20,
  },
  // Hotgi Road
  {
    id: 'pz-16',
    name: 'Industrial Parking',
    wardName: 'Hotgi Road',
    wardId: 'ward-6',
    lat: 17.6450,
    lng: 75.8920,
    totalSlots: 30,
    availableSlots: 22,
    psi: 27,
    pricePerHour: 10,
  },
  {
    id: 'pz-17',
    name: 'Warehouse Parking',
    wardName: 'Hotgi Road',
    wardId: 'ward-6',
    lat: 17.6435,
    lng: 75.8905,
    totalSlots: 20,
    availableSlots: 13,
    psi: 35,
    pricePerHour: 10,
  },
];

export const trafficZones: TrafficZone[] = [
  // High congestion areas
  {
    id: 'tz-1',
    name: 'Sadar Junction',
    wardId: 'ward-1',
    wardName: 'Sadar Bazaar',
    lat: 17.6625,
    lng: 75.9085,
    congestionLevel: 'high',
    vehicleCount: 450,
    avgSpeed: 12,
  },
  {
    id: 'tz-2',
    name: 'Market Circle',
    wardId: 'ward-1',
    wardName: 'Sadar Bazaar',
    lat: 17.6610,
    lng: 75.9075,
    congestionLevel: 'high',
    vehicleCount: 380,
    avgSpeed: 18,
  },
  {
    id: 'tz-3',
    name: 'Station Main Road',
    wardId: 'ward-2',
    wardName: 'Railway Station',
    lat: 17.6560,
    lng: 75.9025,
    congestionLevel: 'high',
    vehicleCount: 420,
    avgSpeed: 15,
  },
  {
    id: 'tz-4',
    name: 'Station Flyover',
    wardId: 'ward-2',
    wardName: 'Railway Station',
    lat: 17.6545,
    lng: 75.9040,
    congestionLevel: 'high',
    vehicleCount: 350,
    avgSpeed: 20,
  },
  // Moderate congestion
  {
    id: 'tz-5',
    name: 'Temple Road',
    wardId: 'ward-3',
    wardName: 'Siddheshwar Peth',
    lat: 17.6685,
    lng: 75.9130,
    congestionLevel: 'moderate',
    vehicleCount: 220,
    avgSpeed: 28,
  },
  {
    id: 'tz-6',
    name: 'Peth Main Street',
    wardId: 'ward-3',
    wardName: 'Siddheshwar Peth',
    lat: 17.6675,
    lng: 75.9140,
    congestionLevel: 'moderate',
    vehicleCount: 180,
    avgSpeed: 25,
  },
  {
    id: 'tz-7',
    name: 'Commercial Street',
    wardId: 'ward-5',
    wardName: 'Murarji Peth',
    lat: 17.6645,
    lng: 75.8975,
    congestionLevel: 'moderate',
    vehicleCount: 250,
    avgSpeed: 22,
  },
  // Low congestion
  {
    id: 'tz-8',
    name: 'Akkalkot Highway',
    wardId: 'ward-4',
    wardName: 'Akkalkot Road',
    lat: 17.6510,
    lng: 75.9210,
    congestionLevel: 'low',
    vehicleCount: 80,
    avgSpeed: 55,
  },
  {
    id: 'tz-9',
    name: 'Bypass Road',
    wardId: 'ward-4',
    wardName: 'Akkalkot Road',
    lat: 17.6495,
    lng: 75.9230,
    congestionLevel: 'low',
    vehicleCount: 60,
    avgSpeed: 60,
  },
  {
    id: 'tz-10',
    name: 'Industrial Road',
    wardId: 'ward-6',
    wardName: 'Hotgi Road',
    lat: 17.6445,
    lng: 75.8915,
    congestionLevel: 'low',
    vehicleCount: 70,
    avgSpeed: 50,
  },
];

// Helper functions
export const getPsiColor = (psi: number): string => {
  if (psi < 40) return 'success';
  if (psi < 70) return 'warning';
  return 'destructive';
};

export const getPsiLabel = (psi: number): string => {
  if (psi < 40) return 'Low';
  if (psi < 70) return 'Moderate';
  return 'High';
};

export const getTrafficColor = (level: 'low' | 'moderate' | 'high'): string => {
  switch (level) {
    case 'low':
      return 'success';
    case 'moderate':
      return 'warning';
    case 'high':
      return 'destructive';
  }
};

export const getTotalStats = () => {
  const totalSlots = parkingZones.reduce((acc, zone) => acc + zone.totalSlots, 0);
  const availableSlots = parkingZones.reduce((acc, zone) => acc + zone.availableSlots, 0);
  const totalRevenue = wards.reduce((acc, ward) => acc + ward.dailyRevenue, 0);
  const avgPsi = Math.round(parkingZones.reduce((acc, zone) => acc + zone.psi, 0) / parkingZones.length);
  
  return {
    totalSlots,
    availableSlots,
    occupancy: Math.round(((totalSlots - availableSlots) / totalSlots) * 100),
    totalRevenue,
    avgPsi,
    totalZones: parkingZones.length,
    totalWards: wards.length,
  };
};
