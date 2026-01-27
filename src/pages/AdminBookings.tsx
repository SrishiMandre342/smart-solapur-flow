import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PaymentStatusBadge from '@/components/PaymentStatusBadge';
import { DataTable } from '@/components/ui/data-table';
import { Booking } from '@/types';
import {
  Ticket,
  MapPin,
  Clock,
  IndianRupee,
  CheckCircle,
  User,
  CreditCard,
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

// Mock booking data for admin
const mockAdminBookings: Booking[] = [
  {
    id: 'BK001',
    zoneId: 'pz-1',
    zoneName: 'Sadar Main Parking',
    wardName: 'Sadar Bazaar',
    citizenEmail: 'rahul.sharma@email.com',
    citizenName: 'Rahul Sharma',
    startTime: '2026-01-27T09:00:00',
    endTime: '2026-01-27T11:00:00',
    duration: 2,
    amount: 60,
    status: 'active',
    paymentStatus: 'pending',
  },
  {
    id: 'BK002',
    zoneId: 'pz-5',
    zoneName: 'Station Front Parking',
    wardName: 'Railway Station',
    citizenEmail: 'priya.patil@email.com',
    citizenName: 'Priya Patil',
    startTime: '2026-01-27T08:00:00',
    endTime: '2026-01-27T11:00:00',
    duration: 3,
    amount: 120,
    status: 'active',
    paymentStatus: 'pending',
  },
  {
    id: 'BK003',
    zoneId: 'pz-3',
    zoneName: 'Chowk Parking',
    wardName: 'Sadar Bazaar',
    citizenEmail: 'amit.deshmukh@email.com',
    citizenName: 'Amit Deshmukh',
    startTime: '2026-01-27T07:00:00',
    endTime: '2026-01-27T08:00:00',
    duration: 1,
    amount: 35,
    status: 'completed',
    paymentStatus: 'paid',
  },
  {
    id: 'BK004',
    zoneId: 'pz-8',
    zoneName: 'Temple Parking',
    wardName: 'Siddheshwar Peth',
    citizenEmail: 'sneha.kulkarni@email.com',
    citizenName: 'Sneha Kulkarni',
    startTime: '2026-01-27T10:00:00',
    endTime: '2026-01-27T12:00:00',
    duration: 2,
    amount: 40,
    status: 'reserved',
    paymentStatus: 'pending',
  },
  {
    id: 'BK005',
    zoneId: 'pz-13',
    zoneName: 'Commercial Hub Parking',
    wardName: 'Murarji Peth',
    citizenEmail: 'vikram.jadhav@email.com',
    citizenName: 'Vikram Jadhav',
    startTime: '2026-01-26T11:00:00',
    endTime: '2026-01-26T15:00:00',
    duration: 4,
    amount: 100,
    status: 'completed',
    paymentStatus: 'paid',
  },
  {
    id: 'BK006',
    zoneId: 'pz-6',
    zoneName: 'Platform Side Parking',
    wardName: 'Railway Station',
    citizenEmail: 'anjali.more@email.com',
    citizenName: 'Anjali More',
    startTime: '2026-01-26T14:00:00',
    endTime: '2026-01-26T17:00:00',
    duration: 3,
    amount: 105,
    status: 'completed',
    paymentStatus: 'paid',
  },
];

const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(mockAdminBookings);
  const { toast } = useToast();

  const pendingBookings = bookings.filter(b => b.paymentStatus === 'pending');
  const completedBookings = bookings.filter(b => b.paymentStatus === 'paid');

  const handleMarkPaid = (bookingId: string) => {
    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId ? { ...b, paymentStatus: 'paid' as const } : b
      )
    );
    toast({
      title: 'Payment Marked',
      description: `Booking ${bookingId} marked as paid.`,
    });
  };

  const pendingColumns = [
    {
      key: 'id',
      label: 'Booking ID',
      sortable: true,
      render: (booking: Booking) => (
        <span className="font-mono text-sm">{booking.id}</span>
      ),
    },
    {
      key: 'citizenName',
      label: 'User',
      sortable: true,
      render: (booking: Booking) => (
        <div>
          <p className="font-medium text-foreground flex items-center gap-1">
            <User className="w-3 h-3" />
            {booking.citizenName}
          </p>
          <p className="text-xs text-muted-foreground">{booking.citizenEmail}</p>
        </div>
      ),
    },
    {
      key: 'zoneName',
      label: 'Zone',
      sortable: true,
      render: (booking: Booking) => (
        <div>
          <p className="font-medium">{booking.zoneName}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {booking.wardName}
          </p>
        </div>
      ),
    },
    {
      key: 'startTime',
      label: 'Start Time',
      sortable: true,
      render: (booking: Booking) => (
        <div className="text-sm">
          <p>{format(new Date(booking.startTime), 'MMM d, yyyy')}</p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(booking.startTime), 'h:mm a')}
          </p>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (booking: Booking) => (
        <span className="font-semibold text-primary flex items-center gap-1">
          <IndianRupee className="w-3 h-3" />
          {booking.amount}
        </span>
      ),
    },
    {
      key: 'paymentStatus',
      label: 'Status',
      render: (booking: Booking) => (
        <PaymentStatusBadge status={booking.paymentStatus} />
      ),
    },
    {
      key: 'actions',
      label: 'Action',
      render: (booking: Booking) => (
        <Button
          size="sm"
          onClick={() => handleMarkPaid(booking.id)}
        >
          <CreditCard className="w-4 h-4 mr-1" />
          Mark Paid
        </Button>
      ),
    },
  ];

  const completedColumns = [
    {
      key: 'id',
      label: 'Booking ID',
      sortable: true,
      render: (booking: Booking) => (
        <span className="font-mono text-sm">{booking.id}</span>
      ),
    },
    {
      key: 'citizenName',
      label: 'User',
      sortable: true,
      render: (booking: Booking) => (
        <div>
          <p className="font-medium text-foreground">{booking.citizenName}</p>
          <p className="text-xs text-muted-foreground">{booking.citizenEmail}</p>
        </div>
      ),
    },
    {
      key: 'zoneName',
      label: 'Zone',
      sortable: true,
      render: (booking: Booking) => (
        <div>
          <p className="font-medium">{booking.zoneName}</p>
          <p className="text-xs text-muted-foreground">{booking.wardName}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (booking: Booking) => (
        <span className="font-semibold text-primary flex items-center gap-1">
          <IndianRupee className="w-3 h-3" />
          {booking.amount}
        </span>
      ),
    },
    {
      key: 'endTime',
      label: 'Completed At',
      sortable: true,
      render: (booking: Booking) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(booking.endTime), 'MMM d, h:mm a')}
        </span>
      ),
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      render: (booking: Booking) => (
        <PaymentStatusBadge status={booking.paymentStatus} />
      ),
    },
  ];

  const totalRevenue = completedBookings.reduce((sum, b) => sum + b.amount, 0);
  const pendingRevenue = pendingBookings.reduce((sum, b) => sum + b.amount, 0);

  return (
    <DashboardLayout title="Booking Management">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Ticket className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <p className="text-xl font-bold">{bookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-xl font-bold">{pendingBookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <IndianRupee className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-xl font-bold">₹{totalRevenue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <CreditCard className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Amount</p>
                  <p className="text-xl font-bold">₹{pendingRevenue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-primary" />
              All Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="pending">
                  Pending Payments ({pendingBookings.length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({completedBookings.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                <DataTable
                  data={pendingBookings}
                  columns={pendingColumns}
                  searchKey="citizenName"
                  searchPlaceholder="Search by user name..."
                  emptyMessage="No pending payments"
                />
              </TabsContent>

              <TabsContent value="completed">
                <DataTable
                  data={completedBookings}
                  columns={completedColumns}
                  searchKey="citizenName"
                  searchPlaceholder="Search by user name..."
                  emptyMessage="No completed bookings"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminBookings;
