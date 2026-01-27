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
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { format } from 'date-fns';

// Mock booking data
const mockBookings: Booking[] = [
  {
    id: 'BK001',
    zoneId: 'pz-1',
    zoneName: 'Sadar Main Parking',
    wardName: 'Sadar Bazaar',
    citizenEmail: 'user@example.com',
    citizenName: 'User',
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
    startTime: '2026-01-27T14:00:00',
    endTime: '2026-01-27T16:00:00',
    duration: 2,
    amount: 80,
    status: 'reserved',
    paymentStatus: 'pending',
    citizenEmail: 'user@example.com',
    citizenName: 'User',
  },
  {
    id: 'BK003',
    zoneId: 'pz-3',
    zoneName: 'Chowk Parking',
    wardName: 'Sadar Bazaar',
    startTime: '2026-01-26T10:00:00',
    endTime: '2026-01-26T12:00:00',
    duration: 2,
    amount: 70,
    status: 'completed',
    paymentStatus: 'paid',
    citizenEmail: 'user@example.com',
    citizenName: 'User',
  },
  {
    id: 'BK004',
    zoneId: 'pz-8',
    zoneName: 'Temple Parking',
    wardName: 'Siddheshwar Peth',
    startTime: '2026-01-25T08:00:00',
    endTime: '2026-01-25T10:00:00',
    duration: 2,
    amount: 40,
    status: 'completed',
    paymentStatus: 'paid',
    citizenEmail: 'user@example.com',
    citizenName: 'User',
  },
  {
    id: 'BK005',
    zoneId: 'pz-13',
    zoneName: 'Commercial Hub Parking',
    wardName: 'Murarji Peth',
    startTime: '2026-01-24T14:00:00',
    endTime: '2026-01-24T18:00:00',
    duration: 4,
    amount: 100,
    status: 'completed',
    paymentStatus: 'paid',
    citizenEmail: 'user@example.com',
    citizenName: 'User',
  },
];

const MyBookingsPage: React.FC = () => {
  const [bookings] = useState<Booking[]>(mockBookings);

  const activeBookings = bookings.filter(b => 
    b.status === 'active' || b.status === 'reserved'
  );
  const completedBookings = bookings.filter(b => 
    b.status === 'completed' || b.status === 'cancelled' || b.status === 'expired'
  );

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case 'reserved':
        return (
          <Badge className="bg-primary/10 text-primary border-primary/20">
            <Clock className="w-3 h-3 mr-1" />
            Reserved
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="secondary">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            <AlertCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      case 'expired':
        return (
          <Badge variant="outline" className="text-muted-foreground">
            <Clock className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        );
      default:
        return null;
    }
  };

  const columns = [
    {
      key: 'zoneName',
      label: 'Zone',
      sortable: true,
      render: (booking: Booking) => (
        <div>
          <p className="font-medium text-foreground">{booking.zoneName}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {booking.wardName}
          </p>
        </div>
      ),
    },
    {
      key: 'startTime',
      label: 'Time',
      sortable: true,
      render: (booking: Booking) => (
        <div className="text-sm">
          <p className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-muted-foreground" />
            {format(new Date(booking.startTime), 'MMM d, yyyy')}
          </p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
          </p>
        </div>
      ),
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (booking: Booking) => (
        <span className="text-sm">{booking.duration}h</span>
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
      key: 'status',
      label: 'Status',
      render: (booking: Booking) => getStatusBadge(booking.status),
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      render: (booking: Booking) => (
        <PaymentStatusBadge status={booking.paymentStatus} size="sm" />
      ),
    },
  ];

  return (
    <DashboardLayout title="My Bookings">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Ticket className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-xl font-bold">{bookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <Clock className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-xl font-bold">{activeBookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <CheckCircle className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-xl font-bold">{completedBookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <IndianRupee className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-xl font-bold">
                    ₹{bookings.reduce((sum, b) => sum + b.amount, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Table with Tabs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-primary" />
              Booking History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="active">
                  Active ({activeBookings.length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({completedBookings.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active">
                <DataTable
                  data={activeBookings}
                  columns={columns}
                  searchKey="zoneName"
                  searchPlaceholder="Search by zone name..."
                  emptyMessage="No active bookings"
                />
              </TabsContent>

              <TabsContent value="completed">
                <DataTable
                  data={completedBookings}
                  columns={columns}
                  searchKey="zoneName"
                  searchPlaceholder="Search by zone name..."
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

export default MyBookingsPage;
