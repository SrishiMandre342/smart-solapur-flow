// Booking data types and mock data

export interface Booking {
  id: string;
  zoneId: string;
  zoneName: string;
  wardName: string;
  citizenEmail: string;
  citizenName: string;
  time: string;
  duration: number; // hours
  status: 'confirmed' | 'expired' | 'cancelled';
  amount: number;
}

// Mock bookings for admin view
export const mockBookings: Booking[] = [
  {
    id: 'BK001',
    zoneId: 'pz-1',
    zoneName: 'Sadar Main Parking',
    wardName: 'Sadar Bazaar',
    citizenEmail: 'rahul.sharma@email.com',
    citizenName: 'Rahul Sharma',
    time: '2026-01-22T09:30:00',
    duration: 2,
    status: 'confirmed',
    amount: 60,
  },
  {
    id: 'BK002',
    zoneId: 'pz-5',
    zoneName: 'Station Front Parking',
    wardName: 'Railway Station',
    citizenEmail: 'priya.patil@email.com',
    citizenName: 'Priya Patil',
    time: '2026-01-22T08:15:00',
    duration: 3,
    status: 'confirmed',
    amount: 120,
  },
  {
    id: 'BK003',
    zoneId: 'pz-3',
    zoneName: 'Chowk Parking',
    wardName: 'Sadar Bazaar',
    citizenEmail: 'amit.deshmukh@email.com',
    citizenName: 'Amit Deshmukh',
    time: '2026-01-22T07:00:00',
    duration: 1,
    status: 'expired',
    amount: 35,
  },
  {
    id: 'BK004',
    zoneId: 'pz-8',
    zoneName: 'Temple Parking',
    wardName: 'Siddheshwar Peth',
    citizenEmail: 'sneha.kulkarni@email.com',
    citizenName: 'Sneha Kulkarni',
    time: '2026-01-22T10:00:00',
    duration: 2,
    status: 'confirmed',
    amount: 40,
  },
  {
    id: 'BK005',
    zoneId: 'pz-13',
    zoneName: 'Commercial Hub Parking',
    wardName: 'Murarji Peth',
    citizenEmail: 'vikram.jadhav@email.com',
    citizenName: 'Vikram Jadhav',
    time: '2026-01-22T11:30:00',
    duration: 4,
    status: 'confirmed',
    amount: 100,
  },
];

// Notifications for admin
export interface Notification {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export const mockNotifications: Notification[] = [
  {
    id: 'N001',
    type: 'error',
    title: 'High PSI Alert',
    message: 'High PSI detected in Sadar Main Parking (80%)',
    time: '5 min ago',
    read: false,
  },
  {
    id: 'N002',
    type: 'warning',
    title: 'Heavy Congestion',
    message: 'Heavy congestion on Akkalkot Road - Avg speed 12 km/h',
    time: '12 min ago',
    read: false,
  },
  {
    id: 'N003',
    type: 'error',
    title: 'Slots Full',
    message: 'Slots nearly full at Chowk Parking (5 remaining)',
    time: '18 min ago',
    read: false,
  },
  {
    id: 'N004',
    type: 'info',
    title: 'Revenue Milestone',
    message: 'Daily revenue crossed ₹50,000 mark',
    time: '32 min ago',
    read: true,
  },
  {
    id: 'N005',
    type: 'warning',
    title: 'Moderate Congestion',
    message: 'Traffic building up at Station Main Road',
    time: '45 min ago',
    read: true,
  },
];

// Generate unique booking ID
export const generateBookingId = (): string => {
  return `BK${Date.now().toString(36).toUpperCase()}`;
};
