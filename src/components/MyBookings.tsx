import React, { useEffect, useState } from "react";
import { listenUserBookings } from "@/services/bookingService";
import { useAuth } from "@/contexts/AuthContext";

const MyBookings: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = listenUserBookings(user.uid, setBookings);
    return () => unsub();
  }, [user?.uid]);

  if (!user?.uid) return null;

  return (
    <div className="mt-6 border rounded p-4 bg-card shadow">
      <h3 className="text-lg font-semibold mb-3">My Bookings</h3>

      {bookings.length === 0 ? (
        <p className="text-sm text-muted-foreground">No bookings yet</p>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Zone</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Payment</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b">
                <td className="p-2">{b.zoneName || b.zoneId}</td>
                <td className="p-2">₹{b.amount}</td>
                <td className="p-2 capitalize">
                  {b.paymentStatus === "paid" ? (
                    <span className="text-green-600">Paid</span>
                  ) : (
                    <span className="text-orange-500">Pending</span>
                  )}
                </td>
                <td className="p-2 capitalize">{b.status}</td>
                <td className="p-2 text-muted-foreground">
                  {b.createdAt?.toDate?.().toLocaleString() || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyBookings;
