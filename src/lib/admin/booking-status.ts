export const BOOKING_STATUSES = ["new", "confirmed", "in_progress", "completed", "cancelled"] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export function isBookingStatus(value: string): value is BookingStatus {
  return (BOOKING_STATUSES as readonly string[]).includes(value);
}

/** Solo valores permitidos; `null` si falta o es desconocido en DB. */
export function parseBookingStatus(raw: string | null | undefined): BookingStatus | null {
  if (raw == null || raw === "") return null;
  const t = raw.trim();
  return isBookingStatus(t) ? t : null;
}

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  new: "Nueva",
  confirmed: "Confirmada",
  in_progress: "En curso",
  completed: "Completada",
  cancelled: "Cancelada",
};
