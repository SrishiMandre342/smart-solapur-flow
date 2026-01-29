import React, { useEffect, useState } from "react";
import { markPaid, markCompleted, listenBookings } from "@/services/bookingService";
import { listenParkingZones } from "@/services/zoneService";

interface Booking {
  id: string;
  userId: string;
  zoneId: string;
  amount: number;
  status: "pending" | "completed";
  paymentStatus: "pending" | "paid";
  createdAt?: any;
}

interface Zone {
  id: string;
  name: string;
}

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [zones, setZones] = useState<Record<string, Zone>>({});

  // Listen bookings in real-time
  useEffect(() => {
    const unsub = listenBookings((data) => setBookings(data));
    return () => unsub();
  }, []);

  // Listen zones to resolve zone names
  useEffect(() => {
    const unsub = listenParkingZones((list) => {
      const map: Record<string, Zone> = {};
      list.forEach((z) => (map[z.id] = z));
      setZones(map);
    });
    return () => unsub();
  }, []);

  const handleMarkPaid = async (id: string) => {
    await markPaid(id);
  };

  const handleMarkCompleted = async (booking: Booking) => {
    await markCompleted(booking.id, booking.zoneId);
  };

  return (
    <div className="bg-card border rounded-md p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Bookings</h2>

      {bookings.length === 0 ? (
        <p className="text-sm text-muted-foreground">No bookings found</p>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Zone</th>
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Payment</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b">
                <td className="p-2">{zones[b.zoneId]?.name || b.zoneId}</td>
                <td className="p-2">{b.userId}</td>
                <td className="p-2">₹{b.amount}</td>
                <td className="p-2">
                  {b.paymentStatus === "pending" ? (
                    <span className="text-orange-500">Pending</span>
                  ) : (
                    <span className="text-green-600">Paid</span>
                  )}
                </td>
                <td className="p-2 capitalize">{b.status}</td>
                <td className="p-2">
                  {b.paymentStatus === "pending" && (
                    <button
                      className="px-3 py-1 bg-amber-500 text-white rounded mr-2"
                      onClick={() => handleMarkPaid(b.id)}
                    >
                      Mark Paid
                    </button>
                  )}

                  {b.paymentStatus === "paid" && b.status !== "completed" && (
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                      onClick={() => handleMarkCompleted(b)}
                    >
                      Complete
                    </button>
                  )}

                  {b.status === "completed" && (
                    <span className="text-green-600 font-medium">Done</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookingManagement;
