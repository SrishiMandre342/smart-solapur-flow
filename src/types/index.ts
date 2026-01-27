// ============= SHARED TYPES FOR SMARTFLOW SOLAPUR =============

// User Types
export interface AppUser {
  uid: string;
  email: string;
  name?: string;
  role: 'citizen' | 'admin';
  vehiclePlate?: string;
  phone?: string;
}

// Parking Zone Types
export interface ParkingZone {
  id: string;
  name: string;
  wardName: string;
  wardId: string;
  lat: number;
  lng: number;
  totalSlots: number;
  availableSlots: number;
  psi: number;
  pricePerHour: number;
  status?: 'open' | 'closed';
  distance?: number;
}

// Traffic Zone Types
export interface TrafficZone {
  id: string;
  name: string;
  wardId: string;
  wardName: string;
  lat: number;
  lng: number;
  congestionLevel: 'low' | 'moderate' | 'high';
  vehicleCount: number;
  avgSpeed: number;
}

// Ward Types
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

// Booking Types
export interface Booking {
  id: string;
  zoneId: string;
  zoneName: string;
  wardName: string;
  userId?: string;
  citizenEmail: string;
  citizenName: string;
  startTime: string;
  endTime: string;
  duration: number;
  amount: number;
  status: 'reserved' | 'active' | 'completed' | 'cancelled' | 'expired';
  paymentStatus: 'pending' | 'paid';
}

// Route Types
export interface RouteInfo {
  path: [number, number][];
  congestion: 'low' | 'moderate' | 'high';
  distance: number;
  eta: number;
  destinationName: string;
}

// Location Types
export interface SolapurLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// Chart Data Types
export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

// Stats Types
export interface DashboardStats {
  totalSlots: number;
  availableSlots: number;
  occupancy: number;
  totalRevenue: number;
  avgPsi: number;
  totalZones: number;
  totalWards: number;
}

// Summary Card Props
export interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive';
  description?: string;
}

// Table Column Definition
export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}
