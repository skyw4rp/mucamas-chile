import type { AdminBookingsError } from "@/lib/admin/booking-map";
import type { BookingStatus } from "@/lib/admin/booking-status";

export type BookingStatsByStatus = Record<BookingStatus, number>;

export type AdminBookingStatsDto = {
  total: number;
  byStatus: BookingStatsByStatus;
  /** Reservas con created_at dentro del día civil actual en America/Santiago. */
  createdToday: number;
  /** Reservas con created_at en los últimos 7 días (ventana móvil desde ahora). */
  createdLast7Days: number;
};

export type AdminBookingStatsSuccess = {
  ok: true;
  stats: AdminBookingStatsDto;
};

export type AdminBookingStatsResponse = AdminBookingStatsSuccess | AdminBookingsError;
