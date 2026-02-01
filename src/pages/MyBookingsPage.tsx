import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import PaymentStatusBadge from '@/components/PaymentStatusBadge';
import { DataTable } from '@/components/ui/data-table';
import { useAuth } from '@/contexts/AuthContext';
import { listenUserBookings, BookingData } from '@/services/bookingService';
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

const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const unsub = listenUserBookings(user.uid, (data) => {
      setBookings(data);
      setLoading(false);
    });

    return () => unsub();
  }, [user?.uid]);

  const activeBookings = bookings.filter(b => 
    b.status === 'active' || b.status === 'reserved'
  );
  const completedBookings = bookings.filter(b => 
    b.status === 'completed' || b.status === 'cancelled' || b.status === 'expired'
  );

  const getStatusBadge = (status: string) => {
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

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    if (timestamp.toDate) {
      return format(timestamp.toDate(), 'MMM d, yyyy');
    }
    if (timestamp instanceof Date) {
      return format(timestamp, 'MMM d, yyyy');
    }
    if (typeof timestamp === 'string') {
      return format(new Date(timestamp), 'MMM d, yyyy');
    }
    return 'N/A';
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    if (timestamp.toDate) {
      return format(timestamp.toDate(), 'h:mm a');
    }
    if (timestamp instanceof Date) {
      return format(timestamp, 'h:mm a');
    }
    if (typeof timestamp === 'string') {
      return format(new Date(timestamp), 'h:mm a');
    }
    return '';
  };

  const columns = [
    {
      key: 'zoneName',
      label: 'Zone',
      sortable: true,
      render: (booking: BookingData) => (
        <div>
          <p className="font-medium text-foreground">{booking.zoneName}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {booking.zoneId}
          </p>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (booking: BookingData) => (
        <div className="text-sm">
          <p className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-muted-foreground" />
            {formatDate(booking.createdAt)}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatTime(booking.createdAt)}
          </p>
        </div>
      ),
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (booking: BookingData) => (
        <span className="text-sm">{booking.duration}h</span>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (booking: BookingData) => (
        <span className="font-semibold text-primary flex items-center gap-1">
          <IndianRupee className="w-3 h-3" />
          {booking.amount}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (booking: BookingData) => getStatusBadge(booking.status),
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      render: (booking: BookingData) => (
        <PaymentStatusBadge status={booking.paymentStatus} size="sm" />
      ),
    },
  ];

  if (loading) {
    return (
      <DashboardLayout title="My Bookings">
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

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
                    ₹{bookings.reduce((sum, b) => sum + (b.amount || 0), 0)}
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
            {bookings.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Ticket className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No bookings yet</p>
                <p className="text-sm">Your booking history will appear here</p>
              </div>
            ) : (
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
            )}
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default MyBookingsPage;
