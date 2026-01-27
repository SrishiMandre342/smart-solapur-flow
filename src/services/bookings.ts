// src/services/bookings.ts

import { db } from "@/firebase/firebase";
import { collection, getDocs, addDoc, doc, updateDoc, Timestamp } from "firebase/firestore";

export async function fetchBookings() {
  const ref = collection(db, "bookings");
  const snap = await getDocs(ref);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as any[];
}

export async function createBooking(data: any) {
  const ref = collection(db, "bookings");
  await addDoc(ref, {
    ...data,
    time: Timestamp.now(),
    paymentStatus: "pending",
  });
}

export async function markBookingPaid(bookingId: string) {
  const ref = doc(db, "bookings", bookingId);
  await updateDoc(ref, {
    paymentStatus: "paid",
  });
}
