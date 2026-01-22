import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Booking } from '@/data/bookings';
import { Ticket, Clock, CheckCircle, XCircle, User } from 'lucide-react';
import { format } from 'date-fns';

interface BookingManagementProps {
  bookings: Booking[];
}

const BookingManagement: React.FC<BookingManagementProps> = ({ bookings }) => {
  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmed
          </Badge>
        );
      case 'expired':
        return (
          <Badge variant="secondary" className="text-muted-foreground">
            <Clock className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
    }
  };

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    expired: bookings.filter((b) => b.status === 'expired').length,
    totalRevenue: bookings
      .filter((b) => b.status !== 'cancelled')
      .reduce((sum, b) => sum + b.amount, 0),
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-success">{stats.confirmed}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-muted-foreground">{stats.expired}</p>
              <p className="text-sm text-muted-foreground">Expired</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                ₹{stats.totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Revenue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-primary" />
            Recent Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[350px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Citizen</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Ward</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-center">Duration</TableHead>
                  <TableHead className="text-center">Amount</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-mono text-xs">
                      {booking.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{booking.citizenName}</p>
                          <p className="text-xs text-muted-foreground">
                            {booking.citizenEmail}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {booking.zoneName}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {booking.wardName}
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(booking.time), 'MMM d, h:mm a')}
                    </TableCell>
                    <TableCell className="text-center">
                      {booking.duration}h
                    </TableCell>
                    <TableCell className="text-center font-medium text-primary">
                      ₹{booking.amount}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(booking.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingManagement;
