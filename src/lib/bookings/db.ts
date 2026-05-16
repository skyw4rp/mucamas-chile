import type { BookingPayload } from "./types";

/** Fila para insert en tabla `bookings` (nombres de columna en snake_case). */
export type BookingInsertRow = {
  service_type: string;
  booking_date: string | null;
  booking_time: string | null;
  comuna: string;
  address: string;
  duration: string;
  full_name: string;
  phone: string;
  email: string;
  comments: string;
};

export function mapBookingPayloadToRow(payload: BookingPayload): BookingInsertRow {
  return {
    service_type: payload.serviceType,
    booking_date: payload.date ? payload.date : null,
    booking_time: payload.time ? payload.time : null,
    comuna: payload.comuna,
    address: payload.address,
    duration: payload.duration,
    full_name: payload.fullName,
    phone: payload.phone,
    email: payload.email,
    comments: payload.comments,
  };
}
